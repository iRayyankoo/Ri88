"use client";
import React from 'react';
import { useNavigation } from '@/context/NavigationContext';
import {
    Home,
    LayoutGrid,
    Zap,
    Heart,
    Settings,
    Plus,
    User
} from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = () => {
    const { currentView, setCurrentView } = useNavigation();

    const navItems = [
        { name: 'الرئيسية', icon: Home, id: 'dashboard' }, // Home -> Dashboard
        { name: 'الفئات', icon: LayoutGrid, id: 'categories' },
        { name: 'الأدوات', icon: Zap, id: 'directory' },
        { name: 'المفضلة', icon: Heart, id: 'favorites' },
        { name: 'الملف', icon: User, id: 'settings' }, // Settings icon used for Profile for now, or User
    ];

    return (
        <nav className="lg:hidden bottom-nav-glass flex items-center justify-around">
            {navItems.map((item, index) => {
                const isActive = currentView === item.id;

                // Special styling for the center tool button
                const isCenter = index === 2;

                return (
                    <button
                        key={item.id}
                        onClick={() => setCurrentView(item.id as any)}
                        className="relative"
                    >
                        <motion.div
                            whileTap={{ scale: 0.9 }}
                            className={`flex flex-col items-center gap-1.5 transition-all ${isActive ? 'text-brand-primary' : 'text-slate-500'
                                }`}
                        >
                            <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-brand-primary/10' : ''}`}>
                                <item.icon className={`w-6 h-6 ${isActive ? 'fill-brand-primary text-brand-primary' : ''}`} />
                                {isActive && (
                                    <motion.span
                                        layoutId="active-dot-mobile"
                                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                                    />
                                )}
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-tighter">
                                {item.name}
                            </span>
                        </motion.div>
                    </button>
                );
            })}
        </nav>
    );
};

export default BottomNav;
