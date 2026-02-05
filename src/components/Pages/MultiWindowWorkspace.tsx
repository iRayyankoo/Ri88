"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Maximize2,
    Minus,
    Layers,
    Plus,
    Zap,
    MousePointer2
} from 'lucide-react';

import ToolRouter from '@/components/tools/ToolRouter';
import { tools } from '@/data/tools';
import { useNavigation } from '@/context/NavigationContext';

interface Window {
    id: string;
    toolId?: string; // Added toolId to track which tool is active
    title: string;
    x: number;
    y: number;
    isOpen: boolean;
    isMaximized: boolean;
}

const MultiWindowWorkspace = () => {
    const { activeToolId } = useNavigation();
    const [windows, setWindows] = useState<Window[]>([
        { id: '1', toolId: 'vat-calc', title: 'حاسبة الضريبة', x: 50, y: 50, isOpen: true, isMaximized: false },
        { id: '2', toolId: 'currency', title: 'محول العملات', x: 400, y: 150, isOpen: true, isMaximized: false },
    ]);

    // Handle external tool launch requests
    React.useEffect(() => {
        if (activeToolId) {
            const tool = tools.find(t => t.id === activeToolId);
            if (tool) {
                // Check if already open
                const existing = windows.find(w => w.toolId === activeToolId); // Check by toolId instead of title
                if (!existing) {
                    setWindows(prev => [...prev, {
                        id: Date.now().toString(),
                        toolId: tool.id,
                        title: tool.titleAr || tool.title,
                        x: 150 + (prev.length * 30),
                        y: 150 + (prev.length * 30),
                        isOpen: true,
                        isMaximized: false
                    }]);
                }
            }
        }
    }, [activeToolId]);

    const closeWindow = (id: string) => {
        setWindows(windows.filter(w => w.id !== id));
    };

    const toggleMaximize = (id: string) => {
        setWindows(windows.map(w =>
            w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
        ));
    };

    const addWindow = () => {
        const newId = (windows.length + 1).toString();
        // Randomly pick a tool for the "New Window" button for demo purposes, or just a generic empty one
        // For now, let's keep it generic but maybe default to a simple calculator if available
        setWindows([...windows, {
            id: newId,
            toolId: 'timer', // Default to timer for manual "Add Window"
            title: `أداة جديدة ${newId}`,
            x: 100 + (windows.length * 40),
            y: 100 + (windows.length * 40),
            isOpen: true,
            isMaximized: false
        }]);
    };

    return (
        <div className="relative h-[80vh] w-full bg-black/20 rounded-[40px] border border-white/5 overflow-hidden p-8">

            {/* BACKGROUND MESH */}
            <div className="absolute inset-0 hero-mesh-bg opacity-10 pointer-events-none" />

            {/* WORKSPACE HEADER */}
            <div className="relative z-10 flex items-center justify-between mb-8">
                <div className="text-right">
                    <h2 className="text-2xl font-black text-white">مساحة العمل المتعددة</h2>
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2 justify-end">
                        نظام النوافذ الذكي
                        <Layers className="w-3 h-3 text-brand-primary" />
                    </p>
                </div>

                <button
                    onClick={addWindow}
                    className="bg-brand-primary hover:bg-brand-primary/90 text-white font-black px-6 py-3 rounded-xl transition-all shadow-xl shadow-brand-primary/30 flex items-center gap-2 text-xs"
                >
                    <Plus className="w-4 h-4" />
                    فتح نافذة جديدة
                </button>
            </div>

            {/* WINDOW AREA */}
            <div className="relative h-full w-full">
                <AnimatePresence>
                    {windows.map((win) => {
                        const toolData = tools.find(t => t.id === win.toolId);
                        return (
                            <motion.div
                                key={win.id}
                                drag={!win.isMaximized}
                                dragMomentum={false}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                    width: win.isMaximized ? '100%' : '500px', // Increased default width
                                    height: win.isMaximized ? '100%' : 'auto', // Auto height for content
                                    top: win.isMaximized ? 0 : win.y,
                                    right: win.isMaximized ? 0 : win.x,
                                    zIndex: win.isMaximized ? 50 : 10
                                }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className={`absolute glass-card border-white/10 overflow-hidden flex flex-col shadow-2xl ${win.isMaximized ? 'rounded-none' : 'rounded-3xl'
                                    }`}
                                style={{ minHeight: '400px' }}
                            >
                                {/* Window Header */}
                                <div className="bg-white/5 border-b border-white/5 px-4 py-3 flex items-center justify-between flex-row-reverse cursor-grab active:cursor-grabbing">
                                    <div className="flex items-center gap-2 flex-row-reverse">
                                        <div className="w-6 h-6 bg-brand-primary/20 rounded-lg flex items-center justify-center text-brand-primary">
                                            <Zap className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-sm font-bold text-white">{win.title}</span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => closeWindow(win.id)}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-500 transition-all"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => toggleMaximize(win.id)}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-brand-secondary/20 text-slate-500 hover:text-brand-secondary transition-all"
                                        >
                                            <Maximize2 className="w-4 h-4" />
                                        </button>
                                        <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-all">
                                            <Minus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Window Content - Render ToolRouter */}
                                <div className="flex-1 overflow-auto bg-black/20 custom-scrollbar relative p-4" dir="rtl">
                                    {toolData ? (
                                        <ToolRouter tool={toolData} />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
                                            <MousePointer2 className="w-8 h-8 opacity-50" />
                                            <p>اختر أداة من القائمة..</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

        </div>
    );
};

export default MultiWindowWorkspace;
