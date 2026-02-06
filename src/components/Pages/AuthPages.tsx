"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowLeft, Check, Eye, EyeOff, Github, Linkedin, Chrome, ArrowRight, X } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import GlassCard from '../ui/GlassCard';

type AuthStep = 'login' | 'register' | 'otp';

const AuthPages = () => {
    const { setCurrentView, setIsLoggedIn } = useNavigation();
    const [step, setStep] = useState<AuthStep>('register');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });

    // Password Strength Logic
    const getStrength = (pass: string) => {
        let s = 0;
        if (pass.length > 5) s++;
        if (pass.length > 7) s++;
        if (/[A-Z]/.test(pass)) s++;
        if (/[0-9]/.test(pass)) s++;
        return s;
    };
    const strength = getStrength(formData.password);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setTimeout(() => {
            setIsLoggedIn(true);
            setCurrentView('dashboard');
        }, 1000);
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('otp');
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#050505]" dir="rtl">
            {/* Background Glow (Green for Identity) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/20 blur-[120px] rounded-full pointer-events-none" />

            {/* Close Button */}
            <button
                onClick={() => setCurrentView('landing')}
                className="absolute top-6 left-6 z-[10000] w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300"
            >
                <X className="w-5 h-5" />
            </button>

            {/* FULL SCREEN GLASS CARD */}
            <GlassCard className="w-full min-h-screen border-none bg-[#0D0D0F]/60 backdrop-blur-3xl rounded-none flex flex-col items-center justify-center p-4">

                <div className="w-full max-w-[480px] py-10">

                    {/* Header */}
                    <div className="text-center space-y-3 mb-8">
                        <h2 className="text-3xl font-black text-white tracking-tight">
                            {step === 'login' ? 'مرحباً بعودتك' : 'إنشاء حساب جديد'}
                        </h2>
                        <p className="text-slate-400 font-medium">
                            {step === 'login' ? 'أدخل بياناتك للدخول إلى حسابك' : 'انضم الآن إلى شبكة النخبة من المطورين'}
                        </p>
                    </div>



                    {/* Form */}
                    <form onSubmit={step === 'login' ? handleLogin : handleRegister} className="space-y-5">

                        {step === 'register' && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 mr-1">الاسم الكامل</label>
                                <div className="relative group">
                                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-brand-primary transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="الاسم"
                                        className="w-full bg-[#1A1A23] border border-white/5 rounded-2xl py-4 pr-12 pl-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 focus:bg-[#1A1A23]/80 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 mr-1">البريد الإلكتروني</label>
                            <div className="relative group">
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-brand-primary transition-colors" />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full bg-[#1A1A23] border border-white/5 rounded-2xl py-4 pr-12 pl-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 focus:bg-[#1A1A23]/80 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 mr-1">كلمة المرور</label>
                            <div className="relative group">
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-brand-primary transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-[#1A1A23] border border-white/5 rounded-2xl py-4 pr-12 pl-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 focus:bg-[#1A1A23]/80 transition-all font-medium"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Password Strength */}
                        {step === 'register' && formData.password && (
                            <div className="space-y-1">
                                <div className="flex gap-1 h-1">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${strength >= i ? 'bg-brand-primary' : 'bg-white/10'}`} />
                                    ))}
                                </div>
                                <p className="text-[10px] text-brand-primary font-bold text-left">
                                    {strength < 2 ? 'ضعيفة' : strength < 3 ? 'متوسطة' : 'قوية جداً'}
                                </p>
                            </div>
                        )}

                        {step === 'register' && (
                            <div className="flex items-start gap-3 mt-2">
                                <div className="relative flex items-center">
                                    <input type="checkbox" className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/10 bg-[#1A1A23] checked:border-brand-primary checked:bg-brand-primary transition-all" />
                                    <Check className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black opacity-0 peer-checked:opacity-100 transition-opacity" />
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                                    أوافق على <span className="text-brand-primary cursor-pointer hover:underline">الشروط والأحكام</span> و <span className="text-brand-primary cursor-pointer hover:underline">سياسة الخصوصية</span>
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-primary/40 hover:shadow-brand-primary/60 transition-all active:scale-95 flex items-center justify-center gap-2 group mt-6"
                        >
                            {step === 'login' ? 'دخول' : 'إنشاء حساب'}
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        </button>

                        {/* Social Login (Moved Here) */}
                        <div className="mt-8">
                            <div className="relative flex items-center gap-4 mb-6">
                                <div className="h-px bg-white/5 flex-1" />
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">أو المتابعة عبر</span>
                                <div className="h-px bg-white/5 flex-1" />
                            </div>

                            <div className="flex justify-center gap-4">
                                {[
                                    { icon: Chrome, label: 'Google' },
                                    { icon: Linkedin, label: 'LinkedIn' },
                                    { icon: Github, label: 'GitHub' }
                                ].map((item, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/10 hover:text-white hover:scale-110 hover:border-brand-primary/50 transition-all duration-300 group"
                                    >
                                        <item.icon className="w-6 h-6 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </form>

                    {/* Footer Switch */}
                    <p className="text-center mt-8 text-sm text-slate-500 font-medium">
                        {step === 'login' ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}{" "}
                        <button
                            onClick={() => setStep(step === 'login' ? 'register' : 'login')}
                            className="text-white font-bold hover:text-brand-primary transition-colors"
                        >
                            {step === 'login' ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
                        </button>
                    </p>

                </div>
            </GlassCard>
        </div>
    );
};

export default AuthPages;
