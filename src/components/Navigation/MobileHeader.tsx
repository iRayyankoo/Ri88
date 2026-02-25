"use client";
import React, { useState, useRef, useEffect } from 'react';
import Logo from '../Brand/Logo';
import { Bell, Settings, LogOut, User } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';
import { handleSignOut } from '@/actions/auth';
import Link from 'next/link';
import Image from 'next/image';
import NotificationsDropdown from './NotificationsDropdown';

const MobileHeader = () => {
    const { data: session, status } = useSession();
    const isLoggedIn = !!session;
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    return (
        <header className="lg:hidden h-16 px-4 flex items-center justify-between sticky top-0 z-40 bg-surface-base/90 backdrop-blur-xl border-b border-border-subtle">
            {/* Logo */}
            <div className="flex items-center gap-2 scale-90 origin-right">
                <Logo size="sm" showText />
                <span className="px-2 py-0.5 rounded-md bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[8px] font-black font-cairo animate-pulse">
                    تجريبي
                </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                {isLoggedIn && (
                    <NotificationsDropdown />
                )}

                {status === 'loading' ? (
                    <div className="w-10 h-10 rounded-full bg-surface-raised animate-pulse" />
                ) : isLoggedIn ? (
                    <div ref={menuRef} className="relative">
                        {/* Avatar button */}
                        <button
                            onClick={() => setMenuOpen(prev => !prev)}
                            className="relative flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-brand-primary/40 active:scale-90 transition-all touch-manipulation shrink-0"
                            aria-label="قائمة الحساب"
                            type="button"
                        >
                            {session?.user?.image ? (
                                <Image
                                    src={session.user.image}
                                    alt="User"
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-tr from-brand-primary to-cyan-500 flex items-center justify-center">
                                    <span className="text-sm font-black text-black">
                                        {(session?.user?.name || 'R').charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </button>

                        {/* Dropdown menu */}
                        {menuOpen && (
                            <div className="absolute top-12 left-0 w-56 rounded-2xl bg-surface-raised border border-border-strong shadow-2xl shadow-black/50 overflow-hidden z-50">
                                {/* User info */}
                                <div className="px-4 py-3 border-b border-border-subtle">
                                    <p className="text-text-primary font-bold text-sm truncate">{session?.user?.name || 'مستخدم'}</p>
                                    <p className="text-text-muted text-xs truncate">{session?.user?.email}</p>
                                </div>

                                {/* Menu items */}
                                <div className="py-1">
                                    <Link
                                        href="/pro/settings"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-text-primary hover:bg-surface-glass transition-colors"
                                    >
                                        <Settings className="w-4 h-4 text-text-muted" />
                                        الإعدادات
                                    </Link>

                                    <form action={handleSignOut}>
                                        <button
                                            type="submit"
                                            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            تسجيل الخروج
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => signIn()}
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-black text-xs font-black rounded-xl shadow-lg shadow-brand-primary/20 touch-manipulation active:scale-95 transition-transform"
                    >
                        <User className="w-3.5 h-3.5" />
                        دخول
                    </button>
                )}
            </div>
        </header>
    );
};

export default MobileHeader;
