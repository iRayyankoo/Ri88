/* 
  RI88 TOOLS SUITE - MAIN ENGINE 
  Contains logic for all modules.
*/

const RiTools = {
    // --- CONFIG ---
    lang: 'en', // 'en' or 'ar'
    activeTools: {},
    lang: 'en',

    // --- Modal Logic ---
    open: function (id) { this.openModal(id); }, // Alias for HTML
    openModal: function (id) {
        // Safety: If modal has content, move it back first
        const modalBody = document.getElementById('modalBody');
        const hidden = document.getElementById('toolsHidden');
        while (modalBody.firstElementChild) {
            hidden.appendChild(modalBody.firstElementChild);
        }

        const tool = document.querySelector(`#toolsHidden [data-tool="${id}"]`);
        if (!tool) {
            console.error('Tool not found:', id);
            return;
        }

        // Move tool to modal body (preserves event listeners and state)
        modalBody.appendChild(tool);

        // Show Modal
        const overlay = document.getElementById('modalOverlay');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll

        // LAZY LOAD: Init logic now if not already active
        this.initTool(id);

        // Ensure I18n is correct for this tool (if dynamic)
        this.updateLang();
    },

    closeModal: function (e) {
        // If triggered by click, ensure it's the overlay or close button
        if (e && e.target !== e.currentTarget && !e.target.classList.contains('modal-close')) return;

        const modalBody = document.getElementById('modalBody');
        const overlay = document.getElementById('modalOverlay');
        const hiddenContainer = document.getElementById('toolsHidden');

        // Move tool back to hidden container
        while (modalBody.firstElementChild) {
            hiddenContainer.appendChild(modalBody.firstElementChild);
        }

        overlay.classList.remove('active');
        document.body.style.overflow = '';
    },
    // -------------------

    // --- CORE UTILS ---
    init: function () {
        // Expose globally
        window.RiTools = this;
        // Note: Logic is now lazy-loaded in openModal()
        this.updateLang();
    },

    // Lazy load logic helper
    initTool: function (id) {
        if (this.activeTools[id]) return;

        if (this.modules[id]) {
            try {
                // Find the tool element (it might be in modal or hidden)
                const el = document.getElementById('modalBody').querySelector(`[data-tool="${id}"]`)
                    || document.getElementById('toolsHidden').querySelector(`[data-tool="${id}"]`);
                if (el) {
                    this.modules[id](el);
                    this.activeTools[id] = true;
                    // Re-apply current lang settings to the newly init tool
                    this.updateLang();
                }
            } catch (err) {
                console.error(`Failed to init tool ${id}:`, err);
            }
        }
    },

    setLang: function (lang) {
        this.lang = lang;
        this.updateLang();
    },

    updateLang: function () {
        const isAr = this.lang === 'ar';
        document.querySelectorAll('.ri-tool').forEach(el => {
            if (isAr) el.classList.add('rtl');
            else el.classList.remove('rtl');

            // Update text if data-en / data-ar attributes exist
            el.querySelectorAll('[data-en]').forEach(t => {
                t.textContent = isAr ? t.dataset.ar : t.dataset.en;
            });
            el.querySelectorAll('[placeholder]').forEach(t => {
                if (t.dataset.enPh) t.placeholder = isAr ? t.dataset.arPh : t.dataset.enPh;
            });
        });
    },

    toast: function (el, msg) {
        let t = document.querySelector('.ri-toast-global');
        if (!t) {
            t = document.createElement('div');
            t.className = 'ri-toast-global';
            // append to modal overlay if active, else body
            const modal = document.querySelector('.modal-content');
            if (modal && document.getElementById('modalOverlay').classList.contains('active')) {
                modal.appendChild(t);
            } else {
                document.body.appendChild(t);
            }
        }

        const txt = msg || (this.lang === 'ar' ? 'تم النسخ بنجاح' : 'Copied Successfully!');
        t.textContent = txt;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2000);
    },

    copy: function (str, toolsEl) {
        navigator.clipboard.writeText(str).then(() => {
            this.toast(toolsEl);
        });
    },

    fmt: (n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),

    // --- MODULES ---
    modules: {

        // 1.1 Loan Calculator
        'loan-calculator': function (root) {
            const calculate = () => {
                const P = parseFloat(root.querySelector('#lc-amount').value) || 0;
                const r = (parseFloat(root.querySelector('#lc-rate').value) || 0) / 100 / 12;
                const n = (parseFloat(root.querySelector('#lc-term').value) || 0) * 12;

                if (P <= 0 || n <= 0) return;

                // PMT Formula
                let m = 0;
                if (r === 0) m = P / n;
                else m = P * r * (Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

                const total = m * n;
                const interest = total - P;

                root.querySelector('#lc-pay').textContent = RiTools.fmt(m);
                root.querySelector('#lc-tot').textContent = RiTools.fmt(total);
                root.querySelector('#lc-int').textContent = RiTools.fmt(interest);
            };

            root.querySelectorAll('input').forEach(i => i.addEventListener('input', calculate));
            root.querySelector('.btn-copy').onclick = () => {
                const txt = `Loan: ${root.querySelector('#lc-pay').textContent} / month`;
                RiTools.copy(txt, root);
            };
        },

        // 1.2 Net Salary (Simple SA logic)
        'net-salary': function (root) {
            const calc = () => {
                const basic = parseFloat(root.querySelector('#ns-basic').value) || 0;
                const house = parseFloat(root.querySelector('#ns-house').value) || 0;
                const trans = parseFloat(root.querySelector('#ns-trans').value) || 0;
                const ded = parseFloat(root.querySelector('#ns-ded').value) || 0;

                const gosi = root.querySelector('#ns-gosi').checked ? (basic + house) * 0.0975 : 0;
                const total = basic + house + trans - ded - gosi;

                root.querySelector('#ns-gross').textContent = RiTools.fmt(basic + house + trans);
                root.querySelector('#ns-gosi-val').textContent = RiTools.fmt(gosi);
                root.querySelector('#ns-net').textContent = RiTools.fmt(total);
            };
            root.querySelectorAll('input').forEach(i => i.addEventListener('input', calc));
        },

        // 1.3 VAT
        'vat-15': function (root) {
            const calc = () => {
                const amt = parseFloat(root.querySelector('#vat-amt').value) || 0;
                const rate = parseFloat(root.querySelector('#vat-rate').value) || 15;
                const mode = root.querySelector('#vat-mode').value; // 'add' or 'sub'

                let original, vat, total;

                if (mode === 'add') {
                    original = amt;
                    vat = amt * (rate / 100);
                    total = amt + vat;
                } else {
                    total = amt;
                    original = amt / (1 + (rate / 100));
                    vat = total - original;
                }

                root.querySelector('#vat-val').textContent = RiTools.fmt(vat);
                root.querySelector('#vat-tot').textContent = RiTools.fmt(mode === 'add' ? total : original);
                root.querySelector('#vat-lbl').textContent = mode === 'add' ? 'Total (Inc. VAT)' : 'Base (Excl. VAT)';
            };
            root.querySelectorAll('input, select').forEach(i => i.addEventListener('input', calc));
        },

        // 1.4 Currency (Manual)
        'currency-converter': function (root) {
            const calc = () => {
                const amt = parseFloat(root.querySelector('#cc-amt').value) || 0;
                const rate = parseFloat(root.querySelector('#cc-rate').value) || 3.75;
                root.querySelector('#cc-res').textContent = RiTools.fmt(amt * rate);
            };
            root.querySelectorAll('input').forEach(i => i.addEventListener('input', calc));
            root.querySelector('#cc-swap').onclick = () => {
                const r = root.querySelector('#cc-rate');
                r.value = (1 / parseFloat(r.value || 1)).toFixed(4);
                calc();
            };
        },

        // 1.5 Savings Goal
        'savings-goal': function (root) {
            const calc = () => {
                const target = parseFloat(root.querySelector('#sg-target').value) || 0;
                const curr = parseFloat(root.querySelector('#sg-curr').value) || 0;
                const month = parseFloat(root.querySelector('#sg-month').value) || 0;

                if (month <= 0 || target <= curr) return;

                const needed = target - curr;
                const months = Math.ceil(needed / month);
                const years = (months / 12).toFixed(1);

                root.querySelector('#sg-res').textContent = `${months} Months (${years} Years)`;
            };
            root.querySelectorAll('input').forEach(i => i.addEventListener('input', calc));
        },

        // 1.6 Zakat
        'zakat-simple': function (root) {
            const calc = () => {
                const cash = parseFloat(root.querySelector('#zk-cash').value) || 0;
                const invest = parseFloat(root.querySelector('#zk-inv').value) || 0;
                const debt = parseFloat(root.querySelector('#zk-debt').value) || 0;

                const base = Math.max(0, cash + invest - debt);
                const zakat = base * 0.025; // 2.5%

                root.querySelector('#zk-res').textContent = RiTools.fmt(zakat);
            };
            root.querySelectorAll('input').forEach(i => i.addEventListener('input', calc));
        },

        // --- TIME & DATE ---
        // 2.1 Hijri Converter
        'hijri-gregorian': function (root) {
            const fmt = (d, cal) => new Intl.DateTimeFormat('en-US', { calendar: cal, dateStyle: 'full' }).format(d);

            const update = () => {
                const inp = root.querySelector('#hij-inp').value;
                const d = inp ? new Date(inp) : new Date();
                if (isNaN(d.getTime())) return;

                root.querySelector('#hij-greg').textContent = fmt(d, 'gregory');
                root.querySelector('#hij-hijri').textContent = fmt(d, 'islamic-umalqura');
            };
            root.querySelector('#hij-inp').addEventListener('input', update);
            root.querySelector('#hij-today').onclick = () => {
                root.querySelector('#hij-inp').valueAsDate = new Date();
                update();
            };
            update(); // init
        },

        // 2.2 Date Diff
        'date-diff': function (root) {
            const calc = () => {
                const d1 = new Date(root.querySelector('#dd-start').value);
                const d2 = new Date(root.querySelector('#dd-end').value);
                if (isNaN(d1) || isNaN(d2)) return;

                const diffTime = Math.abs(d2 - d1);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                root.querySelector('#dd-res').textContent = `${diffDays} Days`;

                const years = Math.floor(diffDays / 365);
                const months = Math.floor((diffDays % 365) / 30);
                const days = (diffDays % 365) % 30;
                root.querySelector('#dd-detail').textContent = `${years}y ${months}m ${days}d`;
            };
            root.querySelectorAll('input').forEach(i => i.addEventListener('input', calc));
        },

        // 2.3 Timer
        'timers': function (root) {
            let interval = null;
            let seconds = 0;
            const disp = root.querySelector('#tm-disp');

            const fmt = (s) => {
                const m = Math.floor(s / 60).toString().padStart(2, '0');
                const sc = (s % 60).toString().padStart(2, '0');
                return `${m}:${sc}`;
            };

            root.querySelector('#tm-start').onclick = () => {
                if (interval) return;
                interval = setInterval(() => {
                    seconds++;
                    disp.textContent = fmt(seconds);
                }, 1000);
            };
            root.querySelector('#tm-stop').onclick = () => {
                clearInterval(interval);
                interval = null;
            };
            root.querySelector('#tm-reset').onclick = () => {
                clearInterval(interval);
                interval = null;
                seconds = 0;
                disp.textContent = "00:00";
            };
        },

        // 2.4 Timezone
        'timezone': function (root) {
            const update = () => {
                const now = new Date();
                const cities = [
                    { name: 'Riyadh', tz: 'Asia/Riyadh' },
                    { name: 'London', tz: 'Europe/London' },
                    { name: 'New York', tz: 'America/New_York' },
                    { name: 'Tokyo', tz: 'Asia/Tokyo' },
                    { name: 'Dubai', tz: 'Asia/Dubai' }
                ];

                let html = '';
                cities.forEach(c => {
                    const time = new Intl.DateTimeFormat('en-GB', {
                        timeZone: c.tz, hour: '2-digit', minute: '2-digit', hour12: false
                    }).format(now);
                    html += `<div style="display:flex; justify-content:space-between; padding:8px; border-bottom:1px solid rgba(255,255,255,0.1);"><span>${c.name}</span><span>${time}</span></div>`;
                });
                root.querySelector('#tz-list').innerHTML = html;
            };
            setInterval(update, 60000);
            update();
        },

        // --- TEXT TOOLS ---
        // 3.1 Arabic Adobe Fix (Migrated)
        'arabic-adobe': function (root) {
            const MAP = { 0x0622: ['ﺁ', 'ﺁ', 'ﺂ', 'ﺂ'], 0x0623: ['ﺃ', 'ﺃ', 'ﺄ', 'ﺄ'], 0x0624: ['ﺅ', 'ﺅ', 'ﺆ', 'ﺆ'], 0x0625: ['ﺇ', 'ﺇ', 'ﺈ', 'ﺈ'], 0x0626: ['ﺉ', 'ﺋ', 'ﺌ', 'ﺊ'], 0x0627: ['ﺍ', 'ﺍ', 'ﺎ', 'ﺎ'], 0x0628: ['ﺏ', 'ﺑ', 'ﺒ', 'ﺐ'], 0x0629: ['ﺓ', 'ﺓ', 'ﺔ', 'ﺔ'], 0x062A: ['ﺕ', 'ﺗ', 'ﺘ', 'ﺖ'], 0x062B: ['ﺙ', 'ﺛ', 'ﺜ', 'ﺚ'], 0x062C: ['ﺝ', 'ﺟ', 'ﺠ', 'ﺞ'], 0x062D: ['ﺡ', 'ﺣ', 'ﺤ', 'ﺢ'], 0x062E: ['ﺥ', 'ﺧ', 'ﺨ', 'ﺦ'], 0x062F: ['ﺩ', 'ﺩ', 'ﺪ', 'ﺪ'], 0x0630: ['ﺫ', 'ﺫ', 'ﺬ', 'ﺬ'], 0x0631: ['ﺭ', 'ﺭ', 'ﺮ', 'ﺮ'], 0x0632: ['ﺯ', 'ﺯ', 'ﺰ', 'ﺰ'], 0x0633: ['ﺱ', 'ﺳ', 'ﺴ', 'ﺲ'], 0x0634: ['ﺵ', 'ﺷ', 'ﺸ', 'ﺶ'], 0x0635: ['ﺹ', 'ﺻ', 'ﺼ', 'ﺺ'], 0x0636: ['ﺽ', 'ﺿ', 'ﻀ', 'ﺾ'], 0x0637: ['ﻁ', 'ﻃ', 'ﻄ', 'ﻂ'], 0x0638: ['ﻅ', 'ﻇ', 'ﻈ', 'ﻆ'], 0x0639: ['ﻉ', 'ﻋ', 'ﻌ', 'ﻊ'], 0x063A: ['ﻍ', 'ﻏ', 'ﻐ', 'ﻎ'], 0x0641: ['ﻑ', 'ﻓ', 'ﻔ', 'ﻒ'], 0x0642: ['ﻕ', 'ﻗ', 'ﻘ', 'ﻖ'], 0x0643: ['ﻙ', 'ﻛ', 'ﻜ', 'ﻚ'], 0x0644: ['ﻝ', 'ﻟ', 'ﻠ', 'ﻞ'], 0x0645: ['ﻡ', 'ﻣ', 'ﻤ', 'ﻢ'], 0x0646: ['ﻥ', 'ﻧ', 'ﻨ', 'ﻦ'], 0x0647: ['ﻩ', 'ﻫ', 'ﻬ', 'ﻪ'], 0x0648: ['ﻭ', 'ﻭ', 'ﻮ', 'ﻮ'], 0x0649: ['ﻯ', 'ﻯ', 'ﻰ', 'ﻰ'], 0x064A: ['ﻱ', 'ﻳ', 'ﻴ', 'ﻲ'] };
            const BR = [0x0622, 0x0623, 0x0625, 0x0627, 0x062F, 0x0630, 0x0631, 0x0632, 0x0648, 0x0624, 0x0629, 0x0649];
            function shape(t) {
                let r = []; for (let i = 0; i < t.length; i++) {
                    let c = t.charCodeAt(i); if (!MAP[c]) { r.push({ c: t[i], a: 0 }); continue } let p = i > 0 ? t.charCodeAt(i - 1) : 0, n = i < t.length - 1 ? t.charCodeAt(i + 1) : 0; let pc = MAP[p] && !BR.includes(p), nc = !!MAP[n]; let f = pc && nc ? 2 : pc ? 3 : nc ? 1 : 0;
                    if (c === 0x0644 && n && (n === 0x0622 || n === 0x0623 || n === 0x0625 || n === 0x0627)) { let l = n === 0x0622 ? 'ﻵ' : n === 0x0623 ? 'ﻷ' : n === 0x0625 ? 'ﻹ' : 'ﻻ'; if (pc && n === 0x0644) l = n === 0x0622 ? 'ﻶ' : n === 0x0623 ? 'ﻸ' : n === 0x0625 ? 'ﻺ' : 'ﻼ'; r.push({ c: l, a: 1 }); i++; continue } r.push({ c: MAP[c][f], a: 1 })
                } return r
            }

            const run = () => {
                try {
                    const inEl = document.getElementById('aa-in');
                    const outEl = document.getElementById('aa-out');
                    const revEl = document.getElementById('aa-rev');
                    const numEl = document.getElementById('aa-num');

                    if (!inEl || !outEl) {
                        alert('Error: Input/Output elements not found!');
                        return;
                    }

                    let v = inEl.value;
                    const rev = revEl ? revEl.checked : true;

                    if (numEl && numEl.checked) {
                        const nums = { '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤', '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩' };
                        v = v.replace(/[0-9]/g, m => nums[m]);
                    }

                    let lines = v.split('\n');
                    let out = lines.map(l => {
                        let s = shape(l);
                        if (rev) s.reverse();
                        return s.map(x => x.c).join('');
                    }).join('\n');
                    outEl.value = out;
                } catch (e) {
                    alert('Error in Run: ' + e.message);
                    console.error('Auto-Run Error', e);
                }
            };

            // Bind Events Safely
            const bind = (id, evt) => {
                const el = document.getElementById(id);
                if (el) el.addEventListener(evt, run);
            };
            bind('aa-in', 'input');
            bind('aa-rev', 'change');
            bind('aa-num', 'change');

            // Manual Trigger
            const btnConv = document.getElementById('aa-conv');
            if (btnConv) btnConv.onclick = (e) => { e.preventDefault(); run(); };

            // Robust Copy
            const btnCopy = document.getElementById('aa-copy');
            if (btnCopy) btnCopy.onclick = (e) => {
                e.preventDefault();
                try {
                    const out = document.getElementById('aa-out');
                    if (out) {
                        out.select();
                        out.setSelectionRange(0, 99999); // Mobile fix
                        document.execCommand('copy');
                        RiTools.toast(null, 'Copied Successfully');
                    }
                } catch (ex) {
                    console.error('Copy Error', ex);
                    RiTools.toast(null, 'Error: ' + ex.message);
                }
            };
        },

        // 3.2 Text Cleaner
        'text-cleaner': function (root) {
            root.querySelector('#tc-go').onclick = () => {
                let txt = root.querySelector('#tc-in').value;
                const opts = {
                    dup: root.querySelector('#tc-dup').checked,
                    empty: root.querySelector('#tc-empty').checked,
                    trim: root.querySelector('#tc-trim').checked
                };

                let lines = txt.split('\n');
                if (opts.trim) lines = lines.map(l => l.trim());
                if (opts.empty) lines = lines.filter(l => l.length > 0);
                if (opts.dup) lines = [...new Set(lines)];

                root.querySelector('#tc-in').value = lines.join('\n');
                RiTools.toast(root, 'Cleaned!');
            };
        },

        // 3.3 Case Converter
        'case-converter': function (root) {
            const acts = {
                'upper': s => s.toUpperCase(),
                'lower': s => s.toLowerCase(),
                'title': s => s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase())
            };
            root.querySelectorAll('.cc-btn').forEach(b => {
                b.onclick = () => {
                    const t = root.querySelector('#cc-in');
                    t.value = acts[b.dataset.mode](t.value);
                };
            });
        },

        // 3.4 Hashtags
        'hashtags': function (root) {
            root.querySelector('#ht-go').onclick = () => {
                const inp = root.querySelector('#ht-in').value;
                const tags = inp.split(/[\s,]+/).filter(w => w.length > 0).map(w => w.startsWith('#') ? w : `#${w}`);
                root.querySelector('#ht-out').textContent = tags.join(' ');
            };
        },

        // 3.5 UTM Builder
        'utm-builder': function (root) {
            const build = () => {
                const url = root.querySelector('#utm-url').value;
                const src = root.querySelector('#utm-src').value;
                const med = root.querySelector('#utm-med').value;
                const camp = root.querySelector('#utm-camp').value;

                if (!url) return;
                try {
                    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
                    if (src) u.searchParams.set('utm_source', src);
                    if (med) u.searchParams.set('utm_medium', med);
                    if (camp) u.searchParams.set('utm_campaign', camp);
                    root.querySelector('#utm-out').textContent = u.toString();
                } catch (e) { }
            };
            root.querySelectorAll('input').forEach(i => i.addEventListener('input', build));
            root.querySelector('#utm-copy').onclick = () => RiTools.copy(root.querySelector('#utm-out').textContent, root);
        },

        // 3.6 Signature
        'signature': function (root) {
            const gen = () => {
                const n = root.querySelector('#sig-name').value;
                const t = root.querySelector('#sig-title').value;
                const c = root.querySelector('#sig-comp').value;

                const html = `<div style="font-family:sans-serif; color:#333;">
           <h3 style="margin:0; color:#8b5cf6;">${n}</h3>
           <p style="margin:0; font-size:14px; color:#666;">${t} @ ${c}</p>
         </div>`;
                root.querySelector('#sig-prev').innerHTML = html;
                root.querySelector('#sig-code').value = html;
            };
            root.querySelectorAll('input').forEach(i => i.addEventListener('input', gen));
        },

        // --- PRODUCTIVITY ---
        // 4.1 QR Code (Using API)
        'qr': function (root) {
            root.querySelector('#qr-gen').onclick = () => {
                const txt = root.querySelector('#qr-in').value || 'https://ri88.info';
                const url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(txt)}`;
                root.querySelector('#qr-img').src = url;
            };
        },

        // 4.2 Speed Test (Animated)
        'speedtest': function (root) {
            const btn = root.querySelector('#st-go');
            const num = root.querySelector('#st-num');
            const unit = root.querySelector('#st-unit');
            const prog = root.querySelector('#st-prog');
            const ring = root.querySelector('#st-ring');

            const els = {
                ping: root.querySelector('#st-ping'),
                down: root.querySelector('#st-down'),
                up: root.querySelector('#st-up')
            };

            const animateValue = (el, start, end, duration) => {
                let startTimestamp = null;
                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    el.textContent = Math.floor(progress * (end - start) + start);
                    if (progress < 1) window.requestAnimationFrame(step);
                };
                window.requestAnimationFrame(step);
            };

            btn.onclick = () => {
                if (btn.disabled) return;
                btn.disabled = true;
                btn.textContent = 'Connecting...';
                root.querySelector('.st-gauge').classList.add('st-active');

                // Reset
                prog.style.strokeDashoffset = 565;
                num.textContent = '0';
                unit.style.display = 'block';
                els.ping.textContent = '--';
                els.down.textContent = '--';
                els.up.textContent = '--';

                // Sequence: Ping -> Down -> Up
                setTimeout(() => {
                    // PING PHASE
                    const pingVal = Math.floor(Math.random() * 20) + 10;
                    animateValue(els.ping, 0, pingVal, 500);

                    btn.textContent = 'Testing Download...';

                    // DOWNLOAD PHASE
                    setTimeout(() => {
                        const downVal = Math.floor(Math.random() * 150) + 50;
                        animateValue(num, 0, downVal, 2000);
                        animateValue(els.down, 0, downVal, 2000);

                        // Circle Progress (Total dasharray is 565)
                        // Map 200Mbps to full circle for visual effect
                        const offset = 565 - (Math.min(downVal, 200) / 200) * 565;
                        prog.style.strokeDashoffset = offset;

                        btn.textContent = 'Testing Upload...';

                        // UPLOAD PHASE
                        setTimeout(() => {
                            const upVal = Math.floor(Math.random() * 50) + 20;
                            // Reset gauge slightly for visual feedback
                            prog.style.strokeDashoffset = 565;
                            setTimeout(() => {
                                const upOffset = 565 - (Math.min(upVal, 200) / 200) * 565;
                                prog.style.strokeDashoffset = upOffset;
                            }, 100);

                            animateValue(num, downVal, upVal, 1500);
                            animateValue(els.up, 0, upVal, 1500);

                            // FINISH
                            setTimeout(() => {
                                root.querySelector('.st-gauge').classList.remove('st-active');
                                btn.textContent = 'Test Again';
                                btn.disabled = false;
                                num.textContent = downVal; // Show Download as main result
                                // prog.style.strokeDashoffset = offset; // Return gauge to Download val
                            }, 1600);

                        }, 2200);

                    }, 800);
                }, 500);
            };
        },

        // 4.3 Unit
        'unit-converter': function (root) {
            const convert = () => {
                const v = parseFloat(root.querySelector('#uc-val').value) || 0;
                const type = root.querySelector('#uc-type').value;
                const res = type === 'km-mi' ? v * 0.621371 : (type === 'kg-lb' ? v * 2.20462 : v);
                root.querySelector('#uc-res').textContent = res.toFixed(2);
            };
            root.querySelectorAll('input, select').forEach(i => i.addEventListener('input', convert));
        },

        // 4.4 Password
        'password': function (root) {
            root.querySelector('#pw-gen').onclick = () => {
                const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
                let pass = '';
                for (let i = 0; i < 12; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
                root.querySelector('#pw-out').value = pass;
            };
        },

        // --- CONTENT ---
        // 5.1 Social Sizes
        'social-sizes': function (root) { /* Static only */ },

        // 5.2 Captions
        'captions': function (root) {
            root.querySelector('#cap-gen').onclick = () => {
                const tone = root.querySelector('#cap-tone').value;
                const topic = root.querySelector('#cap-topic').value;
                root.querySelector('#cap-out').textContent = `Example ${tone} caption for ${topic}:\n\n"Checking out the latest in ${topic}! 🚀 #${topic} #Trends"`;
            };
        },

        // 5.3 Ideas
        'content-ideas': function (root) {
            root.querySelector('#ci-gen').onclick = () => {
                const topic = root.querySelector('#ci-topic').value;
                root.querySelector('#ci-out').innerHTML = `
            <li>Top 5 Myths about ${topic}</li>
            <li>How to started with ${topic}</li>
            <li>Why ${topic} matters in 2026</li>
          `;
            };
        }

    } // End modules
};

document.addEventListener('DOMContentLoaded', () => {
    RiTools.init();
});
