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
import { SectionBanner } from './SectionBanner';
import { HeroBanner } from './HeroBanner';

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


    return (
        <div className="w-full max-w-7xl mx-auto pb-32 space-y-8 lg:space-y-12 animate-in fade-in duration-700 overflow-x-hidden">
            {/* 1. CINEMATIC FEATURED SECTION */}
            {/* 1. CINEMATIC FEATURED SECTION (Dynamic) */}
            <HeroBanner />

            <section className="space-y-6 lg:space-y-8">
                <div className="flex items-center justify-between px-4 lg:px-2">
                    <h3 className="text-lg lg:text-xl font-black text-white font-cairo">innovation labs</h3>
                    <button onClick={() => setActiveCategory('all')} className="flex items-center gap-2 text-cyan-400 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                        Browse
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-6 no-scrollbar -mx-4 px-4 snap-x relative">
                    {tools.slice(0, 8).map((tool, i) => {
                        const Icon = getIcon(tool.icon);
                        return (
                            <motion.div
                                key={tool.id}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                whileInView={{
                                    opacity: 1,
                                    scale: [0.9, 1.05, 1],
                                    y: 0
                                }}
                                viewport={{ once: false, amount: 0.5 }}
                                whileHover={{
                                    y: -10,
                                    scale: 1.02,
                                    transition: { duration: 0.2 }
                                }}
                                className="min-w-[200px] lg:min-w-[400px] rounded-[20px] lg:rounded-[24px] overflow-hidden border border-white/[0.08] bg-white/[0.03] backdrop-blur-[24px] p-4 lg:p-6 snap-center group cursor-pointer transition-shadow hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]"
                                onClick={() => launchTool(tool.id)}
                            >
                                {/* Media Placeholder */}
                                <div className="w-full aspect-video rounded-2xl lg:rounded-3xl bg-gradient-to-br from-[#2a1b4d] to-[#0f0f16] mb-4 lg:mb-6 relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#8B5CF620,_transparent_70%)]" />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Icon className="w-8 h-8 lg:w-12 lg:h-12 text-slate-500 group-hover:text-brand-primary transition-colors" />
                                    </div>
                                </div>

                                {/* Tool Info */}
                                <div className="space-y-3 lg:space-y-4">
                                    <h4 className="text-lg font-black text-white font-cairo truncate">{tool.titleAr}</h4>
                                    <p className="text-slate-500 text-xs font-medium leading-relaxed font-cairo line-clamp-2">
                                        {tool.descAr}
                                    </p>
                                </div>
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
                                    className={`flex items-center gap-2 lg:gap-3 px-5 lg:px-8 py-2.5 lg:py-4 rounded-[20px] lg:rounded-[24px] text-[11px] lg:text-xs font-black whitespace-nowrap transition-all border snap-start font-cairo ${isActive
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
                            {/* Replaced standard header with Premium Banner */}
                            <div className="mb-2">
                                <SectionBanner categoryKey={key} title={groupTitle} tools={group} />
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                                {group.map(tool => {
                                    const Icon = getIcon(tool.icon);
                                    return (
                                        <motion.div
                                            key={tool.id}
                                            whileHover={{ y: -8, scale: 1.01 }}
                                            onClick={() => launchTool(tool.id)}
                                            className="bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] p-4 lg:p-7 rounded-[24px] lg:rounded-[28px] cursor-pointer transition-all group relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-brand-primary/40 hover:shadow-[0_20px_40px_rgba(139,92,246,0.1)]"
                                        >
                                            {/* Decorative Corner Glow */}
                                            <div className="absolute -top-10 -right-10 w-16 h-16 bg-brand-primary/10 blur-3xl group-hover:bg-brand-primary/20 transition-colors" />

                                            <div className="flex flex-col gap-3 lg:gap-6 text-right items-start">
                                                <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-inner border border-white/5 group-hover:border-brand-primary/50 relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    {React.createElement(getIcon(tool.icon), { className: "w-5 h-5 lg:w-7 lg:h-7 relative z-10" })}
                                                </div>

                                                <div className="w-full">
                                                    <h4 className="text-white font-black text-sm lg:text-lg mb-1 lg:mb-2 group-hover:text-brand-primary transition-colors font-cairo">{tool.titleAr}</h4>
                                                    <p className="text-slate-500 text-[10px] lg:text-[13px] font-medium leading-relaxed font-cairo line-clamp-2">
                                                        {tool.descAr}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-brand-primary/5 blur-3xl rounded-full group-hover:bg-brand-primary/20 transition-all" />
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {
                filteredTools.length === 0 && (
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
                )
            }
        </div>
    );
};

export default ToolsDirectory;
