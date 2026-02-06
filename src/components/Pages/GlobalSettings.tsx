"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Globe, Bell, Shield, Save, Monitor, LogOut } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import GlassCard from '../ui/GlassCard';

/*
  GlobalSettings:
  Manages app-wide configurations.
*/

const GlobalSettings = () => {
    const { setIsLoggedIn, setCurrentView, openToolsInModal, setOpenToolsInModal } = useNavigation();
    const [language, setLanguage] = useState('ar');
    const [theme, setTheme] = useState('dark');
    const [notifications, setNotifications] = useState(true);

    const handleSave = () => {
        // Mock save
        alert('تم حفظ الإعدادات بنجاح');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentView('landing');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between pb-8 border-b border-white/5">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-white">الإعدادات العامة</h2>
                    <p className="text-slate-500 font-medium">تخصيص تجربة الاستخدام وتفضيلات النظام.</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors font-bold text-sm"
                >
                    <LogOut className="w-4 h-4" />
                    تسجيل الخروج
                </button>
            </div>

            {/* Sections */}
            <div className="space-y-6">

                {/* Visuals */}
                <GlassCard title="المظهر والعرض" icon={Monitor}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-300 block">لغة الواجهة</label>
                            <div className="grid grid-cols-2 gap-2 p-1 bg-black/20 rounded-xl relative">
                                <button
                                    onClick={() => setLanguage('ar')}
                                    className={`py-2 rounded-lg text-sm font-bold transition-all relative z-10 ${language === 'ar' ? 'text-white' : 'text-slate-500'}`}
                                >
                                    العربية
                                </button>
                                <button
                                    onClick={() => setLanguage('en')}
                                    className={`py-2 rounded-lg text-sm font-bold transition-all relative z-10 ${language === 'en' ? 'text-white' : 'text-slate-500'}`}
                                >
                                    English
                                </button>
                                <div
                                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-brand-primary rounded-lg transition-all duration-300 ${language === 'ar' ? 'right-1' : 'right-[calc(50%+4px)]'}`}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-300 block">طريقة عرض الأدوات</label>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setOpenToolsInModal(false)}
                                    className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${!openToolsInModal ? 'border-brand-primary bg-brand-primary/10' : 'border-white/5 bg-white/5 opacity-50 hover:opacity-100'}`}
                                >
                                    <Monitor className="w-5 h-5 text-white" />
                                    <span className="text-xs font-bold text-white">صفحة كاملة</span>
                                </button>
                                <button
                                    onClick={() => setOpenToolsInModal(true)}
                                    className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${openToolsInModal ? 'border-brand-primary bg-brand-primary/10' : 'border-white/5 bg-white/5 opacity-50 hover:opacity-100'}`}
                                >
                                    <Globe className="w-5 h-5 text-white" />
                                    <span className="text-xs font-bold text-white">نافذة منبثقة</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-300 block">السمة (Theme)</label>
                            <div className="flex items-center gap-4">
                                <button onClick={() => setTheme('dark')} className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${theme === 'dark' ? 'border-brand-primary bg-brand-primary/10' : 'border-white/5 bg-white/5 opacity-50'}`}>
                                    <Moon className="w-5 h-5 text-white" />
                                    <span className="text-xs font-bold text-white">Dark Glass</span>
                                </button>
                                <button disabled className="flex-1 p-4 rounded-xl border-2 border-white/5 bg-white/5 opacity-30 flex flex-col items-center gap-2 cursor-not-allowed">
                                    <div className="w-5 h-5 rounded-full bg-white" />
                                    <span className="text-xs font-bold text-slate-400">Light (Soon)</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Notifications */}
                <GlassCard title="الإشعارات والتنبيهات" icon={Bell}>
                    <div className="space-y-4">
                        {[
                            'تنبيهات البريد الإلكتروني عند اكتمال المهام',
                            'إشعارات المتصفح للأدوات النشطة',
                            'النشرة البريدية (أدوات جديدة أسبوعياً)'
                        ].map((label, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                                <span className="text-slate-300 text-sm font-medium">{label}</span>
                                <div
                                    onClick={() => setNotifications(!notifications)} // Simple toggle for demo
                                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${notifications && i === 0 ? 'bg-green-500' : 'bg-slate-700'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-md ${notifications && i === 0 ? 'left-1' : 'left-7'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Security */}
                <GlassCard title="الأمان والخصوصية" icon={Shield}>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-white font-bold text-sm">المصادقة الثنائية (2FA)</h4>
                                <p className="text-slate-500 text-xs mt-1">حماية إضافية لحسابك باستخدام تطبيق Authenticator.</p>
                            </div>
                            <button className="px-4 py-2 rounded-lg bg-brand-primary/10 text-brand-primary text-sm font-bold border border-brand-primary/20 hover:bg-brand-primary hover:text-white transition-all">
                                تفعيل
                            </button>
                        </div>
                        <div className="h-[1px] bg-white/5" />
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-white font-bold text-sm">تغيير كلمة المرور</h4>
                                <p className="text-slate-500 text-xs mt-1">آخر تغيير: قبل 3 أشهر</p>
                            </div>
                            <button className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-sm font-bold hover:bg-white/10 transition-all">
                                تحديث
                            </button>
                        </div>
                    </div>
                </GlassCard>

            </div>

            {/* Footer Action */}
            <div className="sticky bottom-6 flex justify-end">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-brand-primary text-white font-bold shadow-xl shadow-brand-primary/30 hover:scale-105 transition-transform"
                >
                    <Save className="w-5 h-5" />
                    حفظ التغييرات
                </button>
            </div>
        </div>
    );
};

export default GlobalSettings;
