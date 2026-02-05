"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Lock, ShieldCheck, CheckCircle2, ChevronRight, Apple } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';

export default function CheckoutPage() {
    const { setCurrentView } = useNavigation();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePay = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
        }, 2500);
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 ring-2 ring-emerald-500/50 shadow-2xl shadow-emerald-500/30">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                </div>
                <h2 className="text-4xl font-black text-white">تم الاشتراك بنجاح!</h2>
                <p className="text-slate-400 max-w-md text-lg">أهلاً بك في عضوية المحترفين. تم تفعيل جميع الميزات في حسابك.</p>
                <div className="flex gap-4 pt-8">
                    <button onClick={() => setCurrentView('dashboard')} className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-white transition-all">الذهاب للوحة التحكم</button>
                    <button onClick={() => setCurrentView('directory')} className="px-8 py-3 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 transition-all">استكشاف الأدوات</button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start py-8">

            {/* L: Payment Form */}
            <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => setCurrentView('plans')} className="text-slate-500 hover:text-white transition-colors">
                        <ChevronRight className="rotate-180" />
                    </button>
                    <h2 className="text-3xl font-black text-white">إتمام الدفع الآمن</h2>
                </div>

                {/* Card Preview */}
                <div className="relative h-56 w-full max-w-md mx-auto lg:mx-0 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1] to-[#a855f7]" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    <div className="absolute top-0 right-0 p-8 w-full h-full flex flex-col justify-between" dir="ltr">
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-8 bg-white/20 rounded-md backdrop-blur-md" />
                            <span className="text-white/80 font-mono text-sm tracking-widest">DEBIT</span>
                        </div>
                        <div className="font-mono text-2xl text-white tracking-[0.2em] shadow-black drop-shadow-md">
                            •••• •••• •••• 1234
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <div className="text-[10px] text-white/60 uppercase tracking-wider mb-1">Card Holder</div>
                                <div className="text-white font-bold tracking-wide">RAYYAN USER</div>
                            </div>
                            <div className="text-white/80 font-mono">09/28</div>
                        </div>
                    </div>
                </div>

                {/* Secure Form */}
                <form onSubmit={handlePay} className="space-y-6 bg-white/5 border border-white/5 p-8 rounded-3xl" dir="rtl">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400">اسم حامل البطاقة</label>
                        <div className="relative">
                            <input type="text" placeholder="الاسم كما يظهر على البطاقة" className="w-full bg-[#0D0D0F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-primary outline-none transition-colors pl-10" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400">رقم البطاقة</label>
                        <div className="relative">
                            <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                            <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-[#0D0D0F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-primary outline-none transition-colors pl-12 font-mono text-left" dir="ltr" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400">تاريخ الانتهاء</label>
                            <input type="text" placeholder="MM/YY" className="w-full bg-[#0D0D0F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-primary outline-none transition-colors font-mono text-center" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400">رمز الأمان (CVC)</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                                <input type="password" placeholder="123" maxLength={3} className="w-full bg-[#0D0D0F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-primary outline-none transition-colors font-mono text-center pl-10" required />
                            </div>
                        </div>
                    </div>

                    <button disabled={isProcessing} className="w-full py-4 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none mt-4">
                        {isProcessing ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : 'تأكيد الدفع (49 ر.س)'}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 pt-2">
                        <ShieldCheck className="w-3 h-3" />
                        <span>جميع المعاملات مشفرة وآمنة 100% via Stripe</span>
                    </div>
                </form>
            </div>


            {/* R: Order Summary */}
            <div className="space-y-6 lg:sticky lg:top-24">
                <div className="bg-[#16161a] border border-brand-primary/20 p-8 rounded-[40px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-brand-primary to-purple-600" />

                    <h3 className="text-lg font-black text-white mb-6">ملخص الطلب</h3>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                            <div>
                                <div className="font-bold text-white">الخطة الاحترافية (Pro)</div>
                                <div className="text-xs text-slate-500">اشتراك شهري</div>
                            </div>
                            <div className="font-bold text-white">49.00 ر.س</div>
                        </div>
                        <div className="flex justify-between items-center text-sm text-slate-400">
                            <span>الضريبة (15%)</span>
                            <span>7.35 ر.س</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                            <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded">خصم الترحيب (Welcome)</span>
                            <span className="text-emerald-400">-7.35 ر.س</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-end mt-8">
                        <span className="text-slate-400 font-bold">الإجمالي الكلي</span>
                        <div className="text-right">
                            <div className="text-3xl font-black text-white">49.00 <span className="text-sm font-normal text-slate-500">ر.س</span></div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>ضمان استرجاع الأموال لمدة 14 يوم</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>إلغاء في أي وقت</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center">
                            <Apple className="w-6 h-6 fill-current" />
                        </div>
                        <span className="text-sm font-bold text-white">Apple Pay</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500 rotate-180" />
                </div>
            </div>
        </div>
    );
}
