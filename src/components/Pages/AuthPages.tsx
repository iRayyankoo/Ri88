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
                    <div className="pt-4 border-t border-white/5 text-center space-y-4">

                        {/* Social Login */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span className="h-px bg-white/5 flex-1" />
                                أو المتابعة باستخدام
                                <span className="h-px bg-white/5 flex-1" />
                            </div>
                            <button
                                onClick={handleLogin} // Using same mock handler for now
                                className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                {step === 'login' ? 'تـسجيل الدخول بـ Google' : 'إنشاء حساب بـ Google'}
                            </button>
                        </div>

                        {/* Existing Toggle */}
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
