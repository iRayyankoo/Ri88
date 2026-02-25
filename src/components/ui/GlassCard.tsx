"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hoverEffect?: boolean;
    title?: string;
    icon?: LucideIcon;
}

export const GlassCard = ({ children, className = '', onClick, hoverEffect = true, title, icon: Icon }: GlassCardProps) => {
    return (
        <motion.div
            onClick={onClick}
            whileHover={hoverEffect && onClick ? { y: -8, scale: 1.01 } : {}}
            className={`
                relative overflow-hidden
                bg-surface-glass backdrop-blur-xl
                border border-border-subtle
                rounded-[32px]
                shadow-[0_8px_32px_rgba(0,0,0,0.12)]
                group transition-all duration-500
                ${onClick ? 'cursor-pointer hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:border-brand-primary/50' : ''}
                ${className}
            `}
        >
            {/* Header if title exists */}
            {(title || Icon) && (
                <div className="flex items-center gap-3 px-8 pt-8 pb-4 border-b border-border-subtle">
                    {Icon && (
                        <div className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary">
                            <Icon className="w-5 h-5" />
                        </div>
                    )}
                    {title && <h3 className="text-xl font-bold text-text-primary font-cairo">{title}</h3>}
                </div>
            )}

            {/* Content */}
            <div className={`relative z-10 ${title ? 'p-6' : ''}`}>
                {children}
            </div>

            {/* Ambient background glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </motion.div>
    );
};

export default GlassCard;
