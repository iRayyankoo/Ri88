/**
 * Finance Tools Module
 * Handles UI injection and logic for Loan, VAT, Salary, etc.
 */

const FinanceTools = {
    _t: function (en, ar) {
        return document.documentElement.lang === 'ar' ? ar : en;
    },

    // 1. Loan Calculator
    renderLoanCalc: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Loan Amount (SAR)', 'قيمة القرض (ريال)')}</label>
                    <input type="number" id="loanAmount" placeholder="e.g. 100000" class="glass-input">
                </div>
                <div class="input-row">
                    <label>${t('Interest Rate (%)', 'نسبة الفائدة (%)')}</label>
                    <input type="number" id="loanRate" placeholder="e.g. 3.5" step="0.1" class="glass-input">
                </div>
                <div class="input-row">
                    <label>${t('Loan Term (Years)', 'مدة القرض (سنوات)')}</label>
                    <input type="number" id="loanTerm" placeholder="e.g. 5" class="glass-input">
                </div>
                <button onclick="FinanceTools.calcLoan()" class="btn-primary full-width">${t('Calculate', 'احسب')}</button>
                
                <div id="loanResult" class="result-box hidden">
                    <div class="res-item"><span>${t('Monthly Payment:', 'القسط الشهري:')}</span> <strong id="resMonthly">-</strong></div>
                    <div class="res-item"><span>${t('Total Interest:', 'إجمالي الفائدة:')}</span> <strong id="resInterest">-</strong></div>
                    <div class="res-item"><span>${t('Total Payment:', 'إجمالي المبلغ:')}</span> <strong id="resTotal">-</strong></div>
                </div>
            </div>
        `;
    },

    calcLoan: function () {
        const t = this._t;
        const P = parseFloat(document.getElementById('loanAmount').value);
        const r = parseFloat(document.getElementById('loanRate').value) / 100 / 12;
        const n = parseFloat(document.getElementById('loanTerm').value) * 12;

        if (!P || !n) return;

        let monthly = 0;
        if (r === 0) {
            monthly = P / n;
        } else {
            monthly = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        }

        const totalPay = monthly * n;
        const totalInt = totalPay - P;
        const suffix = t(' SAR', ' ريال');

        document.getElementById('resMonthly').innerText = monthly.toFixed(2) + suffix;
        document.getElementById('resInterest').innerText = totalInt.toFixed(2) + suffix;
        document.getElementById('resTotal').innerText = totalPay.toFixed(2) + suffix;
        document.getElementById('loanResult').classList.remove('hidden');
    },

    // 2. VAT Calculator
    renderVAT: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Amount (SAR)', 'المبلغ (ريال)')}</label>
                    <input type="number" id="vatAmount" placeholder="e.g. 100" class="glass-input">
                </div>
                <div class="input-row">
                    <label>${t('VAT Rate (%)', 'نسبة الضريبة (%)')}</label>
                    <input type="number" id="vatRate" value="15" class="glass-input">
                </div>
                <div style="display:flex; gap:10px; margin-top:16px;">
                    <button onclick="FinanceTools.calcVAT('add')" class="btn-primary" style="flex:1;">${t('Add VAT (+)', 'أضف الضريبة (+)')}</button>
                    <button onclick="FinanceTools.calcVAT('remove')" class="btn-primary" style="flex:1; background:var(--glass-bg); border:1px solid var(--glass-border);">${t('Remove VAT (-)', 'أزل الضريبة (-)')}</button>
                </div>
                
                <div id="vatResult" class="result-box hidden">
                    <div class="res-item"><span>${t('Original:', 'الأصل:')}</span> <strong id="vResOrig">-</strong></div>
                    <div class="res-item"><span>${t('VAT Amount:', 'قيمة الضريبة:')}</span> <strong id="vResTax">-</strong></div>
                    <div class="res-item"><span>${t('Final:', 'الإجمالي:')}</span> <strong id="vResFinal">-</strong></div>
                </div>
            </div>
        `;
    },

    calcVAT: function (mode) {
        const amount = parseFloat(document.getElementById('vatAmount').value);
        const rate = parseFloat(document.getElementById('vatRate').value) / 100;

        if (isNaN(amount)) return;

        let original, tax, final;

        if (mode === 'add') {
            original = amount;
            tax = amount * rate;
            final = amount + tax;
        } else {
            final = amount;
            original = amount / (1 + rate);
            tax = final - original;
        }

        document.getElementById('vResOrig').innerText = original.toFixed(2);
        document.getElementById('vResTax').innerText = tax.toFixed(2);
        document.getElementById('vResFinal').innerText = final.toFixed(2);
        document.getElementById('vatResult').classList.remove('hidden');
    },

    // 3. Net Salary
    renderSalary: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Total Gross Salary (Basic + Housing)', 'إجمالي الراتب (الأساسي + السكن)')}</label>
                    <input type="number" id="salGross" placeholder="e.g. 8000" class="glass-input">
                </div>
                 <div class="input-row">
                    <label>${t('Basic Salary (for GOSI calc)', 'الراتب الأساسي (لحساب التأمينات)')}</label>
                    <input type="number" id="salBasic" placeholder="e.g. 6000" class="glass-input">
                </div>
                 <div class="input-row">
                    <label>${t('Housing Allowance', 'بدل السكن')}</label>
                    <input type="number" id="salHousing" placeholder="e.g. 2000" class="glass-input">
                </div>
                <button onclick="FinanceTools.calcSalary()" class="btn-primary full-width">${t('Calculate Net', 'احسب الصافي')}</button>
                
                <div id="salResult" class="result-box hidden">
                    <div class="res-item"><small>${t('GOSI (9.75% of Basic+Housing):', 'التأمينات (9.75%):')}</small> <strong id="resGosi">-</strong></div>
                    <div class="res-item" style="font-size:1.2em; color:var(--accent-pink);"><span>${t('Net Salary:', 'صافي الراتب:')}</span> <strong id="resNet">-</strong></div>
                </div>
                 <p style="font-size:12px; color:#aaa; margin-top:10px;">${t('*Estimates based on Private Sector GOSI (Saudi National).', '*تقديرات بناءً على تأمينات القطاع الخاص (سعودي).')}</p>
            </div>
        `;
    },

    calcSalary: function () {
        const t = this._t;
        const basic = parseFloat(document.getElementById('salBasic').value) || 0;
        const housing = parseFloat(document.getElementById('salHousing').value) || 0;
        let gross = parseFloat(document.getElementById('salGross').value);

        if (!gross && (basic || housing)) gross = basic + housing;
        if (!gross) return;

        const gosi = gross * 0.0975;
        const net = gross - gosi;
        const suffix = t(' SAR', ' ريال');

        document.getElementById('resGosi').innerText = gosi.toFixed(2) + suffix;
        document.getElementById('resNet').innerText = net.toFixed(2) + suffix;
        document.getElementById('salResult').classList.remove('hidden');
    },

    // 4. Currency Converter
    renderCurrency: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Amount', 'المبلغ')}</label>
                    <input type="number" id="currAmount" placeholder="e.g. 100" class="glass-input">
                </div>
                <div style="display:flex; gap:16px;">
                    <div class="input-row" style="flex:1;">
                        <label>${t('From', 'من')}</label>
                        <select id="currFrom" class="glass-input">
                            <option value="SAR">${t('SAR (Saudi Riyal)', 'ريال سعودي')}</option>
                            <option value="USD">${t('USD (US Dollar)', 'دولار أمريكي')}</option>
                            <option value="EUR">${t('EUR (Euro)', 'يورو')}</option>
                            <option value="GBP">${t('GBP (British Pound)', 'جنيه إسترليني')}</option>
                            <option value="AED">${t('AED (UAE Dirham)', 'درهم إماراتي')}</option>
                        </select>
                    </div>
                    <div class="input-row" style="flex:1;">
                        <label>${t('To', 'إلى')}</label>
                        <select id="currTo" class="glass-input">
                            <option value="USD">${t('USD (US Dollar)', 'دولار أمريكي')}</option>
                            <option value="SAR" selected>${t('SAR (Saudi Riyal)', 'ريال سعودي')}</option>
                            <option value="EUR">${t('EUR (Euro)', 'يورو')}</option>
                            <option value="GBP">${t('GBP (British Pound)', 'جنيه إسترليني')}</option>
                            <option value="AED">${t('AED (UAE Dirham)', 'درهم إماراتي')}</option>
                        </select>
                    </div>
                </div>
                <button onclick="FinanceTools.calcCurrency()" class="btn-primary full-width">${t('Convert', 'تحويل')}</button>
                
                <div id="currResult" class="result-box hidden" style="text-align:center;">
                    <strong id="resConverted" style="font-size:2em; color:var(--accent-pink);">-</strong>
                    <div style="font-size:0.9em; opacity:0.7; margin-top:8px;">1 <span id="rateBase"></span> = <span id="rateVal"></span> <span id="rateTarget"></span></div>
                </div>
            </div>
        `;
    },

    calcCurrency: function () {
        const amount = parseFloat(document.getElementById('currAmount').value);
        const from = document.getElementById('currFrom').value;
        const to = document.getElementById('currTo').value;

        if (!amount) return;

        const ratesToSAR = { SAR: 1, USD: 3.75, EUR: 4.1, GBP: 4.9, AED: 1.02 };

        const valInSAR = amount * ratesToSAR[from];
        const finalVal = valInSAR / ratesToSAR[to];
        const singleRate = (1 * ratesToSAR[from]) / ratesToSAR[to];

        document.getElementById('resConverted').innerText = finalVal.toFixed(2) + ' ' + to;
        document.getElementById('rateBase').innerText = from;
        document.getElementById('rateVal').innerText = singleRate.toFixed(4);
        document.getElementById('rateTarget').innerText = to;

        document.getElementById('currResult').classList.remove('hidden');
    },

    // 4b. Crypto Converter (Simple)
    renderCrypto: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Amount', 'الكمية')}</label>
                    <input type="number" id="cryAmt" placeholder="e.g. 1" class="glass-input">
                </div>
                <div class="input-row">
                    <label>${t('Cryptocurrency', 'العملة الرقمية')}</label>
                    <select id="cryCoin" class="glass-input">
                        <option value="BTC">Bitcoin (BTC)</option>
                        <option value="ETH">Ethereum (ETH)</option>
                        <option value="SOL">Solana (SOL)</option>
                        <option value="XRP">Ripple (XRP)</option>
                    </select>
                </div>
                <button onclick="FinanceTools.calcCrypto()" class="btn-primary full-width">${t('Convert to SAR/USD', 'تحويل للريال والدولار')}</button>
                <div id="cryRes" class="result-box hidden">
                    <div class="res-item"><span>SAR:</span> <strong id="resCrySAR">-</strong></div>
                    <div class="res-item"><span>USD:</span> <strong id="resCryUSD">-</strong></div>
                    <small style="display:block; margin-top:5px; color:#aaa;">*${t('Estimated rates (Static)', 'أسعار تقديرية (ثابتة)')}</small>
                </div>
            </div>
        `;
    },
    calcCrypto: function () {
        const amt = parseFloat(document.getElementById('cryAmt').value);
        const coin = document.getElementById('cryCoin').value;
        if (!amt) return;

        // Static rates (Mock) - In real app, fetch API
        const rates = {
            BTC: { usd: 65000, sar: 243750 },
            ETH: { usd: 3500, sar: 13125 },
            SOL: { usd: 140, sar: 525 },
            XRP: { usd: 0.60, sar: 2.25 }
        };

        const r = rates[coin];
        document.getElementById('resCrySAR').innerText = (amt * r.sar).toLocaleString() + ' SAR';
        document.getElementById('resCryUSD').innerText = (amt * r.usd).toLocaleString() + ' USD';
        document.getElementById('cryRes').classList.remove('hidden');
    },

    // 5. Savings Goal
    renderSavings: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Savings Goal (SAR)', 'هدف الادخار (ريال)')}</label>
                    <input type="number" id="svgGoal" placeholder="e.g. 50000" class="glass-input">
                </div>
                <div class="input-row">
                    <label>${t('Current Savings', 'المدخرات الحالية')}</label>
                    <input type="number" id="svgCurrent" placeholder="e.g. 5000" class="glass-input">
                </div>
                <div class="input-row">
                    <label>${t('Monthly Contribution', 'المساهمة الشهرية')}</label>
                    <input type="number" id="svgMonthly" placeholder="e.g. 1000" class="glass-input">
                </div>
                <button onclick="FinanceTools.calcSavings()" class="btn-primary full-width">${t('Calculate Plan', 'احسب الخطة')}</button>
                
                <div id="svgResult" class="result-box hidden">
                    <div class="res-item"><span>${t('Time to reach goal:', 'الوقت للوصول للهدف:')}</span> <strong id="resSvgTime">-</strong></div>
                    <div class="res-item"><span>${t('Total Contributions:', 'إجمالي المساهمات:')}</span> <strong id="resSvgTotal">-</strong></div>
                </div>
            </div>
        `;
    },

    calcSavings: function () {
        const t = this._t;
        const goal = parseFloat(document.getElementById('svgGoal').value) || 0;
        const current = parseFloat(document.getElementById('svgCurrent').value) || 0;
        const monthly = parseFloat(document.getElementById('svgMonthly').value);

        if (!goal || !monthly) return;

        const remaining = goal - current;
        if (remaining <= 0) {
            document.getElementById('resSvgTime').innerText = t("Goal Reached!", "تم الوصول للهدف!");
            document.getElementById('resSvgTotal').innerText = "0";
            document.getElementById('svgResult').classList.remove('hidden');
            return;
        }

        const months = Math.ceil(remaining / monthly);
        const years = (months / 12).toFixed(1);
        const suffix = t(' SAR', ' ريال');

        document.getElementById('resSvgTime').innerText = t(`${months} Months (${years} Years)`, `${months} شهر (${years} سنة)`);
        document.getElementById('resSvgTotal').innerText = (months * monthly).toLocaleString() + suffix;
        document.getElementById('svgResult').classList.remove('hidden');
    },

    // 6. Zakat Calculator
    renderZakat: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Total Zakatable Assets (SAR)', 'إجمالي الأصول الزكوية (ريال)')}</label>
                    <small style="color:var(--text-secondary); margin-bottom:4px;">${t('Cash, Gold, Silver, Stocks, etc. held for 1 lunar year.', 'النقد، الذهب، الفضة، الأسهم، وغيرها.. مر عليها حول.')}</small>
                    <input type="number" id="zakatAssets" placeholder="e.g. 100000" class="glass-input">
                </div>
                <button onclick="FinanceTools.calcZakat()" class="btn-primary full-width">${t('Calculate Zakat (2.5%)', 'احسب الزكاة (2.5%)')}</button>
                
                <div id="zakatResult" class="result-box hidden">
                    <div class="res-item"><span>${t('Your Zakat:', 'الزكاة المستحقة:')}</span> <strong id="resZakatVal" style="font-size:1.4em; color:var(--accent-pink);">-</strong></div>
                </div>
                <p style="font-size:11px; color:#aaa; margin-top:10px; text-align:center;">
                    ${t('*Disclaimer: This is a simplified calculator. Consult a specialized scholar for complex assets or business inventory.', '*تنبيه: هذه حاسبة مبسطة. استشر مختصاً للأصول المعقدة أو زكاة العروض التجارية.')}
                </p>
            </div>
        `;
    },

    calcZakat: function () {
        const t = this._t;
        const assets = parseFloat(document.getElementById('zakatAssets').value);
        if (!assets) return;

        const zakat = assets * 0.025;
        const suffix = t(' SAR', ' ريال');

        document.getElementById('resZakatVal').innerText = zakat.toLocaleString() + suffix;
        document.getElementById('zakatResult').classList.remove('hidden');
    },

    // 7. Discount Calculator
    renderDiscount: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Original Price', 'السعر الأصلي')}</label>
                    <input type="number" id="discPrice" class="glass-input" placeholder="e.g. 200">
                </div>
                <div class="input-row">
                    <label>${t('Discount (%)', 'الخصم (%)')}</label>
                    <input type="number" id="discOff" class="glass-input" placeholder="e.g. 30">
                </div>
                <button onclick="FinanceTools.calcDiscount()" class="btn-primary full-width">${t('Calculate', 'احسب')}</button>
                
                <div id="discResult" class="result-box hidden">
                    <div class="res-item"><span>${t('New Price:', 'السعر الجديد:')}</span> <strong id="resDiscPrice" style="color:var(--accent-pink);">-</strong></div>
                    <div class="res-item"><span>${t('You Save:', 'وفرت:')}</span> <strong id="resDiscSave" style="color:#2ecc71;">-</strong></div>
                </div>
            </div>
        `;
    },

    calcDiscount: function () {
        const price = parseFloat(document.getElementById('discPrice').value);
        const off = parseFloat(document.getElementById('discOff').value);
        if (!price || !off) return;

        const save = price * (off / 100);
        const final = price - save;

        document.getElementById('resDiscPrice').innerText = final.toFixed(2);
        document.getElementById('resDiscSave').innerText = save.toFixed(2);
        document.getElementById('discResult').classList.remove('hidden');
    }
};

// Export (Global)
window.FinanceTools = FinanceTools;
