/**
 * Time Tools Module
 * Handles UI injection and logic for Hijri, Date Diff, Timer etc.
 */

const TimeTools = {
    _t: function (en, ar) {
        return document.documentElement.lang === 'ar' ? ar : en;
    },

    // 1. Hijri Converter
    renderHijri: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Gregorian Date', 'التاريخ الميلادي')}</label>
                    <input type="date" id="gdate" class="glass-input">
                </div>
                <button onclick="TimeTools.convertHijri()" class="btn-primary full-width">${t('Convert to Hijri', 'تحويل للهجري')}</button>
                
                <div id="hijriResult" class="result-box hidden" style="text-align:center;">
                    <strong id="resHijri" style="font-size:1.5em; color:var(--accent-pink);">-</strong>
                    <p id="resHijriFull" style="opacity:0.7; font-size:0.9em; margin-top:8px;">-</p>
                </div>
            </div>
        `;
        document.getElementById('gdate').valueAsDate = new Date();
    },

    convertHijri: function () {
        const d = new Date(document.getElementById('gdate').value);
        if (isNaN(d.getTime())) return;

        const hijri = new Intl.DateTimeFormat('en-Tn-u-ca-islamic', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(d);

        const hijriNum = new Intl.DateTimeFormat('en-Tn-u-ca-islamic', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        }).format(d);

        document.getElementById('resHijri').innerText = hijri;
        document.getElementById('resHijriFull').innerText = `Numeric: ${hijriNum}`;
        document.getElementById('hijriResult').classList.remove('hidden');
    },

    // 2. Date Difference
    renderDiff: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Start Date', 'تاريخ البداية')}</label>
                    <input type="date" id="dStart" class="glass-input">
                </div>
                <div class="input-row">
                    <label>${t('End Date', 'تاريخ النهاية')}</label>
                    <input type="date" id="dEnd" class="glass-input">
                </div>
                <button onclick="TimeTools.calcDiff()" class="btn-primary full-width">${t('Calculate Duration', 'احسب المدة')}</button>
                
                <div id="diffResult" class="result-box hidden">
                    <div class="res-item"><span>${t('Days:', 'الأيام:')}</span> <strong id="resDays">-</strong></div>
                    <div class="res-item"><span>${t('Weeks:', 'الأسابيع:')}</span> <strong id="resWeeks">-</strong></div>
                    <div class="res-item"><span>${t('Years/Months/Days:', 'سنة/شهر/يوم:')}</span> <strong id="resYMD" style="font-size:0.9em;">-</strong></div>
                </div>
            </div>
        `;
    },

    calcDiff: function () {
        const s = new Date(document.getElementById('dStart').value);
        const e = new Date(document.getElementById('dEnd').value);

        if (isNaN(s) || isNaN(e)) return;

        const diffTime = Math.abs(e - s);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const weeks = (diffDays / 7).toFixed(1);

        let y = e.getFullYear() - s.getFullYear();
        let m = e.getMonth() - s.getMonth();
        let d = e.getDate() - s.getDate();
        if (d < 0) { m--; d += 30; }
        if (m < 0) { y--; m += 12; }

        document.getElementById('resDays').innerText = diffDays + (this._t(' days', ' يوم'));
        document.getElementById('resWeeks').innerText = weeks + (this._t(' weeks', ' أسبوع'));
        document.getElementById('resYMD').innerText = `${y}y, ${m}m, ${d}d`;
        document.getElementById('diffResult').classList.remove('hidden');
    },

    // 3. Simple Timer
    timerInterval: null,
    seconds: 0,
    renderTimer: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group" style="text-align:center;">
                <div id="timerDisplay" style="font-size:4em; font-weight:700; font-variant-numeric: tabular-nums; letter-spacing:-2px; color:var(--text-primary); margin:20px 0;">
                    00:00
                </div>
                <div style="display:flex; justify-content:center; gap:16px;">
                    <button onclick="TimeTools.startTimer()" class="btn-primary" style="background:#2ecc71;">${t('Start', 'ابدأ')}</button>
                    <button onclick="TimeTools.stopTimer()" class="btn-primary" style="background:#e74c3c;">${t('Stop', 'توقف')}</button>
                    <button onclick="TimeTools.resetTimer()" class="btn-primary" style="background:var(--glass-bg); border:1px solid var(--glass-border);">${t('Reset', 'تصفير')}</button>
                </div>
            </div>
        `;
        this.seconds = 0;
    },

    startTimer: function () {
        if (this.timerInterval) return;

        const display = document.getElementById('timerDisplay');
        this.timerInterval = setInterval(() => {
            this.seconds++;
            const m = Math.floor(this.seconds / 60).toString().padStart(2, '0');
            const s = (this.seconds % 60).toString().padStart(2, '0');
            if (display) display.innerText = `${m}:${s}`;
        }, 1000);
    },

    stopTimer: function () {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    },

    resetTimer: function () {
        this.stopTimer();
        this.seconds = 0;
        const display = document.getElementById('timerDisplay');
        if (display) display.innerText = "00:00";
    },

    // 4. Time Zone Converter
    zoneInterval: null,
    renderZone: function (container) {
        const t = this._t;
        if (this.zoneInterval) clearInterval(this.zoneInterval);

        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Select City', 'اختر المدينة')}</label>
                    <select id="tzSelect" class="glass-input" onchange="TimeTools.updateZone()">
                        <option value="Asia/Riyadh" selected>${t('Riyadh (KSA)', 'الرياض (السعودية)')}</option>
                        <option value="Asia/Dubai">${t('Dubai (UAE)', 'دبي (الإمارات)')}</option>
                        <option value="Europe/London">${t('London (UK)', 'لندن (بريطانيا)')}</option>
                        <option value="America/New_York">${t('New York (USA)', 'نيويورك (أمريكا)')}</option>
                        <option value="Asia/Tokyo">${t('Tokyo (Japan)', 'طوكيو (اليابان)')}</option>
                        <option value="Australia/Sydney">${t('Sydney (AUS)', 'سيدني (أستراليا)')}</option>
                        <option value="UTC">UTC (Universal)</option>
                    </select>
                </div>
                
                <div id="tzResult" class="result-box" style="text-align:center; padding:30px;">
                    <div id="tzTime" style="font-size:2.5em; font-weight:700; color:var(--accent-pink); letter-spacing:-1px;">-</div>
                    <div id="tzDate" style="color:var(--text-secondary); margin-top:8px;">-</div>
                </div>
            </div>
        `;

        this.updateZone();
        this.zoneInterval = setInterval(() => this.updateZone(), 1000);
    },

    updateZone: function () {
        const zone = document.getElementById('tzSelect').value;
        const displayTime = document.getElementById('tzTime');
        const displayDate = document.getElementById('tzDate');

        if (!displayTime) return;

        const now = new Date();
        // Force locale based on current lang
        const locale = document.documentElement.lang === 'ar' ? 'ar-SA' : 'en-US';

        try {
            const timeStr = now.toLocaleTimeString(locale, { timeZone: zone, hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' });
            const dateStr = now.toLocaleDateString(locale, { timeZone: zone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            displayTime.innerText = timeStr;
            displayDate.innerText = dateStr;
        } catch (e) {
            displayTime.innerText = "Error";
        }
    }
};

window.TimeTools = TimeTools;
