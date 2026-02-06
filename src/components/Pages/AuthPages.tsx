"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff, Chrome, Sparkles, ShieldCheck, Globe } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';

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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#030303]" dir="rtl">

            {/* CINEMATIC BACKGROUND CANVAS */}
            <div className="absolute inset-0 z-0">
                {/* Mode Dependent Aura Glows */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        transition={{ duration: 2 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className={`w-[800px] h-[800px] rounded-full blur-[160px] opacity-20 animate-pulse ${step === 'register' ? 'bg-brand-primary' : 'bg-indigo-500'
                            }`} />
                        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] opacity-10 ${step === 'register' ? 'bg-cyan-500' : 'bg-purple-500'
                            }`} />
                        <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[140px] opacity-10 ${step === 'register' ? 'bg-emerald-500' : 'bg-blue-500'
                            }`} />
                    </motion.div>
                </AnimatePresence>

                {/* Technical Grid Overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030303_80%)]" />
            </div>

            {/* TOP BAR / NAVIGATION */}
            <div className="absolute top-0 inset-x-0 p-8 flex items-center justify-between z-[10000]">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => setCurrentView('landing')}
                >
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
                        <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-white" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
                >
                    <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Secure Endpoint</span>
                </motion.div>
            </div>

            {/* MAIN REDESIGNED PORTAL CONTAINER */}
            <div className="relative z-10 w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-6 mt-12">

                {/* LEFT SIDE: VALUE PROPOSITION (WEB3 STYLE) */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hidden lg:flex flex-col space-y-12 pr-12"
                >
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5" />
                            Elite Developer Network
                        </div>
                        <h1 className="text-6xl font-black text-white leading-tight font-cairo">
                            مستقبل <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">الابتكار الرقمي</span>
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-md font-cairo">
                            انضم إلى المنصة الأكثر تطوراً في الشرق الأوسط، حيث تجتمع الأدوات المتقدمة والذكاء الاصطناعي في واجهة واحدة.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {[
                            { icon: ShieldCheck, label: "أمان متطور", desc: "تشفير بيانات عسكري" },
                            { icon: Globe, label: "وصول عالمي", desc: "أدوات مفعّلة دولياً" }
                        ].map((stat, i) => (
                            <div key={i} className="p-6 rounded-[24px] bg-white/5 border border-white/5 space-y-3 hover:bg-white/10 transition-colors">
                                <stat.icon className="w-8 h-8 text-brand-primary" />
                                <h4 className="text-white font-bold font-cairo">{stat.label}</h4>
                                <p className="text-slate-500 text-xs font-medium font-cairo">{stat.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* RIGHT SIDE: AUTH GLASS PORTAL */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="flex justify-center lg:justify-end"
                >
                    <div className="w-full max-w-[500px] relative">
                        {/* Outer Glow Effect */}
                        <div className="absolute -inset-4 bg-brand-primary/5 blur-3xl opacity-50 rounded-[48px] pointer-events-none" />

                        <div className="relative rounded-[40px] bg-[#0A0A0C]/80 backdrop-blur-3xl border border-white/10 shadow-2xl p-1 lg:p-1.5 flex flex-col overflow-hidden">
                            {/* Inner Carbon Texture */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />

                            {/* Content */}
                            <div className="relative rounded-[36px] bg-[#0D0D10]/40 p-8 lg:p-12 space-y-10">

                                {/* Header Toggle */}
                                <div className="text-center space-y-4">
                                    <div className="flex justify-center gap-8 mb-6">
                                        <button
                                            onClick={() => setStep('login')}
                                            className={`text-sm font-black uppercase tracking-widest transition-all ${step === 'login' ? 'text-brand-primary' : 'text-slate-600 hover:text-slate-400'}`}
                                        >
                                            Login
                                        </button>
                                        <button
                                            onClick={() => setStep('register')}
                                            className={`text-sm font-black uppercase tracking-widest transition-all ${step === 'register' ? 'text-brand-primary' : 'text-slate-600 hover:text-slate-400'}`}
                                        >
                                            Register
                                        </button>
                                    </div>
                                    <h2 className="text-4xl font-black text-white font-cairo tracking-tight">
                                        {step === 'login' ? 'مرحباً بعودتك' : 'دخول النخبة'}
                                    </h2>
                                </div>

                                {/* Main Actions */}
                                <div className="space-y-6">
                                    {/* Google Button */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsLoggedIn(true);
                                            setCurrentView('dashboard');
                                        }}
                                        className="group relative w-full flex items-center justify-center gap-4 bg-white text-black font-black py-4.5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_50px_rgba(255,255,255,0.15)] overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        <Chrome className="w-6 h-6 shrink-0" />
                                        <span className="relative font-cairo text-lg">
                                            {step === 'login' ? 'المتابعة عبر Google' : 'التسجيل بواسطة Google'}
                                        </span>
                                    </button>

                                    <div className="relative flex items-center gap-4 py-2">
                                        <div className="h-px bg-white/5 flex-1" />
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Or Secure Email</span>
                                        <div className="h-px bg-white/5 flex-1" />
                                    </div>

                                    {/* Form Fields */}
                                    <form onSubmit={step === 'login' ? handleLogin : handleRegister} className="space-y-6">
                                        {step === 'register' && (
                                            <div className="group space-y-2">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-brand-primary/5 rounded-[18px] opacity-0 group-focus-within:opacity-100 transition-opacity blur-xl" />
                                                    <User className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 w-5.5 h-5.5 group-focus-within:text-brand-primary transition-colors z-10" />
                                                    <input
                                                        type="text"
                                                        placeholder="الاسم الكامل"
                                                        className="relative z-10 w-full bg-[#121217] border border-white/5 rounded-2xl py-5 pr-14 pl-6 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/40 focus:bg-[#15151A] transition-all font-bold font-cairo shadow-inner"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="group space-y-2">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-brand-primary/5 rounded-[18px] opacity-0 group-focus-within:opacity-100 transition-opacity blur-xl" />
                                                <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 w-5.5 h-5.5 group-focus-within:text-brand-primary transition-colors z-10" />
                                                <input
                                                    type="email"
                                                    placeholder="البريد الإلكتروني"
                                                    className="relative z-10 w-full bg-[#121217] border border-white/5 rounded-2xl py-5 pr-14 pl-6 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/40 focus:bg-[#15151A] transition-all font-bold font-cairo shadow-inner"
                                                />
                                            </div>
                                        </div>

                                        <div className="group space-y-2">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-brand-primary/5 rounded-[18px] opacity-0 group-focus-within:opacity-100 transition-opacity blur-xl" />
                                                <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 w-5.5 h-5.5 group-focus-within:text-brand-primary transition-colors z-10" />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="كلمة المرور"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    className="relative z-10 w-full bg-[#121217] border border-white/5 rounded-2xl py-5 pr-14 pl-14 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/40 focus:bg-[#15151A] transition-all font-bold font-cairo shadow-inner"
                                                />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors z-10 p-1">
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className={`w-full py-5 rounded-2xl font-black text-xl transition-all active:scale-95 flex items-center justify-center gap-3 group/btn relative overflow-hidden ${step === 'login'
                                                ? 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                                                : 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-400'
                                                }`}
                                        >
                                            <span className="font-cairo uppercase">
                                                {step === 'login' ? 'تشفير الدخول' : 'تفعيل العضوية'}
                                            </span>
                                            <ArrowLeft className="w-5.5 h-5.5 group-hover/btn:-translate-x-1.5 transition-transform" />
                                        </button>
                                    </form>
                                </div>

                                <div className="text-center">
                                    <button
                                        onClick={() => setStep(step === 'login' ? 'register' : 'login')}
                                        className="text-slate-500 text-sm font-bold font-cairo hover:text-white transition-colors"
                                    >
                                        {step === 'login' ? 'لا تمتلك مفتاح وصول؟ انضم للنخبة' : 'تمتلك تصريح دخول بالفعل؟ سجل هنا'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AuthPages;
