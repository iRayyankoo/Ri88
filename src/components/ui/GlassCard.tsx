"use client";

import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", title }) => {
    return (
        <div className={`
      relative overflow-hidden 
      bg-brand-glass/40 backdrop-blur-2xl 
      border border-brand-border 
      shadow-2xl rounded-3xl
      transition-all duration-500 
      hover:shadow-brand-purple/20 
      ${className}
    `}>
            <div className="p-8 relative z-10">
                {title && <h3 className="text-white font-black mb-8 text-xl tracking-tight uppercase opacity-90">{title}</h3>}
                <div className="relative">
                    {children}
                </div>
            </div>
            {/* Subtle glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-br from-brand-purple/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </div>
    );
};

export default GlassCard;
