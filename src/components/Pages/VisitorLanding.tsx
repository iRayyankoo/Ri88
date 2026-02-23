"use client";
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Zap, ArrowLeft, ShieldCheck, Globe,
    Calculator, Percent, Wallet, ArrowRightLeft, Landmark, Coins,
    Sparkles, ChevronLeft, Star, TrendingUp, Users,
    CheckCircle2, Lock, Rocket, BarChart3, Brain, Layers,
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useVisitorLanding } from '@/hooks/useVisitorLanding';

const ToolIcon = ({ icon, className }: { icon: string; className?: string }) => {
    const icons: Record<string, React.ElementType> = {
        calculator: Calculator, percent: Percent, wallet: Wallet,
        'arrow-right-left': ArrowRightLeft, landmark: Landmark, 'hand-coins': Coins,
    };
    const Icon = icons[icon] || Zap;
    return <Icon className={className} />;
};

/* ── Animated counter ── */
const CountUp = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
    const [val, setVal] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            let start = 0;
            const step = () => {
                start += Math.ceil(end / 50);
                if (start >= end) { setVal(end); return; }
                setVal(start);
                requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            observer.disconnect();
        });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end]);
    return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
};

/* ── Marquee component ── */
const Marquee = ({ items }: { items: string[] }) => (
    <div className="relative overflow-hidden w-full py-4 border-y border-white/5">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#050508] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#050508] to-transparent z-10" />
        <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="flex gap-12 whitespace-nowrap"
        >
            {[...items, ...items].map((item, i) => (
                <span key={i} className="text-slate-500 text-sm font-bold flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/60 inline-block" />
                    {item}
                </span>
            ))}
        </motion.div>
    </div>
);

/* ── Spotlight card ── */
const SpotlightCard = ({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState({ x: 0, y: 0, opacity: 0 });
    const handleMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { left, top } = ref.current.getBoundingClientRect();
        setPos({ x: e.clientX - left, y: e.clientY - top, opacity: 1 });
    };
    return (
        <div ref={ref} onMouseMove={handleMove} onMouseLeave={() => setPos(p => ({ ...p, opacity: 0 }))}
            onClick={onClick}
            className={`relative overflow-hidden ${className}`}>
            <div style={{ background: `radial-gradient(300px circle at ${pos.x}px ${pos.y}px, rgba(16,185,129,0.08), transparent 70%)`, opacity: pos.opacity, transition: 'opacity 0.3s' }}
                className="absolute inset-0 pointer-events-none z-0" />
            {children}
        </div>
    );
};

