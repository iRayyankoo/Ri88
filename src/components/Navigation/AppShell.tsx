"use client";
import React, { Suspense } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';
import FloatingAssistant from '../AIAssistant/FloatingAssistant';
import { useNavigation } from '@/context/NavigationContext';
import { useSearchParams } from 'next/navigation';

interface AppShellProps {
    children: React.ReactNode;
}

const AppShellContent: React.FC<AppShellProps> = ({ children }) => {
    const { currentView } = useNavigation();
    const searchParams = useSearchParams();
    const isPreview = searchParams.get('preview') === 'true';

    // If not in preview mode, we hide the structural elements
    if (!isPreview) {
        return (
            <div className="min-h-screen bg-brand-bg text-slate-100 flex overflow-hidden lg:flex-row-reverse" dir="rtl">
                <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth relative">
                    {children}
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-bg text-slate-100 flex overflow-x-hidden lg:flex-row-reverse" dir="rtl">

            {/* Desktop Sidebar (Right side for RTL) */}
            <Sidebar />

            {/* Main Container */}
            <div className="flex-1 flex flex-col min-h-screen relative">

                {/* Global Header */}
                <Header />

                {/* Dynamic Content Area */}
                <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth relative z-10">
                    <div className="max-w-[1600px] mx-auto p-6 lg:p-12 pb-44 lg:pb-24">
                        {children}
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
        <Suspense fallback={<div className="min-h-screen bg-brand-bg" />}>
            <AppShellContent {...props} />
        </Suspense>
    );
};

export default AppShell;
