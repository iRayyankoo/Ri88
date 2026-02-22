"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Maximize2, Minimize2 } from 'lucide-react';

import { useNavigation } from '@/context/NavigationContext';
import ToolWorkspace from './Pages/ToolWorkspace';

const ToolPopup = () => {
    const { showToolPopup, setShowToolPopup, isSidebarCollapsed } = useNavigation();
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    const [isFullScreen, setIsFullScreen] = React.useState(false);

    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            setMousePosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        };

        if (showToolPopup) {
            window.addEventListener('mousemove', handleMouseMove);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.style.overflow = 'auto';
        };
    }, [showToolPopup]);

    if (!showToolPopup) return null;

    return (
        <AnimatePresence>
            {showToolPopup && (
                <div
                    className={`fixed inset-0 z-[99999] flex items-center justify-center p-0 lg:p-4 transition-all duration-300
                    ${isFullScreen
                            ? (isSidebarCollapsed ? 'lg:pr-[100px] lg:pt-4 lg:pb-4' : 'lg:pr-[300px] lg:pt-4 lg:pb-4')
                            : 'items-stretch lg:items-start lg:pt-[12vh]'}`}
                >

                    {/* 1. FOCUS DIMMER (Darkens the noise) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowToolPopup(false)}
                        className="absolute inset-0 bg-[#050505]/70 backdrop-blur-[8px] transition-all duration-500"
                    />

                    {/* 2. THE CONTROL DECK (Wide Dashboard Edition) */}
                    <motion.div
                        ref={containerRef}
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            transition: { type: "spring", damping: 35, stiffness: 400 }
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.98,
                            y: 10,
                            transition: { duration: 0.2 }
                        }}
                        /* max-w-7xl allows tools to spread horizontally. h-auto fits content exactly. */
                        className={`relative bg-[#0A0A0C]/95 backdrop-blur-[80px] backdrop-saturate-200 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col group/lens isolate ring-1 ring-white/10 transition-all duration-500 ease-in-out
                            ${isFullScreen
                                ? '!w-full !h-full !max-w-none rounded-none lg:rounded-2xl'
                                : 'w-full lg:w-auto h-full lg:h-auto min-w-0 lg:min-w-[60vw] max-w-none lg:max-w-7xl rounded-none lg:rounded-[24px]'
                            }`}
                    >
                        {/* DYNAMIC BORDER GLOW (Mouse Tracking) */}
                        <motion.div
                            className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300 opacity-100 bg-[radial-gradient(1000px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(139,92,246,0.08),transparent_80%)]"
                            style={{
                                "--mouse-x": `${mousePosition.x}px`,
                                "--mouse-y": `${mousePosition.y}px`,
                            } as React.CSSProperties & { [key: string]: string }}
                        />
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

                        {/* ULTRA-COMPACT HEADER */}
                        <div className="relative z-20 flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4 shrink-0 bg-white/[0.02] border-b border-white/[0.04]">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 rounded-lg bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">
                                    <Search className="w-4 h-4" />
                                </div>
                                <span className="text-xs lg:text-sm font-bold text-slate-200 font-cairo tracking-wide">Workstation</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsFullScreen(!isFullScreen)}
                                    className="hidden lg:flex w-7 h-7 rounded-full items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                                    aria-label={isFullScreen ? "Exit Full Screen" : "Full Screen"}
                                >
                                    {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                                </button>
                                <button
                                    onClick={() => setShowToolPopup(false)}
                                    className="w-10 h-10 lg:w-7 lg:h-7 rounded-full flex items-center justify-center text-slate-100 lg:text-slate-500 hover:text-white hover:bg-white/10 transition-all bg-white/5 lg:bg-transparent"
                                    aria-label="Close"
                                >
                                    <X className="w-6 h-6 lg:w-4 lg:h-4" />
                                </button>
                            </div>
                        </div>

                        {/* CONTENT AREA (Maximized Width, No Vertical Waste) */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6" dir="rtl">
                            {/* Force content to expand width to avoid vertical stacking */}
                            <div className="w-full">
                                <ToolWorkspace />
                            </div>
                        </div>

                        {/* FOOTER METADATA (Raycast style) */}
                        <div className="h-9 border-t border-white/5 bg-[#0A0A0C] flex items-center justify-between px-4 text-[10px] font-medium text-slate-600 select-none">
                            <div className="flex gap-4">
                                <span className="hover:text-slate-400 cursor-pointer transition-colors">Actions</span>
                                <span className="hover:text-slate-400 cursor-pointer transition-colors">Configure Extension</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/50 animate-pulse" />
                                <span>Ri88 Lens v1.0</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ToolPopup;
