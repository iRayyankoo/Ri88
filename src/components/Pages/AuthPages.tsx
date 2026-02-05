"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Check, Smartphone, ArrowLeft } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import GlassCard from '../ui/GlassCard';

type AuthStep = 'login' | 'register' | 'otp';

const AuthPages = () => {
    const { setCurrentView, setIsLoggedIn } = useNavigation();
    const [step, setStep] = useState<AuthStep>('login');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API
        setTimeout(() => {
            setLoading(false);
            setIsLoggedIn(true);
            setCurrentView('dashboard');
        }, 1500);
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('otp');
    };

    const handleVerifySync = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setIsLoggedIn(true);
            setCurrentView('dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">

            <GlassCard className="w-full max-w-md p-0 overflow-hidden relative border-brand-primary/20 shadow-[0_0_100px_rgba(139,92,246,0.1)]">

                {/* Decor */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-50" />

                <div className="p-8 space-y-8 relative z-10">

                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl mx-auto flex items-center justify-center text-brand-primary mb-4 shadow-inner border border-white/5">
                            <Lock className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-black text-white">
                            {step === 'login' && 'تسجيل الدخول'}
                            {step === 'register' && 'إنشاء حساب جديد'}
                            {step === 'otp' && 'التحقق من الهوية'}
                        </h2>
                        <p className="text-slate-500 text-sm font-medium">
                            {step === 'login' && 'مرحباً بعودتك! أدخل بياناتك للمتابعة.'}
                            {step === 'register' && 'انضم إلينا واستمتع بأدوات الذكاء الاصطناعي.'}
                            {step === 'otp' && `تم إرسال رمز التحقق إلى ${email || 'بريدك الإلكتروني'}`}
                        </p>
                    </div>

                    {/* Forms */}
                    <AnimatePresence mode="wait">

                        {/* LOGIN FORM */}
                        {step === 'login' && (
                            <motion.form
                                key="login"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleLogin}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400">البريد الإلكتروني</label>
                                    <div className="relative">
                                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                        <input type="email" required className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white text-sm focus:border-brand-primary outline-none transition-colors" placeholder="name@example.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="text-xs font-bold text-slate-400">كلمة المرور</label>
                                        <button type="button" className="text-[10px] text-brand-primary hover:text-white transition-colors">نسيت كلمة المرور؟</button>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                        <input type="password" required className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white text-sm focus:border-brand-primary outline-none transition-colors" placeholder="••••••••" />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-brand-primary text-white font-bold py-3.5 rounded-xl hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : (
                                        <>
                                            تسجيل الدخول
                                            <ArrowLeft className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        )}

                        {/* REGISTER FORM */}
                        {step === 'register' && (
                            <motion.form
                                key="register"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleRegister}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400">الاسم الكامل</label>
                                    <div className="relative">
                                        <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                        <input type="text" required className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white text-sm focus:border-brand-primary outline-none transition-colors" placeholder="الاسم" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400">البريد الإلكتروني</label>
                                    <div className="relative">
                                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white text-sm focus:border-brand-primary outline-none transition-colors"
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400">كلمة المرور</label>
                                    <div className="relative">
                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                        <input type="password" required className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white text-sm focus:border-brand-primary outline-none transition-colors" placeholder="••••••••" />
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-brand-primary text-white font-bold py-3.5 rounded-xl hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20">
                                    إنشاء حساب
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                            </motion.form>
                        )}

                        {/* OTP FORM */}
                        {step === 'otp' && (
                            <motion.div
                                key="otp"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex justify-center gap-4" dir="ltr">
                                    {[1, 2, 3, 4].map((i) => (
                                        <input
                                            key={i}
                                            type="text"
                                            maxLength={1}
                                            className="w-14 h-14 bg-black/30 border border-white/10 rounded-xl text-center text-2xl font-black text-white focus:border-brand-primary outline-none transition-all"
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={handleVerifySync}
                                    disabled={loading}
                                    className="w-full bg-green-500 text-white font-bold py-3.5 rounded-xl hover:bg-green-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                                >
                                    {loading ? <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : (
                                        <>
                                            تأكيد الرمز
                                            <Check className="w-4 h-4" />
                                        </>
                                    )}
                                </button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => setStep('register')}
                                        className="text-xs text-slate-500 hover:text-white transition-colors"
                                    >
                                        تغيير البريد الإلكتروني؟
                                    </button>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>

                    {/* Footer Toggle */}
                    <div className="pt-4 border-t border-white/5 text-center">
                        {step === 'login' ? (
                            <p className="text-sm text-slate-500">
                                ليس لديك حساب؟{' '}
                                <button onClick={() => setStep('register')} className="text-brand-primary font-bold hover:text-brand-secondary transition-colors">
                                    إنشاء حساب جديد
                                </button>
                            </p>
                        ) : step === 'register' ? (
                            <p className="text-sm text-slate-500">
                                لديك حساب بالفعل؟{' '}
                                <button onClick={() => setStep('login')} className="text-brand-primary font-bold hover:text-brand-secondary transition-colors">
                                    تسجيل الدخول
                                </button>
                            </p>
                        ) : null}
                    </div>

                </div>
            </GlassCard>
        </div>
    );
};

export default AuthPages;
