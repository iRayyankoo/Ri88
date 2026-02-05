"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Zap, Grid, BookOpen, Code, Image as ImageIcon, Briefcase, Filter, ArrowRightLToR } from 'lucide-react';
import { tools } from '@/data/tools'; // Assuming this exists, or we mock it locally if needed
import { useNavigation } from '@/context/NavigationContext';

// Categories for Sidebar & Chips
const categories = [
    { id: 'all', label: 'الكل', icon: Grid },
    { id: 'finance', label: 'المالية', icon: Briefcase },
    { id: 'text', label: 'النصوص', icon: BookOpen },
    { id: 'dev', label: 'المطورين', icon: Code },
    { id: 'image', label: 'الصور', icon: ImageIcon },
    { id: 'productivity', label: 'الإنتاجية', icon: Zap },
];

const ToolsDirectory = () => {
    const { launchTool } = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [favorites, setFavorites] = useState<string[]>([]);

    // Filter Logic
    const filteredTools = tools.filter(tool => {
        const matchesSearch = (tool.title?.includes(searchQuery) || tool.titleAr?.includes(searchQuery));
        const matchesCat = activeCategory === 'all' || tool.category === activeCategory;
        return matchesSearch && matchesCat;
    });

    const toggleFavorite = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-screen">

            {/* 1. VERTICAL SIDEBAR (Desktop) */}
            <aside className="hidden lg:block w-64 shrink-0 sticky top-24 h-[calc(100vh-8rem)] stitch-glass rounded-3xl p-6 overflow-y-auto">
                <div className="flex items-center gap-3 mb-8 px-2">
                    <Filter className="w-5 h-5 text-brand-primary" />
                    <h3 className="text-lg font-black text-white">التصنيفات</h3>
                </div>
                <div className="space-y-2">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all group ${activeCategory === cat.id
                                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <cat.icon className={`w-4 h-4 ${activeCategory === cat.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                                <span>{cat.label}</span>
                            </div>
                            {activeCategory === cat.id && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                        </button>
                    ))}
                </div>
            </aside>

            <div className="flex-1 space-y-8">
                {/* 2. TOP AREA: SEARCH & CHIPS */}
                <div className="space-y-6">
                    {/* Floating Search Input */}
                    <div className="relative group max-w-2xl mx-auto">
                        <div className="absolute inset-0 bg-brand-primary/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="ابحث عن أداة (مثال: حاسبة، تحويل PDF...)"
                                className="w-full h-14 bg-[#0D0D0F]/60 backdrop-blur-xl border border-white/10 rounded-2xl pr-14 pl-6 text-white placeholder:text-slate-500 outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all shadow-2xl text-lg text-right"
                            />
                            <Search className="absolute right-5 w-6 h-6 text-slate-500 group-focus-within:text-brand-primary transition-colors" />
                        </div>
                    </div>

                    {/* Horizontal Chips (Mobile/Tablet primarily, but visible on all) */}
                    <div className="lg:hidden flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`shrink-0 px-5 py-2.5 rounded-full text-xs font-black border transition-all ${activeCategory === cat.id
                                        ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20 transform scale-105'
                                        : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. TOOLS GRID */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCategory + searchQuery}
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
                    >
                        {filteredTools.map((tool) => (
                            <motion.div
                                key={tool.id}
                                variants={cardVariants}
                                whileHover={{ y: -8, boxShadow: '0 20px 40px -10px rgba(139, 92, 246, 0.2)' }}
                                onClick={() => launchTool(tool.id)}
                                className="group relative bg-[#13131A] border border-white/5 hover:border-brand-primary/40 rounded-[28px] p-6 cursor-pointer transition-all duration-300 overflow-hidden"
                            >
                                {/* Gradient Blob on Hover */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 blur-[60px] rounded-full translate-x-10 -translate-y-10 group-hover:bg-brand-primary/30 transition-all" />

                                <div className="relative z-10 flex flex-col items-center text-center h-full">
                                    {/* Icon */}
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 group-hover:bg-brand-primary group-hover:text-white flex items-center justify-center text-slate-400 transition-colors mb-4 border border-white/5 group-hover:border-brand-primary shadow-inner">
                                        <Zap className="w-7 h-7" />
                                    </div>

                                    {/* Text */}
                                    <h3 className="text-base font-bold text-white mb-2 line-clamp-1">{tool.titleAr || tool.title}</h3>
                                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed h-8">{tool.descAr || tool.desc}</p>

                                    {/* Favorite Button */}
                                    <button
                                        onClick={(e) => toggleFavorite(e, tool.id)}
                                        className="absolute top-4 left-4 text-slate-600 hover:text-yellow-400 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                    >
                                        <Star className={`w-4 h-4 ${favorites.includes(tool.id) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Empty State */}
                {filteredTools.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600">
                            <Search className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">لا توجد نتائج</h3>
                        <p className="text-slate-500 text-sm">جرب البحث بكلمات مختلفة أو تغيير التصنيف.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ToolsDirectory;
