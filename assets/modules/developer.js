/**
 * Developer Tools Module
 * JSON, Hash, Regex, etc.
 */

const DevTools = {
    _t: function (en, ar) {
        return document.documentElement.lang === 'ar' ? ar : en;
    },

    // 1. JSON Formatter
    renderJson: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <textarea id="jsonInput" class="glass-input" style="height:150px; font-family:monospace;" placeholder="${t('Paste JSON here...', 'الصق كود JSON هنا...')}"></textarea>
                <div style="display:flex; gap:10px; margin-top:10px;">
                    <button onclick="DevTools.fmtJson()" class="btn-primary" style="flex:1;">${t('Format', 'تنسيق')}</button>
                    <button onclick="DevTools.minJson()" class="tool-action" style="flex:1;">${t('Minify', 'ضغط')}</button>
                    <button onclick="DevTools.valJson()" class="tool-action" style="flex:1;">${t('Validate', 'التحقق')}</button>
                </div>
                <textarea id="jsonOut" class="glass-input hidden" style="height:150px; margin-top:10px; font-family:monospace;" readonly></textarea>
                <p id="jsonMsg" style="margin-top:10px; font-size:0.9em;"></p>
            </div>
        `;
    },

    fmtJson: function () {
        const t = this._t;
        try {
            const txt = document.getElementById('jsonInput').value;
            const obj = JSON.parse(txt);
            const res = JSON.stringify(obj, null, 2);
            this.showJsonRes(res, t('Valid JSON', 'JSON صحيح'), 'green');
        } catch (e) { this.showJsonRes('', t('Invalid JSON: ', 'JSON غير صالح: ') + e.message, 'red'); }
    },
    minJson: function () {
        const t = this._t;
        try {
            const txt = document.getElementById('jsonInput').value;
            const res = JSON.stringify(JSON.parse(txt));
            this.showJsonRes(res, t('Minified!', 'تم الضغط!'), 'green');
        } catch (e) { this.showJsonRes('', t('Invalid: ', 'غير صالح: ') + e.message, 'red'); }
    },
    valJson: function () {
        const t = this._t;
        try { JSON.parse(document.getElementById('jsonInput').value); this.showJsonRes('', t('Valid JSON', 'JSON صحيح'), 'green'); }
        catch (e) { this.showJsonRes('', t('Invalid: ', 'غير صالح: ') + e.message, 'red'); }
    },
    showJsonRes: function (txt, msg, color) {
        const out = document.getElementById('jsonOut');
        const m = document.getElementById('jsonMsg');
        if (txt) { out.value = txt; out.classList.remove('hidden'); }
        m.style.color = color === 'red' ? '#e74c3c' : '#2ecc71';
        m.innerText = msg;
    },

    // 2. Base64
    renderBase64: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <textarea id="b64In" class="glass-input" placeholder="${t('Text to encode/decode...', 'النص للترميز/فك الترميز...')}"></textarea>
                <div style="display:flex; gap:10px; margin-top:10px;">
                     <button onclick="document.getElementById('b64In').value = btoa(document.getElementById('b64In').value)" class="btn-primary full-width">${t('Encode', 'ترمييز')}</button>
                     <button onclick="try{document.getElementById('b64In').value = atob(document.getElementById('b64In').value)}catch(e){alert('${t('Invalid Base64', 'Invalid Base64')}')}" class="tool-action full-width">${t('Decode', 'فك الترميز')}</button>
                </div>
            </div>
        `;
    },

    // 3. Hash Gen
    renderHash: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <input type="text" id="hashIn" class="glass-input" placeholder="${t('Text input', 'أدخل النص')}">
                <div style="display:flex; gap:5px; margin-top:10px; flex-wrap:wrap;">
                    <button onclick="DevTools.runHash('SHA-1')" class="tool-action">SHA-1</button>
                    <button onclick="DevTools.runHash('SHA-256')" class="tool-action">SHA-256</button>
                    <button onclick="DevTools.runHash('MD5')" class="tool-action">${t('MD5 (Simulated)', 'MD5 (محاكى)')}</button> 
                </div>
                <input type="text" id="hashOut" class="glass-input hidden" style="margin-top:10px; font-family:monospace;" readonly>
            </div>
        `;
    },
    runHash: async function (algo) {
        const txt = document.getElementById('hashIn').value;
        const out = document.getElementById('hashOut');
        const t = this._t;
        if (algo === 'MD5') {
            out.value = t("MD5 not secure/supported in WebCrypto. Use SHA-256.", "MD5 غير آمن/مدعوم. استخدم SHA-256.");
            out.classList.remove('hidden');
            return;
        }
        const msgUint8 = new TextEncoder().encode(txt);
        const hashBuffer = await crypto.subtle.digest(algo, msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        out.value = hashHex;
        out.classList.remove('hidden');
    },

    // 4. URL Encode
    renderUrlEnc: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <textarea id="urlIn" class="glass-input" placeholder="${t('URL text...', 'نص الرابط...')}"></textarea>
                <div style="display:flex; gap:10px; margin-top:10px;">
                     <button onclick="document.getElementById('urlIn').value = encodeURIComponent(document.getElementById('urlIn').value)" class="btn-primary full-width">${t('Encode', 'تشفير')}</button>
                     <button onclick="document.getElementById('urlIn').value = decodeURIComponent(document.getElementById('urlIn').value)" class="tool-action full-width">${t('Decode', 'فك التشفير')}</button>
                </div>
            </div>
        `;
    },

    // 5. Regex Tester
    renderRegex: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <input type="text" id="regPat" class="glass-input" placeholder="${t('Pattern (e.g. ^[a-z]+$)', 'النمط (مثلاً ^[a-z]+$)')}">
                <textarea id="regTxt" class="glass-input" style="margin-top:10px;" placeholder="${t('Test String', 'نص التجربة')}"></textarea>
                <button onclick="DevTools.testReg()" class="btn-primary full-width" style="margin-top:10px;">${t('Test', 'اختبار')}</button>
                <div id="regRes" style="margin-top:10px; font-weight:bold;"></div>
            </div>
        `;
    },
    testReg: function () {
        const t = this._t;
        try {
            const p = new RegExp(document.getElementById('regPat').value);
            const str = document.getElementById('regTxt').value;
            const m = p.test(str);
            const el = document.getElementById('regRes');
            el.innerText = m ? t("Match Found!", "تم العثور على تطابق!") : t("No Match", "لا يوجد تطابق");
            el.style.color = m ? "#2ecc71" : "#e74c3c";
        } catch (e) { alert(e.message); }
    },

    // 6. Diff Checker
    renderDiff: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    <textarea id="diffA" class="glass-input" placeholder="${t('Text A', 'النص أ')}" style="height:100px;"></textarea>
                    <textarea id="diffB" class="glass-input" placeholder="${t('Text B', 'النص ب')}" style="height:100px;"></textarea>
                </div>
                <button onclick="DevTools.runDiff()" class="btn-primary full-width" style="margin-top:10px;">${t('Compare', 'مقارنة')}</button>
                <div id="diffRes" style="margin-top:10px; font-size:0.9em; white-space:pre-wrap;"></div>
            </div>
        `;
    },
    runDiff: function () {
        const a = document.getElementById('diffA').value;
        const b = document.getElementById('diffB').value;
        const res = document.getElementById('diffRes');
        const t = this._t;

        if (a === b) {
            res.innerHTML = `<span style='color:#2ecc71'>${t('Texts are identical.', 'النصوص متطابقة.')}</span>`;
        } else {
            res.innerHTML = `<span style='color:#e74c3c'>${t('Texts differ.', 'النصوص مختلفة.')}</span> Length: ` + a.length + " vs " + b.length;
        }
    },

    // 7. Screen Info
    renderScreenInfo: function (container) {
        const t = this._t;
        const w = window.screen.width;
        const h = window.screen.height;
        const dpr = window.devicePixelRatio;
        const touch = 'ontouchstart' in window ? t('Yes', 'نعم') : t('No', 'لا');
        const orient = screen.orientation ? screen.orientation.type : t('Unknown', 'غير معروف');

        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="result-box" style="display:block; margin:0;">
                    <div class="res-item"><span>${t('Screen Resolution:', 'دقة الشاشة:')}</span> <strong>${w} x ${h}</strong></div>
                    <div class="res-item"><span>${t('Window Inner Size:', 'حجم النافذة داخلياً:')}</span> <strong>${window.innerWidth} x ${window.innerHeight}</strong></div>
                    <div class="res-item"><span>${t('Pixel Ratio (DPR):', 'كثافة البكسل:')}</span> <strong>${dpr}x</strong></div>
                    <div class="res-item"><span>${t('Touch Support:', 'دعم اللمس:')}</span> <strong>${touch}</strong></div>
                    <div class="res-item"><span>${t('Orientation:', 'الاتجاه:')}</span> <strong>${orient}</strong></div>
                    <div class="res-item"><span>${t('Color Depth:', 'عمق الألوان:')}</span> <strong>${screen.colorDepth}-bit</strong></div>
                </div>
            </div>
        `;
    }
};

window.DevTools = DevTools;
