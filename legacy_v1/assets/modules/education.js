/**
 * Education Tools Module
 * GPA Calculator, Grade Calculator
 */

const EducationTools = {
    _t: function (en, ar) {
        return document.documentElement.lang === 'ar' ? ar : en;
    },

    // 1. GPA Calculator (5.0 Scale & 4.0 Scale)
    renderGPA: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Scale', 'المعدل التراكمي من')}</label>
                    <select id="gpaScale" class="glass-input">
                        <option value="5">5.0 (KSA Standard)</option>
                        <option value="4">4.0 (US Standard)</option>
                    </select>
                </div>
                <div id="gpaRows">
                    <div class="input-row gpa-row" style="display:flex; gap:10px;">
                        <input type="number" placeholder="${t('Grade (e.g. 90)', 'الدرجة (مثلاً 90)')}" class="glass-input grade-val" style="flex:1;">
                        <input type="number" placeholder="${t('Hours', 'الساعات')}" class="glass-input credit-val" style="width:80px;" value="3">
                    </div>
                    <div class="input-row gpa-row" style="display:flex; gap:10px;">
                        <input type="number" placeholder="${t('Grade (e.g. 85)', 'الدرجة (مثلاً 85)')}" class="glass-input grade-val" style="flex:1;">
                        <input type="number" placeholder="${t('Hours', 'الساعات')}" class="glass-input credit-val" style="width:80px;" value="3">
                    </div>
                </div>
                <button onclick="EducationTools.addGpaRow()" class="btn-primary" style="background:var(--glass-bg); border:1px solid var(--glass-border); margin-bottom:10px;">+ ${t('Add Course', 'أضف مادة')}</button>
                <button onclick="EducationTools.calcGPA()" class="btn-primary full-width">${t('Calculate GPA', 'احسب المعدل')}</button>
                
                <div id="gpaResult" class="result-box hidden" style="text-align:center;">
                    <div id="gpaVal" style="font-size:2.5em; color:var(--accent-cyan); font-weight:bold;">-</div>
                    <div id="gpaText" style="margin-top:5px;"></div>
                </div>
            </div>
        `;
    },

    addGpaRow: function () {
        const div = document.createElement('div');
        div.className = 'input-row gpa-row';
        div.style.display = 'flex';
        div.style.gap = '10px';
        div.innerHTML = `
            <input type="number" placeholder="Grade" class="glass-input grade-val" style="flex:1;">
            <input type="number" placeholder="Hours" class="glass-input credit-val" style="width:80px;" value="3">
        `;
        document.getElementById('gpaRows').appendChild(div);
    },

    calcGPA: function () {
        const scale = parseFloat(document.getElementById('gpaScale').value);
        const rows = document.querySelectorAll('.gpa-row');
        let totalPoints = 0;
        let totalCredits = 0;

        rows.forEach(row => {
            const grade = parseFloat(row.querySelector('.grade-val').value);
            const credit = parseFloat(row.querySelector('.credit-val').value);

            if (!isNaN(grade) && !isNaN(credit)) {
                let points = 0;
                // Simple conversion logic
                if (scale === 5) {
                    if (grade >= 95) points = 5.0;
                    else if (grade >= 90) points = 4.75;
                    else if (grade >= 85) points = 4.5;
                    else if (grade >= 80) points = 4.0;
                    else if (grade >= 75) points = 3.5;
                    else if (grade >= 70) points = 3.0;
                    else if (grade >= 60) points = 2.0;
                    else points = 1.0;
                } else {
                    if (grade >= 90) points = 4.0;
                    else if (grade >= 80) points = 3.0;
                    else if (grade >= 70) points = 2.0;
                    else if (grade >= 60) points = 1.0;
                    else points = 0.0;
                }
                totalPoints += points * credit;
                totalCredits += credit;
            }
        });

        if (totalCredits === 0) return;
        const gpa = totalPoints / totalCredits;

        document.getElementById('gpaVal').innerText = gpa.toFixed(2);
        document.getElementById('gpaText').innerText = `out of ${scale}`;
        document.getElementById('gpaResult').classList.remove('hidden');
    },

    // 2. Grade Calculator (Weighted)
    renderGrade: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <p style="text-align:center; margin-bottom:10px;">${t('Calculate final grade from assessments.', 'احسب درجتك النهائية من التقييمات.')}</p>
                <div id="gradeRows">
                    <div class="input-row grade-row" style="display:flex; gap:10px;">
                        <input type="text" placeholder="${t('Item (e.g. Midterm)', 'البند (مثلاً نصفي)')}" class="glass-input" style="flex:1;">
                        <input type="number" placeholder="${t('Weight %', 'الوزن %')}" class="glass-input grade-w" style="width:70px;" value="30">
                        <input type="number" placeholder="${t('Score', 'الدرجة')}" class="glass-input grade-s" style="width:70px;">
                    </div>
                </div>
                <button onclick="EducationTools.addGradeRow()" class="btn-primary" style="background:var(--glass-bg); border:1px solid var(--glass-border); margin-bottom:10px;">+ ${t('Add Item', 'أضف بند')}</button>
                <button onclick="EducationTools.calcFinal()" class="btn-primary full-width">${t('Calculate Total', 'احسب المجموع')}</button>
                <div id="gradeRes" class="result-box hidden" style="text-align:center;">
                     <div id="finalGrade" style="font-size:2em; font-weight:bold; color:var(--accent-warm);">-</div>
                </div>
            </div>
        `;
    },

    addGradeRow: function () {
        const div = document.createElement('div');
        div.className = 'input-row grade-row';
        div.style.display = 'flex';
        div.style.gap = '10px';
        div.innerHTML = `
            <input type="text" placeholder="Item" class="glass-input" style="flex:1;">
            <input type="number" placeholder="%" class="glass-input grade-w" style="width:70px;">
            <input type="number" placeholder="Score" class="glass-input grade-s" style="width:70px;">
        `;
        document.getElementById('gradeRows').appendChild(div);
    },

    calcFinal: function () {
        const rows = document.querySelectorAll('.grade-row');
        let total = 0;
        let totalW = 0;

        rows.forEach(r => {
            const w = parseFloat(r.querySelector('.grade-w').value) || 0;
            const s = parseFloat(r.querySelector('.grade-s').value) || 0;
            // Assuming Score is out of 100? Or raw score? 
            // Let's assume Score is raw and match weight. 
            // Actually typically: (Score / 100) * Weight. 
            // If Input is "Score: 25 (out of 30)", we rely on user inputting normalized or raw?
            // Let's assume Input Score is Percentage (0-100) for simplicity or raw matching weight?
            // "Score" often means "My Grade". If Weight is 30, and I got 25, then 25 is added.
            // Let's assume direct addition logic for simple Uni calcs.

            total += s;
            totalW += w;
        });

        document.getElementById('finalGrade').innerText = `${total} / ${totalW}`;
        document.getElementById('gradeRes').classList.remove('hidden');
    }
};

window.EducationTools = EducationTools;
