"use client";
import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import {
    Zap,
    Play,
    Plus,
    Database,
    Settings2,
    Cpu,
    Workflow,
    Sparkles,
    FileText,
    Share2
} from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';

interface Node {
    id: string;
    type: 'input' | 'process' | 'output';
    title: string;
    icon: any;
    x: number;
    y: number;
}

const ToolChainer = () => {
    // Initial Node State
    const [nodes, setNodes] = useState<Node[]>([
        { id: '1', type: 'input', title: 'مصدر البيانات (PDF)', icon: Database, x: 50, y: 100 },
        { id: '2', type: 'process', title: 'استخراج النصوص', icon: FileText, x: 400, y: 100 },
        { id: '3', type: 'process', title: 'تحليل المشاعر (AI)', icon: Sparkles, x: 750, y: 100 },
        { id: '4', type: 'output', title: 'تصدير JSON', icon: Share2, x: 1100, y: 100 },
    ]);

    // Handle Drag - Simplified for smooth demo (updating state onDragEnd or standard React state for lines)
    // For a truly performant app we'd use useMotionValue, but for this demo state is fine for lines.
    const updateNodePos = (id: string, x: number, y: number) => {
        setNodes(prev => prev.map(n => n.id === id ? { ...n, x, y } : n));
    };

    // Calculate Bezier Paths
    const getPath = (start: Node, end: Node) => {
        const startX = start.x + 240; // Card width approx
        const startY = start.y + 60;  // Card height/2 approx
        const endX = end.x;
        const endY = end.y + 60;

        return `M ${startX} ${startY} C ${startX + 80} ${startY} ${endX - 80} ${endY} ${endX} ${endY}`;
    };

    return (
        <div className="relative h-[80vh] w-full bg-[#0D0D0F] rounded-[32px] border border-white/5 overflow-hidden flex flex-col shadow-2xl">

            {/* GRID BACKGROUND */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(#22D3EE 1px, transparent 1px), linear-gradient(90deg, #22D3EE 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0F] via-transparent to-[#0D0D0F]/80 pointer-events-none" />

            {/* HEADER OVERLAY */}
            <div className="absolute top-0 left-0 right-0 p-8 z-20 flex items-center justify-between pointer-events-none">
                <div className="pointer-events-auto flex gap-3">
                    <button className="stitch-glass px-6 py-3 text-xs font-bold text-white hover:bg-white/5 flex items-center gap-2">
                        <Settings2 className="w-4 h-4" />
                        الإعدادات
                    </button>
                    <button className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold text-xs shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center gap-2 hover:scale-105 transition-transform">
                        <Play className="w-4 h-4 fill-white" />
                        تشغيل
                    </button>
                </div>
                <div className="text-right pointer-events-auto">
                    <h2 className="text-2xl font-black text-white flex items-center gap-2 justify-end">
                        أتمتة المهام
                        <Workflow className="w-6 h-6 text-brand-secondary" />
                    </h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Stitch Flow Engine</p>
                </div>
            </div>

            {/* CANVAS */}
            <div className="relative flex-1 overflow-hidden cursor-dot">

                {/* CONNECTIONS LAYER */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    <defs>
                        <linearGradient id="flowGradient" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#8B5CF6" />
                            <stop offset="100%" stopColor="#22D3EE" />
                        </linearGradient>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#22D3EE" />
                        </marker>
                    </defs>

                    {/* Draw lines between sequential nodes */}
                    {nodes.slice(0, -1).map((node, i) => {
                        const nextNode = nodes[i + 1];
                        return (
                            <g key={i}>
                                {/* Background Line */}
                                <motion.path
                                    d={getPath(node, nextNode)}
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                {/* Animated Line */}
                                <motion.path
                                    d={getPath(node, nextNode)}
                                    stroke="url(#flowGradient)"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeDasharray="10 5"
                                    markerEnd="url(#arrowhead)"
                                    className="animate-[flow_30s_linear_infinite]"
                                />
                            </g>
                        );
                    })}
                </svg>

                {/* NODES LAYER */}
                {nodes.map((node) => (
                    <motion.div
                        key={node.id}
                        drag
                        dragMomentum={false}
                        onDrag={(e, info) => {
                            // Simple bounding box constraints or just free drag
                            // In a real app we'd update state here or onDragEnd to redraw lines
                            updateNodePos(node.id, node.x + info.delta.x, node.y + info.delta.y);
                        }}
                        initial={{ x: node.x, y: node.y, opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute w-60 stitch-glass p-0 overflow-hidden cursor-grab active:cursor-grabbing group"
                    >
                        {/* Node Header */}
                        <div className={`h-1 w-full ${node.type === 'input' ? 'bg-orange-500' :
                                node.type === 'output' ? 'bg-green-500' : 'bg-brand-primary'
                            }`} />

                        <div className="p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${node.type === 'input' ? 'bg-orange-500/20 text-orange-400' :
                                        node.type === 'output' ? 'bg-green-500/20 text-green-400' : 'bg-brand-primary/20 text-brand-primary'
                                    }`}>
                                    <node.icon className="w-5 h-5" />
                                </div>
                                <button className="text-slate-500 hover:text-white transition-colors">
                                    <Settings2 className="w-4 h-4" />
                                </button>
                            </div>

                            <h4 className="text-white font-bold text-sm mb-1">{node.title}</h4>
                            <p className="text-[10px] text-slate-500 font-mono uppercase">{node.id}.{node.type.toUpperCase()}</p>
                        </div>

                        {/* Ports */}
                        {node.type !== 'input' && (
                            <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-slate-700 rounded-full border-2 border-[#0D0D0F] group-hover:bg-brand-secondary transition-colors" />
                        )}
                        {node.type !== 'output' && (
                            <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-slate-700 rounded-full border-2 border-[#0D0D0F] group-hover:bg-brand-primary transition-colors" />
                        )}
                    </motion.div>
                ))}

                {/* FAB */}
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-8 right-8 w-14 h-14 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-brand-primary/40 z-30"
                >
                    <Plus className="w-8 h-8" />
                </motion.button>
            </div>

            <style jsx>{`
                @keyframes flow {
                    to { stroke-dashoffset: -1000; }
                }
            `}</style>
        </div>
    );
};

export default ToolChainer;
