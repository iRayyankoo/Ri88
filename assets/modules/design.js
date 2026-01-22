/**
 * Design Tools Module
 * CSS Gradient, Box Shadow
 */

const DesignTools = {
    _t: function (en, ar) {
        return document.documentElement.lang === 'ar' ? ar : en;
    },

    // 1. CSS Gradient Generator
    renderGradient: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div id="gradPreview" style="height:150px; width:100%; border-radius:12px; margin-bottom:16px; background:linear-gradient(90deg, #ff00cc, #333399);"></div>
                
                <div style="display:flex; gap:10px; margin-bottom:10px;">
                    <input type="color" id="gradC1" value="#ff00cc" oninput="DesignTools.updateGrad()">
                    <input type="color" id="gradC2" value="#333399" oninput="DesignTools.updateGrad()">
                </div>
                
                <div class="input-row">
                    <label>${t('Direction (deg)', 'الاتجاه (درجة)')} <span id="gradDegVal">90</span></label>
                    <input type="range" id="gradDeg" min="0" max="360" value="90" class="glass-input" oninput="DesignTools.updateGrad()">
                </div>

                <div class="result-box">
                    <code id="gradCode" style="font-size:0.8em; word-break:break-all;">background: linear-gradient(90deg, #ff00cc, #333399);</code>
                    <button onclick="navigator.clipboard.writeText(document.getElementById('gradCode').innerText)" class="tool-action" style="margin-top:8px;">${t('Copy CSS', 'نسخ الكود')}</button>
                </div>
            </div>
        `;
    },

    updateGrad: function () {
        const c1 = document.getElementById('gradC1').value;
        const c2 = document.getElementById('gradC2').value;
        const deg = document.getElementById('gradDeg').value;
        const prev = document.getElementById('gradPreview');
        const code = document.getElementById('gradCode');
        const val = document.getElementById('gradDegVal');

        val.innerText = deg;
        const css = `linear-gradient(${deg}deg, ${c1}, ${c2})`;
        prev.style.background = css;
        code.innerText = `background: ${css};`;
    },

    // 2. Box Shadow Generator
    renderShadow: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                 <div style="background:#fff; height:150px; display:flex; align-items:center; justify-content:center; border-radius:12px; margin-bottom:20px; overflow:hidden;">
                    <div id="shadowBox" style="width:80px; height:80px; background:#fff; border-radius:12px; border:1px solid #eee;"></div>
                 </div>
                 
                 <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    <div><label>X</label><input type="range" id="shX" min="-50" max="50" value="0" class="glass-input" oninput="DesignTools.updateShadow()"></div>
                    <div><label>Y</label><input type="range" id="shY" min="-50" max="50" value="10" class="glass-input" oninput="DesignTools.updateShadow()"></div>
                    <div><label>Blur</label><input type="range" id="shBlur" min="0" max="100" value="30" class="glass-input" oninput="DesignTools.updateShadow()"></div>
                    <div><label>Spread</label><input type="range" id="shSpread" min="-20" max="50" value="-5" class="glass-input" oninput="DesignTools.updateShadow()"></div>
                 </div>
                 <div class="input-row" style="margin-top:10px;">
                    <label>Color</label>
                    <div style="display:flex; align-items:center;">
                        <input type="color" id="shColor" value="#000000" oninput="DesignTools.updateShadow()">
                        <input type="range" id="shOp" min="0" max="1" step="0.01" value="0.2" class="glass-input" style="flex:1; margin-left:10px;" oninput="DesignTools.updateShadow()">
                    </div>
                 </div>

                 <div class="result-box">
                    <code id="shCode" style="font-size:0.8em; word-break:break-all;"></code>
                    <button onclick="navigator.clipboard.writeText(document.getElementById('shCode').innerText)" class="tool-action" style="margin-top:8px;">${t('Copy CSS', 'نسخ الكود')}</button>
                </div>
            </div>
        `;
        this.updateShadow();
    },

    updateShadow: function () {
        const x = document.getElementById('shX').value;
        const y = document.getElementById('shY').value;
        const b = document.getElementById('shBlur').value;
        const s = document.getElementById('shSpread').value;
        const c = document.getElementById('shColor').value;
        const o = document.getElementById('shOp').value;

        // Hex to RGBA
        const r = parseInt(c.substr(1, 2), 16);
        const g = parseInt(c.substr(3, 2), 16);
        const bl = parseInt(c.substr(5, 2), 16);
        const rgba = `rgba(${r}, ${g}, ${bl}, ${o})`;

        const css = `${x}px ${y}px ${b}px ${s}px ${rgba}`;
        document.getElementById('shadowBox').style.boxShadow = css;
        document.getElementById('shCode').innerText = `box-shadow: ${css};`;
    }
};

window.DesignTools = DesignTools;
