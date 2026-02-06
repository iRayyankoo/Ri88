"use client";
import React from 'react';
import { Sparkles } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

interface ToolShellProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    footer?: React.ReactNode;
    results?: React.ReactNode; // Correctly typed in interface
}

export function ToolShell({ title, description, children, className = '', footer, results }: ToolShellProps) {
    return (
        <div className={`w-full ${className}`} dir="rtl">
            {/* Header Section */}
            {(title || description) && (
                <div className="mb-8 p-8 rounded-[32px] bg-gradient-to-br from-white/5 to-transparent border border-white/5 relative overflow-hidden">
                    <div className="relative z-10">
                        {title && (
                            <h2 className="text-3xl font-black text-white mb-3 tracking-tight flex items-center gap-3">
                                <span className="p-2 rounded-xl bg-brand-primary/20 text-brand-primary">
                                    <Sparkles className="w-6 h-6" />
                                </span>
                                {title}
                            </h2>
                        )}
                        {description && <p className="text-slate-400 font-medium leading-relaxed max-w-3xl text-lg">{description}</p>}
                    </div>
                    {/* Ambient Glow */}
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-primary/10 blur-[80px] rounded-full pointer-events-none" />
                </div>
            )}

            {/* Main Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Inputs */}
                <div className="col-span-1 lg:col-span-7 space-y-6">
                    <GlassCard className="p-8 min-h-[400px]">
                        <div className="space-y-8">
                            {children}
                        </div>
                        {footer && (
                            <div className="mt-8 pt-8 border-t border-white/5">
                                {footer}
                            </div>
                        )}
                    </GlassCard>
                </div>

                {/* Right Column: Results */}
                <div className="col-span-1 lg:col-span-5 space-y-6">
                    <div className="sticky top-6">
                        <GlassCard title="النتيجة" className="min-h-[300px] border-brand-secondary/20 relative overflow-hidden bg-[#13131A]/80">
                            {results ? (
                                <div className="animate-fade-in relative z-10">
                                    {results}
                                </div>
                            ) : (
                                <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-slate-500 text-sm py-12 relative z-10">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/5">
                                        <Sparkles className="w-6 h-6 opacity-30" />
                                    </div>
                                    <p className="font-medium text-slate-600">النتيجة ستظهر هنا...</p>
                                </div>
                            )}
                            {/* Ambient Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-secondary/5 blur-[60px] rounded-full pointer-events-none" />
                        </GlassCard>
                    </div>
                </div>

            </div>
        </div>
    );
}

// --- Helper Subcomponents ---

export function ToolInputRow({ label, children, id }: { label: string, children: React.ReactNode, id?: string }) {
    return (
        <div className="group">
            <label htmlFor={id} className="block w-full">
                <span className="block mb-3 text-sm font-bold text-slate-300 group-focus-within:text-brand-primary transition-colors">
                    {label}
                </span>
                {children}
            </label>
        </div>
    );
}

export function ToolOutput({ content }: { content: React.ReactNode }) {
    return (
        <div className="bg-black/40 p-6 rounded-xl border border-white/5 text-slate-300 font-medium leading-relaxed whitespace-pre-wrap font-mono text-sm">
            {content}
        </div>
    );
}
