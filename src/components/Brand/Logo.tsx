"use client";
import React from 'react';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = "md", showText = true }) => {
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
                {showText && (
                    <>
                        <span className="relative inline-block mx-[1px]">
                            i
                        </span>
                        88
                    </>
                )}
            </span>
        </div>
    );
};

export default Logo;
