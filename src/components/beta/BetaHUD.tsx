"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";
import {
    LayoutGrid, Clock as ClockIcon, Plus, Trash2,
    GripVertical, CloudSun, TrendingUp, Quote,
    Sparkles, Droplets, Cpu, Languages, CalendarHeart,
    CalendarDays, User, Edit3, Check, X as XIcon, Lock
} from 'lucide-react';
import { tools, Tool } from '@/data/tools';

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
    // Header Widgets (New)
    { id: 'header-welcome', name: 'الترحيب', icon: User, color: 'rgba(99, 102, 241, 0.4)', size: 'medium' }, // 2 Cols
    { id: 'header-clock', name: 'الساعة', icon: ClockIcon, color: 'rgba(236, 72, 153, 0.4)', size: 'small' }, // 1 Col
    { id: 'header-date', name: 'التاريخ', icon: CalendarDays, color: 'rgba(168, 85, 247, 0.4)', size: 'small' }, // 1 Col

    // Existing Widgets
    { id: 'saudi-events', name: 'المناسبات السعودية', icon: CalendarHeart, color: 'rgba(56, 189, 248, 0.4)', size: 'small' },
    { id: 'weather', name: 'الطقس (الرياض)', icon: CloudSun, color: 'rgba(245, 158, 11, 0.3)', size: 'small' },
    { id: 'finance', name: 'المالية والذهب', icon: TrendingUp, color: 'rgba(16, 185, 129, 0.3)', size: 'small' },
    { id: 'inspiration', name: 'إلهام اليوم', icon: Quote, color: 'rgba(99, 102, 241, 0.3)', size: 'medium' }, // Wide
    { id: 'vision', name: 'رؤية 2030', icon: Sparkles, color: 'rgba(5, 150, 105, 0.3)', size: 'medium' }, // Wide
    { id: 'health', name: 'الصحة والنشاط', icon: Droplets, color: 'rgba(59, 130, 246, 0.3)', size: 'small' },
    { id: 'tech', name: 'أخبار التقنية', icon: Cpu, color: 'rgba(217, 70, 239, 0.3)', size: 'small' },
    { id: 'english', name: 'تعلم الإنجليزية', icon: Languages, color: 'rgba(244, 63, 94, 0.3)', size: 'small' },
];

