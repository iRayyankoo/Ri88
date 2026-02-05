"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, ArrowRight, Sparkles } from 'lucide-react';
import Logo from '../Brand/Logo';

interface ComingSoonOverlayProps {
    onUnlock?: () => void;
}

const CountdownItem = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center mx-2 lg:mx-4">
        <motion.div
            key={value}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-brand-primary to-purple-400 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] font-mono"
        >
            {value.toString().padStart(2, '0')}
        </motion.div>
        <span className="text-[10px] lg:text-xs text-slate-400 uppercase tracking-[0.2em] mt-2 font-bold">{label}</span>
    </div>
);

const ComingSoonOverlay: React.FC<ComingSoonOverlayProps> = ({ onUnlock }) => {
    // Countdown Logic (Target: 14 Days from now)
    const [timeLeft, setTimeLeft] = useState({ days: 14, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            // Mock countdown logic for visual effect
            const now = new Date();
            const target = new Date(now.getTime() + 1209600000); // 14 Days

            // Just tick down seconds for demo
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Unlock Handler
    const handleAdminUnlock = () => {
        const pass = prompt("Admin Access Key:");
        if (pass === "admin-secret-pass" || pass === "78d7") {
            onUnlock?.();
        } else if (pass) {
            alert("Access Denied");
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] bg-[#0D0D0F] flex flex-col items-center justify-center overflow-hidden">

            {/* 1. CINEMATIC BACKGROUND */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Neon Orbs */}
                <motion.div
                    animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-brand-primary/20 blur-[150px] rounded-full mix-blend-screen"
                />
                <motion.div
                    animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.5, 1] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-secondary/10 blur-[150px] rounded-full mix-blend-screen"
                />

                {/* Floating Particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, opacity: 0 }}
                        animate={{ y: [null, Math.random() * -100], opacity: [0, 0.5, 0] }}
                        transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, delay: Math.random() * 5 }}
                        className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
                    />
                ))}

                {/* Film Noise Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")` }} />
            </div>

            {/* 2. MAIN CONTENT */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-4xl px-6">

                {/* Hero Logo & Headline */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-center mb-12"
                >
                    <div className="mb-8 scale-150 transform-gpu drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]">
                        <Logo size="lg" />
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tighter drop-shadow-sm">
                        THE NEXT EVOLUTION
                    </h1>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 1, duration: 1 }}
                        className="h-[1px] bg-gradient-to-r from-transparent via-brand-primary to-transparent mt-6 opacity-50"
                    />
                </motion.div>

                {/* 3. CENTER GLASS CARD */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="relative w-full max-w-2xl bg-white/[0.02] backdrop-blur-[40px] border border-white/[0.08] rounded-[32px] p-8 lg:p-12 shadow-[0_0_50px_-10px_rgba(139,92,246,0.15)] overflow-hidden group"
                >
                    {/* Inner Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-50 blur-[2px]" />

                    {/* Countdown Timer */}
                    <div className="flex justify-center items-center mb-12 select-none">
                        <CountdownItem value={timeLeft.days} label="Days" />
                        <span className="text-4xl text-white/10 font-light mb-6">:</span>
                        <CountdownItem value={timeLeft.hours} label="Hrs" />
                        <span className="text-4xl text-white/10 font-light mb-6">:</span>
                        <CountdownItem value={timeLeft.minutes} label="Min" />
                        <span className="text-4xl text-white/10 font-light mb-6">:</span>
                        <CountdownItem value={timeLeft.seconds} label="Sec" />
                    </div>

                    {/* Waitlist Form */}
                    <div className="relative max-w-md mx-auto">
                        <div className="relative group/input">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-brand-primary transition-colors" size={20} />
                            <input
                                type="email"
                                placeholder="Enter your email for early access..."
                                className="w-full h-16 bg-black/30 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 focus:bg-black/50 transition-all text-lg"
                            />
                        </div>
                        <button className="mt-4 w-full h-16 bg-gradient-to-r from-brand-primary to-blue-600 rounded-2xl font-bold text-white text-lg tracking-wide shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group/btn">
                            <Sparkles className="w-5 h-5 group-hover/btn:animate-spin" />
                            JOIN THE WAITLIST
                        </button>
                    </div>

                </motion.div>

            </div>

            {/* 4. FOOTER / ADMIN UNLOCK */}
            <div className="absolute bottom-10 left-10 lg:left-12 opacity-30 hover:opacity-100 transition-opacity flex items-center gap-4 z-50">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">© 2026 RI88 PRO ARCHITECTURE.</p>
                <button onClick={handleAdminUnlock} className="p-2 hover:bg-white/10 rounded-full transition-colors group">
                    <ShieldCheck className="w-4 h-4 text-slate-700 group-hover:text-brand-primary" />
                </button>
            </div>
        </div>
    );
};

export default ComingSoonOverlay;
