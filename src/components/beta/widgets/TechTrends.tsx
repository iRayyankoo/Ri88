import React from 'react';
import { Cpu, Zap } from 'lucide-react';

export default function TechTrendsWidget() {
    return (
        <div className="h-full flex flex-col justify-end">
            <div className="flex items-center gap-4 pb-2 relative z-10">
                <div className="min-w-[42px] h-[42px] bg-fuchsia-500/10 rounded-xl flex items-center justify-center border border-fuchsia-500/20">
                    <Cpu size={20} className="text-fuchsia-300" />
                </div>
                <div>
                    <h4 className="text-base font-bold text-white mb-0.5">Al-Sadir AI 2.0</h4>
                    <p className="text-[12px] text-fuchsia-100/70 line-clamp-1">إطلاق أكبر نموذج لغوي عربي غداً</p>
                </div>
            </div>
        </div>
    );
}
