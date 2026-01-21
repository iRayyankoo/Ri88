/**
 * Time Tools Module
 * Handles UI injection and logic for Hijri, Date Diff, Timer etc.
 */

const TimeTools = {
    // 1. Hijri Converter
    // ----------------------------------------------------------------
    renderHijri: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>Gregorian Date</label>
                    <input type="date" id="gdate" class="glass-input">
                </div>
                <button onclick="TimeTools.convertHijri()" class="btn-primary full-width">Convert to Hijri</button>
                
                <div id="hijriResult" class="result-box hidden" style="text-align:center;">
                    <strong id="resHijri" style="font-size:1.5em; color:var(--accent-pink);">-</strong>
                    <p id="resHijriFull" style="opacity:0.7; font-size:0.9em; margin-top:8px;">-</p>
                </div>
            </div>
        `;
        // Set Today
        document.getElementById('gdate').valueAsDate = new Date();
    },

    convertHijri: function () {
        const d = new Date(document.getElementById('gdate').value);
        if (isNaN(d.getTime())) return;

        // Intl.DateTimeFormat is the reliable native way without libraries
        const hijri = new Intl.DateTimeFormat('en-Tn-u-ca-islamic', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(d);

        // Also numeric parts for clarity
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
    // ----------------------------------------------------------------
    renderDiff: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>Start Date</label>
                    <input type="date" id="dStart" class="glass-input">
                </div>
                <div class="input-row">
                    <label>End Date</label>
                    <input type="date" id="dEnd" class="glass-input">
                </div>
                <button onclick="TimeTools.calcDiff()" class="btn-primary full-width">Calculate Duration</button>
                
                <div id="diffResult" class="result-box hidden">
                    <div class="res-item"><span>Days:</span> <strong id="resDays">-</strong></div>
                    <div class="res-item"><span>Weeks:</span> <strong id="resWeeks">-</strong></div>
                    <div class="res-item"><span>Years/Months/Days:</span> <strong id="resYMD" style="font-size:0.9em;">-</strong></div>
                </div>
            </div>
        `;
    },

    calcDiff: function () {
        const s = new Date(document.getElementById('dStart').value);
        const e = new Date(document.getElementById('dEnd').value);

        if (isNaN(s) || isNaN(e)) return;

        // Difference in ms
        const diffTime = Math.abs(e - s);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const weeks = (diffDays / 7).toFixed(1);

        // Approximate YMD
        // This is complex to do perfectly without libraries, simplified approach:
        let y = e.getFullYear() - s.getFullYear();
        let m = e.getMonth() - s.getMonth();
        let d = e.getDate() - s.getDate();
        if (d < 0) {
            m--;
            d += 30; // Approx
        }
        if (m < 0) {
            y--;
            m += 12;
        }

        document.getElementById('resDays').innerText = diffDays + ' days';
        document.getElementById('resWeeks').innerText = weeks + ' weeks';
        document.getElementById('resYMD').innerText = `${y}y, ${m}m, ${d}d`; // Absolute delta? Assuming nice input
        document.getElementById('diffResult').classList.remove('hidden');
    },

    // 3. Simple Timer
    // ----------------------------------------------------------------
    timerInterval: null,
    seconds: 0,
    renderTimer: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group" style="text-align:center;">
                <div id="timerDisplay" style="font-size:4em; font-weight:700; font-variant-numeric: tabular-nums; letter-spacing:-2px; color:var(--text-primary); margin:20px 0;">
                    00:00
                </div>
                <div style="display:flex; justify-content:center; gap:16px;">
                    <button onclick="TimeTools.startTimer()" class="btn-primary" style="background:#2ecc71;">Start</button>
                    <button onclick="TimeTools.stopTimer()" class="btn-primary" style="background:#e74c3c;">Stop</button>
                    <button onclick="TimeTools.resetTimer()" class="btn-primary" style="background:var(--glass-bg); border:1px solid var(--glass-border);">Reset</button>
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
    // ----------------------------------------------------------------
    zoneInterval: null,
    renderZone: function (container) {
        if (this.zoneInterval) clearInterval(this.zoneInterval);

        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>Select City</label>
                    <select id="tzSelect" class="glass-input" onchange="TimeTools.updateZone()">
                        <option value="Asia/Riyadh" selected>Riyadh (KSA)</option>
                        <option value="Asia/Dubai">Dubai (UAE)</option>
                        <option value="Europe/London">London (UK)</option>
                        <option value="America/New_York">New York (USA)</option>
                        <option value="Asia/Tokyo">Tokyo (Japan)</option>
                        <option value="Australia/Sydney">Sydney (AUS)</option>
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

        try {
            const timeStr = now.toLocaleTimeString('en-US', { timeZone: zone, hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' });
            const dateStr = now.toLocaleDateString('en-US', { timeZone: zone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            displayTime.innerText = timeStr;
            displayDate.innerText = dateStr;
        } catch (e) {
            displayTime.innerText = "Error";
        }
    }
};

window.TimeTools = TimeTools;
