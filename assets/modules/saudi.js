/**
 * Saudi Work Tools
 * EOS Calculator, Leave Calculator
 */

const SaudiTools = {
    _t: function (en, ar) {
        return document.documentElement.lang === 'ar' ? ar : en;
    },

    // 1. End of Service
    renderEOS: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Total Salary (SAR)', 'الراتب الإجمالي (ريال)')}</label>
                    <input type="number" id="eosSal" class="glass-input" placeholder="e.g. 5000">
                </div>
                <div class="input-row">
                    <label>${t('Years of Service', 'سنوات الخدمة')}</label>
                    <input type="number" id="eosYrs" class="glass-input" placeholder="e.g. 6.5">
                </div>
                <div class="input-row">
                     <label>${t('Termination Reason', 'سبب إنهاء الخدمة')}</label>
                     <select id="eosReason" class="glass-input">
                        <option value="term">${t('Termination by Employer (Full)', 'إنهاء من قبل صاحب العمل (كامل)')}</option>
                        <option value="resign">${t('Resignation', 'استقالة')}</option>
                     </select>
                </div>
                <button onclick="SaudiTools.calcEOS()" class="btn-primary full-width">${t('Calculate Reward', 'احسب المكافأة')}</button>
                
                <div id="eosRes" class="result-box hidden">
                    <h3>${t('Estimated Reward', 'المكافأة التقديرية')}</h3>
                    <div id="eosVal" style="font-size:2em; color:var(--accent-pink); font-weight:bold;"></div>
                    <p class="tool-desc" style="font-size:0.8em;">${t('*Disclaimer: Estimate based on Saudi Labor Law. Verify with HR.', '*تنبيه: تقدير مبني على نظام العمل السعودي. راجع الموارد البشرية.')}</p>
                </div>
            </div>
        `;
    },

    calcEOS: function () {
        const sal = parseFloat(document.getElementById('eosSal').value);
        const yrs = parseFloat(document.getElementById('eosYrs').value);
        const type = document.getElementById('eosReason').value;
        const t = this._t;

        if (!sal || !yrs) return;

        let reward = 0;

        // Base calc: Half salary for first 5 years, Full salary for subsequent
        let baseReward = 0;
        if (yrs <= 5) {
            baseReward = (sal / 2) * yrs;
        } else {
            baseReward = (sal / 2) * 5;
            baseReward += sal * (yrs - 5);
        }

        // Resignation Rules (approx)
        // < 2 yrs: 0
        // 2-5 yrs: 1/3
        // 5-10 yrs: 2/3
        // 10+ yrs: Full

        if (type === 'resign') {
            if (yrs < 2) reward = 0;
            else if (yrs < 5) reward = baseReward / 3;
            else if (yrs < 10) reward = (baseReward * 2) / 3;
            else reward = baseReward;
        } else {
            reward = baseReward;
        }

        document.getElementById('eosVal').innerText = reward.toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' ' + t('SAR', 'ريال');
        document.getElementById('eosRes').classList.remove('hidden');
    },

    // 2. Leave / Return Date
    renderLeave: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Start Date', 'تاريخ البداية')}</label>
                    <input type="date" id="lvStart" class="glass-input">
                </div>
                <div class="input-row">
                    <label>${t('Days Requested', 'عدد الأيام')}</label>
                    <input type="number" id="lvDays" class="glass-input" value="1">
                </div>
                <button onclick="SaudiTools.calcLeave()" class="btn-primary full-width">${t('Calculate Return', 'حساب تاريخ العودة')}</button>
                <div id="lvRes" class="result-box hidden">
                     <strong>${t('Return To Work:', 'العودة للعمل:')}</strong>
                     <div id="lvDate" style="font-size:1.5em; color:var(--text-primary); margin-top:5px;"></div>
                </div>
            </div>
         `;
    },

    calcLeave: function () {
        const start = new Date(document.getElementById('lvStart').value);
        const days = parseInt(document.getElementById('lvDays').value);

        if (isNaN(start.getTime()) || !days) return;

        // Simple addition
        const end = new Date(start);
        end.setDate(end.getDate() + days);

        // Return is the day AFTER the last day of leave
        // If leave includes end date, return is +1. Assuming 'Days Requested' means duration.
        // E.g. Start 1st, 1 day. Leave = 1st. Return 2nd.
        // end is 1st + 1 = 2nd.

        document.getElementById('lvDate').innerText = end.toDateString();
        document.getElementById('lvRes').classList.remove('hidden');
    },

    // 3. Tafqeet logic
    renderTafqeet: function (container) {
        const t = this._t;
        container.innerHTML = `
             <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Annual Amount', 'المبلغ')}</label>
                    <input type="number" id="tafqeetNum" class="glass-input full-width" placeholder="e.g. 1500">
                </div>
                <button onclick="SaudiTools.doTafqeet()" class="btn-primary full-width">${t('Convert to Text', 'تحويل للنص')}</button>
                <div id="tafqeetResult" class="result-box hidden">
                     <p id="tafqeetText" style="font-size:18px; color:var(--accent-warm); font-weight:bold; text-align:center; line-height:1.6;"></p>
                </div>
            </div>
        `;
    },

    doTafqeet: function () {
        const t = this._t;
        const val = document.getElementById('tafqeetNum').value;
        if (!val) return;

        let text = val; // Placeholder for real library
        document.getElementById('tafqeetResult').classList.remove('hidden');
        document.getElementById('tafqeetText').innerText = text + " " + t("SAR", "ريال سعودي");
    },

    // 4. Saudi Events
    renderEvents: function (container) {
        const t = this._t;
        const events = [
            { nameAr: 'يوم التأسيس', nameEn: 'Founding Day', date: '02-22' },
            { nameAr: 'اليوم الوطني', nameEn: 'National Day', date: '09-23' },
            { nameAr: 'عيد الفطر (تقريبي)', nameEn: 'Eid Al-Fitr (Approx)', date: '03-20' },
            { nameAr: 'عيد الأضحى (تقريبي)', nameEn: 'Eid Al-Adha (Approx)', date: '05-27' },
        ];

        let html = `<div class="tool-ui-group">`;
        events.forEach(ev => {
            const currentYear = new Date().getFullYear();
            let target = new Date(`${currentYear}-${ev.date}`);
            const now = new Date();
            if (target < now) target.setFullYear(currentYear + 1);

            const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));

            html += `
                <div class="glass-panel" style="padding:16px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong style="color:var(--accent-cyan); display:block; font-size:16px;">${t(ev.nameEn, ev.nameAr)}</strong>
                        <span style="color:#aaa; font-size:12px;">${ev.date}</span>
                    </div>
                    <div style="text-align:center;">
                        <span style="font-size:24px; font-weight:bold; color:white;">${diff}</span>
                        <br><span style="font-size:10px; color:#888;">${t('Days Left', 'يوم متبقي')}</span>
                    </div>
                </div>
             `;
        });
        html += `</div>`;
        container.innerHTML = html;
    }
};

window.SaudiTools = SaudiTools;
