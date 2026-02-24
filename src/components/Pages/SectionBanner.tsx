"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
    Calculator, FileText, Image as ImageIcon, Terminal, Sparkles,
    Grid, FolderOpen, Star, Zap, Clock, Smartphone, Palette, Film,
    Flag, Trophy, Activity
} from 'lucide-react';

interface Tool {
    id: string;
    title: string;
    titleAr: string;
    icon: string;
}

interface SectionBannerProps {
    categoryKey: string;
    title: string;
    tools?: Tool[];
}

export const SectionBanner = ({ categoryKey, title, tools = [] }: SectionBannerProps) => {

    const [randomTools, setRandomTools] = React.useState<Tool[]>([]);

    React.useEffect(() => {
        if (tools.length > 0) {
            // Simplified for performance - no heavy tickers
            const shuffled = [...tools].sort(() => 0.5 - Math.random());
            setRandomTools(shuffled.slice(0, 3));
        }
    }, [tools]);

    // Configuration for each category
    const config: Record<string, {
        description: string;
        icon: React.ComponentType<{ className?: string }>;
        gradient: string;
        patternColor: string;
    }> = {
        'finance': {
            description: "Financial Intelligence - حاسبات مالية متقدمة لإدارة الأموال.",
            icon: Calculator,
            gradient: "from-emerald-500/20 to-teal-900/20",
            patternColor: "bg-emerald-500"
        },
        'pdf': {
            description: "Document Mastery - معالجة المستندات ودمج الملفات باحترافية.",
            icon: FolderOpen,
            gradient: "from-red-500/20 to-orange-900/20",
            patternColor: "bg-red-500"
        },
        'text': {
            description: "Content Engine - أدوات معالجة النصوص والتحليل اللغوي.",
            icon: FileText,
            gradient: "from-blue-500/20 to-indigo-900/20",
            patternColor: "bg-blue-500"
        },
        'image': {
            description: "Visual Studio - استوديو تحرير الصور والجرافيكس.",
            icon: ImageIcon,
            gradient: "from-pink-500/20 to-rose-900/20",
            patternColor: "bg-pink-500"
        },
        'developer': {
            description: "Code Forge - أدوات برمجية مساعدة للمطورين.",
            icon: Terminal,
            gradient: "from-amber-500/20 to-yellow-900/20",
            patternColor: "bg-amber-500"
        },
        'others': {
            description: "Essentials - أدوات متنوعة للاستخدام اليومي.",
            icon: Grid,
            gradient: "from-slate-500/20 to-gray-900/20",
            patternColor: "bg-slate-500"
        },
        'productivity': {
            description: "Workflow Boost - أدوات لإنجاز مهامك اليومية بكفاءة.",
            icon: Zap,
            gradient: "from-yellow-400/20 to-amber-900/20",
            patternColor: "bg-yellow-400"
        },
        'time': {
            description: "Time Management - حاسبات التاريخ والوقت والفروقات الزمنية.",
            icon: Clock,
            gradient: "from-sky-400/20 to-blue-900/20",
            patternColor: "bg-sky-400"
        },
        'content': {
            description: "Content Creator - حلول وأفكار وإدارة شاملة للمحتوى.",
            icon: Smartphone,
            gradient: "from-cyan-400/20 to-lime-900/20",
            patternColor: "bg-cyan-400"
        },
        'design': {
            description: "Creative Suite - مولدات الألوان والظلال والتدرجات.",
            icon: Palette,
            gradient: "from-fuchsia-400/20 to-pink-900/20",
            patternColor: "bg-fuchsia-400"
        },
        'media': {
            description: "Media Factory - استخراج ومعالجة الصوتيات والمرئيات.",
            icon: Film,
            gradient: "from-lime-400/20 to-green-900/20",
            patternColor: "bg-lime-400"
        },
        'saudi': {
            description: "Local Tools - حاسبات نهاية الخدمة والرواتب والإجازات.",
            icon: Flag,
            gradient: "from-green-500/20 to-green-900/20",
            patternColor: "bg-green-500"
        },
        'sports': {
            description: "Sports Hub - نتائج ومواعيد الأحداث الرياضية.",
            icon: Trophy,
            gradient: "from-red-600/20 to-red-900/20",
            patternColor: "bg-red-600"
        },
        'ai-tools': {
            description: "Smart Intelligence - أدوات مدعومة بالذكاء الاصطناعي.",
            icon: Sparkles,
            gradient: "from-purple-500/20 to-fuchsia-900/20",
            patternColor: "bg-purple-500"
        },
        'health': {
            description: "Wellness - أدوات متابعة وتقييم الصحة والنشاط.",
            icon: Activity,
            gradient: "from-rose-400/20 to-pink-900/20",
            patternColor: "bg-rose-400"
        },
        'Current': {
            description: "نتائج البحث الحالية",
            icon: Sparkles,
            gradient: "from-violet-500/20 to-purple-900/20",
            patternColor: "bg-violet-500"
        }
    };

    const theme = config[categoryKey] || config['others'];
    const Icon = theme.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="relative w-full overflow-hidden rounded-[20px] lg:rounded-[24px] border border-white/5 group min-h-[110px] lg:min-h-[160px] flex flex-col justify-center"
        >
            {/* Background & Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-50`} />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />

            {/* Animated Glow Orb (Optimized) */}
            <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none ${theme.patternColor}`} style={{ filter: 'blur(60px)', transform: 'translateZ(0)' }} />

            <div className="relative z-10 p-4 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-4 lg:gap-6">

                {/* Text Content */}
                <div className="flex items-start gap-5 text-right w-full md:w-auto relative z-20">
                    <div className="hidden md:flex w-14 h-14 rounded-2xl bg-white/5 border border-white/10 items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
                        <Icon className="w-7 h-7 text-white opacity-80" />
                    </div>

                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-black text-white font-cairo">{title}</h2>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white/70 border border-white/5`}>
                                {categoryKey.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm font-medium font-cairo max-w-xl leading-relaxed">
                            {theme.description}
                        </p>
                    </div>
                </div>

                {/* Static Tool Preview (Optimized for performance instead of infinite ticker) */}
                {randomTools.length > 1 && (
                    <div className="absolute inset-y-0 left-0 w-full md:w-1/2 overflow-hidden mask-linear-fade flex items-center justify-end pr-8 opacity-10 md:opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none scale-90 md:scale-100">
                        <div className="flex gap-4">
                            {randomTools.map((tool, idx) => (
                                <div key={`${tool.id}-${idx}`} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg whitespace-nowrap">
                                    <Star className="w-3 h-3 text-white/40" />
                                    <span className="text-xs font-bold text-white/60 font-cairo">{tool.titleAr}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Stats Badge */}
                <div className="relative z-20 flex items-center gap-2 px-4 py-2 bg-black/20 rounded-xl border border-white/5 backdrop-blur-sm self-end md:self-center shrink-0">
                    <span className="text-2xl font-black text-white font-inter">{tools.length}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">أداة</span>
                </div>
            </div>

            {/* Decorative Bar */}
            <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${theme.gradient} opacity-50`} />

            <style jsx>{`
                .mask-linear-fade {
                    mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
                }
            `}</style>
        </motion.div>
    );
};
