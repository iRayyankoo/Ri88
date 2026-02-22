"use client";
import React from 'react';
import AuthPages from '@/components/Pages/AuthPages';
import { NavigationProvider } from "@/context/NavigationContext";

export default function AuthPage() {
    return (
        <NavigationProvider>
            <AuthPages />
        </NavigationProvider>
    );
}
