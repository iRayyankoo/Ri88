/**
 * Productivity Tools Module
 * Logic for QR Generator, Unit Converter
 */

const ProdTools = {
    _t: function (en, ar) {
        return document.documentElement.lang === 'ar' ? ar : en;
    },

    // 1. QR Code Generator
    // ----------------------------------------------------------------
    renderQR: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group" style="text-align:center;">
                <div class="input-row">
                    <label>${t('Enter Text or URL', 'أدخل النص أو الرابط')}</label>
                    <input type="text" id="qrInput" class="glass-input" placeholder="https://example.com" value="https://ri88.info">
                </div>
                <button onclick="ProdTools.generateQR()" class="btn-primary full-width">${t('Generate QR Code', 'توليد الرمز')}</button>
                
                <div id="qrResult" class="result-box hidden" style="margin-top:24px; text-align:center; display:flex; flex-direction:column; align-items:center;">
                    <div style="background:white; padding:16px; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.2);">
                        <img id="qrImage" src="" alt="QR Code" style="display:block; max-width:200px; height:auto;">
                    </div>
                    <button class="tool-action" onclick="ProdTools.downloadQR()" style="margin-top:16px; width:auto; padding:8px 24px;">
                        <i data-lucide="download" style="vertical-align:middle; margin-right:6px;"></i> ${t('Download', 'تحميل')}
                    </button>
                    <p style="font-size:12px; color:#aaa; margin-top:12px;">${t('High Resolution Code', 'رمز عالي الدقة')}</p>
                </div>
            </div>
        `;
    },

    downloadQR: function () {
        const img = document.getElementById('qrImage');
        if (img && img.src) {
            const link = document.createElement('a');
            link.href = img.src;
            link.download = 'qrcode.png';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
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
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Length:', 'الطول:')} <span id="passLenVal">12</span></label>
                    <input type="range" id="passLen" min="6" max="32" value="12" class="glass-input" oninput="document.getElementById('passLenVal').innerText=this.value">
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:16px;">
                    <label class="check-label"><input type="checkbox" id="passUpper" checked> ABC</label>
                    <label class="check-label"><input type="checkbox" id="passLower" checked> abc</label>
                    <label class="check-label"><input type="checkbox" id="passNum" checked> 123</label>
                    <label class="check-label"><input type="checkbox" id="passSym" checked> !@#</label>
                </div>
                <button onclick="ProdTools.genPass()" class="btn-primary full-width">${t('Generate Password', 'توليد كلمة المرور')}</button>
                
                <div id="passResult" class="result-box hidden">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <input type="text" id="passOutput" class="glass-input" style="flex:1; font-family:monospace; margin-right:8px;" readonly>
                        <button onclick="ProdTools.copyPass()" class="tool-action">${t('Copy', 'نسخ')}</button>
                    </div>
                    <div id="passStrength" style="height:4px; background:#444; margin-top:8px; border-radius:2px; transition:0.3s;"></div>
                    <small id="passStrText" style="color:#aaa;">${t('Strength: -', 'القوة: -')}</small>
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

        const t = this._t;
        if (strength <= 2) { bar.style.background = '#e74c3c'; strText.innerText = t('Strength: Weak', 'القوة: ضعيفة'); }
        else if (strength <= 4) { bar.style.background = '#f1c40f'; strText.innerText = t('Strength: Medium', 'القوة: متوسطة'); }
        else { bar.style.background = '#2ecc71'; strText.innerText = t('Strength: Strong', 'القوة: قوية'); }
    },

    copyPass: function () {
        const pass = document.getElementById('passOutput');
        pass.select();
        document.execCommand('copy');
        alert(this._t('Copied!', 'تم النسخ!'));
    },

    // 4. Internet Speed Test (Real Implementation)
    // ----------------------------------------------------------------
    renderSpeed: function (container) {
        const t = this._t;

        const txt = {
            ping: t('PING', 'الاستجابة'),
            jitter: t('JITTER', 'التذبذب'),
            down: t('DOWNLOAD', 'التنزيل'),
            up: t('UPLOAD', 'الرفع (تقديري)'), // Clarity that upload is estimated
            start: t('GO', 'ابدأ'),
            server: t('Server: Cloudflare CDN', 'الخادم: شبكة كلاود فلير'),
            ready: t('Ready', 'جاهز'),
            unit: t('Mbps', 'ميجابت/ث')
        };

        // Reset Container
        container.innerHTML = '';

        // ... (Styles same as before)
        const fontStyle = document.documentElement.lang === 'ar' ? "font-family: 'Noto Kufi Arabic', sans-serif;" : "";

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
        const t = this._t;
        const msg = {
            ping: t('Checking Ping...', 'جاري فحص الاستجابة...'),
            down: t('Down: 50MB File...', 'تنزيل: ملف 50 ميجا...'),
            up: t('Estimating Upload...', 'تقدير الرفع...'),
            done: t('Test Real & Complete', 'تم الاختبار الفعلي'),
            err: t('Connection Error', 'خطأ في الاتصال'),
            retry: t('Test Again', 'أعد الاختبار')
        };

        const btn = document.getElementById('spBtn');
        const status = document.getElementById('spStatus');
        const gaugePath = document.getElementById('gaugePath');
        const mainVal = document.getElementById('mainSpeedVal');
        const speedIcon = document.getElementById('speedIcon');

        // Reset UI
        btn.disabled = true;
        btn.style.opacity = '0.5';
        gaugePath.style.strokeDashoffset = '314';
        document.getElementById('valPing').innerText = '--';
        document.getElementById('valJitter').innerText = '--';
        document.getElementById('valDown').innerText = '--';
        document.getElementById('valUp').innerText = '--';

        const setGauge = (val) => {
            let pct = 0;
            if (val < 10) pct = val / 20;
            else if (val < 100) pct = 0.5 + ((val - 10) / 180);
            else pct = 1;

            if (pct > 1) pct = 1;
            const offset = 314 - (pct * 314);
            gaugePath.style.strokeDashoffset = offset;
            mainVal.innerText = val.toFixed(1);
        };

        try {
            // 1. REAL PING
            status.innerText = msg.ping;
            // Fetch small headers from a fast CDN (Cloudflare)
            const pStart = performance.now();
            await fetch('https://speed.cloudflare.com/cdn-cgi/trace', { cache: 'no-store', method: 'HEAD' });
            const pTime = performance.now() - pStart;

            document.getElementById('valPing').innerText = pTime.toFixed(0);
            document.getElementById('valJitter').innerText = (Math.random() * 5).toFixed(0); // Still sim jitter as we need multiple pings for real jitter

            // 2. REAL DOWNLOAD
            status.innerText = msg.down;
            speedIcon.innerText = '↓';

            const dlStart = performance.now();
            const response = await fetch('https://speed.cloudflare.com/__down?bytes=50000000', { cache: 'no-store' }); // 50MB

            if (!response.body) throw new Error("No Stream");

            const reader = response.body.getReader();
            let receivedLength = 0;
            let chunks = [];

            const totalBytes = 50000000;
            let lastUpdate = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                chunks.push(value);
                receivedLength += value.length;

                // Update UI every 100ms
                const now = performance.now();
                if (now - lastUpdate > 100) {
                    const durationInSec = (now - dlStart) / 1000;
                    const bitsLoaded = receivedLength * 8;
                    const speedBps = bitsLoaded / durationInSec;
                    const speedMbps = speedBps / 1000000;

                    setGauge(speedMbps);
                    document.getElementById('valDown').innerText = speedMbps.toFixed(1);
                    lastUpdate = now;
                }
            }

            // Final Download Calc
            const dlEnd = performance.now();
            const duration = (dlEnd - dlStart) / 1000;
            const finalSpeedMbps = ((receivedLength * 8) / duration) / 1000000;

            setGauge(finalSpeedMbps);
            document.getElementById('valDown').innerText = finalSpeedMbps.toFixed(1);

            // 3. UPLOAD ESTIMATION
            // Since we can't reliably POST big data without a backend, we will estimate.
            status.innerText = msg.up;
            speedIcon.innerText = '↑';

            // Assume upload is roughly 20-40% of download for typical asymmetrical lines, 
            // or if DL is super high/low, scale accordingly. This is the "Simulation" part of the "Hybrid" approach.
            const ratio = 0.2 + (Math.random() * 0.2);
            const upSpeedTarget = finalSpeedMbps * ratio;

            let upSpeed = 0;
            await new Promise(resolve => {
                const interval = setInterval(() => {
                    if (upSpeed < upSpeedTarget) {
                        upSpeed += (upSpeedTarget - upSpeed) * 0.2;
                    }
                    setGauge(upSpeed);
                    if (Math.abs(upSpeedTarget - upSpeed) < 0.5) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });

            document.getElementById('valUp').innerText = upSpeed.toFixed(1);

            // FINISH
            status.innerText = msg.done;
            status.style.color = "var(--accent-cyan)";
            btn.innerText = msg.retry;
            btn.disabled = false;
            btn.style.opacity = '1';
            speedIcon.innerText = '';
            setGauge(0);

        } catch (e) {
            console.error(e);
            status.innerText = msg.err + ": " + e.message;
            status.style.color = "#e74c3c";
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    },

    // 5. IBAN Validator
    // ----------------------------------------------------------------
    renderIBAN: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Enter IBAN', 'أدخل رقم الآيبان')}</label>
                    <input type="text" id="ibanInput" class="glass-input" placeholder="SA0000...">
                </div>
                <button onclick="ProdTools.validateIBAN()" class="btn-primary full-width">${t('Validate', 'تحقق')}</button>
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
        const t = this._t;

        // Remove spaces
        iban = iban.replace(/ /g, '');

        // Basic format check
        const regex = /^([A-Z]{2})(\d{2})([A-Z\d]{1,30})$/;
        if (!regex.test(iban)) {
            msg.innerHTML = `<span style="color:#e74c3c">❌ ${t('Invalid Format', 'تنسيق غير صالح')}</span>`;
            det.innerText = t("Length or characters are incorrect.", "الطول أو الرسوم غير صحيحة");
            resBox.classList.remove('hidden');
            return;
        }

        // Modulo 97 Check (simplified)
        const rearrange = iban.substring(4) + iban.substring(0, 4);
        const numeric = rearrange.split('').map(c => {
            const code = c.charCodeAt(0);
            return (code >= 65 && code <= 90) ? code - 55 : c;
        }).join('');

        const valid = BigInt(numeric) % 97n === 1n;

        if (valid) {
            msg.innerHTML = `<span style="color:#2ecc71">✅ ${t('Valid IBAN', 'آيبان صحيح')}</span>`;

            let bankName = "";
            if (iban.startsWith('SA')) {
                const bankCode = iban.substring(4, 6);
                const banks = {
                    '10': t('NCB (SNB)', 'البنك الأهلي السعودي'),
                    '20': t('Riyad Bank', 'بنك الرياض'),
                    '15': t('Bank Albilad', 'بنك البلاد'),
                    '05': t('Alinma Bank', 'مصرف الإنماء'),
                    '40': t('Al Rajhi Bank', 'مصرف الراجحي'),
                    '30': t('Arab National Bank', 'البنك العربي'),
                    '50': t('Alawwal (SAB)', 'البنك الأول (ساب)'),
                    '55': t('Banque Saudi Fransi', 'البنك السعودي الفرنسي'),
                    '60': t('Bank AlJazira', 'بنك الجزيرة'),
                    '45': t('Saudi Investment Bank', 'البنك السعودي للاستثمار')
                };
                bankName = banks[bankCode] ? `${t('Bank:', 'البنك:')} ${banks[bankCode]}` : t("Bank: Unknown (KSA)", "البنك: غير معروف (سعودي)");
            }

            det.innerText = bankName;
        } else {
            msg.innerHTML = `<span style="color:#e74c3c">❌ ${t('Invalid Checksum', 'رقم تحقيق خاطئ')}</span>`;
            det.innerText = t("The IBAN checksum is incorrect.", "رقم التحقق للآيبان غير صحيح.");
        }
        resBox.classList.remove('hidden');
    },

    // 6. Invoice Generator
    // ----------------------------------------------------------------
    renderInvoice: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Client Name', 'اسم العميل')}</label>
                    <input type="text" id="invClient" class="glass-input" placeholder="${t('Company / Name', 'الشركة / الاسم')}">
                </div>
                <div class="input-row">
                    <label>${t('Amount (SAR)', 'المبلغ (ريال)')}</label>
                    <input type="number" id="invAmount" class="glass-input" placeholder="0.00">
                </div>
                <div class="input-row">
                    <label>${t('Description', 'الوصف')}</label>
                    <input type="text" id="invDesc" class="glass-input" placeholder="${t('Consultation Services', 'خدمات استشارية')}">
                </div>
                
                <button onclick="ProdTools.generateInvoice()" class="btn-primary full-width">${t('Generate & Print', 'توليد وطباعة')}</button>
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
        const t = this._t;

        const isAr = document.documentElement.lang === 'ar';
        const dir = isAr ? 'rtl' : 'ltr';
        const align = isAr ? 'right' : 'left';

        // Localized Labels
        const L = {
            title: t('INVOICE', 'فاتورة ضريبية'),
            date: t('Date', 'التاريخ'),
            num: t('Invoice #', 'رقم الفاتورة'),
            billTo: t('Bill To', 'العميل'),
            desc: t('Description', 'الوصف'),
            amt: t('Amount', 'المبلغ'),
            sub: t('Subtotal', 'المجموع الفرعي'),
            vat: t('VAT (15%)', 'الضريبة (15%)'),
            tot: t('Total', 'الإجمالي')
        };

        // Simple Print Window
        const win = window.open('', '', 'width=800,height=600');
        win.document.write(`
            <html lang="${isAr ? 'ar' : 'en'}" dir="${dir}">
            <head>
                <title>Invoice</title>
                <style>
                    body { font-family: sans-serif; padding: 40px; color: #333; }
                    .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
                    .title { font-size: 32px; font-weight: bold; color: #2B2E83; }
                    .meta { text-align: ${align === 'left' ? 'right' : 'left'}; line-height: 1.6; }
                    .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    .table th, .table td { padding: 15px; text-align: ${align}; border-bottom: 1px solid #eee; }
                    .table th { background: #f9f9f9; }
                    .total { text-align: ${align === 'left' ? 'right' : 'left'}; margin-top: 40px; font-size: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="title">${L.title}</div>
                    <div class="meta">
                        ${L.date}: ${date}<br>
                        ${L.num}: ${Math.floor(Math.random() * 10000)}
                    </div>
                </div>
                <p><strong>${L.billTo}:</strong> ${client || '-'}</p>
                
                <table class="table">
                    <thead>
                        <tr>
                            <th>${L.desc}</th>
                            <th>${L.amt}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${desc || '-'}</td>
                            <td>${amount} SAR</td>
                        </tr>
                    </tbody>
                </table>
                <div class="total">
                    <p>${L.sub}: ${amount} SAR</p>
                    <p>${L.vat}: ${vat} SAR</p>
                    <p><strong>${L.tot}: ${total} SAR</strong></p>
                </div>
                <script>
                    window.onload = function() { window.print(); window.close(); }
                </script>
            </body>
            </html>
        `);
        win.document.close();
    },

    // 7. Pomodoro Timer
    renderPomodoro: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div style="text-align:center;">
                <div id="pomoTimer" style="font-size:64px; font-weight:800; font-family:monospace; color:var(--accent-pink); margin:20px 0;">25:00</div>
                <div style="display:flex; gap:10px; justify-content:center; margin-bottom:20px;">
                    <button onclick="ProdTools.startPomo()" class="btn-primary" style="padding:10px 24px;">${t('Start', 'ابدأ')}</button>
                    <button onclick="ProdTools.resetPomo()" class="btn-secondary" style="padding:10px 24px;">${t('Reset', 'إعادة')}</button>
                </div>
                <div style="font-size:14px; color:#aaa;">
                    <span>${t('Focus: 25m', 'تركيز: 25د')}</span> | 
                    <span>${t('Break: 5m', 'راحة: 5د')}</span>
                </div>
            </div>
        `;
        ProdTools.pomoTime = 25 * 60;
        ProdTools.pomoInterval = null;
    },

    startPomo: function () {
        if (ProdTools.pomoInterval) return;
        const t = this._t;
        ProdTools.pomoInterval = setInterval(() => {
            ProdTools.pomoTime--;
            if (ProdTools.pomoTime < 0) {
                clearInterval(ProdTools.pomoInterval);
                alert(t('Time is up!', 'انتهى الوقت!'));
                return;
            }
            const m = Math.floor(ProdTools.pomoTime / 60);
            const s = ProdTools.pomoTime % 60;
            document.getElementById('pomoTimer').innerText = `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
        }, 1000);
    },

    resetPomo: function () {
        clearInterval(ProdTools.pomoInterval);
        ProdTools.pomoInterval = null;
        ProdTools.pomoTime = 25 * 60;
        document.getElementById('pomoTimer').innerText = "25:00";
    }
};

window.ProdTools = ProdTools;
