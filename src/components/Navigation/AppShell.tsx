"use client";
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';
import FloatingAssistant from '../AIAssistant/FloatingAssistant';
import { useNavigation } from '@/context/NavigationContext';

interface AppShellProps {
    children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
    const { currentView } = useNavigation();

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

export default AppShell;
