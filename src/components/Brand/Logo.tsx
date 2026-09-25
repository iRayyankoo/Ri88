"use client";
import React from 'react';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = "md", showText = true }) => {
    const textSizes = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-xl"
    };

    return (
        <div dir="ltr" className={`inline-flex items-center gap-1 font-mono font-bold tracking-tight select-none ${className}`}>
            <span className={`text-text-primary ${textSizes[size]}`}>ri88</span>
            <span className="text-brand-primary font-black animate-pulse">.</span>
            {showText && (
                <span className={`text-text-muted ${textSizes[size]} font-normal`}>pro</span>
            )}
        </div>
    );
};

export default Logo;
