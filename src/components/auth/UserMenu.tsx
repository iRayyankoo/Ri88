
"use client";
import React, { useState } from 'react';
import { useSession, signOut } from "next-auth/react"
import { User, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';

export default function UserMenu() {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);

    if (!session) return null;

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    background: '#232433', border: '1px solid #2E2F40', borderRadius: '50px',
                    padding: '6px 16px 6px 6px', display: 'flex', alignItems: 'center', gap: '10px',
                    color: 'white', cursor: 'pointer'
                }}
            >
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{session.user?.name || "User"}</span>
                {session.user?.image ? (
                    <img src={session.user.image} alt="User" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                ) : (
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#6D4CFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={16} />
                    </div>
                )}
            </button>

            {open && (
                <>
                    <div
                        style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                        onClick={() => setOpen(false)}
                    />
                    <div className="user-dropdown" style={{
                        position: 'absolute', top: '120%', left: 0, width: '200px',
                        background: '#181926', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px', padding: '8px', zIndex: 100,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                        display: 'flex', flexDirection: 'column', gap: '4px'
                    }}>
                        <div style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '4px' }}>
                            <div style={{ fontSize: '12px', color: '#8890AA' }}>Signed in as</div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {session.user?.email}
                            </div>
                        </div>

                        <Link href="/beta/profile" className="dropdown-item" onClick={() => setOpen(false)}>
                            <User size={16} /> الملف الشخصي
                        </Link>
                        <Link href="/admin" className="dropdown-item" onClick={() => setOpen(false)}>
                            <Settings size={16} /> لوحة التحكم
                        </Link>

                        <button
                            onClick={() => signOut()}
                            className="dropdown-item"
                            style={{ color: '#ff4444' }}
                        >
                            <LogOut size={16} /> تسجيل خروج
                        </button>
                    </div>
                </>
            )}

            <style jsx>{`
                .dropdown-item {
                    display: flex; alignItems: center; gap: 10px; padding: 10px;
                    border-radius: 8px; color: #ccc; text-decoration: none;
                    font-size: 14px; background: transparent; border: none; width: 100%;
                    cursor: pointer; text-align: right; transition: all 0.2s;
                }
                .dropdown-item:hover {
                    background: rgba(255,255,255,0.05); color: white;
                }
            `}</style>
        </div>
    );
}
