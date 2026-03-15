"use client";

import React from 'react';
import { ShieldAlert, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface AccessDeniedProps {
    moduleName: string;
}

const AccessDenied = ({ moduleName }: AccessDeniedProps) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in fade-in zoom-in duration-500 font-cairo">
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-24 h-24 bg-rose-500/10 rounded-[40px] flex items-center justify-center mb-8 border border-rose-500/20 relative"
            >
                <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full" />
                <Lock className="w-10 h-10 text-rose-500 relative z-10" />
                <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-surface-raised border border-border-strong rounded-xl flex items-center justify-center text-amber-500"
                >
                    <ShieldAlert size={16} />
                </motion.div>
            </motion.div>

            <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-black text-white mb-4"
            >
                وصول محدود - {moduleName}
            </motion.h2>

            <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-slate-400 max-w-md mx-auto leading-relaxed mb-10 font-medium"
            >
                ليس لديك صلاحية للوصول إلى هذا القسم. يرجى التواصل مع مسؤول النظام أو القسم المختص لطلب الصلاحية المطلوبة.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4"
            >
                <Link 
                    href="/pro/dashboard"
                    className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-sm transition-all border border-border-subtle"
                >
                    العودة للرئيسية
                </Link>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-brand-primary text-black rounded-2xl font-black text-sm shadow-xl shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                    تحديث الصفحة
                </button>
            </motion.div>
        </div>
    );
};

export default AccessDenied;
