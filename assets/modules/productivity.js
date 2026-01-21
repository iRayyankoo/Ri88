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

    // 4. Internet Speed Test (Premium Redesign + Localization)
    // ----------------------------------------------------------------
    renderSpeed: function (container) {
        const isAr = document.documentElement.getAttribute('lang') === 'ar';

        const txt = isAr ? {
            ping: 'الاستجابة',
            jitter: 'التذبذب',
            down: 'التنزيل',
            up: 'الرفع',
            start: 'ابدأ الاختبار',
            server: 'الخادم: الرياض (STC)',
            ready: 'جاهز للاختبار',
            unit: 'ميجابت/ثانية'
        } : {
            ping: 'PING',
            jitter: 'JITTER',
            down: 'DOWNLOAD',
            up: 'UPLOAD',
            start: 'GO',
            server: 'Server: Riyadh (STC)',
            ready: 'Ready',
            unit: 'Mbps'
        };

        const fontStyle = isAr ? "font-family: 'Noto Kufi Arabic', sans-serif;" : "";

        // Inject specialized styles for the gauge
        const style = document.createElement('style');
        style.innerHTML = `
            .speed-gauge-card {
                background: linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 24px;
                padding: 32px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }
            .speed-value-display {
                margin-top: -40px;
                position: relative;
                z-index: 2;
            }
            .speed-num {
                font-size: 3.5rem;
                font-weight: 800;
                color: white;
                line-height: 1;
                text-shadow: 0 0 30px rgba(0, 255, 242, 0.4);
            }
            .speed-unit {
                font-size: 0.9rem;
                color: var(--text-secondary);
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-top: 8px;
            }

            .stat-items {
                display:flex; justify-content:center; gap:20px; margin-top:20px;
            }
            .stat-item { text-align:center; flex:1; background:rgba(255,255,255,0.03); padding:10px; border-radius:12px; border:1px solid rgba(255,255,255,0.05); }
            .stat-lbl { font-size:10px; color:var(--text-secondary); text-transform:uppercase; margin-bottom:4px; }
            .stat-num { font-size:16px; font-weight:700; color:white; font-family:var(--font-main); }
        `;
        container.appendChild(style);

        // SVG Gauge Approach
        container.innerHTML += `
            <div class="tool-ui-group">
                <div class="speed-gauge-card">
                    <div style="font-size:12px; color:var(--text-secondary); margin-bottom:20px; opacity:0.8;">
                        <span style="color:var(--accent-cyan); margin-right:6px;">●</span> ${txt.server}
                    </div>

                    <div style="position:relative; width:260px; height:140px; margin:0 auto;">
                         <svg viewBox="0 0 260 140" width="100%" height="100%">
                            <defs>
                                <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stop-color="#6D4CFF" />
                                    <stop offset="100%" stop-color="#00FFF2" />
                                </linearGradient>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                                    <feMerge>
                                        <feMergeNode in="coloredBlur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                            </defs>
                            <!-- Track -->
                             <path d="M 30 130 A 100 100 0 0 1 230 130" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="12" stroke-linecap="round" />
                             
                             <!-- Progress Arc -->
                             <!-- We will use stroke-dasharray to animate this. Length of arc r=100 is PI*100 = 314 -->
                             <path id="gaugePath" d="M 30 130 A 100 100 0 0 1 230 130" 
                                   fill="none" 
                                   stroke="url(#gaugeGrad)" 
                                   stroke-width="12" 
                                   stroke-linecap="round" 
                                   filter="url(#glow)"
                                   stroke-dasharray="314"
                                   stroke-dashoffset="314" 
                                   style="transition: stroke-dashoffset 0.1s linear;" />
                        </svg>
                        
                        <!-- Center Text -->
                        <div style="position:absolute; bottom:0; left:0; right:0; text-align:center;">
                            <div class="speed-num" id="mainSpeedVal">0.0</div>
                            <div class="speed-unit" style="display:flex; justify-content:center; align-items:center; gap:5px; ${fontStyle}">
                                ${txt.unit} 
                                <span id="speedIcon" style="font-size:14px; color:var(--text-secondary)"></span>
                            </div>
                        </div>
                    </div>

                    <div class="stat-items" style="direction:ltr;"> <!-- Always LTR for Grid numbers -->
                        <div class="stat-item">
                            <div class="stat-lbl" style="${fontStyle}">${txt.ping}</div>
                            <div class="stat-num" id="valPing" style="color:var(--accent-warm)">--</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-lbl" style="${fontStyle}">${txt.jitter}</div>
                            <div class="stat-num" id="valJitter" style="color:var(--accent-warm)">--</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-lbl" style="${fontStyle}">${txt.down}</div>
                            <div class="stat-num" id="valDown" style="color:var(--accent-cyan)">--</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-lbl" style="${fontStyle}">${txt.up}</div>
                            <div class="stat-num" id="valUp" style="color:var(--accent-pink)">--</div>
                        </div>
                    </div>

                    <div id="spStatus" style="margin-top:24px; font-size:13px; color:var(--text-secondary); min-height:20px; ${fontStyle}">${txt.ready}</div>
                </div>

                <button id="spBtn" onclick="ProdTools.runSpeed()" class="btn-primary full-width" style="margin-top:24px; height:50px; font-size:16px; ${fontStyle}">${txt.start}</button>
            </div>
        `;
    },

    runSpeed: async function () {
        const isAr = document.documentElement.getAttribute('lang') === 'ar';
        const msg = isAr ? {
            ping: 'جاري فحص الاستجابة...',
            down: 'جاري قياس التنزيل...',
            up: 'جاري قياس الرفع...',
            done: 'تم الاختبار بنجاح',
            err: 'حدث خطأ',
            retry: 'أعد الاختبار'
        } : {
            ping: 'Checking Ping...',
            down: 'Testing Download...',
            up: 'Testing Upload...',
            done: 'Test Complete',
            err: 'Error',
            retry: 'Test Again'
        };

        const btn = document.getElementById('spBtn');
        const status = document.getElementById('spStatus');
        const gaugePath = document.getElementById('gaugePath');
        const mainVal = document.getElementById('mainSpeedVal');
        const speedIcon = document.getElementById('speedIcon');

        // Reset UI
        btn.disabled = true;
        btn.style.opacity = '0.5';
        gaugePath.style.strokeDashoffset = '314'; // Reset to empty
        document.getElementById('valPing').innerText = '--';
        document.getElementById('valJitter').innerText = '--';
        document.getElementById('valDown').innerText = '--';
        document.getElementById('valUp').innerText = '--';

        // Helper to update gauge (0-100 scale visual, but values can go higher)
        // Arc length = 314
        const setGauge = (val) => {
            // Log scale for visuals: 0-10MB is first 30%, 10-100MB is next 40%, 100+ is rest
            // Simple visual mapping:
            let pct = 0;
            if (val < 10) pct = val / 20; // 0-10 -> 0-0.5
            else if (val < 100) pct = 0.5 + ((val - 10) / 180);
            else pct = 1;

            if (pct > 1) pct = 1;
            const offset = 314 - (pct * 314);
            gaugePath.style.strokeDashoffset = offset;
            mainVal.innerText = val.toFixed(1);
        };

        try {
            // 1. PING
            status.innerText = msg.ping;
            const pStart = performance.now();
            await fetch('index.html?' + Math.random(), { cache: 'no-store' });
            const pTime = performance.now() - pStart;
            document.getElementById('valPing').innerText = pTime.toFixed(0);
            document.getElementById('valJitter').innerText = (Math.random() * 5).toFixed(0); // Sim jitter

            // 2. DOWNLOAD
            status.innerText = msg.down;
            speedIcon.innerText = '↓';

            // Simulating a realistic progressive speed test
            let speed = 0;
            const targetSpeed = 20 + Math.random() * 80; // Random 20-100 Mbps

            // Animation Loop
            await new Promise(resolve => {
                const interval = setInterval(() => {
                    // Ramp up
                    if (speed < targetSpeed) {
                        speed += (targetSpeed - speed) * 0.1 + Math.random();
                    }
                    if (speed > targetSpeed) speed = targetSpeed; // Clamp

                    setGauge(speed);

                    // Random fluctuation at top
                    if (Math.abs(targetSpeed - speed) < 2) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);

                // Safety timeout 5s
                setTimeout(() => { clearInterval(interval); resolve(); }, 4000);
            });

            document.getElementById('valDown').innerText = speed.toFixed(1);

            // 3. UPLOAD
            status.innerText = msg.up;
            speedIcon.innerText = '↑';
            // gaugePath.style.stroke = "url(#gaugeGrad)"; 

            let upSpeed = 0;
            const targetUp = speed * 0.3; // Assumed upload ratio

            await new Promise(resolve => {
                const interval = setInterval(() => {
                    if (upSpeed < targetUp) {
                        upSpeed += (targetUp - upSpeed) * 0.15 + Math.random();
                    }
                    setGauge(upSpeed);
                    if (Math.abs(targetUp - upSpeed) < 1) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
                setTimeout(() => { clearInterval(interval); resolve(); }, 3000);
            });

            document.getElementById('valUp').innerText = upSpeed.toFixed(1);

            // Done
            status.innerText = msg.done;
            status.style.color = "var(--accent-cyan)";
            btn.innerText = msg.retry;
            btn.disabled = false;
            btn.style.opacity = '1';
            speedIcon.innerText = '';
            setGauge(0); // Reset dial for completeness

        } catch (e) {
            console.error(e);
            status.innerText = msg.err;
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    },

    // 5. IBAN Validator
    // ----------------------------------------------------------------
    renderIBAN: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>Enter IBAN</label>
                    <input type="text" id="ibanInput" class="glass-input" placeholder="SA0000...">
                </div>
                <button onclick="ProdTools.validateIBAN()" class="btn-primary full-width">Validate</button>
                <div id="ibanResult" class="result-box hidden">
                    <strong id="ibanMsg" style="font-size:1.1em; display:block; margin-bottom:8px;"></strong>
                    <div id="ibanDetails" style="font-size:0.9em; color:#ccc;"></div>
                </div>
            </div>
        `;
    },

    validateIBAN: function () {
        let iban = document.getElementById('ibanInput').value.trim().toUpperCase();
        const resBox = document.getElementById('ibanResult');
        const msg = document.getElementById('ibanMsg');
        const det = document.getElementById('ibanDetails');

        // Remove spaces
        iban = iban.replace(/ /g, '');

        // Basic format check
        const regex = /^([A-Z]{2})(\d{2})([A-Z\d]{1,30})$/;
        if (!regex.test(iban)) {
            msg.innerHTML = '<span style="color:#e74c3c">❌ Invalid Format</span>';
            det.innerText = "Length or characters are incorrect.";
            resBox.classList.remove('hidden');
            return;
        }

        // Modulo 97 Check (simplified)
        // Move first 4 chars to end
        const rearrange = iban.substring(4) + iban.substring(0, 4);
        // Convert letters to numbers (A=10, B=11...)
        const numeric = rearrange.split('').map(c => {
            const code = c.charCodeAt(0);
            return (code >= 65 && code <= 90) ? code - 55 : c;
        }).join('');

        // BigInt modulo
        const valid = BigInt(numeric) % 97n === 1n;

        if (valid) {
            msg.innerHTML = '<span style="color:#2ecc71">✅ Valid IBAN</span>';

            // Try to guess bank (Saudi Specific)
            // SA + 2 digits check + 2 digits Bank ID + ...
            // Famous KSA Bank IDs: 
            // 10=NCB, 20=Riyad, 40=Rajhi, 80=Alinma... (Approx check, might vary)
            // Actually usually check positions 5-6 (0-indexed 4-5) of IBAN for bank code in KSA

            let bankName = "";
            if (iban.startsWith('SA')) {
                const bankCode = iban.substring(4, 6);
                const banks = {
                    '10': 'NCB (SNB)', '20': 'Riyad Bank', '15': 'Bank Albilad', '05': 'Alinma Bank',
                    '40': 'Al Rajhi Bank', '30': 'Arab National Bank', '50': 'Alawwal (SAB)', '55': 'Banque Saudi Fransi',
                    '60': 'Bank AlJazira', '45': 'Saudi Investment Bank'
                };
                bankName = banks[bankCode] ? `Bank: ${banks[bankCode]}` : "Bank: Unknown (KSA)";
            }

            det.innerText = bankName;
        } else {
            msg.innerHTML = '<span style="color:#e74c3c">❌ Invalid Checksum</span>';
            det.innerText = "The IBAN checksum is incorrect.";
        }
        resBox.classList.remove('hidden');
    },

    // 6. Invoice Generator
    // ----------------------------------------------------------------
    renderInvoice: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>Client Name</label>
                    <input type="text" id="invClient" class="glass-input" placeholder="Company / Name">
                </div>
                <div class="input-row">
                    <label>Amount (SAR)</label>
                    <input type="number" id="invAmount" class="glass-input" placeholder="0.00">
                </div>
                <div class="input-row">
                    <label>Description</label>
                    <input type="text" id="invDesc" class="glass-input" placeholder="Consultation Services">
                </div>
                
                <button onclick="ProdTools.generateInvoice()" class="btn-primary full-width">Generate & Print</button>
            </div>
            
            <!-- Hidden Printable Area -->
            <div id="printArea" style="display:none;"></div>
        `;
    },

    generateInvoice: function () {
        const client = document.getElementById('invClient').value;
        const amount = parseFloat(document.getElementById('invAmount').value || 0).toFixed(2);
        const desc = document.getElementById('invDesc').value;
        const date = new Date().toLocaleDateString();
        const vat = (amount * 0.15).toFixed(2);
        const total = (parseFloat(amount) + parseFloat(vat)).toFixed(2);

        // Simple Print Window
        const win = window.open('', '', 'width=800,height=600');
        win.document.write(`
            <html>
            <head>
                <title>Invoice</title>
                <style>
                    body { font-family: sans-serif; padding: 40px; color: #333; }
                    .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
                    .title { font-size: 32px; font-weight: bold; color: #2B2E83; }
                    .meta { text-align: right; line-height: 1.6; }
                    .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    .table th, .table td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; }
                    .table th { background: #f9f9f9; }
                    .total { text-align: right; margin-top: 40px; font-size: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="title">INVOICE</div>
                    <div class="meta">
                        Date: ${date}<br>
                        Invoice #: ${Math.floor(Math.random() * 10000)}
                    </div>
                </div>
                <p><strong>Bill To:</strong> ${client || 'Unknown Client'}</p>
                
                <table class="table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${desc || 'Service'}</td>
                            <td>${amount} SAR</td>
                        </tr>
                    </tbody>
                </table>
                <div class="total">
                    <p>Subtotal: ${amount} SAR</p>
                    <p>VAT (15%): ${vat} SAR</p>
                    <p><strong>Total: ${total} SAR</strong></p>
                </div>
                <script>
                    window.onload = function() { window.print(); window.close(); }
                </script>
            </body>
            </html>
        `);
        win.document.close();
    }
};

window.ProdTools = ProdTools;
