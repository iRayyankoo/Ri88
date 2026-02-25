"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Crown, ShieldAlert, MoreVertical, ShieldCheck, Mail, Calendar, LogOut, Check, X, Trash2, PenTool, EyeOff, Wrench, Clock, Eye, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import { getUsers, updateUserStatus, deleteUser, getAdminTools, updateToolState } from "@/actions/admin";
import Image from "next/image";
import Link from "next/link";

interface UserData {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    isPro: boolean;
    createdAt: Date;
    image: string | null;
}

interface DbTool {
    id: string;
    name: string;
    category: string;
    icon: string;
    isPremium: boolean;
    isActive: boolean;
    isMaintenance: boolean;
    isFreeForLimitedTime: boolean;
    createdAt: Date;
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'users' | 'tools'>('users');

    // User State
    const [users, setUsers] = useState<UserData[]>([]);
    const [stats, setStats] = useState({ totalUsers: 0, proUsers: 0, totalAdmins: 0, totalTools: 0 });
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Tools State
    const [tools, setTools] = useState<DbTool[]>([]);
    const [isLoadingTools, setIsLoadingTools] = useState(true);
    const [activeToolDropdown, setActiveToolDropdown] = useState<string | null>(null);

    const loadUsers = async () => {
        setIsLoadingUsers(true);
        const res = await getUsers();
        if (res.error) {
            toast.error(res.error);
        } else {
            setUsers(res.users || []);
            setStats(prev => ({ ...prev, totalUsers: res.stats?.totalUsers || 0, proUsers: res.stats?.proUsers || 0, totalAdmins: res.stats?.totalAdmins || 0 }));
        }
        setIsLoadingUsers(false);
    };

    const loadTools = async () => {
        setIsLoadingTools(true);
        const res = await getAdminTools();
        if (res.error) {
            toast.error(res.error);
        } else {
            setTools(res.tools || []);
            setStats(prev => ({ ...prev, totalTools: res.tools?.length || 0 }));
        }
        setIsLoadingTools(false);
    };

    useEffect(() => {
        loadUsers();
        loadTools();
    }, []);

    // --- User Actions ---
    const handleToggleRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
        const toastId = toast.loading("جاري تعديل الصلاحيات...");
        const res = await updateUserStatus(userId, { role: newRole });

