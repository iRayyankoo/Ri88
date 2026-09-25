"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, Star, Share2, Check, ArrowRight } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import { useFavorites } from '@/context/FavoritesContext';
import { resolveActiveTool } from './Pages/ToolWorkspace';
import { ToolIcon } from './tools/IconMap';
import ToolWorkspace from './Pages/ToolWorkspace';
import { toast } from 'sonner';

const ToolPopup = () => {
    const { showToolPopup, setShowToolPopup, activeToolId, activeDbTool } = useNavigation();
    const { isFavorite, toggleFavorite } = useFavorites();
    const [mounted, setMounted] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const tool = resolveActiveTool(activeToolId, activeDbTool);
    const isFav = isFavorite(tool.id);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Keyboard Hotkeys: ESC to close, F to fullscreen (when not focused in inputs)
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!showToolPopup) return;

        const target = e.target as HTMLElement | null;
        const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable);

        if (e.key === 'Escape') {
            e.preventDefault();
            setShowToolPopup(false);
        } else if ((e.key === 'f' || e.key === 'F') && !isInput && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            setIsFullScreen(prev => !prev);
        }
    }, [showToolPopup, setShowToolPopup]);

    useEffect(() => {
        if (showToolPopup) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [showToolPopup, handleKeyDown]);

    // Copy Tool Link
    const handleShareLink = async () => {
        try {
            const url = `${window.location.origin}/?tool=${encodeURIComponent(tool.id)}`;
            await navigator.clipboard.writeText(url);
            setLinkCopied(true);
            toast.success('تم نسخ رابط الأداة بنجاح 🔗');
            setTimeout(() => setLinkCopied(false), 2000);
        } catch {
            toast.error('تعذر نسخ الرابط');
        }
    };

    if (!mounted || !showToolPopup) return null;

    return createPortal(
        <AnimatePresence>
            {showToolPopup && (
                <div className="fixed inset-0 z-[999999] flex items-center justify-center p-0 sm:p-4 lg:p-6 transition-all duration-300">
                    {/* BACKDROP DIMMER - COVERS 100% OF VIEWPORT */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowToolPopup(false)}
                        className="fixed inset-0 bg-[#050709]/85 backdrop-blur-md transition-all duration-300 z-0"
                    />

                    {/* STUDIO WINDOW CONTAINER */}
                    <motion.div
                        ref={containerRef}
                        initial={{ opacity: 0, scale: 0.98, y: 16 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            transition: { type: "spring", damping: 30, stiffness: 360 }
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.98,
                            y: 12,
                            transition: { duration: 0.18 }
                        }}
                        className={`relative z-10 bg-surface-raised/95 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col isolate border border-border-subtle transition-all duration-300 ease-out text-right ${
                            isFullScreen
                                ? '!fixed !inset-0 !w-full !h-full !max-w-none !max-h-none rounded-none'
                                : 'w-full h-full sm:h-[90vh] sm:max-w-5xl xl:max-w-6xl sm:max-h-[860px] rounded-none sm:rounded-2xl'
                        }`}
                        dir="rtl"
                    >
                        {/* Top Ambient Glow Line */}
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent pointer-events-none" />

                        {/* 1. DESKTOP WINDOW TITLE BAR (macOS Mockup + Monospace Path + Controls in LTR) */}
                        <div className="hidden sm:flex relative z-20 items-center justify-between px-4 sm:px-5 py-3 border-b border-border-subtle bg-surface-base/90 select-none" dir="ltr">
                            {/* Left: macOS Window Dots + Breadcrumbs */}
                            <div className="flex items-center gap-3">
                                {/* Traffic light dots */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setShowToolPopup(false)}
                                        title="إغلاق [ESC]"
                                        aria-label="إغلاق الأداة"
                                        className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] hover:brightness-110 flex items-center justify-center transition-all group/dot"
                                    >
                                        <X className="w-2.5 h-2.5 text-black/70 opacity-0 group-hover/dot:opacity-100 transition-opacity" />
                                    </button>
                                    <button
                                        onClick={() => setIsFullScreen(false)}
                                        title="استعادة الحجم"
                                        aria-label="استعادة الحجم"
                                        className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] hover:brightness-110 flex items-center justify-center transition-all group/dot"
                                    >
                                        <span className="w-2 h-0.5 bg-black/70 opacity-0 group-hover/dot:opacity-100 transition-opacity" />
                                    </button>
                                    <button
                                        onClick={() => setIsFullScreen(!isFullScreen)}
                                        title={isFullScreen ? "تصغير النافذة [F]" : "ملء الشاشة [F]"}
                                        aria-label="ملء الشاشة"
                                        className="w-3.5 h-3.5 rounded-full bg-[#27c93f] hover:brightness-110 flex items-center justify-center transition-all group/dot"
                                    >
                                        <Maximize2 className="w-2 h-2 text-black/70 opacity-0 group-hover/dot:opacity-100 transition-opacity" />
                                    </button>
                                </div>

                                <div className="h-4 w-px bg-border-subtle mx-0.5" />

                                {/* Monospace Path */}
                                <div className="flex items-center gap-1.5 font-mono text-[11px] text-text-muted">
                                    <span className="text-brand-primary font-bold">ri88.studio</span>
                                    <span className="opacity-40">/</span>
                                    <span className="opacity-75">{tool.cat}</span>
                                    <span className="opacity-40">/</span>
                                    <span className="text-text-primary font-medium">{tool.id}</span>
                                </div>
                            </div>

                            {/* Right: Quick Action Controls */}
                            <div className="flex items-center gap-1.5">
                                {/* Favorite Toggle */}
                                <button
                                    onClick={() => toggleFavorite(tool.id, tool.titleAr || tool.title)}
                                    aria-label={isFav ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                                    title={isFav ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                                    className={`p-1.5 rounded-lg border transition-all ${
                                        isFav
                                            ? "bg-amber-400/10 border-amber-400/30 text-amber-400 hover:bg-amber-400/20"
                                            : "bg-surface-glass border-border-subtle text-text-muted hover:text-amber-400 hover:border-amber-400/30"
                                    }`}
                                >
                                    <Star className={`w-4 h-4 ${isFav ? "fill-amber-400" : ""}`} />
                                </button>

                                {/* Share Link */}
                                <button
                                    onClick={handleShareLink}
                                    aria-label="نسخ رابط الأداة"
                                    title="نسخ رابط الأداة"
                                    className="p-1.5 rounded-lg bg-surface-glass border border-border-subtle text-text-muted hover:text-brand-primary hover:border-brand-primary/30 transition-all"
                                >
                                    {linkCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                                </button>

                                {/* Fullscreen Toggle Button */}
                                <button
                                    onClick={() => setIsFullScreen(!isFullScreen)}
                                    aria-label={isFullScreen ? "تصغير النافذة" : "ملء الشاشة"}
                                    title={isFullScreen ? "تصغير [F]" : "ملء الشاشة [F]"}
                                    className="p-1.5 rounded-lg bg-surface-glass border border-border-subtle text-text-muted hover:text-text-primary hover:border-text-primary/30 transition-all"
                                >
                                    {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                </button>

                                {/* Close Button */}
                                <button
                                    onClick={() => setShowToolPopup(false)}
                                    aria-label="إغلاق [ESC]"
                                    title="إغلاق [ESC]"
                                    className="p-1.5 rounded-lg bg-surface-glass border border-border-subtle text-text-muted hover:text-rose-400 hover:border-rose-400/30 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* 1. MOBILE NATIVE APP BAR (Header for Mobile Screens) */}
                        <div className="sm:hidden relative z-20 flex items-center justify-between px-3.5 py-2.5 border-b border-border-subtle bg-surface-base/95 pt-[max(env(safe-area-inset-top,0px),8px)]">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowToolPopup(false)}
                                    className="w-8 h-8 rounded-lg bg-surface-glass border border-border-subtle flex items-center justify-center text-text-primary active:scale-90 transition-transform touch-manipulation"
                                    aria-label="رجوع"
                                >
                                    <ArrowRight className="w-4 h-4 rtl:rotate-0" />
                                </button>
                                <div className="flex flex-col min-w-0">
                                    <h2 className="text-sm font-black text-text-primary font-cairo truncate">
                                        {tool.titleAr || tool.title}
                                    </h2>
                                    <span className="text-[9px] font-mono text-brand-primary uppercase">
                                        {tool.cat}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => toggleFavorite(tool.id, tool.titleAr || tool.title)}
                                    className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all touch-manipulation active:scale-90 ${
                                        isFav
                                            ? "bg-amber-400/10 border-amber-400/30 text-amber-400"
                                            : "bg-surface-glass border-border-subtle text-text-muted"
                                    }`}
                                    aria-label="المفضلة"
                                >
                                    <Star className={`w-4 h-4 ${isFav ? "fill-amber-400" : ""}`} />
                                </button>
                                <button
                                    onClick={handleShareLink}
                                    className="w-8 h-8 rounded-lg bg-surface-glass border border-border-subtle flex items-center justify-center text-text-muted active:scale-90 transition-transform touch-manipulation"
                                    aria-label="مشاركة"
                                >
                                    {linkCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* 2. COMPACT TOOL IDENTITY STRIP (Desktop only) */}
                        <div className="hidden sm:flex relative z-10 px-4 sm:px-6 py-3.5 border-b border-border-subtle bg-surface-raised/40 items-center justify-between gap-3 shrink-0" dir="rtl">
                            <div className="flex items-center gap-3.5 min-w-0">
                                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center shrink-0 shadow-inner">
                                    <ToolIcon name={tool.icon} className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                        <h2 className="text-base sm:text-lg font-black text-text-primary font-cairo tracking-tight truncate">
                                            {tool.titleAr || tool.title}
                                        </h2>
                                        <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-bold">
                                            {tool.cat}
                                        </span>
                                    </div>
                                    <p className="text-xs text-text-muted font-cairo truncate max-w-md sm:max-w-xl mt-0.5">
                                        {tool.descAr || tool.desc}
                                    </p>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>جاهز للتشغيل</span>
                            </div>
                        </div>

                        {/* 3. TOOL CONTENT CANVAS */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 sm:p-6 pb-20 sm:pb-6" dir="rtl">
                            <ToolWorkspace />
                        </div>

                        {/* 4. STUDIO STATUS FOOTER (Desktop only) */}
                        <div className="hidden sm:flex h-8 border-t border-border-subtle bg-surface-base/90 items-center justify-between px-4 sm:px-5 text-[11px] font-mono text-text-muted select-none shrink-0" dir="rtl">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 rounded bg-surface-glass border border-border-subtle text-[9px] text-text-primary">ESC</kbd>
                                    <span className="text-[10px] text-text-muted">إغلاق</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 rounded bg-surface-glass border border-border-subtle text-[9px] text-text-primary">F</kbd>
                                    <span className="text-[10px] text-text-muted">ملء الشاشة</span>
                                </span>
                            </div>

                            <div className="flex items-center gap-2" dir="ltr">
                                <span className="text-[10px] text-brand-primary/80">LATENCY &lt; 15MS</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default ToolPopup;
