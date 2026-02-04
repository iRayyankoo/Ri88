"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, Construction, Filter, CheckCircle2, ArrowLeft } from 'lucide-react';
import { tools, categories, Tool } from '@/data/tools';
import { useNavigation } from '@/context/NavigationContext';

const ToolsDirectory = () => {
    const [activeCat, setActiveCat] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const { setCurrentView } = useNavigation();

    const filteredTools = useMemo(() => {
        let res = tools;
        if (activeCat !== 'all') {
            res = res.filter(t => t.cat === activeCat);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            res = res.filter(t =>
                (t.title && t.title.toLowerCase().includes(q)) ||
                (t.titleAr && t.titleAr.includes(q)) ||
                (t.desc && t.desc.toLowerCase().includes(q)) ||
                (t.descAr && t.descAr.includes(q))
            );
        }
        return res;
    }, [activeCat, searchQuery]);

    return (
        <div className="space-y-12">

            {/* HEADER & SEARCH */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-8 border-b border-white/5">
                <div className="text-right space-y-2">
                    <h2 className="text-3xl font-black text-white">دليل الأدوات الذكية</h2>
                    <p className="text-slate-500 font-medium">استكشف أكثر من <span className="text-brand-primary">60 أداة</span> احترافية مقسمة حسب الفئات.</p>
                </div>

                <div className="relative w-full lg:max-w-md group">
                    <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" />
                    <input
                        type="text"
                        className="w-full bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl py-4 pr-16 pl-6 text-white text-sm outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all text-right"
                        placeholder="ابحث عن اسم الأداة أو وصفها..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* FILTER CHIPS */}
            <div className="flex flex-wrap gap-3 justify-center">
                <button
                    onClick={() => setActiveCat('all')}
                    className={`px-8 py-3.5 rounded-2xl font-black text-xs transition-all border ${activeCat === 'all'
                        ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20'
                        : 'bg-white/5 border-white/5 text-slate-500 hover:text-white hover:bg-white/10'
                        }`}
                >
                    الكل
                </button>
                {categories.filter(c => c.id !== 'all').map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCat(cat.id)}
                        className={`px-8 py-3.5 rounded-2xl font-black text-xs transition-all border ${activeCat === cat.id
                            ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20'
                            : 'bg-white/5 border-white/5 text-slate-500 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        {cat.nameAr}
                    </button>
                ))}
            </div>

            {/* TOOLS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredTools.length > 0 ? (
                        filteredTools.map((tool) => (
                            <motion.div
                                key={tool.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -8, backgroundColor: 'rgba(139, 92, 246, 0.08)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setCurrentView('workspace')}
                                className="glass-card p-6 flex flex-col gap-6 group cursor-pointer transition-all text-right border-white/5 relative z-10"
                            >
                                <div className="flex justify-between items-start pointer-events-none">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all shadow-inner">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest bg-brand-secondary/10 text-brand-secondary px-2 py-0.5 rounded-md border border-brand-secondary/20">Active</span>
                                </div>

                                <div className="space-y-1 pointer-events-none">
                                    <h4 className="font-black text-white group-hover:text-brand-primary transition-colors">{tool.titleAr || tool.title}</h4>
                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2 italic">{tool.descAr || tool.desc}</p>
                                </div>

                                <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5 pointer-events-none">
                                    <ArrowLeft className="w-4 h-4 text-brand-primary translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all font-black" />
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{tool.cat}</span>
                                        <Construction className="w-3 h-3 text-slate-600" />
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-32 flex flex-col items-center justify-center gap-6 glass-card border-dashed border-white/10"
                        >
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-slate-700">
                                <Filter className="w-10 h-10" />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-xl font-black text-slate-400 italic">عذراً، لم نجد نتائج لبحثك</p>
                                <p className="text-sm text-slate-600 font-medium tracking-tight">جرب استخدام كلمات بحث مختلفة أو فئة أخرى.</p>
                            </div>
                            <button
                                onClick={() => { setSearchQuery(''); setActiveCat('all'); }}
                                className="text-brand-primary font-black text-xs hover:underline decoration-brand-primary/30 underline-offset-4"
                            >
                                إعادة تعيين المرشحات
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </div>
    );
};

export default ToolsDirectory;
