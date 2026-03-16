/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useRef, useEffect } from 'react';
import Logo from '../Brand/Logo';
import {
    Zap,
    ShieldCheck,
    Cpu,
    User,
    Settings,
    LogOut,
    Puzzle,
    ChevronRight,
    ChevronLeft,
    LayoutGrid,
    Users,
    CheckSquare,
    LayoutDashboard,
    Building,
    Check,
    PlusCircle,
    Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigation } from '@/context/NavigationContext';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import CreateWorkspaceModal from '../workspaces/CreateWorkspaceModal';

const Sidebar = () => {
    const { isSidebarOpen, isSidebarCollapsed, setIsSidebarCollapsed, userRole } = useNavigation();
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const isLoggedIn = status === 'authenticated';
    const isLoading = status === 'loading';
    const { currentWorkspace, workspaces, setCurrentWorkspace, permissions, workspaceRole } = useWorkspace();
    const isAdmin = userRole === 'admin' || session?.user?.role === 'ADMIN' || workspaceRole === 'OWNER' || workspaceRole === 'ADMIN';
    
    useEffect(() => {
        if (session) {
            console.log("Sidebar Auth Debug:", { 
                systemRole: userRole, 
                sessionRole: session?.user?.role, 
                workspaceRole, 
                isAdmin,
                workspaceId: currentWorkspace?.id
            });
        }
    }, [session, userRole, workspaceRole, isAdmin, currentWorkspace]);

    const [workspaceOpen, setWorkspaceOpen] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const workspaceRef = useRef<HTMLDivElement>(null);

    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
            if (workspaceRef.current && !workspaceRef.current.contains(e.target as Node)) {
                setWorkspaceOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // ── قائمة العضو الأساسية ──────────────────────────────
    const navItems = [
        { name: 'الرئيسية', icon: LayoutDashboard, href: '/' },
        { name: 'العملاء (CRM)', icon: Users, href: '/pro/crm', permission: 'can_access_crm' },
        { name: 'المهام (HR)', icon: CheckSquare, href: '/pro/hr', permission: 'can_manage_tasks' },
        { name: 'المالية والفواتير', icon: Receipt, href: '/pro/finance', permission: 'can_access_finance' },
        { name: 'مركز الأدوات', icon: Zap, href: '/pro/tools', permission: 'can_access_tools' },
        { name: 'الإعدادات', icon: Settings, href: '/pro/settings', permission: 'can_access_settings' },
    ];

    // ── قائمة الأدمن الإضافية ────────────────────────────
    const adminItems = [
        { name: 'إدارة النظام', icon: ShieldCheck, href: '/pro/admin' },
        { name: 'بوابة المطورين', icon: Cpu, href: '/pro/dev' },
    ];

    const NavLink = ({ item }: { item: { name: string; icon: React.ElementType; href: string } }) => {
        const isActive = pathname === item.href;
        return (
            <Link href={item.href} className="w-full block" title={isSidebarCollapsed ? item.name : undefined}>
                <motion.div
                    whileHover={{ x: isSidebarCollapsed ? 0 : -4 }}
                    className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0 py-3' : 'justify-start gap-4 px-4 py-3'} rounded-xl transition-all group relative overflow-hidden ${isActive ? 'text-white shadow-[0_0_25px_rgba(139,92,246,0.3)]' : 'text-text-muted hover:text-text-primary hover:bg-surface-glass'
                        }`}
                >
                    {isActive && (
                        <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-brand-primary rounded-xl -z-10" />
                    )}
                    <item.icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-white' : 'text-text-muted group-hover:text-brand-primary'}`} />
                    {!isSidebarCollapsed && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`font-bold text-sm relative z-10 ${isActive ? 'text-white' : ''}`}>
                            {item.name}
                        </motion.span>
                    )}
                </motion.div>
            </Link>
        );
    };

    return (
        <aside className={`
            fixed inset-y-0 right-0 z-50 bg-surface-base/95 backdrop-blur-xl border-l border-border-subtle flex flex-col transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
            lg:relative lg:translate-x-0 lg:flex lg:border-l lg:border-border-subtle
            ${isSidebarCollapsed ? 'w-[88px] px-3 py-6' : 'w-72 px-6 py-8'}
            hidden
        `}>

            {/* Collapse Toggle */}
            <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="absolute top-8 -left-3 w-6 h-6 bg-brand-primary border border-border-strong rounded-full flex items-center justify-center text-white shadow-lg hover:bg-brand-primary/80 transition-colors z-50 hidden lg:flex"
            >
                {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Logo */}
            <div className={`mb-6 px-2 flex items-center justify-center transition-all duration-300 ${isSidebarCollapsed ? 'scale-75' : ''}`}>
                <Logo size={isSidebarCollapsed ? "sm" : "md"} showText={!isSidebarCollapsed} />
            </div>

            {/* Workspace Selector */}
            {isLoggedIn && (
                <div className={`mb-6 px-2 relative ${isSidebarCollapsed ? 'flex justify-center' : ''}`} ref={workspaceRef}>
                    <button
                        onClick={() => setWorkspaceOpen(!workspaceOpen)}
                        className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-2' : 'justify-between px-3 py-2'} rounded-xl bg-surface-raised border border-border-subtle hover:bg-surface-glass transition-colors`}
                    >
                        {isSidebarCollapsed ? (
                            <Building className="w-5 h-5 text-brand-primary" />
                        ) : (
                            <>
                                <div className="flex items-center gap-2 overflow-hidden text-right">
                                    <div className="w-6 h-6 rounded bg-brand-primary/20 text-brand-primary flex flex-shrink-0 items-center justify-center font-bold text-xs uppercase">
                                        {currentWorkspace?.name?.charAt(0) || <PlusCircle className="w-3 h-3" />}
                                    </div>
                                    <span className="text-sm font-bold text-text-primary truncate">{currentWorkspace?.name || 'إنشاء مساحة عمل'}</span>
                                </div>
                                <ChevronRight className={`w-4 h-4 text-text-muted transition-transform ${workspaceOpen ? 'rotate-90' : ''}`} />
                            </>
                        )}
                    </button>

                    <AnimatePresence>
                        {workspaceOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                                transition={{ duration: 0.15 }}
                                className="absolute top-full mt-2 left-2 right-2 bg-surface-raised border border-border-strong rounded-xl overflow-hidden shadow-2xl z-50 text-right"
                            >
                                <div className="max-h-48 overflow-y-auto no-scrollbar py-1">
                                    {workspaces.map((ws) => (
                                        <button
                                            key={ws.id}
                                            onClick={() => {
                                                setCurrentWorkspace(ws);
                                                setWorkspaceOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-3 py-2 hover:bg-surface-glass transition-colors ${currentWorkspace?.id === ws.id ? 'bg-surface-glass text-brand-primary' : 'text-text-primary'}`}
                                        >
                                            <span className="text-sm font-bold truncate">{ws.name}</span>
                                            {currentWorkspace?.id === ws.id && <Check className="w-4 h-4 shrink-0" />}
                                        </button>
                                    ))}
                                    {workspaces.length === 0 && (
                                        <div className="px-3 py-4 text-center">
                                            <p className="text-[10px] text-text-muted font-bold mb-1">لا توجد مساحات عمل</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-1 border-t border-border-subtle">
                                    <button
                                        onClick={() => {
                                            setWorkspaceOpen(false);
                                            setShowCreateModal(true);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-brand-primary/10 text-brand-primary transition-colors rounded-lg"
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        <span className="text-sm font-bold">إنشاء مساحة جديدة</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 space-y-2 text-right overflow-y-auto no-scrollbar pb-6">

                {/* عناصر العضو */}
                {navItems.map((item: { name: string; icon: React.ElementType; href: string; permission?: string }) => {
                    // Show item if no permission key is required OR user has permission OR is an admin
                    const hasPermission = !item.permission || (permissions && permissions[item.permission] === true);
                    const shouldShow = hasPermission || isAdmin;
                    
                    if (!shouldShow) return null;
                    return <NavLink key={item.href} item={item} />;
                })}

                {/* قسم الأدمن */}
                {isAdmin && (
                    <div className="pt-8">
                        {!isSidebarCollapsed && (
                            <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4 select-none animate-in fade-in">
                                أدوات متقدمة
                            </p>
                        )}
                        {isSidebarCollapsed && <div className="h-px w-full bg-white/5 my-4" />}

                        {adminItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href} className="w-full block" title={isSidebarCollapsed ? item.name : undefined}>
                                    <motion.div
                                        whileHover={{ x: isSidebarCollapsed ? 0 : -4 }}
                                        className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0 py-3' : 'justify-start gap-4 px-4 py-3'} rounded-xl transition-all group border ${isActive
                                            ? 'bg-brand-secondary/10 border-brand-secondary/20 text-brand-secondary'
                                            : 'border-transparent text-text-muted hover:text-text-primary hover:bg-surface-glass'
                                            }`}
                                    >
                                        <item.icon className={`w-5 h-5 ${isActive ? 'text-brand-secondary' : 'text-text-muted group-hover:text-brand-secondary'}`} />
                                        {!isSidebarCollapsed && <span className="font-bold text-sm">{item.name}</span>}
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </nav>

            {/* Profile Footer */}
            <div className={`mt-auto pt-6 border-t border-border-subtle relative ${isSidebarCollapsed ? 'flex justify-center' : ''}`} ref={profileRef}>

                {isLoading ? (
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-raised border border-border-subtle animate-pulse">
                        <div className="w-8 h-8 rounded-lg bg-border-subtle" />
                        {!isSidebarCollapsed && (
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-20 bg-border-subtle rounded" />
                                <div className="h-2 w-16 bg-border-subtle rounded" />
                            </div>
                        )}
                    </div>
                ) : isLoggedIn ? (
                    <>
                        {/* Profile Dropdown */}
                        <AnimatePresence>
                            {profileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute bottom-full mb-2 left-0 right-0 bg-surface-raised border border-border-strong rounded-2xl overflow-hidden shadow-2xl z-50"
                                >
                                    <Link
                                        href="/pro/dashboard"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-surface-glass transition-colors text-text-primary"
                                    >
                                        <LayoutGrid className="w-4 h-4 text-brand-primary" />
                                        {!isSidebarCollapsed && <span className="text-sm font-bold">لوحة التحكم</span>}
                                    </Link>
                                    <Link
                                        href="/pro/extensions"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-surface-glass transition-colors text-text-primary border-t border-border-subtle"
                                    >
                                        <Puzzle className="w-4 h-4 text-brand-primary" />
                                        {!isSidebarCollapsed && <span className="text-sm font-bold">الامتدادات</span>}
                                    </Link>
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-colors text-text-muted hover:text-red-500 border-t border-border-subtle"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        {!isSidebarCollapsed && <span className="text-sm font-bold">تسجيل الخروج</span>}
                                    </button>

                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Profile Card */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setProfileOpen(!profileOpen)}
                            className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-2xl bg-surface-raised hover:bg-surface-glass transition-all cursor-pointer border border-border-subtle group`}
                        >
                            {!isSidebarCollapsed && (
                                <div className="flex-1 text-right">
                                    <p className="text-xs font-black text-text-primary group-hover:text-brand-primary transition-colors truncate max-w-[120px]">
                                        {session?.user?.name || 'مستخدم'}
                                    </p>
                                    <p className="text-[9px] text-brand-secondary font-bold uppercase tracking-widest flex items-center gap-1">
                                        {session?.user?.isPro ? 'عضوية برو' : 'الخطة المجانية'}
                                        {workspaceRole && (
                                            <>
                                                <span className="text-white/20">|</span>
                                                <span className="text-brand-primary">{
                                                    workspaceRole === 'OWNER' ? 'مالك' : 
                                                    workspaceRole === 'ADMIN' ? 'مدير' : 'عضو'
                                                }</span>
                                            </>
                                        )}
                                    </p>
                                </div>
                            )}
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-blue-600 flex items-center justify-center text-white shadow-lg shadow-brand-primary/20 overflow-hidden shrink-0">
                                {session?.user?.image ? (
                                    <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-5 h-5" />
                                )}
                            </div>
                        </motion.div>
                    </>
                ) : (
                    <Link
                        href="/auth"
                        className={`w-full flex items-center justify-center ${isSidebarCollapsed ? 'p-3' : 'gap-2 py-3'} bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/20 transition-all`}
                    >
                        {isSidebarCollapsed ? <User className="w-5 h-5" /> : <span>تسجيل الدخول</span>}
                    </Link>
                )}
            </div>

            <CreateWorkspaceModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </aside>
    );
};

export default Sidebar;
