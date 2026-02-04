"use client";
import React from 'react';
import { NavigationProvider } from '@/context/NavigationContext';
import Home from '../page';

export default function ProPage() {
    // We wrap it in a provider again or use the existing one if layout handles it.
    // Since layout.tsx already has the provider, we just render Home (which is our routing engine)
    return <Home />;
}
