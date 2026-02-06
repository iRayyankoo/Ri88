"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings, Search, Bell, User, Zap, Terminal, Code,
    FileText, Calculator, Image as ImageIcon, Briefcase,
    TrendingUp, Shield, HelpCircle, RefreshCw, UploadCloud, Database,
    Percent, Wallet, ArrowRightLeft, Landmark, HandCoins, Bitcoin, Moon,
    CalendarClock, Timer, Globe, AlignRight, Eraser, CaseSensitive, Hash,
    Link2, QrCode, Ruler, Lock, Gauge, Smartphone, PenTool, Lightbulb,
    SearchCheck, Calendar, Sun, Files, Scissors, Minimize2, Image,
    ListOrdered, RotateCw, Stamp, Unlock, FileMinus, ArrowUpDown, Crop,
    ImageMinus, Maximize, Layers, Camera, Share2, Square, EyeOff, Sliders,
    Flame, Droplet, Braces, Binary, Fingerprint, Link, Regex, GitCompare, Key,
    Monitor, MousePointer2, Shuffle, CheckCircle2, Wind, ArrowRight, Star,
    Activity, Clock, Grid
} from 'lucide-react';
import { tools, categories } from '@/data/tools';
import { useNavigation } from '@/context/NavigationContext';

const ToolsDirectory = () => {
    const { launchTool, setCurrentView } = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('all');

    // --- Icon Mapping Helper ---
    const getIcon = (iconName: string) => {
        const icons: Record<string, any> = {
            'calculator': Calculator, 'percent': Percent, 'wallet': Wallet, 'arrow-right-left': ArrowRightLeft,
            'landmark': Landmark, 'hand-coins': HandCoins, 'bitcoin': Bitcoin, 'moon': Moon, 'calendar-clock': CalendarClock,
            'timer': Timer, 'globe': Globe, 'align-right': AlignRight, 'eraser': Eraser, 'case-sensitive': CaseSensitive,
            'hash': Hash, 'link-2': Link2, 'qr-code': QrCode, 'ruler': Ruler, 'lock': Lock, 'gauge': Gauge,
            'smartphone': Smartphone, 'pen-tool': PenTool, 'lightbulb': Lightbulb, 'search-check': SearchCheck,
            'calendar': Calendar, 'sun': Sun, 'files': Files, 'scissors': Scissors, 'minimize-2': Minimize2,
            'image': Image, 'file-text': FileText, 'list-ordered': ListOrdered, 'rotate-cw': RotateCw, 'stamp': Stamp,
            'unlock': Unlock, 'file-minus': FileMinus, 'arrow-up-down': ArrowUpDown, 'crop': Crop, 'image-minus': ImageMinus,
            'maximize': Maximize, 'zap': Zap, 'layers': Layers, 'camera': Camera, 'share-2': Share2, 'square': Square,
            'eye-off': EyeOff, 'sliders': Sliders, 'activity': Activity, 'fire': Flame, 'droplet': Droplet, 'braces': Braces,
            'binary': Binary, 'fingerprint': Fingerprint, 'link': Link, 'regex': Regex, 'git-compare': GitCompare,
            'key': Key, 'database': Database, 'shield': Shield, 'clock': Clock, 'terminal': Terminal, 'monitor': Monitor,
            'code': Code, 'image-plus': Image, 'file-search': Search, 'check-circle-2': CheckCircle2, 'trophy': Activity,
            'dribbble': Activity, 'flag': Activity, 'swords': Activity, 'timer-reset': Timer, 'palette': Layers,
            'shuffle': Shuffle, 'wind': Wind, 'tag': Percent, 'calendar-plus': Calendar, 'sparkles': Zap
        };
        return icons[iconName] || Grid;
    };

    // --- Filter Logic ---
    const filteredTools = useMemo(() => {
        return tools.filter(tool =>
            (tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || tool.titleAr.includes(searchQuery)) &&
            (activeCategory === 'all' || tool.cat === activeCategory)
        );
    }, [searchQuery, activeCategory]);

    // Grouping for "All" view
    const groupedTools = useMemo(() => {
        if (activeCategory !== 'all') return { 'Current': filteredTools };

        const groups: Record<string, typeof tools> = {};
        const priorityCats = ['finance', 'pdf', 'text', 'image', 'developer'];

        priorityCats.forEach(cat => {
            const groupTools = filteredTools.filter(t => t.cat === cat);
            if (groupTools.length > 0) groups[cat] = groupTools;
        });

        const otherTools = filteredTools.filter(t => !priorityCats.includes(t.cat));
        if (otherTools.length > 0) groups['others'] = otherTools;

        return groups;
    }, [filteredTools, activeCategory]);

    const groupTitles: Record<string, string> = {
        'finance': 'أدوات مالية',
        'pdf': 'أدوات PDF والمستندات',
        'text': 'النصوص والمحتوى',
        'image': 'تحرير الصور',
        'developer': 'أدوات المطورين',
        'others': 'أدوات أخرى',
        'Current': 'النتائج'
    };

    // Featured Tool (Neural Architect Pro style)
    const featuredTool = tools.find(t => t.id === 'ai-text') || tools[0];

    return (
        <div className="w-full max-w-7xl mx-auto pb-32 space-y-8 lg:space-y-12 animate-in fade-in duration-700 overflow-x-hidden">
            {/* 1. CINEMATIC FEATURED SECTION */}
            <section className="px-2 lg:px-0">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-full rounded-[32px] overflow-hidden border border-white/10 bg-[#13131A] shadow-[0_20px_50px_rgba(0,0,0,0.5)] group"
                >
                    {/* Background Glows */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/5 blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-1/2 h-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

                    <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12 p-5 lg:p-14 relative z-10">
                        {/* 3D-ish Icon Content */}
                        <div className="w-full lg:w-1/2 aspect-video lg:aspect-[16/9] rounded-2xl lg:rounded-3xl overflow-hidden relative shadow-2xl border border-white/10 bg-black/20 order-1 lg:order-2 group-hover:border-brand-primary/30 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-blue-600/10 z-10" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    animate={{
                                        y: [0, -12, 0],
                                        rotateZ: [0, 5, 0],
                                        scale: [1, 1.05, 1]
                                    }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-tr from-brand-primary to-cyan-400 rounded-[16px] lg:rounded-[20px] shadow-[0_0_40px_rgba(139,92,246,0.3)] flex items-center justify-center border border-white/20 relative"
                                >
                                    <div className="absolute inset-0 bg-white/10 blur-xl rounded-full scale-150 opacity-30" />
                                    {React.createElement(getIcon(featuredTool.icon), { className: "w-10 h-10 lg:w-12 lg:h-12 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] z-10" })}
                                </motion.div>
                            </div>
                            {/* Trending Ribbon */}
                            <div className="absolute top-0 right-0 bg-brand-primary text-white text-[10px] font-black px-6 py-1 rotate-45 translate-x-[25px] translate-y-[10px] shadow-lg z-20">
                                TRENDING
                            </div>

                            {/* Glass Badge */}
                            <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 shadow-xl z-20">
                                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
                                <span className="text-[11px] font-black text-white/90 tracking-widest uppercase font-inter">Live Processing</span>
                            </div>

                            {/* Decorative Processing Waveform (Visual only) */}
                            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1 z-20 opacity-30">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [4, 12, 4] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                                        className="w-1 bg-white rounded-full"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="w-full lg:w-1/2 space-y-4 text-right order-2 lg:order-1">
                            <div className="flex items-center justify-end gap-2 mb-1 lg:mb-2">
                                <span className="px-1.5 py-0.5 bg-brand-primary/10 border border-brand-primary/20 rounded text-[8px] font-black text-brand-primary uppercase tracking-tighter">AI Model v4.2</span>
                                <h2 className="text-2xl lg:text-4xl font-black text-white leading-tight font-cairo">
                                    مساعد <span className="text-brand-primary">الذكاء الاصطناعي</span> المتطور
                                </h2>
                            </div>
                            <p className="text-slate-400 text-xs lg:text-lg leading-relaxed max-w-xl ml-auto">
                                معالجة متقدمة للبنية التحتية للنصوص باستخدام شبكات الذكاء الاصطناعي التوليدي الخاصة بمنصة RI88، مصمم للإنتاجية العالية.
                            </p>

                            {/* Feature Chips */}
                            <div className="flex flex-wrap justify-end gap-2 pt-2">
                                {['تحليل ذكي', 'ترميز تلقائي', 'دعم لغوي مكثف', 'أمن البيانات'].map((feature, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-slate-300 font-cairo">
                                        {feature}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center justify-end gap-8 pt-4">
                                <div className="flex gap-8 border-r border-white/10 pr-8 mr-2">
                                    <div className="text-right">
                                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] font-inter mb-1">Users</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-lg font-black text-white font-inter">14.2K</span>
                                            <span className="text-brand-secondary font-bold text-[10px] font-inter">Active</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] font-inter mb-1">Efficiency</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-lg font-black text-white font-inter">99.4%</span>
                                            <span className="text-cyan-400 font-bold text-[10px] font-inter">Score</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => launchTool(featuredTool.id)}
                                    className="px-6 lg:px-10 py-3 lg:py-5 bg-gradient-to-r from-brand-primary to-violet-600 hover:from-brand-primary/90 hover:to-violet-600/90 text-white rounded-[12px] lg:rounded-[16px] font-black text-xs lg:text-sm transition-all shadow-2xl shadow-brand-primary/30 hover:scale-105 active:scale-95 flex items-center gap-2 lg:gap-3 font-cairo"
                                >
                                    جربه الآن
                                    <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Background Gradients */}
                    <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-brand-primary/10 to-transparent pointer-events-none" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-brand-primary/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
                </motion.div>
            </section>

            {/* 2. INNOVATION LABS CAROUSEL */}
            <section className="space-y-8">
                <div className="flex items-center justify-between px-4 lg:px-2">
                    <h3 className="text-xl font-black text-white font-cairo">innovation labs</h3>
                    <button onClick={() => setActiveCategory('all')} className="flex items-center gap-2 text-cyan-400 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                        Browse
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar -mx-4 px-4 snap-x relative">
                    {tools.slice(0, 8).map((tool, i) => {
                        const Icon = getIcon(tool.icon);
                        return (
                            <motion.div
                                key={tool.id}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                whileInView={{
                                    opacity: 1,
                                    scale: [0.9, 1.05, 1], // Smooth scale-up effect when coming into view
                                    y: 0
                                }}
                                viewport={{ once: false, amount: 0.5 }}
                                whileHover={{
                                    y: -10,
                                    scale: 1.02,
                                    transition: { duration: 0.2 }
                                }}
                                className="min-w-[260px] lg:min-w-[400px] rounded-[24px] overflow-hidden border border-white/[0.08] bg-white/[0.03] backdrop-blur-[24px] p-5 lg:p-6 snap-center group cursor-pointer transition-shadow hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]"
                                onClick={() => launchTool(tool.id)}
                            >
                                {/* Media Placeholder (Voice Synth Style) */}
                                <div className="w-full aspect-video rounded-3xl bg-gradient-to-br from-[#2a1b4d] to-[#0f0f16] mb-6 relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#8B5CF620,_transparent_70%)]" />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Icon className="w-12 h-12 text-slate-500 group-hover:text-brand-primary transition-colors" />
                                    </div>
                                    {/* Glass Overlay on icon */}
                                    <div className="absolute top-4 right-4 w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10">
                                        <Icon className="w-5 h-5 text-cyan-400" />
                                    </div>
                                </div>

                                {/* Tool Info */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-xl font-black text-white font-cairo">{tool.titleAr}</h4>
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed font-cairo line-clamp-2">
                                        {tool.descAr}
                                    </p>

                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(j => (
                                                <div key={j} className="w-6 h-6 rounded-full border border-brand-bg bg-brand-primary/20 flex items-center justify-center text-[8px] font-bold text-white shadow-lg">
                                                    {j}
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 tracking-wider font-inter">14.2K ACTIVE</span>
                                    </div>
                                </div>

                                {/* Neon Glow Hover */}
                                <div className="absolute inset-0 rounded-[32px] border border-brand-primary/0 group-hover:border-brand-primary/50 transition-all pointer-events-none shadow-[0_0_30px_rgba(139,92,246,0)] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]" />
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* 3. GRID CONTENT (Maintaining the original grid but with the new Glass style) */}
            <div className="space-y-12">
                <header className="space-y-6 pt-4 px-2">
                    {/* Search Bar Container */}
                    <div className="relative group max-w-2xl mx-auto">
                        <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-slate-500 group-focus-within:text-brand-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="ابحث في أكثر من 150 أداة..."
                            className="w-full h-14 lg:h-16 bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] rounded-[24px] lg:rounded-[32px] pr-14 pl-8 text-white placeholder:text-slate-500 outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all font-medium text-sm lg:text-base text-right font-cairo shadow-2xl"
                        />
                    </div>
                    {/* Category Chips */}
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x scroll-smooth">
                        {categories.map(cat => {
                            const Icon = getIcon(cat.icon);
                            const isActive = activeCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex items-center gap-3 px-8 py-4 rounded-[24px] text-xs font-black whitespace-nowrap transition-all border snap-start font-cairo ${isActive
                                        ? 'bg-brand-primary border-brand-primary text-white shadow-xl shadow-brand-primary/30'
                                        : 'bg-white/[0.03] backdrop-blur-[24px] border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                                        }`}
                                >
                                    {isActive && <Icon className="w-4 h-4" />}
                                    <span>{cat.nameAr}</span>
                                </button>
                            );
                        })}
                    </div>
                </header>

                {Object.entries(groupedTools).map(([key, group]) => {
                    const groupTitle = groupTitles[key] || groupTitles['others'];

                    return (
                        <div key={key} className="space-y-8 px-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-black tracking-widest text-slate-500 uppercase flex items-center gap-3 font-inter">
                                    <span className="w-1.5 h-6 bg-brand-primary rounded-full shadow-[0_0_15px_rgba(139,92,246,0.6)]"></span>
                                    {groupTitle}
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                                {group.map(tool => {
                                    const Icon = getIcon(tool.icon);
                                    return (
                                        <motion.div
                                            key={tool.id}
                                            whileHover={{ y: -8, scale: 1.01 }}
                                            onClick={() => launchTool(tool.id)}
                                            className="bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] p-6 lg:p-7 rounded-[28px] cursor-pointer transition-all group relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-brand-primary/40 hover:shadow-[0_20px_40px_rgba(139,92,246,0.1)]"
                                        >
                                            {/* Decorative Corner Glow */}
                                            <div className="absolute -top-10 -right-10 w-20 h-20 bg-brand-primary/10 blur-3xl group-hover:bg-brand-primary/20 transition-colors" />

                                            <div className="flex flex-col gap-6 text-right items-start">
                                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-inner border border-white/5 group-hover:border-brand-primary/50 relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    {React.createElement(getIcon(tool.icon), { className: "w-7 h-7 relative z-10" })}
                                                </div>

                                                <div className="w-full">
                                                    <h4 className="text-white font-black text-base lg:text-lg mb-2 group-hover:text-brand-primary transition-colors font-cairo">{tool.titleAr}</h4>
                                                    <p className="text-slate-500 text-[11px] lg:text-[13px] font-medium leading-relaxed font-cairo line-clamp-2">
                                                        {tool.descAr}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-brand-primary/5 blur-3xl rounded-full group-hover:bg-brand-primary/20 transition-all" />
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredTools.length === 0 && (
                <div className="text-center py-40 px-4 space-y-6">
                    <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto mb-8 text-slate-800 backdrop-blur-xl border border-white/5">
                        <Search className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-black text-white font-cairo">لم نجد ما تبحث عنه</h3>
                    <p className="text-slate-500 text-base font-medium font-cairo">جرب البحث بكلمات أخرى أو تصفح الأقسام</p>
                    <button
                        onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                        className="text-brand-primary font-black text-base hover:underline pt-6 font-cairo"
                    >
                        استعراض كل الأدوات
                    </button>
                </div>
            )}
        </div>
    );
};

export default ToolsDirectory;
