"use client";
import React, { Suspense } from 'react';
import { useNavigation } from '@/context/NavigationContext';
import VisitorLanding from '@/components/Pages/VisitorLanding';
import UserDashboard from '@/components/Pages/UserDashboard';
import ToolsDirectory from '@/components/Pages/ToolsDirectory';
import ToolWorkspace from '@/components/Pages/ToolWorkspace';
import AdminSuite from '@/components/Pages/AdminSuite';
import DeveloperPortal from '@/components/Pages/DeveloperPortal';
import ToolChainer from '@/components/Pages/ToolChainer';
import VisitorToolPreview from '@/components/Pages/VisitorToolPreview';
import PlanComparison from '@/components/Pages/PlanComparison';
import CheckoutPage from '@/components/Pages/CheckoutPage';
import AddonsStore from '@/components/Pages/AddonsStore';
import MyExtensions from '@/components/Pages/MyExtensions';
import WalletActivity from '@/components/Pages/WalletActivity';
import ToolSubmission from '@/components/Pages/ToolSubmission';
import APIDocs from '@/components/Pages/APIDocs';
import ErrorLogs from '@/components/Pages/ErrorLogs';
import AuthPages from '@/components/Pages/AuthPages';
import GlobalSettings from '@/components/Pages/GlobalSettings';
import SplashScreen from '@/components/Pages/SplashScreen';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import UserManagement from '@/components/Pages/UserManagement';
import ServerMonitoring from '@/components/Pages/ServerMonitoring';
import SystemChangelog from '@/components/Pages/SystemChangelog';

function HomeContent() {
    const { currentView, isLoggedIn, setIsLoggedIn, setCurrentView } = useNavigation();
    const searchParams = useSearchParams();
    const isPreview = searchParams.get('preview') === 'true';
    const [showSplash, setShowSplash] = useState(true);

    // Splash Screen Logic
    useEffect(() => {
        // Only show splash once per session (simulated)
        const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
        if (hasSeenSplash) {
            setShowSplash(false);
        }
    }, []);

    const handleSplashComplete = () => {
        setShowSplash(false);
        sessionStorage.setItem('hasSeenSplash', 'true');
    };

    // Unified rendering logic
    const renderContent = () => {
        switch (currentView) {
            case 'landing':
                return <VisitorLanding />;
            case 'visitor-preview':
                return <VisitorToolPreview />;
            case 'plans':
                return <PlanComparison />;
            case 'checkout':
                return <CheckoutPage />;
            case 'store':
                return <AddonsStore />;
            case 'extensions':
                return <MyExtensions />;
            case 'wallet':
                return <WalletActivity />;
            case 'submit-tool':
                return <ToolSubmission />;
            case 'api-docs':
                return <APIDocs />;
            case 'error-logs':
                return <ErrorLogs />;
            case 'auth':
                return <AuthPages />;
            case 'settings':
                return <GlobalSettings />;
            case 'dashboard':
                return <UserDashboard />;

            // Admin Routes
            case 'admin':
                return <AdminSuite />;
            case 'admin-users':
                return <UserManagement />;
            case 'admin-server':
                return <ServerMonitoring />;
            case 'admin-changelog':
                return <SystemChangelog />;

            case 'directory':
                return <ToolsDirectory />;
            case 'workspace':
                return <ToolWorkspace />;
            case 'dev':
                return <DeveloperPortal />;
            case 'chainer':
                return <ToolChainer />;
            default:
                return <VisitorLanding />;
        }
    };

    return (
        <div className="min-h-full">
            {/* SPLASH SCREEN OVERLAY */}
            <AnimatePresence>
                {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
            </AnimatePresence>

            {renderContent()}

            {/* DEV FLOATING CONTROLS (Demo only) */}
            <div className="fixed bottom-24 right-8 z-[100] flex flex-col gap-2">
                <button
                    onClick={() => setIsLoggedIn(!isLoggedIn)}
                    className="bg-brand-primary/20 hover:bg-brand-primary/40 text-[9px] text-brand-primary font-black uppercase tracking-widest px-4 py-2 rounded-full border border-brand-primary/20 transition-all backdrop-blur-xl"
                >
                    {isLoggedIn ? 'تسجيل خروج (Mock)' : 'تسجيل دخول (Mock)'}
                </button>
            </div>
        </div>
    );
}

export default function Home() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-brand-bg" />}>
            <HomeContent />
        </Suspense>
    );
}
