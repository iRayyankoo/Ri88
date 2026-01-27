
"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import '@/styles/sports.css';

interface Match {
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    homeLogo: string;
    awayLogo: string;
    status: string;
    minute: string;
}

interface ApiMatch {
    homeTeam: { name: string; shortName?: string };
    awayTeam: { name: string; shortName?: string };
    score: { fullTime: { home?: number; away?: number }; halfTime: { home?: number; away?: number } };
    status: string;
    minute?: number;
}

// Config
const CONFIG = {
    API_KEY: '8f873e7ce89b42c297c5c0bf3b857c69',
    BASE_URL: 'https://api.football-data.org/v4',
    enableRealData: true
};

const LEAGUES: { [key: string]: string } = {
    'Premier League': 'PL',
    'La Liga': 'PD',
    'Serie A': 'SA',
    'Bundesliga': 'BL1',
    'Ligue 1': 'FL1',
    'Champions League': 'CL',
    'Saudi Pro League': 'SAUDI'
};

// Mock Data Generator
const generateMockMatches = (query: string): Match[] => {
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
    if (query.includes('Saudi')) startTeams = teams.slice(0, 4);
    else if (query.includes('Premier')) startTeams = teams.slice(4);

    const matches: Match[] = [];
    for (let i = 0; i < 5; i++) {
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
            status: Math.random() > 0.5 ? 'LIVE' : 'FT',
            minute: Math.floor(Math.random() * 90) + "'"
        });
    }
    return matches;
};

export default function SportsDashboard() {
    const [viewMode, setViewMode] = useState<'native' | 'google'>('native');
    const [query, setQuery] = useState('Premier League');
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string>('');
    const [isApiError, setIsApiError] = useState(false);

    const loadData = React.useCallback(async () => {
        const formatAPIData = (apiMatches: ApiMatch[]): Match[] => {
            return apiMatches.slice(0, 20).map((m) => ({
                homeTeam: m.homeTeam.shortName || m.homeTeam.name,
                awayTeam: m.awayTeam.shortName || m.awayTeam.name,
                homeScore: m.score.fullTime.home ?? m.score.halfTime.home ?? 0,
                awayScore: m.score.fullTime.away ?? m.score.halfTime.away ?? 0,
                homeLogo: '', // API free tier limitation
                awayLogo: '',
                status: m.status === 'IN_PLAY' ? 'LIVE' : m.status,
                minute: m.minute ? m.minute + "'" : ''
            }));
        };

        setLoading(true);
        setStatusMessage('');
        setIsApiError(false);
        setMatches([]);

        let leagueCode = 'PL';
        for (const [name, code] of Object.entries(LEAGUES)) {
            if (query.includes(name)) leagueCode = code;
        }

        const useRealApi = CONFIG.enableRealData && CONFIG.API_KEY;

        if (useRealApi) {
            try {
                // Use our new local proxy
                const targetUrl = `${CONFIG.BASE_URL}/competitions/${leagueCode}/matches?status=LIVE,SCHEDULED,FINISHED,IN_PLAY,PAUSED`;
                const proxyUrl = `/api/proxy?url=${encodeURIComponent(targetUrl)}&token=${CONFIG.API_KEY}`;

                const response = await fetch(proxyUrl);
                if (!response.ok) throw new Error('API Connection Failed');

                const data = await response.json();
                if (data.matches) {
                    setMatches(formatAPIData(data.matches));
                    setStatusMessage('● Live Data Active (API)');
                } else {
                    throw new Error('No matches found');
                }
            } catch (error) {
                console.error("API Error:", error);
                setIsApiError(true);
                setStatusMessage('● API Error - Showing Demo Data');
                setMatches(generateMockMatches(query));
            }
        } else {
            // Mock Data
            await new Promise(r => setTimeout(r, 800));
            setMatches(generateMockMatches(query));
            setStatusMessage('● Demo Mode (Mock Data)');
        }
        setLoading(false);
    }, [query]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <div className="sports-dashboard">
            {/* Nav */}
            <nav className="glass-panel sports-nav">
                <div className="sports-nav-left">
                    <Link href="/" className="flex items-center text-white"><ArrowLeft size={20} /></Link>
                    <h2 className="sports-nav-title">Sports Live</h2>
                </div>
                <div className="flex items-center gap-[10px]">
                    <p className={`sports-status-message ${isApiError ? 'error' : 'success'}`}>{statusMessage}</p>
                    <button onClick={loadData} className="btn-icon" title="Refresh Scores" aria-label="Refresh Scores"><RefreshCw size={18} /></button>
                </div>
            </nav>

            <div className="sports-content container">

                {/* Controls */}
                <div className="sports-leagues-scroll">
                    {Object.keys(LEAGUES).map(q => (
                        <button
                            key={q}
                            onClick={() => setQuery(q)}
                            className={`league-btn ${query === q ? 'active' : ''}`}
                        >
                            {q}
                        </button>
                    ))}
                </div>

                {viewMode === 'native' ? (
                    <div className="flex-1">
                        {loading ? (
                            <div className="empty-state">Loading scores...</div>
                        ) : (
                            <div className="match-list">
                                {matches.length > 0 ? matches.map((m, idx) => (
                                    <div key={idx} className="glass-panel match-card">
                                        <div className="match-row">
                                            <div className="team-slot">
                                                <div className="team-logo">{m.homeLogo || '⚽'}</div>
                                                <div className="team-name">{m.homeTeam}</div>
                                            </div>

                                            <div className="score-slot">
                                                <div className="score-display">
                                                    {m.homeScore}-{m.awayScore}
                                                </div>
                                                <div className={`match-status ${(m.status === 'LIVE' || m.status === 'IN_PLAY') ? 'live-text' : 'finished-text'}`}>
                                                    {(m.status === 'LIVE' || m.status === 'IN_PLAY') && <span className="status-dot"></span>}
                                                    {m.status} {m.minute}
                                                </div>
                                            </div>

                                            <div className="team-slot">
                                                <div className="team-logo">{m.awayLogo || '⚽'}</div>
                                                <div className="team-name">{m.awayTeam}</div>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="empty-state">
                                        No matches found for this league today.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-[30px] mb-[50px] text-center">
                            <button onClick={() => setViewMode('google')} className="btn-secondary inline-flex items-center gap-[8px]" title="Switch to Google View" aria-label="Switch to Google View">
                                <ExternalLink size={16} /> Switch to Google View
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="google-view-container">
                        <div className="mb-[10px] text-center">
                            <button onClick={() => setViewMode('native')} className="btn-secondary" title="Back to Native View" aria-label="Back to Native View">
                                Back to Native View
                            </button>
                        </div>
                        <iframe
                            title="Google Sports Search"
                            src={`https://www.google.com/search?q=${encodeURIComponent(query)}&igu=1&pws=0`}
                            className="google-iframe"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
