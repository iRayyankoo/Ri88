/**
 * Sports Tools Module
 * Global Sports Hub via Google Deep Links
 */

const SportsTools = {
    _t: function (en, ar) {
        return document.documentElement.lang === 'ar' ? ar : en;
    },

    // 1. Comprehensive Football Hub
    renderFootball: function (container) {
        this.renderGenericHub(container, [
            { icon: '🇸🇦', name: 'Saudi Pro League', nameAr: 'دوري روشن', query: 'Saudi Pro League matches' },
            { icon: '🇬🇧', name: 'Premier League', nameAr: 'الدوري الإنجليزي', query: 'Premier League matches' },
            { icon: '🇪🇸', name: 'La Liga', nameAr: 'الدوري الإسباني', query: 'La Liga matches' },
            { icon: '🇮🇹', name: 'Serie A', nameAr: 'الدوري الإيطالي', query: 'Serie A matches' },
            { icon: '🇩🇪', name: 'Bundesliga', nameAr: 'الدوري الألماني', query: 'Bundesliga matches' },
            { icon: '🇫🇷', name: 'Ligue 1', nameAr: 'الدوري الفرنسي', query: 'Ligue 1 matches' },
            { icon: '🇪🇺', name: 'Champions League', nameAr: 'أبطال أوروبا', query: 'Champions League matches' },
            { icon: '🌍', name: 'World Cup / Intl', nameAr: 'المباريات الدولية', query: 'International football matches' }
        ], 'Football matches today');
    },

    // 2. American Sports & Basketball
    renderBasketball: function (container) {
        this.renderGenericHub(container, [
            { icon: '🇺🇸', name: 'NBA', nameAr: 'NBA', query: 'NBA schedule' },
            { icon: '🇸🇦', name: 'KSA League', nameAr: 'الدوري السعودي', query: 'Saudi Basketball League' },
            { icon: '🇪🇺', name: 'EuroLeague', nameAr: 'اليورو ليغ', query: 'EuroLeague basketball' },
            { icon: '🏀', name: 'FIBA', nameAr: 'FIBA', query: 'FIBA matches' }
        ], 'Basketball matches today');
    },

    // 3. Motorsports (F1, Moto)
    renderMotorsport: function (container) {
        this.renderGenericHub(container, [
            { icon: '🏎️', name: 'Formula 1', nameAr: 'فورمولا 1', query: 'Formula 1 schedule' },
            { icon: '🏍️', name: 'MotoGP', nameAr: 'موتو جي بي', query: 'MotoGP schedule' },
            { icon: '🚗', name: 'NASCAR', nameAr: 'ناسكار', query: 'NASCAR schedule' },
            { icon: '🌵', name: 'Dakar Rally', nameAr: 'رالي داكار', query: 'Dakar Rally results' }
        ], 'Motorsports race dates');
    },

    // 4. Combat Sports (MMA, Boxing)
    renderCombat: function (container) {
        this.renderGenericHub(container, [
            { icon: '🥊', name: 'UFC', nameAr: 'UFC', query: 'UFC events' },
            { icon: '🥊', name: 'Boxing', nameAr: 'ملاكمة', query: 'Boxing schedule' },
            { icon: '🤼', name: 'WWE', nameAr: 'WWE', query: 'WWE events' },
            { icon: '🥋', name: 'Judo/Karate', nameAr: 'جودو/كاراتيه', query: 'Judo world tour' }
        ], 'Combat sports events');
    },

    // 5. World Sports (Tennis, Cricket, etc)
    renderWorld: function (container) {
        this.renderGenericHub(container, [
            { icon: '🎾', name: 'Tennis (ATP/WTA)', nameAr: 'تنس (ATP/WTA)', query: 'Tennis matches today' },
            { icon: '🏏', name: 'Cricket', nameAr: 'كريكت', query: 'Cricket matches' },
            { icon: '🏐', name: 'Volleyball', nameAr: 'كرة طائرة', query: 'Volleyball matches' },
            { icon: '🤾', name: 'Handball', nameAr: 'كرة يد', query: 'Handball matches' },
            { icon: '⛳', name: 'Golf', nameAr: 'غولف', query: 'Golf tournaments' },
            { icon: '🎮', name: 'eSports', nameAr: 'رياضة إلكترونية', query: 'eSports schedule' }
        ], 'Sports matches today');
    },

    // Generic Renderer to keep code clean
    renderGenericHub: function (container, items, mainBtnQuery) {
        const t = this._t;

        // Ensure dash and frame container exist in the modal body if not already
        // But since we are rendering into 'container' (modalBody), we structure it here.

        let gridHtml = items.map(item => `
            <button onclick="SportsTools.viewInApp('${item.query}')" class="glass-panel" style="padding:15px; text-align:center; cursor:pointer;">
                <div style="font-size:24px; margin-bottom:5px;">${item.icon}</div>
                <div style="font-size:13px; font-weight:bold;">${t(item.name, item.nameAr)}</div>
            </button>
        `).join('');

        container.innerHTML = `
            <div id="sports-dash" style="transition:all 0.3s ease;">
                <div class="tool-ui-group">
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:15px;">
                        ${gridHtml}
                    </div>
                    ${mainBtnQuery ? `<button onclick="SportsTools.viewInApp('${mainBtnQuery}')" class="btn-primary full-width">${t('View All / Search', 'عرض الكل / بحث')}</button>` : ''}
                </div>
            </div>
            
            <div id="sports-frame-container" class="hidden" style="display:flex; flex-direction:column; height:600px; animation:fadeIn 0.3s ease;">
                <button onclick="SportsTools.closeFrame()" class="btn-secondary full-width" style="margin-bottom:10px; border-radius:12px;">${t('Back to Sports', 'العودة للقائمة')}</button>
                <iframe id="sports-frame" style="width:100%; flex:1; border:none; border-radius:12px; background:white;" src=""></iframe>
            </div>
        `;
    },

    viewInApp: function (query) {
        const dashboard = document.getElementById('sports-dash');
        const frameContainer = document.getElementById('sports-frame-container');
        const frame = document.getElementById('sports-frame');

        if (!dashboard || !frameContainer) return; // Safety

        // Hide dashboard, show frame
        dashboard.classList.add('hidden');
        frameContainer.classList.remove('hidden');

        // Use Google with igu=1 (Interface Google Unblocked) to allow embedding
        // pws=0 to avoid personal results
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&igu=1&pws=0`;
        frame.src = url;
    },

    closeFrame: function () {
        const dashboard = document.getElementById('sports-dash');
        const frameContainer = document.getElementById('sports-frame-container');
        const frame = document.getElementById('sports-frame');

        if (!dashboard || !frameContainer) return;

        frame.src = ''; // Stop loading
        frameContainer.classList.add('hidden');
        dashboard.classList.remove('hidden');
    },

    openGoogle: function (query) {
        this.viewInApp(query);
    }
};

window.SportsTools = SportsTools;
