"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface FavoritesContextType {
    favorites: string[];
    isFavorite: (toolId: string) => boolean;
    toggleFavorite: (toolId: string, toolTitle?: string) => Promise<boolean>;
    isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'ri88_favorites';

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const { status } = useSession();
    const isLoggedIn = status === 'authenticated';
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Initial Load: from localStorage first
    useEffect(() => {
        try {
            const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setFavorites(parsed);
                }
            }
        } catch (e) {
            console.error('Error reading favorites from localStorage', e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 2. When logged in: Fetch cloud favorites and sync local ones
    useEffect(() => {
        if (!isLoggedIn) return;

        let isMounted = true;
        const syncCloud = async () => {
            try {
                // Get local favorites to merge
                const localStored = localStorage.getItem(LOCAL_STORAGE_KEY);
                const localIds: string[] = localStored ? JSON.parse(localStored) : [];

                if (localIds.length > 0) {
                    // Sync local to cloud
                    const syncRes = await fetch('/api/favorites', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ toolIds: localIds })
                    });
                    if (syncRes.ok) {
                        const data = await syncRes.json();
                        if (isMounted && data.favorites) {
                            setFavorites(data.favorites);
                            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.favorites));
                            return;
                        }
                    }
                }

                // If no local to sync, just fetch cloud favorites
                const res = await fetch('/api/favorites');
                if (res.ok) {
                    const data = await res.json();
                    if (isMounted && data.favorites) {
                        setFavorites(data.favorites);
                        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.favorites));
                    }
                }
            } catch (err) {
                console.error('Failed to sync cloud favorites', err);
            }
        };

        syncCloud();
        return () => { isMounted = false; };
    }, [isLoggedIn]);

    // Check if tool is favorited
    const isFavorite = useCallback((toolId: string) => {
        return favorites.includes(toolId);
    }, [favorites]);

    // Toggle favorite
    const toggleFavorite = useCallback(async (toolId: string, toolTitle?: string): Promise<boolean> => {
        const currentlyFav = favorites.includes(toolId);
        const willBeFav = !currentlyFav;

        // Optimistic update
        const updatedFavorites = willBeFav
            ? [...favorites, toolId]
            : favorites.filter(id => id !== toolId);

        setFavorites(updatedFavorites);
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedFavorites));
        } catch (e) {
            console.error('Error writing to localStorage', e);
        }

        // Show friendly feedback
        const name = toolTitle ? `"${toolTitle}"` : 'الأداة';
        if (willBeFav) {
            toast.success(`تمت إضافة ${name} إلى المفضلة ⭐`);
        } else {
            toast.info(`تمت إزالة ${name} من المفضلة`);
        }

        // If logged in, sync with cloud API
        if (isLoggedIn) {
            try {
                const res = await fetch('/api/favorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ toolId, action: willBeFav ? 'add' : 'remove' })
                });

                if (!res.ok) {
                    // Revert on failure
                    console.error('Cloud favorite sync failed');
                }
            } catch (err) {
                console.error('Failed to send favorite to server', err);
            }
        }

        return willBeFav;
    }, [favorites, isLoggedIn]);

    return (
        <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, isLoading }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
