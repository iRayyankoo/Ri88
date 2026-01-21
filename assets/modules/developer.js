/**
 * Developer Tools Module
 * JSON, Hash, Regex, etc.
 */

const DevTools = {
    // 1. JSON Formatter
    renderJson: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <textarea id="jsonInput" class="glass-input" style="height:150px; font-family:monospace;" placeholder="Paste JSON here..."></textarea>
                <div style="display:flex; gap:10px; margin-top:10px;">
                    <button onclick="DevTools.fmtJson()" class="btn-primary" style="flex:1;">Format</button>
                    <button onclick="DevTools.minJson()" class="tool-action" style="flex:1;">Minify</button>
                    <button onclick="DevTools.valJson()" class="tool-action" style="flex:1;">Validate</button>
                </div>
                <textarea id="jsonOut" class="glass-input hidden" style="height:150px; margin-top:10px; font-family:monospace;" readonly></textarea>
                <p id="jsonMsg" style="margin-top:10px; font-size:0.9em;"></p>
            </div>
        `;
    },

    fmtJson: function () {
        try {
            const txt = document.getElementById('jsonInput').value;
            const obj = JSON.parse(txt);
            const res = JSON.stringify(obj, null, 2);
            this.showJsonRes(res, 'Valid JSON', 'green');
        } catch (e) { this.showJsonRes('', 'Invalid JSON: ' + e.message, 'red'); }
    },
    minJson: function () {
        try {
            const txt = document.getElementById('jsonInput').value;
            const res = JSON.stringify(JSON.parse(txt));
            this.showJsonRes(res, 'Minified!', 'green');
        } catch (e) { this.showJsonRes('', 'Invalid: ' + e.message, 'red'); }
    },
    valJson: function () {
        try { JSON.parse(document.getElementById('jsonInput').value); this.showJsonRes('', 'Valid JSON', 'green'); }
        catch (e) { this.showJsonRes('', 'Invalid: ' + e.message, 'red'); }
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
        container.innerHTML = `
            <div class="tool-ui-group">
                <textarea id="b64In" class="glass-input" placeholder="Text to encode/decode..."></textarea>
                <div style="display:flex; gap:10px; margin-top:10px;">
                     <button onclick="document.getElementById('b64In').value = btoa(document.getElementById('b64In').value)" class="btn-primary full-width">Encode</button>
                     <button onclick="try{document.getElementById('b64In').value = atob(document.getElementById('b64In').value)}catch(e){alert('Invalid Base64')}" class="tool-action full-width">Decode</button>
                </div>
            </div>
        `;
    },

    // 3. Hash Gen
    renderHash: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <input type="text" id="hashIn" class="glass-input" placeholder="Text input">
                <div style="display:flex; gap:5px; margin-top:10px; flex-wrap:wrap;">
                    <button onclick="DevTools.runHash('SHA-1')" class="tool-action">SHA-1</button>
                    <button onclick="DevTools.runHash('SHA-256')" class="tool-action">SHA-256</button>
                    <button onclick="DevTools.runHash('MD5')" class="tool-action">MD5 (Simulated)</button> 
                </div>
                <input type="text" id="hashOut" class="glass-input hidden" style="margin-top:10px; font-family:monospace;" readonly>
            </div>
        `;
    },
    runHash: async function (algo) {
        const txt = document.getElementById('hashIn').value;
        const out = document.getElementById('hashOut');
        if (algo === 'MD5') {
            out.value = "MD5 not secure/supported in WebCrypto. Use SHA-256.";
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
        container.innerHTML = `
            <div class="tool-ui-group">
                <textarea id="urlIn" class="glass-input" placeholder="URL text..."></textarea>
                <div style="display:flex; gap:10px; margin-top:10px;">
                     <button onclick="document.getElementById('urlIn').value = encodeURIComponent(document.getElementById('urlIn').value)" class="btn-primary full-width">Encode</button>
                     <button onclick="document.getElementById('urlIn').value = decodeURIComponent(document.getElementById('urlIn').value)" class="tool-action full-width">Decode</button>
                </div>
            </div>
        `;
    },

    // 5. Regex Tester
    renderRegex: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <input type="text" id="regPat" class="glass-input" placeholder="Pattern (e.g. ^[a-z]+$)">
                <textarea id="regTxt" class="glass-input" style="margin-top:10px;" placeholder="Test String"></textarea>
                <button onclick="DevTools.testReg()" class="btn-primary full-width" style="margin-top:10px;">Test</button>
                <div id="regRes" style="margin-top:10px; font-weight:bold;"></div>
            </div>
        `;
    },
    testReg: function () {
        try {
            const p = new RegExp(document.getElementById('regPat').value);
            const t = document.getElementById('regTxt').value;
            const m = p.test(t);
            const el = document.getElementById('regRes');
            el.innerText = m ? "Match Found!" : "No Match";
            el.style.color = m ? "#2ecc71" : "#e74c3c";
        } catch (e) { alert(e.message); }
    },

    // 6. Diff Checker
    renderDiff: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    <textarea id="diffA" class="glass-input" placeholder="Text A" style="height:100px;"></textarea>
                    <textarea id="diffB" class="glass-input" placeholder="Text B" style="height:100px;"></textarea>
                </div>
                <button onclick="DevTools.runDiff()" class="btn-primary full-width" style="margin-top:10px;">Compare</button>
                <div id="diffRes" style="margin-top:10px; font-size:0.9em; white-space:pre-wrap;"></div>
            </div>
        `;
    },
    runDiff: function () {
        const a = document.getElementById('diffA').value;
        const b = document.getElementById('diffB').value;
        const res = document.getElementById('diffRes');

        if (a === b) {
            res.innerHTML = "<span style='color:#2ecc71'>Texts are identical.</span>";
        } else {
            res.innerHTML = "<span style='color:#e74c3c'>Texts differ.</span> Length: " + a.length + " vs " + b.length;
        }
    }
};

window.DevTools = DevTools;
