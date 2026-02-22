"use client";

import { Toaster as Sonner } from "sonner";

export function CinematicToaster() {
    return (
        <Sonner
            theme="dark"
            richColors
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast: "group-[.toaster]:bg-[#0A0A0C] group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl group-[.toaster]:font-cairo",
                    description: "group-[.toast]:text-slate-400",
                    actionButton: "group-[.toast]:bg-brand-primary group-[.toast]:text-white",
                    cancelButton: "group-[.toast]:bg-white/10 group-[.toast]:text-slate-300",
                },
            }}
            position="top-center"
            dir="rtl"
            style={{
                zIndex: 9999999, // Ensure this is higher than anything else
                position: 'fixed',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)'
            }}
        />
    );
}
