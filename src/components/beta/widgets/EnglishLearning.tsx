import React from 'react';
import { Languages } from 'lucide-react';

export default function EnglishLearningWidget() {
    return (
        <div className="h-full flex flex-col justify-end">
            <div className="flex items-center gap-4 pb-2 relative z-10">
                <div className="min-w-[42px] h-[42px] bg-rose-500/10 rounded-xl flex items-center justify-center border border-rose-500/20">
                    <Languages size={20} className="text-rose-300" />
                </div>
                <div>
                    <h4 className="text-base font-bold text-white mb-0.5">Persistence <span className="text-[10px] opacity-60">(n.)</span></h4>
                    <p className="text-[13px] text-rose-100/70">المثابرة / الإصرار</p>
                </div>
            </div>
        </div>
    );
}
