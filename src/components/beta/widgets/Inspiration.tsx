import React from 'react';
import { Quote } from 'lucide-react';

export default function InspirationWidget() {
    return (
        <div className="h-full flex flex-col justify-end">
            <div className="flex items-center gap-4 pb-2 relative z-10">
                <div className="min-w-[42px] h-[42px] bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                    <Quote size={20} className="text-indigo-300" />
                </div>
                <div>
                    <h4 className="text-[14px] font-bold text-white leading-snug">"وَفِي السَّمَاءِ رِزْقُكُمْ وَمَا تُوعَدُونَ"</h4>
                    <p className="text-[11px] text-indigo-100/70 mt-0.5">آية اليوم</p>
                </div>
            </div>
        </div>
    );
}
