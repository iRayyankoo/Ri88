"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
    showRadialOverlay?: boolean;
}

export const AuroraBackground = ({ className = '', showRadialOverlay = true, ...props }: AuroraBackgroundProps) => {
    return (
        <div className={`absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#0A0A0C] ${className}`} {...props}>
            {/* Base Gradient Mesh */}
            <div className="absolute top-[-50%] left-[-50%] right-[-50%] bottom-[-50%] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08),transparent_50%)] animate-[spin_60s_linear_infinite]" />

            {/* Animated Orbs */}
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/20 rounded-full blur-[120px] opacity-40 mix-blend-screen"
            />

            <motion.div
                animate={{
                    x: [0, -100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-secondary/20 rounded-full blur-[100px] opacity-30 mix-blend-screen"
            />

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-[0.03] mix-blend-overlay" />
        </div>
    );
};
