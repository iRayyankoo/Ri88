import React from "react";
import AppShell from "@/components/Navigation/AppShell";
import { NavigationProvider } from "@/context/NavigationContext";

export default function ProLayout({ children }: { children: React.ReactNode }) {
    return (
        <NavigationProvider>
            <AppShell>
                {children}
            </AppShell>
        </NavigationProvider>
    );
}
