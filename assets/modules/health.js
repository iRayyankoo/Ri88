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
    }
};

window.HealthTools = HealthTools;
