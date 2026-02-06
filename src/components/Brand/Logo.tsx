"use client";
import React from 'react';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = "", size = "md" }) => {
    const sizes = {
        sm: "text-xl",
        md: "text-2xl",
        lg: "text-4xl"
    };

    const dotSizes = {
        sm: "w-1.5 h-1.5",
        md: "w-2 h-2",
        lg: "w-3 h-3"
    };

    return (
        <div dir="ltr" className={`flex items-baseline gap-0.5 font-black tracking-tighter cursor-default select-none ${className}`}>
            {/* Purple Dot left of R (The prefix dot) */}
            <span className={`${dotSizes[size]} rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)] mb-0.5 mr-0.5`}></span>

            <span className={`text-white ${sizes[size]} flex items-baseline`}>
                R
                <span className="relative inline-block mx-[1px]">
                    i
                    {/* Cyan Dot above i */}
                    <span className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[35%] h-[35%] rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] z-10"></span>
                </span>
                88
            </span>
        </div>
    );
};

export default Logo;
