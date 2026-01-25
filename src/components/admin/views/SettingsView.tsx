import React, { useState } from 'react';
import { Palette, Moon, Sun, Monitor, Layout, Save, CheckCircle } from 'lucide-react';

export function AppearanceView() {
    const [theme, setTheme] = useState('dark');
    const [accent, setAccent] = useState('purple');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
            <h3 style={{ color: 'white', marginBottom: '24px' }}>Theme & Customization</h3>

            {/* Theme Mode */}
            <div className="panel" style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
                <h4 style={{ color: '#ddd', marginBottom: '16px', fontSize: '1em' }}>Interface Theme</h4>
                <div style={{ display: 'flex', gap: '16px' }}>
                    {['dark', 'light', 'system'].map(mode => (
                        <button
                            key={mode}
                            onClick={() => setTheme(mode)}
                            style={{
                                flex: 1, padding: '20px', borderRadius: '12px', border: theme === mode ? '2px solid var(--accent-pink)' : '1px solid rgba(255,255,255,0.1)',
                                background: theme === mode ? 'rgba(211, 91, 255, 0.1)' : 'transparent', color: 'white', cursor: 'pointer', textAlign: 'center'
                            }}
                        >
                            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                                {mode === 'dark' ? <Moon /> : mode === 'light' ? <Sun /> : <Monitor />}
                            </div>
                            <div style={{ textTransform: 'capitalize' }}>{mode} Mode</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Accent Color */}
            <div className="panel" style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
                <h4 style={{ color: '#ddd', marginBottom: '16px', fontSize: '1em' }}>Accent Color</h4>
                <div style={{ display: 'flex', gap: '16px' }}>
                    {[
                        { id: 'purple', hex: '#6D4CFF', name: 'Royal Purple' },
                        { id: 'cyan', hex: '#00FFF2', name: 'Cyber Cyan' },
                        { id: 'orange', hex: '#FFB86B', name: 'Sunset Orange' },
                        { id: 'pink', hex: '#D35BFF', name: 'Neon Pink' }
                    ].map(col => (
                        <div
                            key={col.id}
                            onClick={() => setAccent(col.id)}
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', borderRadius: '50px', border: accent === col.id ? `1px solid ${col.hex}` : '1px solid transparent', background: accent === col.id ? 'rgba(255,255,255,0.05)' : 'transparent' }}
                        >
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: col.hex }}></div>
                            <span style={{ color: 'white', fontSize: '0.9em' }}>{col.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ textAlign: 'right' }}>
                <button className="btn-primary" onClick={handleSave} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                    {saved ? <CheckCircle size={18} /> : <Save size={18} />}
                    {saved ? 'Changes Saved' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}

export function SettingsView() {
    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
            <h3 style={{ color: 'white', marginBottom: '24px' }}>Site Configuration</h3>

            <div className="panel" style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', color: '#aaa', marginBottom: '8px', fontSize: '0.9em' }}>Site Title</label>
                    <input type="text" defaultValue="Ri88 - Smart Tools Portal" className="glass-input" />
                </div>
                <div>
                    <label style={{ display: 'block', color: '#aaa', marginBottom: '8px', fontSize: '0.9em' }}>SEO Description</label>
                    <textarea defaultValue="The most advanced collection of web tools for developers, designers, and productive people." className="glass-input" rows={3} />
                </div>
            </div>

            <div className="panel" style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
                <h4 style={{ color: '#ddd', marginBottom: '16px', fontSize: '1em' }}>API Integrations</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '10px' }}>
                    <div>
                        <div style={{ color: 'white', fontWeight: 500 }}>OpenAI API</div>
                        <div style={{ fontSize: '0.8em', color: '#666' }}>Used for AI Text Correction</div>
                    </div>
                    <div style={{ color: '#00E096', fontSize: '0.85em' }}>● Connected</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                    <div>
                        <div style={{ color: 'white', fontWeight: 500 }}>Vercel Analytics</div>
                        <div style={{ fontSize: '0.8em', color: '#666' }}>Traffic Tracking</div>
                    </div>
                    <div style={{ color: '#00E096', fontSize: '0.85em' }}>● Connected</div>
                </div>
            </div>
        </div>
    );
}
