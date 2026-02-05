"use client";

import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", title }) => {
    return (
        <div className={`stitch-glass overflow-hidden relative ${className}`}>
            {title && (
                <div className="px-8 pt-8 pb-4">
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
