"use client";
import React from 'react';
import { Search, Menu, User, Sparkles, LogIn } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import NotificationsDropdown from './NotificationsDropdown';

const Header = () => {
    const {
        isSidebarOpen,
        setIsSidebarOpen
    } = useNavigation();
    const { data: session, status } = useSession();
    const isLoggedIn = status === 'authenticated';
    const isLoading = status === 'loading';

    return (
        <header className="hidden lg:flex h-20 lg:h-24 px-6 lg:px-10 items-center justify-between sticky top-0 z-40 bg-surface-base/80 backdrop-blur-md border-b border-border-subtle">

            <div className="flex-1 max-w-xl hidden lg:flex items-center gap-4 relative group">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black font-cairo shrink-0">
                    النسخة التجريبية (BETA) 🚀
                </div>
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="ابحث عن أداة ذكية..."
                        className="w-full h-12 bg-surface-base/80 backdrop-blur-md border border-border-strong rounded-2xl pr-12 pl-4 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all shadow-xl"
                    />
                    <Search className="absolute right-4 w-5 h-5 text-text-muted group-focus-within:text-brand-primary transition-colors" />
                    <div className="absolute left-2 flex gap-1">
                        <div className="px-2 py-1 bg-surface-glass rounded-lg text-[10px] text-text-muted font-bold border border-border-subtle hidden xl:block">⌘ K</div>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU TOGGLE */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden w-10 h-10 bg-surface-glass rounded-xl flex items-center justify-center text-text-primary active:scale-90 transition-transform"
                title="فتح القائمة"
                aria-label="فتح القائمة الجانبية"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* ACTIONS CONTAINER */}
            <div className="flex items-center gap-5 lg:gap-8">

                {/* 1. UPGRADE BUTTON (Clean & Distinct) */}
                {/* 1. UPGRADE BUTTON (Clean & Distinct) */}
                <Link
                    href="/pricing"
                    className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 transition-all active:scale-95"
                >
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-bold">ترقية الباقة</span>
                </Link>

                {/* Notifications Dropdown */}
                <NotificationsDropdown />

                {/* DIVIDER */}
                <div className="h-8 w-[1px] bg-border-strong hidden lg:block" />

                {/* 3. USER PROFILE (Clean Layout) */}
                {isLoading ? (
                    <div className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-xl bg-surface-glass animate-pulse">
                        <div className="w-10 h-10 rounded-xl bg-surface-glass" />
                        <div className="hidden lg:flex flex-col items-end space-y-2">
                            <div className="h-3 w-20 bg-surface-glass rounded" />
                            <div className="h-2 w-12 bg-surface-glass rounded" />
                        </div>
                    </div>
                ) : isLoggedIn ? (
                    <Link
                        href="/pro/settings"
                        className="flex items-center gap-3 pl-1 pr-1 lg:pr-2 py-1 rounded-xl hover:bg-surface-glass transition-all group"
                    >
                        {/* Avatar */}
                        <div className="w-10 h-10 bg-gradient-to-tr from-brand-primary to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20 ring-2 ring-transparent group-hover:ring-brand-primary/20 transition-all overflow-hidden">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-5 h-5" />
                            )}
                        </div>

                        {/* Text Info */}
                        <div className="hidden lg:flex flex-col items-end">
                            <span className="text-xs font-bold text-text-primary leading-tight group-hover:text-brand-primary transition-colors truncate max-w-[100px]">
                                {session?.user?.name || 'مستخدم'}
                            </span>
                            <span className="text-[10px] text-text-muted font-medium tracking-wide">
                                {session?.user?.isPro ? 'عضوية برو' : 'الخطة المجانية'}
                            </span>
                        </div>
                    </Link>
                ) : (
                    <Link
                        href="/auth"
                        className="flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl font-bold text-xs shadow-lg shadow-brand-primary/20 transition-all active:scale-95 hover:-translate-y-0.5"
                    >
                        <LogIn className="w-4 h-4" />
                        <span>دخول</span>
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;
