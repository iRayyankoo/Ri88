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

    return (
        <div className={`flex items-center gap-1 font-black italic tracking-tighter cursor-default select-none ${className}`}>
            {/* Purple Dot left of R */}
            <span className="logo-dot-purple mb-1"></span>

            <span className={`text-white ${sizes[size]}`}>
                R
                <span className="relative inline-block">
                    i
                    {/* Cyan Dot above i */}
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-secondary shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
                </span>
                88
            </span>

            <span className={`text-brand-primary ml-1 ${sizes[size === 'lg' ? 'md' : 'sm']}`}>PRO</span>
        </div>
    );
};

export default Logo;
