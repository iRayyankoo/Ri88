"use client";
import React, { useState, useMemo } from 'react';
import { tools, categories, Tool } from '@/data/tools';
import { Search, LayoutGrid, Star, Calculator, FileText, Image as ImageIcon, Type, Clock, Activity, Zap, Smartphone, Code, Flag, GraduationCap, Languages, Trophy, Palette, ArrowRight, Twitter, Instagram, Linkedin, Shuffle } from 'lucide-react';
import Modal from '@/components/Modal';
import ToolRouter from '@/components/tools/ToolRouter';
import Link from 'next/link';
import UserMenu from '@/components/auth/UserMenu';
import LoginModal from '@/components/auth/LoginModal';
import { useSession } from "next-auth/react";

// Icon Map for Categories
const CategoryIcons: any = {
    all: LayoutGrid,
    favorites: Star,
    finance: Calculator,
    pdf: FileText,
    image: ImageIcon,
    text: Type,
    time: Clock,
    health: Activity,
    productivity: Zap,
    content: Smartphone,
    developer: Code,
    saudi: Flag,
    education: GraduationCap,
    languages: Languages,
    sports: Trophy,
    design: Palette
};

export default function BetaHome() {
    const { data: session, status } = useSession();
    const [activeCat, setActiveCat] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTool, setActiveTool] = useState<Tool | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile Menu State
    const [loginOpen, setLoginOpen] = useState(false); // Login Modal State

    // Initial View Logic (Featured/New)
    const featuredTools = useMemo(() => tools.filter(t => ['loan-calc', 'time-add', 'health-bmi', 'pdf-merge'].includes(t.id)), []);
    const newTools = useMemo(() => tools.filter(t => t.status === 'new').slice(0, 4), []);
    const [randomTools, setRandomTools] = useState<Tool[]>([]);

    // Smart Randomization Logic
    React.useEffect(() => {
        const excludedIds = new Set([...featuredTools.map(t => t.id), ...newTools.map(t => t.id)]);
        const candidates = tools.filter(t => !excludedIds.has(t.id));

        // Shuffle
        for (let i = candidates.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
        }

        setRandomTools(candidates.slice(0, 8)); // Show 8 random tools
    }, [featuredTools, newTools]);

    // Filter Logic
    const filteredTools = useMemo(() => {
        let res = tools;
        if (activeCat !== 'all') {
            res = res.filter(t => t.cat === activeCat);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            res = res.filter(t =>
                t.title.toLowerCase().includes(q) ||
                t.titleAr.includes(q) ||
                t.desc.toLowerCase().includes(q)
            );
        }
        return res;
    }, [activeCat, searchQuery]);

    const handleToolClick = (tool: Tool) => {
        setActiveTool(tool);
    };

    return (
        <div className="beta-layout">

            {/* --- MOBILE HEADER (Visible only on mobile) --- */}
            <div className="mobile-header">
                <div style={{ fontWeight: 900, fontSize: '20px', color: 'white' }}>Ri88<span style={{ color: '#D35BFF' }}>.</span></div>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'none', border: 'none', color: 'white' }}>
                    <LayoutGrid size={24} />
                </button>
            </div>

            {/* --- SIDEBAR --- */}
            <aside className={`beta-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <div style={{ fontWeight: 900, fontSize: '24px', letterSpacing: '-1px', color: 'white' }}>Ri88<span style={{ color: '#D35BFF' }}>.</span></div>
                    </Link>
                    {/* Mobile Close Button */}
                    <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)}>
                        <ArrowRight size={20} />
                    </button>
                </div>

                <div className="sidebar-content">
                    <div className="sidebar-label">تصفح</div>
                    {categories.map(cat => {
                        const Icon = CategoryIcons[cat.id] || LayoutGrid;
                        const isActive = activeCat === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => { setActiveCat(cat.id); setMobileMenuOpen(false); }}
                                className={`sidebar-item ${isActive ? 'active' : ''}`}
                            >
                                <Icon size={18} className="sidebar-icon" />
                                <span className="sidebar-text">{cat.nameAr}</span>
                                {isActive && <div className="active-indicator"></div>}
                            </button>
                        )
                    })}
                </div>
            </aside>

            {/* --- MAIN MAIN --- */}
            <main className="beta-main">

                <div className="beta-content-wrapper">
                    {/* Header / Search */}
                    <header className="beta-header">
                        <div className="search-container">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="بحث عن أداة، حاسبة..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </div>

                        <div className="header-actions">
                            <button className="lang-btn">عربي / English</button>

                            {status === 'loading' ? (
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
                            ) : session ? (
                                <UserMenu />
                            ) : (
                                <button
                                    onClick={() => setLoginOpen(true)}
                                    className="lang-btn"
                                    style={{ background: '#6D4CFF', border: 'none', cursor: 'pointer' }}
                                >
                                    تسجيل الدخول
                                </button>
                            )}
                        </div>
                    </header>

                    {/* Hero / Welcome Block */}
                    {activeCat === 'all' && !searchQuery && (
                        <div className="beta-hero">
                            <div className="hero-text">
                                <h1 style={{ lineHeight: '1.2' }}>
                                    أدوات <span style={{ color: '#00FFF2' }}>ذكية</span> لاحتياجاتك<br />
                                    <span style={{ color: '#D35BFF' }}>اليومية</span> المتجددة.
                                </h1>
                                <p>
                                    أكثر من 50 أداة مجانية من تعديل ملفات PDF إلى الحسابات المالية.
                                    كل ما تحتاجه في لوحة تحكم عصرية واحدة.
                                </p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => setActiveCat('finance')} className="cta-btn">ابدأ الحساب</button>
                                </div>
                            </div>
                            <div className="hero-3d-element">🚀</div>
                        </div>
                    )}

                    {/* Content Logic */}
                    <div style={{ flex: 1 }}>
                        {(searchQuery || activeCat !== 'all') ? (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <h2 style={{ fontSize: '20px', fontWeight: 700 }}>
                                        {categories.find(c => c.id === activeCat)?.nameAr || 'نتائج البحث'}
                                        <span style={{ fontSize: '12px', color: '#666', marginRight: '10px', fontWeight: 400 }}>({filteredTools.length} عنصر)</span>
                                    </h2>
                                </div>
                                <div className="tools-grid-responsive">
                                    {filteredTools.map(tool => (
                                        <ToolCard key={tool.id} tool={tool} onClick={() => handleToolClick(tool)} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                {/* Featured */}
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Star size={18} color="#F59E0B" /> أدوات مميزة
                                        </h2>
                                    </div>
                                    <div className="tools-grid-responsive">
                                        {featuredTools.map(tool => (
                                            <ToolCard key={tool.id} tool={tool} onClick={() => handleToolClick(tool)} />
                                        ))}
                                    </div>
                                </div>
                                {/* New */}
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Zap size={18} color="#00E096" /> واصل حديثاً
                                        </h2>
                                    </div>
                                    <div className="tools-grid-responsive">
                                        {newTools.map(tool => (
                                            <ToolCard key={tool.id} tool={tool} onClick={() => handleToolClick(tool)} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                                </div>
                    {/* Random / Discover */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Shuffle size={18} color="#D35BFF" /> جرب شيئاً جديداً
                            </h2>
                            <button
                                onClick={() => window.location.reload()}
                                style={{ background: 'none', border: 'none', color: '#D35BFF', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}
                            >
                                <Shuffle size={14} /> تحديث
                            </button>
                        </div>
                        <div className="tools-grid-responsive">
                            {randomTools.map(tool => (
                                <ToolCard key={tool.id} tool={tool} onClick={() => handleToolClick(tool)} />
                            ))}
                        </div>
                    </div>
                </div>
                        )}
        </div>
                </div >

        {/* Footer (Full Width, No Bottom Gap) */ }
        < footer className = "beta-footer" >
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <div style={{ fontWeight: '900', fontSize: '24px', letterSpacing: '-1px', color: 'white', marginBottom: '20px' }}>
                                Ri88<span style={{ color: '#D35BFF' }}>.</span>
                            </div>
                            <p style={{ color: '#8890AA', fontSize: '14px', lineHeight: '1.6' }}>
                                بوابتك الرقمية الشاملة للإنتاجية والتطوير. <br />صممت للمبدع العربي الحديث.
                            </p>
                        </div>
                        <div className="footer-links">
                            <h4>استكشف</h4>
                            <div className="link-group">
                                <Link href="/beta">الرئيسية</Link>
                                <Link href="/beta/about">من نحن</Link>
                                <Link href="/beta/contact">تواصل معنا</Link>
                            </div>
                        </div>
                        <div className="footer-links">
                            <h4>قانوني</h4>
                            <div className="link-group">
                                <Link href="/beta/privacy">الخصوصية</Link>
                                <Link href="/beta/terms">الشروط</Link>
                            </div>
                        </div>
                        <div className="footer-social">
                            <h4>تواصل</h4>
                            <div className="social-icons">
                                <a href="#"><Twitter size={20} /></a>
                                <a href="#"><Instagram size={20} /></a>
                                <a href="#"><Linkedin size={20} /></a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-copyright">
                        © 2026 Ri88. صنع بكل حب ❤️ في الرياض.
                    </div>
                </footer >

            </main >

        {/* Login Modal */ }
        < LoginModal isOpen = { loginOpen } onClose = {() => setLoginOpen(false)
} />

{/* Tool Modal */ }
            <Modal
                isOpen={!!activeTool}
                onClose={() => setActiveTool(null)}
                title={activeTool?.titleAr || activeTool?.title || ''}
            >
                {activeTool && <ToolRouter tool={activeTool} />}
            </Modal>

            <style jsx global>{`
                /* --- GLOBAL LAYOUT STYLES --- */
                .beta-layout {
                    background: #181926;
                    min-height: 100vh;
                    color: #fff;
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    overflow: hidden; /* Prevent body scroll */
                    direction: rtl;
                }
                
                /* Sidebar */
                .beta-sidebar {
                    width: 260px;
                    padding: 30px 20px;
                    display: flex;
                    flex-direction: column;
                    border-left: 1px solid rgba(255,255,255,0.05);
                    background: #13141f;
                    height: 100vh;
                    overflow-y: auto;
                    transition: transform 0.3s ease;
                    z-index: 100;
                }
                .sidebar-header { margin-bottom: 40px; display: flex; justify-content: space-between; align-items: center; }
                .sidebar-content { flex: 1; display: flex; flex-direction: column; gap: 8px; }
                .sidebar-label { fontSize: 11px; fontWeight: 700; color: #555; padding-right: 12px; margin-bottom: 5px; text-transform: uppercase; }
                
                .sidebar-item {
                    display: flex; alignItems: center; gap: 12px; padding: 12px 16px;
                    border-radius: 14px; cursor: pointer; border: none; width: 100%; text-align: right;
                    background: transparent; color: #8890AA;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    font-weight: 500; justify-content: flex-start;
                    position: relative; overflow: hidden;
                }
                .sidebar-item:hover { background: rgba(255,255,255,0.05); color: white; padding-right: 20px; }
                .sidebar-item.active { background: linear-gradient(270deg, #6D4CFF, #8E44AD); color: white; font-weight: 600; }
                .sidebar-icon { position: relative; z-index: 2; }
                .sidebar-text { position: relative; z-index: 2; fontSize: 14px; }
                .active-indicator { position: absolute; right: 0; top: 0; width: 4px; height: 100%; background: #fff; opacity: 0.3; }

                /* Main Area */
                .beta-main { flex: 1; display: flex; flex-direction: column; height: 100vh; overflow-y: auto; overflow-x: hidden; position: relative; }
                .beta-content-wrapper { padding: 30px 40px; flex: 1; }

                /* Header */
                .beta-header { display: flex; justify-content: space-between; alignItems: center; margin-bottom: 30px; }
                .search-container { position: relative; width: 400px; }
                .search-input { width: 100%; padding: 12px 45px 12px 12px; border-radius: 50px; background: #232433; border: 1px solid #2E2F40; color: white; outline: none; text-align: right; font-family: inherit; }
                .search-icon { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); color: #666; }
                .header-actions { display: flex; gap: 15px; }
                .lang-btn { padding: 10px 20px; border-radius: 50px; background: #232433; border: 1px solid #2E2F40; color: white; fontSize: 13px; fontWeight: 600; }
                .favorite-btn { padding: 10px; border-radius: 50%; background: #D35BFF; color: white; border: none; display: flex; alignItems: center; content: center; }

                /* Hero */
                .beta-hero { background: linear-gradient(120deg, #232433 0%, #1e1f2b 100%); border-radius: 35px; padding: 40px 60px; margin-bottom: 40px; display: flex; alignItems: center; justifyContent: space-between; direction: rtl; }
                .hero-text { max-width: 500px; z-index: 2; }
                .hero-text h1 { font-size: 36px; font-weight: 800; margin-bottom: 15px; }
                .hero-text p { color: #8890AA; margin-bottom: 30px; line-height: 1.6; font-size: 15px; }
                .cta-btn { background: white; color: black; padding: 12px 28px; border-radius: 50px; font-weight: 700; border: none; cursor: pointer; transition: transform 0.2s; }
                .hero-3d-element { font-size: 150px; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.4)); transform: rotate(-10deg) translateY(-10px); }

                /* Grid */
                .tools-grid-responsive { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
                
                /* Footer */
                .beta-footer { margin-top: 60px; border-top: 1px solid rgba(255,255,255,0.05); padding: 60px 40px 20px 40px; direction: rtl; background: #13141f; /* Darker bg for footer */ }
                .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 2fr; gap: 40px; margin-bottom: 40px; }
                .footer-links h4, .footer-social h4 { font-size: 14px; font-weight: 700; margin-bottom: 20px; }
                .link-group { display: flex; flex-direction: column; gap: 10px; font-size: 14px; }
                .link-group a { color: #8890AA; text-decoration: none; transition: color 0.2s; }
                .link-group a:hover { color: white; }
                .social-icons { display: flex; gap: 15px; }
                .social-icons a { color: #8890AA; transition: color 0.2s; }
                .social-icons a:hover { color: white; }
                .footer-copyright { text-align: center; font-size: 12px; color: #444; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px; }

                /* Mobile Header (Hidden by default) */
                .mobile-header { display: none; padding: 20px; justify-content: space-between; alignItems: center; border-bottom: 1px solid rgba(255,255,255,0.05); background: #181926; }
                .mobile-close-btn { display: none; background: none; border: none; color: white; }

                /* --- MEDIA QUERIES --- */
                @media (max-width: 900px) {
                     .beta-layout { flex-direction: column; }
                     .beta-sidebar {
                         position: fixed; inset: 0; width: 100%; transform: translateX(100%); transition: transform 0.3s ease;
                     }
                     .beta-sidebar.open { transform: translateX(0); }
                     .mobile-header { display: flex; }
                     .mobile-close-btn { display: block; }

                     .beta-content-wrapper { padding: 20px; }
                     .beta-hero { padding: 30px; flex-direction: column-reverse; text-align: center; gap: 30px; }
                     .hero-text { max-width: 100%; }
                     .hero-3d-element { font-size: 100px; transform: rotate(-10deg); }
                     .search-container { width: 100%; }
                     .beta-header { flex-direction: column-reverse; gap: 20px; align-items: stretch; }
                     .header-actions { justify-content: space-between; }
                     
                     .footer-grid { grid-template-columns: 1fr; text-align: center; gap: 30px; }
                     .link-group, .social-icons { align-items: center; justify-content: center; }
                     .beta-footer { padding: 40px 20px 20px; }
                     
                     .tools-grid-responsive { grid-template-columns: 1fr; }
                     
                     /* Fix Footer Gap: Reduce margin top */
                     .beta-footer { margin-top: 20px; }
                }

                .bento-card:hover {
                    transform: translateY(-5px);
                    background: #2D2E40 !important;
                    border-color: #6D4CFF !important;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }
            `}</style>
        </div >
    );
}

// Reusable Tool Card Component for cleanliness
function ToolCard({ tool, onClick }: { tool: Tool, onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className="bento-card"
            style={{
                background: '#232433', borderRadius: '24px', padding: '24px',
                border: '1px solid transparent', cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', flexDirection: 'column', gap: '15px', position: 'relative', overflow: 'hidden'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px', color: '#fff'
                }}>
                    <div className={`lucide-${tool.icon}`} /> ⚡
                </div>
                <div style={{
                    padding: '5px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 700,
                    background: tool.status === 'new' ? '#00E096' : 'rgba(255,255,255,0.05)',
                    color: tool.status === 'new' ? '#000' : '#666'
                }}>
                    {tool.status === 'new' ? 'جديد' : (categories.find(c => c.id === tool.cat)?.nameAr || tool.cat)}
                </div>
            </div>

            <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '5px' }}>{tool.titleAr || tool.title}</h3>
                <p style={{ fontSize: '12px', color: '#8890AA', lineHeight: '1.4' }}>{tool.descAr || tool.desc}</p>
            </div>
        </div>
    );
}
