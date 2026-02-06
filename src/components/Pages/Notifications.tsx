"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle2, AlertTriangle, Info, Clock, X } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { useNavigation } from '@/context/NavigationContext';

const notifications = [
    {
        id: 1,
        title: "تم تفعيل حسابك بنجاح",
        message: "أهلاً بك في شبكة النخبة. يمكنك الآن الوصول إلى جميع الأدوات.",
        time: "الآن",
        type: "success",
        read: false
    },
    {
        id: 2,
        title: "تحديث أمني جديد",
        message: "تم تحديث بروتوكولات الحماية لضمان أمان بياناتك.",
        time: "منذ 2 ساعة",
        type: "info",
        read: false
    },
    {
        id: 3,
        title: "صيانة مجدولة",
        message: "سيتم إجراء صيانة للخوادم يوم الجمعة القادم لمدة ساعة.",
        time: "أمس",
        type: "warning",
        read: true
    },
    {
        id: 4,
        title: "أداة جديدة: مولد الأكواد",
        message: "تم إضافة أداة ذكية جديدة لمساعدتك في كتابة الأكواد بسرعة.",
        time: "منذ 3 أيام",
        type: "info",
        read: true
    }
];

const Notifications = () => {
    const { setCurrentView } = useNavigation();

    return (
        <div className="max-w-4xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">الإشعارات</h1>
                    <p className="text-slate-400">آخر المستجدات والتنبيهات الخاصة بحسابك</p>
                </div>
                <button
                    onClick={() => setCurrentView('dashboard')}
                    className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* List */}
            <div className="grid gap-4">
                {notifications.map((note, i) => (
                    <GlassCard key={note.id} className={`p-6 flex gap-4 items-start group transition-all duration-300 hover:border-brand-primary/20 ${!note.read ? 'bg-brand-primary/5 border-brand-primary/10' : ''}`}>

                        {/* Icon */}
                        <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${note.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                                note.type === 'warning' ? 'bg-orange-500/10 text-orange-500' :
                                    'bg-blue-500/10 text-blue-500'
                            }`}>
                            {note.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
                                note.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                                    <Info className="w-5 h-5" />}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className={`font-bold text-lg ${!note.read ? 'text-white' : 'text-slate-300'}`}>
                                    {note.title}
                                </h3>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{note.time}</span>
                                </div>
                            </div>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                {note.message}
                            </p>
                        </div>

                        {/* Unread Indicator */}
                        {!note.read && (
                            <div className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(16,185,129,0.5)] mt-3" />
                        )}

                    </GlassCard>
                ))}
            </div>

            {/* Empty State (Hidden for now, but ready) */}
            {notifications.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                        <Bell className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">لا توجد إشعارات</h3>
                    <p className="text-slate-500">أنت متابع لكل شيء! سنخبرك عند وجود جديد.</p>
                </div>
            )}

        </div>
    );
};

export default Notifications;
