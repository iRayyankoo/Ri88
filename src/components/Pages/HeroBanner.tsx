"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, ArrowRight, FileText,
    Zap, Terminal, Layers, Activity
} from 'lucide-react';
import { tools } from '@/data/tools';
import { useNavigation } from '@/context/NavigationContext';

const getIcon = (id: string) => {
    const map: Record<string, React.ElementType> = {
        'ai-text': Sparkles,
        'pdf-merge': FileText,
        'img-bg': Layers,
        'health-bmi': Activity,
        'dev-json': Terminal,
    };
    return map[id] || Zap;
};

export const HeroBanner = () => {
    const { launchTool } = useNavigation();

    // Curated list of featured tools to rotate through
    const featuredIds = [
        'ai-text',      // AI Assistant
        'pdf-merge',    // PDF Tools
        'img-bg',       // Image Tools
        'health-bmi',   // Health
        'dev-json'      // Developer
    ];

    const featuredTools = featuredIds.map(id => tools.find(t => t.id === id)).filter(Boolean) as typeof tools;

    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-rotate
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredTools.length);
        }, 6000); // 6 seconds per slide
        return () => clearInterval(timer);
    }, [featuredTools.length]);

    const currentTool = featuredTools[currentIndex];

    // Map tool IDs to styling categories (matching SectionBanner logic)
    const getCategoryStyle = (id: string) => {
        if (id.includes('pdf')) return 'pdf';
        if (id.includes('img') || id.includes('image')) return 'image';
        if (id.includes('text') || id.includes('ai')) return 'text';
        if (id.includes('dev') || id.includes('json')) return 'developer';
        if (id.includes('health')) return 'finance'; // Styling Health like Finance (Emerald)
        return 'others';
    };

    const categoryKey = getCategoryStyle(currentTool.id);

    // Style Configuration (Matched with SectionBanner)
    const styleConfig: Record<string, { gradient: string, patternColor: string }> = {
        'finance': { gradient: "from-emerald-600 to-teal-900", patternColor: "bg-emerald-500" },
        'pdf': { gradient: "from-red-600 to-orange-900", patternColor: "bg-red-500" },
        'text': { gradient: "from-blue-600 to-indigo-900", patternColor: "bg-blue-500" },
        'image': { gradient: "from-pink-600 to-rose-900", patternColor: "bg-pink-500" },
        'developer': { gradient: "from-amber-600 to-yellow-900", patternColor: "bg-amber-500" },
        'others': { gradient: "from-slate-600 to-gray-900", patternColor: "bg-slate-500" }
    };

    const theme = styleConfig[categoryKey] || styleConfig['others'];
    const ToolIcon = getIcon(currentTool.id);

    return (
        <section className="px-2 lg:px-0">
            <motion.div
                key={categoryKey} // Trigger animation on color change
                initial={{ opacity: 0.8, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`relative w-full rounded-[24px] lg:rounded-[32px] overflow-hidden bg-gradient-to-br ${theme.gradient} shadow-[0_20px_50px_rgba(0,0,0,0.3)] group h-[280px] lg:h-[350px] transition-colors duration-1000`}            >
                {/* Background Pattern & Glows */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.1] mix-blend-overlay pointer-events-none" />
                <div className={`absolute top-0 right-0 w-2/3 h-full ${theme.patternColor} blur-[150px] opacity-20 pointer-events-none`} />
                <div className="absolute bottom-0 left-0 w-2/3 h-full bg-black/20 blur-[100px] pointer-events-none" />

                <div className="relative z-10 w-full h-full flex items-center justify-between p-6 lg:p-12">

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentTool.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col items-start w-full lg:w-2/3 space-y-3 lg:space-y-6 text-right"
                        >
                            {/* Animated Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                                <span className={`w-1.5 h-1.5 rounded-full bg-white animate-pulse`} />
                                FEATURED TOOL
                            </div>

                            {/* Title & Desc */}
                            <div className="space-y-1 lg:space-y-3">
                                <h1 className="text-2xl lg:text-5xl font-black text-white font-cairo leading-tight drop-shadow-lg">
                                    {currentTool.titleAr}
                                </h1>
                                <p className="text-sm lg:text-lg text-white/90 max-w-xl font-cairo leading-relaxed font-medium drop-shadow-md line-clamp-2 lg:line-clamp-none">
                                    {currentTool.descAr}
                                </p>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                <span className="px-3 py-1 bg-black/20 border border-white/10 rounded-lg text-xs text-white/70 font-mono backdrop-blur-sm">
                                    {categoryKey.toUpperCase()} / {currentTool.id}
                                </span>
                            </div>

                            {/* Action Button */}
                            <div className="pt-2 lg:pt-4">
                                <button
                                    onClick={() => launchTool(currentTool.id)}
                                    className="relative group overflow-hidden px-6 py-3 lg:px-8 lg:py-4 rounded-xl font-bold text-white bg-white/10 border border-white/20 transition-all hover:bg-white/20 hover:scale-105 active:scale-95 shadow-xl backdrop-blur-md"
                                >
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                                    <div className="relative flex items-center gap-2 lg:gap-3">
                                        <span className="text-sm lg:text-base font-cairo font-black">جربه الآن</span>
                                        <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 rtl:rotate-180" />
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Icon / Visual Side */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`icon-${currentTool.id}`}
                            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                            transition={{ duration: 0.5, type: 'spring' }}
                            className="hidden lg:flex w-1/3 items-center justify-center relative"
                        >
                            <div className="w-64 h-64 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                                <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-20`} />
                                {React.createElement(ToolIcon, { className: "w-32 h-32 text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]" })}

                                {/* Orbiting particles decoration */}
                                <div className="absolute inset-0 animate-[spin_10s_linear_infinite] opacity-30">
                                    <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full blur-[1px]" />
                                    <div className="absolute bottom-10 right-10 w-3 h-3 bg-white rounded-full blur-[2px]" />
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Progress Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {featuredTools.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            title={`انتقل إلى الأداة ${idx + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "w-2 bg-white/30 hover:bg-white/50"
                                }`}
                        />
                    ))}
                </div>
            </motion.div>
        </section>
    );
};
