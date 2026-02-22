"use client";
import { useNavigation } from '@/context/NavigationContext';
import { tools } from '@/data/tools';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

export const useVisitorLanding = () => {
    const { launchTool } = useNavigation();
    const router = useRouter();

    const popularTools = useMemo(() => tools.slice(0, 6), []);

    const scrollToBrowse = () => {
        window.scrollTo({ top: 800, behavior: 'smooth' });
    };

    const handleStartFree = () => {
        router.push('/auth');
    };

    return {
        popularTools,
        launchTool,
        scrollToBrowse,
        handleStartFree,
        // Expose item/container variants if needed by multiple components, 
        // otherwise they can stay in the component or be moved to a shared utils file.
        // For now, we will keep simple state/actions here.
    };
};
