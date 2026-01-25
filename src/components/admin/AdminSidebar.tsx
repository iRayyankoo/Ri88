import React from 'react';
import { LayoutDashboard, FileText, Users, Palette, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

interface NavButtonProps {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
}

function NavButton({ icon, label, active, onClick }: NavButtonProps) {
    return (
        <button
            onClick={onClick}
            style={{
                background: active ? 'var(--primary-gradient, linear-gradient(135deg, #6D4CFF, #00FFF2))' : 'transparent',
                border: 'none',
                color: active ? 'white' : '#aaa',
                padding: '12px 15px',
                textAlign: 'left',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.95em',
                fontWeight: active ? 600 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                transition: 'all 0.2s',
                marginBottom: '4px'
            }}
        >
            <span style={{ opacity: active ? 1 : 0.7 }}>{icon}</span>
            {label}
        </button>
    );
}

export default function AdminSidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
    return (
        <div style={{
            background: '#0f0f13',
            borderRight: '1px solid rgba(255,255,255,0.05)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflowY: 'auto'
        }}>
            <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <span style={{ fontSize: '20px' }}>🚀</span>
                </div>
                <div>
                    <div style={{ fontWeight: '800', fontSize: '1.2em', color: 'white', letterSpacing: '-0.5px' }}>Ri88 Admin</div>
                    <div style={{ fontSize: '0.75em', color: '#666' }}>Control Center</div>
                </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '0.75em', color: '#555', fontWeight: 'bold', marginBottom: '8px', paddingLeft: '10px' }}>MAIN MENU</div>
                <NavButton icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                <NavButton icon={<FileText size={18} />} label="Content & Blog" active={activeTab === 'content'} onClick={() => setActiveTab('content')} />
                <NavButton icon={<Users size={18} />} label="Users & Inbox" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />

                <div style={{ fontSize: '0.75em', color: '#555', fontWeight: 'bold', margin: '20px 0 8px', paddingLeft: '10px' }}>SYSTEM</div>
                <NavButton icon={<Palette size={18} />} label="Appearance" active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')} />
                <NavButton icon={<Settings size={18} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
                <Link href="/">
                    <button style={{
                        background: 'rgba(255, 71, 87, 0.1)',
                        color: '#ff4757',
                        border: '1px solid rgba(255, 71, 87, 0.2)',
                        padding: '12px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                        alignItems: 'center',
                        fontSize: '0.9em',
                        fontWeight: 600,
                        transition: 'all 0.2s'
                    }}
                        className="hover:bg-red-500/20"
                    >
                        <LogOut size={16} /> Logout / Exit
                    </button>
                </Link>
                <div style={{ textAlign: 'center', color: '#444', fontSize: '0.75em', marginTop: '20px' }}>
                    v2.1.0 Build 240
                </div>
            </div>
        </div>
    );
}
