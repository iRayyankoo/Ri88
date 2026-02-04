"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Activity,
    ShieldAlert,
    Server,
    ArrowUpRight,
    Search,
    MoreVertical,
    CheckCircle,
    XCircle,
    Cpu,
    BarChart3,
    Network
} from 'lucide-react';

const AdminSuite = () => {
    const users = [
        { id: '1', name: 'أحمد علي', email: 'ahmed@ri88.com', plan: 'Premium', status: 'نشط', joined: '2024-01-15' },
        { id: '2', name: 'سارة خالد', email: 'sara@ri88.com', plan: 'Enterprise', status: 'نشط', joined: '2024-01-20' },
        { id: '3', name: 'محمد فهد', email: 'mo@ri88.com', plan: 'Free', status: 'محظور', joined: '2024-02-01' },
    ];

    const serverStats = [
        { label: 'وحدة المعالجة (CPU)', value: 24, color: 'text-brand-secondary' },
        { label: 'الذاكرة العشوائية (RAM)', value: 68, color: 'text-brand-primary' },
        { label: 'حركة الشبكة (Traffic)', value: 89, color: 'text-orange-500' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
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

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div className="text-right space-y-1">
                    <h2 className="text-3xl font-black text-white">مركز التحكم العالمي</h2>
                    <p className="text-slate-500 font-medium">مراقبة الأنظمة، إدارة المستخدمين، وتأمين المنصة.</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-white/5 hover:bg-white/10 text-white font-black px-6 py-3 rounded-2xl border border-white/5 text-xs transition-all flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-red-500" />
                        تنبيهات الأمان
                    </button>
                </div>
            </div>

            {/* REAL-TIME SERVER GAUGES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {serverStats.map((stat, i) => (
                    <motion.div key={i} variants={itemVariants} className="glass-card p-10 flex flex-col items-center text-center gap-6 group border-white/5">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            {/* SVG Gauge Background */}
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                <motion.circle
                                    cx="64" cy="64" r="56"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    strokeDasharray="351.8"
                                    initial={{ strokeDashoffset: 351.8 }}
                                    animate={{ strokeDashoffset: 351.8 - (351.8 * stat.value) / 100 }}
                                    transition={{ duration: 1.5, delay: 0.5 + i * 0.2 }}
                                    className={stat.color}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-black text-white">{stat.value}%</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Live</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-black text-white text-sm mb-1">{stat.label}</h4>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">تحميل مستقر</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* USER MANAGEMENT & LOGS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* User Table */}
                <motion.div variants={itemVariants} className="lg:col-span-8 glass-card overflow-hidden">
                    <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between flex-row-reverse">
                        <div className="flex items-center gap-3 flex-row-reverse text-right">
                            <Users className="w-6 h-6 text-brand-primary" />
                            <h3 className="text-xl font-black text-white">إدارة المستخدمين</h3>
                        </div>
                        <div className="relative group lg:w-48">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 group-focus-within:text-brand-primary transition-colors" />
                            <input className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pr-9 pl-3 text-[10px] text-white outline-none focus:ring-2 focus:ring-brand-primary/20 text-right" placeholder="بحث مخصص..." />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead>
                                <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] font-black uppercase text-slate-500">
                                    <th className="px-8 py-5">المستخدم</th>
                                    <th className="px-8 py-5">الخطة</th>
                                    <th className="px-8 py-5">الحالة</th>
                                    <th className="px-8 py-5">تاريخ الانضمام</th>
                                    <th className="px-8 py-5"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-3 flex-row-reverse text-right">
                                                <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-xs font-black text-brand-primary border border-brand-primary/20">{user.name[0]}</div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white">{user.name}</span>
                                                    <span className="text-[10px] text-slate-500 font-medium">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${user.plan === 'Enterprise' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                                                    user.plan === 'Premium' ? 'bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20' :
                                                        'bg-white/5 text-slate-500'
                                                }`}>
                                                {user.plan}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <span className="text-[10px] font-bold text-white">{user.status}</span>
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'نشط' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-red-500'}`} />
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-[10px] font-bold text-slate-500">{user.joined}</td>
                                        <td className="px-8 py-6">
                                            <button className="p-2 text-slate-600 hover:text-white transition-colors"><MoreVertical className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* System Health / Traffic */}
                <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
                    <div className="glass-card p-8 space-y-6">
                        <div className="flex items-center justify-between flex-row-reverse">
                            <h4 className="text-xl font-black text-white">صحة الأنظمة</h4>
                            <Activity className="w-6 h-6 text-brand-secondary" />
                        </div>
                        <div className="space-y-4 pt-4">
                            {[
                                { name: 'قاعدة البيانات', status: 'مثالي', icon: CheckCircle, color: 'text-emerald-500' },
                                { name: 'خادم الـ API', status: 'نشط', icon: CheckCircle, color: 'text-emerald-500' },
                                { name: 'تخزين الصور', status: 'صيانة', icon: Activity, color: 'text-orange-500' },
                            ].map((sys, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <sys.icon className={`w-4 h-4 ${sys.color}`} />
                                        <span className="text-[10px] font-black uppercase text-white tracking-widest">{sys.status}</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-400">{sys.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-8 bg-brand-primary/10 border-brand-primary/20">
                        <div className="flex items-center justify-between flex-row-reverse mb-4">
                            <h4 className="font-black text-white text-sm">التنبيهات العاجلة</h4>
                            <ShieldAlert className="w-5 h-5 text-brand-primary" />
                        </div>
                        <p className="text-[11px] text-slate-300 font-medium leading-relaxed text-right mb-6">
                            تم رصد محاولة دخول مشبوهة من عنوان <span className="text-brand-primary font-black">192.168.1.1</span>. تم حظر العنوان تلقائياً لمدة 24 ساعة.
                        </p>
                        <button className="w-full py-3 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg active:scale-95 transition-all">
                            عرض سجل الأمان
                        </button>
                    </div>
                </motion.div>

            </div>

        </motion.div>
    );
};

export default AdminSuite;
