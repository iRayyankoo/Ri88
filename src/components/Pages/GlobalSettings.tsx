"use client";
import React, { useState } from 'react';
import { Moon, Globe, Bell, Shield, Save, Monitor, LogOut, User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTheme } from '../ThemeProvider';
import { useNavigation } from '@/context/NavigationContext';
import Image from 'next/image';
import GlassCard from '../ui/GlassCard';
import { updateProfile, getUserTransactions } from '@/actions/profile';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

/*
  GlobalSettings:
  Manages app-wide configurations.
*/

const GlobalSettings = () => {
    const { setIsLoggedIn, setCurrentView, openToolsInModal, setOpenToolsInModal } = useNavigation();
    const { data: session, update } = useSession();
    const { theme, setTheme } = useTheme();
    const [language, setLanguage] = useState('ar');
    const [notifications, setNotifications] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState<string>(session?.user?.image || '/avatars/avatar1.svg');
    const [name, setName] = useState(session?.user?.name || '');
    const [isSaving, setIsSaving] = useState(false);

    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    React.useEffect(() => {
        if (session?.user?.name) setName(session.user.name);
        if (session?.user?.image) setSelectedAvatar(session.user.image);
    }, [session]);

    React.useEffect(() => {
        const fetchHistory = async () => {
            if (session?.user?.id) {
                const res = await getUserTransactions();
                if (res.success) setTransactions(res.data);
                setIsLoadingHistory(false);
            }
        };
        fetchHistory();
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
            <div className="flex items-center justify-between pb-8 border-b border-border-subtle">
                <div className="space-y-3">
                    <h2 className="text-4xl font-black text-text-primary font-cairo">الإعدادات العامة</h2>
                    <p className="text-text-muted text-lg font-medium">تخصيص تجربة الاستخدام وتفضيلات النظام بالكامل.</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all font-bold text-sm hover:scale-105 active:scale-95"
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
                                <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl shadow-brand-primary/20 bg-surface-base border border-border-subtle relative">
                                    <Image
                                        src={selectedAvatar || session?.user?.image || '/avatars/avatar1.svg'}
                                        alt="Profile Avatar"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="text-center w-full">
                                    <h3 className="text-text-primary font-bold">{session?.user?.name || 'مستخدم'}</h3>
                                    <p className="text-sm text-text-muted truncate w-32">{session?.user?.email || ''}</p>
                                </div>
                            </div>

                            {/* Editable Info & Avatar Selection */}
                            <div className="flex-1 space-y-6 md:pt-4 w-full">
                                <div className="space-y-3">
                                    <label className="text-base font-bold text-text-muted block">الاسم الكامل</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full max-w-md bg-surface-raised border border-border-subtle rounded-2xl py-3 px-5 text-text-primary placeholder:text-text-muted outline-none focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/10 transition-all font-bold font-cairo"
                                        placeholder="أدخل اسمك للظهور"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-base font-bold text-text-muted block">تغيير الصورة الرمزية (الأفاتار)</label>
                                    <div className="flex flex-wrap gap-4">
                                        {/* Show current external Google avatar if it exists and isn't a default one */}
                                        {session?.user?.image && !session.user.image.startsWith('/avatars/') && (
                                            <button
                                                onClick={() => setSelectedAvatar(session.user!.image!)}
                                                className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${selectedAvatar === session.user.image ? 'border-brand-primary shadow-[0_0_20px_rgba(139,92,246,0.2)] scale-105' : 'border-border-subtle opacity-50 hover:opacity-100 hover:border-border-strong'}`}
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
                                                className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${selectedAvatar === av ? 'border-brand-primary shadow-[0_0_20px_rgba(139,92,246,0.2)] scale-105' : 'border-border-subtle opacity-50 hover:opacity-100 hover:border-border-strong'}`}
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
                            <label className="text-base font-bold text-text-muted block">لغة الواجهة</label>
                            <div className="grid grid-cols-2 gap-2 p-1.5 bg-surface-raised border border-border-subtle rounded-2xl relative h-16">
                                <button
                                    onClick={() => setLanguage('ar')}
                                    className={`relative z-10 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${language === 'ar' ? 'text-white' : 'text-text-muted hover:text-text-primary'}`}
                                >
                                    <span>العربية</span>
                                </button>
                                <button
                                    onClick={() => setLanguage('en')}
                                    className={`relative z-10 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${language === 'en' ? 'text-white' : 'text-text-muted hover:text-text-primary'}`}
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
                            <label className="text-base font-bold text-text-muted block">طريقة عرض الأدوات</label>
                            <div className="flex items-center gap-4 h-16">
                                <button
                                    onClick={() => setOpenToolsInModal(false)}
                                    className={`flex-1 h-full rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${!openToolsInModal
                                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                                        : 'border-border-subtle bg-surface-raised text-text-muted hover:border-border-strong hover:text-text-primary'
                                        }`}
                                >
                                    <Monitor className="w-5 h-5" />
                                    <span className="text-sm font-bold">صفحة كاملة</span>
                                </button>
                                <button
                                    onClick={() => setOpenToolsInModal(true)}
                                    className={`flex-1 h-full rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${openToolsInModal
                                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                                        : 'border-border-subtle bg-surface-raised text-text-muted hover:border-border-strong hover:text-text-primary'
                                        }`}
                                >
                                    <Globe className="w-5 h-5" />
                                    <span className="text-sm font-bold">نافذة</span>
                                </button>
                            </div>
                        </div>

                        {/* Theme */}
                        <div className="space-y-4">
                            <label className="text-base font-bold text-text-muted block">السمة (Theme)</label>
                            <div className="flex items-center gap-4 h-16">
                                <button onClick={() => setTheme('dark')} className={`flex-1 h-full rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${theme === 'dark' ? 'border-brand-primary bg-brand-primary/10 text-brand-primary shadow-[0_0_20px_rgba(139,92,246,0.1)]' : 'border-border-subtle bg-surface-raised text-text-muted hover:border-border-strong hover:text-text-primary'}`}>
                                    <Moon className="w-5 h-5" />
                                    <span className="text-sm font-bold">Dark Glass</span>
                                </button>
                                <button onClick={() => setTheme('light')} className={`flex-1 h-full rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${theme === 'light' ? 'border-brand-primary bg-brand-primary/10 text-brand-primary shadow-[0_0_20px_rgba(139,92,246,0.1)]' : 'border-border-subtle bg-surface-raised text-text-muted hover:border-border-strong hover:text-text-primary'}`}>
                                    <div className={`w-4 h-4 rounded-full ${theme === 'light' ? 'bg-brand-primary' : 'bg-slate-400'}`} />
                                    <span className={`text-sm font-bold ${theme === 'light' ? 'text-brand-primary' : 'text-text-muted'}`}>Light</span>
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
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-surface-raised border border-border-subtle hover:border-border-strong transition-all cursor-pointer group" onClick={() => setNotifications(!notifications)}>
                                <span className="text-text-muted text-base font-bold group-hover:text-text-primary transition-colors">{label}</span>
                                <div
                                    className={`w-14 h-8 rounded-full relative transition-colors duration-300 border border-transparent ${notifications && i === 0 ? 'bg-emerald-500 text-white' : 'bg-slate-300 dark:bg-slate-700'}`}
                                >
                                    <div className={`absolute top-1 w-6 h-6 rounded-full transition-all duration-300 shadow-md ${notifications && i === 0 ? 'left-1 bg-white' : 'left-7 bg-white dark:bg-slate-500'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Security */}
                <GlassCard title="الأمان والخصوصية" icon={Shield}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
                        <div className="flex items-center justify-between p-6 rounded-3xl bg-surface-raised border border-border-subtle">
                            <div>
                                <h4 className="text-text-primary font-black text-lg mb-2">المصادقة الثنائية (2FA)</h4>
                                <p className="text-text-muted text-sm font-medium">حماية إضافية لحسابك باستخدام تطبيق Authenticator.</p>
                            </div>
                            <button className="px-6 py-3 rounded-xl bg-brand-primary/10 text-brand-primary text-sm font-black border border-brand-primary/20 hover:bg-brand-primary hover:text-white transition-all shadow-lg hover:shadow-brand-primary/20">
                                تفعيل
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-6 rounded-3xl bg-surface-raised border border-border-subtle">
                            <div>
                                <h4 className="text-text-primary font-black text-lg mb-2">كلمة المرور</h4>
                                <p className="text-text-muted text-sm font-medium">آخر تغيير: قبل 3 أشهر</p>
                            </div>
                            <button className="px-6 py-3 rounded-xl bg-surface-glass text-text-muted text-sm font-black hover:bg-surface-glass/80 transition-all border border-transparent hover:border-border-strong">
                                تحديث
                            </button>
                        </div>
                    </div>
                </GlassCard>

                {/* Purchase History */}
                <GlassCard title="سجل المشتريات والعمليات" icon={Globe}>
                    <div className="p-4">
                        {isLoadingHistory ? (
                            <div className="flex justify-center p-8">
                                <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center bg-white/[0.02] border border-white/5 rounded-3xl">
                                <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-4 border border-brand-primary/20">
                                    <Globe className="w-8 h-8 opacity-50" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">لا توجد عمليات سابقة</h3>
                                <p className="text-slate-500 max-w-sm">لم تقم بإجراء أي عمليات شراء أو شحن رصيد حتى الآن في حسابك.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {transactions.map((tx, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-[#0F1115] border border-white/5 hover:border-white/10 transition-all gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.type === 'شحن رصيد' ? 'bg-emerald-500/10 text-emerald-500'
                                                : tx.type === 'اشتراك PRO' ? 'bg-amber-500/10 text-amber-500'
                                                    : 'bg-brand-primary/10 text-brand-primary'
                                                }`}>
                                                <Globe className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-text-primary font-bold">{tx.type}</h4>
                                                <p className="text-text-muted text-sm mt-1">{tx.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-border-subtle sm:border-0">
                                            <span className="text-lg font-black text-text-primary" dir="ltr">{tx.amount} SR</span>
                                            <span className="text-xs font-bold text-text-muted bg-surface-raised px-2 py-1 rounded-md mt-1">
                                                {format(new Date(tx.date), 'dd MMMM yyyy, hh:mm a', { locale: arSA })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
