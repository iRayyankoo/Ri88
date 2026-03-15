"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, X, Loader2 } from 'lucide-react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { toast } from 'sonner';

interface CreateWorkspaceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateWorkspaceModal({ isOpen, onClose }: CreateWorkspaceModalProps) {
    const { refreshWorkspaces } = useWorkspace();
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/workspaces', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim() })
            });

            const data = await res.json();

            if (!res.ok) {
                const errorMessage = data.error || 'فشل إنشاء مساحة العمل';
                const errorDetails = data.details ? ` (${data.details})` : '';
                throw new Error(`${errorMessage}${errorDetails}`);
            }

            await refreshWorkspaces();
            toast.success('تم إنشاء المساحة بنجاح!');
            setName('');
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'حدث خطأ أثناء إنشاء المساحة');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-surface-base border border-border-strong rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                                        <Building className="w-5 h-5 text-brand-primary" />
                                    </div>
                                    <h2 className="text-xl font-bold text-text-primary">إنشاء مساحة عمل</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-surface-glass rounded-lg transition-colors text-text-muted hover:text-text-primary"
                                    aria-label="إغلاق"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="ws-name" className="block text-sm font-bold text-text-secondary mb-2">
                                        اسم المساحة / الشركة
                                    </label>
                                    <input
                                        id="ws-name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="مثال: شركة التقنية الحديثة"
                                        className="w-full bg-surface-raised border border-border-subtle focus:border-brand-primary rounded-xl px-4 py-3 text-text-primary outline-none transition-colors"
                                        autoFocus
                                        required
                                    />
                                </div>

                                <div className="pt-4 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-surface-glass text-text-muted hover:text-text-primary transition-colors"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!name.trim() || isSubmitting}
                                        className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                        إنشاء المساحة
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
