/**
 * Life Tools Module
 * Bill Splitter, Tip Calculator, Decision Maker
 */

const LifeTools = {
    _t: function (en, ar) {
        return document.documentElement.lang === 'ar' ? ar : en;
    },

    // 1. Bill Splitter
    renderBill: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Total Bill', 'مبلغ الفاتورة')}</label>
                    <input type="number" id="billTotal" class="glass-input" placeholder="0.00">
                </div>
                <div class="input-row">
                    <label>${t('Number of People', 'عدد الأشخاص')}</label>
                    <input type="number" id="billPeople" class="glass-input" value="2">
                </div>
                <div class="input-row">
                    <label>${t('Tip / Service (%)', 'إكرامية / خدمة (%)')}</label>
                    <input type="number" id="billTip" class="glass-input" value="0">
                </div>
                <button onclick="LifeTools.calcBill()" class="btn-primary full-width">${t('Calculate Split', 'حساب التقسيم')}</button>
                
                <div id="billResult" class="result-box hidden" style="text-align:center;">
                    <div style="font-size:0.9em; color:#aaa;">${t('Each Person Pays', 'كل شخص يدفع')}</div>
                    <div id="billPerPerson" style="font-size:2.5em; font-weight:bold; color:var(--accent-cyan);"></div>
                    <div style="font-size:0.8em; color:#666; margin-top:5px;">
                        ${t('Total with Tip:', 'الإجمالي مع الخدمة:')} <span id="billGrandTotal"></span>
                    </div>
                </div>
            </div>
        `;
    },

    calcBill: function () {
        const total = parseFloat(document.getElementById('billTotal').value);
        const people = parseInt(document.getElementById('billPeople').value);
        const tip = parseFloat(document.getElementById('billTip').value) || 0;

        if (!total || !people) return;

        const totalWithTip = total + (total * (tip / 100));
        const perPerson = totalWithTip / people;

        document.getElementById('billPerPerson').innerText = perPerson.toFixed(2);
        document.getElementById('billGrandTotal').innerText = totalWithTip.toFixed(2);
        document.getElementById('billResult').classList.remove('hidden');
    },

    // 2. Decision Maker (Wheel)
    renderDecision: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Options (comma separated)', 'الخيارات (افصل بفاصلة)')}</label>
                    <textarea id="decOptions" class="glass-input" rows="3" placeholder="${t('Pizza, Burger, Shawarma...', 'بيتزا, برجر, شاورما...')}" oninput="LifeTools.previewOptions()"></textarea>
                </div>
                
                <div id="decPreview" style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center; min-height:40px;"></div>

                <button onclick="LifeTools.decide()" class="btn-primary full-width" style="margin-top:10px;">${t('Spin the Wheel!', 'دـور العـجلـة!')}</button>
                
                <div id="decResult" class="result-box hidden" style="text-align:center; position:relative; overflow:hidden;">
                    <div style="font-size:1.2em; color:#aaa; margin-bottom:10px;">${t('The Winner Is...', 'الفائز هو...')}</div>
                    
                    <div id="decSpinner" style="height:60px; overflow:hidden; position:relative;">
                        <div id="decSpinnerText" style="font-size:2.5em; font-weight:800; color:var(--text-secondary); transition: transform 0.1s;"></div>
                    </div>

                    <div id="decFinal" style="display:none; transform:scale(0); transition:transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                        <div id="decWinnerText" style="font-size:3.5em; font-weight:900; background:var(--primary-gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent; filter:drop-shadow(0 0 20px rgba(109, 76, 255, 0.5));"></div>
                        <div style="font-size:40px; margin-top:10px;">🎉</div>
                    </div>
                </div>
            </div>
        `;
    },

    previewOptions: function () {
        const text = document.getElementById('decOptions').value;
        const div = document.getElementById('decPreview');
        if (!text) { div.innerHTML = ''; return; }

        const opts = text.split(/[,\n]/).map(s => s.trim()).filter(s => s);
        div.innerHTML = opts.map(o => `<span style="background:rgba(255,255,255,0.1); padding:4px 12px; border-radius:20px; font-size:12px;">${o}</span>`).join('');
    },

    decide: function () {
        const text = document.getElementById('decOptions').value;
        if (!text) return;

        const opts = text.split(/[,\n]/).map(s => s.trim()).filter(s => s);
        if (opts.length < 2) {
            alert(this._t('Please enter at least 2 options!', 'الرجاء إدخال خيارين على الأقل!'));
            return;
        }

        const resBox = document.getElementById('decResult');
        const spinner = document.getElementById('decSpinner');
        const spinnerText = document.getElementById('decSpinnerText');
        const finalDiv = document.getElementById('decFinal');
        const winnerText = document.getElementById('decWinnerText');

        resBox.classList.remove('hidden');
        spinner.style.display = 'block';
        finalDiv.style.display = 'none';
        finalDiv.style.transform = 'scale(0)';

        // Rolling Animation
        let count = 0;
        const maxCount = 30; // Number of flips
        let speed = 50;

        const roll = () => {
            const rand = opts[Math.floor(Math.random() * opts.length)];
            spinnerText.innerText = rand;
            spinnerText.style.transform = `translateY(${count % 2 === 0 ? '-10px' : '10px'})`;

            count++;
            if (count < maxCount) {
                speed += 10; // Slow down
                setTimeout(() => {
                    spinnerText.style.transform = 'translateY(0)';
                    roll();
                }, speed);
            } else {
                // Finish
                const winner = opts[Math.floor(Math.random() * opts.length)];
                spinner.style.display = 'none';
                finalDiv.style.display = 'block';
                winnerText.innerText = winner;

                // Pop effect
                setTimeout(() => {
                    finalDiv.style.transform = 'scale(1)';
                    // Confetti trigger if we had a library, but CSS animation is enough for now
                }, 100);
            }
        };

        roll();
    },

    // 3. Tip Calculator (Standalone)
    renderTip: function (container) {
        // Logic is almost same as bill splitter, can reuse or separate. 
        // Since Bill Splitter covers tipping, maybe "Tip Calc" is redundant?
        // Let's make it a simple "Percentage" calculator for generic use.
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Bill Amount', 'مبلغ الفاتورة')}</label>
                    <input type="number" id="tipBill" class="glass-input">
                </div>
                <div style="display:flex; gap:10px; margin-bottom:15px;">
                    <button onclick="LifeTools.setTip(10)" class="glass-panel" style="flex:1">10%</button>
                    <button onclick="LifeTools.setTip(15)" class="glass-panel" style="flex:1">15%</button>
                    <button onclick="LifeTools.setTip(20)" class="glass-panel" style="flex:1">20%</button>
                </div>
                <div class="input-row">
                    <label>${t('Custom Tip %', 'نسبة مخصصة')}</label>
                    <input type="number" id="tipPct" class="glass-input" value="15">
                </div>
                
                <button onclick="LifeTools.calcTip()" class="btn-primary full-width">${t('Calculate', 'احسب')}</button>
                
                <div id="tipResult" class="result-box hidden">
                     <div style="display:flex; justify-content:space-between;">
                        <span>${t('Tip Amount:', 'قيمة الإكرامية:')}</span>
                        <strong id="tipVal"></strong>
                     </div>
                     <div style="display:flex; justify-content:space-between; margin-top:5px; padding-top:5px; border-top:1px solid #eee;">
                        <span>${t('Total:', 'الإجمالي:')}</span>
                        <strong id="tipTotal"></strong>
                     </div>
                </div>
            </div>
         `;
    },

    setTip: function (val) {
        document.getElementById('tipPct').value = val;
        this.calcTip();
    },

    calcTip: function () {
        const bill = parseFloat(document.getElementById('tipBill').value);
        const pct = parseFloat(document.getElementById('tipPct').value);
        if (!bill) return;

        const tipAmt = bill * (pct / 100);
        const total = bill + tipAmt;

        document.getElementById('tipVal').innerText = tipAmt.toFixed(2);
        document.getElementById('tipTotal').innerText = total.toFixed(2);
        document.getElementById('tipResult').classList.remove('hidden');
    }
};

window.LifeTools = LifeTools;
