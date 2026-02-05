"use client";

import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    icon?: React.ElementType;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", title, icon: Icon }) => {
    return (
        <div className={`stitch-glass overflow-hidden relative ${className}`}>
            {title && (
                <div className="px-8 pt-8 pb-4 flex items-center gap-3">
                    {Icon && <Icon className="w-5 h-5 text-brand-primary" />}
                    <h3 className="text-white font-bold text-lg tracking-wide">{title}</h3>
                </div>
            )}
            <div className={`p-8 ${title ? 'pt-0' : ''}`}>
                {children}
            </div>
        </div>
    );
};

export default GlassCard;
