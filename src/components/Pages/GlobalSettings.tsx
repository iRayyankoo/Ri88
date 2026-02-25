"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Globe, Bell, Shield, Save, Monitor, LogOut, User } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import GlassCard from '../ui/GlassCard';
import { updateProfile } from '@/actions/profile';
import { toast } from 'sonner';

/*
  GlobalSettings:
  Manages app-wide configurations.
*/

const GlobalSettings = () => {
    const { setIsLoggedIn, setCurrentView, openToolsInModal, setOpenToolsInModal } = useNavigation();
    const { data: session, update } = useSession();
    const [language, setLanguage] = useState('ar');
    const [theme, setTheme] = useState('dark');
    const [notifications, setNotifications] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState<string>(session?.user?.image || '/avatars/avatar1.svg');
    const [name, setName] = useState(session?.user?.name || '');
    const [isSaving, setIsSaving] = useState(false);

    React.useEffect(() => {
        if (session?.user?.name) setName(session.user.name);
        if (session?.user?.image) setSelectedAvatar(session.user.image);
    }, [session]);

    const defaultAvatars = [
        '/avatars/avatar1.svg',
        '/avatars/avatar2.svg',
        '/avatars/avatar3.svg',
        '/avatars/avatar4.svg'
    ];

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const hasAvatarChanged = selectedAvatar !== session?.user?.image && selectedAvatar !== '';
            const hasNameChanged = name !== session?.user?.name && name.trim() !== '';

            if (hasAvatarChanged || hasNameChanged) {
                const res = await updateProfile({
                    name: hasNameChanged ? name : undefined,
                    image: hasAvatarChanged ? selectedAvatar : undefined
                });

                if (res.error) {
                    toast.error(res.error);
                } else if (res.success) {
                    await update({
                        name: res.user?.name,
                        image: res.user?.image
                    });
                    toast.success(res.success);
                }
            } else {
                toast.success('تم حفظ الإعدادات بنجاح');
            }
        } catch (error) {
            console.error(error);
            toast.error('حدث خطأ أثناء الحفظ');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentView('landing');
    };

    return (
        <div className="max-w-full px-4 lg:px-8 mx-auto space-y-12 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between pb-8 border-b border-white/5">
                <div className="space-y-3">
                    <h2 className="text-4xl font-black text-white font-cairo">الإعدادات العامة</h2>
                    <p className="text-slate-400 text-lg font-medium">تخصيص تجربة الاستخدام وتفضيلات النظام بالكامل.</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all font-bold text-sm hover:scale-105 active:scale-95"
                >
                    <LogOut className="w-5 h-5" />
                    تسجيل الخروج
                </button>
            </div>

            {/* Sections */}
            <div className="space-y-10">

                {/* Profile Section */}
                <GlassCard title="الملف الشخصي" icon={User}>
                    <div className="p-4 space-y-6">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Current Avatar Display */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl shadow-brand-primary/20 bg-[#0F1115] border border-white/5 relative">
                                    <Image
                                        src={selectedAvatar || session?.user?.image || '/avatars/avatar1.svg'}
                                        alt="Profile Avatar"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="text-center w-full">
                                    <h3 className="text-white font-bold">{session?.user?.name || 'مستخدم'}</h3>
                                    <p className="text-sm text-slate-500 truncate w-32">{session?.user?.email || ''}</p>
                                </div>
                            </div>

                            {/* Editable Info & Avatar Selection */}
                            <div className="flex-1 space-y-6 md:pt-4 w-full">
                                <div className="space-y-3">
                                    <label className="text-base font-bold text-slate-300 block">الاسم الكامل</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full max-w-md bg-[#121217] border border-white/5 rounded-2xl py-3 px-5 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/40 focus:bg-[#15151A] transition-all font-bold font-cairo"
                                        placeholder="أدخل اسمك للظهور"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-base font-bold text-slate-300 block">تغيير الصورة الرمزية (الأفاتار)</label>
                                    <div className="flex flex-wrap gap-4">
                                        {/* Show current external Google avatar if it exists and isn't a default one */}
                                        {session?.user?.image && !session.user.image.startsWith('/avatars/') && (
                                            <button
                                                onClick={() => setSelectedAvatar(session.user!.image!)}
                                                className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${selectedAvatar === session.user.image ? 'border-brand-primary shadow-[0_0_20px_rgba(139,92,246,0.2)] scale-105' : 'border-white/5 opacity-50 hover:opacity-100 hover:border-white/20'}`}
                                            >
                                                <Image src={session.user.image} alt="Google Avatar" fill className="object-cover" />
                                                {selectedAvatar === session.user.image && (
                                                    <div className="absolute inset-0 bg-brand-primary/20 pointer-events-none" />
                                                )}
                                            </button>
                                        )}

                                        {/* Default Avatars */}
                                        {defaultAvatars.map((av, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedAvatar(av)}
                                                className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${selectedAvatar === av ? 'border-brand-primary shadow-[0_0_20px_rgba(139,92,246,0.2)] scale-105' : 'border-white/5 opacity-50 hover:opacity-100 hover:border-white/20'}`}
                                            >
                                                <Image src={av} alt={`Avatar ${index + 1}`} fill className="object-cover" />
                                                {selectedAvatar === av && (
                                                    <div className="absolute inset-0 bg-brand-primary/20 pointer-events-none" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Visuals */}
                <GlassCard title="المظهر والعرض" icon={Monitor}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 p-2">
                        {/* Language */}
                        <div className="space-y-4">
                            <label className="text-base font-bold text-slate-300 block">لغة الواجهة</label>
                            <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#0F1115] border border-white/5 rounded-2xl relative h-16">
                                <button
                                    onClick={() => setLanguage('ar')}
                                    className={`relative z-10 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${language === 'ar' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    <span>العربية</span>
                                </button>
                                <button
                                    onClick={() => setLanguage('en')}
                                    className={`relative z-10 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${language === 'en' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    <span>English</span>
                                </button>
                                <div
                                    className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-brand-primary rounded-xl shadow-lg shadow-brand-primary/20 transition-all duration-300 ease-out ${language === 'ar' ? 'right-1.5' : 'right-[calc(50%+4px)]'}`}
                                />
                            </div>
                        </div>

                        {/* View Mode */}
                        <div className="space-y-4">
                            <label className="text-base font-bold text-slate-300 block">طريقة عرض الأدوات</label>
                            <div className="flex items-center gap-4 h-16">
                                <button
                                    onClick={() => setOpenToolsInModal(false)}
                                    className={`flex-1 h-full rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${!openToolsInModal
                                        ? 'border-brand-primary bg-brand-primary/10 text-white shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                                        : 'border-white/5 bg-[#0F1115] text-slate-500 hover:border-white/10 hover:text-slate-300'
                                        }`}
                                >
                                    <Monitor className="w-5 h-5" />
                                    <span className="text-sm font-bold">صفحة كاملة</span>
                                </button>
                                <button
                                    onClick={() => setOpenToolsInModal(true)}
                                    className={`flex-1 h-full rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${openToolsInModal
                                        ? 'border-brand-primary bg-brand-primary/10 text-white shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                                        : 'border-white/5 bg-[#0F1115] text-slate-500 hover:border-white/10 hover:text-slate-300'
                                        }`}
                                >
                                    <Globe className="w-5 h-5" />
                                    <span className="text-sm font-bold">نافذة</span>
                                </button>
                            </div>
                        </div>

                        {/* Theme */}
                        <div className="space-y-4">
                            <label className="text-base font-bold text-slate-300 block">السمة (Theme)</label>
                            <div className="flex items-center gap-4 h-16">
                                <button onClick={() => setTheme('dark')} className={`flex-1 h-full rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${theme === 'dark' ? 'border-brand-primary bg-brand-primary/10 text-white' : 'border-white/5 bg-white/5'}`}>
                                    <Moon className="w-5 h-5" />
                                    <span className="text-sm font-bold">Dark Glass</span>
                                </button>
                                <button disabled className="flex-1 h-full rounded-2xl border-2 border-white/5 bg-[#0F1115] opacity-40 flex items-center justify-center gap-3 cursor-not-allowed">
                                    <div className="w-4 h-4 rounded-full bg-slate-500" />
                                    <span className="text-sm font-bold text-slate-500">Light</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Notifications */}
                <GlassCard title="الإشعارات والتنبيهات" icon={Bell}>
                    <div className="space-y-4 p-2">
                        {[
                            'تنبيهات البريد الإلكتروني عند اكتمال المهام',
                            'إشعارات المتصفح للأدوات النشطة',
                            'النشرة البريدية (أدوات جديدة أسبوعياً)'
                        ].map((label, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[#0F1115] border border-white/5 hover:border-white/10 transition-all cursor-pointer group" onClick={() => setNotifications(!notifications)}>
                                <span className="text-slate-300 text-base font-bold group-hover:text-white transition-colors">{label}</span>
                                <div
                                    className={`w-14 h-8 rounded-full relative transition-colors duration-300 border border-transparent ${notifications && i === 0 ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-slate-800 border-slate-700'}`}
                                >
                                    <div className={`absolute top-1 w-6 h-6 rounded-full transition-all duration-300 shadow-md ${notifications && i === 0 ? 'left-1 bg-emerald-400' : 'left-7 bg-slate-500'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Security */}
                <GlassCard title="الأمان والخصوصية" icon={Shield}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
                        <div className="flex items-center justify-between p-6 rounded-3xl bg-[#0F1115] border border-white/5">
                            <div>
                                <h4 className="text-white font-black text-lg mb-2">المصادقة الثنائية (2FA)</h4>
                                <p className="text-slate-500 text-sm font-medium">حماية إضافية لحسابك باستخدام تطبيق Authenticator.</p>
                            </div>
                            <button className="px-6 py-3 rounded-xl bg-brand-primary/10 text-brand-primary text-sm font-black border border-brand-primary/20 hover:bg-brand-primary hover:text-white transition-all shadow-lg hover:shadow-brand-primary/20">
                                تفعيل
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-6 rounded-3xl bg-[#0F1115] border border-white/5">
                            <div>
                                <h4 className="text-white font-black text-lg mb-2">كلمة المرور</h4>
                                <p className="text-slate-500 text-sm font-medium">آخر تغيير: قبل 3 أشهر</p>
                            </div>
                            <button className="px-6 py-3 rounded-xl bg-white/5 text-slate-300 text-sm font-black hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
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
                    disabled={isSaving}
                    className={`flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-brand-primary to-blue-600 text-white font-black text-lg shadow-2xl shadow-brand-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all ${isSaving ? 'opacity-70 cursor-wait' : ''}`}
                >
                    <Save className="w-6 h-6" />
                    {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
            </div>
        </div>
    );
};

export default GlobalSettings;
