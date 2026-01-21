/**
 * Finance Tools Module
 * Handles UI injection and logic for Loan, VAT, Salary, etc.
 */

const FinanceTools = {
    // 1. Loan Calculator
    // ----------------------------------------------------------------
    renderLoanCalc: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>Loan Amount (SAR)</label>
                    <input type="number" id="loanAmount" placeholder="e.g. 100000" class="glass-input">
                </div>
                <div class="input-row">
                    <label>Interest Rate (%)</label>
                    <input type="number" id="loanRate" placeholder="e.g. 3.5" step="0.1" class="glass-input">
                </div>
                <div class="input-row">
                    <label>Loan Term (Years)</label>
                    <input type="number" id="loanTerm" placeholder="e.g. 5" class="glass-input">
                </div>
                <button onclick="FinanceTools.calcLoan()" class="btn-primary full-width">Calculate</button>
                
                <div id="loanResult" class="result-box hidden">
                    <div class="res-item"><span>Monthly Payment:</span> <strong id="resMonthly">-</strong></div>
                    <div class="res-item"><span>Total Interest:</span> <strong id="resInterest">-</strong></div>
                    <div class="res-item"><span>Total Payment:</span> <strong id="resTotal">-</strong></div>
                </div>
            </div>
        `;
    },

    calcLoan: function () {
        const P = parseFloat(document.getElementById('loanAmount').value);
        const r = parseFloat(document.getElementById('loanRate').value) / 100 / 12;
        const n = parseFloat(document.getElementById('loanTerm').value) * 12;

        if (!P || !n) return;

        // Amortization Formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
        // If rate is 0
        let monthly = 0;
        if (r === 0) {
            monthly = P / n;
        } else {
            monthly = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        }

        const totalPay = monthly * n;
        const totalInt = totalPay - P;

        document.getElementById('resMonthly').innerText = monthly.toFixed(2) + ' SAR';
        document.getElementById('resInterest').innerText = totalInt.toFixed(2) + ' SAR';
        document.getElementById('resTotal').innerText = totalPay.toFixed(2) + ' SAR';
        document.getElementById('loanResult').classList.remove('hidden');
    },

    // 2. VAT Calculator
    // ----------------------------------------------------------------
    renderVAT: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>Amount (SAR)</label>
                    <input type="number" id="vatAmount" placeholder="e.g. 100" class="glass-input">
                </div>
                <div class="input-row">
                    <label>VAT Rate (%)</label>
                    <input type="number" id="vatRate" value="15" class="glass-input">
                </div>
                <div style="display:flex; gap:10px; margin-top:16px;">
                    <button onclick="FinanceTools.calcVAT('add')" class="btn-primary" style="flex:1;">Add VAT (+)</button>
                    <button onclick="FinanceTools.calcVAT('remove')" class="btn-primary" style="flex:1; background:var(--glass-bg); border:1px solid var(--glass-border);">Remove VAT (-)</button>
                </div>
                
                <div id="vatResult" class="result-box hidden">
                    <div class="res-item"><span>Original:</span> <strong id="vResOrig">-</strong></div>
                    <div class="res-item"><span>VAT Amount:</span> <strong id="vResTax">-</strong></div>
                    <div class="res-item"><span>Final:</span> <strong id="vResFinal">-</strong></div>
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
            // Remove VAT: Final = Amount, Original = Amount / (1+rate)
            final = amount;
            original = amount / (1 + rate);
            tax = final - original;
        }

        document.getElementById('vResOrig').innerText = original.toFixed(2);
        document.getElementById('vResTax').innerText = tax.toFixed(2);
        document.getElementById('vResFinal').innerText = final.toFixed(2);
        document.getElementById('vatResult').classList.remove('hidden');
    },

    // 3. Net Salary (KSA Simplified)
    // ----------------------------------------------------------------
    renderSalary: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>Total Gross Salary (Basic + Housing)</label>
                    <input type="number" id="salGross" placeholder="e.g. 8000" class="glass-input">
                </div>
                 <div class="input-row">
                    <label>Basic Salary (for GOSI calc)</label>
                    <input type="number" id="salBasic" placeholder="e.g. 6000" class="glass-input">
                </div>
                 <div class="input-row">
                    <label>Housing Allowance</label>
                    <input type="number" id="salHousing" placeholder="e.g. 2000" class="glass-input">
                </div>
                <button onclick="FinanceTools.calcSalary()" class="btn-primary full-width">Calculate Net</button>
                
                <div id="salResult" class="result-box hidden">
                    <div class="res-item"><small>GOSI (9.75% of Basic+Housing):</small> <strong id="resGosi">-</strong></div>
                    <div class="res-item" style="font-size:1.2em; color:var(--accent-pink);"><span>Net Salary:</span> <strong id="resNet">-</strong></div>
                </div>
                 <p style="font-size:12px; color:#aaa; margin-top:10px;">*Estimates based on Private Sector GOSI (Saudi National). Does not include other deductions.</p>
            </div>
        `;
    },

    calcSalary: function () {
        // Simple GOSI: 9.75% of (Basic + Housing)
        // Cap applies but for simple tool we assume standard range
        const basic = parseFloat(document.getElementById('salBasic').value) || 0;
        const housing = parseFloat(document.getElementById('salHousing').value) || 0;
        // Or if user just entered Gross
        let gross = parseFloat(document.getElementById('salGross').value);

        if (!gross && (basic || housing)) gross = basic + housing;
        if (!gross) return;

        // GOSI Base is usually Basic+Housing
        // Rate 9.75%
        const gosi = gross * 0.0975;
        const net = gross - gosi;

        document.getElementById('resGosi').innerText = gosi.toFixed(2) + ' SAR';
        document.getElementById('resNet').innerText = net.toFixed(2) + ' SAR';
        document.getElementById('salResult').classList.remove('hidden');
    },

    // 4. Currency Converter
    // ----------------------------------------------------------------
    renderCurrency: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>Amount</label>
                    <input type="number" id="currAmount" placeholder="e.g. 100" class="glass-input">
                </div>
                <div style="display:flex; gap:16px;">
                    <div class="input-row" style="flex:1;">
                        <label>From</label>
                        <select id="currFrom" class="glass-input">
                            <option value="SAR">SAR (Saudi Riyal)</option>
                            <option value="USD">USD (US Dollar)</option>
                            <option value="EUR">EUR (Euro)</option>
                            <option value="GBP">GBP (British Pound)</option>
                            <option value="AED">AED (UAE Dirham)</option>
                        </select>
                    </div>
                    <div class="input-row" style="flex:1;">
                        <label>To</label>
                        <select id="currTo" class="glass-input">
                            <option value="USD">USD (US Dollar)</option>
                            <option value="SAR" selected>SAR (Saudi Riyal)</option>
                            <option value="EUR">EUR (Euro)</option>
                            <option value="GBP">GBP (British Pound)</option>
                            <option value="AED">AED (UAE Dirham)</option>
                        </select>
                    </div>
                </div>
                <button onclick="FinanceTools.calcCurrency()" class="btn-primary full-width">Convert</button>
                
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

        // Static Rates (Placeholder) - ideally fetch live
        const ratesToSAR = { SAR: 1, USD: 3.75, EUR: 4.1, GBP: 4.9, AED: 1.02 };

        // Convert 'From' to SAR, then SAR to 'To'
        // Rate = (1 / RateFrom) * RateTo ? No.
        // Base SAR: 
        // 1 USD = 3.75 SAR
        // 1 SAR = 1/3.75 USD

        // Convert Input to SAR Base
        const valInSAR = amount * ratesToSAR[from];

        // Convert SAR Base to Target
        // If Target is USD (3.75), we divide SAR by 3.75? Yes.
        // wait, ratesToSAR[USD] = 3.75 means 1 USD = 3.75 SAR.
        // So User has 10 USD. valInSAR = 10 * 3.75 = 37.5.
        // Convert 37.5 SAR to EUR. 1 EUR = 4.1 SAR. 
        // So 37.5 / 4.1 = 9.14 EUR.

        const finalVal = valInSAR / ratesToSAR[to];
        const singleRate = (1 * ratesToSAR[from]) / ratesToSAR[to];

        document.getElementById('resConverted').innerText = finalVal.toFixed(2) + ' ' + to;
        document.getElementById('rateBase').innerText = from;
        document.getElementById('rateVal').innerText = singleRate.toFixed(4);
        document.getElementById('rateTarget').innerText = to;

        document.getElementById('currResult').classList.remove('hidden');
    },

    // 5. Savings Goal
    // ----------------------------------------------------------------
    renderSavings: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>Savings Goal (SAR)</label>
                    <input type="number" id="svgGoal" placeholder="e.g. 50000" class="glass-input">
                </div>
                <div class="input-row">
                    <label>Current Savings</label>
                    <input type="number" id="svgCurrent" placeholder="e.g. 5000" class="glass-input">
                </div>
                <div class="input-row">
                    <label>Monthly Contribution</label>
                    <input type="number" id="svgMonthly" placeholder="e.g. 1000" class="glass-input">
                </div>
                <button onclick="FinanceTools.calcSavings()" class="btn-primary full-width">Calculate Plan</button>
                
                <div id="svgResult" class="result-box hidden">
                    <div class="res-item"><span>Time to reach goal:</span> <strong id="resSvgTime">-</strong></div>
                    <div class="res-item"><span>Total Contributions:</span> <strong id="resSvgTotal">-</strong></div>
                </div>
            </div>
        `;
    },

    calcSavings: function () {
        const goal = parseFloat(document.getElementById('svgGoal').value) || 0;
        const current = parseFloat(document.getElementById('svgCurrent').value) || 0;
        const monthly = parseFloat(document.getElementById('svgMonthly').value);

        if (!goal || !monthly) return;

        const remaining = goal - current;
        if (remaining <= 0) {
            document.getElementById('resSvgTime').innerText = "Goal Reached!";
            document.getElementById('resSvgTotal').innerText = "0";
            document.getElementById('svgResult').classList.remove('hidden');
            return;
        }

        const months = Math.ceil(remaining / monthly);
        const years = (months / 12).toFixed(1);

        document.getElementById('resSvgTime').innerText = `${months} Months (${years} Years)`;
        document.getElementById('resSvgTotal').innerText = (months * monthly).toLocaleString() + ' SAR';
        document.getElementById('svgResult').classList.remove('hidden');
    },

    // 6. Zakat Calculator (Simple)
    // ----------------------------------------------------------------
    renderZakat: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>Total Zakatable Assets (SAR)</label>
                    <small style="color:var(--text-secondary); margin-bottom:4px;">Cash, Gold, Silver, Stocks, etc. held for 1 lunar year.</small>
                    <input type="number" id="zakatAssets" placeholder="e.g. 100000" class="glass-input">
                </div>
                <button onclick="FinanceTools.calcZakat()" class="btn-primary full-width">Calculate Zakat (2.5%)</button>
                
                <div id="zakatResult" class="result-box hidden">
                    <div class="res-item"><span>Your Zakat:</span> <strong id="resZakatVal" style="font-size:1.4em; color:var(--accent-pink);">-</strong></div>
                </div>
                <p style="font-size:11px; color:#aaa; margin-top:10px; text-align:center;">
                    *Disclaimer: This is a simplified calculator. Consult a specialized scholar for complex assets or business inventory.
                </p>
            </div>
        `;
    },

    calcZakat: function () {
        const assets = parseFloat(document.getElementById('zakatAssets').value);
        if (!assets) return;

        // Nisab check? Gold price varies. Assume user wants 2.5% of input.
        const zakat = assets * 0.025;

        document.getElementById('resZakatVal').innerText = zakat.toLocaleString() + ' SAR';
        document.getElementById('zakatResult').classList.remove('hidden');
    }
};

// Export (Global)
window.FinanceTools = FinanceTools;
