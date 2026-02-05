"use client";
import React from 'react';
import Link from 'next/link';
import Logo from '../Brand/Logo';
import {
    Home,
    LayoutGrid,
    Zap,
    Terminal,
    Workflow,
    ShieldCheck,
    Cpu,
    Search,
    User,
    Settings,
    LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigation } from '@/context/NavigationContext';

const Sidebar = () => {
    const { currentView, setCurrentView, isLoggedIn, setIsLoggedIn } = useNavigation();

    const navItems = [
        { name: 'الرئيسية', icon: Home, id: 'landing' },
        { name: 'لوحة التحكم', icon: LayoutGrid, id: 'dashboard' },
        { name: 'دليل الأدوات', icon: Zap, id: 'directory' },
        { name: 'مساحة العمل', icon: Terminal, id: 'workspace' },
        { name: 'أتمتة المهام (Chain)', icon: Workflow, id: 'chainer' },
    ];

    const adminItems = [
        { name: 'إدارة النظام', icon: ShieldCheck, id: 'admin' },
        { name: 'بوابة المطورين', icon: Cpu, id: 'dev' },
    ];

    return (
        <aside className="hidden lg:flex w-72 h-screen bg-[#0D0D0F]/95 backdrop-blur-2xl border-l border-white/5 flex-col p-6 shrink-0 z-50 sticky top-0">
            {/* Logo Section */}
            <div className="mb-10 px-2">
                <Logo size="md" />
            </div>

            {/* Global Search Trigger */}
            <div className="mb-8 relative group cursor-pointer" onClick={() => setCurrentView('directory')}>
                <div className="absolute inset-y-0 right-4 flex items-center text-slate-500 group-hover:text-brand-primary transition-colors">
                    <Search className="w-4 h-4" />
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl py-3.5 pr-11 pl-4 text-xs text-slate-400 font-medium group-hover:border-brand-primary/30 group-hover:bg-brand-primary/5 transition-all text-right shadow-inner">
                    بحث سريع (Ctrl + K)
                </div>
            </div>

            {/* Primary Navigation */}
            <nav className="flex-1 space-y-2 text-right overflow-y-auto no-scrollbar pb-6">
                <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4 select-none">القائمة الرئيسية</p>
                {navItems.map((item) => {
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setCurrentView(item.id as any)}
                            className="w-full block"
                        >
                            <motion.div
                                whileHover={{ x: -4 }}
                                className={`w-full flex items-center justify-end gap-3 px-4 py-3 rounded-xl transition-all group relative overflow-hidden ${isActive
                                    ? 'text-white shadow-[0_0_25px_rgba(139,92,246,0.3)]'
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 bg-brand-primary rounded-xl -z-10"
                                    />
                                )}
                                <span className={`font-bold text-sm relative z-10 ${isActive ? 'text-white' : ''}`}>{item.name}</span>
                                <item.icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-brand-primary'}`} />
                            </motion.div>
                        </button>
                    );
                })}

                <div className="pt-8">
                    <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4 select-none">أدوات متقدمة</p>
                    {adminItems.map((item) => {
                        const isActive = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setCurrentView(item.id as any)}
                                className="w-full block"
                            >
                                <motion.div
                                    whileHover={{ x: -4 }}
                                    className={`w-full flex items-center justify-end gap-3 px-4 py-3 rounded-xl transition-all group border ${isActive
                                        ? 'bg-brand-secondary/10 border-brand-secondary/20 text-brand-secondary'
                                        : 'border-transparent text-slate-500 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <span className="font-bold text-sm">{item.name}</span>
                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-brand-secondary' : 'text-slate-500 group-hover:text-brand-secondary'}`} />
                                </motion.div>
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* Profile Footer */}
            <div className="mt-auto pt-6 border-t border-white/5">
                {isLoggedIn ? (
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-[#13131A] hover:bg-white/5 transition-all cursor-pointer border border-white/5 group"
                    >
                        <button onClick={() => setIsLoggedIn(false)} className="p-2 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-500 transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                        <div className="flex-1 text-right">
                            <p className="text-xs font-black text-white group-hover:text-brand-primary transition-colors">رياّن المطور</p>
                            <p className="text-[9px] text-brand-secondary font-bold uppercase tracking-widest">PRO MEMBER</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-blue-600 flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
                            <User className="w-5 h-5" />
                        </div>
                    </motion.div>
                ) : (
                    <button
                        onClick={() => setCurrentView('auth')}
                        className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/20 transition-all"
                    >
                        <span>تسجيل الدخول</span>
                    </button>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
