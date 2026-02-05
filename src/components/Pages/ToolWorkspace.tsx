"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, Settings2, Sparkles, Share2, Copy, History,
    RotateCcw, Trash2, ArrowLeft, Zap, CheckCircle2
} from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import { tools } from '@/data/tools';
import ToolRouter from '../tools/ToolRouter';

const ToolWorkspace = () => {
    const { activeToolId, setCurrentView } = useNavigation();

    const tool = tools.find(t => t.id === activeToolId) || tools[0];

    return (
        <div className="min-h-screen pb-20">
            {/* 1. HEADER (Navigation Only) */}
            <header className="flex items-center justify-between py-6 mb-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setCurrentView('directory')}
                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors border border-white/5"
                    >
                        <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-white">{tool.titleAr || tool.title}</h1>
                        <p className="text-xs text-slate-500 font-medium font-mono uppercase">{tool.cat} / {tool.id}</p>
                    </div>
                </div>

                {/* User Avatar */}
                <div className="hidden md:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                    <span className="text-xs font-bold text-slate-300">Rayan Dev</span>
                    <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold">R</div>
                </div>
            </header>

            {/* 2. TOOL ROUTER (The Real Logic) */}
            <div className="max-w-7xl mx-auto">
                <ToolRouter tool={tool} />
            </div>
        </div>
    );
};

export default ToolWorkspace;
