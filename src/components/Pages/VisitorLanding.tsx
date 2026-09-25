"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Zap, ArrowLeft, ArrowUpLeft, ShieldCheck, Globe,
    Sparkles, CheckCircle2, Lock, Rocket,
    Brain, TrendingUp, ChevronLeft, Terminal,
    FileText, Code, Database, Cpu, Activity,
    Sliders, Star, Check
} from 'lucide-react';
import Link from 'next/link';
import { useVisitorLanding } from '@/hooks/useVisitorLanding';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Logo from '@/components/Brand/Logo';

export default function VisitorLanding() {
    const { popularTools, launchTool, handleStartFree } = useVisitorLanding();
    const [terminalCmd, setTerminalCmd] = useState('');
    const fullCmd = "ri88 --status --healthcheck";

    // Terminal typing effect
    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            if (i <= fullCmd.length) {
                setTerminalCmd(fullCmd.slice(0, i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 80);
        return () => clearInterval(timer);
    }, []);

    const marqueeItems = [
        { label: "PDF Suite Pro", icon: FileText, tag: "v3.1" },
        { label: "Code & JSON Tools", icon: Code, tag: "Engine" },
        { label: "AI Workflows", icon: Cpu, tag: "GPT-4o" },
        { label: "Saudi Calculators", icon: Activity, tag: "ZATCA" },
        { label: "Media & Audio Lab", icon: Sliders, tag: "FFmpeg" },
        { label: "Data Warehouse", icon: Database, tag: "PostgreSQL" },
    ];

    const specs = [
        {
            num: "01",
            title: "سرعة استجابة فورية",
            desc: "معالجة طرفية (Edge-accelerated) في أقل من 20 ملي ثانية بدون شاشات انتظار.",
            tag: "LATENCY < 20MS"
        },
        {
            num: "02",
            title: "خصوصية وتشفير كامل",
            desc: "بياناتك وملفاتك تُعالج في الذاكرة الحية فقط وتُحذف تلقائياً فور انتهاء الجلسة.",
            tag: "AES-256 ZERO RETENTION"
        },
        {
            num: "03",
            title: "تكامل الأنظمة السعودية",
            desc: "حاسبات ضريبة القيمة المضافة، مكافأة نهاية الخدمة، ولوائح العقار والاستثمار.",
            tag: "KSA ECOSYSTEM COMPLIANT"
        },
        {
            num: "04",
            title: "مساحات عمل سحابية",
            desc: "احفظ أدواتك المفضلة، ونظّم مهام فريقك مع دعم الصلاحيات والمزامنة التلقائية.",
            tag: "CLOUD WORKSPACE SYNC"
        }
    ];

    const plans = [
        {
            name: 'الخطة المجانية',
            badge: null,
            price: '0',
            period: 'مجاناً للأبد',
            desc: 'مناسبة للمهام السريعة والاستخدام الفردي.',
            cta: 'ابدأ مجاناً',
            primary: false,
            features: [
                'الوصول لأكثر من 50 أداة أساسية',
                'معالجة ملفات PDF بحجم حتى 25MB',
                'حاسبات الرواتب والضرائب والتمويل',
                'مزامنة التفضيلات محلياً'
            ]
        },
        {
            name: 'عضوية PRO المحترفة',
            badge: 'الموصى بها للشركات والمطورين',
            price: '49',
            period: 'ر.س / شهرياً',
            desc: 'صُممت للمبدعين والمحترفين الذين يحتاجون قوة غير محدودة.',
            cta: 'ترقية الحساب الآن',
            primary: true,
            features: [
                'جميع الأدوات الحالية والقادمة (80+ أداة)',
                'معالجة ملفات غير محدودة الحجم بدون قيود',
                'أدوات الذكاء الاصطناعي ومعالجة الأكواد',
                'مساحات عمل جماعية وإدارة الفريق',
                'أولوية معالجة في السيرفر ودعم فني مخصص 24/7'
            ]
        },
    ];

    return (
        <div className="bg-brand-bg min-h-screen text-text-primary overflow-x-hidden transition-colors selection:bg-brand-primary/30" dir="rtl">

            {/* Ambient Background Glow */}
            <div className="ambient-glow" aria-hidden="true" />

            {/* ── HEADER NAVIGATION ── */}
            <header className="sticky top-0 z-50 h-16 border-b border-border-subtle bg-surface-base/85 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 h-full flex items-center justify-between gap-4">
                    {/* Brandmark */}
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center">
                            <Logo size="md" showText />
                        </Link>
                        <div className="status-pill hidden md:inline-flex text-[11px] py-1 px-3">
                            <span className="pulsing-dot" />
                            <span>v2.4 Live</span>
                        </div>
                    </div>

                    {/* Numbered Nav Links */}
                    <nav className="hidden lg:flex items-center gap-6 text-xs font-mono">
                        <a href="#tools" className="flex items-center gap-1.5 text-text-muted hover:text-text-primary transition-colors">
                            <span className="nav-num">01</span>
                            <span>الأدوات المختارة</span>
                        </a>
                        <a href="#specs" className="flex items-center gap-1.5 text-text-muted hover:text-text-primary transition-colors">
                            <span className="nav-num">02</span>
                            <span>المواصفات التقنية</span>
                        </a>
                        <a href="#how" className="flex items-center gap-1.5 text-text-muted hover:text-text-primary transition-colors">
                            <span className="nav-num">03</span>
                            <span>طريقة العمل</span>
                        </a>
                        <a href="#pricing" className="flex items-center gap-1.5 text-text-muted hover:text-text-primary transition-colors">
                            <span className="nav-num">04</span>
                            <span>الأسعار</span>
                        </a>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Link
                            href="/auth"
                            className="hidden sm:inline-flex btn-outline-accent text-xs py-1.5 px-3.5"
                        >
                            <span>تسجيل الدخول</span>
                        </Link>
                        <button
                            onClick={handleStartFree}
                            className="btn-primary-accent text-xs py-1.5 px-4"
                        >
                            <span>ابدأ مجاناً</span>
                            <ArrowLeft size={13} />
                        </button>
                    </div>
                </div>
            </header>

            {/* ── HERO SECTION ── */}
            <section className="relative z-10 pt-12 sm:pt-20 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

                    {/* Left Hero Column: Typography & CTAs */}
                    <div className="lg:col-span-7 space-y-6 text-right">
                        {/* Status Pill with Pulsing Dot */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                            <div className="status-pill">
                                <span className="pulsing-dot" />
                                <span>المنظومة الرقمية السحابية · الإصدار 2.4</span>
                            </div>
                        </motion.div>

                        {/* Bold Display Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="text-3xl sm:text-5xl lg:text-6xl font-black font-cairo tracking-tight leading-[1.18] text-text-primary"
                        >
                            أدوات رقمية ذكية، محولات أكواد، وتجارب ويب{' '}
                            <span className="text-brand-primary">مدعومة بالذكاء الاصطناعي.</span>
                        </motion.h1>

                        {/* Lead Paragraph with <em> Highlights */}
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="text-text-muted text-base sm:text-lg leading-relaxed max-w-xl font-normal"
                        >
                            نجمع أكثر من <em className="text-text-primary not-italic font-semibold">80 أداة متخصصة</em> في هندسة الإنتاجية، معالجة ملفات PDF، الحسابات المالية السعودية، وأتمتة المهام اليومية في بيئة سحابية فائقة الأمان والسرعة.
                        </motion.p>

                        {/* Hero Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="flex flex-wrap items-center gap-3 pt-2"
                        >
                            <button
                                onClick={handleStartFree}
                                className="btn-primary-accent"
                            >
                                <span>ابدأ مجاناً الآن</span>
                                <ArrowLeft size={16} />
                            </button>
                            <a
                                href="#tools"
                                className="btn-outline-accent"
                            >
                                <span className="nav-num text-[11px]">01</span>
                                <span>استعراض الأدوات</span>
                                <ArrowUpLeft size={14} />
                            </a>
                        </motion.div>

                        {/* Monospace Trust Specs */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-wrap items-center gap-4 sm:gap-6 pt-6 border-t border-border-subtle text-xs font-mono text-text-muted"
                        >
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                                <span>EST. LATENCY: &lt; 20MS</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span>NO CREDIT CARD REQUIRED</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                <span>100% IN-MEMORY PRIVACY</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Hero Column: Interactive Terminal CLI Widget */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="terminal-widget w-full max-w-lg mx-auto"
                        >
                            <div className="terminal-header">
                                <div className="window-dots">
                                    <span className="window-dot red" />
                                    <span className="window-dot yellow" />
                                    <span className="window-dot green" />
                                </div>
                                <span className="terminal-label">SESSION // RI88_CORE_PIPELINE</span>
                            </div>
                            <div className="terminal-body space-y-2">
                                <div className="terminal-line text-brand-primary font-bold">
                                    <span>$</span>
                                    <span>{terminalCmd}</span>
                                    <span className="terminal-cursor" />
                                </div>
                                <div className="terminal-line text-emerald-400 text-xs">
                                    › Engine initialized: 84+ Tools Loaded
                                </div>
                                <div className="terminal-line text-text-muted text-xs">
                                    › Cloud Infrastructure: Riyadh DC (Online)
                                </div>
                                <div className="terminal-line text-cyan-400 text-xs">
                                    › AI Pipeline: Active (Sub-millisecond inference)
                                </div>
                                <div className="terminal-line text-text-muted text-xs">
                                    › Security protocol: AES-256 GCM in-memory
                                </div>
                                <div className="terminal-line text-amber-400 text-xs pt-1 border-t border-border-subtle mt-2">
                                    [SYSTEM] ALL MODULES HEALTHY · READY FOR INPUT
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </section>

            {/* ── MARQUEE INFINITE TICKER ── */}
            <section className="relative z-10 py-5 border-y border-border-subtle bg-surface-raised/60 backdrop-blur-md overflow-hidden">
                <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
                    {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
                        <div key={idx} className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-border-subtle bg-surface-glass text-xs font-mono text-text-muted">
                            <item.icon size={13} className="text-brand-primary" />
                            <span className="text-text-primary font-medium">{item.label}</span>
                            <span className="text-[10px] text-brand-primary font-bold">{item.tag}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── SECTION 1: SELECTED TOOLS (WINDOW MOCKUPS) ── */}
            <section id="tools" className="relative z-10 py-20 px-4 sm:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                    <div>
                        <div className="section-tag">
                            <span className="line" />
                            <span>01 / الأدوات المختارة</span>
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black font-cairo text-text-primary">
                            منظومات ذكية تلبي كافة احتياجاتك.
                        </h2>
                    </div>
                    <Link
                        href="/auth"
                        className="btn-outline-accent text-xs self-start sm:self-auto"
                    >
                        <span>عرض كافة الأدوات (+80)</span>
                        <ArrowLeft size={13} />
                    </Link>
                </div>

                {/* Window Mockup Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {popularTools.slice(0, 6).map((tool) => (
                        <div
                            key={tool.id}
                            onClick={() => launchTool(tool.id)}
                            className="window-mockup cursor-pointer group flex flex-col justify-between"
                        >
                            <div>
                                {/* Mockup Titlebar */}
                                <div className="window-mockup-header">
                                    <div className="window-dots">
                                        <span className="window-dot red" />
                                        <span className="window-dot yellow" />
                                        <span className="window-dot green" />
                                    </div>
                                    <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                                        TOOL // {tool.cat || 'UTILITY'}
                                    </span>
                                </div>

                                {/* Body */}
                                <div className="p-5 space-y-3">
                                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                                        <Zap size={20} />
                                    </div>
                                    <h3 className="text-base font-bold font-cairo text-text-primary group-hover:text-brand-primary transition-colors">
                                        {tool.titleAr || tool.title}
                                    </h3>
                                    <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                                        {tool.descAr || tool.desc}
                                    </p>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="px-5 py-3 border-t border-border-subtle bg-surface-glass/40 flex items-center justify-between text-xs font-mono">
                                <span className="text-[10px] text-text-muted">READY TO RUN</span>
                                <span className="text-brand-primary flex items-center gap-1 font-bold group-hover:translate-x-[-4px] transition-transform">
                                    <span>تشغيل الأداة</span>
                                    <ArrowLeft size={12} />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── SECTION 2: TECHNICAL SPECS ── */}
            <section id="specs" className="relative z-10 py-20 px-4 sm:px-8 border-y border-border-subtle bg-surface-glass/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <div className="section-tag justify-center">
                            <span className="line" />
                            <span>02 / المواصفات والمعايير</span>
                            <span className="line" />
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black font-cairo text-text-primary">
                            بنية تحتية مصممة لأقصى أداء.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {specs.map((item) => (
                            <div
                                key={item.num}
                                className="p-6 rounded-2xl bg-surface-raised border border-border-subtle hover:border-brand-primary/40 transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <span className="nav-num text-xs font-bold text-brand-primary mb-3 block">{item.num} //</span>
                                    <h3 className="text-base font-bold font-cairo text-text-primary mb-2">{item.title}</h3>
                                    <p className="text-xs text-text-muted leading-relaxed mb-6">{item.desc}</p>
                                </div>
                                <span className="text-[9px] font-mono text-text-muted border border-border-subtle rounded px-2 py-1 w-fit">
                                    {item.tag}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SECTION 3: PRICING ── */}
            <section id="pricing" className="relative z-10 py-20 px-4 sm:px-8 max-w-5xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <div className="section-tag justify-center">
                        <span className="line" />
                        <span>03 / باقات الاشتراك</span>
                        <span className="line" />
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black font-cairo text-text-primary mb-2">
                        خطط واضحة بدون تعقيد.
                    </h2>
                    <p className="text-text-muted text-sm font-normal">ابدأ مجاناً اليوم، وقم بالترقية عندما تكبر احتياجاتك.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {plans.map((p, idx) => (
                        <div
                            key={idx}
                            className={`rounded-2xl p-7 flex flex-col justify-between border transition-all ${
                                p.primary
                                    ? 'bg-surface-raised border-brand-primary shadow-xl shadow-brand-primary/10 relative overflow-hidden'
                                    : 'bg-surface-raised border-border-subtle'
                            }`}
                        >
                            {p.badge && (
                                <div className="absolute top-0 left-0 right-0 bg-brand-primary text-black font-mono font-bold text-[10px] text-center py-1">
                                    {p.badge}
                                </div>
                            )}

                            <div className={p.badge ? 'pt-4' : ''}>
                                <div className="flex items-baseline justify-between mb-2">
                                    <h3 className="text-lg font-bold font-cairo text-text-primary">{p.name}</h3>
                                    <div className="flex items-baseline gap-1 font-mono">
                                        <span className="text-3xl font-black text-text-primary">{p.price}</span>
                                        <span className="text-xs text-text-muted">{p.period}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-text-muted mb-6 leading-relaxed">{p.desc}</p>

                                <ul className="space-y-3 mb-8 border-t border-border-subtle pt-6">
                                    {p.features.map((feat, fIdx) => (
                                        <li key={fIdx} className="flex items-center gap-2.5 text-xs text-text-primary">
                                            <Check size={14} className="text-brand-primary shrink-0" />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link
                                href="/auth"
                                className={`w-full py-3 rounded-xl text-center text-xs font-bold transition-all ${
                                    p.primary
                                        ? 'bg-brand-primary text-black hover:brightness-110 shadow-lg shadow-brand-primary/20'
                                        : 'btn-outline-accent justify-center'
                                }`}
                            >
                                {p.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="relative z-10 border-t border-border-subtle py-10 px-4 sm:px-8 bg-surface-base">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <Logo size="md" showText />
                        <span className="text-xs font-mono text-text-muted">· RIYADH, SAUDI ARABIA</span>
                    </div>

                    <div className="flex items-center gap-6 text-xs font-mono text-text-muted">
                        <a href="#tools" className="hover:text-text-primary transition-colors">الأدوات</a>
                        <a href="#specs" className="hover:text-text-primary transition-colors">المواصفات</a>
                        <a href="#pricing" className="hover:text-text-primary transition-colors">الأسعار</a>
                        <Link href="/auth" className="hover:text-brand-primary transition-colors">دخول المنصة</Link>
                    </div>

                    <div className="text-[11px] font-mono text-text-muted">
                        © 2026 RI88.PRO · ALL RIGHTS RESERVED
                    </div>
                </div>
            </footer>

        </div>
    );
}
