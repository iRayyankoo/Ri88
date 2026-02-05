
"use client";
import React from 'react';
import { useSession } from "next-auth/react"
import { ArrowRight, User, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const { data: session } = useSession();

    if (!session) {
        return (
            <div style={{ minHeight: '100vh', background: '#181926', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>You need to be signed in to view this page.</h2>
                    <Link href="/beta" style={{ color: '#6D4CFF' }}>Return Home</Link>
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', background: '#181926', color: 'white', fontFamily: "'Inter', sans-serif", padding: '40px', direction: 'rtl' }}>
            <Link href="/beta" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#8890AA', textDecoration: 'none', marginBottom: '40px' }}>
                <ArrowRight size={20} />
                <span>عودة للرئيسية</span>
            </Link>

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{
                    background: '#232433', borderRadius: '32px', padding: '40px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px'
                }}>
                    <div style={{ position: 'relative' }}>
                        {session.user?.image ? (
                            <img src={session.user.image} alt="User" style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #6D4CFF' }} />
                        ) : (
                            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#6D4CFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                                <User />
                            </div>
                        )}
                        <div style={{ position: 'absolute', bottom: 5, right: 5, background: '#00E096', width: '20px', height: '20px', borderRadius: '50%', border: '3px solid #232433' }}></div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '5px' }}>{session.user?.name}</h1>
                        <p style={{ color: '#8890AA' }}>عضو مميز</p>
                    </div>

                    <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div className="info-row">
                            <Mail size={18} color="#8890AA" />
                            <span>{session.user?.email}</span>
                        </div>
                        <div className="info-row">
                            <Calendar size={18} color="#8890AA" />
                            <span>تاريخ الانضمام: {new Date().toLocaleDateString('ar-SA')}</span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .info-row {
                    display: flex; alignItems: center; gap: 15px; padding: 15px;
                    background: rgba(255,255,255,0.02); border-radius: 16px;
                    color: white; font-size: 14px;
                }
            `}</style>
        </div>
    );
}
