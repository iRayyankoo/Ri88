"use client";

import React from 'react';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
}

const dimensions = {
    sm: { width: 45, height: 16, suffix: "text-[10px]" },
    md: { width: 57, height: 20, suffix: "text-xs" },
    lg: { width: 74, height: 26, suffix: "text-sm" }
} as const;

const Logo: React.FC<LogoProps> = ({ className = "", size = "md", showText = true }) => {
    const { width, height, suffix } = dimensions[size];

    return (
        <div dir="ltr" role="img" aria-label={showText ? "Ri88.Pro" : "Ri88"} className={`inline-flex shrink-0 items-end gap-1 whitespace-nowrap select-none ${className}`}>
            <svg aria-hidden="true" focusable="false" viewBox="0 0 249 88" width={width} height={height}>
                <path className="fill-current text-text-primary" fillRule="evenodd" transform="translate(0 0)" d="M0 0H48L64 16V39L50 53L68 88H45L29 58H19V88H0ZM19 17V41H40L45 36V22L40 17Z"/>
                <path className="fill-current text-text-primary" fillRule="evenodd" transform="translate(78 0)" d="M0 29H18V88H0Z"/>
                <path className="fill-current text-brand-primary" fillRule="evenodd" transform="translate(78 0)" d="M0 6L6 0H18V18H0Z"/>
                <path className="fill-current text-brand-primary" fillRule="evenodd" transform="translate(113 0)" d="M13 0H49L62 13V34L53 43L64 54V74L50 88H12L-2 74V54L9 43L0 34V13ZM21 16L17 20V29L21 33H41L45 29V20L41 16ZM20 52L16 56V67L21 72H41L46 67V56L42 52Z"/>
                <path className="fill-current text-brand-primary" fillRule="evenodd" transform="translate(185 0)" d="M13 0H49L62 13V34L53 43L64 54V74L50 88H12L-2 74V54L9 43L0 34V13ZM21 16L17 20V29L21 33H41L45 29V20L41 16ZM20 52L16 56V67L21 72H41L46 67V56L42 52Z"/>
            </svg>
            {showText && <span aria-hidden="true" className={`font-mono font-semibold leading-none text-text-primary ${suffix}`}><span className="text-brand-primary">.</span>Pro</span>}
        </div>
    );
};

export default Logo;
