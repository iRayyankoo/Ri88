"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, Download } from 'lucide-react';

const WalletActivity = () => {
    const transactions = [
        { id: 1, desc: 'شحن رصيد - Apple Pay', date: '2025-05-12', amount: '+500.00', type: 'in' },
        { id: 2, desc: 'شراء اشتراك PRO (شهري)', date: '2025-05-12', amount: '-49.00', type: 'out' },
        { id: 3, desc: 'شراء إضافة: Secure Vault', date: '2025-05-10', amount: '-99.00', type: 'out' },
        { id: 4, desc: 'استرداد نقدي (عرض خاص)', date: '2025-05-01', amount: '+25.00', type: 'in' },
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-8 border-b border-white/5">
                <div className="text-right space-y-2">
                    <h2 className="text-3xl font-black text-white">المحفظة والسجل</h2>
                    <p className="text-slate-500 font-medium">تتبع رصيدك وعمليات الدفع السابقة.</p>
                </div>
                <button className="bg-white/5 hover:bg-white/10 text-white font-bold px-6 py-3 rounded-xl border border-white/10 transition-all flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    تصدير التقرير
                </button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Balance Card */}
                <div className="col-span-1 md:col-span-2 stitch-glass p-8 relative overflow-hidden bg-gradient-to-br from-brand-primary/20 to-transparent">
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3 text-slate-300 font-bold mb-8">
                            <Wallet className="w-5 h-5" />
                            الرصيد الحالي
                        </div>
                        <div className="flex items-baseline gap-2 text-white">
                            <span className="text-6xl font-black tracking-tighter">377.00</span>
                            <span className="text-xl font-medium text-slate-400">ر.س</span>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button className="bg-white text-brand-primary font-black px-8 py-3 rounded-xl hover:scale-105 transition-transform shadow-lg">شحن الرصيد</button>
                        </div>
                    </div>
                </div>

                {/* Stat Card */}
                <div className="stitch-glass p-8 flex flex-col justify-between">
                    <span className="text-slate-400 font-bold text-sm">مجموع الإنفاق هذا الشهر</span>
                    <div>
                        <span className="text-4xl font-black text-red-400">-148.00</span>
                        <div className="flex items-center gap-1 text-red-400/80 text-xs mt-2 font-bold bg-red-500/10 w-fit px-2 py-1 rounded-md">
                            <TrendingUp className="w-3 h-3" />
                            +12% عن الشهر الماضي
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="stitch-glass rounded-[32px] overflow-hidden">
                <div className="p-8 border-b border-white/5">
                    <h3 className="text-xl font-black text-white">آخر العمليات</h3>
                </div>
                <div className="w-full">
                    {transactions.map((tx, i) => (
                        <div key={i} className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 border-dashed">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'in' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {tx.type === 'in' ? <TrendingDown className="w-5 h-5 rotate-180" /> : <TrendingUp className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">{tx.desc}</h4>
                                    <p className="text-xs text-slate-500 font-mono">{tx.date}</p>
                                </div>
                            </div>
                            <span className={`font-black tracking-wider ${tx.type === 'in' ? 'text-green-400' : 'text-white'}`}>
                                {tx.amount} <span className="text-[10px] text-slate-500">SAR</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WalletActivity;
