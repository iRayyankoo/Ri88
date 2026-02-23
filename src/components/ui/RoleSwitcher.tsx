"use client";
import React from 'react';
import { useNavigation, UserRole } from '@/context/NavigationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, User, ChevronUp } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function RoleSwitcher() {
    const { userRole, setUserRole } = useNavigation();
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = React.useState(false);

    // Only show for the REAL authenticated ADMIN
    if (session?.user?.role !== 'ADMIN') return null;

    const roles: { id: UserRole; label: string; icon: React.ElementType; color: string }[] = [
        { id: 'visitor', label: 'زائر', icon: Users, color: 'bg-blue-500' },
        { id: 'user', label: 'مستخدم', icon: User, color: 'bg-brand-primary' },
        { id: 'admin', label: 'مسؤول', icon: Shield, color: 'bg-red-500' },
    ];

    return (
        <div className="fixed bottom-4 left-4 z-[999999] font-cairo cursor-pointer">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-3 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl flex flex-col gap-1 w-40 relative z-[999999]"
                    >
                        <div className="px-2 py-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center border-b border-white/5 mb-1">
                            Debug: Switch Role
                        </div>
                        {roles.map((role) => (
                            <div
                                key={role.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setUserRole(role.id);
                                    setIsOpen(false);
                                }}
                                className={`flex items-center gap-3 p-2 rounded-xl transition-all cursor-pointer ${userRole === role.id ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-slate-400 hover:text-slate-200'}`}
                            >
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${role.color}/20 pointer-events-none`}>
                                    <role.icon className={`w-3 h-3 ${role.color.replace('bg-', 'text-')} pointer-events-none`} />
                                </div>
                                <span className="text-xs font-bold pointer-events-none">{role.label}</span>
                                {userRole === role.id && <div className="w-1.5 h-1.5 rounded-full bg-green-500 ml-auto shadow-[0_0_8px_rgba(34,197,94,0.5)] pointer-events-none" />}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <div
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="group flex items-center gap-3 pl-1 pr-4 py-1 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/5 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer relative z-[999999]"
            >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-inner pointer-events-none ${roles.find(r => r.id === userRole)?.color || 'bg-slate-500'}`}>
                    {(() => {
                        const Icon = roles.find(r => r.id === userRole)?.icon || User;
                        return <Icon className="w-4 h-4 text-white" />;
                    })()}
                </div>
                <div className="text-right pointer-events-none">
                    <span className="block text-[9px] text-slate-400 font-bold leading-none mb-0.5">Current Role</span>
                    <span className="block text-[11px] text-white font-black leading-none">{roles.find(r => r.id === userRole)?.label}</span>
                </div>
                <ChevronUp className={`w-3 h-3 text-slate-500 transition-transform duration-300 pointer-events-none ${isOpen ? 'rotate-180' : ''}`} />
            </div>
        </div>
    );
}
