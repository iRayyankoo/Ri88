"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
    Activity, ArrowRight, Grid, Layout, Star,
    Settings, Search, Bell, User, Zap, Terminal, Code,
    FileText, Calculator, Image as ImageIcon, Briefcase,
    TrendingUp, Shield, HelpCircle
} from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';

// Reusable Premium Glass Card Component
const GlassCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.1)" }}
        className={`bg-[#13131A] backdrop-blur-xl border border-white/5 rounded-[24px] p-6 transition-all relative overflow-hidden ${className}`}
    >
        {children}
    </motion.div>
);

const UserDashboard = () => {
    const { setCurrentView, launchTool } = useNavigation();

    return (
        <div className="space-y-8 pb-10">

            {/* HERO SECTION */}
            <GlassCard className="bg-gradient-to-r from-brand-primary/10 to-transparent p-10">
                <div className="max-w-2xl relative z-10 space-y-6">
                    <div>
                        <h2 className="text-3xl lg:text-4xl font-black text-white mb-2 leading-tight">
                            مرحباً بك في لوحة تحكم <span className="text-brand-primary">RI88 PRO</span>
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
                            قم بإدارة أدواتك الذكية، متابعة استهلاك الخوادم، وإنشاء سلاسل أتمتة متقدمة من مكان واحد.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => setCurrentView('directory')}
                            className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/30 transition-all active:scale-95"
                        >
                            تصفح الأدوات
                        </button>
                        <button
                            onClick={() => setCurrentView('chainer')}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
                        >
                            إنشاء سلسلة (Chain)
                        </button>
                    </div>
                </div>
                {/* Visual Decorative Element */}
                <div className="absolute left-0 top-0 w-80 h-80 bg-brand-primary/20 blur-[100px] rounded-full -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            </GlassCard>

            {/* DASHBOARD GRID */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* COLUMN 1: TOP TOOLS */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-xs font-black tracking-widest uppercase text-slate-500">الأدوات الشائعة</h3>
                        <button onClick={() => setCurrentView('directory')} className="text-[10px] text-brand-primary font-bold hover:underline">عرض الكل</button>
                    </div>
                    <GlassCard delay={0.1} className="min-h-[300px]">
                        <div className="space-y-3">
                            {[
                                { title: 'تحويل العملات', icon: Activity, id: 'currency-converter' },
                                { title: 'تحويل PDF إلى Excel', icon: FileText, id: 'pdf-to-excel' },
                                { title: 'منسق JSON', icon: Code, id: 'json-formatter' },
                                { title: 'ضغط الصور', icon: ImageIcon, id: 'image-compressor' }
                            ].map((tool, i) => (
                                <button
                                    key={i}
                                    onClick={() => launchTool(tool.id)} // Assuming IDs might match or handled
                                    className="w-full flex items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-brand-primary/30 transition-all group group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                                            <tool.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-bold text-white text-right">{tool.title}</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-brand-primary rtl:rotate-180 transition-colors" />
                                </button>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* COLUMN 2: ANALYTICS */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black tracking-widest uppercase text-slate-500 px-2">إحصائيات الاستخدام</h3>
                    <GlassCard delay={0.2} className="h-full min-h-[300px] flex flex-col justify-center gap-8">
                        <div className="space-y-6">
                            {/* Stat 1 */}
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-3 text-slate-400">
                                    <span>الأدوات المالية</span>
                                    <span className="text-white">84%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "84%" }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-full bg-brand-primary shadow-[0_0_15px_rgba(139,92,246,0.5)] rounded-full"
                                    />
                                </div>
                            </div>

                            {/* Stat 2 */}
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-3 text-slate-400">
                                    <span>سلاسل الأتمتة</span>
                                    <span className="text-white">42%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "42%" }}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                        className="h-full bg-brand-secondary shadow-[0_0_15px_rgba(34,211,238,0.5)] rounded-full"
                                    />
                                </div>
                            </div>

                            {/* Stat 3 */}
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-3 text-slate-400">
                                    <span>معالجة النصوص</span>
                                    <span className="text-white">65%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "65%" }}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                                        className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* COLUMN 3: SHORTCUTS */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black tracking-widest uppercase text-slate-500 px-2">روابط سريعة</h3>
                    <GlassCard delay={0.3} className="min-h-[300px]">
                        <div className="grid grid-cols-2 gap-4 h-full">
                            {[
                                { label: 'تطبيق جديد', icon: Layout, action: 'submit-tool' },
                                { label: 'النشر', icon: RocketIcon, action: 'admin-server' }, // RocketIcon wrapper below
                                { label: 'السجلات', icon: Terminal, action: 'error-logs' },
                                { label: 'مفاتيح API', icon: Shield, action: 'settings' },
                            ].map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentView(item.action as any)}
                                    className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-brand-primary/50 hover:bg-white/10 transition-all cursor-pointer group aspect-square"
                                >
                                    <div className="text-slate-500 group-hover:text-brand-primary mb-3 transition-colors">
                                        <item.icon className="w-8 h-8" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

// Helper for icon mapped manually if needed, or stick to import
const RocketIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>
);

export default UserDashboard;
