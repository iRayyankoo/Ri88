"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BetaPageLayout({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div style={{ background: '#181926', minHeight: '100vh', color: '#fff', fontFamily: "'Inter', sans-serif", direction: 'rtl' }}>
            <header style={{ padding: '30px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link href="/beta" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', color: '#8890AA' }}>
                    <ArrowLeft size={20} className="rtl-flip" />
                    <span>العودة للرئيسية</span>
                </Link>
                <div style={{ fontWeight: 900, fontSize: '24px', letterSpacing: '-1px', color: 'white' }}>Ri88<span style={{ color: '#D35BFF' }}>.</span></div>
            </header>
            <main style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '40px', background: 'linear-gradient(90deg, #fff, #888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{title}</h1>
                <div style={{ background: '#232433', borderRadius: '24px', padding: '40px', lineHeight: '1.8', color: '#ccc' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
