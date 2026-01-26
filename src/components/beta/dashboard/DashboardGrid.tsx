"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Settings2, Check } from 'lucide-react';
import { WIDGET_REGISTRY } from './WidgetRegistry';
import WidgetCard from './WidgetCard';
import AddWidgetModal from './AddWidgetModal';

// --- Storage Key ---
const STORAGE_KEY = 'bento_layout_v2';

interface WidgetItem {
    id: string;
    size: 'sm' | 'md' | 'lg';
}

// --- Default Layout ---
const DEFAULT_LAYOUT: WidgetItem[] = [
    { id: 'welcome', size: 'md' },  // 2 col
    { id: 'time', size: 'sm' },     // 1 col
    { id: 'date', size: 'sm' },     // 1 col
    { id: 'weather', size: 'sm' },  // 1 col
    { id: 'gold', size: 'sm' },     // 1 col
    { id: 'events', size: 'md' },   // 2 col
];

export default function DashboardGrid() {
    const [widgets, setWidgets] = useState<WidgetItem[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // --- 1. Load / Save Logic ---
    useEffect(() => {
        // Load from LocalStorage
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setWidgets(parsed);
                } catch (e) {
                    console.error("Failed to parse saved layout", e);
                    setWidgets(DEFAULT_LAYOUT);
                }
            } else {
                setWidgets(DEFAULT_LAYOUT);
            }
            setIsLoaded(true);
        }
    }, []);

    const saveLayout = (newWidgets: WidgetItem[]) => {
        setWidgets(newWidgets);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newWidgets));
    };

    // --- 2. Action Handlers ---
    const handleAddWidget = (id: string) => {
        const def = WIDGET_REGISTRY[id];
        if (!def) return;

        const newWidget: WidgetItem = { id, size: def.defaultSize };
        const newLayout = [...widgets, newWidget];
        saveLayout(newLayout);
        setIsAddModalOpen(false);
    };

    const handleDeleteWidget = (id: string) => {
        const newLayout = widgets.filter(w => w.id !== id);
        saveLayout(newLayout);
    };

    // --- 3. Drag & Drop Logic (Native HTML5) ---
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const handleDragStart = (e: React.DragEvent, position: number) => {
        dragItem.current = position;
        e.currentTarget.classList.add('grabbing');
    };

    const handleDragEnter = (e: React.DragEvent, position: number) => {
        dragOverItem.current = position;
    };

    const handleDragEnd = (e: React.DragEvent) => {
        e.currentTarget.classList.remove('grabbing');
        if (dragItem.current !== null && dragOverItem.current !== null) {
            const copy = [...widgets];
            const dragContent = copy[dragItem.current];
            copy.splice(dragItem.current, 1);
            copy.splice(dragOverItem.current, 0, dragContent);
            saveLayout(copy);
        }
        dragItem.current = null;
        dragOverItem.current = null;
    };

    if (!isLoaded) return null; // Avoid hydration mismatch

    return (
        <section className="dashboard-section">
            {/* Header Controls */}
            <div className="dashboard-header mb-8 flex flex-row justify-between items-end w-full relative z-10" dir="rtl">
                <div className="flex items-center gap-6 w-full">
                    <div>
                        <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                            <span className="text-transparent bg-clip-text bg-gradient-to-l from-white to-white/60">
                                الرئيسية
                            </span>
                            <span className="bg-[#D35BFF] text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider transform translate-y-1">
                                BETA
                            </span>
                        </h1>
                        <p className="text-gray-400 font-medium text-lg">
                            {editMode ? 'قم بترتيب أدواتك المفضلة' : 'كل أدواتك في مكان واحد'}
                        </p>
                    </div>

                    <div className="flex gap-3 shrink-0 mr-auto">
                        {editMode ? (
                            <div className="flex items-center gap-2 bg-[#232433] p-1 rounded-full border border-white/5 shadow-lg animate-in fade-in zoom-in duration-200">
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="control-btn add-btn"
                                >
                                    <Plus size={16} /> إضافة
                                </button>
                                <button
                                    onClick={() => setEditMode(false)}
                                    className="control-btn done-btn"
                                >
                                    <Check size={16} /> حفظ
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setEditMode(true)}
                                className="customize-btn"
                                title="تخصيص الواجهة"
                            >
                                <Settings2 size={18} />
                            </button>
                        )}
                    </div>
                </div>


            </div>

            {/* Grid Container */}
            <div className="dashboard-grid">
                {widgets.map((item, index) => {
                    const def = WIDGET_REGISTRY[item.id];
                    if (!def) return null;
                    const Component = def.component;

                    return (
                        <WidgetCard
                            key={`${item.id}-${index}`}
                            id={item.id}
                            size={item.size}
                            editMode={editMode}
                            gradient={def.gradient}
                            onDelete={() => handleDeleteWidget(item.id)}

                            // Drag Props
                            draggable={editMode}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnter={(e) => handleDragEnter(e, index)}
                            onDragOver={(e) => e.preventDefault()} // Necessary for Drop
                            onDrop={handleDragEnd}
                        >
                            <Component />
                        </WidgetCard>
                    );
                })}

                {/* Empty State / Add CTA in Grid if empty */}
                {widgets.length === 0 && (
                    <div
                        className="empty-grid-placeholder"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <Plus size={32} className="mb-2 opacity-50" />
                        <p>اضغط لإضافة ويدجت</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            <AddWidgetModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                currentWidgetIds={widgets.map(w => w.id)}
                onAdd={handleAddWidget}
            />

            <style jsx>{`
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr); /* Desktop: 4 cols */
                    gap: 18px;
                    width: 100%;
                }

                /* Tablet: 2 Cols */
                @media (max-width: 1100px) {
                    .dashboard-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                /* Mobile: 1 Col */
                @media (max-width: 650px) {
                    .dashboard-grid {
                        grid-template-columns: 1fr;
                    }
                }

                .control-btn {
                    display: flex; align-items: center; gap: 8px;
                    padding: 8px 16px; border-radius: 50px;
                    font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: 0.2s;
                }
                
                .edit-btn { background: rgba(255,255,255,0.05); color: #8890AA; }
                .edit-btn:hover { background: rgba(255,255,255,0.1); color: white; }
                
                
                .customize-btn {
                    width: 40px; height: 40px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    color: #8890AA;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .customize-btn:hover {
                    background: #6D4CFF; color: white;
                    transform: rotate(90deg);
                    box-shadow: 0 0 15px rgba(109, 76, 255, 0.5);
                }

                .done-btn { background: #00E096; color: black; padding: 6px 16px; border-radius: 20px;}
                .done-btn:hover { background: #00bf80; transform: scale(1.05); }
                
                .add-btn { background: #6D4CFF; color: white; padding: 6px 16px; border-radius: 20px;}
                .add-btn:hover { background: #5b3fd9; transform: scale(1.05); }

                .empty-grid-placeholder {
                    grid-column: 1 / -1;
                    height: 200px;
                    border: 2px dashed rgba(255,255,255,0.1);
                    border-radius: 24px;
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    color: #8890AA; cursor: pointer; transition: 0.2s;
                }
                .empty-grid-placeholder:hover {
                    border-color: #6D4CFF; color: #6D4CFF; background: rgba(109,76,255,0.05);
                }
                
                /* Animations */
                .dashboard-grid > div {
                    animation: fadeIn 0.4s ease-out backwards;
                }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </section>
    );
}
