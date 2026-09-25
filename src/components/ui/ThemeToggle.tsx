"use client";
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';

interface ThemeToggleProps {
    variant?: 'icon' | 'labeled' | 'pill';
    className?: string;
}

export default function ThemeToggle({ variant = 'icon', className = '' }: ThemeToggleProps) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    if (variant === 'pill') {
        return (
            <button
                type="button"
                onClick={toggleTheme}
                className={`relative flex items-center justify-between w-14 h-8 px-1 rounded-full border transition-all duration-300 ${
                    isDark 
                        ? 'bg-slate-900 border-white/15 text-yellow-400 shadow-inner' 
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

    // Default 'icon' button
    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center border transition-all active:scale-90 ${
                isDark 
                    ? 'bg-surface-glass border-border-subtle text-yellow-400 hover:border-yellow-400/40 hover:bg-yellow-400/10' 
                    : 'bg-white border-slate-200 text-amber-600 hover:border-amber-400/40 hover:bg-amber-50 shadow-sm'
            } ${className}`}
            title={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
            aria-label="تبديل مظهر الموقع"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={theme}
                    initial={{ y: -10, opacity: 0, rotate: -45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 10, opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.15 }}
                >
                    {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
                </motion.div>
            </AnimatePresence>
        </button>
    );
}
