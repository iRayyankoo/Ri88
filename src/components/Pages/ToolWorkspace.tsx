"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    Copy,
    Download,
    RotateCcw,
    ArrowRight,
    ShieldCheck,
    Cpu,
    Settings2,
    Share2
} from 'lucide-react';

interface ToolWorkspaceProps {
    toolName: string;
    category: string;
    onRun?: (input: string) => void;
    isLoading?: boolean;
}

const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({
    toolName = "أداة المعالجة الذكية",
    category = "معالجة النصوص",
    onRun,
    isLoading = false
}) => {
    const [inputData, setInputData] = useState('');
    const [outputData, setOutputData] = useState('');

    const handleRun = () => {
        if (onRun) {
            onRun(inputData);
        } else {
            // Mock run
            setOutputData(`تمت معالجة النص بنجاح:\n\n${inputData.split('').reverse().join('')}`);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(outputData);
        // Add toast logic here if available
    };

    return (
        <div className="space-y-10">

            {/* TOOL TOP BAR */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div className="flex items-center gap-4 flex-row-reverse">
                    <div className="w-14 h-14 bg-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary">
                        <Zap className="w-8 h-8" />
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-black text-white leading-tight">{toolName}</h2>
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2 justify-end">
                            {category}
                            <div className="w-1 h-1 rounded-full bg-brand-primary" />
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-bold transition-all">
                        <Share2 className="w-4 h-4" />
                        مشاركة
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-bold transition-all">
                        <Settings2 className="w-4 h-4" />
                        إعدادات
                    </button>
                </div>
            </div>

            {/* CORE WORKSPACE GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 min-h-[500px]">

                {/* LEFT: INPUT CARD */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-10 flex flex-col gap-6"
                >
                    <div className="flex items-center justify-between flex-row-reverse">
                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-secondary">صندوق الإدخال</label>
                        <div className="flex items-center gap-2 text-slate-600">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-[10px] font-bold">تشفير SSL نشط</span>
                        </div>
                    </div>

                    <textarea
                        className="flex-1 bg-black/20 border border-white/5 rounded-[20px] p-6 text-white text-lg font-medium outline-none focus:ring-4 focus:ring-brand-primary/10 placeholder:text-slate-700 transition-all resize-none text-right no-scrollbar"
                        placeholder="أدخل البيانات هنا للمعالجة..."
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                    />

                    <div className="flex items-center justify-between flex-row-reverse mt-2">
                        <button
                            onClick={handleRun}
                            disabled={!inputData || isLoading}
                            className="bg-brand-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-primary/90 text-white font-black px-12 py-4 rounded-2xl transition-all shadow-2xl shadow-brand-primary/40 active:scale-95 flex items-center gap-3 text-sm"
                        >
                            {isLoading ? (
                                <RotateCcw className="w-5 h-5 animate-spin" />
                            ) : (
                                <Cpu className="w-5 h-5" />
                            )}
                            بدء المعالجة
                        </button>

                        <button
                            onClick={() => setInputData('')}
                            className="text-slate-500 hover:text-white transition-colors text-xs font-bold flex items-center gap-2"
                        >
                            مسح الكل
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>

                {/* RIGHT: OUTPUT CARD */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-10 flex flex-col gap-6"
                >
                    <div className="flex items-center justify-between flex-row-reverse">
                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary">نتائج المعالجة</label>
                        <div className="flex flex-row-reverse items-center gap-3">
                            <button
                                onClick={handleCopy}
                                disabled={!outputData}
                                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-brand-primary transition-all disabled:opacity-30"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                            <button
                                disabled={!outputData}
                                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-brand-secondary transition-all disabled:opacity-30"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-[20px] p-6 text-slate-100 text-lg font-medium overflow-y-auto no-scrollbar text-right leading-relaxed italic">
                        {outputData || <span className="text-slate-700">بانتظار الإدخال للمعالجة...</span>}
                    </div>

                    {/* Stats Footer */}
                    <div className="mt-2 flex items-center justify-end gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">
                        <div className="flex items-center gap-2">
                            <span>0.24s</span>
                            <div className="w-1 h-1 rounded-full bg-slate-800" />
                            <span>زمن المعالجة</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>UTF-8</span>
                            <div className="w-1 h-1 rounded-full bg-slate-800" />
                            <span>التنسيق</span>
                        </div>
                    </div>
                </motion.div>
            </div>

        </div>
    );
};

export default ToolWorkspace;
