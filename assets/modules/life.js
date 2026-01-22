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
                    <textarea id="decOptions" class="glass-input" rows="3" placeholder="${t('Pizza, Burger, Shawarma...', 'بيتزا, برجر, شاورما...')}"></textarea>
                </div>
                <button onclick="LifeTools.decide()" class="btn-primary full-width">${t('Decide for Me!', 'اختر لي!')}</button>
                
                <div id="decResult" class="result-box hidden" style="text-align:center;">
                    <div style="font-size:1.2em; color:#aaa;">${t(' The Winner Is...', ' الفائز هو...')}</div>
                    <div id="decWinner" style="font-size:3em; font-weight:800; color:var(--accent-pink); margin-top:10px; animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);"></div>
                </div>
            </div>
        `;
    },

    decide: function () {
        const text = document.getElementById('decOptions').value;
        if (!text) return;

        const opts = text.split(/[,\n]/).map(s => s.trim()).filter(s => s);
        if (opts.length === 0) return;

        // Simple random visualization
        const resBox = document.getElementById('decResult');
        const winnerDiv = document.getElementById('decWinner');

        resBox.classList.remove('hidden');
        winnerDiv.innerText = "...";

        let i = 0;
        const interval = setInterval(() => {
            winnerDiv.innerText = opts[Math.floor(Math.random() * opts.length)];
            i++;
            if (i > 10) {
                clearInterval(interval);
                const winner = opts[Math.floor(Math.random() * opts.length)];
                winnerDiv.innerText = winner;
                winnerDiv.style.transform = "scale(1.2)";
                setTimeout(() => winnerDiv.style.transform = "scale(1)", 200);
            }
        }, 100);
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
