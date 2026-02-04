"use client";
import React from 'react';
import { Tool } from '@/data/tools';

interface ToolCardNewProps {
    tool: Tool;
    onClick: () => void;
    variant?: 'horizontal' | 'vertical';
}

const ToolCardNew: React.FC<ToolCardNewProps> = ({ tool, onClick, variant = 'vertical' }) => {
    if (variant === 'horizontal') {
        return (
            <div
                onClick={onClick}
                className="min-w-[160px] bg-brand-card p-5 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-3 active:bg-brand-primary/10 transition-all cursor-pointer group"
            >
                <div className="w-14 h-14 bg-brand-primary/20 rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/10 group-hover:shadow-brand-primary/30 transition-all">
                    <span className="material-icons-round text-brand-primary text-3xl">{tool.icon || 'psychology'}</span>
                </div>
                <div className="space-y-0.5">
                    <p className="font-bold text-sm text-white">{tool.titleAr || tool.title}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{tool.cat}</p>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            className="flex items-center gap-4 bg-brand-card p-4 rounded-xl border border-white/5 hover:border-brand-primary/30 transition-all cursor-pointer group"
        >
            <div className="h-10 w-10 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span className="material-icons-round text-brand-primary text-xl">{tool.icon || 'bolt'}</span>
            </div>
            <div className="flex-1 overflow-hidden">
                <h4 className="text-sm font-bold text-white truncate">{tool.titleAr || tool.title}</h4>
                <p className="text-[11px] text-slate-500 truncate">{tool.descAr || tool.desc}</p>
            </div>
            <span className="material-icons-round text-brand-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity">chevron_left</span>
        </div>
    );
};

export default ToolCardNew;
