"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Rocket, Star, Users, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import { tools } from '@/data/tools';

const VisitorLanding = () => {
    const [timeLeft, setTimeLeft] = useState(3600 * 24 + 3600 * 5); // 29 hours

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const popularTools = tools.slice(0, 6);

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-24 pb-20"
        >

            {/* HERO SECTION */}
            <section className="relative min-h-[600px] flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden rounded-[48px] bg-gradient-to-br from-brand-card to-brand-primary/10 p-12 lg:p-20 border border-white/5">

                {/* Text Content */}
                <div className="relative z-10 flex-1 text-right space-y-8">
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/20 border border-brand-primary/20 text-xs font-black text-brand-primary uppercase tracking-widest">
                        <Zap className="w-4 h-4 fill-brand-primary" />
                        منصة الأدوات الأولى في الشرق الأوسط
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-black tracking-tighter leading-tight text-white">
                        قوة الذكاء <br /> <span className="text-brand-primary">في متناول يدك</span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-lg text-slate-400 font-medium leading-relaxed max-w-xl ml-auto">
                        انضم إلى أكثر من <span className="text-brand-secondary">50,000</span> مستخدم يعتمدون على RI88 PRO يومياً لمعالجة البيانات، الأتمتة، والتحليل الذكي.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex items-center justify-end gap-6 pt-4">
                        <button className="bg-white/5 hover:bg-white/10 text-white font-bold px-10 py-4 rounded-2xl transition-all border border-white/10 active:scale-95">
                            مشاهدة العرض
                        </button>
                        <button className="bg-brand-primary hover:bg-brand-primary/90 text-white font-black px-12 py-4 rounded-2xl transition-all shadow-2xl shadow-brand-primary/40 active:scale-95 flex items-center gap-3">
                            <ArrowLeft className="w-5 h-5" />
                            ابدأ مجاناً الآن
                        </button>
                    </motion.div>
                </div>

                {/* Mascot Silhouette */}
                <motion.div
                    variants={itemVariants}
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative shrink-0 w-full max-w-[400px] lg:max-w-[500px]"
                >
                    <div className="absolute inset-0 bg-brand-primary/20 blur-[100px] rounded-full" />
                    <img
                        src="/ri88_mascot_silhouette_1770236907665.png"
                        alt="RI88 Mascot"
                        className="relative z-10 w-full h-auto drop-shadow-[0_0_50px_rgba(139,92,246,0.3)]"
                    />
                </motion.div>

                {/* Background Mesh (defined in globals.css) */}
                <div className="hero-mesh-bg opacity-20" />
            </section>

            {/* POPULAR TOOLS GRID */}
            <section className="space-y-12">
                <div className="flex flex-col items-center text-center space-y-4">
                    <h2 className="text-4xl font-black tracking-tighter text-white">الأدوات الأكثر شيوعاً</h2>
                    <p className="text-slate-500 font-medium max-w-lg">مجموعة مختارة من الأدوات التي غيرت حياة آلاف المبدعين والمبرمجين.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {popularTools.map((tool) => (
                        <motion.div
                            key={tool.id}
                            variants={itemVariants}
                            whileHover={{ y: -8 }}
                            className="glass-card p-8 group cursor-pointer border-white/5 hover:border-brand-primary/30 transition-all"
                        >
                            <div className="w-16 h-16 bg-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">{tool.titleAr || tool.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{tool.descAr || tool.desc}</p>
                            <div className="mt-8 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-600 tracking-widest">
                                    <Users className="w-3 h-3" />
                                    12k مستخدم
                                </div>
                                <ArrowLeft className="w-5 h-5 text-brand-primary opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* REGISTER CTA WITH COUNTDOWN */}
            <section className="relative overflow-hidden rounded-[40px] bg-brand-primary p-12 lg:p-20 text-center text-white">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

                <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/20 backdrop-blur-xl border border-white/20">
                        <Clock className="w-5 h-5" />
                        <span className="font-black text-sm tracking-widest">{formatTime(timeLeft)}</span>
                    </div>

                    <h2 className="text-4xl lg:text-6xl font-black tracking-tighter leading-tight">
                        استمتع بخصم <span className="text-brand-secondary">50%</span> <br /> على عضوية بريميوم
                    </h2>

                    <p className="text-lg text-white/80 font-medium">
                        ينتهي هذا العرض الحصري قريباً. سجل الآن لتحصل على وصول كامل لجميع الأدوات المتقدمة والأتمتة الذكية.
                    </p>

                    <div className="pt-4">
                        <button className="bg-white text-brand-primary font-black px-16 py-5 rounded-2xl text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl">
                            سجل حسابك الآن
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-12 pt-10 text-white/60">
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-2xl font-black text-white">100+</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-center leading-tight">أداة ذكية <br /> متوفرة</span>
                        </div>
                        <div className="w-[1px] h-10 bg-white/20" />
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-2xl font-black text-white">24/7</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-center leading-tight">دعم فني <br /> مباشر</span>
                        </div>
                        <div className="w-[1px] h-10 bg-white/20" />
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-2xl font-black text-white">99.9%</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-center leading-tight">وقت التشغيل <br /> المضمون</span>
                        </div>
                    </div>
                </div>
            </section>

        </motion.div>
    );
};

export default VisitorLanding;
