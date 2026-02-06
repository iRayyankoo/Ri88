"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ViewType = 'landing' | 'dashboard' | 'directory' | 'workspace' | 'admin' | 'dev' | 'chainer' | 'visitor-preview' | 'plans' | 'store' | 'extensions' | 'wallet' | 'favorites' | 'settings' | 'categories' | 'submit-tool' | 'api-docs' | 'error-logs' | 'auth' | 'admin-users' | 'admin-server' | 'admin-changelog' | 'checkout' | 'notifications';

interface NavigationContextType {
    currentView: ViewType;
    setCurrentView: (view: ViewType) => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (status: boolean) => void;
    activeToolId: string | null;
    launchTool: (toolId: string) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    openToolsInModal: boolean;
    setOpenToolsInModal: (enabled: boolean) => void;
    showToolPopup: boolean;
    setShowToolPopup: (show: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
    const [currentView, setCurrentView] = useState<ViewType>('landing');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeToolId, setActiveToolId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [openToolsInModal, setOpenToolsInModal] = useState(false);
    const [showToolPopup, setShowToolPopup] = useState(false);

    const launchTool = (toolId: string) => {
        setActiveToolId(toolId);
        // Default to popup since Workspace section is removed
        setShowToolPopup(true);
    };

    return (
        <NavigationContext.Provider value={{
            currentView,
            setCurrentView,
            isLoggedIn,
            setIsLoggedIn,
            activeToolId,
            launchTool,
            isSidebarOpen,
            setIsSidebarOpen,
            openToolsInModal,
            setOpenToolsInModal,
            showToolPopup,
            setShowToolPopup
        }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
};
