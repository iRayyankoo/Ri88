"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Star, Filter, Package, ShieldCheck } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import GlassCard from '../ui/GlassCard';

/*
  AddonsStore:
  A marketplace for installing advanced capabilities / plugins.
*/

const AddonsStore = () => {
    const { setCurrentView } = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const categories = [
        { id: 'all', name: 'الكل' },
        { id: 'ai', name: 'الذكاء الاصطناعي' },
        { id: 'data', name: 'معالجة البيانات' },
        { id: 'security', name: 'الأمان' },
        { id: 'integration', name: 'التكامل' },
    ];

    const addons = [
        { id: 1, title: 'GPT-4 Turbo Engine', cat: 'ai', price: 'مجاني', installs: '12k', rating: 4.9, desc: 'محرك أداء عالي السرعة لمعالجة النصوص وتوليد الأكواد.' },
        { id: 2, title: 'PDF OCR Advanced', cat: 'data', price: '49 ر.س', installs: '8.5k', rating: 4.7, desc: 'استخراج النصوص من الصور والملفات الممسوحة ضوئياً بدقة عالية.' },
        { id: 3, title: 'Saudi VAT Calc', cat: 'data', price: 'مجاني', installs: '25k', rating: 4.8, desc: 'حاسبة ضريبة القيمة المضافة متوافقة مع هيئة الزكاة والدخل.' },
        { id: 4, title: 'Secure Vault', cat: 'security', price: '99 ر.س', installs: '3k', rating: 5.0, desc: 'تشفير الملفات الحساسة وحمايتها بكلمة مرور متقدمة.' },
        { id: 5, title: 'Slack Connector', cat: 'integration', price: 'مجاني', installs: '5k', rating: 4.5, desc: 'إرسال الإشعارات والتقارير مباشرة إلى قنوات Slack.' },
        { id: 6, title: 'Excel Power Pack', cat: 'data', price: '19 ر.س', installs: '10k', rating: 4.6, desc: 'مجموعة أدوات متقدمة لمعالجة جداول البيانات الضخمة.' },
    ];

    const filteredAddons = addons.filter(item =>
        (activeCategory === 'all' || item.cat === activeCategory) &&
        (item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-8 border-b border-white/5">
                <div className="text-right space-y-2">
                    <h2 className="text-3xl font-black text-white">متجر الإضافات</h2>
                    <p className="text-slate-500 font-medium">قم بتوسيع إمكانيات منصتك بأدوات وإضافات احترافية.</p>
                </div>
                <div className="relative w-full lg:max-w-md group">
                    <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl py-4 pr-16 pl-6 text-white text-sm outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all text-right"
                        placeholder="ابحث عن إضافة..."
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-3 justify-center">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all border ${activeCategory === cat.id
                                ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20'
                                : 'bg-white/5 border-white/5 text-slate-500 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAddons.map((addon) => (
                    <motion.div
                        key={addon.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="stitch-glass p-6 group hover:border-brand-primary/30 transition-all flex flex-col gap-4 relative"
                    >
                        {/* Icon & Badge */}
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                                <Package className="w-6 h-6" />
                            </div>
                            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border ${addon.price === 'مجاني'
                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                    : 'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20'
                                }`}>
                                {addon.price}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <h3 className="font-bold text-white text-lg group-hover:text-brand-primary transition-colors">{addon.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{addon.desc}</p>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-600 mt-2">
                            <div className="flex items-center gap-1">
                                <Download className="w-3 h-3" />
                                {addon.installs}
                            </div>
                            <div className="flex items-center gap-1 text-amber-400">
                                <Star className="w-3 h-3 fill-current" />
                                {addon.rating}
                            </div>
                            {addon.id === 4 && (
                                <div className="flex items-center gap-1 text-green-400 ml-auto" title="تم التحقق بواسطة RI88">
                                    <ShieldCheck className="w-3 h-3" />
                                </div>
                            )}
                        </div>

                        {/* Action */}
                        <button className="mt-4 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold border border-white/5 hover:border-white/10 transition-all active:scale-95 flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" />
                            تثبيت الإضافة
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AddonsStore;
