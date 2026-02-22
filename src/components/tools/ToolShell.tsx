"use client";
import React from 'react';
import { ToolAnimationWrapper } from "@/components/ui/ToolAnimationWrapper";
import { Save, Sparkles } from 'lucide-react';
import { useSession } from "next-auth/react";
import { motion } from 'framer-motion';
import { ToolButton } from './ToolUi';

interface ToolShellProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    footer?: React.ReactNode;
    results?: React.ReactNode;
    onSave?: () => void;
    isSaving?: boolean;
}

export function ToolShell({
    title,
    description,
    children,
    className = '',
    footer,
    results,
    onSave,
    isSaving,
    layout = 'split'
}: ToolShellProps & { layout?: 'split' | 'single' }) {
    const { data: session } = useSession();
    const isSingle = layout === 'single';

    return (
        <ToolAnimationWrapper>
            <div className={`w-full ${className}`} dir="rtl">
                {/* 1. LIQUID GLASS TOOL HEADER - HIDDEN */}

                {/* 2. DUAL-PANEL WORKSPACE */}
                <div className={isSingle ? "flex flex-col gap-10" : "grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"}>

                    {/* INPUT CANVAS */}
                    <div className={isSingle ? "w-full" : "col-span-1 lg:col-span-7"}>
                        <div className="p-10 rounded-[44px] bg-white/[0.01] border border-white/[0.03] shadow-[inset_0_0_40px_rgba(255,255,255,0.01)] min-h-[500px] backdrop-blur-3xl relative overflow-hidden text-right">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none" />

                            <div className="relative z-10 space-y-10">
                                {children}
                            </div>

                            {footer && (
                                <div className="mt-12 pt-10 border-t border-white/[0.05] relative z-10">
                                    {footer}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RESULT CANVAS */}
                    {/* In single mode: only show if results exist. In split mode: always show (placeholder). */}
                    {(!isSingle || results) && (
                        <div className={isSingle ? "w-full" : "col-span-1 lg:col-span-5"}>
                            <div className={isSingle ? "" : "sticky top-10"}>
                                <div className="rounded-[44px] bg-[#050507]/60 backdrop-blur-3xl border border-brand-primary/20 shadow-[0_40px_100px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(139,92,246,0.1)] min-h-[400px] flex flex-col relative overflow-hidden group/result-canvas isolate text-right">
                                    {/* Cinematic Texture */}
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                                    <div className="p-1.5 flex flex-col h-full">
                                        <div className="flex items-center justify-between px-8 py-5 border-b border-white/[0.03] flex-row-reverse">
                                            <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] font-cairo">النتيجة النهائية</span>
                                            {results && session && onSave && (
                                                <ToolButton
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={onSave}
                                                    disabled={isSaving}
                                                    className="!bg-brand-primary/5 !border-brand-primary/10 hover:!bg-brand-primary/10 group/save"
                                                >
                                                    {isSaving ? <Sparkles className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3 group-hover/save:scale-110 transition-transform" />}
                                                    حفظ مجهودك
                                                </ToolButton>
                                            )}
                                        </div>

                                        <div className="flex-1 p-8 relative z-10 h-full flex flex-col justify-center">
                                            {results ? (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="h-full"
                                                >
                                                    {results}
                                                </motion.div>
                                            ) : (
                                                <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12">
                                                    <div className="w-24 h-24 rounded-full bg-white/[0.02] flex items-center justify-center mb-8 border border-white/[0.05] relative shadow-inner">
                                                        <Sparkles className="w-10 h-10 opacity-10 animate-pulse" />
                                                        <div className="absolute inset-0 rounded-full border border-brand-primary/10 animate-ping [animation-duration:3s]" />
                                                    </div>
                                                    <h4 className="text-lg font-black text-slate-400 mb-2 font-cairo">بانتظار مدخلاتك</h4>
                                                    <p className="text-sm font-medium text-slate-600 max-w-[200px] text-center leading-relaxed font-cairo">قم بتعبئة البيانات لتوليد أرقام ومعالجات ذكية فورا</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Ambient Base Glow */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent blur-[1px]" />
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </ToolAnimationWrapper>
    );
}

// --- Helper Subcomponents ---

export function ToolInputRow({ label, children, id, className = "" }: { label: string, children: React.ReactNode, id?: string, className?: string }) {
    return (
        <div className={`group ${className} text-right`}>
            <label htmlFor={id} className="block w-full">
                <span className="block mb-4 text-sm font-black text-slate-400 group-focus-within:text-brand-primary transition-colors font-cairo uppercase tracking-widest">
                    {label}
                </span>
                {children}
            </label>
        </div>
    );
}

export function ToolOutput({ content }: { content: React.ReactNode }) {
    return (
        <div className="bg-[#050507]/60 p-8 rounded-[32px] border border-white/[0.05] text-slate-300 font-bold leading-relaxed whitespace-pre-wrap font-cairo text-lg backdrop-blur-2xl shadow-inner">
            {content}
        </div>
    );
}
