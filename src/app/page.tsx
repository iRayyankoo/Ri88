"use client";
import React from 'react';
import { useNavigation } from '@/context/NavigationContext';
import VisitorLanding from '@/components/Pages/VisitorLanding';
import UserDashboard from '@/components/Pages/UserDashboard';
import ToolsDirectory from '@/components/Pages/ToolsDirectory';
import MultiWindowWorkspace from '@/components/Pages/MultiWindowWorkspace';
import AdminSuite from '@/components/Pages/AdminSuite';
import DeveloperPortal from '@/components/Pages/DeveloperPortal';
import ToolChainer from '@/components/Pages/ToolChainer';
import ComingSoonOverlay from '@/components/Pages/ComingSoonOverlay';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const { currentView, isLoggedIn, setIsLoggedIn, setCurrentView } = useNavigation();
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';

  // Unified rendering logic
  const renderContent = () => {
    switch (currentView) {
      case 'landing':
        return <VisitorLanding />;
      case 'dashboard':
        return <UserDashboard />;
      case 'directory':
        return <ToolsDirectory />;
      case 'workspace':
        return <MultiWindowWorkspace />;
      case 'admin':
        return <AdminSuite />;
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
      {!isPreview && <ComingSoonOverlay />}

      {renderContent()}

      {/* DEV FLOATING CONTROLS (Demo only) */}
      {isPreview && (
        <div className="fixed bottom-24 right-8 z-[100] flex flex-col gap-2">
          <button
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className="bg-brand-primary/20 hover:bg-brand-primary/40 text-[9px] text-brand-primary font-black uppercase tracking-widest px-4 py-2 rounded-full border border-brand-primary/20 transition-all backdrop-blur-xl"
          >
            {isLoggedIn ? 'تسجيل خروج (Mock)' : 'تسجيل دخول (Mock)'}
          </button>
        </div>
      )}
    </div>
  );
}
