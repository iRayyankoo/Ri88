"use client";
import React from 'react';
import { Copy, Check, Info } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

interface ToolShellProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    footer?: React.ReactNode;
}

export function ToolShell({ title, description, children, className = '', footer }: ToolShellProps) {
    return (
        <div className={`w-full ${className}`} dir="rtl">
            {/* Header Section - Full Width */}
            <div className="mb-8 p-6 rounded-3xl stitch-glass bg-brand-primary/5 border-brand-primary/10">
                {title && <h2 className="text-3xl font-black text-white mb-2">{title}</h2>}
                {description && <p className="text-slate-400 font-medium leading-relaxed">{description}</p>}
            </div>

            {/* Main Workspace - 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Inputs / Controls Column */}
                <div className="col-span-1 lg:col-span-7 space-y-6">
                    <GlassCard className="min-h-[400px]">
                        {children}
                        {footer && (
                            <div className="mt-8 pt-6 border-t border-white/5">
                                {footer}
                            </div>
                        )}
                    </GlassCard>
                </div>

                {/* Output / Results Column */}
                <div className="col-span-1 lg:col-span-5 space-y-6">
                    {/* Placeholder for results if none are moved here automatically yet 
                         Ideally, tools should utilize a 'SidePanel' slot, but for now we rely on the flow 
                         or interactive portals. 
                         
                         For this 'Standardization', let's render a 'Quick Tips' or 'Output Area' placeholders 
                         if the tool doesn't explicitly portal content here. 
                     */}
                    <GlassCard title="النتيجة" className="min-h-[200px] border-brand-secondary/20">
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm py-12">
                            <Info className="w-8 h-8 mb-3 opacity-50" />
                            <p>ستظهر النتائج هنا بعد الإدخال</p>
                            {/* 
                                Note to Dev: 
                                Future refactor should portal the 'result' state from tools to this slot.
                                For now, tools render results inside the left card. 
                                To fix this, we need to refactor ToolShell to accept 'result' prop.
                            */}
                        </div>
                    </GlassCard>
                </div>

            </div>
        </div>
    );
}

// --- Helper Subcomponents ---

export function ToolInputRow({ label, children }: { label: string, children: React.ReactNode }) {
    return (
        <div className="mb-6">
            <label className="block w-full">
                <span className="block mb-2 text-sm font-bold text-slate-300">{label}</span>
                {children}
            </label>
        </div>
    );
}

export function ToolOutput({ content, label = "النتيجة" }: { content: string, label?: string }) {
    // This component can be used to override the default placeholder in the right column if we use portals
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!content) return null;

    return (
        <div className="bg-brand-bg/50 rounded-xl p-4 border border-white/10 mt-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[10px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded-lg transition-colors text-slate-300"
                >
                    {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                    {copied ? 'تم النسخ' : 'نسخ'}
                </button>
            </div>
            <div className="text-lg font-bold text-brand-secondary break-all" dir="ltr">
                {content}
            </div>
        </div>
    );
}
