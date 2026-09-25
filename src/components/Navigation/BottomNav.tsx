/* eslint-disable @next/next/no-img-element */
"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { Home, Zap, Star, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useFavorites } from '@/context/FavoritesContext';

const BottomNav = () => {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const { favorites } = useFavorites();
    const isLoggedIn = status === 'authenticated';

    const navItems = [
        { name: 'الرئيسية', icon: Home, href: '/' },
        { name: 'الأدوات', icon: Zap, href: '/pro/tools' },
        { name: 'المفضلة', icon: Star, href: '/pro/tools?filter=favorites', badge: favorites.length > 0 ? favorites.length : undefined },
        { name: 'الإعدادات', icon: Settings, href: '/pro/settings' },
    ];

    return (
        <nav
            className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-surface-base/90 backdrop-blur-2xl border-t border-border-subtle shadow-[0_-8px_30px_rgba(0,0,0,0.3)] pb-[max(env(safe-area-inset-bottom,0px),8px)] pt-2 px-2 select-none"
            dir="rtl"
        >
            <div className="flex items-center justify-around max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href.includes('?') && pathname === item.href.split('?')[0]);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="relative flex-1 py-1 flex flex-col items-center justify-center touch-manipulation group"
                        >
                            <motion.div
                                whileTap={{ scale: 0.88 }}
                                className="flex flex-col items-center gap-1"
                            >
                                <div className={`relative p-1.5 rounded-xl transition-all duration-200 ${
                                    isActive 
                                        ? 'bg-brand-primary/15 text-brand-primary' 
                                        : 'text-text-muted group-hover:text-text-primary'
                                }`}>
                                    <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                                    {item.badge !== undefined && (
                                        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-brand-primary text-black text-[9px] font-mono font-bold flex items-center justify-center">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                                <span className={`text-[10px] font-cairo transition-all ${
                                    isActive 
                                        ? 'font-bold text-brand-primary' 
                                        : 'font-medium text-text-muted'
                                }`}>
                                    {item.name}
                                </span>
                            </motion.div>
                        </Link>
                    );
                })}

                {/* Profile / Account Tab */}
                <Link
                    href={isLoggedIn ? '/pro/dashboard' : '/auth'}
                    className="relative flex-1 py-1 flex flex-col items-center justify-center touch-manipulation group"
                >
                    <motion.div
                        whileTap={{ scale: 0.88 }}
                        className="flex flex-col items-center gap-1"
                    >
                        <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                            pathname === '/pro/dashboard' 
                                ? 'bg-brand-primary/15 text-brand-primary' 
                                : 'text-text-muted group-hover:text-text-primary'
                        }`}>
                            {session?.user?.image ? (
                                <img
                                    src={session.user.image}
                                    alt="Profile"
                                    className="w-5 h-5 rounded-full object-cover border border-brand-primary/40"
                                />
                            ) : (
                                <User className={`w-5 h-5 ${pathname === '/pro/dashboard' ? 'stroke-[2.5]' : 'stroke-2'}`} />
                            )}
                        </div>
                        <span className={`text-[10px] font-cairo transition-all ${
                            pathname === '/pro/dashboard' 
                                ? 'font-bold text-brand-primary' 
                                : 'font-medium text-text-muted'
                        }`}>
                            {isLoggedIn ? 'حسابي' : 'دخول'}
                        </span>
                    </motion.div>
                </Link>
            </div>
        </nav>
    );
};

export default BottomNav;
