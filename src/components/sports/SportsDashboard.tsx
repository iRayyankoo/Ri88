
"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, ExternalLink } from 'lucide-react';
import Link from 'next/link';

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

    const formatAPIData = (apiMatches: any[]): Match[] => {
        return apiMatches.slice(0, 20).map((m: any) => ({
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

    const loadData = async () => {
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
    };

    useEffect(() => {
        loadData();
    }, [query]);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
            {/* Nav */}
            <nav className="glass-panel" style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Link href="/" style={{ color: 'white', display: 'flex', alignItems: 'center' }}><ArrowLeft size={20} /></Link>
                    <h2 style={{ margin: 0, fontSize: '1.2em' }}>Sports Live</h2>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <p style={{ margin: 0, fontSize: '0.8em', opacity: 0.8, color: isApiError ? '#ef4444' : '#22c55e' }}>{statusMessage}</p>
                    <button onClick={loadData} className="btn-icon"><RefreshCw size={18} /></button>
                </div>
            </nav>

            <div className="container" style={{ maxWidth: '800px', margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* Controls */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '5px' }}>
                    {Object.keys(LEAGUES).map(q => (
                        <button
                            key={q}
                            onClick={() => setQuery(q)}
                            style={{
                                padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--glass-border)',
                                background: query === q ? 'var(--accent-pink)' : 'var(--glass-bg)',
                                color: 'white', whiteSpace: 'nowrap', cursor: 'pointer'
                            }}
                        >
                            {q}
                        </button>
                    ))}
                </div>

                {viewMode === 'native' ? (
                    <div style={{ flex: 1 }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>Loading scores...</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {matches.length > 0 ? matches.map((m, idx) => (
                                    <div key={idx} className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ textAlign: 'center', flex: 1 }}>
                                                <div style={{ fontSize: '32px', marginBottom: '5px' }}>{m.homeLogo || '⚽'}</div>
                                                <div style={{ fontWeight: 'bold' }}>{m.homeTeam}</div>
                                            </div>

                                            <div style={{ textAlign: 'center', flex: 0.8 }}>
                                                <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--accent-pink)', letterSpacing: '4px' }}>
                                                    {m.homeScore}-{m.awayScore}
                                                </div>
                                                <div style={{
                                                    fontSize: '12px', marginTop: '8px', fontWeight: 'bold',
                                                    color: (m.status === 'LIVE' || m.status === 'IN_PLAY') ? '#ef4444' : '#22c55e',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'
                                                }}>
                                                    {(m.status === 'LIVE' || m.status === 'IN_PLAY') && <span style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></span>}
                                                    {m.status} {m.minute}
                                                </div>
                                            </div>

                                            <div style={{ textAlign: 'center', flex: 1 }}>
                                                <div style={{ fontSize: '32px', marginBottom: '5px' }}>{m.awayLogo || '⚽'}</div>
                                                <div style={{ fontWeight: 'bold' }}>{m.awayTeam}</div>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
                                        No matches found for this league today.
                                    </div>
                                )}
                            </div>
                        )}

                        <div style={{ marginTop: '30px', textAlign: 'center', marginBottom: '50px' }}>
                            <button onClick={() => setViewMode('google')} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                <ExternalLink size={16} /> Switch to Google View
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                            <button onClick={() => setViewMode('native')} className="btn-secondary">
                                Back to Native View
                            </button>
                        </div>
                        <iframe
                            src={`https://www.google.com/search?q=${encodeURIComponent(query)}&igu=1&pws=0`}
                            style={{ width: '100%', flex: 1, border: 'none', borderRadius: '12px', minHeight: '500px' }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
