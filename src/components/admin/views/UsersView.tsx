import React from 'react';
import { Mail, User, Shield, MoreHorizontal, CheckCircle } from 'lucide-react';

export default function UsersView() {
    const mockUsers = [
        { name: 'Rayan Aldohian', email: 'admin@ri88.info', role: 'Owner', status: 'Online', avatar: 'R' },
        { name: 'Sarah Ahmed', email: 'sarah.designer@gmail.com', role: 'Editor', status: 'Offline', avatar: 'S' },
        { name: 'Mohammed Ali', email: 'moe.dev@hotmail.com', role: 'User', status: 'Active', avatar: 'M' },
        { name: 'Khaled Omar', email: 'ko.business@outlook.sa', role: 'User', status: 'Active', avatar: 'K' },
    ];

    const mockMessages = [
        { from: 'Faisal', subject: 'Bug in PDF Tool', time: '2m ago', unread: true },
        { from: 'Noura', subject: 'Business Inquiry', time: '1h ago', unread: false },
        { from: 'Support Team', subject: 'Server Maintenance', time: '1d ago', unread: false },
    ];

    return (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px', height: 'calc(100vh - 140px)' }}>

            {/* User Management Column */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <h3 style={{ color: 'white', marginBottom: '16px' }}>Registered Users</h3>
                <div style={{ flex: 1, background: 'rgba(25, 25, 35, 0.5)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', overflow: 'hidden', padding: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {mockUsers.map((u, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', background: '#333', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>{u.avatar}</div>
                                    <div>
                                        <div style={{ color: 'white', fontWeight: 600, fontSize: '0.95em' }}>{u.name}</div>
                                        <div style={{ color: '#666', fontSize: '0.85em' }}>{u.email}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span style={{ padding: '4px 10px', background: u.role === 'Owner' ? 'rgba(211, 91, 255, 0.1)' : 'rgba(255,255,255,0.05)', color: u.role === 'Owner' ? '#D35BFF' : '#aaa', borderRadius: '20px', fontSize: '0.75em' }}>{u.role}</span>
                                    <button style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><MoreHorizontal size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Inbox Column */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ color: 'white', margin: 0 }}>Inbox</h3>
                    <span style={{ background: '#ff4757', color: 'white', fontSize: '0.75em', padding: '2px 8px', borderRadius: '10px' }}>1 New</span>
                </div>
                <div style={{ flex: 1, background: 'rgba(25, 25, 35, 0.5)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {mockMessages.map((msg, i) => (
                        <div key={i} style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: msg.unread ? 'rgba(109, 76, 255, 0.05)' : 'transparent', cursor: 'pointer', transition: 'background 0.2s' }} className="hover:bg-white/5">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <div style={{ fontWeight: msg.unread ? 700 : 500, color: msg.unread ? 'white' : '#ddd', fontSize: '0.95em' }}>{msg.from}</div>
                                <div style={{ fontSize: '0.75em', color: '#666' }}>{msg.time}</div>
                            </div>
                            <div style={{ fontSize: '0.9em', color: msg.unread ? '#ddd' : '#888' }}>{msg.subject}</div>
                            <div style={{ fontSize: '0.8em', color: '#555', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                Hey, I noticed a small issue when trying to upload a large PDF...
                            </div>
                        </div>
                    ))}
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <button className="btn-secondary" style={{ width: '100%', fontSize: '0.9em', padding: '10px' }}>View All Messages</button>
                    </div>
                </div>
            </div>

        </div>
    );
}
