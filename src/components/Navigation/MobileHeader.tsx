"use client";
import React, { useState, useRef, useEffect } from 'react';
import Logo from '../Brand/Logo';
import { Settings, LogOut, User, Sparkles } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import NotificationsDropdown from './NotificationsDropdown';
import ThemeToggle from '@/components/ui/ThemeToggle';

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
        <header className="lg:hidden h-14 px-3.5 flex items-center justify-between sticky top-0 z-40 bg-surface-base/92 backdrop-blur-xl border-b border-border-subtle/80 select-none" dir="rtl">
            {/* Right: App Identity */}
            <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-1.5 touch-manipulation active:scale-95 transition-transform">
                    <Logo size="sm" showText />
                </Link>
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>PRO</span>
                </div>
            </div>

            {/* Left: Quick Actions */}
            <div className="flex items-center gap-1.5" dir="ltr">
                <ThemeToggle className="w-8 h-8 rounded-lg" />

                {isLoggedIn && (
                    <NotificationsDropdown />
                )}

                {status === 'loading' ? (
                    <div className="w-8 h-8 rounded-full bg-surface-raised animate-pulse" />
                ) : isLoggedIn ? (
                    <div ref={menuRef} className="relative">
                        <button
                            onClick={() => setMenuOpen(prev => !prev)}
                            className="relative flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border border-brand-primary/40 active:scale-90 transition-all touch-manipulation shrink-0"
                            aria-label="قائمة الحساب"
                            type="button"
                        >
                            {session?.user?.image ? (
                                <Image
                                    src={session.user.image}
                                    alt="User"
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-tr from-brand-primary to-cyan-500 flex items-center justify-center">
                                    <span className="text-xs font-black text-black">
                                        {(session?.user?.name || 'R').charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </button>

                        {/* Native App Dropdown sheet */}
                        {menuOpen && (
                            <div className="absolute top-10 left-0 w-60 rounded-2xl bg-surface-raised border border-border-strong shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150" dir="rtl">
                                <div className="px-4 py-3 border-b border-border-subtle bg-surface-glass">
                                    <p className="text-text-primary font-bold text-sm truncate">{session?.user?.name || 'مستخدم'}</p>
                                    <p className="text-text-muted text-[11px] font-mono truncate">{session?.user?.email}</p>
                                </div>

                                <div className="p-1.5">
                                    <Link
                                        href="/pro/settings"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-bold text-text-primary hover:bg-surface-glass active:bg-surface-glass transition-colors"
                                    >
                                        <Settings className="w-4 h-4 text-text-muted" />
                                        <span>الإعدادات</span>
                                    </Link>

                                    <button
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 active:bg-rose-500/10 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>تسجيل الخروج</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => signIn()}
                        type="button"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary text-black text-xs font-bold rounded-lg shadow-sm active:scale-95 transition-transform touch-manipulation"
                    >
                        <User className="w-3.5 h-3.5" />
                        <span>دخول</span>
                    </button>
                )}
            </div>
        </header>
    );
};

export default MobileHeader;
