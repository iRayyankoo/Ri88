"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    ArrowRight,
    Play,
    Plus,
    Database,
    Settings2,
    Cpu,
    Workflow,
    Sparkles
} from 'lucide-react';

interface Node {
    id: string;
    type: string;
    title: string;
    x: number;
    y: number;
}

const ToolChainer = () => {
    const [nodes, setNodes] = useState<Node[]>([
        { id: '1', type: 'input', title: 'مصدر البيانات (PDF)', x: 100, y: 150 },
        { id: '2', type: 'process', title: 'استخراج النصوص', x: 450, y: 150 },
        { id: '3', type: 'output', title: 'تحليل المشاعر', x: 800, y: 150 },
    ]);

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
    };

    return (
        <div className="relative h-[75vh] w-full bg-black/40 rounded-[48px] border border-white/5 overflow-hidden flex flex-col p-10">

            {/* BACKGROUND GRID */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #8B5CF6 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            {/* HEADER */}
            <div className="relative z-10 flex items-center justify-between mb-20">
                <div className="text-right">
                    <h2 className="text-3xl font-black text-white flex items-center gap-3 justify-end">
                        أتمتة تسلسل الأدوات
                        <Workflow className="w-8 h-8 text-brand-secondary" />
                    </h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">النموذج التجريبي لربط الأدوات (V1.0 Beta)</p>
                </div>

                <div className="flex gap-4">
                    <button className="bg-white/5 hover:bg-white/10 text-slate-400 font-black px-6 py-3 rounded-2xl border border-white/5 text-xs transition-all flex items-center gap-2">
                        <Settings2 className="w-4 h-4" />
                        الإعدادات
                    </button>
                    <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-10 py-3 rounded-2xl transition-all shadow-xl shadow-emerald-500/30 flex items-center gap-3 text-sm">
                        <Play className="w-5 h-5 fill-white" />
                        تشغيل المسار
                    </button>
                </div>
            </div>

            {/* CANVAS AREA */}
            <div className="relative flex-1">
                {/* CONNECTING LINES (Static for prototype) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    <defs>
                        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.5" />
                        </linearGradient>
                    </defs>
                    {/* Line 1 to 2 */}
                    <motion.path
                        d="M 310 190 L 450 190"
                        stroke="url(#lineGrad)"
                        strokeWidth="3"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        strokeDasharray="10 5"
                        className="animate-[dash_20s_linear_infinite]"
                    />
                    {/* Line 2 to 3 */}
                    <motion.path
                        d="M 660 190 L 800 190"
                        stroke="url(#lineGrad)"
                        strokeWidth="3"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        strokeDasharray="10 5"
                        className="animate-[dash_20s_linear_infinite]"
                    />
                </svg>

                {/* NODES */}
                {nodes.map((node) => (
                    <motion.div
                        key={node.id}
                        drag
                        dragMomentum={false}
                        style={{ x: node.x, y: node.y }}
                        className="absolute w-52 glass-card p-6 border-brand-primary/20 cursor-grab active:cursor-grabbing hover:border-brand-primary/50 transition-colors shadow-2xl"
                    >
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${node.type === 'input' ? 'bg-orange-500/20 text-orange-500' :
                                    node.type === 'process' ? 'bg-brand-primary/20 text-brand-primary' :
                                        'bg-brand-secondary/20 text-brand-secondary'
                                }`}>
                                {node.type === 'input' ? <Database className="w-6 h-6" /> :
                                    node.type === 'process' ? <Cpu className="w-6 h-6" /> :
                                        <Sparkles className="w-6 h-6" />}
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white leading-tight">{node.title}</h4>
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{node.type}</span>
                            </div>

                            {/* Connection Ports */}
                            <div className="absolute top-1/2 -right-2 w-4 h-4 bg-brand-primary rounded-full border-4 border-brand-bg shadow-lg" />
                            <div className="absolute top-1/2 -left-2 w-4 h-4 bg-brand-secondary rounded-full border-4 border-brand-bg shadow-lg" />
                        </div>
                    </motion.div>
                ))}

                {/* ADD BUTTON */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="absolute bottom-10 right-10 w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all shadow-xl"
                >
                    <Plus className="w-8 h-8" />
                </motion.button>
            </div>

            <style jsx>{`
         @keyframes dash {
           to {
             stroke-dashoffset: -1000;
           }
         }
      `}</style>

        </div>
    );
};

export default ToolChainer;
