"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function GlobalFooter() {
    const pathname = usePathname();

    // Hide footer on Admin, Beta, and Home pages where they have their own layouts
    if (pathname === '/' || pathname?.startsWith('/admin') || pathname?.startsWith('/beta')) {
        return null;
    }

    return <Footer />;
}
