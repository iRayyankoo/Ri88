"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, Download, Loader2, RefreshCw } from 'lucide-react';
import { getWalletData, addFunds } from '@/app/actions/wallet';
import { toast } from 'sonner';

interface Transaction {
    id: string;
    description: string | null;
    amount: number;
    type: string;
    createdAt: Date;
    status: string;
}

const WalletActivity = () => {
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(0);
    const [currency, setCurrency] = useState('SAR');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [monthlySpending, setMonthlySpending] = useState(0);
    const [isAddingFunds, setIsAddingFunds] = useState(false);

    const fetchData = async () => {
        try {
            const data = await getWalletData();
            setBalance(data.balance);
            setCurrency(data.currency);
            // @ts-ignore
            setTransactions(data.transactions);
            // @ts-ignore
            setMonthlySpending(data.monthlySpending);
        } catch (error) {
            console.error("Failed to fetch wallet data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddFunds = async () => {
        setIsAddingFunds(true);
        try {
            await addFunds(100); // Mock amount for now
            toast.success("تم شحن الرصيد بنجاح (تجريبي)");
            await fetchData();
        } catch (error) {
            toast.error("حدث خطأ أثناء الشحن");
        } finally {
            setIsAddingFunds(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

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
                            <span className="text-6xl font-black tracking-tighter">{balance.toFixed(2)}</span>
                            <span className="text-xl font-medium text-slate-400">{currency}</span>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={handleAddFunds}
                                disabled={isAddingFunds}
                                className="bg-white text-brand-primary font-black px-8 py-3 rounded-xl hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isAddingFunds ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                شحن الرصيد (+100 تجريبي)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stat Card */}
                <div className="stitch-glass p-8 flex flex-col justify-between">
                    <span className="text-slate-400 font-bold text-sm">مجموع الإنفاق هذا الشهر</span>
                    <div>
                        <span className="text-4xl font-black text-red-400">-{monthlySpending.toFixed(2)}</span>
                        <div className="flex items-center gap-1 text-red-400/80 text-xs mt-2 font-bold bg-red-500/10 w-fit px-2 py-1 rounded-md">
                            <TrendingUp className="w-3 h-3" />
                            مقارنة بالشهر الماضي
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="stitch-glass rounded-[32px] overflow-hidden">
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-xl font-black text-white">آخر العمليات</h3>
                    <button onClick={fetchData} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
                <div className="w-full">
                    {transactions.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">لا توجد عمليات بعد</div>
                    ) : (
                        transactions.map((tx, i) => (
                            <div key={i} className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 border-dashed">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'DEPOSIT' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {tx.type === 'DEPOSIT' ? <TrendingDown className="w-5 h-5 rotate-180" /> : <TrendingUp className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1">{tx.description || tx.type}</h4>
                                        <p className="text-xs text-slate-500 font-mono">{new Date(tx.createdAt).toLocaleDateString('ar-EG')}</p>
                                    </div>
                                </div>
                                <span className={`font-black tracking-wider ${tx.type === 'DEPOSIT' ? 'text-green-400' : 'text-white'}`}>
                                    {tx.type === 'DEPOSIT' ? '+' : '-'}{tx.amount} <span className="text-[10px] text-slate-500">SAR</span>
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default WalletActivity;
