"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 3500); // 3.5s duration
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[9999] bg-[#0D0D0F] flex items-center justify-center flex-col overflow-hidden"
        >
            {/* Ambient Background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/20 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-secondary/10 blur-[100px] rounded-full" />
            </div>

            {/* Logo Animation */}
            <div className="relative z-10 flex flex-col items-center gap-6">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        duration: 1.5
                    }}
                    className="w-32 h-32 rounded-3xl bg-gradient-to-br from-brand-primary to-blue-600 flex items-center justify-center shadow-[0_0_80px_rgba(139,92,246,0.5)] border-4 border-white/10"
                >
                    <Zap className="w-16 h-16 text-white fill-white" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-center space-y-2"
                >
                    <h1 className="text-6xl font-black text-white tracking-tighter">
                        RI88 <span className="text-brand-primary">PRO</span>
                    </h1>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="h-1 bg-gradient-to-r from-transparent via-brand-secondary to-transparent mx-auto opacity-50"
                    />
                    <p className="text-sm font-bold text-slate-500 tracking-[0.3em] uppercase pt-2">
                        Future of Automation
                    </p>
                </motion.div>
            </div>

            {/* Loading Bar */}
            <motion.div
                className="absolute bottom-20 w-64 h-1 bg-white/5 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                <motion.div
                    className="h-full bg-brand-primary shadow-[0_0_20px_rgba(139,92,246,0.8)]"
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ delay: 1.5, duration: 1.5, ease: "easeInOut" }}
                />
            </motion.div>

        </motion.div>
    );
};

export default SplashScreen;
