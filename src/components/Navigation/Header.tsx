"use client";
import React from 'react';
import { Search, Bell, Menu, User, Sparkles, LogIn } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';

const Header = () => {
    const {
        isSidebarOpen,
        setIsSidebarOpen,
        currentView,
        setCurrentView,
        isLoggedIn
    } = useNavigation();

    return (
        <header className="h-20 lg:h-24 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-40 bg-[#0D0D0F]/80 backdrop-blur-md border-b border-white/5">

            {/* SEARCH BAR */}
            <div className="flex-1 max-w-xl hidden lg:block relative group">
                <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center">
                    <input
                        type="text"
                        placeholder="ابحث عن أداة ذكية..."
                        className="w-full h-12 bg-[#0D0D0F]/80 backdrop-blur-md border border-white/10 rounded-2xl pr-12 pl-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all shadow-xl"
                    />
                    <Search className="absolute right-4 w-5 h-5 text-slate-500 group-focus-within:text-brand-primary transition-colors" />
                    <div className="absolute left-2 flex gap-1">
                        <div className="px-2 py-1 bg-white/5 rounded-lg text-[10px] text-slate-500 font-bold border border-white/5 hidden xl:block">CTRL + K</div>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU TOGGLE */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white active:scale-90 transition-transform"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* ACTIONS CONTAINER */}
            <div className="flex items-center gap-5 lg:gap-8">

                {/* 1. UPGRADE BUTTON (Clean & Distinct) */}
                <button
                    onClick={() => setCurrentView('plans')}
                    className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 transition-all active:scale-95"
                >
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-bold">ترقية الباقة</span>
                </button>

                {/* 2. NOTIFICATION BELL (Isolated) */}
                <button className="relative w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/5">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-3 right-3.5 w-2 h-2 bg-red-500 rounded-full border border-[#0D0D0F] shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                </button>

                {/* DIVIDER */}
                <div className="h-8 w-[1px] bg-white/10 hidden lg:block" />

                {/* 3. USER PROFILE (Clean Layout) */}
                {isLoggedIn ? (
                    <button
                        onClick={() => setCurrentView('settings')}
                        className="flex items-center gap-3 pl-1 pr-1 lg:pr-2 py-1 rounded-xl hover:bg-white/5 transition-all group"
                    >
                        {/* Avatar */}
                        <div className="w-10 h-10 bg-gradient-to-tr from-brand-primary to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20 ring-2 ring-transparent group-hover:ring-brand-primary/20 transition-all">
                            <User className="w-5 h-5" />
                        </div>

                        {/* Text Info */}
                        <div className="hidden lg:flex flex-col items-end">
                            <span className="text-xs font-bold text-white leading-tight group-hover:text-brand-primary transition-colors">ريان المطور</span>
                            <span className="text-[10px] text-slate-500 font-medium tracking-wide">PRO MEMBER</span>
                        </div>
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrentView('auth')}
                        className="flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl font-bold text-xs shadow-lg shadow-brand-primary/20 transition-all active:scale-95 hover:-translate-y-0.5"
                    >
                        <LogIn className="w-4 h-4" />
                        <span>دخول</span>
                    </button>
                )}

            </div>
        </header>
    );
};

export default Header;
