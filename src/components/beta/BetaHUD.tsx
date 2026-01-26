"use client";
import React, { useState, useEffect, useRef } from 'react';
import {
    LayoutGrid, Clock as ClockIcon, Plus, Trash2,
    GripVertical, CloudSun, TrendingUp, Quote,
    Sparkles, Droplets, Cpu, Languages, CalendarHeart
} from 'lucide-react';
import { tools, Tool, categories } from '@/data/tools';

// New Widget Components
import WeatherWidget from './widgets/Weather';
import FinanceWidget from './widgets/Finance';
import InspirationWidget from './widgets/Inspiration';
import Vision2030Widget from './widgets/Vision2030';
import HealthWidget from './widgets/Health';
import TechTrendsWidget from './widgets/TechTrends';
import EnglishLearningWidget from './widgets/EnglishLearning';

// Standardized Metadata for all bento widgets
const ALL_WIDGETS = [
    { id: 'saudi-events', name: 'المناسبات السعودية', icon: CalendarHeart, color: 'rgba(56, 189, 248, 0.4)' },
    { id: 'weather', name: 'الطقس (الرياض)', icon: CloudSun, color: 'rgba(245, 158, 11, 0.3)' },
    { id: 'finance', name: 'المالية والذهب', icon: TrendingUp, color: 'rgba(16, 185, 129, 0.3)' },
    { id: 'inspiration', name: 'إلهام اليوم', icon: Quote, color: 'rgba(99, 102, 241, 0.3)' },
    { id: 'vision', name: 'رؤية 2030', icon: Sparkles, color: 'rgba(5, 150, 105, 0.3)' },
    { id: 'health', name: 'الصحة والنشاط', icon: Droplets, color: 'rgba(59, 130, 246, 0.3)' },
    { id: 'tech', name: 'أخبار التقنية', icon: Cpu, color: 'rgba(217, 70, 239, 0.3)' },
    { id: 'english', name: 'تعلم الإنجليزية', icon: Languages, color: 'rgba(244, 63, 94, 0.3)' },
];

