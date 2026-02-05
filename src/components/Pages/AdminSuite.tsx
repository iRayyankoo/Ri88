"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Server, FileText, TrendingUp, DollarSign, Activity, ShieldAlert } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import GlassCard from '../ui/GlassCard';

const AdminSuite = () => {
    const { setCurrentView } = useNavigation();

    const stats = [
        { title: 'إجمالي الأرباح', value: '42,500 ر.س', trend: '+18%', icon: DollarSign, color: 'text-green-400' },
        { title: 'المستخدمين الجدد', value: '1,240', trend: '+12%', icon: Users, color: 'text-brand-primary' },
        { title: 'أداء السيرفر', value: '98%', trend: 'Stable', icon: Activity, color: 'text-brand-secondary' },
        { title: 'بلاغات نشطة', value: '3', trend: '-2', icon: ShieldAlert, color: 'text-red-400' },
    ];

    const modules = [
        {
            id: 'users',
            title: 'إدارة المستخدمين',
            desc: 'التحكم في الحسابات والصلاحيات',
            icon: Users,
            route: 'admin-users',
            color: 'bg-brand-primary/20 text-brand-primary'
        },
        {
            id: 'server',
            title: 'مراقبة السيرفر',
            desc: 'مؤشرات الأداء والحالة الحية',
            icon: Server,
            route: 'admin-server',
            color: 'bg-brand-secondary/20 text-brand-secondary'
        },
        {
            id: 'changelog',
            title: 'سجل التغييرات',
            desc: 'تاريخ تحديثات النظام',
            icon: FileText,
            route: 'admin-changelog',
            color: 'bg-purple-500/20 text-purple-400'
        },
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between pb-8 border-b border-white/5">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-white">لوحة القيادة (Admin)</h2>
                    <p className="text-slate-500 font-medium">نظرة شاملة على أداء المنصة والعمليات.</p>
                </div>
                <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold text-green-400">النظام يعمل بكفاءة</span>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="stitch-glass p-6"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold bg-white/5 px-2 py-1 rounded text-slate-400">{stat.trend}</span>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
                        <p className="text-slate-500 text-sm font-bold">{stat.title}</p>
                    </motion.div>
                ))}
            </div>

            {/* Control Modules */}
            <div>
                <h3 className="text-xl font-bold text-white mb-6">وحدات التحكم</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {modules.map((mod, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentView(mod.route as any)}
                            className="stitch-glass p-8 text-right hover:border-brand-primary/50 transition-all group relative overflow-hidden"
                        >
                            <div className={`absolute top-0 left-0 w-1 h-full ${mod.color.split(' ')[0].replace('/20', '')} opacity-0 group-hover:opacity-100 transition-opacity`} />

                            <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center ${mod.color} group-hover:scale-110 transition-transform`}>
                                <mod.icon className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">{mod.title}</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">{mod.desc}</p>
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default AdminSuite;
