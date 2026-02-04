"use client";
import React from 'react';
import Logo from '../Brand/Logo';
import {
    Bell,
    Search,
    Menu,
    Globe,
    HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
    return (
        <header className="sticky top-0 z-50 bg-brand-bg/80 backdrop-blur-3xl border-b border-white/5 py-6 px-10">
            <div className="max-w-[1600px] mx-auto flex items-center justify-between">

                {/* Left Actions (Notifications, Help, Lang) */}
                <div className="flex items-center gap-3">
                    <button className="hidden sm:flex w-10 h-10 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 transition-all">
                        <Globe className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 transition-all relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2.5 left-2.5 w-2 h-2 bg-brand-secondary rounded-full border-2 border-brand-bg shadow-[0_0_8px_rgba(34,211,238,1)]" />
                    </button>
                    <button className="hidden lg:flex w-10 h-10 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 transition-all">
                        <HelpCircle className="w-5 h-5" />
                    </button>
                </div>

                {/* Center Section: Logo (Mobile) or Search (Desktop) */}
                <div className="flex-1 flex justify-center px-8">
                    <div className="lg:hidden">
                        <Logo size="sm" />
                    </div>
                    <div className="hidden lg:flex relative w-full max-w-xl group">
                        <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors w-5 h-5" />
                        <input
                            type="text"
                            className="w-full bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl py-4 pr-16 pl-6 text-white focus:ring-4 focus:ring-brand-primary/10 font-bold text-sm outline-none transition-all text-right"
                            placeholder="ما هي الأداة التي تبحث عنها اليوم؟"
                        />
                    </div>
                </div>

                {/* Right Section: Menu (Mobile) or User Greeting (Desktop) */}
                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex flex-col items-end">
                        <h2 className="text-sm font-black text-white">مساحة العمل المتطورة</h2>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">الإصدار 5.2 PRO</p>
                    </div>

                    <button className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

            </div>
        </header>
    );
};

export default Header;
