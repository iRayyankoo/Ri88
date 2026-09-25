"use client";
import React, { useRef, useState } from 'react';
import { ToolAnimationWrapper } from "@/components/ui/ToolAnimationWrapper";
import { Save, Sparkles, Copy, Check, Terminal } from 'lucide-react';
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from 'framer-motion';
import { ToolButton } from './ToolUi';
import { toast } from 'sonner';

interface ToolShellProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    footer?: React.ReactNode;
    results?: React.ReactNode;
    onSave?: () => void;
    isSaving?: boolean;
    layout?: 'split' | 'single';
}

export function ToolShell({
    children,
    className = '',
    footer,
    results,
    onSave,
    isSaving,
    layout
}: ToolShellProps) {
    const { data: session } = useSession();
    const resultRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState(false);

    // Intelligent layout detection:
    // If results is explicitly provided (even if currently falsy), or layout === 'split', use split mode.
    // If results is undefined and layout is not explicitly 'split', use single mode to avoid empty ghost canvas.
    const isSingle = layout === 'single' || (results === undefined && layout !== 'split');

    const handleCopyResult = async () => {
        if (!resultRef.current) return;
        try {
            const text = resultRef.current.innerText?.trim();
            if (!text) {
                toast.error('لا توجد نتيجة لنسخها حالياً');
                return;
            }
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success('تم نسخ النتيجة إلى الحافظة 📋');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('تعذر النسخ إلى الحافظة');
        }
    };

    return (
        <ToolAnimationWrapper>
            <div className={`w-full ${className}`} dir="rtl">
                <div className={isSingle ? "flex flex-col gap-6 max-w-4xl mx-auto" : "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"}>

                    {/* INPUT CANVAS */}
                    <div className={isSingle ? "w-full" : "col-span-1 lg:col-span-7"}>
                        <div className="p-5 sm:p-7 rounded-2xl bg-surface-raised border border-border-subtle shadow-sm backdrop-blur-2xl relative overflow-hidden text-right transition-all">
                            {/* Subtle Ambient Light */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/5 blur-3xl rounded-full -mr-24 -mt-24 pointer-events-none" />

                            <div className="relative z-10 space-y-6">
                                {children}
                            </div>

                            {footer && (
                                <div className="mt-8 pt-6 border-t border-border-subtle relative z-10">
                                    {footer}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RESULT CANVAS (Only shown if split layout OR results exist) */}
                    {(!isSingle || results) && (
                        <div className={isSingle ? "w-full" : "col-span-1 lg:col-span-5"}>
                            <div className={isSingle ? "" : "sticky top-4"}>
                                <div className="rounded-2xl bg-surface-raised backdrop-blur-2xl border border-brand-primary/20 shadow-lg flex flex-col relative overflow-hidden group/result-canvas isolate text-right transition-all">
                                    {/* Top Accent Line */}
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent" />

                                    {/* Result Header Bar */}
                                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-subtle bg-surface-glass/40">
                                        <div className="flex items-center gap-2 text-text-primary">
                                            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                                            <span className="text-xs font-bold font-cairo tracking-wide text-text-primary">
                                                النتيجة
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            {/* Quick Copy Button */}
                                            {results && (
                                                <button
                                                    onClick={handleCopyResult}
                                                    type="button"
                                                    title="نسخ النتيجة"
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold font-cairo text-text-muted hover:text-brand-primary hover:bg-brand-primary/10 transition-colors border border-transparent hover:border-brand-primary/20"
                                                >
                                                    {copied ? (
                                                        <>
                                                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                                                            <span className="text-emerald-400">تم النسخ</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-3.5 h-3.5" />
                                                            <span>نسخ</span>
                                                        </>
                                                    )}
                                                </button>
                                            )}

                                            {/* Save Button */}
                                            {results && session && onSave && (
                                                <ToolButton
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={onSave}
                                                    disabled={isSaving}
                                                    className="!px-2.5 !py-1 !text-xs !bg-brand-primary/5 !border-brand-primary/10 hover:!bg-brand-primary/10 group/save"
                                                >
                                                    {isSaving ? (
                                                        <Sparkles className="w-3 h-3 animate-spin" />
                                                    ) : (
                                                        <Save className="w-3 h-3 group-hover/save:scale-110 transition-transform" />
                                                    )}
                                                    <span>حفظ</span>
                                                </ToolButton>
                                            )}
                                        </div>
                                    </div>

                                    {/* Result Content */}
                                    <div ref={resultRef} className="p-5 sm:p-6 relative z-10 min-h-[160px] flex flex-col justify-center">
                                        <AnimatePresence mode="wait">
                                            {results ? (
                                                <motion.div
                                                    key="result-content"
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="h-full w-full"
                                                >
                                                    {results}
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="result-placeholder"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex flex-col items-center justify-center text-center py-6 px-4"
                                                >
                                                    <div className="w-10 h-10 rounded-xl bg-surface-glass border border-border-subtle flex items-center justify-center mb-3 text-text-muted">
                                                        <Terminal className="w-5 h-5 text-brand-primary/60" />
                                                    </div>
                                                    <div className="text-xs font-mono text-text-muted tracking-tight">
                                                        // بانتظار إدخال البيانات لحساب النتيجة
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
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
                <span className="block mb-2 text-xs sm:text-sm font-bold text-text-primary group-focus-within:text-brand-primary transition-colors font-cairo">
                    {label}
                </span>
                {children}
            </label>
        </div>
    );
}

export function ToolOutput({ content }: { content: React.ReactNode }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (typeof content === 'string' || typeof content === 'number') {
            await navigator.clipboard.writeText(String(content));
            setCopied(true);
            toast.success('تم نسخ المحتوى');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="relative group/output bg-surface-glass p-5 rounded-xl border border-border-subtle text-text-primary font-bold leading-relaxed whitespace-pre-wrap font-cairo text-base backdrop-blur-xl shadow-inner">
            {(typeof content === 'string' || typeof content === 'number') && (
                <button
                    onClick={handleCopy}
                    type="button"
                    title="نسخ"
                    className="absolute top-3 left-3 p-1.5 rounded-lg bg-surface-base/80 text-text-muted hover:text-brand-primary opacity-0 group-hover/output:opacity-100 transition-opacity border border-border-subtle"
                >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
            )}
            {content}
        </div>
    );
}
