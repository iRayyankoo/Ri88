import React from 'react';
import { TrendingUp, CircleDollarSign } from 'lucide-react';

export default function FinanceWidget() {
    return (
        <div className="h-full flex flex-col justify-end">
            <div className="flex items-center gap-4 pb-2 relative z-10">
                <div className="min-w-[42px] h-[42px] bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                    <TrendingUp size={20} className="text-emerald-300" />
                </div>
                <div>
                    <h4 className="text-base font-bold text-white mb-0.5">3.75 <span className="text-[10px]">SAR/USD</span></h4>
                    <p className="text-[13px] text-emerald-100/70 font-medium">الذهب: 325.4 ر.س</p>
                </div>
            </div>
        </div>
    );
}
