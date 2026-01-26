import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Vision2030Widget() {
    return (
        <div className="h-full flex flex-col justify-end">
            <div className="flex items-center gap-4 pb-2 relative z-10">
                <div className="min-w-[42px] h-[42px] bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20">
                    <Sparkles size={20} className="text-green-300" />
                </div>
                <div>
                    <h4 className="text-base font-bold text-white mb-0.5">رؤية السعودية 2030</h4>
                    <p className="text-[13px] text-green-100/70 font-medium">خطوات مستمرة نحو المستقبل</p>
                </div>
            </div>
        </div>
    );
}
