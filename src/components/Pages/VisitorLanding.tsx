"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Rocket, Star, Users, ArrowLeft, Clock, Shield, Grid, Grid3X3 } from 'lucide-react';
import Link from 'next/link';
import { tools } from '@/data/tools';
import { useNavigation } from '@/context/NavigationContext';

const VisitorLanding = () => {
    const { setCurrentView, launchTool } = useNavigation();
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
            initial="visible"
            animate="visible"
            variants={containerVariants}
            className="space-y-24 pb-20"
        >

            {/* HERO SECTION */}
            <section className="relative min-h-[500px] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 overflow-hidden rounded-[40px] lg:rounded-[48px] stitch-glass p-6 md:p-12 lg:p-20">

                {/* Text Content */}
                <div className="relative z-10 flex-1 text-right space-y-8">
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/20 border border-brand-primary/20 text-xs font-black text-brand-primary uppercase tracking-widest">
                        <Zap className="w-4 h-4 fill-brand-primary" />
                        منصة الأدوات الأولى في الشرق الأوسط
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl lg:text-6xl font-black tracking-tighter leading-tight text-white">
                        قوة الذكاء <br /> <span className="text-brand-primary">في متناول يدك</span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-lg text-slate-400 font-medium leading-relaxed max-w-xl ml-auto">
                        انضم إلى أكثر من <span className="text-brand-secondary">50,000</span> مستخدم يعتمدون على RI88 PRO يومياً لمعالجة البيانات، الأتمتة، والتحليل الذكي.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex items-center justify-end gap-6 pt-4">
                        <button
                            onClick={() => setCurrentView('directory')}
                            className="bg-white/5 hover:bg-white/10 text-white font-bold px-6 py-3 lg:px-10 lg:py-4 rounded-xl lg:rounded-2xl transition-all border border-brand-primary/10 active:scale-95 text-sm lg:text-base"
                        >
                            مشاهدة العرض
                        </button>
                        <button
                            onClick={() => setCurrentView('dashboard')}
                            className="btn-primary flex items-center gap-3 shadow-2xl shadow-brand-primary/40 active:scale-95 px-6 py-3 lg:px-10 lg:py-4 rounded-xl lg:rounded-2xl text-sm lg:text-base"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            ابدأ مجاناً الآن
                        </button>
                    </motion.div>
                </div>

                {/* Mascot */}
                <motion.div
                    variants={itemVariants}
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative shrink-0 w-full max-w-[280px] md:max-w-[400px] lg:max-w-[500px]"
                >
                    <div className="absolute inset-0 bg-brand-primary/20 blur-[100px] rounded-full" />
                    <img
                        src="/ri88_mascot_silhouette_1770236907665.png"
                        alt="RI88 Mascot"
                        className="relative z-10 w-full h-auto drop-shadow-[0_0_50px_rgba(139,92,246,0.3)]"
                    />
                </motion.div>

                {/* Background Mesh */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-primary/20 via-brand-bg to-brand-bg opacity-40 pointer-events-none" />
            </section>

            {/* POPULAR TOOLS GRID */}
            <section className="space-y-12">
                <div className="flex flex-col items-center text-center space-y-4">
                    <h2 className="text-3xl lg:text-4xl font-black tracking-tighter text-white">الأدوات الأكثر شيوعاً</h2>
                    <p className="text-slate-500 font-medium max-w-lg">مجموعة مختارة من الأدوات التي غيرت حياة آلاف المبدعين والمبرمجين.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {popularTools.map((tool) => (
                        <motion.div
                            key={tool.id}
                            variants={itemVariants}
                            whileHover={{ y: -8 }}
                            onClick={() => launchTool(tool.id)}
                            className="stitch-glass p-8 group cursor-pointer hover:border-brand-primary/30 transition-all"
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
            <section className="relative overflow-hidden rounded-[32px] lg:rounded-[40px] bg-brand-primary p-8 lg:p-20 text-center text-white shadow-[0_20px_50px_rgba(139,92,246,0.3)]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

                <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/20 backdrop-blur-xl border border-white/20">
                        <Clock className="w-5 h-5" />
                        <span className="font-black text-sm tracking-widest">{formatTime(timeLeft)}</span>
                    </div>

                    <h2 className="text-3xl lg:text-5xl font-black tracking-tighter leading-tight">
                        استمتع بخصم <span className="text-brand-secondary">50%</span> <br /> على عضوية بريميوم
                    </h2>

                    <p className="text-lg text-white/80 font-medium">
                        ينتهي هذا العرض الحصري قريباً. سجل الآن لتحصل على وصول كامل لجميع الأدوات المتقدمة والأتمتة الذكية.
                    </p>

                    <div className="pt-4">
                        <button
                            onClick={() => setCurrentView('auth')}
                            className="bg-white text-brand-primary font-black px-16 py-5 rounded-2xl text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
                        >
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

            {/* WHY RI88 SECTION (From Stitch Design) */}
            <div className="py-20 space-y-16">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl lg:text-3xl font-black text-white">Why RI88?</h2>
                    <p className="text-slate-400 max-w-lg mx-auto">منصة متكاملة صممت لتعمل معك وبسرعة البرق.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Zap,
                            title: "Lightning Speed",
                            desc: "معالجة فورية للبيانات محلياً على جهازك بدون أي تأخير.",
                            color: "bg-purple-500/20 text-purple-400"
                        },
                        {
                            icon: Shield,
                            title: "Privacy First",
                            desc: "بياناتك ملكك. لا نقوم بتخزين أي مدخلات، كل شيء يبقى خاصاً.",
                            color: "bg-emerald-500/20 text-emerald-400"
                        },
                        {
                            icon: Grid3X3,
                            title: "Multi-window Mode",
                            desc: "شغل عدة أدوات في وقت واحد لزيادة إنتاجيتك.",
                            color: "bg-blue-500/20 text-blue-400"
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-10 flex flex-col items-center text-center gap-6 hover:border-brand-primary/30 transition-colors"
                        >
                            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${feature.color}`}>
                                <feature.icon className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                            <p className="text-base text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* STITCH CTA CARD */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="w-full bg-[#8B5CF6] rounded-[40px] lg:rounded-[56px] p-8 md:p-16 lg:p-24 text-center space-y-10 relative overflow-hidden"
                >
                    {/* Abstract Patterns */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight">Ready to optimize?</h2>
                        <p className="text-purple-100/90 text-xl font-medium max-w-2xl mx-auto leading-relaxed">أنشئ حسابك المجاني الآن واحفظ إعداداتك، مساحات العمل الخاصة بك، واستمتع بتجربة RI88 الكاملة.</p>

                        <button
                            onClick={() => setCurrentView('auth')}
                            className="bg-white text-brand-primary font-black text-xl px-12 py-6 rounded-full hover:scale-105 transition-transform shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
                        >
                            Get Started for Free
                        </button>
                    </div>
                </motion.div>
            </div>

        </motion.div>
    );
};

export default VisitorLanding;
