"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff, Sparkles, ShieldCheck, Globe, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { registerAction } from '@/actions/auth';

type AuthStep = 'login' | 'register' | 'forgot-password';

const AuthPages = () => {
    const router = useRouter();
    // const { setCurrentView, setIsLoggedIn } = useNavigation(); // Legacy removed
    const [step, setStep] = useState<AuthStep>('register');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });

    // Add reset password state
    const [resetEmail, setResetEmail] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (res?.error) {
                toast.error(res.error);
            } else {
                toast.success('تم تسجيل الدخول بنجاح');
                router.push('/pro/dashboard');
                router.refresh();
            }
        } catch {
            toast.error('حدث خطأ في الاتصال');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formInputs = new FormData(e.target as HTMLFormElement);
            const res = await registerAction(formInputs);

            if (res.error) {
                toast.error(res.error);
            } else if (res.success) {
                toast.success(res.success, { duration: 6000 });
                setStep('login');
            }
        } catch {
            toast.error('حدث خطأ غير متوقع');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail })
            });

            const data = await res.json();

            if (data?.error) {
                toast.error(data.error);
            } else if (data?.success) {
                toast.success(data.success, { duration: 6000 });
                setStep('login');
            } else {
                toast.error('حدث خطأ غير متوقع');
            }
        } catch {
            toast.error('حدث خطأ في الاتصال');
        } finally {
            setIsLoading(false);
        }
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
                    onClick={() => router.push('/')}
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
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">نقطة اتصال آمنة</span>
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
                            شبكة المطورين المتقدمين
                        </div>
                        <h1 className="text-6xl font-black text-text-primary leading-tight font-cairo">
                            مستقبل <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">الابتكار الرقمي</span>
                        </h1>
                        <p className="text-text-muted text-lg leading-relaxed max-w-md font-cairo">
                            انضم إلى المنصة الأكثر تطوراً في الشرق الأوسط، حيث تجتمع الأدوات المتقدمة والذكاء الاصطناعي في واجهة واحدة.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {[
                            { icon: ShieldCheck, label: "أمان متطور", desc: "تشفير بيانات عسكري" },
                            { icon: Globe, label: "وصول عالمي", desc: "أدوات مفعّلة دولياً" }
                        ].map((stat, i) => (
                            <div key={i} className="p-6 rounded-[24px] bg-surface-glass border border-border-subtle space-y-3 hover:bg-surface-raised transition-colors">
                                <stat.icon className="w-8 h-8 text-brand-primary" />
                                <h4 className="text-text-primary font-bold font-cairo">{stat.label}</h4>
                                <p className="text-text-muted text-xs font-medium font-cairo">{stat.desc}</p>
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

                        <div className="relative rounded-[40px] bg-surface-base/80 backdrop-blur-3xl border border-border-subtle shadow-2xl p-1 lg:p-1.5 flex flex-col overflow-hidden">
                            {/* Inner Carbon Texture */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />

                            {/* Content */}
                            <div className="relative rounded-[36px] bg-surface-raised/40 p-8 lg:p-12 space-y-10">

                                {/* Header Toggle */}
                                <div className="text-center space-y-4">
                                    <div className="flex justify-center gap-8 mb-6">
                                        <button
                                            onClick={() => setStep('login')}
                                            className={`text-sm font-black uppercase tracking-widest transition-all ${step === 'login' ? 'text-brand-primary' : 'text-text-muted hover:text-text-primary'}`}
                                        >
                                            دخول
                                        </button>
                                        <button
                                            onClick={() => setStep('register')}
                                            className={`text-sm font-black uppercase tracking-widest transition-all ${step === 'register' ? 'text-brand-primary' : 'text-text-muted hover:text-text-primary'}`}
                                        >
                                            تسجيل
                                        </button>
                                    </div>
                                    <h2 className="text-4xl font-black text-text-primary font-cairo tracking-tight">
                                        {step === 'login' ? 'مرحباً بعودتك' : step === 'register' ? 'دخول النخبة' : 'استعادة الوصول'}
                                    </h2>
                                </div>

                                {/* Main Actions */}
                                <div className="space-y-6">
                                    {/* Google Button */}
                                    <button
                                        type="button"
                                        onClick={() => signIn('google', { callbackUrl: '/pro' })}
                                        className="group relative w-full flex items-center justify-center gap-4 bg-text-primary text-surface-base border border-border-subtle font-black py-4.5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_50px_rgba(255,255,255,0.15)] overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-text-muted/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        <span className="relative font-cairo text-lg">
                                            {step === 'login' ? 'المتابعة عبر Google' : 'التسجيل بواسطة Google'}
                                        </span>
                                    </button>

                                    <div className="relative flex items-center gap-4 py-2">
                                        <div className="h-px bg-border-subtle flex-1" />
                                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                                            {step === 'forgot-password' ? 'أدخل بريدك الإلكتروني أدناه' : 'أو عبر البريد الإلكتروني'}
                                        </span>
                                        <div className="h-px bg-border-subtle flex-1" />
                                    </div>

                                    {/* Form Fields */}
                                    <form onSubmit={step === 'login' ? handleLogin : step === 'register' ? handleRegister : handleForgotPassword} className="space-y-6">
                                        {step === 'register' && (
                                            <div className="group space-y-2">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-brand-primary/5 rounded-[18px] opacity-0 group-focus-within:opacity-100 transition-opacity blur-xl" />
                                                    <User className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted w-5.5 h-5.5 group-focus-within:text-brand-primary transition-colors z-10" />
                                                    <input
                                                        name="name"
                                                        type="text"
                                                        placeholder="الاسم الكامل"
                                                        value={formData.fullName}
                                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                        disabled={isLoading}
                                                        className="relative z-10 w-full bg-surface-glass border border-border-subtle rounded-2xl py-5 pr-14 pl-6 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary/40 focus:bg-surface-raised transition-all font-bold font-cairo shadow-inner"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="group space-y-2">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-brand-primary/5 rounded-[18px] opacity-0 group-focus-within:opacity-100 transition-opacity blur-xl" />
                                                <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted w-5.5 h-5.5 group-focus-within:text-brand-primary transition-colors z-10" />
                                                <input
                                                    name="email"
                                                    type="email"
                                                    placeholder="البريد الإلكتروني"
                                                    value={step === 'forgot-password' ? resetEmail : formData.email}
                                                    onChange={(e) => step === 'forgot-password' ? setResetEmail(e.target.value) : setFormData({ ...formData, email: e.target.value })}
                                                    disabled={isLoading}
                                                    className="relative z-10 w-full bg-surface-glass border border-border-subtle rounded-2xl py-5 pr-14 pl-6 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary/40 focus:bg-surface-raised transition-all font-bold font-cairo shadow-inner"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {step !== 'forgot-password' && (
                                            <div className="group space-y-2">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-brand-primary/5 rounded-[18px] opacity-0 group-focus-within:opacity-100 transition-opacity blur-xl" />
                                                    <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted w-5.5 h-5.5 group-focus-within:text-brand-primary transition-colors z-10" />
                                                    <input
                                                        name="password"
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="كلمة المرور"
                                                        value={formData.password}
                                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                        disabled={isLoading}
                                                        className="relative z-10 w-full bg-surface-glass border border-border-subtle rounded-2xl py-5 pr-14 pl-14 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary/40 focus:bg-surface-raised transition-all font-bold font-cairo shadow-inner"
                                                        required
                                                    />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors z-10 p-1">
                                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {step === 'login' && (
                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => setStep('forgot-password')}
                                                    className="text-slate-400 text-xs font-bold font-cairo hover:text-brand-primary transition-colors"
                                                >
                                                    نسيت كلمة المرور؟
                                                </button>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`w-full py-5 rounded-2xl font-black text-xl transition-all active:scale-95 flex items-center justify-center gap-3 group/btn relative overflow-hidden ${step === 'login'
                                                ? 'bg-surface-glass text-text-primary border border-border-subtle hover:bg-surface-raised disabled:opacity-50'
                                                : 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-400 disabled:opacity-50'
                                                }`}
                                        >
                                            {isLoading ? (
                                                <Loader2 className="w-6 h-6 animate-spin text-brand-primary mx-auto" />
                                            ) : (
                                                <>
                                                    <span className="font-cairo uppercase">
                                                        {step === 'login' ? 'تشفير الدخول' : step === 'register' ? 'تفعيل العضوية' : 'إرسال رابط الاستعادة'}
                                                    </span>
                                                    <ArrowLeft className="w-5.5 h-5.5 group-hover/btn:-translate-x-1.5 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>

                                <div className="text-center">
                                    {step === 'forgot-password' ? (
                                        <button
                                            onClick={() => setStep('login')}
                                            className="text-slate-500 text-sm font-bold font-cairo hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            العودة لتسجيل الدخول
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setStep(step === 'login' ? 'register' : 'login')}
                                            className="text-slate-500 text-sm font-bold font-cairo hover:text-white transition-colors"
                                        >
                                            {step === 'login' ? 'لا تمتلك مفتاح وصول؟ انضم للنخبة' : 'تمتلك تصريح دخول بالفعل؟ سجل هنا'}
                                        </button>
                                    )}
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
