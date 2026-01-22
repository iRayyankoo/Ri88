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
    },

    // 8. JWT Debugger
    renderJWT: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <textarea id="jwtIn" class="glass-input" style="height:100px; font-family:monospace;" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."></textarea>
                <button onclick="DevTools.decodeJWT()" class="btn-primary full-width" style="margin-top:10px;">${t('Decode Token', 'فك التشفير')}</button>
                <div id="jwtRes" class="result-box hidden" style="text-align:left; direction:ltr;">
                    <strong style="color:var(--accent-cyan);">Header</strong>
                    <pre id="jwtHead" style="background:rgba(0,0,0,0.3); padding:10px; border-radius:8px; overflow:auto;"></pre>
                    <strong style="color:var(--accent-pink);">Payload</strong>
                    <pre id="jwtPay" style="background:rgba(0,0,0,0.3); padding:10px; border-radius:8px; overflow:auto;"></pre>
                </div>
            </div>
        `;
    },
    decodeJWT: function () {
        const txt = document.getElementById('jwtIn').value;
        const [h, p, s] = txt.split('.');
        if (!h || !p) return alert("Invalid JWT");
        try {
            const head = JSON.stringify(JSON.parse(atob(h)), null, 2);
            const pay = JSON.stringify(JSON.parse(atob(p)), null, 2);
            document.getElementById('jwtHead').innerText = head;
            document.getElementById('jwtPay').innerText = pay;
            document.getElementById('jwtRes').classList.remove('hidden');
        } catch (e) { alert("Error decoding: " + e.message); }
    },

    // 9. SQL Formatter
    renderSQL: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <textarea id="sqlIn" class="glass-input" style="height:150px; font-family:monospace;" placeholder="SELECT * FROM users WHERE id=1"></textarea>
                <button onclick="DevTools.fmtSQL()" class="btn-primary full-width" style="margin-top:10px;">${t('Format SQL', 'تنسيق SQL')}</button>
                <textarea id="sqlOut" class="glass-input hidden" style="height:150px; margin-top:10px; font-family:monospace;" readonly></textarea>
            </div>
        `;
    },
    fmtSQL: function () {
        let sql = document.getElementById('sqlIn').value;
        sql = sql.replace(/\s+/g, ' ')
            .replace(/\s*,\s*/g, ',\n  ')
            .replace(/\s+(SELECT|FROM|WHERE|AND|OR|ORDER BY|GROUP BY|JOIN|LEFT JOIN|RIGHT JOIN|LIMIT|INSERT INTO|VALUES|UPDATE|SET|DELETE)\s+/gi, '\n$1 ')
            .replace(/\(\s+/g, '(\n  ')
            .replace(/\s+\)/g, '\n)');
        document.getElementById('sqlOut').value = sql.trim();
        document.getElementById('sqlOut').classList.remove('hidden');
    },

    // 10. Chmod Calculator
    renderChmod: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
                    <div id="chmodOwner"><strong>Owner</strong><br><label><input type="checkbox" val="4"> Read</label><br><label><input type="checkbox" val="2"> Write</label><br><label><input type="checkbox" val="1"> Execute</label></div>
                    <div id="chmodGroup"><strong>Group</strong><br><label><input type="checkbox" val="4"> Read</label><br><label><input type="checkbox" val="2"> Write</label><br><label><input type="checkbox" val="1"> Execute</label></div>
                    <div id="chmodPublic"><strong>Public</strong><br><label><input type="checkbox" val="4"> Read</label><br><label><input type="checkbox" val="2"> Write</label><br><label><input type="checkbox" val="1"> Execute</label></div>
                </div>
                <div class="result-box" style="text-align:center;">
                    <span style="font-size:3em; font-weight:bold; color:var(--accent-cyan);" id="chmodVal">000</span>
                    <div id="chmodStr" style="color:#aaa; font-family:monospace;">---------</div>
                </div>
            </div>
        `;
        const inputs = container.querySelectorAll('input[type="checkbox"]');
        inputs.forEach(i => i.addEventListener('change', () => this.calcChmod()));
    },
    calcChmod: function () {
        const getVal = (id) => {
            let v = 0;
            document.querySelectorAll(`#${id} input:checked`).forEach(i => v += parseInt(i.getAttribute('val')));
            return v;
        };
        const o = getVal('chmodOwner');
        const g = getVal('chmodGroup');
        const p = getVal('chmodPublic');
        document.getElementById('chmodVal').innerText = `${o}${g}${p}`;

        const map = { 4: 'r', 2: 'w', 1: 'x' };
        const getStr = (val) => {
            let s = '';
            s += (val & 4) ? 'r' : '-';
            s += (val & 2) ? 'w' : '-';
            s += (val & 1) ? 'x' : '-';
            return s;
        };
        document.getElementById('chmodStr').innerText = getStr(o) + getStr(g) + getStr(p);
    },

    // 11. Cron Generator
    renderCron: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>Common Schedules</label>
                    <select id="cronCommon" class="glass-input" onchange="DevTools.setCron(this.value)">
                        <option value="* * * * *">Every Minute</option>
                        <option value="0 * * * *">Hourly</option>
                        <option value="0 0 * * *">Daily (Midnight)</option>
                        <option value="0 0 * * 0">Weekly (Sunday)</option>
                        <option value="0 0 1 * *">Monthly</option>
                    </select>
                </div>
                <div class="result-box" style="text-align:center;">
                    <input type="text" id="cronVal" value="* * * * *" class="glass-input" style="text-align:center; font-size:1.5em; font-family:monospace;">
                    <div style="margin-top:10px; font-size:0.9em; color:#aaa;">min hour day month weekday</div>
                </div>
            </div>
        `;
    },
    setCron: function (val) {
        document.getElementById('cronVal').value = val;
    },

    // 12. Curl to Fetch
    renderCurl: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <label>Curl Command</label>
                <textarea id="curlIn" class="glass-input" style="height:100px; font-family:monospace;" placeholder="curl -X POST https://api.com..."></textarea>
                <button onclick="DevTools.convCurl()" class="btn-primary full-width" style="margin-top:10px;">${t('Convert to Fetch', 'تحويل لـ Fetch')}</button>
                <textarea id="fetchOut" class="glass-input hidden" style="height:150px; margin-top:10px; font-family:monospace;" readonly></textarea>
            </div>
        `;
    },
    convCurl: function () {
        const curl = document.getElementById('curlIn').value;
        let url = curl.match(/['"](https?:\/\/[^'"]+)['"]/);
        if (!url) url = curl.match(/(https?:\/\/[^\s]+)/);

        let method = 'GET';
        if (curl.includes('-X POST') || curl.includes('--data')) method = 'POST';
        if (curl.includes('-X PUT')) method = 'PUT';
        if (curl.includes('-X DELETE')) method = 'DELETE';

        let js = `fetch('${url ? url[1] : 'URL_HERE'}', {\n  method: '${method}',\n  headers: {\n    'Content-Type': 'application/json'\n  }\n})`;
        document.getElementById('fetchOut').value = js;
        document.getElementById('fetchOut').classList.remove('hidden');
    },

    // 13. User Agent Parser
    renderUA: function (container) {
        const t = this._t;
        const ua = navigator.userAgent;
        container.innerHTML = `
            <div class="tool-ui-group">
                <textarea id="uaInput" class="glass-input" style="height:80px;">${ua}</textarea>
                <button onclick="DevTools.parseUA()" class="btn-primary full-width" style="margin-top:10px;">${t('Parse UA', 'تحليل')}</button>
                <div id="uaRes" class="result-box hidden">
                    <div id="uaOut"></div>
                </div>
            </div>
        `;
        setTimeout(() => this.parseUA(), 100);
    },
    parseUA: function () {
        const ua = document.getElementById('uaInput').value;
        const out = document.getElementById('uaOut');

        let os = "Unknown";
        if (ua.includes("Win")) os = "Windows";
        if (ua.includes("Mac")) os = "MacOS";
        if (ua.includes("Linux")) os = "Linux";
        if (ua.includes("Android")) os = "Android";
        if (ua.includes("iOS") || ua.includes("iPhone")) os = "iOS";

        let browser = "Unknown";
        if (ua.includes("Chrome")) browser = "Chrome";
        if (ua.includes("Firefox")) browser = "Firefox";
        if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
        if (ua.includes("Edg")) browser = "Edge";

        out.innerHTML = `
            <strong>OS:</strong> ${os}<br>
            <strong>Browser:</strong> ${browser}<br>
            <strong>Mobile:</strong> ${/Mobi|Android/i.test(ua) ? 'Yes' : 'No'}
        `;
        document.getElementById('uaRes').classList.remove('hidden');
    },

    // 14. Meta Tag Generator
    renderMeta: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row"><label>Title</label><input type="text" id="metaTitle" class="glass-input"></div>
                <div class="input-row"><label>Description</label><textarea id="metaDesc" class="glass-input"></textarea></div>
                <div class="input-row"><label>Keywords</label><input type="text" id="metaKey" class="glass-input" placeholder="comma, separated"></div>
                <div class="input-row"><label>Author</label><input type="text" id="metaAuth" class="glass-input"></div>
                
                <button onclick="DevTools.genMeta()" class="btn-primary full-width">${t('Generate Meta Tags', 'توليد الميتا')}</button>
                <textarea id="metaOut" class="glass-input hidden" style="height:150px; margin-top:10px; font-family:monospace;" readonly></textarea>
            </div>
        `;
    },
    genMeta: function () {
        const title = document.getElementById('metaTitle').value;
        const desc = document.getElementById('metaDesc').value;
        const key = document.getElementById('metaKey').value;
        const auth = document.getElementById('metaAuth').value;

        let html = `<!-- Primary Meta Tags -->\n`;
        html += `<title>${title}</title>\n`;
        html += `<meta name="title" content="${title}">\n`;
        html += `<meta name="description" content="${desc}">\n`;
        html += `<meta name="keywords" content="${key}">\n`;
        html += `<meta name="author" content="${auth}">\n`;
        html += `<meta name="viewport" content="width=device-width, initial-scale=1.0">`;

        document.getElementById('metaOut').value = html;
        document.getElementById('metaOut').classList.remove('hidden');
    },

    // 15. Favicon Generator
    renderFavicon: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group" style="text-align:center;">
                <input type="file" id="favFile" accept="image/*" class="glass-input" onchange="DevTools.loadFav(this)">
                <canvas id="favCanvas" width="32" height="32" style="border:1px solid #444; margin:20px; width:64px; height:64px; image-rendering:pixelated;"></canvas>
                <button onclick="DevTools.dlFav()" class="btn-primary full-width">${t('Download .ico (PNG)', 'تحميل (PNG)')}</button>
                <p style="font-size:0.8em; color:#aaa;">*Generates 32x32 PNG (Modern Favicon)</p>
            </div>
        `;
    },
    loadFav: function (input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.onload = function () {
                    const ctx = document.getElementById('favCanvas').getContext('2d');
                    ctx.clearRect(0, 0, 32, 32);
                    ctx.drawImage(img, 0, 0, 32, 32);
                };
                img.src = e.target.result;
            }
            reader.readAsDataURL(input.files[0]);
        }
    },
    dlFav: function () {
        const cvs = document.getElementById('favCanvas');
        const link = document.createElement('a');
        link.download = 'favicon.png';
        link.href = cvs.toDataURL();
        link.click();
    },

    // 16. SVG Optimizer
    renderSVG: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <textarea id="svgIn" class="glass-input" style="height:150px; font-family:monospace;" placeholder="Place SVG Code..."></textarea>
                <button onclick="DevTools.optSVG()" class="btn-primary full-width" style="margin-top:10px;">${t('Optimize', 'تحسين')}</button>
                <textarea id="svgOut" class="glass-input hidden" style="height:150px; margin-top:10px; font-family:monospace;" readonly></textarea>
                <div id="svgStats" style="margin-top:5px; font-size:0.9em;"></div>
            </div>
        `;
    },
    optSVG: function () {
        const svg = document.getElementById('svgIn').value;
        if (!svg) return;
        let opt = svg.replace(/<!--[\s\S]*?-->/g, '')
            .replace(/\n/g, '')
            .replace(/>\s+</g, '><')
            .replace(/\s{2,}/g, ' ');

        document.getElementById('svgOut').value = opt;
        document.getElementById('svgOut').classList.remove('hidden');
        const saved = ((1 - (opt.length / svg.length)) * 100).toFixed(1);
        document.getElementById('svgStats').innerText = `Reduced by ${saved}%`;
    },

    // 17. Markdown Preview
    renderMarkdown: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <textarea id="mdIn" class="glass-input" style="height:150px; font-family:monospace;" placeholder="# Hello World\n**Bold** text" oninput="DevTools.preMD()"></textarea>
                <div id="mdPre" style="background:white; color:black; padding:20px; border-radius:8px; margin-top:10px; min-height:100px;"></div>
            </div>
        `;
    },
    preMD: function () {
        let md = document.getElementById('mdIn').value;
        let html = md
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
            .replace(/\*(.*)\*/gim, '<i>$1</i>')
            .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
            .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
            .replace(/\n/gim, '<br>');
        document.getElementById('mdPre').innerHTML = html;
    }
};

window.DevTools = DevTools;
