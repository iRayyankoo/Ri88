/**
 * Health Tools Module
 * BMI, Water Intake, Sleep Calculator
 */

const HealthTools = {
    _t: function (en, ar) {
        return document.documentElement.lang === 'ar' ? ar : en;
    },

    // 1. BMI Calculator
    renderBMI: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Weight (kg)', 'الوزن (كجم)')}</label>
                    <input type="number" id="bmiWeight" class="glass-input" placeholder="70">
                </div>
                <div class="input-row">
                    <label>${t('Height (cm)', 'الطول (سم)')}</label>
                    <input type="number" id="bmiHeight" class="glass-input" placeholder="175">
                </div>
                <button onclick="HealthTools.calcBMI()" class="btn-primary full-width">${t('Calculate BMI', 'احسب المؤشر')}</button>
                
                <div id="bmiResult" class="result-box hidden" style="text-align:center;">
                    <div id="bmiVal" style="font-size:3em; font-weight:800; color:white;">22.5</div>
                    <div id="bmiStatus" style="font-size:1.2em; color:var(--text-secondary); margin-top:8px;">Normal</div>
                    <div class="progress-bar" style="height:8px; background:#333; margin-top:16px; border-radius:4px; overflow:hidden;">
                        <div id="bmiBar" style="width:0%; height:100%; background:var(--accent-cyan); transition:1s;"></div>
                    </div>
                </div>
            </div>
        `;
    },

    calcBMI: function () {
        const w = parseFloat(document.getElementById('bmiWeight').value);
        const h = parseFloat(document.getElementById('bmiHeight').value) / 100; // convert to meters
        const t = this._t;

        if (!w || !h) return;

        const bmi = (w / (h * h)).toFixed(1);
        const valDiv = document.getElementById('bmiVal');
        const statDiv = document.getElementById('bmiStatus');
        const bar = document.getElementById('bmiBar');

        valDiv.innerText = bmi;

        let status = '';
        let color = '';
        let pct = 0;

        if (bmi < 18.5) {
            status = t('Underweight', 'نحافة');
            color = '#f1c40f';
            pct = 25;
        } else if (bmi < 25) {
            status = t('Normal Weight', 'وزن طبيعي');
            color = '#2ecc71';
            pct = 50;
        } else if (bmi < 30) {
            status = t('Overweight', 'زيادة وزن');
            color = '#e67e22';
            pct = 75;
        } else {
            status = t('Obese', 'سمنة');
            color = '#e74c3c';
            pct = 100;
        }

        statDiv.innerText = status;
        statDiv.style.color = color;
        bar.style.backgroundColor = color;
        bar.style.width = pct + '%';

        document.getElementById('bmiResult').classList.remove('hidden');
    },

    // 2. Water Intake
    renderWater: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Your Weight (kg)', 'وزنك (كجم)')}</label>
                    <input type="number" id="waterWeight" class="glass-input" placeholder="70" oninput="HealthTools.calcWater()">
                </div>
                <div id="waterRes" class="result-box hidden" style="text-align:center;">
                    <div style="font-size:0.9em; color:#aaa;">${t('Daily Goal', 'احتياجك اليومي')}</div>
                    <div id="waterVal" style="font-size:2.5em; font-weight:bold; color:var(--accent-cyan);"></div>
                    <div style="font-size:0.9em; color:#aaa;">${t('Liters / ~Cups', 'لتر / ~أكواب')}</div>
                </div>
            </div>
        `;
    },

    calcWater: function () {
        const w = parseFloat(document.getElementById('waterWeight').value);
        if (!w) return;

        // General rule: 35ml per kg
        const liters = (w * 0.033).toFixed(1);
        const cups = Math.ceil(liters / 0.25);

        document.getElementById('waterVal').innerText = `${liters} L  (${cups})`;
        document.getElementById('waterRes').classList.remove('hidden');
    },

    // 3. Sleep Calculator
    renderSleep: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('I want to wake up at:', 'أريد الاستيقاظ الساعة:')}</label>
                    <input type="time" id="wakeTime" class="glass-input" value="06:00">
                </div>
                <button onclick="HealthTools.calcSleep()" class="btn-primary full-width">${t('When should I sleep?', 'متى يجب أن أنام؟')}</button>
                
                <div id="sleepRes" class="result-box hidden">
                    <p style="margin-bottom:10px; font-size:0.9em; color:#ccc;">${t('For best cycles, try falling asleep at:', 'لأفضل دورات نوم، حاول النوم في:')}</p>
                    <div id="sleepTimes" style="display:flex; flex-wrap:wrap; gap:10px; justify-content:center;"></div>
                </div>
            </div>
        `;
    },

    calcSleep: function () {
        const timeInput = document.getElementById('wakeTime').value;
        if (!timeInput) return;

        const date = new Date();
        const [h, m] = timeInput.split(':');
        date.setHours(h, m, 0);

        // Calculate backwards 90min cycles (avg 5-6 cycles)
        // 15 min to fall asleep

        const cycles = [6, 5, 4]; // 9h, 7.5h, 6h
        let html = '';

        cycles.forEach(c => {
            const sleepTime = new Date(date);
            sleepTime.setMinutes(sleepTime.getMinutes() - (c * 90) - 15);

            const timeStr = sleepTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            html += `<div class="glass-panel" style="padding:10px 15px; color:var(--accent-pink); font-weight:bold;">${timeStr}</div>`;
        });

        document.getElementById('sleepTimes').innerHTML = html;
        document.getElementById('sleepRes').classList.remove('hidden');
    }
};

window.HealthTools = HealthTools;
