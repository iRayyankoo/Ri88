"use client";
import React from 'react';
import Link from 'next/link';
import Logo from '../Brand/Logo';
import {
    Home,
    LayoutGrid,
    Construction,
    Cpu,
    FileText,
    ShieldCheck,
    Settings,
    Search,
    Zap,
    Terminal,
    Workflow
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigation } from '@/context/NavigationContext';

const Sidebar = () => {
    const { currentView, setCurrentView, isLoggedIn } = useNavigation();

    const navItems = [
        { name: 'الرئيسية', icon: Home, id: 'landing' },
        { name: 'لوحة التحكم', icon: LayoutGrid, id: 'dashboard' },
        { name: 'دليل الأدوات', icon: Zap, id: 'directory' },
        { name: 'مساحة العمل', icon: Terminal, id: 'workspace' },
        { name: 'أتمتة الأدوات', icon: Workflow, id: 'chainer' },
    ];

    const adminItems = [
        { name: 'إدارة النظام', icon: ShieldCheck, id: 'admin' },
        { name: 'بوابة المطورين', icon: Cpu, id: 'dev' },
    ];

    return (
        <aside className="hidden lg:flex w-72 h-screen sidebar-ri88 border-l border-white/5 flex-col p-8 shrink-0 z-40 sticky top-0 shadow-[20px_0_40px_rgba(0,0,0,0.5)]">
            {/* Logo Section */}
            <div className="mb-12">
                <Logo size="md" />
            </div>

            {/* Global Search Trigger */}
            <div className="mb-8 relative group cursor-pointer" onClick={() => setCurrentView('directory')}>
                <div className="absolute inset-y-0 right-4 flex items-center text-slate-500 group-hover:text-brand-primary transition-colors">
                    <Search className="w-4 h-4" />
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl py-3 pr-11 pl-4 text-xs text-slate-400 font-medium group-hover:border-white/10 transition-all text-right">
                    بحث سريع عن أداة...
                </div>
            </div>

            {/* Primary Navigation */}
            <nav className="flex-1 space-y-2 text-right">
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
                                className={`w-full flex items-center justify-end gap-4 px-4 py-3.5 rounded-2xl transition-all group ${isActive
                                    ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20'
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <span className="font-bold text-sm">{item.name}</span>
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-brand-primary'}`} />
                            </motion.div>
                        </button>
                    );
                })}

                <div className="pt-8">
                    <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4 select-none">المستوى المتقدم</p>
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
                                    className={`w-full flex items-center justify-end gap-4 px-4 py-3.5 rounded-2xl transition-all group ${isActive
                                        ? 'bg-white/10 text-brand-secondary border border-brand-secondary/30'
                                        : 'text-slate-500 hover:text-white hover:bg-white/5'
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
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer border border-white/0 hover:border-white/5"
                >
                    <div className="flex-1 text-right">
                        <p className="text-xs font-black text-white">رياّن المطور</p>
                        <p className="text-[9px] text-brand-secondary font-bold uppercase tracking-widest">خطة بريميوم</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary p-0.5">
                        <div className="w-full h-full bg-brand-bg rounded-[9px] flex items-center justify-center overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=R&background=8B5CF6&color=fff" alt="User" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </aside>
    );
};

export default Sidebar;
