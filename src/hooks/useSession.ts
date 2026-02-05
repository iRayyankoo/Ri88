import { useState, useEffect } from 'react';

export function useSession<T>(key: string, initialValue: T) {
    // 1. Initial State Load
    const [state, setState] = useState<T>(() => {
        if (typeof window === 'undefined') return initialValue;
        try {
            const saved = localStorage.getItem(`ri88_session_${key}`);
            return saved ? JSON.parse(saved) : initialValue;
        } catch (error) {
            console.error("Error loading session:", error);
            return initialValue;
        }
    });

    // 2. Auto-save on change
    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem(`ri88_session_${key}`, JSON.stringify(state));
            }
        } catch (error) {
            console.error("Error saving session:", error);
        }
    }, [key, state]);

    return [state, setState] as const;
}
