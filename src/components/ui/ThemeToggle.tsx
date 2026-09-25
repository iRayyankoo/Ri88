"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, Accent } from '@/components/ThemeProvider';

interface ThemeToggleProps {
    variant?: 'icon' | 'labeled' | 'pill' | 'palette';
    className?: string;
    showPalette?: boolean;
}

const ACCENT_OPTIONS: { id: Accent; nameAr: string; nameEn: string; color: string }[] = [
    { id: 'teal', nameAr: 'سيان تيل', nameEn: 'Cyan Teal', color: '#24B1B1' },
    { id: 'cobalt', nameAr: 'كوبالت ملكي', nameEn: 'Royal Cobalt', color: '#3b82f6' },
    { id: 'gold', nameAr: 'ذهب إمبراطوري', nameEn: 'Imperial Gold', color: '#d4af37' },
    { id: 'violet', nameAr: 'بنفسجي مستقبلي', nameEn: 'Future Violet', color: '#8b5cf6' },
];

export default function ThemeToggle({ variant = 'icon', className = '', showPalette = true }: ThemeToggleProps) {
    const { theme, toggleTheme, accent, setAccent } = useTheme();
    const isDark = theme === 'dark';
    const [paletteOpen, setPaletteOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close palette on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setPaletteOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (variant === 'pill') {
        return (
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={toggleTheme}
                    className={`relative flex items-center justify-between w-14 h-8 px-1 rounded-full border transition-all duration-300 ${
                        isDark 
                            ? 'bg-[#121518] border-[#262b30] text-amber-400 shadow-inner' 
                            : 'bg-amber-50 border-amber-200 text-amber-500 shadow-sm'
                    } ${className}`}
                    title={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
                    aria-label="تبديل مظهر الموقع"
                >
                    <Sun className={`w-3.5 h-3.5 transition-opacity ${isDark ? 'opacity-30' : 'opacity-100'}`} />
                    <Moon className={`w-3.5 h-3.5 transition-opacity ${isDark ? 'opacity-100' : 'opacity-30'}`} />
                    <motion.div
                        className={`absolute w-6 h-6 rounded-full shadow-md flex items-center justify-center ${
                            isDark ? 'bg-brand-primary text-black' : 'bg-white text-amber-600'
                        }`}
                        animate={{ left: isDark ? '4px' : 'calc(100% - 28px)' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                        {isDark ? <Moon className="w-3.5 h-3.5 text-black" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                    </motion.div>
                </button>
            </div>
        );
    }

    if (variant === 'labeled') {
        return (
            <button
                type="button"
                onClick={toggleTheme}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm font-bold ${
                    isDark 
                        ? 'bg-surface-raised border-border-subtle text-text-primary hover:bg-surface-glass' 
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100 shadow-sm'
                } ${className}`}
            >
                <div className={`p-1.5 rounded-lg ${isDark ? 'bg-yellow-400/10 text-yellow-400' : 'bg-amber-500/10 text-amber-600'}`}>
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </div>
                <span>{isDark ? 'الوضع النهاري' : 'الوضع الليلي'}</span>
            </button>
        );
    }

    // Default 'icon' button with Accent Palette Picker
    return (
        <div className="flex items-center gap-1.5" ref={dropdownRef}>
            {/* Palette Accent Dropdown */}
            {showPalette && (
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setPaletteOpen(!paletteOpen)}
                        className="w-9 h-9 rounded-lg border border-border-subtle bg-surface-raised flex items-center justify-center text-text-muted hover:text-brand-primary hover:border-brand-primary/40 transition-all active:scale-90"
                        title="تغيير لون الهوية"
                        aria-label="تغيير لون الهوية"
                    >
                        <Palette size={15} />
                    </button>

                    <AnimatePresence>
                        {paletteOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -6, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -6, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute top-full mt-2 left-0 z-50 min-w-[155px] p-2 bg-surface-raised border border-border-subtle rounded-xl shadow-2xl backdrop-blur-xl flex flex-col gap-1 text-right"
                            >
                                <span className="text-[10px] font-mono text-text-muted px-2 py-1 uppercase tracking-wider">لون السمة</span>
                                {ACCENT_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => {
                                            setAccent(opt.id);
                                            setPaletteOpen(false);
                                        }}
                                        className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all text-right w-full ${
                                            accent === opt.id 
                                                ? 'bg-brand-primary/10 text-brand-primary font-bold' 
                                                : 'text-text-muted hover:text-text-primary hover:bg-surface-glass'
                                        }`}
                                    >
                                        <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: opt.color }} />
                                        <span>{opt.nameEn}</span>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Dark / Light Toggle */}
            <button
                type="button"
                onClick={toggleTheme}
                className={`relative w-9 h-9 rounded-lg flex items-center justify-center border transition-all active:scale-90 ${
                    isDark 
                        ? 'bg-surface-raised border-border-subtle text-text-muted hover:text-amber-400 hover:border-amber-400/40' 
                        : 'bg-white border-slate-200 text-amber-600 hover:border-amber-400/40 hover:bg-amber-50 shadow-sm'
                } ${className}`}
                title={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
                aria-label="تبديل مظهر الموقع"
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={theme}
                        initial={{ y: -8, opacity: 0, rotate: -45 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: 8, opacity: 0, rotate: 45 }}
                        transition={{ duration: 0.15 }}
                    >
                        {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-700" />}
                    </motion.div>
                </AnimatePresence>
            </button>
        </div>
    );
}
