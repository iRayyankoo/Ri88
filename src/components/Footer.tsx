import React from 'react';
import Link from 'next/link';
import { ArrowRight, Twitter, Instagram, Linkedin, ArrowLeft } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="fat-footer">
            <div className="footer-grid">
                {/* Brand Column */}
                <div className="footer-col">
                    {/* We can use text or logo here. Using text for now as per Navbar */}
                    <div style={{ fontWeight: '900', fontSize: '24px', letterSpacing: '-1px', color: 'white', marginBottom: '20px' }}>
                        Ri88<span style={{ color: 'var(--accent-pink)' }}>.</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '300px' }}>
                        Ri88 is the leading digital toolbox for the modern Saudi creator. Trusted by over 10,000 users daily.
                    </p>
                </div>

                {/* Links Column */}
                <div className="footer-col">
                    <h4>Explore</h4>
                    <Link href="/">All Tools</Link>
                    <Link href="/blog">Magazine</Link>
                    <Link href="/sports">Live Sports</Link>
                    <Link href="/about">About Us</Link>
                </div>

                {/* Legal Column */}
                <div className="footer-col">
                    <h4>Legal</h4>
                    <Link href="#">Privacy Policy</Link>
                    <Link href="#">Terms of Service</Link>
                    <Link href="#">Cookie Policy</Link>
                    <Link href="#">Contact Support</Link>
                </div>

                {/* Newsletter Column */}
                <div className="footer-col">
                    <h4>Stay Updated</h4>
                    <p style={{ fontSize: '14px', marginBottom: '10px', color: 'var(--text-muted)' }}>
                        Get the latest tools delivered to your inbox.
                    </p>
                    <div className="footer-input-group">
                        <input type="email" placeholder="Enter your email" className="bg-transparent border-none text-white focus:outline-none flex-1 p-2" />
                        <button style={{ background: 'var(--accent-pink)', border: 'none', borderRadius: '8px', width: '40px', height: '40px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            {/* RTL aware arrow? usually arrow-left for RTL if input is RTL but let's stick to standard */}
                            <ArrowLeft size={20} className="rtl-flip" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2026 Ri88 Portal. Made with ❤️ in Riyadh.</p>
                <div className="social-links">
                    <Link href="#"><Twitter size={20} /></Link>
                    <Link href="#"><Instagram size={20} /></Link>
                    <Link href="#"><Linkedin size={20} /></Link>
                </div>
            </div>
        </footer>
    );
}
