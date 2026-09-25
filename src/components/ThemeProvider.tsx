"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('dark'); // Default to dark

    const applyThemeToDOM = (t: Theme) => {
        document.documentElement.setAttribute('data-theme', t);
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
        const storedTheme = localStorage.getItem('theme') as Theme;
        if (storedTheme) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTheme(storedTheme);
            applyThemeToDOM(storedTheme);
        } else {
            // Apply default dark theme to HTML tag
            applyThemeToDOM('dark');
        }
    }, []);

    const handleSetTheme = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        applyThemeToDOM(newTheme);
    };

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        handleSetTheme(nextTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, toggleTheme }}>
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
