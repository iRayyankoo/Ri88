"use client";
import React from 'react';
import Logo from '../Brand/Logo';
import { Bell, User } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';

const MobileHeader = () => {
    const { setCurrentView, isLoggedIn } = useNavigation();

    return (
        <header className="lg:hidden h-16 px-4 flex items-center justify-between sticky top-0 z-40 bg-[#0D0D0F]/80 backdrop-blur-md border-b border-white/5">
            {/* Logo */}
            <div className="scale-75 origin-right">
                <Logo size="md" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                {/* Notification */}
                <button
                    onClick={() => setCurrentView('notifications')}
                    className="relative p-2 text-slate-400 hover:text-white transition-colors"
                >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-[#0D0D0F]" />
                </button>

                {/* Profile / Login */}
                {isLoggedIn ? (
                    <button
                        onClick={() => setCurrentView('settings')}
                        className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-primary to-emerald-600 p-[1px] shadow-lg shadow-brand-primary/20"
                    >
                        <div className="w-full h-full rounded-full bg-[#0D0D0F] flex items-center justify-center">
                            <span className="text-xs font-bold text-white">R</span>
                        </div>
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrentView('auth')}
                        className="px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-xs font-bold rounded-lg border border-brand-primary/20"
                    >
                        دخول
                    </button>
                )}
            </div>
        </header>
    );
};

export default MobileHeader;