        if (res.error) {
            toast.error(res.error, { id: toastId });
        } else {
            toast.success(res.success, { id: toastId });
            setActiveDropdown(null);
            loadUsers();
        }
    };

    const handleTogglePro = async (userId: string, isPro: boolean) => {
        const toastId = toast.loading("جاري تعديل حالة الاشتراك...");
        const res = await updateUserStatus(userId, { isPro: !isPro });

        if (res.error) {
            toast.error(res.error, { id: toastId });
        } else {
            toast.success(res.success, { id: toastId });
            setActiveDropdown(null);
            loadUsers();
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("هل أنت متأكد من حذف هذا المستخدم نهائياً؟ لا يمكن التراجع عن هذا الإجراء.")) return;

        const toastId = toast.loading("جاري حذف المستخدم...");
        const res = await deleteUser(userId);

        if (res.error) {
            toast.error(res.error, { id: toastId });
        } else {
            toast.success(res.success, { id: toastId });
            setActiveDropdown(null);
            loadUsers();
        }
    };

    // --- Tool Actions ---
    const handleUpdateTool = async (toolId: string, data: Partial<DbTool>) => {
        const toastId = toast.loading("جاري تحديث الأداة...");
        const res = await updateToolState(toolId, data);

        if (res.error) {
            toast.error(res.error, { id: toastId });
        } else {
            toast.success(res.success, { id: toastId });
            setActiveToolDropdown(null);
            loadTools();
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0C] p-6 lg:p-12 mb-20" dir="rtl">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-white font-cairo flex items-center gap-3">
                            <ShieldCheck className="w-8 h-8 text-brand-primary" />
                            لوحة تحكم الإدارة
                        </h1>
                        <p className="text-slate-400 mt-2 font-cairo text-sm">إدارة المستخدمين، الاشتراكات، والأدوات.</p>
                    </div>

                    <Link href="/" className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all flex items-center gap-2 group w-fit">
                        <LogOut className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                        العودة للمنصة
                    </Link>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        title="إجمالي المستخدمين"
                        value={stats.totalUsers}
                        icon={<Users className="w-6 h-6 text-blue-400" />}
                        bgClass="from-blue-500/10 to-transparent border-blue-500/20"
                    />
                    <StatCard
                        title="حسابات Pro النشطة"
                        value={stats.proUsers}
                        icon={<Crown className="w-6 h-6 text-amber-400" />}
                        bgClass="from-amber-500/10 to-transparent border-amber-500/20"
                    />
                    <StatCard
                        title="مدراء النظام"
                        value={stats.totalAdmins}
                        icon={<ShieldAlert className="w-6 h-6 text-emerald-400" />}
                        bgClass="from-emerald-500/10 to-transparent border-emerald-500/20"
                    />
                    <StatCard
                        title="إجمالي الأدوات"
                        value={stats.totalTools}
                        icon={<PenTool className="w-6 h-6 text-brand-primary" />}
                        bgClass="from-brand-primary/10 to-transparent border-brand-primary/20"
                    />
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-4 border-b border-white/10 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-4 font-bold text-sm flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${activeTab === 'users' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-400 hover:text-white'
                            }`}
                    >
                        <Users className="w-4 h-4" /> إدارة المستخدمين
                    </button>
                    <button
                        onClick={() => setActiveTab('tools')}
                        className={`px-6 py-4 font-bold text-sm flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${activeTab === 'tools' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-400 hover:text-white'
                            }`}
                    >
                        <LayoutGrid className="w-4 h-4" /> إدارة الأدوات والتحكم
                    </button>
                </div>

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="bg-[#121217] border border-white/5 rounded-[32px] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-6 border-b border-white/5">
                            <h3 className="text-xl font-bold text-white font-cairo">قائمة المستخدمين المسجلين</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead className="bg-[#1A1A24] text-slate-400 text-sm font-bold font-cairo">
                                    <tr>
                                        <th className="px-6 py-4 rounded-tr-2xl">المستخدم</th>
                                        <th className="px-6 py-4">البريد الإلكتروني</th>
                                        <th className="px-6 py-4">الصلاحية</th>
                                        <th className="px-6 py-4">الاشتراك</th>
                                        <th className="px-6 py-4">تاريخ الانضمام</th>
                                        <th className="px-6 py-4 rounded-tl-2xl text-left">إجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 whitespace-nowrap">
                                    {isLoadingUsers ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-20 text-center text-slate-500 font-bold">
                                                جاري تحميل البيانات...
                                            </td>
                                        </tr>
                                    ) : users.map((user) => (
                                        <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700">
                                                        <Image src={user.image || "/avatars/avatar1.svg"} alt={user.name || "User"} fill className="object-cover" />
                                                    </div>
                                                    <span className="font-bold text-white">{user.name || "بدون اسم"}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-slate-300">
                                                    <Mail className="w-4 h-4 text-slate-500" />
                                                    {user.email}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider ${user.role === 'ADMIN'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 w-fit ${user.isPro
                                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                    : 'bg-white/5 text-slate-500 border border-white/10'
                                                    }`}>
                                                    {user.isPro ? <Crown className="w-3 h-3" /> : null}
                                                    {user.isPro ? 'PRO' : 'FREE'}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                                    <Calendar className="w-4 h-4 text-slate-600" />
                                                    {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-left relative">
                                                <button
                                                    onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                                                    className="p-2 rounded-lg hover:bg-white/10 text-slate-400 transition-colors inline-block"
                                                >
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>

                                                {/* Action Dropdown */}
                                                <AnimatePresence>
                                                    {activeDropdown === user.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.95 }}
                                                            className="absolute left-6 top-full z-50 mt-1 w-48 bg-[#1A1A24] border border-white/10 rounded-xl shadow-2xl py-2 overflow-hidden"
                                                        >
                                                            <div className="absolute inset-0 bg-black/40 pointer-events-none" />

                                                            <button
                                                                onClick={() => handleTogglePro(user.id, user.isPro)}
                                                                className="relative w-full text-right px-4 py-2 hover:bg-white/5 text-sm font-bold text-white flex items-center gap-2"
                                                            >
                                                                {user.isPro ? <X className="w-4 h-4 text-slate-400" /> : <Crown className="w-4 h-4 text-amber-400" />}
                                                                {user.isPro ? 'إلغاء أشتراك Pro' : 'ترقية إلى Pro'}
                                                            </button>

                                                            <button
                                                                onClick={() => handleToggleRole(user.id, user.role)}
                                                                className="relative w-full text-right px-4 py-2 hover:bg-white/5 text-sm font-bold text-white flex items-center gap-2"
                                                            >
                                                                {user.role === "ADMIN" ? <Users className="w-4 h-4 text-slate-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                                                                {user.role === "ADMIN" ? 'إزالة الإدارة' : 'ترقية كمدير'}
                                                            </button>

                                                            <div className="h-px w-full bg-white/10 my-1 relative" />

                                                            <button
                                                                onClick={() => handleDeleteUser(user.id)}
                                                                className="relative w-full text-right px-4 py-2 hover:bg-red-500/10 text-sm font-bold text-red-500 flex items-center gap-2"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                حذف الحساب
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tools Tab */}
                {activeTab === 'tools' && (
                    <div className="bg-[#121217] border border-white/5 rounded-[32px] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white font-cairo">التحكم في الأدوات</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead className="bg-[#1A1A24] text-slate-400 text-sm font-bold font-cairo">
                                    <tr>
                                        <th className="px-6 py-4 rounded-tr-2xl">اسم الأداة</th>
                                        <th className="px-6 py-4">القسم</th>
                                        <th className="px-6 py-4">تعتبر كـ</th>
                                        <th className="px-6 py-4">الحالة العامة</th>
                                        <th className="px-6 py-4 rounded-tl-2xl text-left">إجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 whitespace-nowrap">
                                    {isLoadingTools ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-20 text-center text-slate-500 font-bold">
                                                جاري تحميل الأدوات...
                                            </td>
                                        </tr>
                                    ) : tools.map((tool) => (
                                        <tr key={tool.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-white">{tool.name}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="text-slate-400 text-sm bg-white/5 px-3 py-1 rounded-full">{tool.category}</span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-2 w-fit">
                                                    <span className={`px-2 py-1 flex items-center gap-1 rounded-md text-xs font-black w-fit ${tool.isPremium
                                                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                                                        {tool.isPremium ? <Crown className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                                                        {tool.isPremium ? 'مدفوعة PRO' : 'مجانية FREE'}
                                                    </span>
                                                    {tool.isFreeForLimitedTime && (
                                                        <span className="px-2 py-1 flex items-center gap-1 rounded-md text-xs font-black w-fit bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                            <Clock className="w-3 h-3" /> مجاني لفترة
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                {tool.isActive ? (
                                                    tool.isMaintenance ? (
                                                        <span className="text-amber-500 flex items-center gap-1 text-sm font-bold bg-amber-500/10 px-3 py-1 rounded-full w-fit"><Wrench className="w-4 h-4" /> تحت الصيانة</span>
                                                    ) : (
                                                        <span className="text-emerald-500 flex items-center gap-1 text-sm font-bold bg-emerald-500/10 px-3 py-1 rounded-full w-fit"><Check className="w-4 h-4" /> فعالة ومرئية</span>
                                                    )
                                                ) : (
                                                    <span className="text-slate-500 flex items-center gap-1 text-sm font-bold bg-white/5 px-3 py-1 rounded-full w-fit"><EyeOff className="w-4 h-4" /> مخفية</span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-left relative">
                                                <button
                                                    onClick={() => setActiveToolDropdown(activeToolDropdown === tool.id ? null : tool.id)}
                                                    className="p-2 rounded-lg hover:bg-white/10 text-slate-400 transition-colors inline-block"
                                                >
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>

                                                <AnimatePresence>
                                                    {activeToolDropdown === tool.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.95 }}
                                                            className="absolute left-6 top-full z-50 mt-1 w-56 bg-[#1A1A24] border border-white/10 rounded-xl shadow-2xl py-2 overflow-hidden"
                                                        >
                                                            <div className="absolute inset-0 bg-black/40 pointer-events-none" />

                                                            {/* Premium Toggle */}
                                                            <button
                                                                onClick={() => handleUpdateTool(tool.id, { isPremium: !tool.isPremium })}
                                                                className="relative w-full text-right px-4 py-2 hover:bg-white/5 text-sm font-bold text-white flex items-center justify-between gap-2"
                                                            >
                                                                <span className="flex items-center gap-2">
                                                                    <Crown className="w-4 h-4 text-amber-400" />
                                                                    {tool.isPremium ? 'جعلها مجانية' : 'تحويل لـ PRO'}
                                                                </span>
                                                            </button>

                                                            {/* Limited Time Free Toggle */}
                                                            <button
                                                                onClick={() => handleUpdateTool(tool.id, { isFreeForLimitedTime: !tool.isFreeForLimitedTime })}
                                                                className="relative w-full text-right px-4 py-2 hover:bg-white/5 text-sm font-bold text-white flex items-center justify-between gap-2"
                                                            >
                                                                <span className="flex items-center gap-2">
                                                                    <Clock className="w-4 h-4 text-blue-400" />
                                                                    {tool.isFreeForLimitedTime ? 'إلغاء المؤقت' : 'مجاني لفترة'}
                                                                </span>
                                                            </button>

                                                            <div className="h-px w-full bg-white/10 my-1 relative" />

                                                            {/* Status Management */}
                                                            <button
                                                                onClick={() => handleUpdateTool(tool.id, { isActive: !tool.isActive })}
                                                                className="relative w-full text-right px-4 py-2 hover:bg-white/5 text-sm font-bold text-white flex items-center justify-between gap-2"
                                                            >
                                                                <span className="flex items-center gap-2">
                                                                    {tool.isActive ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-emerald-400" />}
                                                                    {tool.isActive ? 'إخفاء الأداة' : 'إظهار الأداة'}
                                                                </span>
                                                            </button>

                                                            <button
                                                                onClick={() => handleUpdateTool(tool.id, { isMaintenance: !tool.isMaintenance })}
                                                                className="relative w-full text-right px-4 py-2 hover:bg-white/5 text-sm font-bold text-white flex items-center justify-between gap-2"
                                                            >
                                                                <span className="flex items-center gap-2">
                                                                    <Wrench className={`w-4 h-4 ${tool.isMaintenance ? 'text-emerald-400' : 'text-amber-400'}`} />
                                                                    {tool.isMaintenance ? 'إنهاء الصيانة' : 'تفعيل وضع الصيانة'}
                                                                </span>
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, bgClass }: { title: string, value: number, icon: React.ReactNode, bgClass: string }) {
    return (
        <div className={`p-6 bg-gradient-to-br border rounded-[32px] overflow-hidden relative ${bgClass}`}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none mix-blend-overlay" />
            <div className="relative z-10 flex items-center justify-between">
                <div>
                    <h3 className="text-slate-400 font-bold mb-1 font-cairo">{title}</h3>
                    <p className="text-4xl font-black text-white">{value}</p>
                </div>
                <div className="p-4 bg-[#0A0A0C]/50 rounded-2xl backdrop-blur-md">
                    {icon}
                </div>
            </div>
        </div>
    );
}
