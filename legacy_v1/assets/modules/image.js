/**
 * Image Tools Module
 * Client-side image manipulation using Canvas and File API.
 */

const ImageTools = {
    _t: function (en, ar) {
        return document.documentElement.lang === 'ar' ? ar : en;
    },

    // Helper: Read file as DataURL
    readImage: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    // Helper: Common UI
    renderUploadUI: (container, toolId, label, btnText, btnAction, extraOpts = '') => {
        const t = ImageTools._t;
        const selText = document.documentElement.lang === 'ar' ? 'اختر صورة' : 'Select Image';

        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="file-drop-area" id="dropArea_${toolId}" style="border:2px dashed var(--glass-border); padding:30px; text-align:center; border-radius:12px; transition:0.3s;">
                    <p style="color:var(--text-secondary); margin-bottom:10px;">${label}</p>
                    <input type="file" id="imgInput_${toolId}" accept="image/*" style="display:none" onchange="ImageTools.handleFile('${toolId}')">
                    <button onclick="document.getElementById('imgInput_${toolId}').click()" class="btn-primary" style="background:var(--glass-bg); border:1px solid var(--glass-border);">${selText}</button>
                    <div id="fileInfo_${toolId}" style="margin-top:10px; font-size:0.9em; color:var(--text-primary);"></div>
                </div>
                
                <div id="opts_${toolId}" class="hidden" style="margin-top:16px;">
                    ${extraOpts}
                    <button id="actBtn_${toolId}" onclick="${btnAction}" class="btn-primary full-width" style="margin-top:16px;">${btnText}</button>
                </div>

                <div id="res_${toolId}" class="result-box hidden" style="text-align:center;">
                    <div id="resContent_${toolId}" style="margin-bottom:10px; max-width:100%; overflow:hidden;"></div>
                    <a id="dlLink_${toolId}" class="btn-primary" style="display:inline-block; text-decoration:none;">Download</a>
                </div>
            </div>
        `;
    },

    handleFile: (toolId) => {
        const input = document.getElementById(`imgInput_${toolId}`);
        const info = document.getElementById(`fileInfo_${toolId}`);
        const opts = document.getElementById(`opts_${toolId}`);
        if (input.files.length > 0) {
            info.innerText = `Selected: ${input.files[0].name} (${(input.files[0].size / 1024).toFixed(1)} KB)`;
            opts.classList.remove('hidden');
        }
    },

    // 1. Image Compressor
    renderCompress: function (container) {
        const t = this._t;
        const opts = `
            <label>${t('Quality (0.1 - 1.0)', 'الجودة (0.1 - 1.0)')}</label>
            <input type="range" id="compQual" min="0.1" max="1.0" step="0.1" value="0.7" class="glass-input" oninput="this.nextElementSibling.innerText = this.value">
            <span>0.7</span>
        `;
        this.renderUploadUI(container, 'compress',
            t('Upload Image (JPG/PNG)', 'ارفع صورة (JPG/PNG)'),
            t('Compress', 'ضغط الصورة'),
            'ImageTools.runCompress()', opts
        );
    },

    runCompress: async function () {
        const file = document.getElementById('imgInput_compress').files[0];
        if (!file) return;

        try {
            const dataUrl = await this.readImage(file);
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const q = parseFloat(document.getElementById('compQual').value);
                const newData = canvas.toDataURL('image/jpeg', q);

                this.showResult('compress', newData, 'compressed_' + file.name.split('.')[0] + '.jpg');
            };
            img.src = dataUrl;
        } catch (e) { alert('Error: ' + e); }
    },

    // 2. Image Resizer
    renderResize: function (container) {
        const t = this._t;
        const opts = `
            <div style="display:flex; gap:10px;">
                <input type="number" id="resW" placeholder="${t('Width', 'العرض')}" class="glass-input">
                <input type="number" id="resH" placeholder="${t('Height', 'الارتفاع')}" class="glass-input">
            </div>
            <small style="color:var(--text-secondary)">${t('Leave one empty to maintain aspect ratio.', 'اترك حقلاً فارغاً للحفاظ على الأبعاد الأصلية.')}</small>
        `;
        this.renderUploadUI(container, 'resize',
            t('Upload Image', 'ارفع صورة'),
            t('Resize', 'تغيير الحجم'),
            'ImageTools.runResize()', opts
        );
    },

    runResize: async function () {
        const file = document.getElementById('imgInput_resize').files[0];
        if (!file) return;

        const dataUrl = await this.readImage(file);
        const img = new Image();
        img.onload = () => {
            let w = parseInt(document.getElementById('resW').value);
            let h = parseInt(document.getElementById('resH').value);

            if (!w && !h) { w = img.width; h = img.height; }
            else if (!w) w = (h / img.height) * img.width;
            else if (!h) h = (w / img.width) * img.height;

            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);

            this.showResult('resize', canvas.toDataURL((file.type === 'image/png' ? 'image/png' : 'image/jpeg')), 'resized_' + file.name);
        };
        img.src = dataUrl;
    },

    // 3. Convert to WebP
    renderWebP: function (container) {
        const t = this._t;
        this.renderUploadUI(container, 'webp',
            t('Upload Image', 'ارفع صورة'),
            t('Convert to WebP', 'تحويل إلى WebP'),
            'ImageTools.runWebP()'
        );
    },

    runWebP: async function () {
        const file = document.getElementById('imgInput_webp').files[0];
        if (!file) return;

        const dataUrl = await this.readImage(file);
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext('2d').drawImage(img, 0, 0);
            this.showResult('webp', canvas.toDataURL('image/webp', 0.8), file.name.split('.')[0] + '.webp');
        };
        img.src = dataUrl;
    },

    // 4. Remove Background (Partial/Placeholder)
    renderRemoveBG: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div style="text-align:center; padding:20px;">
                 <p style="margin-bottom:15px;">${t('True background removal requires heavy AI models unavailable for pure client-side static hosting without API keys.', 'إزالة الخلفية الحقيقية تتطلب نماذج ذكاء اصطناعي غير متوفرة للاستضافة الثابتة بدون مفاتيح API.')}</p>
                 <button onclick="window.open('https://www.remove.bg', '_blank')" class="btn-primary">${t('Open Remove.bg (External)', 'فتح Remove.bg (خارجي)')}</button>
                 <p style="margin-top:10px; font-size:0.8em; color:var(--text-secondary);">${t('We recommend this free service for best results.', 'نوصي بهذه الخدمة المجانية للحصول على أفضل النتائج.')}</p>
            </div>
         `;
    },

    // 5. HEIC to JPG
    renderHEIC: function (container) {
        const t = this._t;
        container.innerHTML = `
             <div style="text-align:center; padding:20px;">
                <p>${t('HEIC conversion not fully supported in this browser environment yet.', 'تحويل HEIC غير مدعوم بالكامل في هذا المتصفح حالياً.')}</p>
             </div>
        `;
    },

    // 6. Social Post Image Prep
    renderSocialImg: function (container) {
        const t = this._t;
        const opts = `
            <select id="siPlat" class="glass-input">
                <option value="1080x1080">${t('Instagram Post (1:1)', 'منشور انستغرام (1:1)')}</option>
                <option value="1080x1920">${t('Instagram Story (9:16)', 'قصة انستغرام (9:16)')}</option>
                <option value="1200x630">${t('Facebook/Twitter Link', 'رابط فيسبوك/تويتر')}</option>
            </select>
        `;
        this.renderUploadUI(container, 'socialimg',
            t('Upload Image', 'ارفع صورة'),
            t('Crop & Fit', 'قص وملاءمة'),
            'ImageTools.runSocialImg()', opts
        );
    },

    runSocialImg: async function () {
        // Simple center fit logic
        const file = document.getElementById('imgInput_socialimg').files[0];
        if (!file) return;
        const [targetW, targetH] = document.getElementById('siPlat').value.split('x').map(x => parseInt(x));

        const dataUrl = await this.readImage(file);
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = targetW;
            canvas.height = targetH;
            const ctx = canvas.getContext('2d');

            // Fill background
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, targetW, targetH);

            // Scale logic (cover)
            const scale = Math.max(targetW / img.width, targetH / img.height);
            const x = (targetW / 2) - (img.width / 2) * scale;
            const y = (targetH / 2) - (img.height / 2) * scale;

            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

            this.showResult('socialimg', canvas.toDataURL('image/jpeg'), 'social_post.jpg');
        };
        img.src = dataUrl;
    },

    // 7. Add Border/Shadow
    renderBorder: function (container) {
        const t = this._t;
        const opts = `<label><input type="checkbox" id="addShadow" checked> ${t('Add Shadow & Padding', 'إضافة ظل وإطار')}</label>`;
        this.renderUploadUI(container, 'border',
            t('Upload Screenshot/Image', 'ارفع لقطة الشاشة/الصورة'),
            t('Add Frame', 'إضافة إطار'),
            'ImageTools.runBorder()', opts
        );
    },

    runBorder: async function () {
        const file = document.getElementById('imgInput_border').files[0];
        if (!file) return;

        const dataUrl = await this.readImage(file);
        const img = new Image();
        img.onload = () => {
            const pad = 40;
            const canvas = document.createElement('canvas');
            canvas.width = img.width + (pad * 2);
            canvas.height = img.height + (pad * 2);
            const ctx = canvas.getContext('2d');

            // BG
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Shadow
            ctx.shadowColor = "rgba(0,0,0,0.3)";
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 10;

            ctx.drawImage(img, pad, pad);

            this.showResult('border', canvas.toDataURL('image/png'), 'framed_' + file.name);
        };
        img.src = dataUrl;
    },

    // 8. Metadata Remover
    renderMeta: function (container) {
        const t = this._t;
        this.renderUploadUI(container, 'meta',
            t('Upload Photo', 'ارفع صورة'),
            t('Remove Exif', 'حذف البيانات الوصفية'),
            'ImageTools.runMeta()'
        );
    },

    runMeta: async function () {
        // Basic Strip: Reading to canvas and exporting strips all non-visual metadata
        const file = document.getElementById('imgInput_meta').files[0];
        if (!file) return;

        const dataUrl = await this.readImage(file);
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext('2d').drawImage(img, 0, 0);
            this.showResult('meta', canvas.toDataURL('image/jpeg', 0.95), 'clean_' + file.name.split('.')[0] + '.jpg');
        };
        img.src = dataUrl;
    },

    // Helper
    showResult: (toolId, dataUrl, filename) => {
        const resBox = document.getElementById(`res_${toolId}`);
        const content = document.getElementById(`resContent_${toolId}`);
        const link = document.getElementById(`dlLink_${toolId}`);
        const t = this._t;

        content.innerHTML = `<img src="${dataUrl}" style="max-height:300px; border-radius:8px; border:1px solid #ddd;">`;
        link.href = dataUrl;
        link.download = filename;
        link.innerText = t("Download", "تحميل");

        resBox.classList.remove('hidden');
    },

    // 9. Color Palette
    renderPalette: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <input type="file" id="palInput" class="glass-input full-width" accept="image/*" onchange="ImageTools.extractPal()">
                <div id="palPreview" style="margin-top:20px; text-align:center;" class="hidden">
                    <img id="palImg" style="max-width:100%; max-height:200px; border-radius:12px; margin-bottom:16px;">
                    <div id="colorsGrid" style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;"></div>
                </div>
            </div>
        `;
    },

    extractPal: function () {
        const file = document.getElementById('palInput').files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.getElementById('palImg');
            img.src = e.target.result;
            document.getElementById('palPreview').classList.remove('hidden');

            // Mock Palette extraction
            const colors = ['#FF6B6B', '#4ECB71', '#D35BFF', '#00FFF2', '#555555'];
            const grid = document.getElementById('colorsGrid');
            grid.innerHTML = '';

            colors.forEach(c => {
                grid.innerHTML += `
                <div style="width:50px; height:50px; background:${c}; border-radius:50%; cursor:pointer;" 
                     onclick="alert('${c}')" title="${c}"></div>
               `;
            });
        };
        reader.readAsDataURL(file);
    },

    // 10. Meme Generator
    renderMeme: function (container) {
        const t = this._t;
        const opts = `
             <div class="input-row"><input type="text" id="memeTop" class="glass-input" placeholder="${t('Top Text', 'النص العلوي')}" oninput="ImageTools.drawMeme()"></div>
             <div class="input-row"><input type="text" id="memeBot" class="glass-input" placeholder="${t('Bottom Text', 'النص السفلي')}" oninput="ImageTools.drawMeme()"></div>
        `;
        this.renderUploadUI(container, 'meme',
            t('Upload Image', 'ارفع صورة'),
            t('Generate Meme', 'إنشاء الميم'),
            'ImageTools.drawMeme(true)', opts
        );
    },

    drawMeme: async function (finalize = false) {
        const file = document.getElementById('imgInput_meme').files[0];
        if (!file) return;

        // Cache image if not exists, but for simplicity read every time or optimize later. 
        // Better: store dataUrl in a var.
        if (!this.memeDataUrl) this.memeDataUrl = await this.readImage(file);

        const top = document.getElementById('memeTop').value.toUpperCase();
        const bot = document.getElementById('memeBot').value.toUpperCase();

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');

            ctx.drawImage(img, 0, 0);

            // Text Style
            ctx.font = `bold ${img.width / 10}px Impact, sans-serif`;
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = img.width / 150;
            ctx.textAlign = 'center';

            if (top) {
                ctx.strokeText(top, img.width / 2, img.height * 0.15);
                ctx.fillText(top, img.width / 2, img.height * 0.15);
            }
            if (bot) {
                ctx.strokeText(bot, img.width / 2, img.height * 0.9);
                ctx.fillText(bot, img.width / 2, img.height * 0.9);
            }

            if (finalize) {
                this.showResult('meme', canvas.toDataURL('image/jpeg'), 'meme.jpg');
            } else {
                // Preview? 
                // Currently current UI structure puts result in a hidden box. 
                // Real-time preview needs UI change. For now button click updates result.
            }
        };
        img.src = this.memeDataUrl;
    },

    // 11. Image Cropper (Basic)
    renderCropper: function (container) {
        const t = this._t;
        const opts = `
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <input type="number" id="cropX" placeholder="X" class="glass-input">
                <input type="number" id="cropY" placeholder="Y" class="glass-input">
                <input type="number" id="cropW" placeholder="${t('Width', 'العرض')}" class="glass-input">
                <input type="number" id="cropH" placeholder="${t('Height', 'الارتفاع')}" class="glass-input">
            </div>
        `;
        this.renderUploadUI(container, 'cropper',
            t('Upload Image', 'ارفع صورة'),
            t('Crop', 'قص'),
            'ImageTools.runCropper()', opts
        );
    },
    runCropper: async function () {
        const file = document.getElementById('imgInput_cropper').files[0];
        if (!file) return;

        const dataUrl = await this.readImage(file);
        const img = new Image();
        img.onload = () => {
            const x = parseInt(document.getElementById('cropX').value) || 0;
            const y = parseInt(document.getElementById('cropY').value) || 0;
            const w = parseInt(document.getElementById('cropW').value) || img.width / 2;
            const h = parseInt(document.getElementById('cropH').value) || img.height / 2;

            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, x, y, w, h, 0, 0, w, h);

            this.showResult('cropper', canvas.toDataURL('image/jpeg'), 'cropped_' + file.name);
        };
        img.src = dataUrl;
    },

    // 12. Image Filters
    renderFilters: function (container) {
        const t = this._t;
        const opts = `
            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:5px;">
                <button onclick="ImageTools.setFilter('grayscale')" class="tool-action">B&W</button>
                <button onclick="ImageTools.setFilter('sepia')" class="tool-action">Sepia</button>
                <button onclick="ImageTools.setFilter('invert')" class="tool-action">Invert</button>
                <button onclick="ImageTools.setFilter('brightness')" class="tool-action">Bright</button>
                <button onclick="ImageTools.setFilter('contrast')" class="tool-action">Contrast</button>
                <button onclick="ImageTools.setFilter('blur')" class="tool-action">Blur</button>
            </div>
            <input type="hidden" id="activeFilter" value="grayscale">
        `;
        this.renderUploadUI(container, 'filter',
            t('Upload Image', 'ارفع صورة'),
            t('Apply Filter', 'تطبيق الفلتر'),
            'ImageTools.runFilter()', opts
        );
    },
    setFilter: function (f) {
        document.getElementById('activeFilter').value = f;
        // Visual feedback could be added here
    },
    runFilter: async function () {
        const file = document.getElementById('imgInput_filter').files[0];
        if (!file) return;

        const f = document.getElementById('activeFilter').value;
        const dataUrl = await this.readImage(file);
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');

            // Apply filter
            if (f === 'grayscale') ctx.filter = 'grayscale(100%)';
            if (f === 'sepia') ctx.filter = 'sepia(100%)';
            if (f === 'invert') ctx.filter = 'invert(100%)';
            if (f === 'brightness') ctx.filter = 'brightness(150%)';
            if (f === 'contrast') ctx.filter = 'contrast(200%)';
            if (f === 'blur') ctx.filter = 'blur(5px)';

            ctx.drawImage(img, 0, 0);
            this.showResult('filter', canvas.toDataURL('image/jpeg'), 'filtered_' + file.name);
        };
        img.src = dataUrl;
    }
};

window.ImageTools = ImageTools;