export default function BetaHUD({ onSelectTool }: { onSelectTool: (tool: Tool) => void }) {
    const [time, setTime] = useState(new Date());
    const [greeting, setGreeting] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // Default order now includes header widgets
    const [widgetOrder, setWidgetOrder] = useState<string[]>(['header-welcome', 'header-clock', 'header-date', 'saudi-events', 'weather', 'finance']);

    // Drag State
    const draggedItem = useRef<string | null>(null);
    const dragOverItem = useRef<string | null>(null);

    const { data: session } = useSession();

    useEffect(() => {
        // Only load from storage if logged in
        if (session?.user) {
            const savedOrder = localStorage.getItem('ri88_hud_order_v4');
            if (savedOrder) {
                try {
                    const parsed = JSON.parse(savedOrder);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        // Defer to avoid synchronous render warning
                        setTimeout(() => setWidgetOrder(parsed), 0);
                    }
                } catch (e) { console.error(e); }
            }
        }

        // Time & Greeting
        const timer = setInterval(() => setTime(new Date()), 1000);
        const updateGreeting = () => {
            const h = new Date().getHours();
            setGreeting(h < 12 ? 'صباح الخير، مبدع ☀️' : h < 18 ? 'مساؤك سعيد 🌤️' : 'مساء الخير ✨');
        };
        updateGreeting();

        return () => clearInterval(timer);
    }, [session]); // dependency on session ensures it runs when auth loads

    const saveOrder = (newOrder: string[]) => {
        setWidgetOrder(newOrder);
        // Only save to storage if logged in
        if (session?.user) {
            localStorage.setItem('ri88_hud_order_v4', JSON.stringify(newOrder));
        }
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
            case 'header-welcome':
                return (
                    <div className="tool-content column-start">
                        <div className="flex-between w-full">
                            <h2 className="text-xl font-bold text-gradient">{greeting}</h2>
                            <span className="badge-v2">BENTO v2</span>
                        </div>
                        <p className="text-sm opacity-70 mt-2">نتمنى لك يوماً إنتاجياً سعيداً ✨</p>
                    </div>
                );
            case 'header-clock':
                return (
                    <div className="tool-content center-content">
                        <div className="clock-huge">{formatTime(time)}</div>
                        <div className="text-xs opacity-50 mt-1">توقيت الرياض</div>
                    </div>
                );
            case 'header-date':
                return (
                    <div className="tool-content center-content">
                        <div className="date-huge">{time.getDate()}</div>
                        <div className="text-sm opacity-70">{time.toLocaleDateString('ar-SA', { month: 'long', weekday: 'long' })}</div>
                    </div>
                );
            case 'saudi-events':
                const tool = tools.find(t => t.id === 'saudi-events') || tools[0];
                return (
                    <div className="tool-content" onClick={() => onSelectTool(tool)}>
                        <div className="tool-icon saudi-events-icon">
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
                className={`hud-card bento-card ${meta.size === 'medium' ? 'span-2' : 'span-1'} ${isEditMode ? 'draggable-item wiggle-mode' : ''}`}
                draggable={isEditMode}
                onDragStart={(e) => isEditMode && handleDragStart(e, id)}
                onDragEnter={() => isEditMode && (dragOverItem.current = id)}
                onDragOver={(e) => isEditMode && e.preventDefault()}
                onDragEnd={isEditMode ? handleDragEnd : undefined}
                onDrop={isEditMode ? handleDrop : undefined}
            >
                <div className={`card-bg-glow widget-glow-${id}`} />

                {/* Edit Controls Overlay */}
                {isEditMode && (
                    <div className="beta-hud-controls fade-in">
                        <button className="beta-hud-btn remove" onClick={() => removeWidget(id)} title="حذف" aria-label="Remove Widget">
                            <XIcon size={14} />
                        </button>
                        <div className="beta-hud-btn drag" title="اسحب للترتيب">
                            <GripVertical size={14} />
                        </div>
                    </div>
                )}

                <div className="card-header-row">
                    <span className={`card-tag widget-tag-${id}`}>
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
            {/* Dashboard Area (Grid ONLY) */}
            <div className="hud-dashboard-box fade-in-up">

                {/* Header Actions for Edit Mode */}
                <div className="dashboard-actions-row">
                    <button
                        onClick={() => setIsEditMode(!isEditMode)}
                        className={`action-pill-btn ${isEditMode ? 'active' : ''}`}
                    >
                        {isEditMode ? <Check size={16} /> : <Edit3 size={16} />}
                        <span>{isEditMode ? 'حفظ الترتيب' : 'تخصيص اللوحة'}</span>
                    </button>
                </div>

                <div className="hud-grid">
                    {widgetOrder.map(id => renderWidget(id))}

                    {/* Add Widget Card - Only visible in Edit Mode? Or always? User requested "Customize Board -> Edit Mode". 
                        We'll show it prominently in Edit Mode, or as a subtle option normally. 
                        Let's make it a proper grid card that appears at the end. 
                    */}

                    <div className="add-widget-card span-1">
                        <button
                            className={`add-card-inner ${isAddModalOpen ? 'active' : ''}`}
                            onClick={() => setIsAddModalOpen(!isAddModalOpen)}
                            aria-label="إضافة ويدجت"
                        >
                            <div className="add-icon-circle">
                                <Plus size={24} />
                            </div>
                            <span className="add-label">إضافة ويدجت</span>
                        </button>

                        {isAddModalOpen && (
                            <div className="add-menu-popover fade-in-up">
                                <div className="popover-header">
                                    <h4>الأدوات المتاحة</h4>
                                    <button onClick={() => setIsAddModalOpen(false)} aria-label="إغلاق"><XIcon size={14} /></button>
                                </div>
                                <div className="popover-grid">
                                    {availableToAdd.length === 0 ? (
                                        <div className="empty-msg">جميع الأدوات مضافة! 🎉</div>
                                    ) : (
                                        availableToAdd.map(w => (
                                            <button key={w.id} className="add-item-row" onClick={() => addWidget(w.id)}>
                                                <div className={`mini-icon widget-icon-${w.id}`}>
                                                    <w.icon size={14} />
                                                </div>
                                                <span>{w.name}</span>
                                                <Plus size={14} className="plus-mini" />
                                            </button>
                                        ))
                                    )}
                                </div>
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
                .saudi-events-icon { border-color: rgba(56, 189, 248, 0.2); }
                .add-item-icon { border-radius: 8px; padding: 6px; }
                
                /* Generated Widget Styles */
                ${ALL_WIDGETS.map(w => `
                    .widget-glow-${w.id} { background: radial-gradient(circle at top right, ${w.color}, transparent 70%); }
                    .widget-tag-${w.id} { background: ${w.color.replace('0.3', '0.8').replace('0.4', '0.8')}; }
                    .widget-icon-${w.id} { background: ${w.color}; }
                `).join('')}

                .span-2 { grid-column: span 2; }
                .span-1 { grid-column: span 1; }
                
                @media (max-width: 1024px) {
                    .span-2 { grid-column: span 1; } 
                }
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

                /* Helpers */
                .column-start { flex-direction: column; align-items: flex-start; justify-content: center; height: 100%; }
                .center-content { flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; }
                .flex-between { display: flex; justify-content: space-between; align-items: center; }
                .w-full { width: 100%; }
                
                .text-gradient { background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .badge-v2 { font-size: 10px; font-family: monospace; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); }
                
                .clock-huge { font-size: 32px; font-weight: 800; font-family: monospace; letter-spacing: -1px; color: white; }
                .date-huge { font-size: 42px; font-weight: 800; color: white; line-height: 1; }

                /* Dashboard Box */
                .hud-dashboard-box {
                    /* Removed dark background, grid handles layout directly? 
                       User asked for 'Inside the main large container'. 
                       We keep the box but remove internal padding differentiation if needed.
                    */
                    background: transparent; /* Clean look */
                    padding: 0;
                    border: none;
                    box-shadow: none;
                    backdrop-filter: none;
                }

                .hud-grid { 
                    display: grid; 
                    grid-template-columns: repeat(4, 1fr); 
                    gap: 20px; 
                    width: 100%; 
                    direction: rtl; 
                }
                @media (max-width: 1024px) { .hud-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 640px) { .hud-grid { grid-template-columns: 1fr; } }

                .hud-card {
                    position: relative; height: 180px; /* Taller for better info fit */
                    border-radius: 24px; /* User requested 24px */
                    padding: 18px; /* User requested 18px */
                    display: flex; flex-direction: column; justify-content: space-between;
                    overflow: hidden; 
                    background: rgba(30, 41, 59, 0.6);
                    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 
                        0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                        0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .hud-card:hover { 
                    transform: translateY(-4px); 
                    border-color: rgba(255, 255, 255, 0.2);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
                }

                .card-bg-glow { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; opacity: 0.2; mix-blend-mode: screen; transition: opacity 0.3s; }
                .card-bg-glow.default-glow { background: radial-gradient(circle at center, rgba(99, 102, 241, 0.1), transparent 70%); }
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

