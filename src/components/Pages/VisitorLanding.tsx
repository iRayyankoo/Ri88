"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
    Zap, ArrowLeft, Clock,
    Calculator, Percent, Wallet, ArrowRightLeft, Landmark, Coins,
    ChevronLeft, Sparkles, Globe, ShieldCheck, Network
} from 'lucide-react';
import { useVisitorLanding } from '@/hooks/useVisitorLanding';

const ToolIcon = ({ icon, className }: { icon: string, className?: string }) => {
    switch (icon) {
        case 'calculator': return <Calculator className={className} />;
        case 'percent': return <Percent className={className} />;
        case 'wallet': return <Wallet className={className} />;
        case 'arrow-right-left': return <ArrowRightLeft className={className} />;
        case 'landmark': return <Landmark className={className} />;
        case 'hand-coins': return <Coins className={className} />;
        default: return <Zap className={className} />;
    }
};

const VisitorLanding = () => {
    const { popularTools, launchTool, scrollToBrowse, handleStartFree } = useVisitorLanding();

    const containerVariants: import('framer-motion').Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
    };
    const itemVariants: import('framer-motion').Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 70, damping: 20 } }
    };

    const stats = [
        { val: '+50', label: 'أداة ذكية' },
        { val: '0', label: 'إعلانات' },
        { val: '∞', label: 'غير محدود' },
        { val: '100%', label: 'خصوصية' },
    ];

    const features = [
        { icon: Globe, title: 'وصول عالمي', desc: 'أدوات مفعّلة دولياً' },
        { icon: ShieldCheck, title: 'أمان متطور', desc: 'تشفير بيانات عسكري' },
        { icon: Zap, title: 'سرعة خيالية', desc: 'استجابة فورية' },
        { icon: Network, title: 'شبكة متكاملة', desc: 'بيئة عمل مترابطة' },
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="relative w-full pb-16 space-y-10 sm:space-y-14"
        >
            {/* AMBIENT BG */}
            <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full blur-[140px] opacity-35 bg-emerald-500/15" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full blur-[130px] opacity-25 bg-cyan-500/12" />
            </div>

            {/* ── HERO ── */}
            <section className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-20 pt-6 sm:pt-10">

                {/* Text Block */}
                <div className="w-full lg:flex-1 text-right space-y-6 sm:space-y-8">

                    {/* Badge */}
                    <motion.div
                        variants={itemVariants}
                        className="flex items-center gap-4"
                    >
                        <div className="inline-flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-5 rounded-full border text-xs sm:text-sm font-bold tracking-widest uppercase bg-cyan-500/5 border-cyan-500/30 text-cyan-400">
                            <Network className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                            <span>شبكة المطورين المتقدمين</span>
                        </div>
                        <div className="px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black font-cairo animate-pulse">
                            تشغيل تجريبي 🚀
                        </div>
                    </motion.div>

                    {/* Heading */}
                    <div className="space-y-0">
                        <motion.h1
                            variants={itemVariants}
                            className="text-3xl sm:text-4xl lg:text-6xl font-black text-white font-cairo leading-[1.1] tracking-tight"
                        >
                            مستقبل
                        </motion.h1>
                        <motion.h1
                            variants={itemVariants}
                            className="text-3xl sm:text-4xl lg:text-6xl font-black font-cairo leading-[1.1] tracking-tight bg-gradient-to-br from-cyan-400 via-emerald-400 to-cyan-500 bg-clip-text text-transparent"
                        >
                            الابتكار الرقمي
                        </motion.h1>
                    </div>

                    {/* Subtitle */}
                    <motion.p
                        variants={itemVariants}
                        className="text-slate-400 text-base sm:text-lg font-medium max-w-lg ml-auto leading-relaxed"
                    >
                        انضم إلى المنصة الأكثر تطوراً في الشرق الأوسط، حيث تجتمع
                        الأدوات المتقدمة والذكاء الاصطناعي في واجهة واحدة.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4"
                    >
                        <button
                            onClick={handleStartFree}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-base bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-transform overflow-hidden relative group"
                        >
                            <div className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative z-10">ابدأ مجاناً</span>
                            <ChevronLeft className="relative z-10 w-5 h-5" />
                        </button>
                        <button
                            onClick={scrollToBrowse}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 text-slate-400 font-bold text-base hover:text-white transition-colors group border border-white/5 rounded-2xl hover:border-white/10"
                        >
                            تصفح الأدوات
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </div>

                {/* Feature Cards — 2×2 on mobile, side-by-side on desktop */}
                <motion.div
                    variants={itemVariants}
                    className="w-full grid grid-cols-2 gap-3 lg:w-[420px] lg:shrink-0 lg:gap-4"
                >
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -4 }}
                            className="relative p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-col items-center text-center gap-3 bg-[rgba(10,26,20,0.7)] border border-emerald-500/10 backdrop-blur-lg"
                        >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20">
                                <f.icon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                            </div>
                            <div>
                                <p className="font-bold text-white text-xs sm:text-sm">{f.title}</p>
                                <p className="text-slate-500 text-[10px] sm:text-xs mt-0.5">{f.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ── TOOLS GRID ── */}
            <section className="space-y-10">
                <div className="text-center space-y-2 sm:space-y-3">
                    <motion.h2
                        variants={itemVariants}
                        className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-cairo tracking-tight"
                    >
                        أدوات احترافية{' '}
                        <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            للجميع
                        </span>
                    </motion.h2>
                    <motion.p variants={itemVariants} className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
                        كل الأدوات التي تحتاجها، مصممة بعناية فائقة.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {popularTools.map((tool) => (
                        <motion.div
                            key={tool.id}
                            variants={itemVariants}
                            whileHover={{ y: -6 }}
                            onClick={() => launchTool(tool.id)}
                            className="group relative rounded-2xl sm:rounded-[28px] overflow-hidden cursor-pointer bg-[rgba(8,20,16,0.8)] border border-emerald-500/8 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/30"
                        >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

                            <div className="relative p-5 sm:p-7 flex flex-col items-start gap-4 sm:gap-5">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-emerald-400 bg-emerald-500/8 border border-emerald-500/15 group-hover:scale-110 transition-transform duration-300">
                                    <ToolIcon icon={tool.icon} className="w-6 h-6 sm:w-7 sm:h-7" />
                                </div>

                                <div className="space-y-1.5 flex-1">
                                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-400 transition-colors font-cairo">
                                        {tool.titleAr}
                                    </h3>
                                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-2">
                                        {tool.descAr}
                                    </p>
                                </div>

                                <div className="w-full flex items-center justify-between pt-4 border-t border-white/[0.04]">
                                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                                        مجانية
                                    </span>
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-slate-500 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-300 border border-white/8">
                                        <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative">
                <div className="absolute inset-0 rounded-[28px] sm:rounded-[40px] blur-3xl opacity-20 bg-gradient-to-r from-emerald-500 to-cyan-500 pointer-events-none" />

                <div className="relative rounded-[28px] sm:rounded-[36px] p-8 sm:p-12 lg:p-20 text-center overflow-hidden bg-[rgba(6,18,14,0.85)] border border-emerald-500/15 backdrop-blur-2xl">
                    <div className="absolute top-0 right-0 w-48 h-48 sm:w-80 sm:h-80 rounded-full blur-[80px] bg-emerald-500/10 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-80 sm:h-80 rounded-full blur-[80px] bg-cyan-500/8 pointer-events-none" />

                    <div className="relative z-10 max-w-3xl mx-auto space-y-8 sm:space-y-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <Clock className="w-4 h-4" />
                            <span>عرض خاص لفترة محدودة</span>
                        </div>

                        <h2 className="text-xl sm:text-2xl lg:text-4xl font-black text-white font-cairo leading-tight">
                            انطلق بإنتاجيتك إلى{' '}
                            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                أبعاد جديدة
                            </span>
                        </h2>

                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 py-6 sm:py-8 border-t border-b border-white/6">
                            {stats.map((s, i) => (
                                <div key={i} className="text-center space-y-1 sm:space-y-2">
                                    <div className="text-2xl sm:text-3xl font-black font-mono bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                        {s.val}
                                    </div>
                                    <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleStartFree}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 sm:gap-4 px-10 sm:px-14 py-4 sm:py-5 rounded-2xl sm:rounded-3xl font-black text-lg sm:text-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-[0_0_50px_rgba(16,185,129,0.25)] hover:scale-105 active:scale-95 transition-transform relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative z-10">افتح حساب مجاني</span>
                            <Sparkles className="relative z-10 w-5 h-5 animate-pulse" />
                        </button>
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default VisitorLanding;
