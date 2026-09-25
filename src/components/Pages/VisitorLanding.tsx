"use client";
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Zap, ArrowLeft, ShieldCheck, Globe,
    Calculator, Percent, Wallet, ArrowRightLeft, Landmark, Coins,
    Sparkles, ChevronLeft, Star, CheckCircle2, Lock, Rocket,
    Brain, TrendingUp, Users, BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { useVisitorLanding } from '@/hooks/useVisitorLanding';
import ThemeToggle from '@/components/ui/ThemeToggle';

const ToolIcon = ({ icon, className }: { icon: string; className?: string }) => {
    const icons: Record<string, React.ElementType> = {
        calculator: Calculator, percent: Percent, wallet: Wallet,
        'arrow-right-left': ArrowRightLeft, landmark: Landmark, 'hand-coins': Coins,
    };
    const Icon = icons[icon] || Zap;
    return <Icon className={className} />;
};

const CountUp = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
    const [val, setVal] = useState(0);
    const [mounted, setMounted] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        setMounted(true);
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            let start = 0;
            const step = () => {
                start += Math.ceil(end / 40);
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

    return (
        <span ref={ref} suppressHydrationWarning>
            {mounted ? val.toLocaleString() : '0'}{suffix}
        </span>
    );
};

const VisitorLanding = () => {
    const { popularTools, launchTool, handleStartFree } = useVisitorLanding();

    const steps = [
        { num: '01', title: 'سجّل حسابك', desc: 'في 30 ثانية — بريدك الإلكتروني فقط، لا بطاقة مطلوبة.', icon: Rocket },
        { num: '02', title: 'اختر أداتك', desc: 'من +50 أداة مالية، تحليلية وإنتاجية مصممة للمحترف.', icon: Brain },
        { num: '03', title: 'احصل على النتائج', desc: 'نتائج فورية ودقيقة. صادّر وشارك واستمر بالعمل.', icon: TrendingUp },
    ];

    const bigStats = [
        { val: 50, suffix: '+', label: 'أداة ذكية', sub: 'مالية، تحليلية، إنتاجية' },
        { val: 1000, suffix: '+', label: 'مستخدم نشط', sub: 'في 12+ دولة عربية' },
        { val: 99, suffix: '%', label: 'رضا المستخدمين', sub: 'تقييم 4.9 من 5' },
    ];

    const whyUs = [
        { icon: ShieldCheck, title: 'خصوصية تامة', desc: 'بياناتك لا تُخزَّن ولا تُشارَك. تشفير AES-256 من طرف لطرف.', color: 'text-cyan-400', bg: 'bg-cyan-400/8 border-cyan-400/15' },
        { icon: Zap, title: 'سرعة استثنائية', desc: 'استجابة أقل من 100ms لكل أداة. لا انتظار، لا تأخير.', color: 'text-yellow-400', bg: 'bg-yellow-400/8 border-yellow-400/15' },
        { icon: Globe, title: 'عربي 100%', desc: 'مصمم من الألف للياء للمستخدم العربي. RTL، عملات، لوائح محلية.', color: 'text-brand-primary', bg: 'bg-brand-primary/8 border-brand-primary/15' },
        { icon: BarChart3, title: 'تحليلات متقدمة', desc: 'رؤى تحليلية فورية لمساعدتك في اتخاذ قرارات ذكية.', color: 'text-violet-400', bg: 'bg-violet-400/8 border-violet-400/15' },
    ];

    const plans = [
        { name: 'مجاني', badge: null, price: '0', period: 'للأبد', cta: 'ابدأ مجاناً', primary: false, features: ['5 أدوات أساسية', 'استخدام محدود', 'دعم مجتمعي'] },
        { name: 'برو', badge: 'الأكثر اختياراً', price: '49', period: 'شهرياً', cta: 'جرّب مجاناً 14 يوم', primary: true, features: ['جميع الأدوات (50+)', 'استخدام غير محدود', 'دعم أولوية 24/7', 'تصدير البيانات', 'تكامل API'] },
    ];

    return (
        <div className="bg-brand-bg min-h-screen text-text-primary overflow-x-hidden transition-colors" dir="rtl">

            {/* ── MESH BACKGROUND ── */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[900px] h-[600px] opacity-30"
                    style={{ background: 'radial-gradient(ellipse at top right, rgba(16,185,129,0.15) 0%, transparent 60%)' }} />
                <div className="absolute bottom-0 left-0 w-[700px] h-[500px] opacity-20"
                    style={{ background: 'radial-gradient(ellipse at bottom left, rgba(99,102,241,0.15) 0%, transparent 60%)' }} />
            </div>

            {/* ── NAV ── */}
            <nav className="relative z-50 border-b border-border-subtle bg-surface-base/80 backdrop-blur-xl sticky top-0 transition-colors">
                <div className="max-w-7xl mx-auto px-5 sm:px-10 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center font-black text-white text-sm">R</div>
                        <span className="font-black text-xl tracking-tight text-text-primary">RI88</span>
                        <span className="hidden sm:block px-2 py-0.5 text-[9px] font-black rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20 uppercase tracking-widest">beta</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-text-muted text-sm font-medium">
                        {[['#how', 'كيف يعمل'], ['#tools', 'الأدوات'], ['#pricing', 'الأسعار']].map(([href, label]) => (
                            <a key={href} href={href} className="hover:text-text-primary transition-colors">{label}</a>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeToggle className="w-9 h-9" />
                        <Link href="/auth" className="hidden sm:block px-4 py-2 text-sm font-semibold text-text-muted hover:text-text-primary transition-colors">دخول</Link>
                        <Link href="/auth" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-brand-primary hover:bg-brand-primary/90 text-white transition-all active:scale-95 shadow-lg shadow-brand-primary/20">
                            ابدأ مجاناً
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section className="relative z-10 pt-16 sm:pt-24 pb-20 px-5 sm:px-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                        {/* Left: Text */}
                        <div className="flex-1 text-right space-y-8">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-raised border border-border-subtle text-sm font-medium text-text-muted mb-6 shadow-sm">
                                    <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                                    في تشغيل تجريبي · سجّل الآن مجاناً
                                </div>
                                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-text-primary">
                                    المنصة التي<br />
                                    <span className="text-brand-primary">تغني عن</span><br />
                                    20 تطبيق آخر
                                </h1>
                            </motion.div>

                            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
                                className="text-text-muted text-xl leading-relaxed max-w-lg mr-auto">
                                أكثر من <strong className="text-text-primary font-bold">50 أداة ذكية</strong> في مكان واحد.
                                حاسبات مالية، تحليلات فورية، وذكاء اصطناعي — كلها مجانية للبدء.
                            </motion.p>

                            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
                                className="flex flex-wrap gap-3 justify-end">
                                <button onClick={handleStartFree}
                                    className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-base bg-brand-primary hover:bg-brand-primary/90 text-white transition-all hover:scale-105 active:scale-95 shadow-xl shadow-brand-primary/25">
                                    <Sparkles className="w-5 h-5" />
                                    ابدأ مجاناً الآن
                                </button>
                                <a href="#tools"
                                    className="flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-base text-text-primary border border-border-strong hover:bg-surface-glass transition-all">
                                    استكشف الأدوات
                                    <ArrowLeft className="w-4 h-4" />
                                </a>
                            </motion.div>

                            {/* Trust badges */}
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                                className="flex flex-wrap items-center gap-5 justify-end pt-2 border-t border-border-subtle">
                                <div className="flex items-center gap-2 text-sm text-text-muted">
                                    <Lock className="w-3.5 h-3.5 text-brand-primary" />
                                    بدون بطاقة ائتمانية
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-text-muted">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                                    <span className="mr-1 text-text-primary font-bold">4.9</span> تقييم
                                </div>
                                <div className="flex items-center gap-2 text-sm text-text-muted">
                                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                                    +1,000 مستخدم نشط
                                </div>
                            </motion.div>
                        </div>

                        {/* Right: Dashboard Preview Card */}
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                            className="w-full lg:w-[480px] lg:shrink-0">
                            <div className="relative">
                                {/* Glow behind card */}
                                <div className="absolute inset-0 rounded-3xl bg-brand-primary/20 blur-3xl scale-95" />
                                {/* Dashboard mockup */}
                                <div className="relative rounded-3xl border border-border-subtle bg-surface-raised overflow-hidden shadow-2xl">
                                    {/* Mockup top bar */}
                                    <div className="flex items-center gap-2 px-4 py-3 border-b border-border-subtle bg-surface-glass">
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-brand-primary/60" />
                                        </div>
                                        <div className="flex-1 text-center">
                                            <div className="inline-block px-3 py-0.5 rounded-md bg-surface-glass text-text-muted text-xs border border-border-subtle">ri88.info/pro</div>
                                        </div>
                                    </div>
                                    {/* Mockup content */}
                                    <div className="p-5 space-y-3">
                                        {/* Header row */}
                                        <div className="flex items-center justify-between">
                                            <div className="text-text-muted text-xs font-bold">لوحة التحكم</div>
                                            <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center">
                                                <span className="text-[8px] font-black text-brand-primary">R</span>
                                            </div>
                                        </div>
                                        {/* Stats row */}
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { label: 'أدوات مستخدمة', val: '12', color: 'text-brand-primary' },
                                                { label: 'توفير الوقت', val: '3h/يوم', color: 'text-cyan-500' },
                                            ].map((s, i) => (
                                                <div key={i} className="bg-surface-glass rounded-xl p-3 border border-border-subtle">
                                                    <div className={`text-xl font-black ${s.color}`}>{s.val}</div>
                                                    <div className="text-text-muted text-[10px] mt-0.5">{s.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Tool list */}
                                        <div className="space-y-2">
                                            {popularTools.slice(0, 3).map((tool, i) => (
                                                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-glass border border-border-subtle">
                                                    <div className="w-7 h-7 rounded-lg bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
                                                        <ToolIcon icon={tool.icon} className="w-3.5 h-3.5 text-brand-primary" />
                                                    </div>
                                                    <span className="text-text-primary text-xs font-bold">{tool.titleAr}</span>
                                                    <div className="mr-auto w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                                                </div>
                                            ))}
                                        </div>
                                        {/* Chart bars */}
                                        <div className="p-3 rounded-xl bg-surface-glass border border-border-subtle">
                                            <div className="text-text-muted text-[10px] mb-2 font-bold">نشاط هذا الأسبوع</div>
                                            <div className="flex items-end gap-1 h-10">
                                                {[40, 65, 50, 80, 55, 90, 70].map((h, i) => (
                                                    <div key={i} className="flex-1 rounded-sm bg-brand-primary/30 hover:bg-brand-primary/60 transition-colors"
                                                        style={{ height: `${h}%` }} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Floating badge */}
                                <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                                    className="absolute -top-4 -right-4 bg-surface-raised border border-border-subtle text-text-primary text-xs font-black px-3 py-1.5 rounded-full shadow-xl">
                                    🚀 +50 أداة
                                </motion.div>
                                <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 1 }}
                                    className="absolute -bottom-3 -left-3 bg-brand-primary text-white text-xs font-black px-3 py-1.5 rounded-full shadow-xl">
                                    ✓ مجاني للبدء
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── BIG STATS ── */}
            <section className="relative z-10 py-16 border-y border-border-subtle bg-surface-glass/40">
                <div className="max-w-5xl mx-auto px-5 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-border-subtle">
                    {bigStats.map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                            className="px-8 py-8 sm:py-6 text-center">
                            <div className="text-5xl sm:text-6xl font-black text-brand-primary font-mono mb-1">
                                <CountUp end={s.val} suffix={s.suffix} />
                            </div>
                            <div className="text-text-primary font-bold text-lg">{s.label}</div>
                            <div className="text-text-muted text-sm mt-1">{s.sub}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section id="how" className="relative z-10 py-24 px-5 sm:px-10 max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-brand-primary text-sm font-bold uppercase tracking-widest mb-3">كيف يعمل</p>
                    <h2 className="text-4xl sm:text-5xl font-black text-text-primary">في 3 خطوات فقط</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
                    {/* Connecting line */}
                    <div className="hidden sm:block absolute top-16 right-[17%] left-[17%] h-px bg-gradient-to-l from-brand-primary/20 via-brand-primary/50 to-brand-primary/20" />
                    {steps.map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                            className="relative text-center p-6 rounded-3xl bg-surface-raised border border-border-subtle shadow-sm">
                            <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/25 flex items-center justify-center mx-auto mb-5 relative z-10">
                                <s.icon className="w-7 h-7 text-brand-primary" />
                                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-primary text-white text-[10px] font-black flex items-center justify-center shadow">{i + 1}</div>
                            </div>
                            <h3 className="text-text-primary font-black text-xl mb-2">{s.title}</h3>
                            <p className="text-text-muted text-sm leading-relaxed max-w-[200px] mx-auto">{s.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── WHY US ── */}
            <section className="relative z-10 py-24 px-5 sm:px-10 bg-surface-glass/50 border-y border-border-subtle">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-brand-primary text-sm font-bold uppercase tracking-widest mb-3">المميزات</p>
                        <h2 className="text-4xl sm:text-5xl font-black text-text-primary">لماذا RI88 ؟</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {whyUs.map((f, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                                whileHover={{ y: -4 }}
                                className="p-6 rounded-3xl border border-border-subtle bg-surface-raised shadow-sm text-right hover:border-brand-primary/30 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-surface-glass border border-border-subtle flex items-center justify-center mb-4">
                                    <f.icon className={`w-5 h-5 ${f.color}`} />
                                </div>
                                <h3 className="text-text-primary font-bold text-lg mb-2">{f.title}</h3>
                                <p className="text-text-muted text-sm leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TOOLS ── */}
            <section id="tools" className="relative z-10 py-24 px-5 sm:px-10 max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <p className="text-brand-primary text-sm font-bold uppercase tracking-widest mb-2">الأدوات</p>
                        <h2 className="text-3xl sm:text-4xl font-black text-text-primary">جرّب الآن</h2>
                    </div>
                    <Link href="/auth" className="hidden sm:flex items-center gap-2 text-text-muted hover:text-text-primary text-sm font-bold transition-colors group">
                        <span>الكل (50+)</span>
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {popularTools.map((tool, i) => (
                        <motion.div key={tool.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                            onClick={() => launchTool(tool.id)}
                            whileHover={{ y: -4 }}
                            className="group p-6 rounded-3xl border border-border-subtle bg-surface-raised hover:border-brand-primary/40 hover:bg-surface-glass cursor-pointer transition-all duration-300 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <ToolIcon icon={tool.icon} className="w-5 h-5 text-brand-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-text-primary font-bold text-base group-hover:text-brand-primary transition-colors">{tool.titleAr}</h3>
                                    <p className="text-text-muted text-xs mt-1 leading-relaxed line-clamp-2">{tool.descAr}</p>
                                </div>
                                <div className="shrink-0 w-7 h-7 rounded-full border border-border-subtle group-hover:border-brand-primary group-hover:bg-brand-primary flex items-center justify-center transition-all mt-0.5">
                                    <ArrowLeft className="w-3.5 h-3.5 text-text-muted group-hover:text-white transition-colors" />
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
                                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20">مجانية</span>
                                <span className="text-[10px] text-text-muted font-medium">استخدام فوري</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── PRICING ── */}
            <section id="pricing" className="relative z-10 py-24 px-5 sm:px-10 max-w-4xl mx-auto">
                <div className="text-center mb-14">
                    <p className="text-brand-primary text-sm font-bold uppercase tracking-widest mb-3">الأسعار</p>
                    <h2 className="text-4xl sm:text-5xl font-black mb-3 text-text-primary">بسيط وشفاف</h2>
                    <p className="text-text-muted text-lg">لا رسوم خفية. لا التزامات. ابدأ مجاناً.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                    {plans.map((plan, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                            className={`relative rounded-3xl p-8 border transition-all ${plan.primary ? 'border-2 border-brand-primary bg-surface-raised shadow-xl shadow-brand-primary/10' : 'border-border-subtle bg-surface-raised shadow-sm'}`}>
                            {plan.badge && (
                                <div className="absolute -top-4 right-8 px-5 py-1.5 rounded-full bg-brand-primary text-white text-xs font-black shadow-md">
                                    {plan.badge}
                                </div>
                            )}
                            <div className="mb-8">
                                <div className="text-text-muted text-sm font-medium mb-1">{plan.name}</div>
                                <div className="flex items-end gap-2">
                                    <span className={`text-5xl font-black ${plan.primary ? 'text-brand-primary' : 'text-text-primary'}`}>{plan.price}</span>
                                    <div className="text-text-muted text-sm mb-2">ر.س / {plan.period}</div>
                                </div>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((f, j) => (
                                    <li key={j} className="flex items-center gap-3 text-sm text-text-primary">
                                        <CheckCircle2 className="w-4 h-4 shrink-0 text-brand-primary" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/auth"
                                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95 ${plan.primary
                                    ? 'bg-brand-primary hover:bg-brand-primary/90 text-white shadow-lg shadow-brand-primary/20'
                                    : 'border border-border-strong text-text-primary hover:bg-surface-glass'}`}>
                                {plan.cta}
                                <ChevronLeft className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section className="relative z-10 mx-4 sm:mx-10 mb-10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700" />
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)' }} />
                <div className="relative text-center py-20 px-6 text-white">
                    <h2 className="text-4xl sm:text-5xl font-black mb-4 leading-tight text-white">
                        جاهز ترتقي بإنتاجيتك؟
                    </h2>
                    <p className="text-white/80 text-xl mb-10 max-w-lg mx-auto">
                        انضم لآلاف المحترفين الذين يستخدمون RI88 يومياً.
                    </p>
                    <button onClick={handleStartFree}
                        className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl font-black text-lg bg-white text-emerald-800 hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all shadow-2xl">
                        <Sparkles className="w-5 h-5" />
                        ابدأ مجاناً — الآن
                    </button>
                    <p className="text-white/60 text-sm mt-5">بدون بطاقة · بدون إعلانات · 100% خصوصية</p>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="relative z-10 border-t border-border-subtle py-8 px-5 sm:px-10 bg-surface-base">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-brand-primary flex items-center justify-center font-black text-white text-xs">R</div>
                        <span className="font-bold text-text-primary">RI88</span>
                        <span className="text-text-muted">© 2025</span>
                    </div>
                    <p className="text-text-muted text-sm">صُنع بـ ❤️ للمحترف العربي</p>
                    <div className="flex gap-5 text-text-muted text-sm">
                        <Link href="/auth" className="hover:text-text-primary transition-colors">تسجيل دخول</Link>
                        <Link href="/auth" className="hover:text-text-primary transition-colors">إنشاء حساب</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default VisitorLanding;
