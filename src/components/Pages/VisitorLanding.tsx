"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Zap, Star, Users, ArrowLeft, Clock, Shield, Grid3X3,
    Calculator, Percent, Wallet, ArrowRightLeft, Landmark, Coins
} from 'lucide-react';
import { tools } from '@/data/tools';
import { useNavigation } from '@/context/NavigationContext';

// Icon Mapping Component
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
            className="space-y-16 pb-12"
        >

            {/* HERO SECTION - PREMIUM POLISH */}
            <section className="relative min-h-[500px] lg:min-h-[600px] flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 overflow-hidden rounded-[40px] lg:rounded-[64px] bg-[#0F1115] border border-white/5 p-8 md:p-12 lg:p-24 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                {/* Text Content */}
                <div className="relative z-10 flex-1 text-right space-y-10">
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-xs font-black text-brand-primary uppercase tracking-[0.2em] backdrop-blur-md">
                        <Zap className="w-4 h-4 fill-brand-primary" />
                        منصة الأدوات الأولى في الشرق الأوسط
                    </motion.div>

                    <div className="space-y-6">
                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl md:text-5xl lg:text-8xl font-black text-white font-cairo leading-[1.1] tracking-tighter"
                        >
                            كل ما تحتاجه <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 via-cyan-400 to-blue-500">من أدوات ذكية</span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl ml-auto leading-relaxed"
                        >
                            انضم إلى <span className="text-white font-black underline decoration-brand-primary/30">+50,000</span> مستخدم يعتمدون على RI88 PRO يومياً لمعالجة البيانات، الأتمتة، والتحليل الذكي.
                        </motion.p>
                    </div>

                    <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-end gap-6 pt-6">
                        <button
                            onClick={() => setCurrentView('auth')}
                            className="px-12 py-5 bg-white text-black rounded-[20px] font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:shadow-[0_25px_50px_rgba(255,255,255,0.2)]"
                        >
                            ابدأ الآن مجاناً
                        </button>
                        <button
                            onClick={() => setCurrentView('directory')}
                            className="px-12 py-5 bg-white/5 border border-white/10 text-white rounded-[20px] font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-lg"
                        >
                            استكشف الأدوات
                        </button>
                    </motion.div>
                </div>

                {/* Background Decoration */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_rgba(16,185,129,0.15),transparent_50%)] pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />
                <div className="absolute inset-0 bg-[#0F1115] mix-blend-overlay opacity-50 pointer-events-none" />
            </section>

            {/* POPULAR TOOLS GRID (PREMIUM BENTO REDESIGN) */}
            <section className="space-y-12">
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        الأدوات المختارة بعناية
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-4xl lg:text-5xl font-black text-white font-cairo tracking-tight">الأدوات الأكثر شيوعاً</h2>
                        <p className="text-slate-400 font-medium max-w-lg mx-auto">مجموعة مختارة من الأدوات التي غيرت حياة آلاف المبدعين والمبرمجين.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                    {popularTools.map((tool) => {
                        const getStyle = (cat: string) => {
                            switch (cat) {
                                case 'finance': return {
                                    text: 'text-emerald-400',
                                    bg: 'bg-emerald-500/10',
                                    glow: 'from-emerald-500/20 to-emerald-900/10',
                                    border: 'group-hover:border-emerald-500/40'
                                };
                                case 'pdf': return {
                                    text: 'text-rose-400',
                                    bg: 'bg-rose-500/10',
                                    glow: 'from-rose-500/20 to-rose-900/10',
                                    border: 'group-hover:border-rose-500/40'
                                };
                                case 'text': return {
                                    text: 'text-purple-400',
                                    bg: 'bg-purple-500/10',
                                    glow: 'from-purple-500/20 to-purple-900/10',
                                    border: 'group-hover:border-purple-500/40'
                                };
                                case 'time': return {
                                    text: 'text-amber-400',
                                    bg: 'bg-amber-500/10',
                                    glow: 'from-amber-500/20 to-amber-900/10',
                                    border: 'group-hover:border-amber-500/40'
                                };
                                case 'developer': return {
                                    text: 'text-blue-400',
                                    bg: 'bg-blue-500/10',
                                    glow: 'from-blue-500/20 to-blue-900/10',
                                    border: 'group-hover:border-blue-500/40'
                                };
                                default: return {
                                    text: 'text-brand-primary',
                                    bg: 'bg-brand-primary/10',
                                    glow: 'from-brand-primary/20 to-brand-primary/5',
                                    border: 'group-hover:border-brand-primary/40'
                                };
                            }
                        };
                        const style = getStyle(tool.cat);

                        return (
                            <motion.div
                                key={tool.id}
                                variants={itemVariants}
                                whileHover={{ y: -12 }}
                                onClick={() => launchTool(tool.id)}
                                className={`relative group p-1 lg:p-1.5 rounded-[40px] bg-white/5 border border-white/5 overflow-hidden transition-all duration-700 cursor-pointer ${style.border} hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]`}
                            >
                                <div className="relative overflow-hidden rounded-[36px] bg-[#0F1115] p-8 lg:p-10 h-full flex flex-col items-start bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${style.glow} opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />

                                    <div className="relative z-10 flex items-start justify-between w-full mb-10">
                                        <div className={`w-16 h-16 rounded-[24px] ${style.bg} border border-white/10 flex items-center justify-center ${style.text} group-hover:scale-110 transition-transform duration-700 shadow-xl group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]`}>
                                            <ToolIcon icon={tool.icon} className="w-8 h-8" />
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-wider text-slate-500">
                                            <span className={`w-1.5 h-1.5 rounded-full ${style.text.replace('text', 'bg')} animate-pulse`} />
                                            شائع الآن
                                        </div>
                                    </div>

                                    <div className="relative z-10 flex-1 flex flex-col items-start text-right w-full space-y-4">
                                        <h3 className="text-2xl lg:text-3xl font-black text-white font-cairo leading-none tracking-tight group-hover:text-white transition-colors">{tool.titleAr || tool.title}</h3>
                                        <p className="text-slate-400 font-medium font-cairo line-clamp-3 text-base lg:text-lg leading-relaxed">
                                            {tool.descAr || tool.desc}
                                        </p>
                                    </div>

                                    <div className="relative z-10 mt-10 pt-8 border-t border-white/5 w-full flex items-center justify-between">
                                        <div className="flex items-center gap-2.5 text-xs font-black uppercase text-slate-500 tracking-[0.1em]">
                                            <Users className="w-4 h-4" />
                                            <span>+12,000 مستخدم</span>
                                        </div>
                                        <div className={`w-10 h-10 rounded-2xl ${style.bg} flex items-center justify-center ${style.text} opacity-0 group-hover:opacity-100 group-hover:-translate-x-0 -translate-x-6 transition-all duration-700 ease-out shadow-lg`}>
                                            <ArrowLeft className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* REGISTER CTA - COMPACT STYLE */}
            <section className="relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-[#0F1115] group shadow-[0_20px_100px_rgba(0,0,0,0.3)]">
                <div className="flex flex-col md:flex-row items-stretch min-h-[140px]">
                    {/* Timer Badge (Left) */}
                    <div className="relative w-full md:w-[280px] bg-white/[0.02] flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-white/10 group-hover:bg-white/[0.05] transition-colors duration-500">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-5 h-5 text-brand-primary animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">ينتهي العرض خلال</span>
                        </div>
                        <div className="text-3xl font-black font-inter tracking-widest text-white tabular-nums">
                            {formatTime(timeLeft)}
                        </div>
                    </div>

                    <div className="flex-1 p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
                        <div className="flex items-center gap-8 text-right w-full md:w-auto z-10">
                            <div className="hidden lg:flex w-20 h-20 rounded-3xl bg-brand-primary/10 border border-brand-primary/20 items-center justify-center shrink-0">
                                <Zap className="w-10 h-10 text-brand-primary" />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-2xl lg:text-3xl font-black text-white font-cairo leading-none">
                                    استمتع بخصم <span className="text-brand-primary">50%</span> على بريميوم
                                </h2>
                                <p className="text-slate-400 text-base font-medium font-cairo">
                                    احصل على وصول كامل لجميع الأدوات المتقدمة والذكية بضغطة زر واحدة.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setCurrentView('auth')}
                            className="relative z-10 bg-brand-primary text-black font-black px-12 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-brand-primary/20 whitespace-nowrap w-full md:w-auto text-xl"
                        >
                            سجل حسابك الآن
                        </button>
                    </div>
                </div>
            </section>

            {/* WHY RI88 SECTION */}
            <div className="py-12 space-y-12">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                        <Star className="w-3 h-3 text-brand-primary" />
                        <span>PREMIUM EXPERIENCE</span>
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-black text-white font-cairo">لماذا RI88 PRO؟</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg lg:text-xl font-cairo leading-relaxed">
                        منصة متكاملة صممت لتعمل معك وبسرعة البرق، مع التركيز التام على الخصوصية والكفاءة في الأداء.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {[
                        {
                            icon: Zap,
                            title: "سرعة البرق",
                            desc: "معالجة فورية للبيانات محلياً على جهازك بدون أي تأخير، مما يضمن تجربة سلسة وسريعة.",
                            gradient: "from-emerald-500/20 to-teal-500/5",
                            iconColor: "text-emerald-400"
                        },
                        {
                            icon: Shield,
                            title: "خصوصية تامة",
                            desc: "بياناتك ملكك وحدك. لا نقوم بتخزين أي مدخلات أو ملفات، كل شيء يتم معالجته في متصفحك.",
                            gradient: "from-blue-500/20 to-indigo-500/5",
                            iconColor: "text-blue-400"
                        },
                        {
                            icon: Grid3X3,
                            title: "تعدد المهام",
                            desc: "نظام نوافذ متطور يتيح لك تشغيل عدة أدوات في وقت واحد لزيادة إنتاجيتك بشكل غير مسبوق.",
                            gradient: "from-purple-500/20 to-violet-500/5",
                            iconColor: "text-purple-400"
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className="relative group p-10 rounded-[40px] bg-[#0F1115] border border-white/5 overflow-hidden transition-all duration-500"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                            <div className="relative z-10 flex flex-col items-start gap-8 text-right h-full">
                                <div className={`w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center ${feature.iconColor} group-hover:scale-110 transition-transform duration-700 shadow-2xl`}>
                                    <feature.icon className="w-8 h-8" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black text-white font-cairo">{feature.title}</h3>
                                    <p className="text-slate-400 leading-relaxed font-medium font-cairo text-base lg:text-lg">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* FINAL SECTION CTA */}
                <motion.div
                    variants={itemVariants}
                    className="w-full relative overflow-hidden rounded-[40px] bg-[#0F1115] border border-white/10 p-12 lg:p-16 group"
                >
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-700" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-right">
                        <div className="space-y-6 max-w-3xl">
                            <h2 className="text-4xl lg:text-5xl font-black text-white font-cairo leading-tight">
                                هل أنت مستعد لتجربة <br /> <span className="text-brand-primary">الجيل القادم</span> من الأدوات؟
                            </h2>
                            <p className="text-slate-400 text-lg lg:text-xl font-medium font-cairo leading-relaxed">
                                أنشئ حسابك المجاني الآن وانضم لآلاف المبدعين الذين اختاروا RI88 PRO لتطوير أعمالهم.
                            </p>
                        </div>
                        <button
                            onClick={() => setCurrentView('auth')}
                            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black text-xl hover:bg-emerald-500 transition-all shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:shadow-[0_25px_50px_rgba(16,185,129,0.5)]"
                        >
                            <span>ابدأ رحلتك الآن</span>
                            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default VisitorLanding;
