"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, Settings2, Sparkles, Share2, Copy, History,
    RotateCcw, Trash2, ArrowLeft, Zap, CheckCircle2
} from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import { tools } from '@/data/tools';

const ToolWorkspace = () => {
    const { activeToolId, setCurrentView, launchTool } = useNavigation();
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<null | string>(null);

    const tool = tools.find(t => t.id === activeToolId) || tools[0];

    // Mock Related Tools
    const relatedTools = tools.filter(t => t.cat === tool.cat && t.id !== tool.id).slice(0, 3);

    const handleProcess = () => {
        setIsProcessing(true);
        // Simulate processing
        setTimeout(() => {
            setIsProcessing(false);
            setResult("Success");
        }, 1500);
    };

    return (
        <div className="min-h-screen pb-20">

            {/* 1. HEADER */}
            <header className="flex items-center justify-between py-6 mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setCurrentView('directory')}
                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors border border-white/5"
                    >
                        <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-white">{tool.titleAr || tool.title}</h1>
                        <p className="text-sm text-slate-500 font-medium">{tool.cat}</p>
                    </div>
                </div>

                {/* User Avatar (from screenshot) */}
                <div className="hidden md:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                    <span className="text-xs font-bold text-slate-300">Rayan Dev</span>
                    <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold">R</div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">

                {/* 2. LEFT COLUMN: INPUTS (Configuration) */}
                <div className="lg:col-span-7 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="stitch-card p-1" // Gradient Border Container
                    >
                        <div className="bg-[#13131A] rounded-[24px] p-6 lg:p-8 space-y-8 relative overflow-hidden">

                            {/* Card Header */}
                            <div className="flex items-center gap-3 text-brand-primary mb-2">
                                <Settings2 className="w-5 h-5" />
                                <h3 className="text-lg font-bold text-white">إعدادات المدخلات</h3>
                            </div>

                            {/* DYNAMIC FORM PLACEHOLDER */}
                            <div className="space-y-6">
                                {/* Sample Input Group */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">القيمة المدخلة</label>
                                    <input
                                        type="text"
                                        placeholder="أدخل القيمة هنا..."
                                        className="w-full bg-[#0D0D0F] border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-slate-600 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 outline-none transition-all text-right font-medium"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">من</label>
                                        <select className="w-full bg-[#0D0D0F] border border-white/10 rounded-xl px-4 py-4 text-white outline-none appearance-none cursor-pointer">
                                            <option>خيار 1</option>
                                            <option>خيار 2</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">إلى</label>
                                        <select className="w-full bg-[#0D0D0F] border border-white/10 rounded-xl px-4 py-4 text-white outline-none appearance-none cursor-pointer">
                                            <option>خيار A</option>
                                            <option>خيار B</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* ACTION BUTTON */}
                            <button
                                onClick={handleProcess}
                                disabled={isProcessing}
                                className="w-full relative group overflow-hidden rounded-2xl bg-brand-primary p-[1px]"
                            >
                                <div className="relative bg-gradient-to-r from-brand-primary to-purple-600 hover:to-brand-primary px-8 py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]">
                                    {isProcessing ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span className="text-lg font-black text-white">معالجة البيانات</span>
                                            <Sparkles className="w-5 h-5 text-white/80 group-hover:rotate-12 transition-transform" />
                                        </>
                                    )}
                                </div>
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>

                        </div>
                    </motion.div>

                    {/* HISTORY SECTION (From Screenshot) */}
                    <div className="bg-[#13131A] border border-white/5 rounded-[24px] overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-400">
                                <History className="w-4 h-4" />
                                <span className="text-sm font-bold">آخر العمليات</span>
                            </div>
                            <button className="text-[10px] text-brand-primary font-bold hover:underline">عرض الكل</button>
                        </div>
                        <div className="divide-y divide-white/5">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-white">تحويل العملات (USD to SAR)</p>
                                        <p className="text-[10px] text-slate-500">منذ 15 دقيقة</p>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400"><RotateCcw className="w-4 h-4" /></button>
                                        <button className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. RIGHT COLUMN: OUTPUT (Live Result) */}
                <div className="lg:col-span-5 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-b from-[#1E1E24] to-[#13131A] border border-white/5 rounded-[32px] p-1 shadow-2xl"
                    >
                        <div className="bg-[#13131A]/50 backdrop-blur-xl rounded-[28px] p-8 h-full min-h-[400px] flex flex-col relative overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-10 z-10">
                                <div className="flex items-center gap-3 text-purple-400">
                                    <div className="p-2 bg-purple-500/10 rounded-lg">
                                        <Zap className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-widest">النتيجة الحالية</h3>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors"><Share2 className="w-4 h-4" /></button>
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors"><Copy className="w-4 h-4" /></button>
                                </div>
                            </div>

                            {/* Result Display */}
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 z-10">
                                {result ? (
                                    <>
                                        <motion.div
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tighter"
                                        >
                                            845.20
                                        </motion.div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold">
                                            <CheckCircle2 className="w-3 h-3" />
                                            تمت المعالجة بنجاح
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-slate-600 space-y-2">
                                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                                            <Zap className="w-6 h-6 opacity-50" />
                                        </div>
                                        <p className="text-sm font-medium">بانتظار المدخلات...</p>
                                    </div>
                                )}
                            </div>

                            {/* Decorative Background */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-primary/10 blur-[80px] rounded-full pointer-events-none" />
                        </div>
                    </motion.div>

                    {/* RELATED TOOLS */}
                    <div className="pt-4">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h4 className="text-white font-bold text-sm">أدوات ذات صلة</h4>
                            <button className="text-[10px] text-brand-primary font-bold">عرض الكل</button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {relatedTools.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => launchTool(t.id)}
                                    className="bg-[#13131A] border border-white/5 hover:border-brand-primary/30 p-4 rounded-2xl text-right group transition-all"
                                >
                                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-white mb-3 transition-colors">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <p className="text-xs font-bold text-white group-hover:text-brand-primary transition-colors line-clamp-1">{t.titleAr || t.title}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default ToolWorkspace;
