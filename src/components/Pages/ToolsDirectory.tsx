"use client";
import React, { useState, useMemo, useEffect } from 'react';
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
    Activity, Clock, Grid, Crown, Sparkles, AlertCircle, Wrench
} from 'lucide-react';
import { categories, tools as staticTools } from '@/data/tools';
import { useNavigation } from '@/context/NavigationContext';
import { SectionBanner } from './SectionBanner';
import { HeroBanner } from './HeroBanner';
import { getTools, seedTools } from '@/actions/tools';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

// The new DB structure for Tool
interface DbTool {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    url: string;
    isPremium: boolean;
    isActive: boolean;
    isMaintenance: boolean;
    isFreeForLimitedTime: boolean;
    price: number;
    rating: number;
    installs: number;
}

const ToolsDirectory = () => {
    const { launchTool } = useNavigation();
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [dbTools, setDbTools] = useState<DbTool[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- Data Fetching ---
    useEffect(() => {
        const loadTools = async () => {
            setIsLoading(true);
            const res = await getTools();
            if (res.success && res.tools) {
                // Filter out inactive tools entirely
                const fetchedDbTools = res.tools.filter((t: any) => t.isActive !== false) as DbTool[];
                setDbTools(fetchedDbTools);
            } else {
                toast.error(res.error || "فشل تحميل الأدوات");
            }
            setIsLoading(false);
        };
        loadTools();
    }, []);

    // Combine static tools and db tools into one list
    const allTools = useMemo(() => {
        // Map static tools to DbTool structure
        const mappedStaticTools: DbTool[] = staticTools.map(st => ({
            id: st.id,
            name: st.titleAr || st.title,
            description: st.descAr || st.desc,
            icon: st.icon,
            category: st.cat,
            url: `/tools/${st.id}`, // Default placeholder
            isPremium: false, // Default for static
            isActive: true, // Default for static
            isMaintenance: false, // Default for static
            isFreeForLimitedTime: false, // Default for static
            price: 0,
            rating: 5,
            installs: 0
        }));

        // Combine them without duplicates (if static tool is now in DB, use the DB version)
        const dbIds = new Set(dbTools.map(t => t.id));
        const filteredStaticTools = mappedStaticTools.filter(st => !dbIds.has(st.id));

        return [...dbTools, ...filteredStaticTools];
    }, [dbTools]);

    const handleSeed = async () => {
        const toastId = toast.loading("جاري إضافة أدوات تجريبية...");
        const res = await seedTools();
        if (res.error) {
            toast.error(res.error, { id: toastId });
        } else {
            toast.success(res.success, { id: toastId });
            // Reload tools
            const loadRes = await getTools();
            if (loadRes.success && loadRes.tools) setDbTools(loadRes.tools as DbTool[]);
        }
    };

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
            'code': Code, 'image-plus': Image, 'search': Search, 'check-circle-2': CheckCircle2, 'trophy': Activity,
            'dribbble': Activity, 'flag': Activity, 'swords': Activity, 'timer-reset': Timer, 'palette': Layers,
            'shuffle': Shuffle, 'wind': Wind, 'tag': Percent, 'calendar-plus': Calendar, 'sparkles': Sparkles, 'mic': Activity
        };
        return icons[iconName.toLowerCase()] || Grid;
    };

    // --- Filter Logic ---
    const filteredTools = useMemo(() => {
        return allTools.filter(tool =>
            (tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || tool.description.includes(searchQuery)) &&
            (activeCategory === 'all' || tool.category === activeCategory)
        );
    }, [searchQuery, activeCategory, allTools]);

    // Grouping for "All" view
    const groupedTools = useMemo(() => {
        if (activeCategory !== 'all') return { 'Current': filteredTools };

        const groups: Record<string, DbTool[]> = {};
        const priorityCats = ['productivity', 'finance', 'text', 'time', 'image', 'content', 'pdf', 'design', 'media', 'developer', 'saudi', 'sports', 'ai-tools', 'health'];

        priorityCats.forEach(cat => {
            const groupTools = filteredTools.filter(t => t.category === cat);
            if (groupTools.length > 0) groups[cat] = groupTools;
        });

        const otherTools = filteredTools.filter(t => !priorityCats.includes(t.category));
        if (otherTools.length > 0) groups['others'] = otherTools;

        return groups;
    }, [filteredTools, activeCategory]);

    const groupTitles: Record<string, string> = {
        'finance': 'أدوات مالية',
        'pdf': 'أدوات PDF والمستندات',
        'text': 'النصوص والمحتوى',
        'image': 'تحرير الصور',
        'developer': 'أدوات المطورين',
        'productivity': 'الإنتاجية',
        'time': 'الوقت والتاريخ',
        'content': 'صناعة المحتوى',
        'design': 'أدوات التصميم',
        'media': 'أدوات الوسائط',
        'saudi': 'خدمات سعودية',
        'sports': 'الرياضة',
        'ai-tools': 'أدوات الذكاء الاصطناعي',
        'health': 'الصحة والرفاهية',
        'others': 'أدوات أخرى',
        'Current': 'النتائج'
    };

    // Handle Tool Access Control
    const handleToolClick = (tool: DbTool) => {
        if (tool.isMaintenance) {
            toast.error(
                <div className="flex flex-col gap-2 font-cairo text-right w-full">
                    <span className="font-bold flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-red-500" /> الأداة تحت الصيانة
                    </span>
                    <span className="text-sm">نعمل على تحسين هذه الأداة حالياً، يرجى المحاولة في وقت لاحق.</span>
                </div>
                , { duration: 4000 });
            return;
        }

        if (!session?.user) {
            toast.error("يرجى تسجيل الدخول أولاً للوصول إلى الأدوات.");
            return;
        }

        const isFreeLimited = tool.isFreeForLimitedTime;
        const needsPro = tool.isPremium && !isFreeLimited;

        if (needsPro && !session.user.isPro && session.user.role !== "ADMIN") {
            toast.error(
                <div className="flex flex-col gap-2 font-cairo text-right w-full">
                    <span className="font-bold flex items-center gap-2">
                        <Crown className="w-5 h-5 text-amber-400" /> ميزة مدفوعة
                    </span>
                    <span className="text-sm">هذه الأداة متاحة فقط لمشتركي باقة PRO. قم بالترقية للوصول الكامل.</span>
                </div>
                , { duration: 4000 });
            return;
        }

        // Allow access
        toast.success(`جاري تشغيل: ${tool.name}`);
        launchTool(tool.id, tool);
    };


    return (
        <div className="w-full max-w-7xl mx-auto pb-32 space-y-8 lg:space-y-12 animate-in fade-in duration-700 overflow-x-hidden pt-6">
            <HeroBanner />

            {/* Admin Seed Button Placeholder (Only visible to Admins if table is empty) */}
            {session?.user.role === 'ADMIN' && dbTools.length === 0 && !isLoading && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h4 className="text-amber-400 font-bold mb-1 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" /> لم نعثر على أي أدوات في قاعدة البيانات
                        </h4>
                        <p className="text-slate-400 text-sm">بما أنك مدير النظام، يمكنك إضافة أدوات وهمية للتجربة فوراً عبر الصلاحيات.</p>
                    </div>
                    <button
                        onClick={handleSeed}
                        className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-500/20 whitespace-nowrap"
                    >
                        إضافة أدوات تجريبية 🚀
                    </button>
                </div>
            )}

            <section className="space-y-6 lg:space-y-8">
                <div className="flex items-center justify-between px-4 lg:px-2">
                    <h3 className="text-lg lg:text-xl font-black text-white font-cairo">أبرز الأدوات {allTools.length > 0 ? `(${allTools.length})` : ''}</h3>
                    <button onClick={() => setActiveCategory('all')} className="flex items-center gap-2 text-brand-primary font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                        Browse
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-6 no-scrollbar -mx-4 px-4 snap-x relative">
                    {isLoading ? (
                        [1, 2, 3, 4].map(n => (
                            <div key={n} className="min-w-[200px] lg:min-w-[400px] h-[240px] rounded-[24px] bg-white/5 animate-pulse skeleton" />
                        ))
                    ) : allTools.slice(0, 8).map((tool) => {
                        const Icon = getIcon(tool.icon);
                        return (
                            <motion.div
                                key={tool.id}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                whileInView={{ opacity: 1, scale: [0.9, 1.05, 1], y: 0 }}
                                viewport={{ once: false, amount: 0.5 }}
                                whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.2 } }}
                                className={`min-w-[200px] lg:min-w-[400px] rounded-[20px] lg:rounded-[24px] overflow-hidden border bg-white/[0.03] backdrop-blur-[24px] p-4 lg:p-6 snap-center group cursor-pointer transition-shadow relative
                                ${tool.isMaintenance ? 'border-red-500/20 hover:border-red-500/40 opacity-80' : 'border-white/[0.08] hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]'}`}
                                onClick={() => handleToolClick(tool)}
                            >
                                {tool.isMaintenance ? (
                                    <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-black tracking-widest rounded-full flex items-center gap-1 shadow-lg shadow-red-500/10">
                                        <Wrench className="w-3 h-3" /> صيانة
                                    </div>
                                ) : tool.isFreeForLimitedTime ? (
                                    <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-black tracking-widest rounded-full flex items-center gap-1 shadow-lg shadow-blue-500/20">
                                        <Clock className="w-3 h-3" /> مجاني لفترة
                                    </div>
                                ) : tool.isPremium ? (
                                    <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-black tracking-widest rounded-full flex items-center gap-1 shadow-lg shadow-amber-500/20">
                                        <Crown className="w-3 h-3" /> PRO
                                    </div>
                                ) : null}

                                <div className="w-full aspect-video rounded-2xl lg:rounded-3xl bg-gradient-to-br from-[#2a1b4d] to-[#0f0f16] mb-4 lg:mb-6 relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#8B5CF620,_transparent_70%)]" />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Icon className="w-8 h-8 lg:w-12 lg:h-12 text-slate-500 group-hover:text-brand-primary transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-3 lg:space-y-4">
                                    <h4 className="text-lg font-black text-white font-cairo truncate">{tool.name}</h4>
                                    <p className="text-slate-500 text-xs font-medium leading-relaxed font-cairo line-clamp-2">
                                        {tool.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            <div className="space-y-12">
                <header className="space-y-6 pt-4 px-2">
                    <div className="relative group max-w-2xl mx-auto">
                        <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-slate-500 group-focus-within:text-brand-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="ابحث في الأدوات..."
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

                {!isLoading && Object.entries(groupedTools).map(([key, group]) => {
                    const groupTitle = groupTitles[key] || groupTitles['others'];

                    // Transform DbTool to match what SectionBanner expects for now
                    // SectionBanner expects: titleAr, descAr, icon, id. 
                    const mappedGroup = group.map(t => ({
                        id: t.id,
                        cat: t.category,
                        title: t.name, // Fallback for English title, although SectionBanner uses titleAr mainly.
                        titleAr: t.name,
                        desc: t.description,
                        descAr: t.description,
                        icon: t.icon,
                        status: 'existing',
                        isPremium: t.isPremium,
                        isMaintenance: t.isMaintenance,
                        isFreeForLimitedTime: t.isFreeForLimitedTime
                    }));

                    return (
                        <div key={key} className="space-y-8 px-2">
                            <div className="mb-2">
                                <SectionBanner
                                    categoryKey={key}
                                    title={groupTitle}
                                    tools={mappedGroup}
                                />
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                                {group.map(tool => {
                                    const Icon = getIcon(tool.icon);
                                    return (
                                        <motion.div
                                            key={tool.id}
                                            whileHover={{ y: -4, scale: 1.01 }}
                                            onClick={() => handleToolClick(tool)}
                                            className={`bg-white/[0.03] backdrop-blur-sm border p-4 lg:p-7 rounded-[24px] lg:rounded-[28px] cursor-pointer transition-all group relative overflow-hidden shadow-md flex flex-col items-start min-h-[160px]
                                            ${tool.isMaintenance ? 'border-red-500/20 hover:border-red-500/40 opacity-80' : 'border-white/[0.08] hover:border-brand-primary/40 hover:shadow-[0_20px_40px_rgba(139,92,246,0.1)]'}`}
                                        >
                                            {tool.isMaintenance ? (
                                                <div className="absolute top-4 left-4 z-20 px-2 py-0.5 bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-black tracking-widest rounded-md flex items-center gap-1">
                                                    <Wrench className="w-3 h-3" /> صيانة
                                                </div>
                                            ) : tool.isFreeForLimitedTime ? (
                                                <div className="absolute top-4 left-4 z-20 px-2 py-0.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-black tracking-widest rounded-md flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> مجاني لفترة
                                                </div>
                                            ) : tool.isPremium ? (
                                                <div className="absolute top-4 left-4 z-20 px-2 py-0.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-black tracking-widest rounded-md flex items-center gap-1">
                                                    <Crown className="w-3 h-3" /> PRO
                                                </div>
                                            ) : null}

                                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from),_transparent_70%)] from-brand-primary/20 to-transparent opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none" />

                                            <div className="flex flex-col gap-3 lg:gap-6 text-right items-start flex-1 w-full">
                                                <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-inner border border-white/5 group-hover:border-brand-primary/50 relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <Icon className="w-5 h-5 lg:w-7 lg:h-7 relative z-10" />
                                                </div>

                                                <div className="w-full mt-auto">
                                                    <h4 className="text-white font-black text-sm lg:text-lg mb-1 lg:mb-2 group-hover:text-brand-primary transition-colors font-cairo pr-1">{tool.name}</h4>
                                                    <p className="text-slate-500 text-[10px] lg:text-[13px] font-medium leading-relaxed font-cairo line-clamp-2 pr-1">
                                                        {tool.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from),_transparent_70%)] from-brand-primary/10 to-transparent opacity-30 group-hover:opacity-60 transition-opacity pointer-events-none" />
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
                !isLoading && filteredTools.length === 0 && allTools.length > 0 && (
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
