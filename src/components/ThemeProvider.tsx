"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';
export type Accent = 'teal' | 'cobalt' | 'gold' | 'violet';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    accent: Accent;
    setAccent: (accent: Accent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('dark'); // Default to dark
    const [accent, setAccentState] = useState<Accent>('teal'); // Default to cyan teal

    const applyThemeToDOM = (t: Theme, a: Accent) => {
        document.documentElement.setAttribute('data-theme', t);
        document.documentElement.setAttribute('data-accent', a);
        if (t === 'light') {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        }
    };

    useEffect(() => {
        // Load theme from local storage
        const storedTheme = (localStorage.getItem('theme') as Theme) || 'dark';
        const storedAccent = (localStorage.getItem('accent') as Accent) || 'teal';
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTheme(storedTheme);
        setAccentState(storedAccent);
        applyThemeToDOM(storedTheme, storedAccent);
    }, []);

    const handleSetTheme = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        applyThemeToDOM(newTheme, accent);
    };

    const handleSetAccent = (newAccent: Accent) => {
        setAccentState(newAccent);
        localStorage.setItem('accent', newAccent);
        applyThemeToDOM(theme, newAccent);
    };

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        handleSetTheme(nextTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, toggleTheme, accent, setAccent: handleSetAccent }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
