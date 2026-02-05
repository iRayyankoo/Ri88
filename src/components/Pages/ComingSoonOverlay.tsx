"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, ShieldCheck, Mail, Instagram, Twitter } from 'lucide-react';
import Logo from '../Brand/Logo';

interface ComingSoonOverlayProps {
    onUnlock?: () => void;
}

const ComingSoonOverlay: React.FC<ComingSoonOverlayProps> = ({ onUnlock }) => {
    const [timeLeft, setTimeLeft] = useState(3600 * 24 * 14); // 14 days

    // ... (rest of implementation)

    const handleAdminUnlock = () => {
        const pass = prompt("Admin Access Key:");
        if (pass === "admin-secret-pass" || pass === "78d7") {
            onUnlock?.();
        } else if (pass) {
            alert("Access Denied");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-brand-bg flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
            {/* ... (existing JSX) ... */}

            {/* Bottom Credit & Unlock */}
            <div className="absolute bottom-10 left-10 lg:left-12 opacity-30 hover:opacity-100 transition-opacity flex items-center gap-4">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">© 2026 RI88 PRO ARCHITECTURE.</p>
                <button onClick={handleAdminUnlock} className="p-2 hover:bg-white/10 rounded-full transition-colors group">
                    <ShieldCheck className="w-4 h-4 text-slate-700 group-hover:text-brand-primary" />
                </button>
            </div>
        </div>
    );
};

export default ComingSoonOverlay;
