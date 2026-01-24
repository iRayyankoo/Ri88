
"use client";
import React, { useState } from 'react';
import { LayoutDashboard, FileText, Users, Palette, Settings, LogOut, Search, Map, Bell } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', height: '100vh', background: '#13131a', color: 'white', overflow: 'hidden' }}>

            {/* Sidebar */}
            <div style={{ background: '#0f0f13', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2em', color: 'white' }}>Ri88 Admin</div>
                </div>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <NavButton icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <NavButton icon={<FileText size={18} />} label="Content & Blog" active={activeTab === 'content'} onClick={() => setActiveTab('content')} />
                    <NavButton icon={<Users size={18} />} label="Users & Inbox" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                    <NavButton icon={<Palette size={18} />} label="Appearance" active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')} />
                    <NavButton icon={<Settings size={18} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                </nav>
                <div style={{ marginTop: 'auto' }}>
                    <Link href="/">
                        <button style={{ background: '#ff4757', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', width: '100%', display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
                            <LogOut size={16} /> Logout / Exit
                        </button>
                    </Link>
                    <div style={{ textAlign: 'center', color: '#555', fontSize: '0.8em', marginTop: '15px' }}>v2.0 Next.js</div>
                </div>
            </div>

            {/* Content Area */}
            <div style={{ padding: '40px', overflowY: 'auto', background: '#13131a' }}>

                {/* HEADERS */}
                <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ margin: 0 }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ position: 'relative' }}>
                            <Bell size={20} color="#aaa" />
                            <span style={{ position: 'absolute', top: -2, right: -2, width: '8px', height: '8px', background: 'red', borderRadius: '50%' }}></span>
                        </div>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#333' }}></div>
                    </div>
                </header>

                {/* VIEW: DASHBOARD */}
                {activeTab === 'dashboard' && (
                    <div className="animate-fade-in">
                        {/* Map Mock */}
                        <div style={{ background: 'rgba(25, 25, 35, 1)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', marginBottom: '30px', height: '250px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ padding: '20px', position: 'absolute', zIndex: 2 }}>
                                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}> <Map size={18} /> Live Activity</h3>
                                <small style={{ color: '#aaa' }}>Real-time GEO-IP tracking (Simulated)</small>
                            </div>
                            <div style={{ width: '100%', height: '100%', opacity: 0.3, backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        </div>

                        {/* Stats Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                            <StatCard title="Total Visitors" value="12,450" color="linear-gradient(135deg, #6D4CFF, #8E44AD)" />
                            <StatCard title="Active Tools" value="24" color="rgba(255,255,255,0.05)" />
                            <StatCard title="Blog Posts" value="8" color="rgba(255,255,255,0.05)" />
                            <StatCard title="Server Status" value="Online" color="rgba(46, 204, 113, 0.2)" textColor="#2ecc71" />
                        </div>
                    </div>
                )}

                {/* VIEW: CONTENT */}
                {activeTab === 'content' && (
                    <div>
                        <div style={{ padding: '40px', textAlign: 'center', border: '2px dashed #333', borderRadius: '16px', color: '#666' }}>
                            <h3>Content Management System</h3>
                            <p>This module is under migration. Please use the codebase to edit content in `src/data/` for now.</p>
                        </div>
                    </div>
                )}

                {/* Fallback for others */}
                {['users', 'appearance', 'settings'].includes(activeTab) && (
                    <div style={{ padding: '40px', textAlign: 'center', border: '2px dashed #333', borderRadius: '16px', color: '#666' }}>
                        <h3>Feature Coming Soon</h3>
                        <p>We are still porting the {activeTab} module to Next.js.</p>
                    </div>
                )}

            </div>
        </div>
    );
}

function NavButton({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            style={{
                background: active ? 'var(--accent-purple, #6D4CFF)' : 'transparent',
                border: 'none',
                color: active ? 'white' : '#aaa',
                padding: '12px 15px',
                textAlign: 'left',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1em',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                transition: 'all 0.2s'
            }}
        >
            {icon}
            {label}
        </button>
    );
}

function StatCard({ title, value, color, textColor = 'white' }: any) {
    return (
        <div style={{ background: color, padding: '25px', borderRadius: '16px', color: textColor }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '0.9em', opacity: 0.8 }}>{title}</h3>
            <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{value}</div>
        </div>
    );
}
