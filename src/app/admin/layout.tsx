import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Secure the entire /admin route hierarchy
    if (!session || session.user.role !== "ADMIN") {
        redirect("/"); // Redirect unauthorized users to Homepage/Landing
    }

    return (
        <div className="min-h-screen bg-[#0A0A0C] text-slate-200">
            {children}
        </div>
    );
}
