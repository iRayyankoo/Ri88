/**
 * Health Tools Module
 * BMI, Calories (BMR), Water Intake
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
                    <input type="number" id="bmiWeight" class="glass-input" placeholder="e.g. 70">
                </div>
                <div class="input-row">
                    <label>${t('Height (cm)', 'الطول (سم)')}</label>
                    <input type="number" id="bmiHeight" class="glass-input" placeholder="e.g. 170">
                </div>
                <button onclick="HealthTools.calcBMI()" class="btn-primary full-width">${t('Calculate BMI', 'احسب كتلة الجسم')}</button>
                
                <div id="bmiResult" class="result-box hidden" style="text-align:center;">
                    <strong id="bmiVal" style="font-size:2.5em; color:var(--accent-cyan);">-</strong>
                    <div id="bmiCat" style="margin-top:5px; font-weight:bold;"></div>
                </div>
            </div>
        `;
    },

    calcBMI: function () {
        const t = this._t;
        const w = parseFloat(document.getElementById('bmiWeight').value);
        const h = parseFloat(document.getElementById('bmiHeight').value) / 100; // cm to m

        if (!w || !h) return;

        const bmi = (w / (h * h)).toFixed(1);
        let cat = '', color = '';

        if (bmi < 18.5) { cat = t('Underweight', 'نحافة'); color = '#3498db'; }
        else if (bmi < 25) { cat = t('Normal', 'وزن طبيعي'); color = '#2ecc71'; }
        else if (bmi < 30) { cat = t('Overweight', 'وزن زائد'); color = '#f1c40f'; }
        else { cat = t('Obese', 'سمنة'); color = '#e74c3c'; }

        document.getElementById('bmiVal').innerText = bmi;
        const catEl = document.getElementById('bmiCat');
        catEl.innerText = cat;
        catEl.style.color = color;
        document.getElementById('bmiResult').classList.remove('hidden');
    },

    // 2. Calorie Calculator (BMR + Activity)
    renderBMR: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    <div class="input-row">
                        <label>${t('Gender', 'الجنس')}</label>
                        <select id="bmrGender" class="glass-input">
                            <option value="m">${t('Male', 'ذكر')}</option>
                            <option value="f">${t('Female', 'أنثى')}</option>
                        </select>
                    </div>
                    <div class="input-row">
                        <label>${t('Age', 'العمر')}</label>
                        <input type="number" id="bmrAge" class="glass-input" value="25">
                    </div>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                     <div class="input-row">
                        <label>${t('Weight (kg)', 'الوزن (كجم)')}</label>
                        <input type="number" id="bmrWeight" class="glass-input" placeholder="70">
                    </div>
                    <div class="input-row">
                        <label>${t('Height (cm)', 'الطول (سم)')}</label>
                        <input type="number" id="bmrHeight" class="glass-input" placeholder="170">
                    </div>
                </div>
                 <div class="input-row">
                    <label>${t('Activity Level', 'مستوى النشاط')}</label>
                    <select id="bmrAct" class="glass-input">
                        <option value="1.2">${t('Sedentary (Little/No exercise)', 'خامل (لا رياضة)')}</option>
                        <option value="1.375">${t('Lightly Active (1-3 days/week)', 'نشاط خفيف (1-3 أيام)')}</option>
                        <option value="1.55">${t('Moderately Active (3-5 days/week)', 'نشاط متوسط (3-5 أيام)')}</option>
                        <option value="1.725">${t('Very Active (6-7 days/week)', 'نشاط عالي (6-7 أيام)')}</option>
                    </select>
                </div>
                <button onclick="HealthTools.calcBMR()" class="btn-primary full-width">${t('Calculate Needs', 'احسب الاحتياج')}</button>
                
                <div id="bmrResult" class="result-box hidden">
                    <div class="res-item"><span>${t('Basal Rate (BMR):', 'الحرق الأساسي (BMR):')}</span> <strong><span id="resBMR">-</span> ${t('kcal', 'سعرة')}</strong></div>
                    <div class="res-item" style="font-size:1.2em; color:var(--accent-pink); margin-top:8px;"><span>${t('Daily Needs:', 'الاحتياج اليومي:')}</span> <strong><span id="resTDEE">-</span> ${t('kcal', 'سعرة')}</strong></div>
                    <p style="font-size:0.8em; color:#aaa; margin-top:5px;">${t('To lose weight, subtract 500 kcal.', 'لإنقاص الوزن، اطرح 500 سعرة.')}</p>
                </div>
            </div>
        `;
    },

    calcBMR: function () {
        const g = document.getElementById('bmrGender').value;
        const a = parseFloat(document.getElementById('bmrAge').value);
        const w = parseFloat(document.getElementById('bmrWeight').value);
        const h = parseFloat(document.getElementById('bmrHeight').value);
        const act = parseFloat(document.getElementById('bmrAct').value);

        if (!w || !h || !a) return;

        // Mifflin-St Jeor Equation
        let bmr = (10 * w) + (6.25 * h) - (5 * a);
        if (g === 'm') bmr += 5;
        else bmr -= 161;

        const tdee = bmr * act;

        document.getElementById('resBMR').innerText = Math.round(bmr);
        document.getElementById('resTDEE').innerText = Math.round(tdee);
        document.getElementById('bmrResult').classList.remove('hidden');
    },

    // 3. Water Intake
    renderWater: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Weight (kg)', 'الوزن (كجم)')}</label>
                    <input type="number" id="waterWeight" class="glass-input" placeholder="e.g. 70">
                </div>
                <button onclick="HealthTools.calcWater()" class="btn-primary full-width">${t('Calculate Intake', 'احسب الاحتياج')}</button>
                
                <div id="waterRes" class="result-box hidden" style="text-align:center;">
                     <strong style="font-size:3em; color:#3498db;"><span id="watL">-</span>L</strong>
                     <div style="margin-top:5px;">${t('Approx. cups:', 'عدد الأكواب تقريباً:')} <strong id="watCups">-</strong></div>
                </div>
            </div>
        `;
    },

    calcWater: function () {
        const w = parseFloat(document.getElementById('waterWeight').value);
        if (!w) return;

        // Simple rule: Weight * 35ml
        const ml = w * 35;
        const l = (ml / 1000).toFixed(1);
        const cups = Math.round(ml / 250);

        document.getElementById('watL').innerText = l;
        document.getElementById('watCups').innerText = cups;
        document.getElementById('waterRes').classList.remove('hidden');
    },

    // 4. Sleep Calculator
    renderSleep: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('I want to wake up at:', 'أريد الاستيقاظ الساعة:')}</label>
                    <input type="time" id="wakeTime" class="glass-input" value="06:00">
                </div>
                <button onclick="HealthTools.calcSleep()" class="btn-primary full-width">${t('Calculate Bedtime', 'متى يجب أن أنام؟')}</button>
                
                <div id="sleepRes" class="result-box hidden">
                    <p style="text-align:center; margin-bottom:10px;">${t('You should fall asleep at one of these times:', 'يجب أن تغفو في أحد هذه الأوقات:')}</p>
                    <div id="sleepTimes" style="display:flex; flex-wrap:wrap; justify-content:center; gap:10px;"></div>
                    <p style="font-size:0.8em; color:#aaa; margin-top:10px; text-align:center;">
                        ${t('*Calculated based on 90-minute sleep cycles. Allow 15 mins to fall asleep.', '*محسوبة بناءً على دورات نوم مدتها 90 دقيقة. أضف 15 دقيقة للغفو.')}
                    </p>
                </div>
            </div>
        `;
    },

    calcSleep: function () {
        const timeStr = document.getElementById('wakeTime').value;
        if (!timeStr) return;

        const [h, m] = timeStr.split(':').map(Number);
        const wakeDate = new Date();
        wakeDate.setHours(h, m, 0, 0);

        // Calculate 4, 5, and 6 cycles back (90 mins each)
        // 4 cycles = 6 hours
        // 5 cycles = 7.5 hours
        // 6 cycles = 9 hours
        // Subtract 15 mins for falling asleep

        const cycles = [6, 5, 4]; // Recommended order
        const times = [];

        cycles.forEach(c => {
            const d = new Date(wakeDate);
            d.setMinutes(d.getMinutes() - (c * 90) - 15);
            times.push(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        });

        const html = times.map((tm, i) => `
            <span style="
                background: ${i === 1 ? 'var(--accent-pink)' : 'rgba(255,255,255,0.1)'}; 
                padding: 8px 16px; 
                border-radius: 20px; 
                font-weight: bold; 
                color: white;
                border: 1px solid rgba(255,255,255,0.2);
            ">${tm}</span>
        `).join('');

        document.getElementById('sleepTimes').innerHTML = html;
        document.getElementById('sleepRes').classList.remove('hidden');
    },

    // 5. Breathing Exercise (Box Breathing)
    renderBreath: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group" style="text-align:center; padding:40px 0;">
                <div id="breathCircle" style="
                    width:150px; height:150px; 
                    border-radius:50%; 
                    background:rgba(255,255,255,0.05); 
                    border:4px solid var(--accent-cyan);
                    margin:0 auto 30px;
                    display:flex; align-items:center; justify-content:center;
                    font-size:1.5em; font-weight:bold;
                    transition: all 4s ease-in-out;
                    box-shadow: 0 0 30px rgba(0,255,242,0.1);
                ">${t('Ready?', 'جاهز؟')}</div>
                
                <button id="breathBtn" onclick="HealthTools.startBreath()" class="btn-primary">${t('Start Exercise', 'ابدأ التمرين')}</button>
                <div id="breathInstr" style="margin-top:20px; font-size:1.2em; min-height:30px;"></div>
            </div>
        `;
        this.breathState = 'idle';
    },

    startBreath: function () {
        if (this.breathState === 'running') return;
        this.breathState = 'running';
        document.getElementById('breathBtn').classList.add('hidden');

        const circle = document.getElementById('breathCircle');
        const text = document.getElementById('breathInstr');
        const t = this._t;

        const cycle = () => {
            if (this.breathState !== 'running') return;

            // Inhale (4s)
            text.innerText = t('Inhale...', 'شهيق...');
            circle.style.transform = 'scale(1.5)';
            circle.style.background = 'rgba(0,255,242,0.2)';
            circle.innerText = '4';

            setTimeout(() => {
                // Hold (4s)
                text.innerText = t('Hold...', 'احبس...');
                circle.innerText = '4';

                setTimeout(() => {
                    // Exhale (4s)
                    text.innerText = t('Exhale...', 'زفير...');
                    circle.style.transform = 'scale(1)';
                    circle.style.background = 'rgba(255,255,255,0.05)';
                    circle.innerText = '4';

                    setTimeout(() => {
                        // Hold (4s)
                        text.innerText = t('Hold...', 'احبس...');

                        setTimeout(() => {
                            cycle(); // Loop
                        }, 4000);
                    }, 4000);
                }, 4000);
            }, 4000);
        };

        cycle();
    }
};

window.HealthTools = HealthTools;
