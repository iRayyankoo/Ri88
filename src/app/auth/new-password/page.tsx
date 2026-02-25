"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function NewPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (!token) {
            toast.error("رابط غير صالح أو منتهي الصلاحية.");
            router.push('/auth');
        }
    }, [token, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("كلمات المرور غير متطابقة.");
            return;
        }

        if (password.length < 6) {
            toast.error("يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/update-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password })
            });

            const data = await res.json();

            if (data?.error) {
                toast.error(data.error);
            } else if (data?.success) {
                toast.success(data.success, { duration: 6000 });
                router.push('/auth');
            } else {
                toast.error('حدث خطأ غير متوقع');
            }
        } catch {
            toast.error("حدث خطأ في الاتصال");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#030303] text-white font-cairo" dir="rtl">
                <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#030303]" dir="rtl">
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        transition={{ duration: 2 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="w-[800px] h-[800px] rounded-full blur-[160px] opacity-20 animate-pulse bg-brand-primary" />
                    </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030303_80%)]" />
            </div>

            <div className="relative z-10 w-full max-w-[500px]">
                <div className="absolute -inset-4 bg-brand-primary/5 blur-3xl opacity-50 rounded-[48px] pointer-events-none" />

                <div className="relative rounded-[40px] bg-[#0A0A0C]/80 backdrop-blur-3xl border border-white/10 shadow-2xl p-1 lg:p-1.5 flex flex-col overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />

                    <div className="relative rounded-[36px] bg-[#0D0D10]/40 p-8 lg:p-12 space-y-10">
                        <div className="text-center space-y-4">
                            <h2 className="text-4xl font-black text-white font-cairo tracking-tight">
                                كلمة مرور جديدة
                            </h2>
                            <p className="text-slate-400 font-cairo">أدخل كلمة المرور الجديدة لحسابك.</p>
                        </div>

                        <div className="space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="group space-y-2">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-brand-primary/5 rounded-[18px] opacity-0 group-focus-within:opacity-100 transition-opacity blur-xl" />
                                        <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 w-5.5 h-5.5 group-focus-within:text-brand-primary transition-colors z-10" />
                                        <input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="كلمة المرور الجديدة"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isLoading}
                                            className="relative z-10 w-full bg-[#121217] border border-white/5 rounded-2xl py-5 pr-14 pl-14 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/40 focus:bg-[#15151A] transition-all font-bold font-cairo shadow-inner"
                                            required
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors z-10 p-1">
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="group space-y-2">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-brand-primary/5 rounded-[18px] opacity-0 group-focus-within:opacity-100 transition-opacity blur-xl" />
                                        <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 w-5.5 h-5.5 group-focus-within:text-brand-primary transition-colors z-10" />
                                        <input
                                            name="confirmPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="تأكيد كلمة المرور"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            disabled={isLoading}
                                            className="relative z-10 w-full bg-[#121217] border border-white/5 rounded-2xl py-5 pr-14 pl-14 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/40 focus:bg-[#15151A] transition-all font-bold font-cairo shadow-inner"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-5 rounded-2xl font-black text-xl transition-all active:scale-95 flex items-center justify-center gap-3 group/btn relative overflow-hidden bg-brand-primary text-black shadow-xl hover:opacity-90 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-6 h-6 animate-spin text-black mx-auto" />
                                    ) : (
                                        <>
                                            <span className="font-cairo uppercase">تحديث كلمة المرور</span>
                                            <ArrowLeft className="w-5.5 h-5.5 group-hover/btn:-translate-x-1.5 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
