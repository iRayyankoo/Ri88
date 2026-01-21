/**
 * Productivity Tools Module
 * Logic for QR Generator, Unit Converter
 */

const ProdTools = {
    // 1. QR Code Generator
    // ----------------------------------------------------------------
    renderQR: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group" style="text-align:center;">
                <div class="input-row">
                    <label>Enter Text or URL</label>
                    <input type="text" id="qrInput" class="glass-input" placeholder="https://example.com" value="https://ri88.info">
                </div>
                <button onclick="ProdTools.generateQR()" class="btn-primary full-width">Generate QR Code</button>
                
                <div id="qrResult" class="result-box hidden" style="margin-top:20px;">
                    <img id="qrImage" src="" alt="QR Code" style="border-radius:12px; border:4px solid white; max-width:200px;">
                    <p style="font-size:12px; color:#aaa; margin-top:8px;">Right click to save image</p>
                </div>
            </div>
        `;
    },

    generateQR: function () {
        const text = document.getElementById('qrInput').value.trim();
        if (!text) return;

        // Using publicly available API for static QR generation to avoid heavy libs
        const size = "300x300";
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${encodeURIComponent(text)}`;

        const img = document.getElementById('qrImage');
        img.src = url;
        img.onload = () => document.getElementById('qrResult').classList.remove('hidden');
    },

    // 2. Unit Converter
    // ----------------------------------------------------------------
    renderUnit: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>Value</label>
                    <input type="number" id="unitVal" class="glass-input" placeholder="10">
                </div>
                <div style="display:flex; gap:16px;">
                    <div class="input-row" style="flex:1;">
                        <label>Type</label>
                        <select id="unitType" class="glass-input" onchange="ProdTools.updateUnits()">
                            <option value="len">Length</option>
                            <option value="wgt">Weight</option>
                            <option value="tmp">Temp</option>
                        </select>
                    </div>
                </div>
                <div style="display:flex; gap:16px;">
                    <div class="input-row" style="flex:1;">
                        <label>From</label>
                        <select id="uFrom" class="glass-input"></select>
                    </div>
                    <div class="input-row" style="flex:1;">
                        <label>To</label>
                        <select id="uTo" class="glass-input"></select>
                    </div>
                </div>
                
                <button onclick="ProdTools.convertUnit()" class="btn-primary full-width">Convert</button>
                
                <div id="unitResult" class="result-box hidden" style="text-align:center;">
                    <strong id="resUnit" style="font-size:2em; color:var(--accent-pink);">-</strong>
                </div>
            </div>
        `;
        this.updateUnits(); // Init
    },

    updateUnits: function () {
        const type = document.getElementById('unitType').value;
        const from = document.getElementById('uFrom');
        const to = document.getElementById('uTo');
        let opts = [];

        if (type === 'len') opts = ['Meters', 'Kilometers', 'Feet', 'Miles'];
        else if (type === 'wgt') opts = ['Kilograms', 'Grams', 'Pounds', 'Ounces'];
        else if (type === 'tmp') opts = ['Celsius', 'Fahrenheit', 'Kelvin'];

        const html = opts.map(o => `<option value="${o}">${o}</option>`).join('');
        from.innerHTML = html;
        to.innerHTML = html;

        // Default diversity
        to.selectedIndex = 1;
    },

    convertUnit: function () {
        const val = parseFloat(document.getElementById('unitVal').value);
        if (isNaN(val)) return;

        const from = document.getElementById('uFrom').value;
        const to = document.getElementById('uTo').value;
        const type = document.getElementById('unitType').value;

        let result = val;

        // Simple Conversion Logic
        if (from === to) {
            result = val;
        } else if (type === 'len') {
            const meters = { 'Meters': 1, 'Kilometers': 1000, 'Feet': 0.3048, 'Miles': 1609.34 };
            const valInMeters = val * meters[from];
            result = valInMeters / meters[to];
        } else if (type === 'wgt') {
            const grams = { 'Grams': 1, 'Kilograms': 1000, 'Pounds': 453.592, 'Ounces': 28.3495 };
            const valInGrams = val * grams[from];
            result = valInGrams / grams[to];
        } else if (type === 'tmp') {
            if (from === 'Celsius') {
                if (to === 'Fahrenheit') result = (val * 9 / 5) + 32;
                if (to === 'Kelvin') result = val + 273.15;
            } else if (from === 'Fahrenheit') {
                if (to === 'Celsius') result = (val - 32) * 5 / 9;
                if (to === 'Kelvin') result = (val - 32) * 5 / 9 + 273.15;
            } else if (from === 'Kelvin') {
                if (to === 'Celsius') result = val - 273.15;
                if (to === 'Fahrenheit') result = (val - 273.15) * 9 / 5 + 32;
            }
        }

        document.getElementById('resUnit').innerText = result.toFixed(2) + ' ' + to;
        document.getElementById('unitResult').classList.remove('hidden');
        document.getElementById('resUnit').innerText = result.toFixed(2) + ' ' + to;
        document.getElementById('unitResult').classList.remove('hidden');
    },

    // 3. Password Generator
    // ----------------------------------------------------------------
    renderPass: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>Length: <span id="passLenVal">12</span></label>
                    <input type="range" id="passLen" min="6" max="32" value="12" class="glass-input" oninput="document.getElementById('passLenVal').innerText=this.value">
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:16px;">
                    <label class="check-label"><input type="checkbox" id="passUpper" checked> ABC</label>
                    <label class="check-label"><input type="checkbox" id="passLower" checked> abc</label>
                    <label class="check-label"><input type="checkbox" id="passNum" checked> 123</label>
                    <label class="check-label"><input type="checkbox" id="passSym" checked> !@#</label>
                </div>
                <button onclick="ProdTools.genPass()" class="btn-primary full-width">Generate Password</button>
                
                <div id="passResult" class="result-box hidden">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <input type="text" id="passOutput" class="glass-input" style="flex:1; font-family:monospace; margin-right:8px;" readonly>
                        <button onclick="ProdTools.copyPass()" class="tool-action">Copy</button>
                    </div>
                    <div id="passStrength" style="height:4px; background:#444; margin-top:8px; border-radius:2px; transition:0.3s;"></div>
                    <small id="passStrText" style="color:#aaa;">Strength: -</small>
                </div>
            </div>
        `;
    },

    genPass: function () {
        const len = parseInt(document.getElementById('passLen').value);
        const hasUpper = document.getElementById('passUpper').checked;
        const hasLower = document.getElementById('passLower').checked;
        const hasNum = document.getElementById('passNum').checked;
        const hasSym = document.getElementById('passSym').checked;

        let chars = '';
        if (hasUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (hasLower) chars += 'abcdefghijklmnopqrstuvwxyz';
        if (hasNum) chars += '0123456789';
        if (hasSym) chars += '!@#$%^&*()_+{}[]|:;<>?';

        if (!chars) return;

        let pass = '';
        // Ensure at least one of each selected type? For now simple random.
        for (let i = 0; i < len; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const out = document.getElementById('passOutput');
        out.value = pass;

        // Simple Strength Calc
        let strength = 0;
        if (len >= 8) strength++;
        if (len >= 12) strength++;
        if (hasUpper && hasLower) strength++;
        if (hasNum) strength++;
        if (hasSym) strength++;

        const bar = document.getElementById('passStrength');
        const strText = document.getElementById('passStrText');
        document.getElementById('passResult').classList.remove('hidden');

        if (strength <= 2) { bar.style.background = '#e74c3c'; strText.innerText = 'Strength: Weak'; }
        else if (strength <= 4) { bar.style.background = '#f1c40f'; strText.innerText = 'Strength: Medium'; }
        else { bar.style.background = '#2ecc71'; strText.innerText = 'Strength: Strong'; }
    },

    copyPass: function () {
        const pass = document.getElementById('passOutput');
        pass.select();
        document.execCommand('copy');
        alert('Copied!');
    },

    // 4. Internet Speed Test
    // ----------------------------------------------------------------
    renderSpeed: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group" style="text-align:center;">
                <p style="color:var(--text-secondary); margin-bottom:20px;">Lightweight browser-based latency & download check.</p>
                
                <div style="display:flex; justify-content:center; gap:40px; margin-bottom:30px;">
                    <div>
                        <div style="font-size:0.9em; opacity:0.7; margin-bottom:5px;">Latency</div>
                        <div id="spPing" style="font-size:1.8em; font-weight:bold; color:var(--text-primary);">-- <span style="font-size:0.6em">ms</span></div>
                    </div>
                    <div>
                        <div style="font-size:0.9em; opacity:0.7; margin-bottom:5px;">Download</div>
                        <div id="spDown" style="font-size:1.8em; font-weight:bold; color:var(--accent-pink);">-- <span style="font-size:0.6em">Mbps</span></div>
                    </div>
                </div>

                <div id="spProgress" style="width:100%; height:6px; background:var(--glass-border); border-radius:3px; margin-bottom:20px; overflow:hidden; display:none;">
                    <div id="spBar" style="width:0%; height:100%; background:var(--accent-cyan); transition:width 0.3s ease;"></div>
                </div>

                <div id="spErr" class="hidden" style="color:#e74c3c; font-size:0.9em; margin-bottom:10px;"></div>

                <button id="spBtn" onclick="ProdTools.runSpeed()" class="btn-primary full-width">Start Speed Test</button>
                <p style="font-size:11px; opacity:0.5; margin-top:12px;">*Browser-based estimate only. For precision use Speedtest.net</p>
            </div>
        `;
    },

    runSpeed: function () {
        const btn = document.getElementById('spBtn');
        const pingEl = document.getElementById('spPing');
        const downEl = document.getElementById('spDown');
        const prog = document.getElementById('spProgress');
        const bar = document.getElementById('spBar');

        btn.disabled = true;
        btn.innerText = "Testing...";
        prog.style.display = 'block';
        bar.style.width = '10%';

        // 1. Latency (Ping)
        // Check local favicon or tiny asset
        const start = performance.now();
        fetch('assets/icons/favicon.ico?' + Math.random(), { cache: 'no-store' })
            .then(() => {
                const p = (performance.now() - start).toFixed(0);
                pingEl.innerText = p + ' ms';
                bar.style.width = '40%';

                // 2. Download Speed
                // 1MB Image
                const startTime = performance.now();
                const dlSize = 1000000; // ~1MB assumption roughly
                // Using a reliable CDN image (~500KB - 1MB)
                const imgUrl = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1080&q=80&" + Math.random();

                // We preload image to measure time
                const download = new Image();
                download.onload = function () {
                    const duration = (performance.now() - startTime) / 1000; // seconds
                    const bitsLoaded = dlSize * 8;
                    const speedBps = bitsLoaded / duration;
                    const speedMbps = (speedBps / 1024 / 1024).toFixed(2);

                    downEl.innerText = speedMbps + ' Mbps';
                    bar.style.width = '100%';
                    btn.innerText = "Test Again";
                    btn.disabled = false;
                };
                download.onerror = function () {
                    downEl.innerText = "Error";
                    bar.style.width = '100%';
                    btn.innerText = "Retry";
                    btn.disabled = false;
                };
                download.src = imgUrl;

            })
            .catch(() => {
                pingEl.innerText = "Error";
                btn.disabled = false;
            });
    }
};

window.ProdTools = ProdTools;
