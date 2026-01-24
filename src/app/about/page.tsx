
import React from 'react';
import Navbar from '@/components/Navbar'; // Re-using existing Navbar
import { Smartphone, Download, Play, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';

export const metadata = {
    title: 'Ri88 | About',
    description: 'About Ri88 Portal - A premium suite of essential utilities designed for Saudi users.',
};

export default function AboutPage() {
    return (
        <>
            <Navbar />

            <main className="container" style={{ padding: '120px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3em', marginBottom: '20px' }}>About Ri88 Portal</h1>
                <p style={{ fontSize: '1.2em', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '40px' }}>
                    A premium suite of essential utilities designed for Saudi users.<br />
                    We aim to provide fast, secure, and free tools for everyone.
                </p>

                {/* Mission Panel */}
                <div className="glass-panel" style={{ padding: '40px', marginBottom: '40px', textAlign: 'left' }}>
                    <h2 style={{ marginBottom: '20px', color: 'var(--accent-cyan)' }}>Our Mission</h2>
                    <p>
                        Ri88 was built to simplify everyday digital tasks. From calculating VAT and loans to converting files
                        and editing images, we bring everything into one unified, beautiful interface.
                    </p>
                </div>

                {/* Download APK Section */}
                <div
                    className="glass-panel"
                    style={{
                        padding: '40px',
                        marginBottom: '40px',
                        textAlign: 'left',
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(109, 76, 255,0.1) 100%)',
                        border: '1px solid rgba(109, 76, 255, 0.3)'
                    }}
                >
                    <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Smartphone color="var(--accent-cyan)" />
                        <span>Get the Android App</span>
                    </h2>
                    <p style={{ marginBottom: '25px', color: 'var(--text-secondary)' }}>
                        Download the official Ri88 Portal app for a faster, full-screen experience on your Android device.
                    </p>

                    <a href="/android_app.apk" download="Ri88-App.apk" style={{ textDecoration: 'none' }}>
                        <button style={{
                            background: 'black',
                            color: 'white',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            padding: '10px 20px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}>
                            <Play fill="white" size={24} />
                            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '10px', textTransform: 'uppercase' }}>GET IT ON</span>
                                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Google Play</span>
                            </div>
                        </button>
                    </a>

                    <p style={{ fontSize: '0.8em', color: 'var(--text-secondary)', marginTop: '15px', opacity: 0.7 }}>
                        * Direct APK Download
                    </p>
                </div>

                <div className="glass-panel" style={{ padding: '20px', display: 'inline-block' }}>
                    <strong>Version 2.0 (Next.js Edition)</strong>
                    <br /><span style={{ fontSize: '12px', opacity: 0.7 }}>Built with Next.js 14 & React</span>
                </div>
            </main>

            {/* Fat Footer */}
            <footer className="fat-footer" style={{ marginTop: '50px' }}>
                <div className="footer-grid">
                    <div className="footer-col">
                        {/* <img src="/assets/logo.png" style={{ height: '60px', marginBottom: '20px' }} /> */}
                        <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>Ri88.</h3>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '300px' }}>
                            Ri88 is the leading digital toolbox for the modern Saudi creator. Trusted by over 10,000 users
                            daily.
                        </p>
                    </div>
                    <div className="footer-col">
                        <h4>Explore</h4>
                        <a href="/">All Tools</a>
                        <a href="#">Magazine</a>
                        <a href="/sports">Live Sports</a>
                        <a href="/about">About Us</a>
                    </div>
                    <div className="footer-col">
                        <h4>Legal</h4>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Cookie Policy</a>
                        <a href="#">Contact Support</a>
                    </div>
                    <div className="footer-col">
                        <h4>Stay Updated</h4>
                        <p style={{ fontSize: '14px', marginBottom: '10px' }}>Get the latest tools delivered to your inbox.</p>
                        <div className="footer-input-group">
                            <input type="email" placeholder="Enter your email" />
                            <button><ArrowRight size={18} /></button>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 Ri88 Portal. Made with ❤️ in Riyadh.</p>
                    <div className="social-links">
                        <a href="#"><Twitter size={20} /></a>
                        <a href="#"><Instagram size={20} /></a>
                        <a href="#"><Linkedin size={20} /></a>
                    </div>
                </div>
            </footer>
        </>
    );
}
