"use client";
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Zap, ArrowLeft, ShieldCheck, Globe,
    Calculator, Percent, Wallet, ArrowRightLeft, Landmark, Coins,
    Sparkles, ChevronLeft, Star, TrendingUp, Users, Cpu,
    CheckCircle2, Lock, Rocket, BarChart3, Brain, Layers
} from 'lucide-react';
import Link from 'next/link';
import { useVisitorLanding } from '@/hooks/useVisitorLanding';

/* ── Tool icon helper ── */
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
                start += Math.ceil(end / 60);
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

const VisitorLanding = () => {
    const { popularTools, launchTool, handleStartFree } = useVisitorLanding();
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 400], [0, -60]);

    const fadeUp: import('framer-motion').Variants = {
        hidden: { opacity: 0, y: 32 },
        visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] } })
    };

    const stats = [
        { icon: Zap, val: 50, suffix: '+', label: 'أداة ذكية', color: 'text-brand-primary' },
        { icon: Users, val: 1, suffix: 'K+', label: 'مستخدم نشط', color: 'text-cyan-400' },
        { icon: TrendingUp, val: 99, suffix: '%', label: 'رضا المستخدمين', color: 'text-emerald-400' },
        { icon: Globe, val: 12, suffix: '+', label: 'دولة تستخدمها', color: 'text-violet-400' },
    ];

    const features = [
        { icon: Brain, title: 'أدوات مدعومة بالذكاء الاصطناعي', desc: 'أكثر من 50 أداة ذكية تعمل بتقنيات GPT-4 وNLP متقدمة — جاهزة للاستخدام الفوري', color: 'from-brand-primary/20 to-brand-primary/5', border: 'border-brand-primary/20', icon_color: 'text-brand-primary' },
        { icon: ShieldCheck, title: 'أمان بمعايير عسكرية', desc: 'تشفير AES-256 من طرف إلى طرف. بياناتك لا تُخزَّن ولا تُباع لأي طرف ثالث', color: 'from-cyan-500/20 to-cyan-500/5', border: 'border-cyan-500/20', icon_color: 'text-cyan-400' },
        { icon: Rocket, title: 'سرعة خيالية', desc: 'استجابة أقل من 100ms لكل أداة. بنية تحتية موزعة على 6 مناطق جغرافية عالمياً', color: 'from-orange-500/20 to-orange-500/5', border: 'border-orange-500/20', icon_color: 'text-orange-400' },
        { icon: Layers, title: 'واجهة واحدة — كل شيء', desc: 'لا داعي للتنقل بين 20 تطبيق. كل الأدوات في مكان واحد، منظّمة ومتكاملة', color: 'from-violet-500/20 to-violet-500/5', border: 'border-violet-500/20', icon_color: 'text-violet-400' },
        { icon: BarChart3, title: 'تحليلات متقدمة', desc: 'لوحات تحكم ذكية، تقارير مخصصة، ورؤى فورية لكل مجال عمل', color: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500/20', icon_color: 'text-emerald-400' },
        { icon: Cpu, title: 'بنية متقدمة', desc: 'مبنية بـ Next.js 15، Prisma، وVercel Edge — أداء استثنائي في كل مكان', color: 'from-pink-500/20 to-pink-500/5', border: 'border-pink-500/20', icon_color: 'text-pink-400' },
    ];

    const plans = [
        {
            name: 'مجاني', price: '0', currency: 'ر.س', period: '/شهر',
            color: 'border-white/10', badge: null,
            features: ['5 أدوات أساسية', 'استخدام محدود', 'دعم مجتمعي', 'واجهة عربية كاملة']
        },
        {
            name: 'برو', price: '49', currency: 'ر.س', period: '/شهر',
            color: 'border-brand-primary/40', badge: 'الأكثر شيوعاً',
            features: ['جميع الأدوات (+50)', 'استخدام غير محدود', 'دعم أولوية 24/7', 'تصدير البيانات', 'تكامل API', 'تحليلات متقدمة']
        },
    ];

    const testimonials = [
        { name: 'أحمد الغامدي', role: 'محلل مالي', text: 'وفّر لي RI88 أكثر من 3 ساعات يومياً. الأدوات المالية احترافية جداً وسهلة الاستخدام.', stars: 5 },
        { name: 'سارة المطيري', role: 'مديرة تسويق', text: 'أخيراً وجدت منصة عربية بهذا المستوى! الواجهة نظيفة والأدوات تساعدني فعلاً في عملي.', stars: 5 },
        { name: 'فهد الشمري', role: 'مطور برمجيات', text: 'بنية تقنية متينة وسرعة ممتازة. يستحق الدعم والاشتراك بكل تأكيد.', stars: 5 },
    ];

    return (
        <div className="relative w-full bg-[#080810] overflow-x-hidden" dir="rtl">

            {/* ── AMBIENT BG ── */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[180px] opacity-20 bg-brand-primary/30" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[160px] opacity-15 bg-cyan-500/20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[140px] opacity-10 bg-violet-500/20" />
            </div>

            {/* ── STICKY NAV ── */}
            <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#080810]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-brand-primary flex items-center justify-center font-black text-white text-sm">R</div>
                        <span className="text-white font-black text-lg tracking-tight">RI88</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-brand-primary/15 text-brand-primary border border-brand-primary/20 uppercase tracking-widest">BETA</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/auth" className="px-5 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors">
                            تسجيل الدخول
                        </Link>
                        <Link href="/auth" className="px-5 py-2 rounded-xl text-sm font-bold bg-brand-primary hover:bg-brand-primary/90 text-white transition-all active:scale-95 shadow-lg shadow-brand-primary/20">
                            ابدأ مجاناً ←
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ── HERO ── */}
            <motion.section style={{ y: heroY }} className="relative z-10 pt-20 pb-32 px-4 sm:px-8 max-w-7xl mx-auto text-center">
                <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-brand-primary/30 bg-brand-primary/8 text-brand-primary text-xs font-bold mb-8">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>منصة الأدوات الذكية #1 في الشرق الأوسط</span>
                    </div>
                </motion.div>

                <motion.h1
                    initial="hidden" animate="visible" variants={fadeUp} custom={1}
                    className="text-4xl sm:text-6xl lg:text-7xl font-black text-white font-cairo leading-[1.1] tracking-tight mb-6"
                >
                    كل الأدوات التي تحتاجها
                    <br />
                    <span className="bg-gradient-to-r from-brand-primary via-cyan-400 to-brand-primary bg-clip-text text-transparent">
                        في مكان واحد
                    </span>
                </motion.h1>

                <motion.p
                    initial="hidden" animate="visible" variants={fadeUp} custom={2}
                    className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-12"
                >
                    RI88 هي منصة أدوات ذكاء اصطناعي متكاملة، مبنية للمحترفين العرب.
                    أكثر من 50 أداة مالية، تحليلية، وإنتاجية — كلها مجانية للبدء.
                </motion.p>

                <motion.div
                    initial="hidden" animate="visible" variants={fadeUp} custom={3}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <button
                        onClick={handleStartFree}
                        className="flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-lg bg-brand-primary hover:bg-brand-primary/90 text-white shadow-2xl shadow-brand-primary/30 hover:scale-105 active:scale-95 transition-all"
                    >
                        <span>ابدأ مجاناً الآن</span>
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <a href="#features" className="flex items-center gap-2 px-8 py-4 rounded-2xl text-slate-400 font-bold hover:text-white transition-colors border border-white/8 hover:border-white/15">
                        <span>استكشف المميزات</span>
                        <ArrowLeft className="w-4 h-4" />
                    </a>
                </motion.div>

                {/* Social proof */}
                <motion.div
                    initial="hidden" animate="visible" variants={fadeUp} custom={4}
                    className="mt-14 flex flex-wrap items-center justify-center gap-6 text-slate-500 text-sm"
                >
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2 rtl:space-x-reverse">
                            {['bg-brand-primary', 'bg-cyan-500', 'bg-violet-500', 'bg-emerald-500'].map((c, i) => (
                                <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-[#080810] flex items-center justify-center text-[9px] font-black text-white`}>
                                    {['أ', 'س', 'م', 'ف'][i]}
                                </div>
                            ))}
                        </div>
                        <span>+1000 مستخدم نشط</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                        <span className="mr-1">4.9/5</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-emerald-500" />
                        <span>لا يلزم بطاقة ائتمانية</span>
                    </div>
                </motion.div>
            </motion.section>

            {/* ── STATS ── */}
            <section className="relative z-10 py-16 border-y border-white/5 bg-white/[0.02]">
                <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
                    {stats.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="text-center"
                        >
                            <s.icon className={`w-6 h-6 mx-auto mb-3 ${s.color}`} />
                            <div className={`text-3xl sm:text-4xl font-black font-mono ${s.color}`}>
                                <CountUp end={s.val} suffix={s.suffix} />
                            </div>
                            <div className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section id="features" className="relative z-10 py-24 px-4 sm:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="text-3xl sm:text-5xl font-black text-white font-cairo mb-4"
                    >
                        لماذا <span className="text-brand-primary">RI88</span> ؟
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                        className="text-slate-400 text-lg max-w-xl mx-auto"
                    >
                        منصة مصممة من الصفر للمحترف العربي — بدون تعقيد، بدون إعلانات، بدون حدود.
                    </motion.p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                            whileHover={{ y: -6 }}
                            className={`group relative p-7 rounded-3xl bg-gradient-to-br ${f.color} border ${f.border} backdrop-blur-sm cursor-default`}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border ${f.border} mb-5`}>
                                <f.icon className={`w-6 h-6 ${f.icon_color}`} />
                            </div>
                            <h3 className="text-white font-black text-lg mb-2 font-cairo">{f.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── TOOLS SHOWCASE ── */}
            <section className="relative z-10 py-24 px-4 sm:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="text-3xl sm:text-5xl font-black text-white font-cairo mb-4"
                    >
                        أدوات تُحدث فرقاً حقيقياً
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                        className="text-slate-400 text-lg"
                    >
                        جرّب مباشرة — لا تسجيل مطلوب للتصفح
                    </motion.p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {popularTools.map((tool, i) => (
                        <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                            whileHover={{ y: -5, scale: 1.01 }}
                            onClick={() => launchTool(tool.id)}
                            className="group relative rounded-3xl overflow-hidden cursor-pointer bg-white/[0.03] border border-white/8 hover:border-brand-primary/30 backdrop-blur-xl transition-all duration-300 p-6 flex flex-col gap-4"
                        >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-brand-primary/5 to-transparent pointer-events-none" />
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-brand-primary/10 border border-brand-primary/20 group-hover:scale-110 transition-transform">
                                <ToolIcon icon={tool.icon} className="w-6 h-6 text-brand-primary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-black text-lg font-cairo group-hover:text-brand-primary transition-colors">{tool.titleAr}</h3>
                                <p className="text-slate-500 text-sm mt-1 leading-relaxed line-clamp-2">{tool.descAr}</p>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">مجانية</span>
                                <div className="w-8 h-8 rounded-full border border-white/10 group-hover:bg-brand-primary group-hover:border-brand-primary flex items-center justify-center transition-all">
                                    <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <motion.div className="text-center mt-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                    <Link href="/auth" className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 font-bold transition-all text-sm">
                        شاهد جميع الأدوات الـ50+
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                </motion.div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="relative z-10 py-24 px-4 sm:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <motion.h2
                        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="text-3xl sm:text-5xl font-black text-white font-cairo"
                    >
                        ماذا يقول <span className="text-brand-primary">مستخدمونا</span>
                    </motion.h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                            className="p-6 rounded-3xl bg-white/[0.03] border border-white/8"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(t.stars)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center text-white font-black text-sm">{t.name[0]}</div>
                                <div>
                                    <p className="text-white font-bold text-sm">{t.name}</p>
                                    <p className="text-slate-500 text-xs">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── PRICING ── */}
            <section className="relative z-10 py-24 px-4 sm:px-8 max-w-5xl mx-auto">
                <div className="text-center mb-14">
                    <motion.h2
                        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="text-3xl sm:text-5xl font-black text-white font-cairo mb-4"
                    >
                        باقات تناسب الجميع
                    </motion.h2>
                    <p className="text-slate-400 text-lg">ابدأ مجاناً وطوّر تجربتك متى تريد</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                            className={`relative rounded-3xl p-8 border ${plan.color} ${i === 1 ? 'bg-gradient-to-br from-brand-primary/10 to-brand-primary/5' : 'bg-white/[0.03]'}`}
                        >
                            {plan.badge && (
                                <div className="absolute -top-3.5 right-8 px-4 py-1 rounded-full bg-brand-primary text-white text-xs font-black">
                                    {plan.badge}
                                </div>
                            )}
                            <div className="mb-6">
                                <h3 className="text-white font-black text-xl mb-2">{plan.name}</h3>
                                <div className="flex items-end gap-1">
                                    <span className="text-4xl font-black text-white">{plan.price}</span>
                                    <span className="text-slate-400 text-sm mb-1">{plan.currency}{plan.period}</span>
                                </div>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((f, j) => (
                                    <li key={j} className="flex items-center gap-3 text-sm text-slate-300">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/auth"
                                className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all active:scale-95 ${i === 1
                                    ? 'bg-brand-primary hover:bg-brand-primary/90 text-white shadow-lg shadow-brand-primary/25'
                                    : 'border border-white/10 text-white hover:bg-white/5'
                                    }`}
                            >
                                {i === 0 ? 'ابدأ مجاناً' : 'ابدأ النسخة البرو'}
                                <ChevronLeft className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section className="relative z-10 py-32 px-4 text-center">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[600px] h-[300px] bg-brand-primary/20 blur-[120px] rounded-full" />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="relative max-w-3xl mx-auto"
                >
                    <h2 className="text-4xl sm:text-6xl font-black text-white font-cairo mb-6 leading-tight">
                        الوقت الأفضل للبدء
                        <br />
                        <span className="text-brand-primary">هو الآن</span>
                    </h2>
                    <p className="text-slate-400 text-xl mb-10">انضم لآلاف المحترفين الذين يستخدمون RI88 يومياً لتسريع أعمالهم.</p>
                    <button
                        onClick={handleStartFree}
                        className="inline-flex items-center gap-3 px-14 py-5 rounded-3xl font-black text-xl bg-brand-primary hover:bg-brand-primary/90 text-white shadow-2xl shadow-brand-primary/30 hover:scale-105 active:scale-95 transition-all"
                    >
                        <Sparkles className="w-5 h-5" />
                        افتح حسابك المجاني
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <p className="text-slate-600 text-sm mt-5">لا بطاقة ائتمانية · لا إعلانات · خصوصية تامة</p>
                </motion.div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="relative z-10 border-t border-white/5 py-8 px-4 text-center">
                <p className="text-slate-600 text-sm">© 2025 RI88. جميع الحقوق محفوظة. صُنع بـ ❤️ للمحترف العربي.</p>
            </footer>
        </div>
    );
};

export default VisitorLanding;
