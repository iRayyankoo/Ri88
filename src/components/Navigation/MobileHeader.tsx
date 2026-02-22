"use client";
import React from 'react';
import Logo from '../Brand/Logo';
import { Bell } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

const MobileHeader = () => {
    const { data: session, status } = useSession();
    const isLoggedIn = !!session;

    return (
        <header className="lg:hidden h-16 px-4 flex items-center justify-between sticky top-0 z-40 bg-[#0D0D0F]/90 backdrop-blur-xl border-b border-white/5">
            {/* Logo & Experimental Badge */}
            <div className="flex items-center gap-2 scale-90 origin-right">
                <Logo size="sm" showText />
                <span className="px-2 py-0.5 rounded-md bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[8px] font-black font-cairo animate-pulse">
                    تجريبي
                </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                {isLoggedIn && (
                    <Link
                        href="/pro/notifications"
                        className="relative p-2.5 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-[#0D0D0F]" />
                    </Link>
                )}

                {status === 'loading' ? (
                    <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
                ) : isLoggedIn ? (
                    <Link
                        href="/pro/dashboard"
                        className="w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/10 block shrink-0"
                    >
                        {session?.user?.image ? (
                            <Image
                                src={session.user.image}
                                alt="User"
                                width={36}
                                height={36}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center">
                                <span className="text-xs font-black text-black">
                                    {(session?.user?.name || 'R').charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </Link>
                ) : (
                    <button
                        onClick={() => signIn()}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-xs font-black rounded-xl shadow-lg shadow-emerald-500/20"
                    >
                        دخول
                    </button>
                )}
            </div>
        </header>
    );
};

export default MobileHeader;
