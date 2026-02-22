"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { Home, Zap, ShoppingBag, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

const BottomNav = () => {
    const pathname = usePathname();
    const { data: session, status } = useSession();

    const navItems = [
        { name: 'الرئيسية', icon: Home, href: '/' },
        { name: 'الأدوات', icon: Zap, href: '/pro/tools' },
        { name: 'المتجر', icon: ShoppingBag, href: '/pro/store' },
        { name: 'الإعدادات', icon: Settings, href: '/pro/settings' },
    ];

    return (
        <nav className="lg:hidden bottom-nav-glass flex items-center justify-around">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link key={item.href} href={item.href} className="relative">
                        <motion.div
                            whileTap={{ scale: 0.9 }}
                            className={`flex flex-col items-center gap-1.5 transition-all ${isActive ? 'text-brand-primary' : 'text-slate-500'}`}
                        >
                            <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-brand-primary/10' : ''}`}>
                                <item.icon className={`w-6 h-6 ${isActive ? 'fill-brand-primary text-brand-primary' : ''}`} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-tighter">{item.name}</span>
                            {isActive && (
                                <motion.span
                                    layoutId="active-dot-mobile"
                                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                                />
                            )}
                        </motion.div>
                    </Link>
                );
            })}

            {/* Profile / Login */}
            <Link href={status === 'authenticated' ? '/pro/dashboard' : '/auth'} className="relative">
                <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`flex flex-col items-center gap-1.5 transition-all ${pathname === '/pro/dashboard' ? 'text-brand-primary' : 'text-slate-500'}`}
                >
                    <div className={`p-1.5 rounded-xl ${pathname === '/pro/dashboard' ? 'bg-brand-primary/10' : ''}`}>
                        {session?.user?.image ? (
                            <img src={session.user.image} alt="Profile" className="w-6 h-6 rounded-lg object-cover" />
                        ) : (
                            <User className="w-6 h-6" />
                        )}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-tighter">
                        {status === 'authenticated' ? 'حسابي' : 'دخول'}
                    </span>
                </motion.div>
            </Link>
        </nav>
    );
};

export default BottomNav;
