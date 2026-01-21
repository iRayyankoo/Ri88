/**
 * Saudi Work Tools
 * EOS Calculator, Leave Calculator
 */

const SaudiTools = {
    // 1. End of Service
    renderEOS: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>Total Salary (SAR)</label>
                    <input type="number" id="eosSal" class="glass-input" placeholder="e.g. 5000">
                </div>
                <div class="input-row">
                    <label>Years of Service</label>
                    <input type="number" id="eosYrs" class="glass-input" placeholder="e.g. 6.5">
                </div>
                <div class="input-row">
                     <label>Termination Reason</label>
                     <select id="eosReason" class="glass-input">
                        <option value="term">Termination by Employer (Full)</option>
                        <option value="resign">Resignation</option>
                     </select>
                </div>
                <button onclick="SaudiTools.calcEOS()" class="btn-primary full-width">Calculate Reward</button>
                
                <div id="eosRes" class="result-box hidden">
                    <h3>Estimated Reward</h3>
                    <div id="eosVal" style="font-size:2em; color:var(--accent-pink); font-weight:bold;"></div>
                    <p class="tool-desc" style="font-size:0.8em;">*Disclaimer: Estimate based on Saudi Labor Law. Verify with HR.</p>
                </div>
            </div>
        `;
    },

    calcEOS: function () {
        const sal = parseFloat(document.getElementById('eosSal').value);
        const yrs = parseFloat(document.getElementById('eosYrs').value);
        const type = document.getElementById('eosReason').value;

        if (!sal || !yrs) return;

        let reward = 0;

        // Base calc: Half salary for first 5 years, Full salary for subsequent
        let baseReward = 0;
        if (yrs <= 5) {
            baseReward = (sal / 2) * yrs;
        } else {
            baseReward = (sal / 2) * 5;
            baseReward += sal * (yrs - 5);
        }

        // Resignation Rules (approx)
        // < 2 yrs: 0
        // 2-5 yrs: 1/3
        // 5-10 yrs: 2/3
        // 10+ yrs: Full

        if (type === 'resign') {
            if (yrs < 2) reward = 0;
            else if (yrs < 5) reward = baseReward / 3;
            else if (yrs < 10) reward = (baseReward * 2) / 3;
            else reward = baseReward;
        } else {
            reward = baseReward;
        }

        document.getElementById('eosVal').innerText = reward.toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' SAR';
        document.getElementById('eosRes').classList.remove('hidden');
    },

    // 2. Leave / Return Date
    renderLeave: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>Start Date</label>
                    <input type="date" id="lvStart" class="glass-input">
                </div>
                <div class="input-row">
                    <label>Days Requested</label>
                    <input type="number" id="lvDays" class="glass-input" value="1">
                </div>
                <button onclick="SaudiTools.calcLeave()" class="btn-primary full-width">Calculate Return</button>
                <div id="lvRes" class="result-box hidden">
                     <strong>Return To Work:</strong>
                     <div id="lvDate" style="font-size:1.5em; color:var(--text-primary); margin-top:5px;"></div>
                </div>
            </div>
         `;
    },

    calcLeave: function () {
        const start = new Date(document.getElementById('lvStart').value);
        const days = parseInt(document.getElementById('lvDays').value);

        if (isNaN(start.getTime()) || !days) return;

        // Simple addition
        const end = new Date(start);
        end.setDate(end.getDate() + days);

        // Return is the day AFTER the last day of leave
        // If leave includes end date, return is +1. Assuming 'Days Requested' means duration.
        // E.g. Start 1st, 1 day. Leave = 1st. Return 2nd.
        // end is 1st + 1 = 2nd.

        document.getElementById('lvDate').innerText = end.toDateString();
        document.getElementById('lvRes').classList.remove('hidden');
    }
};

window.SaudiTools = SaudiTools;
