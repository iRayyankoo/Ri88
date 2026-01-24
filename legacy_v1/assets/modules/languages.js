/**
 * Language Tools Module
 * Translation, Correction, Editing
 */

const LangTools = {
    _t: function (en, ar) {
        return document.documentElement.lang === 'ar' ? ar : en;
    },

    // 1. Quick Translator (Google Translate Linker)
    renderTranslator: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Text to Translate', 'النص المراد ترجمته')}</label>
                    <textarea id="transInput" class="glass-input" rows="4" placeholder="${t('Type here...', 'اكتب هنا...')}"></textarea>
                </div>
                <div class="input-row">
                    <label>${t('Direction', 'الاتجاه')}</label>
                    <select id="transDir" class="glass-input">
                        <option value="en|ar">${t('English -> Arabic', 'إنجليزي -> عربي')}</option>
                        <option value="ar|en">${t('Arabic -> English', 'عربي -> إنجليزي')}</option>
                        <option value="auto|en">${t('Detect -> English', 'اكتشاف -> إنجليزي')}</option>
                        <option value="auto|ar">${t('Detect -> Arabic', 'اكتشاف -> عربي')}</option>
                    </select>
                </div>
                <button onclick="LangTools.openTranslate()" class="btn-primary full-width">${t('Open in Google Translate', 'فتح في ترجمة جوجل')}</button>
            </div>
        `;
    },

    openTranslate: function () {
        const text = encodeURIComponent(document.getElementById('transInput').value);
        const pair = document.getElementById('transDir').value.split('|');
        const url = `https://translate.google.com/?sl=${pair[0]}&tl=${pair[1]}&text=${text}&op=translate`;
        window.open(url, '_blank');
    },

    // 2. Arabic Auto-Corrector (Common Typos)
    renderCorrector: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Arabic Text', 'النص العربي')}</label>
                    <textarea id="corrInput" class="glass-input" rows="6" placeholder="${t('Paste text to fix...', 'الصق النص هنا للتصحيح...')}"></textarea>
                </div>
                <button onclick="LangTools.runCorrection()" class="btn-primary full-width">${t('Fix Common Mistakes', 'تصحيح الأخطاء الشائعة')}</button>
                
                <div id="corrRes" class="result-box hidden">
                    <label>${t('Corrected Text:', 'النص المصحح:')}</label>
                    <textarea id="corrOutput" class="glass-input" rows="6" readonly style="margin-top:8px;"></textarea>
                    <button onclick="navigator.clipboard.writeText(document.getElementById('corrOutput').value)" class="tool-action" style="margin-top:8px;">${t('Copy', 'نسخ')}</button>
                </div>
            </div>
        `;
    },

    runCorrection: function () {
        let text = document.getElementById('corrInput').value;

        // Basic Regex Rules for common Arabic typos
        // 1. Hamzas
        text = text.replace(/انشاء الله/g, 'إن شاء الله');
        text = text.replace(/اللة/g, 'الله');
        text = text.replace(/اذا/g, 'إذا');
        text = text.replace(/الى/g, 'إلى');
        text = text.replace(/الان/g, 'الآن');
        text = text.replace(/اول/g, 'أول');
        text = text.replace(/يجب ان/g, 'يجب أن');

        // 2. Taa Marbouta vs Haa
        // Hard to generalize without dictionary, but maybe fix common endings if known?
        // Skipping risky ones.

        // 3. Punctuation spacing
        text = text.replace(/ \./g, '.');
        text = text.replace(/ \,/g, '،');
        text = text.replace(/ ،/g, '، '); // ensure space after comma
        text = text.replace(/  +/g, ' '); // remove double spaces

        document.getElementById('corrOutput').value = text;
        document.getElementById('corrRes').classList.remove('hidden');
    },

    // 2.5 English Corrector
    renderEnCorrector: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('English Text', 'النص الإنجليزي')}</label>
                    <textarea id="enCorrInput" class="glass-input" rows="6" placeholder="${t('Paste text to fix...', 'الصق النص هنا...')}"></textarea>
                </div>
                <button onclick="LangTools.runEnCorrection()" class="btn-primary full-width">${t('Fix Mistakes', 'تصحيح الأخطاء')}</button>
                
                <div id="enCorrRes" class="result-box hidden">
                    <textarea id="enCorrOutput" class="glass-input" rows="6" readonly></textarea>
                     <button onclick="navigator.clipboard.writeText(document.getElementById('enCorrOutput').value)" class="tool-action" style="margin-top:8px;">${t('Copy', 'نسخ')}</button>
                </div>
            </div>
        `;
    },

    runEnCorrection: function () {
        let text = document.getElementById('enCorrInput').value;

        // Capitalize sentences
        text = text.replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());

        // Fix 'i' to 'I'
        text = text.replace(/\b i \b/g, ' I ');
        text = text.replace(/^i /g, 'I ');

        // Common Contractions usually missed
        text = text.replace(/\bdont\b/gi, "don't");
        text = text.replace(/\bcant\b/gi, "can't");
        text = text.replace(/\bim\b/gi, "I'm");
        text = text.replace(/\bive\b/gi, "I've");
        text = text.replace(/\btheyre\b/gi, "they're");

        // Spacing
        text = text.replace(/ ,/g, ',');
        text = text.replace(/ \./g, '.');
        text = text.replace(/  +/g, ' ');

        document.getElementById('enCorrOutput').value = text;
        document.getElementById('enCorrRes').classList.remove('hidden');
    },

    // 3. Smart Writer (Editor)
    renderEditor: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div style="background:var(--bg-deep); border:1px solid var(--glass-border); border-radius:12px; padding:10px;">
                    <div style="margin-bottom:10px; display:flex; gap:5px;">
                        <button onclick="document.execCommand('bold',false,null)" class="tool-action" title="Bold"><b>B</b></button>
                        <button onclick="document.execCommand('italic',false,null)" class="tool-action" title="Italic"><i>I</i></button>
                        <button onclick="document.execCommand('underline',false,null)" class="tool-action" title="Underline"><u>U</u></button>
                        <button onclick="document.getElementById('editArea').innerHTML=''" class="tool-action" title="Clear" style="margin-left:auto; color:var(--accent-pink);">✕</button>
                    </div>
                    <div id="editArea" contenteditable="true" class="glass-input" style="min-height:150px; overflow-y:auto; color:white;" oninput="LangTools.updateStats()"></div>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:12px; color:var(--text-secondary); padding:0 10px;">
                    <span id="wordCount">0 Words</span>
                    <span id="charCount">0 Chars</span>
                </div>
            </div>
        `;
    },

    updateStats: function () {
        const text = document.getElementById('editArea').innerText || '';
        document.getElementById('charCount').innerText = text.length + (document.documentElement.lang === 'ar' ? ' حرف' : ' Chars');
        document.getElementById('wordCount').innerText = (text.trim() === '' ? 0 : text.trim().split(/\s+/).length) + (document.documentElement.lang === 'ar' ? ' كلمة' : ' Words');
    }
};

window.LangTools = LangTools;
