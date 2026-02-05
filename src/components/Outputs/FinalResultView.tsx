"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, Mail, CheckCircle, Share2, ArrowRight, Star, Sparkles, Cloud } from 'lucide-react';
import { ResultExporter } from './ResultExporter';

interface FinalResultViewProps {
    resultData: any; // The main result (text, url, or object)
    type: 'text' | 'image' | 'file' | 'code';
    title?: string;
    onDownload?: () => void;
    relatedTools?: Array<{ name: string; icon: any; action: () => void }>;
}

export const FinalResultView: React.FC<FinalResultViewProps> = ({
    resultData,
    type,
    title = 'تمت العملية بنجاح!',
    onDownload,
    relatedTools = []
}) => {
    const [activeTab, setActiveTab] = useState<'preview' | 'raw'>('preview');

    return (
        <div className="w-full animate-in fade-in duration-500">

            {/* DESKTOP / TABLET LAYOUT -> Large Glass Card */}
            <div className="hidden md:flex flex-col relative overflow-hidden rounded-[40px] border border-white/10 bg-[#0D0D0F]/80 backdrop-blur-2xl shadow-2xl min-h-[500px]">
                {/* Background Ambient Glows */}
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-primary/20 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

                {/* HEADER */}
                <div className="flex items-center justify-between p-8 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                {title}
                                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                            </h2>
                            <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                                <Cloud className="w-3 h-3 text-cyan-400" />
                                تم حفظ الجلسة في سجلاتك
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-mono font-bold uppercase tracking-wider animate-pulse">
                            PROCESSED
                        </span>
                    </div>
                </div>

                {/* MAIN CONTENT ROW */}
                <div className="flex-1 flex" dir="rtl">
                    {/* RIGHT: Actions Panel */}
                    <div className="w-72 border-l border-white/5 p-6 flex flex-col gap-4 bg-white/[0.02]">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">إجراءات سريعة</h3>

                        <button onClick={onDownload} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-brand-primary hover:text-white transition-all border border-white/5 hover:border-brand-primary/50 group text-right">
                            <Download className="w-5 h-5 text-slate-400 group-hover:text-white" />
                            <div>
                                <div className="font-bold text-sm">تحميل الملف</div>
                                <div className="text-[10px] text-slate-500 group-hover:text-white/80">حفظ في جهازك</div>
                            </div>
                        </button>

                        <button className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group text-right">
                            <Copy className="w-5 h-5 text-slate-400 group-hover:text-white" />
                            <div>
                                <div className="font-bold text-white text-sm">نسخ الرابط</div>
                                <div className="text-[10px] text-slate-500">للمشاركة السريعة</div>
                            </div>
                        </button>

                        <button className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group text-right">
                            <Mail className="w-5 h-5 text-slate-400 group-hover:text-white" />
                            <div>
                                <div className="font-bold text-white text-sm">إرسال للإيميل</div>
                                <div className="text-[10px] text-slate-500">نسخة احتياطية</div>
                            </div>
                        </button>

                        <div className="mt-auto pt-6 border-t border-white/5">
                            <div className="text-xs font-bold text-slate-500 mb-3">شارك النتيجة</div>
                            <div className="flex gap-2">
                                <button className="p-2.5 rounded-lg bg-[#1da1f2]/10 hover:bg-[#1da1f2] text-[#1da1f2] hover:text-white transition-all"><Share2 size={16} /></button>
                                <button className="p-2.5 rounded-lg bg-[#25d366]/10 hover:bg-[#25d366] text-[#25d366] hover:text-white transition-all"><Share2 size={16} /></button>
                            </div>
                        </div>
                    </div>

                    {/* CENTER: Result Display */}
                    <div className="flex-1 p-8 flex flex-col gap-6">
                        {/* Result Container */}
                        <div className="flex-1 relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-cyan-500 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500" />
                            <div className="relative h-full bg-[#13131A] rounded-xl border border-white/10 p-6 overflow-auto custom-scrollbar shadow-inner">
                                {type === 'image' && typeof resultData === 'string' ? (
                                    <div className="flex items-center justify-center h-full">
                                        <img src={resultData} alt="Result" className="max-h-[300px] object-contain rounded-lg shadow-2xl" />
                                    </div>
                                ) : (
                                    <pre className="font-mono text-sm text-slate-300 whitespace-pre-wrap">{typeof resultData === 'object' ? JSON.stringify(resultData, null, 2) : resultData}</pre>
                                )}
                            </div>
                        </div>

                        {/* Integrated Result Exporter (Horizontal) */}
                        <ResultExporter data={resultData} type="table" />
                    </div>
                </div>

                {/* BOTTOM: Next Steps */}
                <div className="bg-[#050507]/50 p-6 flex items-center justify-between border-t border-white/5">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-500 uppercase">خطوات مقترحة</span>
                        <span className="text-sm text-white">هل تريد متابعة العمل على هذا الملف؟</span>
                    </div>
                    <div className="flex gap-3">
                        {relatedTools.length > 0 ? relatedTools.map((tool, idx) => (
                            <button key={idx} onClick={tool.action} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white border border-white/5 transition-all">
                                {tool.name}
                                <ArrowRight size={14} />
                            </button>
                        )) : (
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white border border-white/5 transition-all">
                                العودة للأدوات
                                <ArrowRight size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </div>


            {/* MOBILE LAYOUT -> Vertical Focus */}
            <div className="md:hidden flex flex-col gap-6" dir="rtl">
                {/* Header */}
                <div className="text-center space-y-2 py-6">
                    <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="w-20 h-20 mx-auto bg-gradient-to-tr from-brand-primary to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.5)] mb-4"
                    >
                        <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-black text-white glow-text">كل شيء جاهز!</h2>
                    <p className="text-slate-400">تمت معالجة بياناتك بنجاح</p>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                        <CheckCircle size={12} />
                        تم حفظ الجلسة
                    </div>
                </div>

                {/* Result Card */}
                <div className="bg-[#16161a] border border-white/10 rounded-2xl p-4 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-brand-primary to-transparent" />
                    {type === 'image' && typeof resultData === 'string' ? (
                        <img src={resultData} alt="Result" className="w-full rounded-lg shadow-lg mb-4" />
                    ) : (
                        <div className="max-h-60 overflow-y-auto bg-black/30 p-4 rounded-xl border border-white/5 text-sm text-slate-300 font-mono mb-4">
                            {typeof resultData === 'object' ? JSON.stringify(resultData, null, 2) : resultData}
                        </div>
                    )}

                    {/* Big Mobile Action Button */}
                    <button onClick={onDownload} className="w-full py-4 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 text-lg active:scale-95 transition-transform">
                        <Download size={24} />
                        تحميل النتيجة
                    </button>
                </div>

                {/* Quick Share Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <button className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-300 hover:bg-white/10 hover:text-white transition-colors">
                        <Share2 size={20} />
                        <span className="text-xs font-bold">مشاركة</span>
                    </button>
                    <button className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-300 hover:bg-white/10 hover:text-white transition-colors">
                        <Copy size={20} />
                        <span className="text-xs font-bold">نسخ الرابط</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
