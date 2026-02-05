"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Zap, ArrowLeft, Star } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import GlassCard from '../ui/GlassCard';

/*
  VisitorToolPreview:
  Displays a "Teaser" version of a tool.
  The content is blurred, and a "Premium Lock" overlay prevents interaction.
*/

const VisitorToolPreview = () => {
    const { setCurrentView } = useNavigation();

    return (
        <div className="relative min-h-[80vh] flex items-center justify-center p-4 lg:p-12 overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-brand-primary/10 blur-[150px] rounded-full pointer-events-none" />

            {/* MAIN CONTENT CONTAINER (BLURRED) */}
            <div className="w-full max-w-5xl relative opacity-40 blur-sm select-none pointer-events-none transform scale-[0.98]">

                {/* Mock Tool Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-white">المحلل المالي الذكي</h1>
                        <p className="text-slate-400">تحليل البيانات المالية واستخراج التوقعات المستقبلية بدقة 99%</p>
                    </div>
                </div>

                {/* Mock Tool Body - 2 Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Mock Inputs */}
                    <div className="lg:col-span-7 space-y-6">
                        <GlassCard className="min-h-[500px] space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300">رفع الملف المالي (CSV, Excel)</label>
                                <div className="h-32 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center bg-white/5">
                                    <span className="text-slate-500">سحب وإفلات الملف هنا</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-300">نطاق التاريخ</label>
                                    <div className="h-12 bg-white/5 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-300">نوع العملة</label>
                                    <div className="h-12 bg-white/5 rounded-xl" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300">ملاحظات إضافية للذكاء الاصطناعي</label>
                                <div className="h-32 bg-white/5 rounded-xl" />
                            </div>
                        </GlassCard>
                    </div>

                    {/* Mock Results */}
                    <div className="lg:col-span-5 space-y-6">
                        <GlassCard title="النتائج المتوقعة" className="min-h-[500px]">
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-16 bg-white/5 rounded-xl w-full animate-pulse" />
                                ))}
                                <div className="h-40 bg-brand-primary/10 rounded-xl w-full mt-8" />
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>

            {/* LOCK OVERLAY (CTA) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
            >
                <div className="stitch-glass p-10 text-center space-y-8 shadow-[0_0_80px_rgba(0,0,0,0.8)] border-brand-primary/30 relative overflow-hidden">

                    {/* Gloss Effect */}
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-white/10 via-transparent to-transparent rotate-45 pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <div className="w-20 h-20 bg-brand-primary rounded-3xl flex items-center justify-center shadow-lg shadow-brand-primary/40">
                            <Lock className="w-10 h-10 text-white" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                <span className="text-amber-400 font-bold tracking-widest text-xs uppercase">ميزة حصرية للأعضاء</span>
                            </div>
                            <h2 className="text-3xl font-black text-white">هذه الأداة متاحة فقط للمشتركين</h2>
                            <p className="text-slate-400 font-medium leading-relaxed">
                                قم بترقية حسابك الآن واحصل على وصول غير محدود لهذه الأداة وأكثر من 60 أداة ذكية أخرى.
                            </p>
                        </div>

                        <div className="flex flex-col w-full gap-3 pt-4">
                            <button
                                onClick={() => setCurrentView('admin')}
                                className="btn-primary w-full py-4 text-base shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-2"
                            >
                                <Zap className="w-5 h-5" />
                                اشترك الآن - خصم 50%
                            </button>
                            <button
                                onClick={() => setCurrentView('landing')}
                                className="text-slate-500 font-bold text-sm hover:text-white transition-colors py-2"
                            >
                                العودة للرئيسية
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

        </div>
    );
};

export default VisitorToolPreview;
