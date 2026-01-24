/**
 * SportsService - Handles Data Fetching for Sports
 * 
 * HOSTING INSTRUCTIONS:
 * 1. Get a free API Key from: https://www.football-data.org/client/register
 * 2. Paste your API Key below in 'API_KEY'.
 * 3. The app will automatically switch from Mock Data to Real Data.
 */

const SportsService = {
    config: {
        // PASTE YOUR API KEY HERE
        API_KEY: '8f873e7ce89b42c297c5c0bf3b857c69',

        BASE_URL: 'https://api.football-data.org/v4',
        enableRealData: true // Set to true when you have a key
    },

    // Map query names to API League Codes
    leagues: {
        'Premier League': 'PL',
        'La Liga': 'PD',
        'Serie A': 'SA',
        'Bundesliga': 'BL1',
        'Ligue 1': 'FL1',
        'Champions League': 'CL',
        'Saudi Pro League': 'SAUDI' // Note: Free tier might not have Saudi, requires paid plan
    },

    /**
     * Main Function to get matches
     * @param {string} query - The search query (e.g., 'Premier League')
     */
    async getMatches(query) {
        // 1. Check if we should use Real API
        if (this.config.API_KEY && this.config.enableRealData) {
            try {
                return await this.fetchFromAPI(query);
            } catch (error) {
                console.error("API Error:", error);
                // Return a special error object to display in UI instead of fake data
                // This stops the app from showing "fake" matches when the API fails
                return [{ error: true, message: error.message || "Unknown API Error" }];
            }
        }

        // 2. Default to Mock Data (Only used if Real Data is DISABLED in config)
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(this.generateMockMatches(query));
            }, 800); // Simulate network delay
        });
    },

    /**
     * Fetch Real Data from Football-Data.org
     */
    async fetchFromAPI(query) {
        // Find league code
        let leagueCode = 'PL'; // Default
        for (const [name, code] of Object.entries(this.leagues)) {
            if (query.includes(name)) leagueCode = code;
        }

        // Use local v2.01 proxy to bypass CORS
        const TARGET_URL = `${this.config.BASE_URL}/competitions/${leagueCode}/matches?status=LIVE,SCHEDULED,FINISHED`;
        const PROXY_ENDPOINT = `/api/proxy?url=${encodeURIComponent(TARGET_URL)}&token=${this.config.API_KEY}`;

        try {
            const response = await fetch(PROXY_ENDPOINT);

            if (!response.ok) throw new Error(`API Connection Failed (${response.status})`);

            const data = await response.json();

            // Update UI to show we are using Real Data
            const statusEl = document.querySelector('header p');
            if (statusEl) statusEl.innerHTML = '<span style="color:#22c55e;">● Live Data Active (API)</span>';

            return this.formatAPIData(data.matches);
        } catch (error) {
            // Update UI to show Error
            const statusEl = document.querySelector('header p');
            if (statusEl) statusEl.innerHTML = `<span style="color:#ef4444;">● Data Error (See below)</span>`;
            throw error; // Trigger fallback
        }
    },

    /**
     * Convert API Data to our internal Format
     */
    formatAPIData(matches) {
        // Sort: Live first, then by date
        return matches.slice(0, 10).map(m => ({
            homeTeam: m.homeTeam.shortName || m.homeTeam.name,
            awayTeam: m.awayTeam.shortName || m.awayTeam.name,
            homeScore: m.score.fullTime.home ?? m.score.halfTime.home ?? 0,
            awayScore: m.score.fullTime.away ?? m.score.halfTime.away ?? 0,
            homeLogo: '', // API doesn't always send logos in free tier, might need handling
            awayLogo: '',
            status: m.status === 'IN_PLAY' ? 'LIVE' : m.status,
            minute: m.minute ? m.minute + "'" : ''
        }));
    },

    /**
     * Fallback / Demo Data Generator
     */
    generateMockMatches(query) {
        const teams = [
            { name: 'Al Hilal', logo: '💙', score: 3 },
            { name: 'Al Nassr', logo: '💛', score: 2 },
            { name: 'Ittihad', logo: '🐅', score: 1 },
            { name: 'Ahli', logo: '💚', score: 1 },
            { name: 'Liverpool', logo: '🔴', score: 2 },
            { name: 'Man City', logo: '🔵', score: 2 },
            { name: 'Real Madrid', logo: '👑', score: 4 },
            { name: 'Barca', logo: '🔵🔴', score: 0 },
            { name: 'Arsenal', logo: '🔴', score: 1 },
            { name: 'Chelsea', logo: '🔵', score: 1 }
        ];

        let startTeams = teams;
        if (query.includes('Saudi')) {
            startTeams = teams.slice(0, 4);
        } else if (query.includes('Premier')) {
            startTeams = teams.slice(4);
        }

        const matches = [];
        for (let i = 0; i < 4; i++) {
            const t1 = startTeams[Math.floor(Math.random() * startTeams.length)];
            let t2 = startTeams[Math.floor(Math.random() * startTeams.length)];
            while (t1 === t2) t2 = startTeams[Math.floor(Math.random() * startTeams.length)];

            matches.push({
                homeTeam: t1.name,
                awayTeam: t2.name,
                homeScore: t1.score,
                awayScore: t2.score,
                homeLogo: t1.logo,
                awayLogo: t2.logo,
                status: 'LIVE',
                minute: Math.floor(Math.random() * 90) + "'"
            });
        }
        return matches;
    }
};

// Expose to window
window.SportsService = SportsService;
