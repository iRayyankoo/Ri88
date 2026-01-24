/**
 * Text Tools Module
 * Logic for Arabic correction and text cleaning
 */

const TextTools = {
    _t: function (en, ar) {
        return document.documentElement.lang === 'ar' ? ar : en;
    },

    // 1. Arabic for Adobe
    renderAdobe: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Arabic Text (Problematic)', 'النص العربي (المتقطع)')}</label>
                    <textarea id="adbInput" class="glass-input" rows="4" placeholder="${t('Type Arabic text here...', 'اكتب النص العربي هنا...')}"></textarea>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                     <label style="font-size:12px; color:#aaa; display:flex; align-items:center;">
                        <input type="checkbox" id="adbReverse" checked> ${t('Reverse Characters', 'عكس الحروف')}
                     </label>
                </div>
                <button onclick="TextTools.processAdobe()" class="btn-primary full-width">${t('Fix Text', 'إصلاح النص')}</button>
                
                <div id="adbResult" class="result-box hidden">
                    <label>${t('Result (Copy/Paste to Adobe):', 'النتيجة (انسخ والصق في أدوبي):')}</label>
                    <textarea id="adbOutput" class="glass-input" rows="4" readonly style="margin-top:8px;"></textarea>
                    <button onclick="navigator.clipboard.writeText(document.getElementById('adbOutput').value)" class="tool-action" style="margin-top:8px;">${t('Copy', 'نسخ')}</button>
                </div>
            </div>
        `;
    },

    processAdobe: function () {
        const text = document.getElementById('adbInput').value;
        if (!text) return;
        const reversed = text.split('').reverse().join('');
        document.getElementById('adbOutput').value = reversed;
        document.getElementById('adbResult').classList.remove('hidden');
    },

    // 2. Text Cleaner
    renderCleaner: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Messy Text', 'النص الأصلي')}</label>
                    <textarea id="clInput" class="glass-input" rows="6" placeholder="${t('Paste text here...', 'الصق النص هنا...')}"></textarea>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:16px;">
                    <label class="check-label"><input type="checkbox" id="clSpaces" checked> ${t('Remove Extra Spaces', 'حذف المسافات الزائدة')}</label>
                    <label class="check-label"><input type="checkbox" id="clLines" checked> ${t('Remove Empty Lines', 'حذف الأسطر الفارغة')}</label>
                    <label class="check-label"><input type="checkbox" id="clEmoji"> ${t('Remove Emojis', 'حذف الإيموجي')}</label>
                    <label class="check-label"><input type="checkbox" id="clHtml"> ${t('Strip HTML Tags', 'حذف كود HTML')}</label>
                </div>
                <button onclick="TextTools.cleanText()" class="btn-primary full-width">${t('Clean Text', 'تنظيف النص')}</button>
                
                <div id="clResult" class="result-box hidden">
                    <textarea id="clOutput" class="glass-input" rows="6" readonly></textarea>
                    <button onclick="navigator.clipboard.writeText(document.getElementById('clOutput').value)" class="tool-action" style="margin-top:8px;">${t('Copy', 'نسخ')}</button>
                </div>
            </div>
        `;
    },

    cleanText: function () {
        let text = document.getElementById('clInput').value;
        if (document.getElementById('clSpaces').checked) {
            text = text.replace(/[ \t]+/g, ' ').trim();
        }
        if (document.getElementById('clLines').checked) {
            text = text.replace(/^\s*[\r\n]/gm, '');
        }
        if (document.getElementById('clEmoji').checked) {
            text = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
        }
        if (document.getElementById('clHtml').checked) {
            const div = document.createElement('div');
            div.innerHTML = text;
            text = div.textContent || div.innerText || '';
        }

        document.getElementById('clOutput').value = text;
        document.getElementById('clResult').classList.remove('hidden');
    },

    // 3. Case Converter
    renderCase: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <textarea id="caseInput" class="glass-input" rows="5" placeholder="${t('Type text to convert...', 'اكتب النص للتحويل...')}"></textarea>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:12px;">
                    <button onclick="TextTools.convertCase('upper')" class="btn-primary">UPPERCASE</button>
                    <button onclick="TextTools.convertCase('lower')" class="btn-primary">lowercase</button>
                    <button onclick="TextTools.convertCase('title')" class="btn-primary">Title Case</button>
                    <button onclick="TextTools.convertCase('sentence')" class="btn-primary">Sentence case</button>
                </div>
            </div>
        `;
    },

    convertCase: function (mode) {
        const field = document.getElementById('caseInput');
        let text = field.value;
        if (!text) return;

        if (mode === 'upper') {
            text = text.toUpperCase();
        } else if (mode === 'lower') {
            text = text.toLowerCase();
        } else if (mode === 'title') {
            text = text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        } else if (mode === 'sentence') {
            text = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
        }

        field.value = text;
    },

    // 4. Hashtag Generator
    renderHashtag: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Content Text', 'النص / المحتوى')}</label>
                    <textarea id="hashInput" class="glass-input" rows="4" placeholder="${t('Keywords or sentence...', 'كلمات مفتاحية أو جملة...')}"></textarea>
                </div>
                <button onclick="TextTools.genHashtags()" class="btn-primary full-width">${t('Generate Tags', 'توليد الهاشتاقات')}</button>
                
                <div id="hashResult" class="result-box hidden">
                    <div id="hashOutput" style="color:var(--accent-pink); font-family:monospace; line-height:1.6;"></div>
                    <button onclick="navigator.clipboard.writeText(document.getElementById('hashOutput').innerText)" class="tool-action" style="margin-top:12px;">${t('Copy Tags', 'نسخ الهاشتاقات')}</button>
                </div>
            </div>
        `;
    },

    genHashtags: function () {
        const text = document.getElementById('hashInput').value;
        if (!text) return;

        const tags = text.replace(/[^\w\s\u0600-\u06FF]/g, '')
            .split(/\s+/)
            .filter(w => w.length > 2)
            .map(w => '#' + w)
            .join(' ');

        document.getElementById('hashOutput').innerText = tags;
        document.getElementById('hashResult').classList.remove('hidden');
    },

    // 5. UTM Builder
    renderUTM: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row"><input type="text" id="utmUrl" placeholder="${t('Website URL (e.g. google.com)', 'رابط الموقع (مثلاً google.com)')}" class="glass-input"></div>
                <div class="input-row"><input type="text" id="utmSource" placeholder="${t('Campaign Source (e.g. twitter)', 'مصدر الحملة (مثلاً twitter)')}" class="glass-input"></div>
                <div class="input-row"><input type="text" id="utmMedium" placeholder="${t('Campaign Medium (e.g. social)', 'وسيلة الحملة (مثلاً social)')}" class="glass-input"></div>
                <div class="input-row"><input type="text" id="utmName" placeholder="${t('Campaign Name (e.g. winter_sale)', 'اسم الحملة (مثلاً winter_break)')}" class="glass-input"></div>
                
                <button onclick="TextTools.buildUTM()" class="btn-primary full-width">${t('Build URL', 'بناء الرابط')}</button>
                
                <div id="utmResult" class="result-box hidden">
                    <textarea id="utmOutput" class="glass-input" rows="3" readonly></textarea>
                </div>
            </div>
        `;
    },

    buildUTM: function () {
        let url = document.getElementById('utmUrl').value.trim();
        const source = document.getElementById('utmSource').value.trim();
        const medium = document.getElementById('utmMedium').value.trim();
        const campaign = document.getElementById('utmName').value.trim();

        if (!url) return;
        if (!url.startsWith('http')) url = 'https://' + url;

        const params = new URLSearchParams();
        if (source) params.append('utm_source', source);
        if (medium) params.append('utm_medium', medium);
        if (campaign) params.append('utm_campaign', campaign);

        const finalUrl = url + (params.toString() ? '?' + params.toString() : '');

        document.getElementById('utmOutput').value = finalUrl;
        document.getElementById('utmResult').classList.remove('hidden');
    },

    // 6. Link Extractor
    renderLinks: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <textarea id="linkTxt" class="glass-input" style="height:100px;" placeholder="${t('Paste text containing URLs...', 'الصق نص يحتوي على روابط...')}"></textarea>
                <button onclick="TextTools.getLinks()" class="btn-primary full-width" style="margin-top:10px;">${t('Extract Links', 'استخراج الروابط')}</button>
                <textarea id="linkOut" class="glass-input hidden" style="height:100px; margin-top:10px;" readonly></textarea>
            </div>
         `;
    },
    getLinks: function () {
        const t = this._t;
        const txt = document.getElementById('linkTxt').value;
        const regex = /https?:\/\/[^\s]+/g;
        const matches = txt.match(regex);
        const out = document.getElementById('linkOut');

        if (matches) {
            out.value = [...new Set(matches)].join('\n');
            out.classList.remove('hidden');
        } else {
            alert(t('No links found', 'لم يتم العثور على روابط'));
        }
    },

    // 7. Arabic Punctuation
    renderPunc: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <textarea id="puncIn" class="glass-input" style="height:100px;" placeholder="نص عربي..."></textarea>
                <button onclick="TextTools.fixPunc()" class="btn-primary full-width" style="margin-top:10px;">${t('Fix Punctuation', 'إصلاح الترقيم')}</button>
                <textarea id="puncOut" class="glass-input hidden" style="height:100px; margin-top:10px;" readonly></textarea>
            </div>
         `;
    },
    fixPunc: function () {
        let txt = document.getElementById('puncIn').value;
        txt = txt.replace(/,/g, '،');
        txt = txt.replace(/\?/g, '؟');
        txt = txt.replace(/;/g, '؛');
        txt = txt.replace(/1/g, '١').replace(/2/g, '٢').replace(/3/g, '٣').replace(/4/g, '٤').replace(/5/g, '٥')
            .replace(/6/g, '٦').replace(/7/g, '٧').replace(/8/g, '٨').replace(/9/g, '٩').replace(/0/g, '٠');

        document.getElementById('puncOut').value = txt;
        document.getElementById('puncOut').classList.remove('hidden');
    },

    // 8. Diacritics Remover
    renderTashkeel: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <textarea id="diaIn" class="glass-input" style="height:100px;" placeholder="نص مُشَكَّل..."></textarea>
                <button onclick="TextTools.remDia()" class="btn-primary full-width" style="margin-top:10px;">${t('Remove Tashkeel', 'حذف التشكيل')}</button>
                <textarea id="diaOut" class="glass-input hidden" style="height:100px; margin-top:10px;" readonly></textarea>
            </div>
         `;
    },
    remDia: function () {
        let txt = document.getElementById('diaIn').value;
        txt = txt.replace(/[\u064B-\u065F\u0670]/g, '');
        document.getElementById('diaOut').value = txt;
        document.getElementById('diaOut').classList.remove('hidden');
    },

    // 9. Arabic Lorem Ipsum
    renderLorem: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Number of Paragraphs', 'عدد الفقرات')}</label>
                    <input type="number" id="loremCount" class="glass-input full-width" value="1" min="1" max="10">
                </div>
                <button onclick="TextTools.genLorem()" class="btn-primary full-width">${t('Generate Text', 'توليد النص')}</button>
                <div style="position:relative;">
                    <textarea id="loremRes" class="glass-input full-width hidden" rows="8" readonly></textarea>
                     <button onclick="TextTools.copyLorem()" style="position:absolute; top:10px; left:10px; background:rgba(0,0,0,0.5); border:none; color:white; padding:4px 8px; border-radius:4px; cursor:pointer;">${t('Copy', 'نسخ')}</button>
                </div>
            </div>
        `;
    },

    genLorem: function () {
        const count = parseInt(document.getElementById('loremCount').value) || 1;
        const text = "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.\n\nإذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما ولا يحوي أخطاء لغوية، مولد النص العربى مفيد لمصممي المواقع على وجه الخصوص.";

        let out = "";
        for (let i = 0; i < count; i++) {
            out += text + "\n\n";
        }

        const res = document.getElementById('loremRes');
        res.classList.remove('hidden');
        res.value = out.trim();
    },

    copyLorem: function () {
        const copyText = document.getElementById("loremRes");
        copyText.select();
        document.execCommand("copy");
    }
};

window.TextTools = TextTools;
