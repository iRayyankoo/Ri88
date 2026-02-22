
import { LoginForm } from "@/components/auth/LoginForm";
import { Suspense } from "react";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0B0C10]">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Ri88</h1>
                    <p className="text-slate-400">سجل الدخول للمتابعة إلى لوحة التحكم</p>
                </div>

                <Suspense fallback={<div className="text-white text-center">جاري التحميل...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
