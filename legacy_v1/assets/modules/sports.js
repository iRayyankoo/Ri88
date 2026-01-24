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

        let gridHtml = items.map(item => `
            <button onclick="SportsTools.viewInApp('${item.query}')" class="glass-panel" style="padding:15px; text-align:center; cursor:pointer;">
                <div style="font-size:24px; margin-bottom:5px;">${item.icon}</div>
                <div style="font-size:13px; font-weight:bold;">${t(item.name, item.nameAr)}</div>
            </button>
        `).join('');

        container.innerHTML = `
            <div style="transition:all 0.3s ease;">
                <div class="tool-ui-group">
                    <p style="color:var(--text-secondary); text-align:center; margin-bottom:15px; font-size:13px;">
                        ${t('Opens in a full-page view', 'سيفتح في صفحة كاملة')}
                    </p>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:15px;">
                        ${gridHtml}
                    </div>
                    ${mainBtnQuery ? `<button onclick="SportsTools.viewInApp('${mainBtnQuery}')" class="btn-primary full-width">${t('View All / Search', 'عرض الكل / بحث')}</button>` : ''}
                </div>
            </div>
        `;
    },

    viewInApp: function (query) {
        // Redirect to sports.html with query
        window.location.href = `sports.html?q=${encodeURIComponent(query)}`;
    },

    closeFrame: function () {
        // No longer needed
    },

    openGoogle: function (query) {
        this.viewInApp(query);
    }
};

window.SportsTools = SportsTools;
