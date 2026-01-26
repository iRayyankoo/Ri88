import React, { useState } from 'react';
import { Droplets, Plus } from 'lucide-react';

export default function HealthWidget() {
    const [cups, setCups] = useState(3);
    return (
        <div className="h-full flex flex-col justify-end">
            <div className="flex items-center gap-4 pb-2 relative z-10">
                <div className="min-w-[42px] h-[42px] bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                    <Droplets size={20} className="text-blue-300" />
                </div>
                <div className="flex-1">
                    <h4 className="text-base font-bold text-white mb-0.5">ترطيب الجسم</h4>
                    <p className="text-[13px] text-blue-100/70">{cups} / 8 أكواب ماء</p>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); setCups(c => c + 1); }}
                    className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center hover:bg-blue-500/40 transition-colors"
                >
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
}
