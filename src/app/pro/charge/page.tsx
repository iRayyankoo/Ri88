"use client";
import React from 'react';
import MoyasarPayment from '@/components/payment/MoyasarPayment';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ChargePage() {
    return (
        <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-lg relative z-10">
                <Link
                    href="/pro/wallet"
                    className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-8 text-sm"
                >
                    <ArrowLeft className="w-4 h-4 ml-2" />
                    العودة للمحفظة
                </Link>

                <div className="bg-[#13131A]/80 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2">شحن الرصيد</h1>
                        <p className="text-slate-400 text-sm">سيتم إضافة <span className="text-white font-bold">1.00 ريال</span> إلى محفظتك</p>
                    </div>

                    <MoyasarPayment
                        amount={100} // 1 SAR
                        description="شحن رصيد المحفظة"
                        onComplete={(payment) => {
                            console.log('Payment Success:', payment);
                            alert('تمت العملية بنجاح!');
                            window.location.href = '/pro/wallet';
                        }}
                    />

                    <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest border-t border-white/5 pt-6">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        <span>Secured Payment</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
