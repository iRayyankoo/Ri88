"use client";
import React, { Suspense } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileHeader from './MobileHeader';
import BottomNav from './BottomNav';
import FloatingAssistant from '../AIAssistant/FloatingAssistant';

interface AppShellProps {
    children: React.ReactNode;
}

const AppShellContent: React.FC<AppShellProps> = ({ children }) => {
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
                    <div className="w-full mx-auto min-h-full flex flex-col">
                        {children}
                        {/* Force Scroll Spacer for Mobile */}
                        <div className="lg:hidden h-24 w-full shrink-0" aria-hidden="true" />
                    </div>
                </main>

                {/* AI Assistant Floating Panel */}
                <FloatingAssistant />

                {/* Mobile Bottom Navigation */}
                <BottomNav />
            </div>

        </div>
    );
};

const AppShell: React.FC<AppShellProps> = (props) => {
    return (
        <Suspense fallback={<div className="min-h-screen bg-brand-bg flex items-center justify-center text-brand-primary">Loading RI88 PRO...</div>}>
            <AppShellContent {...props} />
        </Suspense>
    );
};

export default AppShell;
