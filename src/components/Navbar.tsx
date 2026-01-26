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
                    <Link href="/" className="brand">
                        {/* Note: We will move the logo image later, using text for now or placeholder */}
                        <div className="brand-text">
                            Ri88<span className="brand-dot">.</span>
                        </div>
                    </Link>

                    {/* Desktop Links */}
                    <div className="nav-links">
                        <Link href="/" className="nav-link active">الأدوات</Link>
                        <Link href="/about" className="nav-link">عن الموقع</Link>
                        <Link href="/blog" className="nav-link">المدونة</Link>
                        <Link href="/beta" className="nav-link beta-link">تجربة البيتا 🚀</Link>
                    </div>

                    {/* Actions */}
                    <div className="nav-actions">
                        <button
                            id="langToggle"
                            className="lang-toggle"
                            title="Toggle Language"
                            aria-label="Toggle Language"
                        >
                            عربي
                        </button>

                        {/* Mobile Toggle */}
                        <button
                            className="mobile-menu-toggle"
                            onClick={() => setMobileMenuOpen(true)}
                            title="Open Menu"
                            aria-label="Open Menu"
                        >
                            <Menu color="white" size={28} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'active' : ''}`}>
                <div className="mobile-nav-content">
                    <button className="close-mobile-nav" onClick={() => setMobileMenuOpen(false)} title="Close Menu" aria-label="Close Menu">
                        <X color="white" />
                    </button>
                    <Link href="/beta" className="mobile-link beta-mobile-link" onClick={() => setMobileMenuOpen(false)}>تجربة البيتا 🚀</Link>
                    <Link href="/" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>الرئيسية</Link>
                    <Link href="/tools" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>الأدوات</Link>
                    <Link href="/about" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>عن الموقع</Link>
                    <Link href="/blog" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>المدونة</Link>
                </div>
            </div>

            <style jsx>{`
                .brand { display: flex; align-items: center; }
                .brand-text { font-weight: 900; font-size: 24px; letter-spacing: -1px; }
                .brand-dot { color: var(--accent-pink); }
                .beta-link { color: #D35BFF; font-weight: bold; }
                .nav-actions { display: flex; gap: 16px; align-items: center; }
                .beta-mobile-link { color: #D35BFF; }
                .lang-toggle {
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    padding: 6px 12px;
                    border-radius: 12px;
                    cursor: pointer;
                }
                .mobile-menu-toggle { background: none; border: none; cursor: pointer; }
            `}</style>
        </>
    );
}
