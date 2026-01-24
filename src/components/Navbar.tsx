"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <nav className="navbar">
                <div className="nav-container">
                    {/* Brand */}
                    <Link href="/" className="brand" style={{ display: 'flex', alignItems: 'center' }}>
                        {/* Note: We will move the logo image later, using text for now or placeholder */}
                        <div style={{ fontWeight: '900', fontSize: '24px', letterSpacing: '-1px' }}>
                            Ri88<span style={{ color: 'var(--accent-pink)' }}>.</span>
                        </div>
                    </Link>

                    {/* Desktop Links */}
                    <div className="nav-links">
                        <Link href="/" className="nav-link active">الأدوات</Link>
                        <Link href="/about" className="nav-link">عن الموقع</Link>
                        <Link href="/blog" className="nav-link">المدونة</Link>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <button
                            id="langToggle"
                            style={{
                                background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '12px',
                                cursor: 'pointer'
                            }}
                        >
                            عربي
                        </button>

                        {/* Mobile Toggle */}
                        <button
                            className="mobile-menu-toggle"
                            onClick={() => setMobileMenuOpen(true)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <Menu color="white" size={28} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'active' : ''}`}>
                <div className="mobile-nav-content">
                    <button className="close-mobile-nav" onClick={() => setMobileMenuOpen(false)}>
                        <X color="white" />
                    </button>
                    <Link href="/" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>الرئيسية</Link>
                    <Link href="/tools" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>الأدوات</Link>
                    <Link href="/about" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>عن الموقع</Link>
                    <Link href="/blog" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>المدونة</Link>
                </div>
            </div>
        </>
    );
}
