"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, ShieldCheck, Mail, Instagram, Twitter } from 'lucide-react';
import Logo from '../Brand/Logo';

const ComingSoonOverlay = () => {
    const [timeLeft, setTimeLeft] = useState(3600 * 24 * 14); // 14 days

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return { d, h, m, s };
    };

    const time = formatTime(timeLeft);

    return (
        <div className="fixed inset-0 z-[100] bg-brand-bg flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">

            {/* Background Effects */}
            <div className="absolute inset-0 hero-mesh-bg opacity-30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/20 blur-[150px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-4xl w-full space-y-12"
            >
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Logo size="lg" />
                </div>

                {/* Status Badge */}
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
                    <ShieldCheck className="w-5 h-5 text-brand-secondary" />
                    <span className="text-xs font-black text-white uppercase tracking-[0.3em]">تحت التطوير المكثف</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-tight">
                    نحن نبني <br /> <span className="text-brand-primary">مستقبل الأدوات الذكية</span>
                </h1>

                <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                    منصة RI88 PRO تخضع حالياً لتحديثات كبرى لنمنحك تجربة لا مثيل لها. <br /> سنكون جاهزين للإطلاق الرسمي قريباً جداً.
                </p>

                {/* Countdown Grid */}
                <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto pt-8">
                    {[
                        { label: 'يوم', value: time.d },
                        { label: 'ساعة', value: time.h },
                        { label: 'دقيقة', value: time.m },
                        { label: 'ثانية', value: time.s }
                    ].map((unit, i) => (
                        <div key={i} className="glass-card p-6 flex flex-col items-center gap-2 border-white/5 bg-white/[0.02]">
                            <span className="text-3xl lg:text-5xl font-black text-white">{unit.value.toString().padStart(2, '0')}</span>
                            <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest">{unit.label}</span>
                        </div>
                    ))}
                </div>

                {/* Waitlist Form */}
                <div className="max-w-md mx-auto space-y-4 pt-8">
                    <div className="relative group">
                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-primary transition-colors" />
                        <input
                            type="email"
                            placeholder="بريدك الإلكتروني للحصول على دعوة.."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-6 text-white text-sm outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all text-right"
                        />
                        <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all">
                            أعلمني فور الإطلاق
                        </button>
                    </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-8 pt-10 text-slate-500">
                    <Instagram className="w-6 h-6 hover:text-brand-primary cursor-pointer transition-colors" />
                    <Twitter className="w-6 h-6 hover:text-brand-secondary cursor-pointer transition-colors" />
                    <Zap className="w-6 h-6 hover:text-white cursor-pointer transition-colors" />
                </div>
            </motion.div>

            {/* Bottom Credit */}
            <div className="absolute bottom-10 left-10 lg:left-12 opacity-30 hover:opacity-100 transition-opacity">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">© 2026 RI88 PRO ARCHITECTURE</p>
            </div>
        </div>
    );
};

export default ComingSoonOverlay;
