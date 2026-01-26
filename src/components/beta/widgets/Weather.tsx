import React from 'react';
import { CloudSun, Sun } from 'lucide-react';

export default function WeatherWidget() {
    // Mock data for Riyadh
    return (
        <div className="h-full flex flex-col justify-end">
            <div className="flex items-center gap-4 pb-2 relative z-10">
                <div className="min-w-[42px] h-[42px] bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                    <Sun size={20} className="text-amber-300" />
                </div>
                <div>
                    <h4 className="text-base font-bold text-white mb-0.5">28° م</h4>
                    <p className="text-[13px] text-amber-100/70 font-medium">سماء صافية</p>
                </div>
            </div>
        </div>
    );
}
