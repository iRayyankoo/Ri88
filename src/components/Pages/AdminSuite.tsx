"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Activity, ShieldCheck } from 'lucide-react';
import { getAdminStats, getUsers, updateUserRole, toggleProStatus } from '@/app/actions/admin';
import { toast } from 'sonner';
import { useNavigation } from '@/context/NavigationContext';

interface AdminStats {
    users: number;
    proUsers: number;
    tools: number;
    revenue: number;
}

interface UserData {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    isPro: boolean;
    createdAt: Date;
    wallet?: { balance: number } | null;
}

const AdminSuite = () => {
    const { userRole } = useNavigation();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [users, setUsers] = useState<UserData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isUnauthorized, setIsUnauthorized] = useState(false);

    const loadData = useCallback(async () => {
        try {
            setIsUnauthorized(false);
            const [statsData, usersData] = await Promise.all([
                getAdminStats(),
                getUsers()
            ]);
            setStats(statsData);
            setUsers(usersData);
        } catch (error) {
            console.error("Failed to load admin data", error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            if (errorMessage === "Unauthorized") {
                setIsUnauthorized(true);
                toast.error("غير مصرح لك بالوصول لبيانات الإدارة");
            } else {
                toast.error("فشل تحميل بيانات الأدمن");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleTogglePro = async (userId: string) => {
        try {
            await toggleProStatus(userId);
            toast.success("تم تحديث حالة الاشتراك");
            loadData(); // Reload to reflect changes
        } catch (error) {
            console.error(error);
            toast.error("فشل التحديث");
        }
    };

    const handlePromote = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
        try {
            await updateUserRole(userId, newRole);
            toast.success(`تم تغيير الصلاحية إلى ${newRole}`);
            loadData();
        } catch (error) {
            console.error(error);
            toast.error("فشل تغيير الصلاحية");
        }
    };

    if (isUnauthorized || userRole !== 'admin') return (
        <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-6 text-center">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                <ShieldCheck className="w-10 h-10" />
            </div>
            <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">وصول غير مصرح به</h3>
                <p className="text-slate-500 max-w-sm">ليس لديك الصلاحيات الكافية لعرض هذه الصفحة. يرجى التأكد من تسجيل الدخول بحساب المدير.</p>
            </div>
        </div>
    );

    if (loading) return (
        <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
            <p className="text-slate-500 font-bold animate-pulse">جاري تحميل لوحة التحكم...</p>
        </div>
    );

    const statCards = [
        { title: 'إجمالي الأرباح', value: `${stats?.revenue || 0} ر.س`, icon: DollarSign, color: 'text-green-400' },
        { title: 'المستخدمين', value: stats?.users || 0, icon: Users, color: 'text-brand-primary' },
        { title: 'مشتركي PRO', value: stats?.proUsers || 0, icon: ShieldCheck, color: 'text-brand-secondary' },
        { title: 'الأدوات النشطة', value: stats?.tools || 0, icon: Activity, color: 'text-purple-400' },
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
                <div className="space-y-2 text-right">
                    <h2 className="text-4xl font-black text-white bg-clip-text text-transparent bg-gradient-to-l from-white via-white to-white/50">لوحة الإدارة الرائعة</h2>
                    <p className="text-slate-500 font-medium">تحكم في كامل المنصة وراقب الأداء لحظة بلحظة.</p>
                </div>
                <div className="flex items-center gap-3 bg-green-500/10 px-5 py-3 rounded-2xl border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
                    <span className="text-sm font-black text-green-400 tracking-wider">LIVE OPERATIONS</span>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="stitch-glass p-8 relative overflow-hidden group hover:border-brand-primary/30 transition-all duration-500"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-primary/10 transition-all" />
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="text-4xl font-black text-white mb-2 relative z-10 tracking-tight">{stat.value}</h3>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest relative z-10">{stat.title}</p>
                    </motion.div>
                ))}
            </div>

            {/* Users Section */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-2xl font-black text-white flex items-center gap-3">
                        <Users className="text-brand-primary w-6 h-6" />
                        إدارة المستخدمين
                    </h3>
                    <div className="relative group max-w-md w-full">
                        <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-brand-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="ابحث عن مستخدم (الاسم أو البريد)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pr-11 pl-4 text-white focus:border-brand-primary/50 outline-none transition-all focus:bg-white/[0.08]"
                        />
                    </div>
                </div>

                <div className="stitch-glass rounded-3xl overflow-hidden border border-white/10">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-white/5 text-slate-400 text-xs font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-8 py-5">المستخدم</th>
                                    <th className="px-8 py-5">البريد الإلكتروني</th>
                                    <th className="px-8 py-5">الرصيد</th>
                                    <th className="px-8 py-5">حالة الاشتراك</th>
                                    <th className="px-8 py-5">الصلاحية</th>
                                    <th className="px-8 py-5 text-left">إجراءات الإدارة</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/[0.03] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center text-brand-primary font-bold">
                                                    {user.name?.[0] || 'U'}
                                                </div>
                                                <span className="font-bold text-white group-hover:text-brand-primary transition-colors">{user.name || 'مستخدم غير معروف'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-slate-400 font-mono text-xs">{user.email}</td>
                                        <td className="px-8 py-6">
                                            <span className="text-green-400 font-bold bg-green-400/10 px-3 py-1 rounded-lg">
                                                {user.wallet?.balance.toFixed(2)} ر.س
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            {user.isPro ? (
                                                <span className="bg-brand-primary/10 text-brand-primary px-3 py-1.5 rounded-xl text-[10px] font-black border border-brand-primary/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">PRO MEMBER</span>
                                            ) : (
                                                <span className="bg-white/5 text-slate-500 px-3 py-1.5 rounded-xl text-[10px] font-black border border-white/5">FREE USER</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black border ${user.role === 'ADMIN' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-slate-500/5 text-slate-500 border-white/5'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => handleTogglePro(user.id)}
                                                    className={`text-[10px] font-black px-4 py-2 rounded-xl transition-all border ${user.isPro
                                                        ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                                                        : 'bg-brand-primary/10 text-brand-primary border-brand-primary/20 hover:bg-brand-primary/20'}`}
                                                >
                                                    {user.isPro ? 'إلغاء الاشتراك' : 'ترقية لـ PRO'}
                                                </button>
                                                <button
                                                    onClick={() => handlePromote(user.id, user.role)}
                                                    className="text-[10px] font-black bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2 rounded-xl border border-white/5 transition-all"
                                                >
                                                    {user.role === 'ADMIN' ? 'تخفيض لـ USER' : 'ترقية لـ ADMIN'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center text-slate-500 font-bold">
                                            لم يتم العثور على أي مستخدمين يطابقون بحثك.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSuite;
