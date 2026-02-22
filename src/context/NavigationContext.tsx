"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export type UserRole = 'visitor' | 'user' | 'admin';

interface NavigationContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: (status: boolean) => void;
    userRole: UserRole;
    setUserRole: (role: UserRole) => void;
    currentView: string;
    setCurrentView: (view: string) => void;
    activeToolId: string | null;
    launchTool: (toolId: string) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    openToolsInModal: boolean;
    setOpenToolsInModal: (enabled: boolean) => void;
    showToolPopup: boolean;
    setShowToolPopup: (show: boolean) => void;
    isSidebarCollapsed: boolean;
    setIsSidebarCollapsed: (isCollapsed: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
    const { data: session, status } = useSession();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRoleState] = useState<UserRole>('visitor'); // Default to visitor initially

    // Initialize from localStorage on mount
    useEffect(() => {
        const savedRole = localStorage.getItem('ri88-debug-role') as UserRole;
        if (savedRole && ['visitor', 'user', 'admin'].includes(savedRole)) {
            setUserRoleState(prev => prev !== savedRole ? savedRole : prev);
        }
    }, []);

    const setUserRole = (role: UserRole) => {
        setUserRoleState(role);
        localStorage.setItem('ri88-debug-role', role);
    };

    const [currentView, setCurrentView] = useState('landing');
    const [activeToolId, setActiveToolId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [openToolsInModal, setOpenToolsInModal] = useState(false);
    const [showToolPopup, setShowToolPopup] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Sync role with session ONLY when status or session changes, AND no manual override exists
    useEffect(() => {
        const hasManualOverride = typeof window !== 'undefined' && !!localStorage.getItem('ri88-debug-role');

        if (status === 'authenticated') {
            setIsLoggedIn(prev => !prev ? true : prev);
            const role = (session?.user?.role?.toLowerCase() as UserRole) || 'user';

            if (!hasManualOverride) {
                setUserRoleState(prev => prev !== role ? role : prev);
            }
        } else if (status === 'unauthenticated') {
            setIsLoggedIn(prev => prev ? false : prev);
            if (!hasManualOverride) {
                setUserRoleState(prev => prev !== 'visitor' ? 'visitor' : prev);
            }
        }
    }, [status, session]);

    const launchTool = (toolId: string) => {
        setActiveToolId(toolId);
        // Default to popup since Workspace section is removed
        setShowToolPopup(true);
    };

    return (
        <NavigationContext.Provider value={{
            isLoggedIn,
            setIsLoggedIn,
            userRole,
            setUserRole,
            currentView,
            setCurrentView,
            activeToolId,
            launchTool,
            isSidebarOpen,
            setIsSidebarOpen,
            openToolsInModal,
            setOpenToolsInModal,
            showToolPopup,
            setShowToolPopup,
            isSidebarCollapsed,
            setIsSidebarCollapsed
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
