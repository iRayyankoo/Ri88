"use client";
import React, { useState, useRef, useEffect } from 'react';
import Logo from '../Brand/Logo';
import {
    Home,
    Zap,
    ShieldCheck,
    Cpu,
    User,
    Settings,
    LogOut,
    ShoppingBag,
    Puzzle,
    ChevronRight,
    ChevronLeft,
    LayoutGrid,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigation } from '@/context/NavigationContext';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Sidebar = () => {
    const { isSidebarOpen, isSidebarCollapsed, setIsSidebarCollapsed, userRole } = useNavigation();
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const isLoggedIn = status === 'authenticated';
    const isLoading = status === 'loading';
    const isAdmin = userRole === 'admin' || session?.user?.role === 'ADMIN';

    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // ── قائمة العضو الأساسية ──────────────────────────────
    const navItems = [
        { name: 'الرئيسية', icon: Home, href: '/' },
        { name: 'دليل الأدوات', icon: Zap, href: '/pro/tools' },
        { name: 'المتجر', icon: ShoppingBag, href: '/pro/store' },
        { name: 'الإعدادات', icon: Settings, href: '/pro/settings' },
    ];

    // ── قائمة الأدمن الإضافية ────────────────────────────
    const adminItems = [
        { name: 'إدارة النظام', icon: ShieldCheck, href: '/pro/admin' },
        { name: 'بوابة المطورين', icon: Cpu, href: '/pro/dev' },
    ];

    const NavLink = ({ item }: { item: { name: string; icon: React.ElementType; href: string } }) => {
        const isActive = pathname === item.href;
        return (
            <Link href={item.href} className="w-full block" title={isSidebarCollapsed ? item.name : undefined}>
                <motion.div
                    whileHover={{ x: isSidebarCollapsed ? 0 : -4 }}
                    className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0 py-3' : 'justify-start gap-4 px-4 py-3'} rounded-xl transition-all group relative overflow-hidden ${isActive ? 'text-white shadow-[0_0_25px_rgba(139,92,246,0.3)]' : 'text-slate-500 hover:text-white hover:bg-white/5'
                        }`}
                >
                    {isActive && (
                        <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-brand-primary rounded-xl -z-10" />
                    )}
                    <item.icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-brand-primary'}`} />
                    {!isSidebarCollapsed && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`font-bold text-sm relative z-10 ${isActive ? 'text-white' : ''}`}>
                            {item.name}
                        </motion.span>
                    )}
                </motion.div>
            </Link>
        );
    };

    return (
        <aside className={`
            fixed inset-y-0 right-0 z-50 bg-[#0D0D0F]/95 backdrop-blur-xl border-l border-white/5 flex flex-col transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
            lg:relative lg:translate-x-0 lg:flex lg:border-l lg:border-white/5
            ${isSidebarCollapsed ? 'w-[88px] px-3 py-6' : 'w-72 px-6 py-8'}
            hidden
        `}>

            {/* Collapse Toggle */}
            <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="absolute top-8 -left-3 w-6 h-6 bg-brand-primary border border-white/10 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-brand-primary/80 transition-colors z-50 hidden lg:flex"
            >
                {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Logo */}
            <div className={`mb-10 px-2 flex items-center justify-center transition-all duration-300 ${isSidebarCollapsed ? 'scale-75' : ''}`}>
                <Logo size={isSidebarCollapsed ? "sm" : "md"} showText={!isSidebarCollapsed} />
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 text-right overflow-y-auto no-scrollbar pb-6">

                {/* عناصر العضو */}
                {navItems.map((item) => <NavLink key={item.href} item={item} />)}

                {/* قسم الأدمن */}
                {isAdmin && (
                    <div className="pt-8">
                        {!isSidebarCollapsed && (
                            <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4 select-none animate-in fade-in">
                                أدوات متقدمة
                            </p>
                        )}
                        {isSidebarCollapsed && <div className="h-px w-full bg-white/5 my-4" />}

                        {adminItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href} className="w-full block" title={isSidebarCollapsed ? item.name : undefined}>
                                    <motion.div
                                        whileHover={{ x: isSidebarCollapsed ? 0 : -4 }}
                                        className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0 py-3' : 'justify-start gap-4 px-4 py-3'} rounded-xl transition-all group border ${isActive
                                            ? 'bg-brand-secondary/10 border-brand-secondary/20 text-brand-secondary'
                                            : 'border-transparent text-slate-500 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <item.icon className={`w-5 h-5 ${isActive ? 'text-brand-secondary' : 'text-slate-500 group-hover:text-brand-secondary'}`} />
                                        {!isSidebarCollapsed && <span className="font-bold text-sm">{item.name}</span>}
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </nav>

            {/* Profile Footer */}
            <div className={`mt-auto pt-6 border-t border-white/5 relative ${isSidebarCollapsed ? 'flex justify-center' : ''}`} ref={profileRef}>

                {isLoading ? (
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#13131A] border border-white/5 animate-pulse">
                        <div className="w-8 h-8 rounded-lg bg-white/5" />
                        {!isSidebarCollapsed && (
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-20 bg-white/5 rounded" />
                                <div className="h-2 w-16 bg-white/5 rounded" />
                            </div>
                        )}
                    </div>
                ) : isLoggedIn ? (
                    <>
                        {/* Profile Dropdown */}
                        <AnimatePresence>
                            {profileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute bottom-full mb-2 left-0 right-0 bg-[#13131A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50"
                                >
                                    <Link
                                        href="/pro/dashboard"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-slate-300 hover:text-white"
                                    >
                                        <LayoutGrid className="w-4 h-4 text-brand-primary" />
                                        {!isSidebarCollapsed && <span className="text-sm font-bold">لوحة التحكم</span>}
                                    </Link>
                                    <Link
                                        href="/pro/extensions"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-slate-300 hover:text-white border-t border-white/5"
                                    >
                                        <Puzzle className="w-4 h-4 text-brand-primary" />
                                        {!isSidebarCollapsed && <span className="text-sm font-bold">الامتدادات</span>}
                                    </Link>
                                    <button
                                        onClick={() => { signOut(); setProfileOpen(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-colors text-slate-500 hover:text-red-400 border-t border-white/5"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        {!isSidebarCollapsed && <span className="text-sm font-bold">تسجيل الخروج</span>}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Profile Card */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setProfileOpen(!profileOpen)}
                            className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-2xl bg-[#13131A] hover:bg-white/5 transition-all cursor-pointer border border-white/5 group`}
                        >
                            {!isSidebarCollapsed && (
                                <div className="flex-1 text-right">
                                    <p className="text-xs font-black text-white group-hover:text-brand-primary transition-colors truncate max-w-[120px]">
                                        {session?.user?.name || 'مستخدم'}
                                    </p>
                                    <p className="text-[9px] text-brand-secondary font-bold uppercase tracking-widest">
                                        {session?.user?.isPro ? 'عضوية برو' : 'الخطة المجانية'}
                                    </p>
                                </div>
                            )}
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-blue-600 flex items-center justify-center text-white shadow-lg shadow-brand-primary/20 overflow-hidden shrink-0">
                                {session?.user?.image ? (
                                    <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-5 h-5" />
                                )}
                            </div>
                        </motion.div>
                    </>
                ) : (
                    <Link
                        href="/auth"
                        className={`w-full flex items-center justify-center ${isSidebarCollapsed ? 'p-3' : 'gap-2 py-3'} bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/20 transition-all`}
                    >
                        {isSidebarCollapsed ? <User className="w-5 h-5" /> : <span>تسجيل الدخول</span>}
                    </Link>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
