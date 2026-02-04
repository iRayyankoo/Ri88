"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    BarChart3,
    Settings,
    ArrowUpRight,
    Clock,
    Play,
    Share2,
    Download,
    Terminal,
    Layers
} from 'lucide-react';
import { tools } from '@/data/tools';
import { useNavigation } from '@/context/NavigationContext';

const UserDashboard = () => {
    const { setCurrentView } = useNavigation();
    const topTools = tools.slice(0, 4);

    const analytics = [
        { name: 'معالجة البيانات', usage: 78, color: 'bg-brand-primary' },
        { name: 'استهلاك الـ API', usage: 45, color: 'bg-brand-secondary' },
        { name: 'التخزين السحابي', usage: 92, color: 'bg-orange-500' },
    ];

    const quickActions = [
        { title: 'تحويل سريع', icon: Zap, color: 'text-brand-secondary', id: 'workspace' },
        { title: 'دليل الأدوات', icon: Share2, color: 'text-brand-primary', id: 'directory' },
        { title: 'محطة العمل', icon: Terminal, color: 'text-slate-400', id: 'workspace' },
        { title: 'أتمتة الأدوات', icon: Layers, color: 'text-orange-500', id: 'chainer' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-10"
        >

            {/* TOP ROW: WELCOME & QUICK ACTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Welcome Section */}
                <motion.div variants={itemVariants} className="lg:col-span-8 relative overflow-hidden rounded-[32px] bg-gradient-to-br from-brand-card to-brand-primary/10 p-10 border border-white/5 shadow-2xl">
                    <div className="relative z-10 space-y-4">
                        <h2 className="text-3xl font-black text-white">طابت أوقاتك، رياّن 👋</h2>
                        <p className="text-slate-400 font-medium max-w-lg">مرحباً بك مجدداً في مركز التحكم الخاص بك. لديك <span className="text-brand-primary">12 طلب</span> معلقة و <span className="text-brand-secondary">3 تقارير</span> جاهزة للتحميل.</p>
                        <div className="pt-4 flex gap-4">
                            <button
                                onClick={() => setCurrentView('workspace')}
                                className="bg-brand-primary text-white font-black px-8 py-3 rounded-xl transition-all shadow-xl shadow-brand-primary/20 active:scale-95 text-xs relative z-20"
                            >
                                فتح آخر أداة
                            </button>
                            <button
                                onClick={() => setCurrentView('directory')}
                                className="bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-3 rounded-xl transition-all border border-white/10 active:scale-95 text-xs relative z-20"
                            >
                                عرض السجل
                            </button>
                        </div>
                    </div>
                    <div className="absolute top-1/2 left-10 -translate-y-1/2 opacity-10 pointer-events-none">
                        <Zap className="w-48 h-48 text-brand-primary rotate-12" />
                    </div>
                </motion.div>

                {/* Quick Actions Grid */}
                <motion.div variants={itemVariants} className="lg:col-span-4 grid grid-cols-2 gap-4">
                    {quickActions.map((action, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentView(action.id as any)}
                            className="glass-card flex flex-col items-center justify-center p-6 gap-3 group hover:border-brand-primary/30 transition-all cursor-pointer relative z-20 overflow-hidden"
                        >
                            <div className={`w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                                <action.icon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-white transition-colors">{action.title}</span>
                        </button>
                    ))}
                </motion.div>
            </div>

            {/* SECOND ROW: TOP TOOLS & ANALYTICS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Top Tools List */}
                <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-white">الأدوات الأكثر استخداماً</h3>
                        <button onClick={() => setCurrentView('directory')} className="text-brand-primary text-xs font-bold hover:underline relative z-20">عرض الكل</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {topTools.map((tool) => (
                            <button
                                key={tool.id}
                                onClick={() => setCurrentView('workspace')}
                                className="glass-card p-6 flex items-center gap-6 group cursor-pointer hover:bg-brand-primary/5 transition-all w-full text-right relative z-20"
                            >
                                <div className="w-16 h-16 bg-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary shrink-0 group-hover:rotate-12 transition-transform">
                                    <Zap className="w-8 h-8" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="font-bold text-white group-hover:text-brand-primary transition-colors truncate">{tool.titleAr || tool.title}</h4>
                                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{tool.descAr || tool.desc}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-slate-600 group-hover:bg-brand-primary group-hover:text-white transition-all shrink-0">
                                    <Play className="w-4 h-4 fill-current" />
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Analytics Section */}
                <motion.div variants={itemVariants} className="lg:col-span-4 glass-card p-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-white">إحصائيات الاستخدام</h3>
                        <BarChart3 className="w-5 h-5 text-brand-secondary" />
                    </div>

                    <div className="space-y-6">
                        {analytics.map((item, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-slate-400">{item.name}</span>
                                    <span className="text-white">{item.usage}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.usage}%` }}
                                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                                        className={`h-full ${item.color} rounded-full shadow-[0_0_10px_rgba(139,92,246,0.3)]`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 p-4 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase">معدل الدقة</span>
                            <span className="text-lg font-black text-brand-secondary">99.8%</span>
                        </div>
                        <ArrowUpRight className="w-6 h-6 text-brand-secondary" />
                    </div>
                </motion.div>
            </div>

            {/* THIRD ROW: RECENT ACTIVITY (Placeholder) */}
            <motion.section variants={itemVariants} className="glass-card p-8">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-white">النشاط الأخير</h3>
                    <div className="flex gap-2">
                        <button className="p-2 bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors relative z-20"><Download className="w-4 h-4" /></button>
                        <button className="p-2 bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors relative z-20"><Settings className="w-4 h-4" /></button>
                    </div>
                </div>

                <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm text-white">تم معالجة "invoice_final.pdf"</span>
                                    <span className="text-[10px] text-slate-600 font-medium">منذ حولي 15 دقيقة</span>
                                </div>
                            </div>
                            <span className="text-[10px] font-black uppercase text-brand-secondary px-3 py-1 bg-brand-secondary/10 rounded-lg">ناجح</span>
                        </div>
                    ))}
                </div>
            </motion.section>

        </motion.div>
    );
};

export default UserDashboard;
