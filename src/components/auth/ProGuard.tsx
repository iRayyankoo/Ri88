
"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { Lock, Crown, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ProGuardProps {
    children: React.ReactNode;
}

export default function ProGuard({ children }: ProGuardProps) {
    const { data: session, status } = useSession();
    // Safety timeout to prevent infinite loading
    const [isTimeout, setIsTimeout] = React.useState(false);

    React.useEffect(() => {
        if (status === 'loading') {
            const timer = setTimeout(() => setIsTimeout(true), 3000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const isLoading = status === 'loading' && !isTimeout;
    const isPro = session?.user?.isPro;

    if (isLoading) {
        return (
            <div className="h-[400px] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!session || !isPro) {
        return (
            <div className="relative group bg-black/40 backdrop-blur-md border border-white/10 rounded-[32px] p-12 text-center overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 opacity-50 transition-opacity group-hover:opacity-100" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-white/5 rounded-[24px] flex items-center justify-center border border-white/10 mb-8 shadow-inner">
                        {session ? <Crown className="w-10 h-10 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]" /> : <Lock className="w-10 h-10 text-slate-500" />}
                    </div>

                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight">هذه الأداة للمحترفين فقط 🚀</h2>
                    <p className="text-slate-400 max-w-sm mx-auto mb-10 font-medium leading-relaxed">
                        {session
                            ? "اشترك في الباقة الاحترافية للحصول على وصول غير محدود لهذه الأداة وكافة المميزات المتقدمة."
                            : "سجل دخولك واشترك لتتمكن من استخدام هذه الأداة وحفظ نتائجك في السجل."}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                        <Link href="/pricing" className="flex-1 h-14 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-brand-primary/25">
                            ترقية الحساب الآن
                            <Crown size={18} />
                        </Link>
                        {!session && (
                            <Link href="/login" className="flex-1 h-14 bg-white/5 border border-white/10 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                                تسجيل الدخول
                                <ArrowRight size={18} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
