"use client";
import React, { useState, useMemo } from 'react';
import { tools, categories, Tool } from '@/data/tools';
import { Search, LayoutGrid, Star, Calculator, FileText, Image as ImageIcon, Type, Clock, Activity, Zap, Smartphone, Code, Flag, GraduationCap, Languages, Trophy, Palette, ArrowRight } from 'lucide-react';
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
        <div style={{ background: '#181926', minHeight: '100vh', color: '#fff', fontFamily: "'Inter', sans-serif", display: 'flex', overflow: 'hidden' }}>

            {/* --- SIDEBAR (Categories) --- */}
            <aside style={{ width: '260px', padding: '30px 20px', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.05)', background: '#13141f' }}>
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <div style={{ marginBottom: '40px', fontWeight: 900, fontSize: '24px', letterSpacing: '-1px', color: 'white', paddingLeft: '10px' }}>Ri88<span style={{ color: '#D35BFF' }}>.</span></div>
                </Link>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '5px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#555', paddingLeft: '12px', marginBottom: '5px', textTransform: 'uppercase' }}>Browse</div>
                    {categories.map(cat => {
                        const Icon = CategoryIcons[cat.id] || LayoutGrid;
                        const isActive = activeCat === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCat(cat.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                                    borderRadius: '14px', cursor: 'pointer', border: 'none', width: '100%', textAlign: 'left',
                                    background: isActive ? 'linear-gradient(90deg, #6D4CFF, #8E44AD)' : 'transparent',
                                    color: isActive ? 'white' : '#8890AA',
                                    transition: 'all 0.2s',
                                    fontWeight: isActive ? 600 : 500
                                }}
                            >
                                <Icon size={18} />
                                <span style={{ fontSize: '14px' }}>{cat.name}</span>
                            </button>
                        )
                    })}
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main style={{ flex: 1, padding: '30px 40px', overflowY: 'auto', position: 'relative' }}>

                {/* Header / Search */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div style={{ position: 'relative', width: '400px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                        <input
                            type="text"
                            placeholder="Search tools, calculators..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 12px 12px 45px', borderRadius: '50px',
                                background: '#232433', border: '1px solid #2E2F40', color: 'white', outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button style={{ padding: '10px 20px', borderRadius: '50px', background: '#232433', border: '1px solid #2E2F40', color: 'white', fontSize: '13px', fontWeight: 600 }}>
                            English / عربي
                        </button>
                        <button style={{ padding: '10px', borderRadius: '50%', background: '#D35BFF', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Star size={18} fill="white" />
                        </button>
                    </div>
                </header>

                {/* Hero / Welcome Block */}
                <div style={{
                    background: 'linear-gradient(120deg, #232433 0%, #1e1f2b 100%)',
                    borderRadius: '35px', padding: '40px', marginBottom: '40px', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '10px' }}>
                            Advanced <span style={{ color: '#00FFF2' }}>Tools</span> for<br />
                            Everyday <span style={{ color: '#D35BFF' }}>Needs</span>.
                        </h1>
                        <p style={{ color: '#8890AA', marginBottom: '25px', lineHeight: '1.6' }}>
                            Access 50+ free tools ranging from PDF editing to Finance calculators.
                            Everything you need, all in one modern dashboard.
                        </p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setActiveCat('finance')} style={{ background: 'white', color: 'black', padding: '10px 24px', borderRadius: '50px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                                Start Calculating
                            </button>
                        </div>
                    </div>

                    {/* 3D Floating Element */}
                    <div style={{ position: 'absolute', right: '50px', top: '20px', fontSize: '160px', transform: 'rotate(15deg)', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }}>
                        🚀
                    </div>
                </div>

                {/* Active Category Title */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 700 }}>
                        {categories.find(c => c.id === activeCat)?.name || 'All Tools'}
                        <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px', fontWeight: 400 }}>({filteredTools.length} items)</span>
                    </h2>
                </div>

                {/* TOOLS GRID (Bento Style) */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '20px'
                }}>
                    {filteredTools.map(tool => (
                        <div
                            key={tool.id}
                            onClick={() => handleToolClick(tool)}
                            className="bento-card"
                            style={{
                                background: '#232433', borderRadius: '24px', padding: '24px',
                                border: '1px solid transparent', cursor: 'pointer', transition: 'all 0.2s',
                                display: 'flex', flexDirection: 'column', gap: '15px', position: 'relative', overflow: 'hidden'
                            }}
                        >
                            {/* Hover Hover Effect implemented via CSS class usually, simulating here with inline fallback */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '14px',
                                    background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '20px', color: '#fff'
                                }}>
                                    {/* Usually we use Lucide here, but tool.icon is a string name. 
                                        For Beta demo, we'll use a generic icon if dynamic mapping is complex, 
                                        or try to map broadly. */}
                                    <div className={`lucide-${tool.icon}`} /> ⚡
                                </div>
                                <div style={{
                                    padding: '5px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 700,
                                    background: tool.status === 'new' ? '#00E096' : 'rgba(255,255,255,0.05)',
                                    color: tool.status === 'new' ? '#000' : '#666'
                                }}>
                                    {tool.status === 'new' ? 'NEW' : tool.cat}
                                </div>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '5px' }}>{tool.title}</h3>
                                <p style={{ fontSize: '12px', color: '#8890AA', lineHeight: '1.4' }}>{tool.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </main>

            {/* Modal */}
            <Modal
                isOpen={!!activeTool}
                onClose={() => setActiveTool(null)}
                title={activeTool?.title || ''}
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
            `}</style>
        </div>
    );
}