export default function BetaHUD({ onExplore, onSelectTool }: { onExplore: () => void, onSelectTool: (tool: Tool) => void }) {
    const [time, setTime] = useState(new Date());
    const [greeting, setGreeting] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [widgetOrder, setWidgetOrder] = useState<string[]>(['saudi-events', 'weather', 'finance']);

    // Drag State
    const draggedItem = useRef<string | null>(null);
    const dragOverItem = useRef<string | null>(null);

    useEffect(() => {
        // Hydration & Persistence
        const savedOrder = localStorage.getItem('ri88_hud_order_v4');
        if (savedOrder) {
            try {
                const parsed = JSON.parse(savedOrder);
                if (Array.isArray(parsed) && parsed.length > 0) setWidgetOrder(parsed);
            } catch (e) { console.error(e); }
        }

        // Time & Greeting
        const timer = setInterval(() => setTime(new Date()), 1000);
        const updateGreeting = () => {
            const h = new Date().getHours();
            setGreeting(h < 12 ? 'صباح الخير، مبدع ☀️' : h < 18 ? 'مساؤك سعيد 🌤️' : 'مساء الخير ✨');
        };
        updateGreeting();

        return () => clearInterval(timer);
    }, []);

    const saveOrder = (newOrder: string[]) => {
        setWidgetOrder(newOrder);
        localStorage.setItem('ri88_hud_order_v4', JSON.stringify(newOrder));
    };

    const addWidget = (id: string) => {
        if (!widgetOrder.includes(id)) {
            const newOrder = [...widgetOrder, id];
            saveOrder(newOrder);
            setIsAddModalOpen(false);
        }
    };

    const removeWidget = (id: string) => {
        const newOrder = widgetOrder.filter(w => w !== id);
        saveOrder(newOrder);
    };

    // DND Logic
    const handleDragStart = (e: React.DragEvent, id: string) => {
        draggedItem.current = id;
        e.dataTransfer.effectAllowed = "move";
        (e.currentTarget as HTMLElement).style.opacity = '0.5';
    };
    const handleDragEnd = (e: React.DragEvent) => {
        draggedItem.current = null;
        dragOverItem.current = null;
        (e.currentTarget as HTMLElement).style.opacity = '1';
    };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const d = draggedItem.current;
        const o = dragOverItem.current;
        if (d && o && d !== o) {
            const newOrder = [...widgetOrder];
            const dIdx = newOrder.indexOf(d);
            const oIdx = newOrder.indexOf(o);
            newOrder.splice(dIdx, 1);
            newOrder.splice(oIdx, 0, d);
            saveOrder(newOrder);
        }
    };

    // Formatters
    const formatDate = (date: Date) => new Intl.DateTimeFormat('ar-SA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    const formatTime = (date: Date) => new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(date);

    const renderWidgetContent = (id: string) => {
        switch (id) {
            case 'saudi-events':
                const tool = tools.find(t => t.id === 'saudi-events') || tools[0];
                return (
                    <div className="tool-content" onClick={() => onSelectTool(tool)}>
                        <div className="tool-icon" style={{ borderColor: 'rgba(56, 189, 248, 0.2)' }}>
                            <CalendarHeart size={24} color="#38bdf8" />
                        </div>
                        <div>
                            <h4>{tool.titleAr}</h4>
                            <p>{tool.descAr}</p>
                        </div>
                    </div>
                );
            case 'weather': return <WeatherWidget />;
            case 'finance': return <FinanceWidget />;
            case 'inspiration': return <InspirationWidget />;
            case 'vision': return <Vision2030Widget />;
            case 'health': return <HealthWidget />;
            case 'tech': return <TechTrendsWidget />;
            case 'english': return <EnglishLearningWidget />;
            default: return null;
        }
    };

    const renderWidget = (id: string) => {
        const meta = ALL_WIDGETS.find(w => w.id === id);
        if (!meta) return null;

        return (
            <div
                key={id}
                className="hud-card bento-card draggable-item"
                draggable
                onDragStart={(e) => handleDragStart(e, id)}
                onDragEnter={() => dragOverItem.current = id}
                onDragOver={(e) => e.preventDefault()}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
            >
                <div className="card-bg-glow" style={{ background: `radial-gradient(circle at top right, ${meta.color}, transparent 70%)` }} />

                <div className="beta-hud-controls">
                    <button className="beta-hud-btn remove" onClick={() => removeWidget(id)}>
                        <Trash2 size={14} />
                    </button>
                    <div className="beta-hud-btn drag"><GripVertical size={14} /></div>
                </div>

                <div className="card-header-row">
                    <span className="card-tag" style={{ background: meta.color.replace('0.3', '0.8').replace('0.4', '0.8') }}>
                        {meta.name}
                    </span>
                </div>

                {renderWidgetContent(id)}
            </div>
        );
    };

    const availableToAdd = ALL_WIDGETS.filter(w => !widgetOrder.includes(w.id));

    return (
        <div className="hud-container fade-in">
            {/* Header */}
            <header className="hud-header">
                <div>
                    <h1 className="hud-greeting">
                        {greeting}
                        <span className="text-xs font-mono bg-white/10 border border-white/10 px-2 py-0.5 rounded-full mr-2 align-middle opacity-50">BENTO v2</span>
                    </h1>
                    <p className="hud-date">{formatDate(time)}</p>
                </div>
                <div className="hud-clock">
                    <ClockIcon size={16} className="pulse-icon" />
                    <span>{formatTime(time)}</span>
                </div>
            </header>

            {/* Dashboard Area */}
            <div className="hud-dashboard-box fade-in-up">
                <div className="hud-grid">
                    {widgetOrder.map(id => renderWidget(id))}

                    {/* Highly Specific Luxury Add Button */}
                    <div className="add-wrapper">
                        <div className="add-dashed-frame">
                            <button
                                className={`add-card-inner ${isAddModalOpen ? 'active' : ''}`}
                                onClick={() => setIsAddModalOpen(!isAddModalOpen)}
                            >
                                <div className="card-bg-glow" style={{ background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.1), transparent 70%)' }} />

                                <div className="add-plus-circle">
                                    <Plus size={20} strokeWidth={2.5} />
                                </div>
                                <span className="add-text">تخصيص اللوحة</span>
                            </button>
                        </div>

                        {isAddModalOpen && (
                            <div className="add-menu fade-in-up">
                                {availableToAdd.length === 0 ? (
                                    <div className="empty-msg">كل الأدوات مضافة ✨</div>
                                ) : (
                                    availableToAdd.map(w => (
                                        <button key={w.id} className="add-item" onClick={() => addWidget(w.id)}>
                                            <div className="add-item-icon" style={{ background: w.color, borderRadius: '8px', padding: '6px' }}>
                                                <w.icon size={14} />
                                            </div>
                                            <span>{w.name}</span>
                                            <Plus size={14} className="plus-mini" />
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .beta-hud-controls {
                    position: absolute; top: 15px; left: 15px; right: 15px;
                    display: flex; justify-content: space-between; align-items: center;
                    z-index: 50; opacity: 0; transition: all 0.3s ease;
                }
                .hud-card:hover .beta-hud-controls { opacity: 1; }

                .beta-hud-btn {
                    width: 28px; height: 28px; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(4px);
                    color: rgba(255, 255, 255, 0.6); border: 1px solid rgba(255,255,255,0.1);
                    cursor: pointer; transition: all 0.2s;
                }
                .beta-hud-btn.remove:hover { background: #ef4444; color: white; }
                .beta-hud-btn.drag { cursor: grab; }
            `}</style>

            <style jsx>{`
                .hud-container { padding: 30px 0; color: white; animation: fadeIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); max-width: 1200px; margin: 0 auto; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .fade-in-up { animation: fadeInUp 0.4s ease-out; }
                
                .hud-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 25px; padding: 0 10px; }
                .hud-greeting { font-size: 32px; font-weight: 800; background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 5px; }
                .hud-date { color: #94a3b8; font-size: 14px; }
                
                .hud-clock {
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
                    padding: 8px 16px; border-radius: 100px;
                    display: flex; align-items: center; gap: 10px;
                    font-family: monospace; font-size: 16px;
                }
                .pulse-icon { color: #818cf8; animation: pulse 2s infinite; }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

                /* Dashboard Box - Luxury Deep Navy */
                .hud-dashboard-box {
                    background: #020617; /* Deepest Navy/Black */
                    border: 1px solid rgba(255, 255, 255, 0.03);
                    border-radius: 40px;
                    padding: 40px;
                    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                    box-shadow: 
                        0 25px 50px -12px rgba(0, 0, 0, 0.5),
                        inset 0 1px 1px rgba(255,255,255,0.02);
                }

                .hud-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; width: 100%; direction: rtl; }
                @media (max-width: 768px) { .hud-grid { grid-template-columns: 1fr; } }

                .hud-card {
                    position: relative; height: 160px; border-radius: 20px; padding: 20px;
                    display: flex; flex-direction: column; justify-content: space-between;
                    overflow: hidden; 
                    /* High-Visibility Card Style */
                    background: rgba(30, 41, 59, 0.7); /* Much more opaque */
                    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
                    border: 2px solid rgba(255, 255, 255, 0.15); /* Thicker, brighter border */
                    box-shadow: 
                        0 10px 15px -3px rgba(0, 0, 0, 0.4),
                        0 4px 6px -2px rgba(0, 0, 0, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1); /* Inner top glow */
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .hud-card:hover { 
                    transform: translateY(-5px); 
                    border-color: rgba(99, 102, 241, 0.4); /* Indigo glow on hover */
                    background: #1f2937;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3); 
                }

                .card-bg-glow { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; opacity: 0.2; mix-blend-mode: screen; transition: opacity 0.3s; }
                .hud-card:hover .card-bg-glow { opacity: 0.4; }

                .card-header-row { display: flex; align-items: center; gap: 8px; position: relative; z-index: 2; }
                .card-tag { font-size: 10px; color: white; padding: 2px 10px; border-radius: 100px; font-weight: 700; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
                
                :global(.tool-content) { display: flex; align-items: center; gap: 12px; margin-top: auto; position: relative; z-index: 2; cursor: pointer; }
                :global(.tool-icon) { 
                    width: 40px; height: 40px; background: rgba(255,255,255,0.03); 
                    border-radius: 12px; display: flex; align-items: center; justify-content: center; 
                    border: 1px solid rgba(255,255,255,0.08);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                :global(.tool-content h4) { font-size: 14px; margin-bottom: 2px; color: white; font-weight: 700; }
                :global(.tool-content p) { font-size: 11px; color: #94a3b8; opacity: 1; line-height: 1.3; font-weight: 500; }

                .add-wrapper { position: relative; height: 180px; }
                .add-dashed-frame {
                    height: 100%; width: 100%; padding: 10px;
                    border: 1px dashed rgba(71, 85, 105, 0.4); /* Bluish-gray dashed */
                    border-radius: 32px;
                    display: flex; align-items: center; justify-content: center;
                    transition: border-color 0.3s;
                }
                .add-wrapper:hover .add-dashed-frame { border-color: rgba(99, 102, 241, 0.3); }

                .add-card-inner {
                    width: 100%; height: 100%; border-radius: 24px;
                    background: #020617; /* Darker than background */
                    border: 1px solid rgba(255,255,255,0.03);
                    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;
                    cursor: pointer; position: relative; overflow: hidden;
                    box-shadow: 
                        0 4px 15px rgba(0,0,0,0.5),
                        inset 0 1px 1px rgba(255,255,255,0.02);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .add-card-inner:hover, .add-card-inner.active { 
                    transform: scale(0.98); background: #0f172a; border-color: rgba(255,255,255,0.08);
                    box-shadow: 0 0 20px rgba(0,0,0,0.4);
                }

                .add-plus-circle {
                    width: 38px; height: 38px; border-radius: 50%;
                    background: #0f172a; border: 1px solid rgba(255,255,255,0.05);
                    display: flex; align-items: center; justify-content: center;
                    color: #94a3b8; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    transition: all 0.3s;
                }
                .add-card-inner:hover .add-plus-circle { background: #1e293b; color: white; transform: scale(1.1); box-shadow: 0 0 15px rgba(99, 102, 241, 0.2); }
                
                .add-text { color: #64748b; font-size: 14px; font-weight: 700; font-family: 'Inter', sans-serif; }
                .add-card-inner:hover .add-text { color: #94a3b8; }
                
                .add-menu {
                    position: absolute; top: calc(100% + 10px); left: 0; right: 0; z-index: 100;
                    background: #020617; border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 20px; padding: 12px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
                    width: 240px; backdrop-filter: blur(20px);
                }
                .add-item {
                    display: flex; align-items: center; gap: 12px; width: 100%;
                    padding: 10px; background: transparent; border: none; color: #64748b;
                    cursor: pointer; border-radius: 12px; text-align: right; font-size: 13px;
                    transition: all 0.2s;
                }
                .add-item:hover { background: rgba(255,255,255,0.03); color: white; padding-right: 15px; }
                .plus-mini { margin-right: auto; color: #6366f1; opacity: 0; transition: 0.2s; }
                .add-item:hover .plus-mini { opacity: 1; }
            `}</style>
        </div>
    );
}

