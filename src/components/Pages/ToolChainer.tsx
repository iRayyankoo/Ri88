"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Play, Plus, Database, Settings2, Cpu, Sparkles,
    FileText, Share2, Layers, Trash2, Save,
    RotateCcw, Activity, Wind
} from 'lucide-react';


interface Node {
    id: string;
    type: 'input' | 'process' | 'output';
    title: string;
    icon: React.ElementType;
    x: number;
    y: number;
    status?: 'idle' | 'running' | 'success' | 'error';
}

const ToolChainerValue = () => {
    const [nodes, setNodes] = useState<Node[]>([
        { id: '1', type: 'input', title: 'مصدر البيانات (PDF)', icon: Database, x: 100, y: 150, status: 'success' },
        { id: '2', type: 'process', title: 'استخراج النصوص', icon: FileText, x: 450, y: 150, status: 'running' },
        { id: '3', type: 'process', title: 'تحليل المشاعر (AI)', icon: Sparkles, x: 800, y: 150, status: 'idle' },
        { id: '4', type: 'output', title: 'تصدير JSON', icon: Share2, x: 1150, y: 150, status: 'idle' },
    ]);

    const updateNodePos = (id: string, x: number, y: number) => {
        setNodes((prev: Node[]) => prev.map((n: Node) => n.id === id ? { ...n, x, y } : n));
    };

    const getPath = (start: Node, end: Node) => {
        const startX = start.x + 220;
        const startY = start.y + 50;
        const endX = end.x;
        const endY = end.y + 50;

        const cp1x = startX + (endX - startX) / 2;
        const cp2x = startX + (endX - startX) / 2;

        return `M ${startX} ${startY} C ${cp1x} ${startY} ${cp2x} ${endY} ${endX} ${endY}`;
    };

    return (
        <div className="relative h-[85vh] w-full bg-[#08090B] rounded-[40px] border border-white/5 overflow-hidden flex flex-col shadow-[0_50px_150px_rgba(0,0,0,0.6)]">

            {/* 1. FUTURISTIC BACKGROUND */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Dots Grid */}
                <div className="absolute inset-0 opacity-[0.15] grid-dots" />
                {/* Radial Glows */}
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-primary/5 blur-[150px] rounded-full -translate-y-1/2" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full translate-y-1/2" />
            </div>

            {/* 2. TOP TOOLBAR (FLOATING GLASS) */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 p-2 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
                <button title="تشغيل" className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary rounded-[18px] text-black font-black text-xs hover:scale-105 transition-transform active:scale-95">
                    <Play className="w-4 h-4 fill-black" />
                    تشغيل المحرك
                </button>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <button title="حفظ" className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-[14px] transition-all">
                    <Save className="w-4 h-4" />
                </button>
                <button title="إعادة" className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-[14px] transition-all">
                    <RotateCcw className="w-4 h-4" />
                </button>
                <button title="حذف" className="p-2.5 text-rose-500 hover:bg-rose-500/10 rounded-[14px] transition-all">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* 3. SIDE LIBRARY (BENTO STYLE) */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-14 hover:w-64 group bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl transition-all duration-500 overflow-hidden shadow-2xl py-6 flex flex-col items-center">
                <div className="mb-8 p-1 group-hover:px-6 w-full flex justify-center group-hover:justify-start">
                    <div className="w-8 h-8 rounded-xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center shrink-0">
                        <Plus className="w-5 h-5 text-brand-primary" />
                    </div>
                    <span className="text-white font-black text-sm mr-4 hidden group-hover:block font-cairo whitespace-nowrap">إضافة خطوة</span>
                </div>

                <div className="space-y-6 w-full px-1 group-hover:px-4">
                    {[
                        { icon: Database, name: 'IO / Input', color: 'text-orange-400' },
                        { icon: Cpu, name: 'Processing', color: 'text-brand-primary' },
                        { icon: Sparkles, name: 'AI Engines', color: 'text-emerald-400' },
                        { icon: Layers, name: 'Flow Logic', color: 'text-purple-400' }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors group/item">
                            <div className={`w-8 h-8 flex items-center justify-center shrink-0 ${item.color}`}>
                                <item.icon className="w-5 h-5 opacity-60 group-hover/item:opacity-100 group-hover/item:scale-110 transition-all" />
                            </div>
                            <span className="text-slate-400 font-bold text-xs hidden group-hover:block whitespace-nowrap">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. CANVAS AREA */}
            <div className="relative flex-1 cursor-dot">

                {/* 4.1 CONNECTIONS LAYER */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    <defs>
                        <linearGradient id="flowGrad" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#8B5CF6" />
                            <stop offset="100%" stopColor="#22D3EE" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {nodes.slice(0, -1).map((node: Node, i: number) => {
                        const nextNode = nodes[i + 1];
                        return (
                            <g key={i}>
                                {/* Shadow Path */}
                                <path
                                    d={getPath(node, nextNode)}
                                    stroke="rgba(139, 92, 246, 0.05)"
                                    strokeWidth="8"
                                    fill="none"
                                />
                                {/* Static Base Path */}
                                <path
                                    d={getPath(node, nextNode)}
                                    stroke="rgba(255, 255, 255, 0.03)"
                                    strokeWidth="2"
                                    fill="none"
                                />
                                {/* animated Path */}
                                <motion.path
                                    d={getPath(node, nextNode)}
                                    stroke="url(#flowGrad)"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeDasharray="12 40"
                                    initial={{ strokeDashoffset: 0 }}
                                    animate={{ strokeDashoffset: -52 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    filter="url(#glow)"
                                />
                            </g>
                        );
                    })}
                </svg>

                {/* 4.2 NODES LAYER */}
                {nodes.map((node: Node) => (
                    <motion.div
                        key={node.id}
                        drag
                        dragMomentum={false}
                        onDrag={(e, info) => updateNodePos(node.id, node.x + info.delta.x, node.y + info.delta.y)}
                        initial={{ x: node.x, y: node.y, opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute w-56 group cursor-grab active:cursor-grabbing"
                    >
                        {/* THE PREMIUM NODE BODY */}
                        <div className="relative p-[1px] rounded-3xl bg-gradient-to-br from-white/10 to-transparent overflow-hidden shadow-2xl">
                            {/* Inner Glass */}
                            <div className="relative bg-[#0F1115] rounded-[23px] overflow-hidden p-4">
                                {/* Type Indication Bar */}
                                <div className={`absolute top-0 left-0 w-full h-[3px] opacity-40 ${node.type === 'input' ? 'bg-orange-400 shadow-[0_4px_10px_rgba(251,146,60,0.5)]' :
                                    node.type === 'output' ? 'bg-emerald-400 shadow-[0_4px_10px_rgba(52,211,153,0.5)]' :
                                        'bg-brand-primary shadow-[0_4px_10px_rgba(139,92,246,0.5)]'
                                    }`} />

                                {/* Header Area */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border border-white/5 ${node.type === 'input' ? 'bg-orange-400/10 text-orange-400' :
                                        node.type === 'output' ? 'bg-emerald-400/10 text-emerald-400' :
                                            'bg-brand-primary/10 text-brand-primary'
                                        }`}>
                                        <node.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {node.status === 'running' && (
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 1 }}
                                                className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(139,92,246,1)]"
                                            />
                                        )}
                                        {node.status === 'success' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                                        <Settings2 className="w-3.5 h-3.5 text-slate-600 hover:text-white transition-colors cursor-pointer" />
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="space-y-1">
                                    <h4 className="text-white font-black text-xs font-cairo truncate">{node.title}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{node.id}.{node.type}</span>
                                        <div className="flex-1 h-px bg-white/5" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Connection Ports - Input port (Left) - Visible if not an input-source node */}
                        {node.type !== 'input' && (
                            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-3 h-3 flex items-center justify-center z-20">
                                <div className="w-2 h-2 bg-[#0F1115] border-2 border-slate-500 rounded-full group-hover:border-brand-primary group-hover:bg-brand-primary/20 transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
                            </div>
                        )}
                        {/* Connection Ports - Output port (Right) - Visible if not an output-sink node */}
                        {node.type !== 'output' && (
                            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-3 h-3 flex items-center justify-center z-20">
                                <div className="w-2 h-2 bg-[#0F1115] border-2 border-slate-500 rounded-full group-hover:border-brand-primary group-hover:bg-brand-primary/20 transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* 5. ENGINE STATS (BOTTOM RIGHT) */}
            <div className="absolute bottom-6 right-8 flex items-center gap-6 z-20">
                <div className="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <div className="text-right">
                        <p className="text-[9px] text-slate-500 font-black uppercase leading-none">Latency</p>
                        <p className="text-xs font-black text-white font-inter">12ms</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl">
                    <Wind className="w-4 h-4 text-cyan-400" />
                    <div className="text-right">
                        <p className="text-[9px] text-slate-500 font-black uppercase leading-none">CPU Flow</p>
                        <p className="text-xs font-black text-white font-inter">4.2%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToolChainerValue;
