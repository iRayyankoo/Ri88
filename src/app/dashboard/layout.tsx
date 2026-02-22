
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex h-screen bg-[#0B0C10] text-white overflow-hidden" dir="rtl">
            {/* Sidebar */}
            <aside className="w-64 border-l border-white/10 hidden md:block">
                <Sidebar user={session.user} />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
