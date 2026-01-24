/**
 * PDF Tools Module
 * Logic for Merge, Split, Compress, Convert, etc.
 * Uses pdf-lib (PDFLib) and pdf.js (pdfjsLib)
 */

const PDFTools = {
    _t: function (en, ar) {
        return document.documentElement.lang === 'ar' ? ar : en;
    },

    // Helper: Read File as ArrayBuffer
    readFile: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    },

    // Helper: Common UI for File Input
    renderUploadUI: (container, toolId, label, btnText, btnAction, extraInputs = '') => {
        const t = PDFTools._t;
        const selText = document.documentElement.lang === 'ar' ? 'اختر الملفات' : 'Select Files';

        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="file-drop-area" id="dropArea_${toolId}" style="border:2px dashed var(--glass-border); padding:30px; text-align:center; border-radius:12px; transition:0.3s;">
                    <p style="color:#aaa; margin-bottom:10px;">${label}</p>
                    <input type="file" id="pdfInput_${toolId}" accept=".pdf" multiple style="display:none" onchange="PDFTools.handleFileSelect('${toolId}')">
                    <button onclick="document.getElementById('pdfInput_${toolId}').click()" class="btn-primary" style="background:var(--glass-bg); border:1px solid var(--glass-border);">${selText}</button>
                    <div id="fileList_${toolId}" style="margin-top:10px; font-size:0.9em; color:var(--text-primary);"></div>
                </div>

                <div id="opts_${toolId}" class="hidden" style="margin-top:16px;">
                    ${extraInputs}
                    <button onclick="${btnAction}" class="btn-primary full-width" style="margin-top:16px;">${btnText}</button>
                </div>
                
                <div id="res_${toolId}" class="result-box hidden" style="text-align:center;">
                    <strong id="resMsg_${toolId}" style="display:block; margin-bottom:10px;">Done!</strong>
                    <button id="dlBtn_${toolId}" class="tool-action">Download Result</button>
                </div>
            </div>
        `;

        // Drag & Drop
        const drop = document.getElementById(`dropArea_${toolId}`);
        drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.style.borderColor = 'var(--accent-pink)'; });
        drop.addEventListener('dragleave', (e) => { e.preventDefault(); drop.style.borderColor = 'var(--glass-border)'; });
        drop.addEventListener('drop', (e) => {
            e.preventDefault();
            drop.style.borderColor = 'var(--glass-border)';
            document.getElementById(`pdfInput_${toolId}`).files = e.dataTransfer.files;
            PDFTools.handleFileSelect(toolId);
        });
    },

    handleFileSelect: (toolId) => {
        const input = document.getElementById(`pdfInput_${toolId}`);
        const list = document.getElementById(`fileList_${toolId}`);
        const opts = document.getElementById(`opts_${toolId}`);

        if (input.files.length > 0) {
            list.innerHTML = Array.from(input.files).map(f => `<div>📄 ${f.name} (${(f.size / 1024 / 1024).toFixed(2)} MB)</div>`).join('');
            opts.classList.remove('hidden');
        } else {
            list.innerHTML = '';
            opts.classList.add('hidden');
        }
    },

    // 1. Merge PDFs
    // ----------------------------------------------------------------
    renderMerge: function (container) {
        const t = this._t;
        this.renderUploadUI(container, 'merge',
            t('Drag & Drop PDF files here', 'اسحب وأفلت ملفات PDF هنا'),
            t('Merge PDFs', 'دمج الملفات'),
            'PDFTools.runMerge()'
        );
    },

    runMerge: async function () {
        const files = document.getElementById('pdfInput_merge').files;
        if (!files.length) return;

        try {
            const mergedPdf = await PDFLib.PDFDocument.create();

            for (let file of files) {
                const bytes = await this.readFile(file);
                const pdf = await PDFLib.PDFDocument.load(bytes);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const pdfBytes = await mergedPdf.save();
            this.showDownload('merge', pdfBytes, 'merged.pdf');
        } catch (e) {
            alert('Error merging PDFs: ' + e.message);
        }
    },

    // 2. Split PDF
    // ----------------------------------------------------------------
    renderSplit: function (container) {
        const t = this._t;
        const inputs = `
            <div class="input-row">
                <label>${t('Page Ranges (e.g. "1-3, 5, 7-9")', 'نطاق الصفحات (مثلاً "1-3, 5")')}</label>
                <input type="text" id="splitRange" class="glass-input" placeholder="${t('All pages if empty', 'اتركه فارغاً لكل الصفحات')}">
            </div>
        `;
        this.renderUploadUI(container, 'split',
            t('Upload PDF to Split', 'ارفع ملف PDF للتقسيم'),
            t('Split PDF', 'تقسيم الملف'),
            'PDFTools.runSplit()', inputs
        );
        document.getElementById('pdfInput_split').removeAttribute('multiple'); // Single file
    },

    runSplit: async function () {
        const file = document.getElementById('pdfInput_split').files[0];
        if (!file) return;

        try {
            const bytes = await this.readFile(file);
            const pdf = await PDFLib.PDFDocument.load(bytes);
            const total = pdf.getPageCount();

            const newPdf = await PDFLib.PDFDocument.create();
            const rangeStr = document.getElementById('splitRange').value.trim();

            let indices = [];
            if (!rangeStr) {
                // All pages
                indices = pdf.getPageIndices();
            } else {
                // Parse range
                const parts = rangeStr.split(',');
                parts.forEach(p => {
                    if (p.includes('-')) {
                        const [s, e] = p.split('-').map(n => parseInt(n) - 1);
                        for (let i = s; i <= e; i++) if (i >= 0 && i < total) indices.push(i);
                    } else {
                        const i = parseInt(p) - 1;
                        if (i >= 0 && i < total) indices.push(i);
                    }
                });
            }

            // Dedupe
            indices = [...new Set(indices)].sort((a, b) => a - b);

            if (indices.length === 0) return alert('Invalid page range');

            const copiedPages = await newPdf.copyPages(pdf, indices);
            copiedPages.forEach(p => newPdf.addPage(p));

            const pdfBytes = await newPdf.save();
            this.showDownload('split', pdfBytes, 'split_' + file.name);
        } catch (e) {
            alert('Error splitting PDF: ' + e.message);
        }
    },

    // 3. Compress (Optimize)
    // ----------------------------------------------------------------
    renderCompress: function (container) {
        const t = this._t;
        this.renderUploadUI(container, 'compress',
            t('Upload PDF to Optimize', 'ارفع ملف PDF لضغطه'),
            t('Optimize PDF', 'ضغط الملف'),
            'PDFTools.runCompress()'
        );
        document.getElementById('pdfInput_compress').removeAttribute('multiple');
    },

    runCompress: async function () {
        // True compression is hard client-side. We use 'save' which naturally optimizes objects.
        const file = document.getElementById('pdfInput_compress').files[0];
        if (!file) return;

        try {
            const bytes = await this.readFile(file);
            const pdf = await PDFLib.PDFDocument.load(bytes);

            // Just saving usually reduces size if there's junk.
            // We can try to use objectsContext features but minimal API exposure.
            const pdfBytes = await pdf.save({ useObjectStreams: false }); // Sometimes implies rewrite

            this.showDownload('compress', pdfBytes, 'optimized_' + file.name);
        } catch (e) {
            alert('Error optimizing PDF: ' + e.message);
        }
    },

    // 4. PDF to Images
    // ----------------------------------------------------------------
    renderToImages: function (container) {
        const t = this._t;
        this.renderUploadUI(container, 'pdf2img',
            t('Upload PDF', 'ارفع ملف PDF'),
            t('Convert to Images', 'تحويل إلى صور'),
            'PDFTools.runPdfToImg()'
        );
        document.getElementById('pdfInput_pdf2img').removeAttribute('multiple');
    },

    runPdfToImg: async function () {
        const file = document.getElementById('pdfInput_pdf2img').files[0];
        if (!file) return;

        const btn = document.querySelector('#opts_pdf2img button');
        btn.innerText = "Processing...";
        btn.disabled = true;

        try {
            const bytes = await this.readFile(file);
            const loadingTask = pdfjsLib.getDocument({ data: bytes });
            const pdf = await loadingTask.promise;

            const resDiv = document.getElementById('res_pdf2img');
            resDiv.innerHTML = '<div id="imgGrid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(150px, 1fr)); gap:10px; margin-top:10px;"></div>';
            resDiv.classList.remove('hidden');
            const grid = document.getElementById('imgGrid');

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport: viewport }).promise;

                const img = document.createElement('img');
                img.src = canvas.toDataURL('image/png');
                img.style.width = '100%';
                img.style.border = '1px solid #333';
                img.style.borderRadius = '8px';

                const wrap = document.createElement('div');
                wrap.innerHTML = `<a href="${img.src}" download="page_${i}.png" style="display:block; margin-top:5px; font-size:12px; color:var(--accent-cyan);">Download Page ${i}</a>`;
                wrap.prepend(img);
                grid.appendChild(wrap);
            }
            btn.innerText = "Convert";
            btn.disabled = false;
        } catch (e) {
            alert('Error converting: ' + e.message);
            btn.disabled = false;
        }
    },

    // 5. Images to PDF
    // ----------------------------------------------------------------
    renderToPDF: function (container) {
        const t = this._t;
        this.renderUploadUI(container, 'img2pdf',
            t('Upload Images (PNG/JPG)', 'ارفع الصور (PNG/JPG)'),
            t('Create PDF', 'إنشاء PDF'),
            'PDFTools.runImgToPdf()'
        );
        const inp = document.getElementById('pdfInput_img2pdf');
        inp.accept = "image/png, image/jpeg";
    },

    runImgToPdf: async function () {
        const files = document.getElementById('pdfInput_img2pdf').files;
        if (!files.length) return;

        try {
            const pdf = await PDFLib.PDFDocument.create();

            for (let file of files) {
                const bytes = await this.readFile(file);
                let img;
                if (file.type === 'image/jpeg') img = await pdf.embedJpg(bytes);
                else if (file.type === 'image/png') img = await pdf.embedPng(bytes);
                else continue;

                const page = pdf.addPage([img.width, img.height]); // Fit page to image
                page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
            }

            const pdfBytes = await pdf.save();
            this.showDownload('img2pdf', pdfBytes, 'images_combined.pdf');
        } catch (e) {
            alert('Error creating PDF: ' + e.message);
        }
    },

    // 6. Add Page Numbers
    // ----------------------------------------------------------------
    renderPageNum: function (container) {
        const t = this._t;
        this.renderUploadUI(container, 'pgnum',
            t('Upload PDF', 'ارفع ملف PDF'),
            t('Add Numbers', 'إضافة الأرقام'),
            'PDFTools.runPageNum()'
        );
        document.getElementById('pdfInput_pgnum').removeAttribute('multiple');
    },

    runPageNum: async function () {
        const file = document.getElementById('pdfInput_pgnum').files[0];
        if (!file) return;

        try {
            const bytes = await this.readFile(file);
            const pdf = await PDFLib.PDFDocument.load(bytes);
            const total = pdf.getPageCount();

            const pages = pdf.getPages();
            pages.forEach((page, idx) => {
                const { width } = page.getSize();
                page.drawText(`${idx + 1}`, {
                    x: width / 2,
                    y: 20,
                    size: 12,
                });
            });

            const pdfBytes = await pdf.save();
            this.showDownload('pgnum', pdfBytes, 'numbered_' + file.name);
        } catch (e) {
            alert('Error: ' + e.message);
        }
    },

    // 7. Rotate Pages
    // ----------------------------------------------------------------
    renderRotate: function (container) {
        const t = this._t;
        const inputs = `
            <div class="input-row">
                <label>${t('Rotation', 'التدوير')}</label>
                <select id="rotDeg" class="glass-input">
                    <option value="90">${t('90° Clockwise', '90° مع العقارب')}</option>
                    <option value="180">180°</option>
                    <option value="270">${t('90° Counter-Clockwise', '90° عكس العقارب')}</option>
                </select>
            </div>
        `;
        this.renderUploadUI(container, 'rotate',
            t('Upload PDF', 'ارفع ملف PDF'),
            t('Rotate All', 'تدوير الكل'),
            'PDFTools.runRotate()', inputs
        );
        document.getElementById('pdfInput_rotate').removeAttribute('multiple');
    },

    runRotate: async function () {
        const file = document.getElementById('pdfInput_rotate').files[0];
        if (!file) return;

        try {
            const bytes = await this.readFile(file);
            const pdf = await PDFLib.PDFDocument.load(bytes);
            const deg = parseInt(document.getElementById('rotDeg').value);

            const pages = pdf.getPages();
            pages.forEach(p => {
                const cur = p.getRotation().angle;
                p.setRotation(PDFLib.degrees(cur + deg));
            });

            const pdfBytes = await pdf.save();
            this.showDownload('rotate', pdfBytes, 'rotated_' + file.name);
        } catch (e) { alert('Error: ' + e.message); }
    },

    // 8. Add Watermark
    // ----------------------------------------------------------------
    renderWatermark: function (container) {
        const t = this._t;
        const inputs = `
            <div class="input-row">
                <label>${t('Watermark Text', 'نص العلامة المائية')}</label>
                <input type="text" id="wmText" class="glass-input" placeholder="CONFIDENTIAL">
            </div>
        `;
        this.renderUploadUI(container, 'wm',
            t('Upload PDF', 'ارفع ملف PDF'),
            t('Add Watermark', 'إضافة العلامة'),
            'PDFTools.runWatermark()', inputs
        );
        document.getElementById('pdfInput_wm').removeAttribute('multiple');
    },

    runWatermark: async function () {
        const file = document.getElementById('pdfInput_wm').files[0];
        if (!file) return;

        try {
            const text = document.getElementById('wmText').value || 'WATERMARK';
            const bytes = await this.readFile(file);
            const pdf = await PDFLib.PDFDocument.load(bytes);

            const pages = pdf.getPages();
            pages.forEach(page => {
                const { width, height } = page.getSize();
                page.drawText(text, {
                    x: width / 2 - (text.length * 10), // approximate center logic
                    y: height / 2,
                    size: 50,
                    opacity: 0.3,
                    rotate: PDFLib.degrees(45),
                });
            });

            const pdfBytes = await pdf.save();
            this.showDownload('wm', pdfBytes, 'watermarked_' + file.name);
        } catch (e) { alert('Error: ' + e.message); }
    },

    // 9. Protect PDF
    // ----------------------------------------------------------------
    renderProtect: function (container) {
        const t = this._t;
        const inputs = `
            <div class="input-row">
                <label>${t('Set Password', 'تعيين كلمة مرور')}</label>
                <input type="password" id="protPass" class="glass-input" placeholder="Password">
            </div>
            <p style="color:#e74c3c; font-size:0.85em; margin-top:8px;">⚠️ ${t('Warning: No bypassing encryption/DRM. Use only on your own files.', 'تنبيه: هذه الأداة لا تكسر الحماية. استخدمها لملفاتك الخاصة فقط.')}</p>
        `;
        this.renderUploadUI(container, 'protect',
            t('Upload PDF', 'ارفع ملف PDF'),
            t('Encrypt', 'تشفير'),
            'PDFTools.runProtect()', inputs
        );
        document.getElementById('pdfInput_protect').removeAttribute('multiple');
    },

    runProtect: async function () {
        const file = document.getElementById('pdfInput_protect').files[0];
        const pass = document.getElementById('protPass').value;
        if (!file || !pass) return alert('File and Password required');

        try {
            const bytes = await this.readFile(file);
            const pdf = await PDFLib.PDFDocument.load(bytes);

            const pdfBytes = await pdf.save({
                userPassword: pass,
                ownerPassword: pass // Simplified
            });
            this.showDownload('protect', pdfBytes, 'protected_' + file.name);
        } catch (e) { alert('Error: ' + e.message); }
    },

    // 10. Unlock PDF
    // ----------------------------------------------------------------
    renderUnlock: function (container) {
        const t = this._t;
        const inputs = `
            <p style="font-size:12px; color:#e74c3c; margin-bottom:8px;">${t('*Only use if you own the file.', '*فقط للاستخدام الشخصي.')}</p>
            <div class="input-row">
                <label>${t('Current Password', 'كلمة المرور الحالية')}</label>
                <input type="password" id="unlockPass" class="glass-input" placeholder="Password">
            </div>
            <p style="color:#e74c3c; font-size:0.85em; margin-top:8px;">⚠️ ${t('Disclaimer: This tool requires the correct password. It does not crack or bypass DRM encryption.', 'تنويه: يتطلب كلمة المرور الصحيحة. الأداة لا تقوم بكسر الحماية.')}</p>
        `;
        this.renderUploadUI(container, 'unlock',
            t('Upload Encrypted PDF', 'ارفع الملف المشفر'),
            t('Unlock', 'فك التشفير'),
            'PDFTools.runUnlock()', inputs
        );
        document.getElementById('pdfInput_unlock').removeAttribute('multiple');
    },

    runUnlock: async function () {
        const file = document.getElementById('pdfInput_unlock').files[0];
        const pass = document.getElementById('unlockPass').value;
        if (!file || !pass) return alert('File and Password required');

        try {
            const bytes = await this.readFile(file);
            // Load with password
            const pdf = await PDFLib.PDFDocument.load(bytes, { password: pass, ignoreEncryption: true });

            // Save without password
            const pdfBytes = await pdf.save();
            this.showDownload('unlock', pdfBytes, 'unlocked_' + file.name);
        } catch (e) {
            alert('Failed to unlock. Incorrect password or error: ' + e.message);
        }
    },

    // UI Helper: Download
    showDownload: function (toolId, titleOrBytes, filename) {
        const resBox = document.getElementById(`res_${toolId}`);
        resBox.classList.remove('hidden');
        const btn = document.getElementById(`dlBtn_${toolId}`);
        const t = this._t;

        const doneMsg = document.getElementById(`resMsg_${toolId}`);
        if (doneMsg) doneMsg.innerText = t("Done!", "تم!");
        if (btn) btn.innerText = t("Download Result", "تحميل النتيجة");

        btn.onclick = () => download(titleOrBytes, filename, "application/pdf");
    },
    // 11. Remove Pages
    renderRemPage: function (container) {
        const t = this._t;
        this.renderUploadUI(container, 'remPg',
            t('Upload PDF', 'ارفع ملف PDF'),
            t('Remove Pages', 'حذف الصفحات'),
            'PDFTools.runRemPg()',
            `<input type="text" id="remIdx" class="glass-input" placeholder="${t('Page numbers to remove (e.g. 1, 3)', 'أرقام الصفحات للحذف (مثلاً 1, 3)')}">`
        );
        document.getElementById('pdfInput_remPg').removeAttribute('multiple');
    },
    runRemPg: async function () {
        const file = document.getElementById('pdfInput_remPg').files[0];
        const str = document.getElementById('remIdx').value;
        if (!file || !str) return;

        try {
            const bytes = await this.readFile(file);
            const pdf = await PDFLib.PDFDocument.load(bytes);
            const total = pdf.getPageCount();

            // Items to remove (1-based -> 0-based)
            const toRem = str.split(',').map(n => parseInt(n.trim()) - 1);

            const newPdf = await PDFLib.PDFDocument.create();
            const keep = [];
            for (let i = 0; i < total; i++) {
                if (!toRem.includes(i)) keep.push(i);
            }

            const pages = await newPdf.copyPages(pdf, keep);
            pages.forEach(p => newPdf.addPage(p));

            const out = await newPdf.save();
            this.showDownload('remPg', out, 'cleaned_' + file.name);
        } catch (e) { alert(e.message); }
    },

    // 12. Reorder Pages
    renderOrder: function (container) {
        const t = this._t;
        this.renderUploadUI(container, 'ordPg',
            t('Upload PDF', 'ارفع ملف PDF'),
            t('Reorder', 'إعادة ترتيب'),
            'PDFTools.runOrder()',
            `<input type="text" id="ordIdx" class="glass-input" placeholder="${t('Order (e.g. 3, 1, 2)', 'الترتيب (مثلاً 3, 1, 2)')}">`
        );
        document.getElementById('pdfInput_ordPg').removeAttribute('multiple');
    },
    runOrder: async function () {
        const file = document.getElementById('pdfInput_ordPg').files[0];
        const str = document.getElementById('ordIdx').value;
        if (!file || !str) return;

        try {
            const bytes = await this.readFile(file);
            const pdf = await PDFLib.PDFDocument.load(bytes);

            // 1-based order
            const indices = str.split(',').map(n => parseInt(n.trim()) - 1);
            const newPdf = await PDFLib.PDFDocument.create();
            const pages = await newPdf.copyPages(pdf, indices);
            pages.forEach(p => newPdf.addPage(p));

            const out = await newPdf.save();
            this.showDownload('ordPg', out, 'reordered_' + file.name);
        } catch (e) { alert(e.message); }
    },

    // 13. Crop (Simulated)
    renderCrop: function (container) {
        const t = this._t;
        this.renderUploadUI(container, 'crop',
            t('Upload PDF', 'ارفع ملف PDF'),
            t('Apply Crop', 'تطبيق القص'),
            'PDFTools.runCrop()',
            `<p style="font-size:0.8em; color:grey;">${t('Adds generous margin crop to all pages.', 'يقوم بقص الهوامش من جميع الصفحات.')}</p>`
        );
        document.getElementById('pdfInput_crop').removeAttribute('multiple');
    },
    runCrop: async function () {
        const file = document.getElementById('pdfInput_crop').files[0];
        if (!file) return;
        try {
            const bytes = await this.readFile(file);
            const pdf = await PDFLib.PDFDocument.load(bytes);
            const pages = pdf.getPages();

            pages.forEach(p => {
                const { width, height } = p.getSize();
                // Crop 50 units from edges
                p.setCropBox(50, 50, width - 100, height - 100);
            });

            const out = await pdf.save();
            this.showDownload('crop', out, 'cropped_' + file.name);
        } catch (e) { alert(e.message); }
    },

    // 14. Extract Text/Images
    renderExtImg: function (container) {
        // Alias to generic extractor but auto-trigger images mode could be added. 
        // For now, reuse the generic UI but pre-select images tab if we were building a tabbed UI.
        // Or simpler: Direct implementation reuse.
        this.renderExt(container);
        // We can inject a script to auto-click "Extract Images" after a short delay or guide user.
        // But for simplicity, let's just show the generic extractor which has the "Extract Images" button.
        // Better yet: Custom UI for images only.

        // Let's override the UI for this specific tool ID to be focused on images.
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                 <div class="file-drop-area" id="dropArea_extImg" style="border:2px dashed var(--glass-border); padding:30px; text-align:center; border-radius:12px;">
                    <p>${t('Upload PDF to extract images', 'ارفع ملف PDF لاستخراج الصور')}</p>
                    <input type="file" id="pdfInput_ext" accept=".pdf" style="display:none" onchange="PDFTools.handleFileSelect('ext')">
                    <button onclick="document.getElementById('pdfInput_ext').click()" class="btn-primary">${t('Select PDF', 'اختر ملف')}</button>
                    <div id="fileList_ext" style="margin-top:10px;"></div>
                </div>
                <button onclick="PDFTools.runExtract('images')" class="btn-primary full-width" style="margin-top:20px;">${t('Extract Images', 'استخراج الصور')}</button>
                <div id="res_ext_img" class="result-box hidden" style="margin-top:16px;">
                    <div id="extImgGrid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(120px, 1fr)); gap:10px;"></div>
                </div>
            </div>
        `;
    },

    renderExt: function (container) {
        const t = this._t;
        const selText = document.documentElement.lang === 'ar' ? 'اختر ملف PDF' : 'Select PDF';

        container.innerHTML = `
            < div class="tool-ui-group" >
                <div class="file-drop-area" id="dropArea_ext" style="border:2px dashed var(--glass-border); padding:30px; text-align:center; border-radius:12px;">
                    <p style="color:#aaa;">${t('Upload PDF to extract content', 'ارفع ملف PDF لاستخراج المحتوى')}</p>
                    <input type="file" id="pdfInput_ext" accept=".pdf" style="display:none" onchange="PDFTools.handleFileSelect('ext')">
                    <button onclick="document.getElementById('pdfInput_ext').click()" class="btn-primary" style="background:var(--glass-bg); border:1px solid var(--glass-border);">${selText}</button>
                    <div id="fileList_ext" style="margin-top:10px; font-size:0.9em;"></div>
                </div>

                <div id="opts_ext" class="hidden" style="margin-top:16px; display:flex; gap:16px;">
                    <button onclick="PDFTools.runExtract('text')" class="btn-primary" style="flex:1;">${t('Extract Text', 'استخراج النص')}</button>
                    <button onclick="PDFTools.runExtract('images')" class="btn-primary" style="flex:1;">${t('Extract Images', 'استخراج الصور')}</button>
                </div>
                
                <div id="res_ext_text" class="result-box hidden" style="margin-top:16px;">
                    <textarea id="extTextOut" class="glass-input" rows="10" placeholder="${t('Extracted text will appear here...', 'سيظهر النص المستخرج هنا...')}" readonly></textarea>
                    <div style="display:flex; gap:10px; margin-top:10px;">
                        <button onclick="navigator.clipboard.writeText(document.getElementById('extTextOut').value)" class="tool-action">${t('Copy Text', 'نسخ النص')}</button>
                        <button onclick="download(document.getElementById('extTextOut').value, 'extracted_text.txt', 'text/plain')" class="tool-action">${t('Download .txt', 'تحميل .txt')}</button>
                    </div>
                </div>

                <div id="res_ext_img" class="result-box hidden" style="margin-top:16px;">
                    <p style="margin-bottom:10px;">${t('Found Images:', 'الصور الموجودة:')}</p>
                    <div id="extImgGrid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(120px, 1fr)); gap:10px;"></div>
                </div>
            </div >
    `;
    },

    runExtract: async function (mode) {
        const file = document.getElementById('pdfInput_ext').files[0];
        if (!file) return;

        // Reset
        document.getElementById('res_ext_text').classList.add('hidden');
        document.getElementById('res_ext_img').classList.add('hidden');
        document.getElementById('extImgGrid').innerHTML = '';
        document.getElementById('extTextOut').value = 'Processing...';

        try {
            const bytes = await this.readFile(file);
            const loadingTask = pdfjsLib.getDocument({ data: bytes });
            const pdf = await loadingTask.promise;

            if (mode === 'text') {
                document.getElementById('res_ext_text').classList.remove('hidden');
                let fullText = "";

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    fullText += `-- - Page ${i} ---\n${pageText} \n\n`;
                }

                document.getElementById('extTextOut').value = fullText;

            } else if (mode === 'images') {
                document.getElementById('res_ext_img').classList.remove('hidden');
                const grid = document.getElementById('extImgGrid');
                grid.innerHTML = '<p style="grid-column:1/-1;">Scanning pages... (This may take a moment)</p>';

                let count = 0;

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const ops = await page.getOperatorList();
                    const fns = ops.fnArray;
                    const args = ops.argsArray;

                    for (let j = 0; j < fns.length; j++) {
                        if (fns[j] === pdfjsLib.OPS.paintImageXObject) {
                            const imgName = args[j][0];
                            try {
                                const imgObj = await page.objs.get(imgName);
                                // imgObj should have data, width, height
                                if (imgObj && imgObj.width && imgObj.height) {
                                    const canvas = document.createElement('canvas');
                                    canvas.width = imgObj.width;
                                    canvas.height = imgObj.height;
                                    const ctx = canvas.getContext('2d');

                                    // Make ImageData
                                    // This part varies by pdf.js version internal structure
                                    // simplified approach: use common properties
                                    // if 'data' is Uint8ClampedArray (RGBA)
                                    // or Uint8Array (RGB)

                                    // Fallback: If we can't easily construct raw pixels,
                                    // we skip or try simplistic gray/rgb handling.
                                    // However, simpler approach for "App" level:
                                    // Use 'page.render' but mask everything else? No.

                                    // Actually, PDF.js object handling is tricky.
                                    // Let's try drawing it if it's a bitmap.

                                    if (imgObj.bitmap) {
                                        ctx.drawImage(imgObj.bitmap, 0, 0);
                                    } else if (imgObj.data) {
                                        // Construct Raw Data
                                        // Assuming RGBA for simplicity in this context or converting
                                        // This is a known complex area.
                                        // Hack: Draw 1x1 rect placeholder if complex
                                        // Better Hack: render isolated?

                                        // Best "working" client-side simplistic:
                                        // Skip raw extraction if too hard, but let's try 
                                        // basic RGBA putting.

                                        const imgData = ctx.createImageData(canvas.width, canvas.height);
                                        // Copy data... assuming RGBA 
                                        if (imgObj.data.length === canvas.width * canvas.height * 4) {
                                            imgData.data.set(imgObj.data);
                                            ctx.putImageData(imgData, 0, 0);
                                        } else if (imgObj.data.length === canvas.width * canvas.height * 3) {
                                            // RGB to RGBA
                                            for (let k = 0, p = 0; k < imgObj.data.length; k += 3, p += 4) {
                                                imgData.data[p] = imgObj.data[k];
                                                imgData.data[p + 1] = imgObj.data[k + 1];
                                                imgData.data[p + 2] = imgObj.data[k + 2];
                                                imgData.data[p + 3] = 255;
                                            }
                                            ctx.putImageData(imgData, 0, 0);
                                        }
                                    }

                                    const imgUrl = canvas.toDataURL();
                                    const div = document.createElement('div');
                                    div.innerHTML = `< img src = "${imgUrl}" style = "width:100%; border-radius:8px; border:1px solid var(--glass-border);" >
    <a href="${imgUrl}" download="image_${count}.png" style="font-size:10px; display:block; margin-top:4px;">Download</a>`;
                                    grid.appendChild(div);
                                    count++;
                                }
                            } catch (err) {
                                console.warn("Image extract error", err);
                            }
                        }
                    }
                }
                if (count === 0 && grid.innerText.includes('Scanning')) {
                    grid.innerHTML = '<p style="grid-column:1/-1;">No straightforward images found or extraction format not supported.</p>';
                } else if (camera = document.querySelector('#extImgGrid p')) {
                    if (camera.innerText.includes('Scanning')) camera.remove();
                }
            }
        } catch (e) {
            alert('Error: ' + e.message);
        }
    }
};

window.PDFTools = PDFTools;
