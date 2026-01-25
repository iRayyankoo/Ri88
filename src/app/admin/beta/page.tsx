"use client";
import React from 'react';
import { LayoutGrid, Folder, CheckSquare, Calendar as CalIcon, Settings, LogOut, Bell, Search, Plus, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';

// Types
interface Task {
    id: number;
    title: string;
    completed: boolean;
    date: string;
}

interface Project {
    name: string;
    progress: number;
    color: string;
}

export default function BetaDashboard() {
    return (
        <div style={{ background: '#181926', minHeight: '100vh', color: '#fff', fontFamily: "'Inter', sans-serif", display: 'flex', overflow: 'hidden' }}>

            {/* --- SIDEBAR --- */}
            <aside style={{ width: '280px', padding: '40px 30px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '60px', fontWeight: 800, fontSize: '24px', letterSpacing: '-1px' }}>Do it</div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                    <NavItem icon={<LayoutGrid size={20} />} label="Dashboard" active />
                    <NavItem icon={<Folder size={20} />} label="Projects" />
                    <NavItem icon={<CheckSquare size={20} />} label="Task" />
                    <NavItem icon={<CalIcon size={20} />} label="Calendar" />
                    <NavItem icon={<Settings size={20} />} label="Settings" />
                </nav>

                {/* Upgrade Card */}
                <div style={{
                    background: '#1e2030', borderRadius: '30px', padding: '24px', position: 'relative', marginTop: 'auto', marginBottom: '40px',
                    textAlign: 'center'
                }}>
                    <div style={{ position: 'absolute', top: '-40px', left: '0', right: '0', margin: '0 auto', width: '80px', height: '80px' }}>
                        {/* 3D Character Placeholder */}
                        <div style={{ fontSize: '60px' }}>🧘</div>
                    </div>
                    <h4 style={{ margin: '40px 0 10px 0', fontSize: '16px' }}>Upgrade to Premium</h4>
                    <p style={{ fontSize: '12px', color: '#888', marginBottom: '20px' }}>to get all features</p>
                    <button style={{
                        background: 'linear-gradient(90deg, #A855F7, #EC4899)',
                        border: 'none', color: 'white', padding: '12px 24px', borderRadius: '50px',
                        fontWeight: 600, fontSize: '13px', cursor: 'pointer', width: '100%'
                    }}>Get started &gt;</button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#888', cursor: 'pointer' }}>
                    <LogOut size={20} /> Logout
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>

                {/* Header */}
                <header style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px', alignItems: 'center', gap: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 'bold' }}>Rayan Aldohian</div>
                            <div style={{ fontSize: '12px', color: '#888' }}>Super Admin</div>
                        </div>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#333', overflow: 'hidden', border: '2px solid #333' }}>
                            {/* Avatar */}
                            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #6D4CFF, #00FFF2)' }}></div>
                        </div>
                    </div>
                </header>

                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>

                    {/* LEFT COLUMN */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                        {/* Hero Banner */}
                        <div style={{
                            background: '#232433', borderRadius: '40px', padding: '40px', position: 'relative', overflow: 'hidden',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                        }}>
                            <div style={{ position: 'relative', zIndex: 10 }}>
                                <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '10px' }}>Hello, Rayan!</h1>
                                <p style={{ color: '#aaa', fontSize: '16px', marginBottom: '30px' }}>Get professional planning services</p>
                                <button style={{
                                    background: '#2D2E40', border: '1px solid #3E3F50', color: 'white', padding: '12px 24px', borderRadius: '50px',
                                    display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600
                                }}>
                                    Upgrade Plan <span style={{ color: '#D35BFF' }}>✦</span>
                                </button>
                            </div>

                            {/* Large 3D Character */}
                            <div style={{ fontSize: '150px', transform: 'rotate(-10deg)', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}>
                                🤠
                            </div>
                        </div>

                        {/* Today Task */}
                        <div style={{ background: '#232433', borderRadius: '40px', padding: '30px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Today Task</h3>
                                <a href="#" style={{ fontSize: '12px', color: '#888' }}>View All</a>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {[
                                    { title: 'Design Homepage', date: 'Thu, Aug 23', done: false },
                                    { title: 'Dribble Illustrasi', date: 'Mon, Aug 19', done: true },
                                    { title: 'Onboarding Design', date: 'Wed, Aug 15', done: false },
                                ].map((t, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '14px', color: t.done ? '#666' : 'white', textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</div>
                                            <div style={{ fontSize: '11px', color: '#666' }}>{t.date}</div>
                                        </div>
                                        <div style={{
                                            width: '24px', height: '24px', borderRadius: '50%',
                                            border: t.done ? 'none' : '2px solid #444',
                                            background: t.done ? '#00E096' : 'transparent',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {t.done && <CheckSquare size={14} color="black" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                        {/* Calendar Widget */}
                        <div style={{ background: '#232433', borderRadius: '40px', padding: '30px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '14px', fontWeight: 600, color: '#aaa' }}>{'< August 2026 >'}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center', fontSize: '12px', color: '#666' }}>
                                <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
                                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => {
                                    const active = d === 2;
                                    const range = d > 2 && d < 6;
                                    return (
                                        <div key={d} style={{
                                            padding: '8px 0',
                                            background: active ? '#6D4CFF' : range ? '#2D2E40' : 'transparent',
                                            borderRadius: active ? '50%' : range ? '0' : '50%',
                                            color: active ? 'white' : '#ddd',
                                            cursor: 'pointer'
                                        }}>
                                            {d}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Task Progress */}
                        <div style={{ background: '#232433', borderRadius: '40px', padding: '30px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Task Progress</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {[
                                    { name: 'Portal Dev', val: '8/10', w: '80%', c: '#D35BFF' },
                                    { name: 'App Design', val: '6/10', w: '60%', c: '#00E096' },
                                    { name: 'Marketing', val: '2/7', w: '30%', c: '#00FFF2' },
                                ].map((p, i) => (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                                            <span style={{ color: '#ccc' }}>{p.name}</span>
                                            <span style={{ color: '#666' }}>{p.val}</span>
                                        </div>
                                        <div style={{ height: '6px', background: '#333', borderRadius: '10px', overflow: 'hidden' }}>
                                            <div style={{ width: p.w, height: '100%', background: p.c, borderRadius: '10px' }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Events Card */}
                        <div style={{ background: '#232433', borderRadius: '40px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '5px' }}>Upcoming</h3>

                            <div style={{ background: '#2D2E40', borderRadius: '20px', padding: '16px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#00FFF2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black' }}>
                                    <Settings size={20} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 600 }}>Design Review</div>
                                    <div style={{ fontSize: '11px', color: '#888' }}>9:00 AM - 10:00 AM</div>
                                </div>
                            </div>

                            <div style={{ background: '#2D2E40', borderRadius: '20px', padding: '16px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#D35BFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                    <Folder size={20} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 600 }}>Launch Party</div>
                                    <div style={{ fontSize: '11px', color: '#888' }}>5:00 PM - 9:00 PM</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon, label, active = false }: any) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 16px',
            borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s',
            background: active ? 'linear-gradient(90deg, #6D4CFF, #A855F7)' : 'transparent',
            color: active ? 'white' : '#888',
            boxShadow: active ? '0 10px 20px rgba(109, 76, 255, 0.3)' : 'none'
        }}>
            {icon}
            <span style={{ fontSize: '14px', fontWeight: 500 }}>{label}</span>
        </div>
    );
}
