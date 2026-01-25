"use client";
import React, { useState, useMemo } from 'react';
import { tools, categories, Tool } from '@/data/tools';
import { Search, LayoutGrid, Star, Calculator, FileText, Image as ImageIcon, Type, Clock, Activity, Zap, Smartphone, Code, Flag, GraduationCap, Languages, Trophy, Palette, ArrowRight, ArrowLeft, Twitter, Instagram, Linkedin } from 'lucide-react';
import Modal from '@/components/Modal';
import ToolRouter from '@/components/tools/ToolRouter';
import Link from 'next/link';

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
    const [activeCat, setActiveCat] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTool, setActiveTool] = useState<Tool | null>(null);

    // Initial View Logic (Featured/New)
    const featuredTools = useMemo(() => tools.filter(t => ['loan-calc', 'time-add', 'health-bmi', 'pdf-merge'].includes(t.id)), []);
    const newTools = useMemo(() => tools.filter(t => t.status === 'new').slice(0, 4), []);

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
        <div style={{ background: '#181926', minHeight: '100vh', color: '#fff', fontFamily: "'Inter', sans-serif", display: 'flex', overflow: 'hidden', direction: 'rtl' }}>

            {/* --- SIDEBAR (Categories) --- */}
            <aside style={{ width: '260px', padding: '30px 20px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(255,255,255,0.05)', background: '#13141f' }}>
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <div style={{ marginBottom: '40px', fontWeight: 900, fontSize: '24px', letterSpacing: '-1px', color: 'white', paddingRight: '10px' }}>Ri88<span style={{ color: '#D35BFF' }}>.</span></div>
                </Link>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '5px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#555', paddingRight: '12px', marginBottom: '5px', textTransform: 'uppercase' }}>تصفح</div>
                    {categories.map(cat => {
                        const Icon = CategoryIcons[cat.id] || LayoutGrid;
                        const isActive = activeCat === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCat(cat.id)}
                                className="sidebar-item"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                                    borderRadius: '14px', cursor: 'pointer', border: 'none', width: '100%', textAlign: 'right',
                                    background: isActive ? 'linear-gradient(270deg, #6D4CFF, #8E44AD)' : 'transparent',
                                    color: isActive ? 'white' : '#8890AA',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    fontWeight: isActive ? 600 : 500,
                                    justifyContent: 'flex-start',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <Icon size={18} style={{ position: 'relative', zIndex: 2 }} />
                                <span style={{ fontSize: '14px', position: 'relative', zIndex: 2 }}>{cat.nameAr}</span>
                                {isActive && <div style={{ position: 'absolute', right: 0, top: 0, width: '4px', height: '100%', background: '#fff', opacity: 0.3 }}></div>}
                            </button>
                        )
                    })}
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main style={{ flex: 1, padding: '30px 40px', overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'column' }}>

                {/* Header / Search */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div style={{ position: 'relative', width: '400px' }}>
                        <Search size={18} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                        <input
                            type="text"
                            placeholder="بحث عن أداة، حاسبة..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 45px 12px 12px', borderRadius: '50px',
                                background: '#232433', border: '1px solid #2E2F40', color: 'white', outline: 'none', textAlign: 'right'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button style={{ padding: '10px 20px', borderRadius: '50px', background: '#232433', border: '1px solid #2E2F40', color: 'white', fontSize: '13px', fontWeight: 600 }}>
                            عربي / English
                        </button>
                        <button style={{ padding: '10px', borderRadius: '50%', background: '#D35BFF', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Star size={18} fill="white" />
                        </button>
                    </div>
                </header>

                {/* Hero / Welcome Block (ARABIC + FIXED LAYOUT) */}
                {activeCat === 'all' && !searchQuery && (
                    <div style={{
                        background: 'linear-gradient(120deg, #232433 0%, #1e1f2b 100%)',
                        borderRadius: '35px', padding: '40px 60px', marginBottom: '40px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        direction: 'rtl'
                    }}>
                        {/* Text Side */}
                        <div style={{ maxWidth: '500px', zIndex: 2 }}>
                            <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '15px', lineHeight: '1.2' }}>
                                أدوات <span style={{ color: '#00FFF2' }}>ذكية</span> لاحتياجاتك<br />
                                <span style={{ color: '#D35BFF' }}>اليومية</span> المتجددة.
                            </h1>
                            <p style={{ color: '#8890AA', marginBottom: '30px', lineHeight: '1.6', fontSize: '15px' }}>
                                أكثر من 50 أداة مجانية من تعديل ملفات PDF إلى الحسابات المالية.
                                كل ما تحتاجه في لوحة تحكم عصرية واحدة.
                            </p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => setActiveCat('finance')} style={{ background: 'white', color: 'black', padding: '12px 28px', borderRadius: '50px', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }}>
                                    ابدأ الحساب
                                </button>
                            </div>
                        </div>

                        {/* 3D Floating Element (Left Side for RTL) */}
                        <div style={{ fontSize: '150px', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))', transform: 'rotate(-10deg) translateY(-10px)' }}>
                            🚀
                        </div>
                    </div>
                )}


                {/* CONTENT AREA */}
                <div style={{ flex: 1 }}>

                    {/* CASE 1: SEARCHING or CATEGORY SELECTED -> Show Grid */}
                    {(searchQuery || activeCat !== 'all') ? (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: 700 }}>
                                    {categories.find(c => c.id === activeCat)?.nameAr || 'نتائج البحث'}
                                    <span style={{ fontSize: '12px', color: '#666', marginRight: '10px', fontWeight: 400 }}>({filteredTools.length} عنصر)</span>
                                </h2>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                {filteredTools.map(tool => (
                                    <ToolCard key={tool.id} tool={tool} onClick={() => handleToolClick(tool)} />
                                ))}
                            </div>
                        </>
                    ) : (
                        /* CASE 2: HOME VIEW (Structured) */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

                            {/* Featured Section */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <h2 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Star size={18} color="#F59E0B" /> أدوات مميزة
                                    </h2>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                                    {featuredTools.map(tool => (
                                        <ToolCard key={tool.id} tool={tool} onClick={() => handleToolClick(tool)} />
                                    ))}
                                </div>
                            </div>

                            {/* New Arrivals */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <h2 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Zap size={18} color="#00E096" /> واصل حديثاً
                                    </h2>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                                    {newTools.map(tool => (
                                        <ToolCard key={tool.id} tool={tool} onClick={() => handleToolClick(tool)} />
                                    ))}
                                </div>
                            </div>

                        </div>
                    )}

                </div>

                {/* Footer (Integrated into Main Area) */}
                <footer style={{ marginTop: '60px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px', paddingBottom: '20px', direction: 'rtl' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', gap: '40px', marginBottom: '40px' }}>
                        <div>
                            <div style={{ fontWeight: '900', fontSize: '24px', letterSpacing: '-1px', color: 'white', marginBottom: '20px' }}>
                                Ri88<span style={{ color: '#D35BFF' }}>.</span>
                            </div>
                            <p style={{ color: '#8890AA', fontSize: '14px', lineHeight: '1.6' }}>
                                بوابتك الرقمية الشاملة للإنتاجية والتطوير. <br />صممت للمبدع العربي الحديث.
                            </p>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '20px' }}>استكشف</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#8890AA' }}>
                                <Link href="/beta" style={{ color: '#8890AA', textDecoration: 'none' }}>الرئيسية</Link>
                                <Link href="/beta/about" style={{ color: '#8890AA', textDecoration: 'none' }}>من نحن</Link>
                                <Link href="/beta/contact" style={{ color: '#8890AA', textDecoration: 'none' }}>تواصل معنا</Link>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '20px' }}>قانوني</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#8890AA' }}>
                                <Link href="/beta/privacy" style={{ color: '#8890AA', textDecoration: 'none' }}>الخصوصية</Link>
                                <Link href="/beta/terms" style={{ color: '#8890AA', textDecoration: 'none' }}>الشروط</Link>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '20px' }}>تواصل</h4>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <a href="#" style={{ color: '#8890AA' }}><Twitter size={20} /></a>
                                <a href="#" style={{ color: '#8890AA' }}><Instagram size={20} /></a>
                                <a href="#" style={{ color: '#8890AA' }}><Linkedin size={20} /></a>
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '12px', color: '#444' }}>
                        © 2026 Ri88. صنع بكل حب ❤️ في الرياض.
                    </div>
                </footer>

            </main>

            {/* Modal */}
            <Modal
                isOpen={!!activeTool}
                onClose={() => setActiveTool(null)}
                title={activeTool?.titleAr || activeTool?.title || ''}
            >
                {activeTool && <ToolRouter tool={activeTool} />}
            </Modal>

            <style jsx global>{`
                .bento-card:hover {
                    transform: translateY(-5px);
                    background: #2D2E40 !important;
                    border-color: #6D4CFF !important;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }
                .sidebar-item:hover {
                    background: rgba(255, 255, 255, 0.05) !important;
                    color: white !important;
                    padding-right: 20px !important;
                }
                .sidebar-item:active {
                    transform: scale(0.98);
                }
            `}</style>
        </div>
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
