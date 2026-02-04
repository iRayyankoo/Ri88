"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

type ViewType = 'landing' | 'dashboard' | 'directory' | 'workspace' | 'admin' | 'dev' | 'chainer' | 'favorites' | 'settings' | 'categories';

interface NavigationContextType {
    currentView: ViewType;
    setCurrentView: (view: ViewType) => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (status: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
    const [currentView, setCurrentView] = useState<ViewType>('landing');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <NavigationContext.Provider value={{ currentView, setCurrentView, isLoggedIn, setIsLoggedIn }}>
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
