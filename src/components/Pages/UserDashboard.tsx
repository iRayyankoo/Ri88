"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
    Activity, ArrowRight, Grid, Layout, Star,
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
    Monitor, MousePointer2, Shuffle, CheckCircle2, Wind, Clock
} from 'lucide-react';
import { tools } from '@/data/tools';
import { useNavigation } from '@/context/NavigationContext';

const UserDashboard = () => {
    const { setCurrentView, launchTool } = useNavigation();

    // Icon Mapping Helper (Reduced version for Dashboard)
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
            'code': Code, 'sparkles': Zap
        };
        return icons[iconName] || Grid;
    };

    // Featured Tools (Real Data)
    const featuredTools = tools.filter(t =>
        ['loan-calc', 'pdf-merge', 'adobe-fix', 'img-compress'].includes(t.id)
    );

    return (
        <div className="space-y-8 pb-24">

            {/* 1. WELCOME CARD */}
            <div className="w-full relative overflow-hidden rounded-[32px] p-8 bg-gradient-to-br from-[#1c1c2e] to-[#0f0f16] border border-white/5 shadow-2xl">
                {/* Background Glows */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex items-start justify-between">
                    <div>
                        <div className="text-brand-primary text-xs font-bold uppercase tracking-widest mb-2">PREMIUM DASHBOARD</div>
                        <h1 className="text-3xl lg:text-4xl font-black text-white mb-2 leading-tight">
                            مرحباً، <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Alexander</span>
                        </h1>
                        <p className="text-slate-400 text-sm font-medium">عضو منذ مارس 2024</p>
                    </div>
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full border-2 border-brand-primary/20 p-1">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-brand-primary to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-primary/20">
                            A
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="mt-8 bg-[#ffffff0a] backdrop-blur-md rounded-2xl p-2 pl-6 flex items-center justify-between border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                            <span className="text-xs text-slate-400 block">الحالة</span>
                            <span className="text-sm font-bold text-emerald-400">اشتراك بريميوم نشط</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setCurrentView('plans')}
                        className="bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-lg shadow-brand-primary/30 transition-all active:scale-95"
                    >
                        تجديد
                    </button>
                </div>
            </div>

            {/* 2. SEARCH BAR */}
            <div className="relative group">
                <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center">
                    <Search className="absolute right-5 w-5 h-5 text-slate-500 group-focus-within:text-brand-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="ابحث عن الأدوات، التحليلات، النماذج..."
                        className="w-full h-16 bg-[#13131A] border border-white/10 rounded-[24px] pr-14 pl-6 text-white placeholder:text-slate-500 outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all shadow-xl font-medium"
                    />
                </div>
            </div>

            {/* 3. TOP TOOLS (Horizontal Scroll) */}
            <div>
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-lg font-bold text-white">الأدوات المميزة</h2>
                    <button onClick={() => setCurrentView('directory')} className="text-sm text-brand-primary font-bold hover:underline">عرض الكل &gt;</button>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 snap-x">
                    {featuredTools.map((tool, i) => {
                        const Icon = getIcon(tool.icon);
                        return (
                            <motion.button
                                key={tool.id}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => launchTool(tool.id)}
                                className="min-w-[160px] h-[180px] bg-[#13131A] border border-white/5 rounded-[28px] p-5 flex flex-col items-center justify-center gap-4 hover:border-brand-primary/30 transition-all snap-start group"
                            >
                                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center shadow-lg group-hover:bg-brand-primary/20 transition-all">
                                    <Icon className="w-7 h-7 text-slate-400 group-hover:text-brand-primary transition-all" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-white font-bold text-sm mb-1">{tool.titleAr}</h3>
                                    <p className="text-slate-500 text-[10px] font-medium line-clamp-1">{tool.descAr}</p>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* 4. RECENT ACTIVITY (Vertical List) */}
            <div>
                <h2 className="text-lg font-bold text-white mb-4 px-2">النشاط الأخير</h2>
                <div className="space-y-3">
                    {[
                        { title: 'حاسبة القروض', sub: 'تم حساب الدفعات الشهرية للقرض الشخصي', time: 'منذ 2 دقيقة', icon: Calculator, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                        { title: 'دمج ملفات PDF', sub: 'تم دمج 3 ملفات في مستند واحد', time: 'منذ 1 ساعة', icon: Files, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
                        { title: 'ضغط الصور', sub: 'تم تقليل حجم 5 صور بنسبة 70%', time: 'منذ 5 ساعات', icon: ImageMinus, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-5 bg-[#13131A] border border-white/5 rounded-[24px] hover:bg-white/5 transition-colors group cursor-pointer">
                            <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                <item.icon className={`w-6 h-6 ${item.color}`} />
                            </div>
                            <div className="flex-1 text-right">
                                <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                                <p className="text-slate-500 text-xs">{item.sub}</p>
                            </div>
                            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider whitespace-nowrap">{item.time}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

// CheckCircle2 was moved to main imports
export default UserDashboard;
