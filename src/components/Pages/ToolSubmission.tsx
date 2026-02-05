"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Check, ChevronLeft, ChevronRight, Code } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import GlassCard from '../ui/GlassCard';

const ToolSubmission = () => {
    const { setCurrentView } = useNavigation();
    const [step, setStep] = useState(1);

    const steps = [
        { id: 1, title: 'المعلومات الأساسية' },
        { id: 2, title: 'الإعدادات التقنية' },
        { id: 3, title: 'المراجعة والإرسال' }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-white">رفع أداة جديدة</h2>
                    <p className="text-slate-500 font-medium">ساهم في نمو المنصة واربح من أدواتك.</p>
                </div>
                <button onClick={() => setCurrentView('dev')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
                    إلغاء وعودة
                </button>
            </div>

            {/* Stepper */}
            <div className="relative flex justify-between items-center px-4">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -z-10 rounded-full" />
                <div
                    className="absolute top-1/2 right-0 h-1 bg-brand-primary -z-10 rounded-full transition-all duration-500"
                    style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((s) => (
                    <div key={s.id} className="flex flex-col items-center gap-2 bg-brand-bg px-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all border-4 border-brand-bg ${step >= s.id ? 'bg-brand-primary text-white' : 'bg-white/10 text-slate-500'
                            }`}>
                            {step > s.id ? <Check className="w-5 h-5" /> : s.id}
                        </div>
                        <span className={`text-xs font-bold ${step >= s.id ? 'text-white' : 'text-slate-600'}`}>{s.title}</span>
                    </div>
                ))}
            </div>

            {/* Form Container */}
            <GlassCard className="min-h-[400px]">
                {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300">اسم الأداة (العربية)</label>
                                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-primary outline-none" placeholder="مثال: محرر الصور الذكي" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300">Tool Name (English)</label>
                                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-primary outline-none text-left" placeholder="e.g. Smart Image Editor" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300">وصف قصير</label>
                            <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-primary outline-none h-24 resize-none" placeholder="اشرح وظيفة الأداة باختصار..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300">الفئة</label>
                            <div className="flex gap-4">
                                {['نصوص', 'صور', 'مالية', 'مطورين'].map(cat => (
                                    <button key={cat} className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-brand-primary/20 hover:text-brand-primary hover:border-brand-primary/50 transition-all">
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 2 & 3 Placeholders for brevity */}
                {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4 hover:border-brand-primary/50 transition-colors cursor-pointer bg-white/[0.02]">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-brand-secondary">
                                <Code className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">رفع كود الأداة (React / Widget)</h3>
                                <p className="text-slate-500 text-sm mt-1">يدعم ملفات .tsx, .js, .json</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300">إعدادات API (اختياري)</label>
                            <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-xs ltr" placeholder="https://api.example.com/v1/endpoint" />
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col items-center justify-center text-center py-10 space-y-6">
                        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 animate-pulse">
                            <Check className="w-12 h-12" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white">أنت جاهز للإطلاق!</h3>
                            <p className="text-slate-400 max-w-md mx-auto">سيتم مراجعة أداتك من قبل فريق RI88 والموافقة عليها خلال 24 ساعة. ستصلك رسالة تأكيد عبر البريد الإلكتروني.</p>
                        </div>
                    </motion.div>
                )}
            </GlassCard>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
                <button
                    onClick={() => setStep(prev => Math.max(1, prev - 1))}
                    disabled={step === 1}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white font-bold"
                >
                    <ChevronRight className="w-4 h-4" />
                    السابق
                </button>

                {step < 3 ? (
                    <button
                        onClick={() => setStep(prev => Math.min(3, prev + 1))}
                        className="flex items-center gap-2 px-8 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary/80 transition-all text-white font-bold shadow-lg shadow-brand-primary/20"
                    >
                        التالي
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrentView('dev')}
                        className="flex items-center gap-2 px-8 py-3 rounded-xl bg-green-500 hover:bg-green-600 transition-all text-white font-bold shadow-lg shadow-green-500/20"
                    >
                        إرسال الطلب
                        <Check className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ToolSubmission;
