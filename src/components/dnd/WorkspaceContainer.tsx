"use client";
import React, { useEffect, useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy
} from '@dnd-kit/sortable';
import { DraggableWindow } from './DraggableWindow';
import { Calculator, FileText, Zap, Cloud } from 'lucide-react';
import { useSession } from '@/hooks/useSession';

// Define Tool Types to avoid storing ReactNodes in localStorage
type ToolType = 'vat-calculator' | 'word-counter' | 'notes';

interface WindowData {
    id: string;
    title: string;
    type: ToolType;
}

export const WorkspaceContainer = () => {
    // Persistent State for Window Order
    const [windows, setWindows] = useSession<WindowData[]>('workspace_windows', [
        { id: '1', title: 'حاسبة القيمة المضافة', type: 'vat-calculator' },
        { id: '2', title: 'عداد الكلمات', type: 'word-counter' },
        { id: '3', title: 'ملاحظات سريعة', type: 'notes' },
    ]);

    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setWindows((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
            setLastSaved(new Date());
        }
    };

    const renderContent = (type: ToolType) => {
        switch (type) {
            case 'vat-calculator':
                return (
                    <div className="space-y-4 text-center">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-brand-primary">
                            <Calculator className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                            <input className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs text-white text-right" placeholder="المبلغ..." />
                            <button className="w-full bg-brand-primary text-white text-xs font-bold py-2 rounded-lg">احسب</button>
                        </div>
                    </div>
                );
            case 'word-counter':
                return (
                    <div className="space-y-4 text-center">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
                            <FileText className="w-6 h-6" />
                        </div>
                        <textarea
                            className="w-full h-24 bg-white/5 border border-white/5 rounded-lg p-3 text-xs text-white resize-none"
                            placeholder="أدخل النص هنا..."
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                            <span>الكلمات: 0</span>
                            <span>الأحرف: 0</span>
                        </div>
                    </div>
                );
            case 'notes':
                return (
                    <div className="space-y-4 text-center">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-orange-400">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-200 text-xs leading-relaxed text-right">
                            لا تنسى مراجعة تقرير الأداء الشهري قبل الاجتماع.
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="flex justify-between items-center mb-4 px-2">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-white to-slate-400">مساحة عملي</h2>
                <span className="flex items-center gap-2 text-[10px] bg-brand-primary/10 text-brand-primary px-3 py-1.5 rounded-full font-bold border border-brand-primary/20">
                    <Cloud className="w-3 h-3" />
                    {lastSaved ? 'تم الحفظ الآن' : 'التخزين السحابي مفعل'}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 min-h-[600px] border border-white/5 bg-white/[0.02] rounded-[32px] relative">
                <SortableContext items={windows} strategy={rectSortingStrategy}>
                    {windows.map((win) => (
                        <DraggableWindow key={win.id} id={win.id} title={win.title}>
                            {renderContent(win.type)}
                        </DraggableWindow>
                    ))}
                </SortableContext>

                {/* Add New Placeholder */}
                <button className="border-2 border-dashed border-white/5 rounded-[24px] flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-white hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all min-h-[250px] group">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-2xl font-light">+</span>
                    </div>
                    <span className="text-sm font-bold">إضافة نافذة جديدة</span>
                </button>
            </div>
        </DndContext>
    );
};
