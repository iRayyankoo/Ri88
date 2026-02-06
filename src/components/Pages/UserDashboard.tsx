"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
    Activity, ArrowRight, Grid, Star,
    Search, Zap, Terminal, Code,
    FileText, Calculator,
    Shield, RefreshCw, Database,
    Percent, Wallet, ArrowRightLeft, Landmark, HandCoins, Bitcoin, Moon,
    CalendarClock, Timer, Globe, AlignRight, Eraser, CaseSensitive, Hash,
    Link2, QrCode, Ruler, Lock, Gauge, Smartphone, PenTool, Lightbulb,
    SearchCheck, Calendar, Sun, Files, Scissors, Minimize2, Image,
    ListOrdered, RotateCw, Stamp, Unlock, FileMinus, ArrowUpDown, Crop,
    ImageMinus, Maximize, Layers, Camera, Share2, Square, EyeOff, Sliders,
    Flame, Droplet, Braces, Binary, Fingerprint, Link, Regex, GitCompare, Key,
    Monitor, MousePointer2, Shuffle, Wind, Clock, Users, ArrowLeft
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
        case 'hand-coins': return <HandCoins className={className} />;
        default: return <Zap className={className} />;
    }
};

const UserDashboard = () => {
    const { setCurrentView, launchTool } = useNavigation();

    // Featured Tools (Real Data)
    const featuredTools = tools.filter(t =>
        ['loan-calc', 'pdf-merge', 'adobe-fix', 'img-compress'].includes(t.id)
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8 pb-24"
        >
            {/* 1. PREMIUM HEADER / WELCOME CARD */}
            <motion.div
                variants={itemVariants}
                className="w-full relative overflow-hidden rounded-[32px] bg-[#0F1115] border border-white/5 p-6 lg:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.3)] group"
            >
                {/* Background Textures & Glows */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-brand-primary/20 transition-colors duration-700" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-right space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-[9px] font-black text-brand-primary uppercase tracking-[0.2em]">
                            <Star className="w-3 h-3 fill-brand-primary" />
                            Premium Member
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-black text-white font-cairo leading-tight">
                            مرحباً بك، <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-cyan-400">ريان المطور</span>
                        </h1>
                        <p className="text-slate-400 text-sm font-medium">نظامك عمل بالأمس بـ <span className="text-white">24</span> مهمة ذكية.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-left md:text-right hidden md:block">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">الرصيد</p>
                            <p className="text-xl font-black text-white font-inter">$1,240.50</p>
                        </div>
                        <div className="w-16 h-16 rounded-[24px] p-0.5 bg-gradient-to-br from-brand-primary/20 to-white/5">
                            <div className="w-full h-full rounded-[22px] bg-[#0F1115] flex items-center justify-center border border-white/10 shadow-xl relative overflow-hidden group/avatar">
                                <span className="text-xl font-black text-white relative z-10">R</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* 2. BENTO STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Usage Status */}
                <motion.div variants={itemVariants} className="md:col-span-3 relative overflow-hidden rounded-[28px] bg-[#0F1115] border border-white/5 p-6 group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-[40px] pointer-events-none" />
                    <div className="relative z-10 flex flex-col justify-center h-full">
                        <div className="flex items-center gap-2 mb-4">
                            <Activity className="w-4 h-4 text-emerald-400" />
                            <h3 className="text-xs font-black text-white font-cairo uppercase tracking-widest opacity-60">استهلاك الموارد</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-end gap-3">
                                <span className="text-3xl font-black text-white">84%</span>
                                <span className="text-slate-500 text-[10px] font-bold uppercase mb-1">4.2 GB / 5.0 GB</span>
                            </div>
                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '84%' }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Action / Token Card */}
                <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[28px] bg-brand-primary p-6 group cursor-pointer active:scale-95 transition-transform flex flex-col justify-between">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                    <Database className="w-6 h-6 text-black/80" />
                    <h3 className="text-lg font-black font-cairo text-black leading-none mt-4">ترقية</h3>
                    <ArrowLeft className="w-5 h-5 text-black self-end" />
                </motion.div>
            </div>

            {/* 3. SEARCH & TOOLS */}
            <div className="space-y-6">
                <motion.div variants={itemVariants} className="relative group">
                    <div className="absolute inset-0 bg-brand-primary/10 blur-[20px] rounded-[24px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
                    <div className="relative flex items-center">
                        <Search className="absolute right-5 w-5 h-5 text-slate-500 group-focus-within:text-brand-primary transition-colors duration-500" />
                        <input
                            type="text"
                            placeholder="ابحث عن أداة..."
                            className="w-full h-14 bg-[#0F1115] border border-white/5 rounded-[20px] pr-14 pl-6 text-white text-sm placeholder:text-slate-600 outline-none focus:border-brand-primary/40 transition-all font-medium"
                        />
                    </div>
                </motion.div>

                {/* TOOLS GRID */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-lg font-black text-white font-cairo tracking-tight">الأكثر استخداماً</h2>
                        <button
                            onClick={() => setCurrentView('directory')}
                            className="text-[10px] font-black text-brand-primary hover:text-brand-primary/80 transition-colors uppercase tracking-widest flex items-center gap-1.5 group"
                        >
                            الكل
                            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {featuredTools.map((tool) => {
                            const getStyle = (cat: string) => {
                                switch (cat) {
                                    case 'finance': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                                    case 'pdf': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
                                    case 'design': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
                                    default: return 'text-brand-primary bg-brand-primary/10 border-brand-primary/20';
                                }
                            };
                            const style = getStyle(tool.cat);

                            return (
                                <motion.div
                                    key={tool.id}
                                    variants={itemVariants}
                                    whileHover={{ y: -4 }}
                                    onClick={() => launchTool(tool.id)}
                                    className="group relative p-4 rounded-[24px] bg-[#0F1115] border border-white/5 overflow-hidden transition-all duration-500 cursor-pointer hover:border-white/20"
                                >
                                    <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${style} border`}>
                                            <ToolIcon icon={tool.icon} className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-0.5 w-full">
                                            <h3 className="text-white font-black text-xs font-cairo truncate">{tool.titleAr || tool.title}</h3>
                                            <p className="text-slate-600 text-[9px] font-medium font-cairo uppercase tracking-widest">{tool.cat}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 4. RECENT ACTIVITY */}
            <div className="space-y-4">
                <h2 className="text-lg font-black text-white font-cairo tracking-tight px-1">النشاط الأخير</h2>
                <div className="grid grid-cols-1 gap-3">
                    {[
                        { title: 'حاسبة القروض', sub: 'تم حساب الدفعات الشهرية', time: 'منذ دقيقتين', icon: Calculator, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                        { title: 'دمج ملفات PDF', sub: 'تم دمج 3 ملفات', time: 'منذ ساعة', icon: Files, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
                        { title: 'ضغط الصور', sub: 'توفير 70% من المساحة', time: 'منذ 5 ساعات', icon: ImageMinus, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            whileHover={{ x: -4 }}
                            className="flex items-center gap-4 p-4 bg-[#0F1115] border border-white/5 rounded-[24px] hover:bg-white/[0.03] hover:border-white/10 transition-all group cursor-pointer"
                        >
                            <div className={`w-10 h-10 rounded-xl ${item.bg} border border-white/5 flex items-center justify-center shrink-0`}>
                                <item.icon className={`w-5 h-5 ${item.color}`} />
                            </div>
                            <div className="flex-1 text-right">
                                <h4 className="text-white font-black text-sm font-cairo">{item.title}</h4>
                                <p className="text-slate-500 text-[10px] font-medium font-cairo">{item.sub}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{item.time}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default UserDashboard;
