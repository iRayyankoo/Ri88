/**
 * Text Tools Module
 * Logic for Arabic correction and text cleaning
 */

const TextTools = {
    // 1. Arabic for Adobe
    // ----------------------------------------------------------------
    renderAdobe: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>Arabic Text (Problematic)</label>
                    <textarea id="adbInput" class="glass-input" rows="4" placeholder="Type Arabic text here..."></textarea>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                     <label style="font-size:12px; color:#aaa; display:flex; align-items:center;">
                        <input type="checkbox" id="adbReverse" checked> Reverse Characters
                     </label>
                </div>
                <button onclick="TextTools.processAdobe()" class="btn-primary full-width">Fix Text</button>
                
                <div id="adbResult" class="result-box hidden">
                    <label>Result (Copy/Paste to Adobe):</label>
                    <textarea id="adbOutput" class="glass-input" rows="4" readonly style="margin-top:8px;"></textarea>
                    <button onclick="navigator.clipboard.writeText(document.getElementById('adbOutput').value)" class="tool-action" style="margin-top:8px;">Copy</button>
                </div>
            </div>
        `;
    },

    processAdobe: function () {
        // Simple corrective logic for legacy Adobe apps
        // 1. Reverse words? No, usually character-level reshaping + visual reversal.
        // Doing full reshaping in vanilla JS is heavy. 
        // We will do a basic 'reverse string' approximation which often helps disjoint letters.
        // For distinct joined letters usage, a library like 'persian.js' or complex mapping is needed.
        // Assuming user just wants basic RTL reversal for now if simple.

        const text = document.getElementById('adbInput').value;
        if (!text) return;

        // Naive Reversal (characters)
        // Note: Real Adobe fix requires shaping. For this 'MVP', we reverse visual order.
        const reversed = text.split('').reverse().join('');

        document.getElementById('adbOutput').value = reversed;
        document.getElementById('adbResult').classList.remove('hidden');
    },

    // 2. Text Cleaner
    // ----------------------------------------------------------------
    renderCleaner: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>Messy Text</label>
                    <textarea id="clInput" class="glass-input" rows="6" placeholder="Paste text here..."></textarea>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:16px;">
                    <label class="check-label"><input type="checkbox" id="clSpaces" checked> Remove Extra Spaces</label>
                    <label class="check-label"><input type="checkbox" id="clLines" checked> Remove Empty Lines</label>
                    <label class="check-label"><input type="checkbox" id="clEmoji"> Remove Emojis</label>
                    <label class="check-label"><input type="checkbox" id="clHtml"> Strip HTML Tags</label>
                </div>
                <button onclick="TextTools.cleanText()" class="btn-primary full-width">Clean Text</button>
                
                <div id="clResult" class="result-box hidden">
                    <textarea id="clOutput" class="glass-input" rows="6" readonly></textarea>
                    <button onclick="navigator.clipboard.writeText(document.getElementById('clOutput').value)" class="tool-action" style="margin-top:8px;">Copy</button>
                </div>
            </div>
        `;
    },

    cleanText: function () {
        let text = document.getElementById('clInput').value;

        if (document.getElementById('clSpaces').checked) {
            text = text.replace(/[ \t]+/g, ' ').trim();
        }
        if (document.getElementById('clLines').checked) {
            text = text.replace(/^\s*[\r\n]/gm, '');
        }
        if (document.getElementById('clEmoji').checked) {
            // Regex for common emojis
            text = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
        }
        if (document.getElementById('clHtml').checked) {
            const div = document.createElement('div');
            div.innerHTML = text;
            text = div.textContent || div.innerText || '';
        }

        document.getElementById('clOutput').value = text;
        document.getElementById('clResult').classList.remove('hidden');
    }
    ,

    // 3. Case Converter
    // ----------------------------------------------------------------
    renderCase: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <textarea id="caseInput" class="glass-input" rows="5" placeholder="Type text to convert..."></textarea>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:12px;">
                    <button onclick="TextTools.convertCase('upper')" class="btn-primary">UPPERCASE</button>
                    <button onclick="TextTools.convertCase('lower')" class="btn-primary">lowercase</button>
                    <button onclick="TextTools.convertCase('title')" class="btn-primary">Title Case</button>
                    <button onclick="TextTools.convertCase('sentence')" class="btn-primary">Sentence case</button>
                </div>
            </div>
        `;
    },

    convertCase: function (mode) {
        const field = document.getElementById('caseInput');
        let text = field.value;
        if (!text) return;

        if (mode === 'upper') {
            text = text.toUpperCase();
        } else if (mode === 'lower') {
            text = text.toLowerCase();
        } else if (mode === 'title') {
            text = text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        } else if (mode === 'sentence') {
            text = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
        }

        field.value = text;
    },

    // 4. Hashtag Generator
    // ----------------------------------------------------------------
    renderHashtag: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>Content Text</label>
                    <textarea id="hashInput" class="glass-input" rows="4" placeholder="Keywords or sentence..."></textarea>
                </div>
                <button onclick="TextTools.genHashtags()" class="btn-primary full-width">Generate Tags</button>
                
                <div id="hashResult" class="result-box hidden">
                    <div id="hashOutput" style="color:var(--accent-pink); font-family:monospace; line-height:1.6;"></div>
                    <button onclick="navigator.clipboard.writeText(document.getElementById('hashOutput').innerText)" class="tool-action" style="margin-top:12px;">Copy Tags</button>
                </div>
            </div>
        `;
    },

    genHashtags: function () {
        const text = document.getElementById('hashInput').value;
        if (!text) return;

        // Simple logic: split words, remove special chars, add #
        // Filter small words? Keep it simple.
        const tags = text.replace(/[^\w\s\u0600-\u06FF]/g, '')
            .split(/\s+/)
            .filter(w => w.length > 2)
            .map(w => '#' + w)
            .join(' ');

        document.getElementById('hashOutput').innerText = tags;
        document.getElementById('hashResult').classList.remove('hidden');
    },

    // 5. UTM Builder
    // ----------------------------------------------------------------
    renderUTM: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row"><input type="text" id="utmUrl" placeholder="Website URL (e.g. google.com)" class="glass-input"></div>
                <div class="input-row"><input type="text" id="utmSource" placeholder="Campaign Source (e.g. twitter)" class="glass-input"></div>
                <div class="input-row"><input type="text" id="utmMedium" placeholder="Campaign Medium (e.g. social)" class="glass-input"></div>
                <div class="input-row"><input type="text" id="utmName" placeholder="Campaign Name (e.g. winter_sale)" class="glass-input"></div>
                
                <button onclick="TextTools.buildUTM()" class="btn-primary full-width">Build URL</button>
                
                <div id="utmResult" class="result-box hidden">
                    <textarea id="utmOutput" class="glass-input" rows="3" readonly></textarea>
                </div>
            </div>
        `;
    },

    buildUTM: function () {
        let url = document.getElementById('utmUrl').value.trim();
        const source = document.getElementById('utmSource').value.trim();
        const medium = document.getElementById('utmMedium').value.trim();
        const campaign = document.getElementById('utmName').value.trim();

        if (!url) return;
        if (!url.startsWith('http')) url = 'https://' + url;

        const params = new URLSearchParams();
        if (source) params.append('utm_source', source);
        if (medium) params.append('utm_medium', medium);
        if (campaign) params.append('utm_campaign', campaign);

        const finalUrl = url + (params.toString() ? '?' + params.toString() : '');

        document.getElementById('utmOutput').value = finalUrl;
        document.getElementById('utmResult').classList.remove('hidden');
    },

    // 6. Link Extractor
    renderLinks: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <textarea id="linkTxt" class="glass-input" style="height:100px;" placeholder="Paste text containing URLs..."></textarea>
                <button onclick="TextTools.getLinks()" class="btn-primary full-width" style="margin-top:10px;">Extract Links</button>
                <textarea id="linkOut" class="glass-input hidden" style="height:100px; margin-top:10px;" readonly></textarea>
            </div>
         `;
    },
    getLinks: function () {
        const txt = document.getElementById('linkTxt').value;
        const regex = /https?:\/\/[^\s]+/g;
        const matches = txt.match(regex);
        const out = document.getElementById('linkOut');

        if (matches) {
            out.value = [...new Set(matches)].join('\n');
            out.classList.remove('hidden');
        } else {
            alert('No links found');
        }
    },

    // 7. Arabic Punctuation
    renderPunc: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <textarea id="puncIn" class="glass-input" style="height:100px;" placeholder="نص عربي..."></textarea>
                <button onclick="TextTools.fixPunc()" class="btn-primary full-width" style="margin-top:10px;">Fix Punctuation</button>
                <textarea id="puncOut" class="glass-input hidden" style="height:100px; margin-top:10px;" readonly></textarea>
            </div>
         `;
    },
    fixPunc: function () {
        let txt = document.getElementById('puncIn').value;
        // Basic mapping
        txt = txt.replace(/,/g, '،');
        txt = txt.replace(/\?/g, '؟');
        txt = txt.replace(/;/g, '؛');
        txt = txt.replace(/1/g, '١').replace(/2/g, '٢').replace(/3/g, '٣').replace(/4/g, '٤').replace(/5/g, '٥')
            .replace(/6/g, '٦').replace(/7/g, '٧').replace(/8/g, '٨').replace(/9/g, '٩').replace(/0/g, '٠');

        document.getElementById('puncOut').value = txt;
        document.getElementById('puncOut').classList.remove('hidden');
    },

    // 8. Diacritics Remover
    renderTashkeel: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <textarea id="diaIn" class="glass-input" style="height:100px;" placeholder="نص مُشَكَّل..."></textarea>
                <button onclick="TextTools.remDia()" class="btn-primary full-width" style="margin-top:10px;">Remove Tashkeel</button>
                <textarea id="diaOut" class="glass-input hidden" style="height:100px; margin-top:10px;" readonly></textarea>
            </div>
         `;
    },
    remDia: function () {
        let txt = document.getElementById('diaIn').value;
        txt = txt.replace(/[\u064B-\u065F\u0670]/g, ''); // Common Tashkeel range
        document.getElementById('diaOut').value = txt;
        document.getElementById('diaOut').classList.remove('hidden');
    }
};

window.TextTools = TextTools;
