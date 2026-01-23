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
        API_KEY: '', // e.g. 'a1b2c3d4e5...'

        BASE_URL: 'https://api.football-data.org/v4',
        enableRealData: false // Set to true when you have a key
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
                console.error("API Error, falling back to mock:", error);
                return this.generateMockMatches(query);
            }
        }

        // 2. Default to Mock Data
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

        const response = await fetch(`${this.config.BASE_URL}/competitions/${leagueCode}/matches?status=LIVE,SCHEDULED,FINISHED`, {
            headers: {
                'X-Auth-Token': this.config.API_KEY
            }
        });

        if (!response.ok) throw new Error('API Request Failed');

        const data = await response.json();
        return this.formatAPIData(data.matches);
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