const VisitorLanding = () => {
    const { popularTools, launchTool, handleStartFree } = useVisitorLanding();
    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
    const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

    const marqueeItems = [
        'حساب الزكاة', 'تحويل العملات', 'محاكي الضريبة', 'تحليل الأسهم',
        'حاسبة الأرباح', 'قاعدة الفائدة', 'أداة الميزانية', 'مقارنة البنوك',
        'حاسبة الاستثمار', 'تحليل المحفظة', 'حاسبة القرض', 'معدل الحسم'
    ];

    const bentoFeatures = [
        {
            icon: Brain, title: 'ذكاء اصطناعي متقدم', desc: 'أكثر من 50 أداة مدعومة بـ AI — تعمل لك وليس بدلاً منك',
            className: 'col-span-2 row-span-1', gradient: 'from-brand-primary/20 via-transparent to-transparent',
            accent: 'border-brand-primary/25', iconColor: 'text-brand-primary', size: 'large'
        },
        {
            icon: ShieldCheck, title: 'أمان عسكري', desc: 'تشفير AES-256',
            className: 'col-span-1 row-span-1', gradient: 'from-cyan-500/15 via-transparent to-transparent',
            accent: 'border-cyan-500/20', iconColor: 'text-cyan-400', size: 'small'
        },
        {
            icon: Rocket, title: 'سرعة فائقة', desc: '< 100ms استجابة',
            className: 'col-span-1 row-span-1', gradient: 'from-orange-500/15 via-transparent to-transparent',
            accent: 'border-orange-500/20', iconColor: 'text-orange-400', size: 'small'
        },
        {
            icon: Globe, title: 'متاح عالمياً', desc: '12+ دولة تستخدمه. بدون قيود جغرافية أو تعقيدات',
            className: 'col-span-1 row-span-1', gradient: 'from-violet-500/15 via-transparent to-transparent',
            accent: 'border-violet-500/20', iconColor: 'text-violet-400', size: 'medium'
        },
        {
            icon: Layers, title: 'كل شيء في مكان واحد', desc: 'لا داعي لـ 20 تطبيق مختلف. كل ما تحتاجه هنا',
            className: 'col-span-2 row-span-1', gradient: 'from-emerald-500/15 via-transparent to-transparent',
            accent: 'border-emerald-500/20', iconColor: 'text-emerald-400', size: 'large'
        },
        {
            icon: BarChart3, title: 'تحليلات ذكية', desc: 'رؤى فورية',
            className: 'col-span-1 row-span-1', gradient: 'from-pink-500/15 via-transparent to-transparent',
            accent: 'border-pink-500/20', iconColor: 'text-pink-400', size: 'small'
        },
    ];

    const plans = [
        {
            name: 'مجاني', nameEn: 'Free', price: '0', currency: 'ر.س',
            color: 'border-white/8 bg-white/[0.02]', badge: null, cta: 'ابدأ مجاناً',
            features: ['5 أدوات أساسية', 'استخدام محدود يومياً', 'دعم مجتمعي', 'واجهة عربية كاملة']
        },
        {
            name: 'برو', nameEn: 'Pro', price: '49', currency: 'ر.س',
            color: 'border-brand-primary/30 bg-gradient-to-b from-brand-primary/10 to-transparent',
            badge: '⚡ الأكثر شيوعاً', cta: 'ابدأ البرو',
            features: ['جميع الأدوات (+50)', 'غير محدود', 'دعم أولوية 24/7', 'تصدير البيانات', 'تكامل API', 'تحليلات متقدمة']
        },
    ];

    return (
        <div className="relative bg-[#050508] overflow-x-hidden" dir="rtl">

            {/* ── GRID PATTERN BG ── */}
            <div className="fixed inset-0 z-0 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            {/* ── AMBIENT GLOWS ── */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full blur-[200px] opacity-25 bg-brand-primary" />
                <div className="absolute top-[60%] -left-20 w-[500px] h-[500px] rounded-full blur-[180px] opacity-15 bg-cyan-500" />
            </div>

            {/* ── STICKY NAV ── */}
            <nav className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#050508]/70 backdrop-blur-2xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-brand-primary flex items-center justify-center font-black text-white text-sm ring-2 ring-brand-primary/30">R</div>
                        <span className="text-white font-black text-xl tracking-tight">RI88</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-brand-primary/15 text-brand-primary border border-brand-primary/20 uppercase tracking-widest">BETA</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-6 text-slate-500 text-sm font-medium">
                        <a href="#features" className="hover:text-white transition-colors">المميزات</a>
                        <a href="#tools" className="hover:text-white transition-colors">الأدوات</a>
                        <a href="#pricing" className="hover:text-white transition-colors">الأسعار</a>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link href="/auth" className="hidden sm:block px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors">
                            دخول
                        </Link>
                        <Link href="/auth" className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-sm font-bold bg-brand-primary hover:bg-brand-primary/90 text-white transition-all active:scale-95 shadow-lg shadow-brand-primary/20">
                            <Sparkles className="w-3.5 h-3.5" />
                            ابدأ مجاناً
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ── HERO ── */}
            <motion.section style={{ opacity: heroOpacity, scale: heroScale }} className="relative z-10 pt-24 sm:pt-32 pb-20 px-4 sm:px-8 max-w-7xl mx-auto text-center">

                {/* Glow ring behind heading */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[100px] bg-brand-primary/10 pointer-events-none" />

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-primary/25 bg-brand-primary/8 text-brand-primary text-xs font-bold mb-10">
                        <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                        منصة الأدوات الذكية #1 في الشرق الأوسط
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl sm:text-7xl lg:text-8xl font-black text-white font-cairo leading-[1.05] tracking-tight mb-6"
                >
                    كل الأدوات
                    <br />
                    <span className="relative inline-block">
                        <span className="bg-gradient-to-r from-brand-primary via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                            في مكان واحد
                        </span>
                        <span className="absolute -bottom-2 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-brand-primary via-cyan-400 to-emerald-400 opacity-40" />
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
                >
                    RI88 منصة أدوات ذكاء اصطناعي متكاملة للمحترف العربي.
                    أكثر من <strong className="text-white">50 أداة</strong> مالية وتحليلية — كلها <strong className="text-white">مجانية للبدء</strong>.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
                >
                    <button onClick={handleStartFree}
                        className="group relative flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-lg bg-brand-primary text-white shadow-2xl shadow-brand-primary/30 hover:scale-105 active:scale-95 transition-all overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Sparkles className="w-5 h-5" />
                        <span>ابدأ مجاناً</span>
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <a href="#tools" className="flex items-center gap-2 px-8 py-4 rounded-2xl text-slate-400 font-bold hover:text-white transition-colors border border-white/8 hover:border-white/15 backdrop-blur-sm">
                        <span>استكشف الأدوات</span>
                        <ArrowLeft className="w-4 h-4" />
                    </a>
                </motion.div>

                {/* Social proof row */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500"
                >
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2 rtl:space-x-reverse">
                            {['#10B981', '#06B6D4', '#8B5CF6', '#F59E0B'].map((c, i) => (
                                <div key={i} className="w-7 h-7 rounded-full border-2 border-[#050508] flex items-center justify-center text-[9px] font-black text-white"
                                    style={{ background: c }}>
                                    {['أ', 'س', 'م', 'ف'][i]}
                                </div>
                            ))}
                        </div>
                        <span>+1,000 مستخدم نشط</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                        <span className="mr-1 font-bold text-white">4.9</span>
                        <span>/ 5</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>بدون بطاقة ائتمانية</span>
                    </div>
                </motion.div>
            </motion.section>

            {/* ── MARQUEE ── */}
            <div className="relative z-10">
                <Marquee items={marqueeItems} />
            </div>

            {/* ── STATS STRIP ── */}
            <section className="relative z-10 py-16 px-4 max-w-5xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { val: 50, suffix: '+', label: 'أداة ذكية', icon: Zap, color: 'text-brand-primary', bg: 'bg-brand-primary/10 border-brand-primary/20' },
                        { val: 1000, suffix: '+', label: 'مستخدم نشط', icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
                        { val: 99, suffix: '%', label: 'رضا المستخدمين', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                        { val: 0, suffix: '', label: 'إعلانات', icon: ShieldCheck, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
                    ].map((s, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                            className="rounded-2xl border bg-white/[0.02] p-6 text-center backdrop-blur-sm border-white/8">
                            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mx-auto mb-3 ${s.bg}`}>
                                <s.icon className={`w-5 h-5 ${s.color}`} />
                            </div>
                            <div className={`text-3xl font-black font-mono ${s.color}`}>
                                {s.val === 0 ? '0' : <CountUp end={s.val} suffix={s.suffix} />}
                            </div>
                            <div className="text-slate-500 text-xs font-bold mt-1 tracking-wide">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── BENTO FEATURES ── */}
            <section id="features" className="relative z-10 py-20 px-4 sm:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                        className="text-brand-primary text-sm font-bold uppercase tracking-widest mb-3">
                        لماذا RI88
                    </motion.p>
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="text-3xl sm:text-5xl font-black text-white font-cairo">
                        مصمم للمحترف العربي
                    </motion.h2>
                </div>

                <div className="grid grid-cols-3 grid-rows-2 gap-4 auto-rows-fr" style={{ minHeight: '420px' }}>
                    {bentoFeatures.map((f, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                            className={`${f.className}`}
                        >
                            <SpotlightCard className={`h-full rounded-3xl border ${f.accent} bg-gradient-to-br ${f.gradient} bg-[rgba(10,10,16,0.6)] backdrop-blur-sm p-6 sm:p-8 flex flex-col justify-between`}>
                                <div className={`w-12 h-12 rounded-2xl border ${f.accent} bg-white/5 flex items-center justify-center mb-4`}>
                                    <f.icon className={`w-6 h-6 ${f.iconColor}`} />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-lg sm:text-xl font-cairo mb-2">{f.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── TOOLS SHOWCASE ── */}
            <section id="tools" className="relative z-10 py-20 px-4 sm:px-8 max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <p className="text-brand-primary text-sm font-bold uppercase tracking-widest mb-2">الأدوات</p>
                        <h2 className="text-3xl sm:text-4xl font-black text-white font-cairo">جرّب مباشرة الآن</h2>
                    </div>
                    <Link href="/auth" className="hidden sm:flex items-center gap-2 text-slate-400 hover:text-white text-sm font-bold transition-colors">
                        شاهد الكل (50+)
                        <ChevronRight className="w-4 h-4 rotate-180" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {popularTools.map((tool, i) => (
                        <motion.div key={tool.id}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                        >
                            <SpotlightCard className="h-full rounded-3xl border border-white/8 hover:border-brand-primary/30 bg-white/[0.02] backdrop-blur-sm transition-all duration-300 cursor-pointer group"
                                onClick={() => launchTool(tool.id)}>
                                <div className="p-6 flex flex-col gap-4 h-full" onClick={() => launchTool(tool.id)}>
                                    <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <ToolIcon icon={tool.icon} className="w-6 h-6 text-brand-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-black text-lg font-cairo group-hover:text-brand-primary transition-colors">{tool.titleAr}</h3>
                                        <p className="text-slate-500 text-sm mt-1 leading-relaxed line-clamp-2">{tool.descAr}</p>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">مجانية</span>
                                        <div className="w-8 h-8 rounded-full border border-white/10 group-hover:bg-brand-primary group-hover:border-brand-primary flex items-center justify-center transition-all">
                                            <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── PRICING ── */}
            <section id="pricing" className="relative z-10 py-20 px-4 sm:px-8 max-w-4xl mx-auto">
                <div className="text-center mb-14">
                    <p className="text-brand-primary text-sm font-bold uppercase tracking-widest mb-3">الأسعار</p>
                    <h2 className="text-3xl sm:text-5xl font-black text-white font-cairo mb-3">باقات تناسب الجميع</h2>
                    <p className="text-slate-400">ابدأ مجاناً — طوّر تجربتك متى تريد</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                    {plans.map((plan, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                            className={`relative rounded-3xl border p-8 ${plan.color} ${i === 1 ? 'shadow-2xl shadow-brand-primary/10' : ''}`}
                        >
                            {plan.badge && (
                                <div className="absolute -top-4 right-8 px-5 py-1.5 rounded-full bg-brand-primary text-white text-xs font-black shadow-lg shadow-brand-primary/30">
                                    {plan.badge}
                                </div>
                            )}
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{plan.nameEn}</p>
                                    <h3 className="text-white font-black text-2xl">{plan.name}</h3>
                                </div>
                                <div className="text-right">
                                    <span className={`text-4xl font-black ${i === 1 ? 'text-brand-primary' : 'text-white'}`}>{plan.price}</span>
                                    <span className="text-slate-500 text-sm"> {plan.currency}/شهر</span>
                                </div>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((f, j) => (
                                    <li key={j} className="flex items-center gap-3 text-sm text-slate-300">
                                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${i === 1 ? 'text-brand-primary' : 'text-emerald-400'}`} />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/auth"
                                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold transition-all active:scale-95 text-sm ${i === 1
                                    ? 'bg-brand-primary hover:bg-brand-primary/90 text-white shadow-lg shadow-brand-primary/20'
                                    : 'border border-white/10 text-white hover:bg-white/5'}`}
                            >
                                {plan.cta}
                                <ChevronLeft className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section className="relative z-10 py-32 px-4 text-center overflow-hidden">
                {/* Large glow */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[800px] h-[400px] bg-brand-primary/15 blur-[150px] rounded-full" />
                </div>
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.05) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-primary/25 bg-brand-primary/8 text-brand-primary text-xs font-bold mb-8">
                        <Rocket className="w-3.5 h-3.5" />
                        انضم اليوم — مجاناً تماماً
                    </div>
                    <h2 className="text-5xl sm:text-7xl font-black text-white font-cairo leading-tight mb-6">
                        الوقت الأفضل
                        <br />
                        <span className="bg-gradient-to-r from-brand-primary via-cyan-400 to-emerald-400 bg-clip-text text-transparent">هو الآن</span>
                    </h2>
                    <p className="text-slate-400 text-xl mb-12 max-w-lg mx-auto">
                        انضم لآلاف المحترفين الذين يستخدمون RI88 يومياً لتسريع أعمالهم وقرارتهم.
                    </p>
                    <button onClick={handleStartFree}
                        className="group relative inline-flex items-center gap-3 px-14 py-5 rounded-3xl font-black text-xl bg-brand-primary text-white shadow-2xl shadow-brand-primary/25 hover:scale-105 active:scale-95 transition-all overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Sparkles className="w-6 h-6" />
                        <span>افتح حسابك المجاني</span>
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <p className="text-slate-600 text-sm mt-6">لا بطاقة ائتمانية · لا إعلانات · خصوصية تامة</p>
                </motion.div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="relative z-10 border-t border-white/5 py-10 px-4">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-brand-primary flex items-center justify-center font-black text-white text-xs">R</div>
                        <span className="text-white font-bold">RI88</span>
                        <span className="text-slate-600">© 2025</span>
                    </div>
                    <p className="text-slate-600 text-sm">صُنع بـ ❤️ للمحترف العربي</p>
                    <div className="flex gap-6 text-slate-600 text-sm">
                        <Link href="/auth" className="hover:text-white transition-colors">تسجيل دخول</Link>
                        <Link href="/auth" className="hover:text-white transition-colors">إنشاء حساب</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default VisitorLanding;
