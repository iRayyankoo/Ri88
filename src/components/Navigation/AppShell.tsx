"use client";
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileHeader from './MobileHeader';
import BottomNav from './BottomNav';
import ToolPopup from '../ToolPopup';
import { useNavigation } from '@/context/NavigationContext';

interface AppShellProps {
    children: React.ReactNode;
}

// Role-Based Page Imports (Lazy Loaded)
const VisitorLanding = dynamic(() => import('../Pages/VisitorLanding'), {
    loading: () => <div className="h-screen w-full flex items-center justify-center text-slate-500">جاري تحميل الزائر...</div>
});

const AdminSuite = dynamic(() => import('../Pages/AdminSuite'), {
    loading: () => <div className="h-screen w-full flex items-center justify-center text-slate-500">جاري تحميل لوحة الإدارة...</div>
});

const AppShell: React.FC<AppShellProps> = ({ children }) => {
    const { userRole } = useNavigation();

    // 1. VISITOR PERSPECTIVE
    if (userRole === 'visitor') {
        return (
            <div className="min-h-screen bg-black overflow-x-hidden" dir="rtl">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
                    <Suspense fallback={null}>
                        <VisitorLanding />
                    </Suspense>
                </div>
                <ToolPopup />
            </div>
        );
    }

    // 2. ADMIN PERSPECTIVE
    if (userRole === 'admin') {
        return (
            <div className="min-h-screen flex overflow-hidden relative" dir="rtl">
                <Sidebar />
                <div className="flex-1 flex flex-col h-screen relative z-10 overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto lg:custom-scrollbar no-scrollbar scroll-smooth relative p-4 lg:p-10 pb-40">
                        <Suspense fallback={null}>
                            <AdminSuite />
                        </Suspense>
                    </main>
                </div>
            </div>
        );
    }

    // 3. USER PERSPECTIVE (Default)
    return (
        <div className="min-h-screen flex overflow-hidden relative" dir="rtl">

            {/* BACKGROUND EFFECTS */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-primary/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-brand-secondary/5 blur-[100px] rounded-full mix-blend-screen" />
            </div>

            {/* Desktop Sidebar (Right side for RTL) - Hidden on Mobile */}
            <Sidebar />

            {/* Main Container */}
            <div className="flex-1 flex flex-col h-screen relative z-10 overflow-hidden">
                {/* Mobile Header (Visible < lg) */}
                <MobileHeader />

                {/* Desktop Header (Visible >= lg) */}
                <Header />

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto lg:custom-scrollbar no-scrollbar scroll-smooth relative p-4 lg:p-10 pb-40">
                    <div className="w-full max-w-[1600px] mx-auto min-h-full flex flex-col">
                        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-slate-500 animate-pulse">جاري التحميل...</div>}>
                            {children}
                        </Suspense>
                        {/* Force Scroll Spacer for Mobile */}
                        <div className="lg:hidden h-24 w-full shrink-0" aria-hidden="true" />
                    </div>
                </main>

                {/* Tool Launcher Modal */}
                <ToolPopup />

                {/* Mobile Bottom Navigation */}
                <BottomNav />
            </div>

        </div>
    );
};

export default AppShell;
