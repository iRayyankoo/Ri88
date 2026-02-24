"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmailAction } from "@/actions/auth";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("جاري تفعيل الحساب...");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("رابط تفعيل مفقود أو غير صالح.");
            return;
        }

        verifyEmailAction(token).then((res) => {
            if (res.error) {
                setStatus("error");
                setMessage(res.error);
            } else if (res.success) {
                setStatus("success");
                setMessage(res.success);
            }
        }).catch(() => {
            setStatus("error");
            setMessage("حدث خطأ في الاتصال بالخادم.");
        });
    }, [token]);

    return (
        <div className="fixed inset-0 bg-[#030303] flex items-center justify-center p-4 font-cairo z-[9999]" dir="rtl">
            {/* Background elements to match AuthPages */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] opacity-10 bg-brand-primary" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-md bg-[#0A0A0C]/80 backdrop-blur-3xl border border-white/10 p-8 rounded-[36px] shadow-2xl text-center shadow-brand-primary/10"
            >
                <div className="mb-8 flex justify-center">
                    {status === "loading" && (
                        <div className="w-20 h-20 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center animate-pulse">
                            <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                        </div>
                    )}
                    {status === "success" && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        </motion.div>
                    )}
                    {status === "error" && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                            <XCircle className="w-10 h-10 text-rose-500" />
                        </motion.div>
                    )}
                </div>

                <h1 className="text-2xl font-black text-white mb-4">
                    {status === "loading" ? "جاري التفعيل..." : status === "success" ? "تم التفعيل!" : "فشل التفعيل"}
                </h1>

                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                    {message}
                </p>

                {(status === "success" || status === "error") && (
                    <button
                        onClick={() => router.push('/auth')}
                        className="w-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-3 group"
                    >
                        المتابعة إلى صفحة الدخول
                        <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                )}
            </motion.div>
        </div>
    );
}
