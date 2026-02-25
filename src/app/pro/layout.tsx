import React from "react";
import AppShell from "@/components/Navigation/AppShell";

export default function ProLayout({ children }: { children: React.ReactNode }) {
    return (
        <AppShell>
            {children}
        </AppShell>
    );
}
