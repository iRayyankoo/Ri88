
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    Sparkles
} from "lucide-react";


export function Sidebar({ user }: { user: any }) {
    const pathname = usePathname();

    const links = [
        { href: "/dashboard", label: "نظرة عامة", icon: LayoutDashboard },
        { href: "/dashboard/saved", label: "المحفوظات", icon: FileText },
        { href: "/dashboard/settings", label: "الإعدادات", icon: Settings },
    ];

    return (
        <div className="h-full flex flex-col p-6">
            {/* Brand */}
            <div className="mb-10 px-2">
                <h2 className="text-2xl font-black tracking-tighter">Ri88<span className="text-brand-primary">.Pro</span></h2>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile */}
            <div className="border-t border-white/10 pt-6 mt-6">
                <div className="flex items-center gap-3 mb-4 px-2">
                    {user.image ? (
                        <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full border border-white/10" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg font-bold">
                            {user.name?.[0] || "U"}
                        </div>
                    )}
                    <div className="flex-1 overflow-hidden">
                        <p className="font-bold truncate text-sm">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                </div>

                <Link
                    href="/api/auth/signout"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
                >
                    <LogOut className="w-4 h-4" />
                    تسجيل الخروج
                </Link>
            </div>
        </div>
    );
}
