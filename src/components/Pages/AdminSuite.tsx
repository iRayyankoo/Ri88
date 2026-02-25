"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Activity, ShieldCheck } from 'lucide-react';
import { updateUserRole, toggleProStatus } from '@/app/actions/admin';
import { toast } from 'sonner';
import { useNavigation } from '@/context/NavigationContext';
import { tools as staticTools } from '@/data/tools';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
    isStatic?: boolean;
}

const AdminSuite = () => {
    const { userRole } = useNavigation();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [users, setUsers] = useState<UserData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isUnauthorized, setIsUnauthorized] = useState(false);

    // New State for Tabs and Tools
    const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'tools'>('analytics');
    const [tools, setTools] = useState<DbTool[]>([]);
    const [isLoadingTools, setIsLoadingTools] = useState(true);
    const [activeToolDropdown, setActiveToolDropdown] = useState<string | null>(null);
    const [analyticsData, setAnalyticsData] = useState<any>(null);

    const loadData = useCallback(async () => {
        try {
            setIsUnauthorized(false);
            const { getAdminStats, getUsers, getAdminTools, getAdminAnalytics } = await import('@/app/actions/admin');

            const [statsData, usersData, toolsRes, analyticsRes] = await Promise.all([
                getAdminStats(),
                getUsers(),
                getAdminTools(),
                getAdminAnalytics()
            ]);
            setStats(statsData);
            setUsers(usersData);
            setAnalyticsData(analyticsRes);
            if (toolsRes && toolsRes.tools) {
                // Map static tools to DbTool structure
                const mappedStaticTools: DbTool[] = staticTools.map(st => ({
                    id: st.id,
                    name: st.titleAr || st.title,
                    description: st.descAr || st.desc,
                    category: st.cat,
                    icon: st.icon,
                    isPremium: false,
                    isActive: true,
                    isMaintenance: false,
                    isFreeForLimitedTime: false,
                    createdAt: new Date(),
                    isStatic: true
                }));

                // Ensure db tools map structure if missing props
                const mappedDbTools: DbTool[] = toolsRes.tools.map((t: any) => ({
                    id: t.id,
                    name: t.name,
                    category: t.category,
                    icon: t.icon,
                    isPremium: t.isPremium || false,
                    isActive: t.isActive !== false,
                    isMaintenance: t.isMaintenance || false,
                    isFreeForLimitedTime: t.isFreeForLimitedTime || false,
                    createdAt: t.createdAt || new Date(),
                    description: t.description || '',
                    isStatic: false
                }));

                // Combine them without duplicates (if static tool is now in DB, use the DB version)
                const dbIds = new Set(mappedDbTools.map(t => t.id));
                const filteredStaticTools = mappedStaticTools.filter(st => !dbIds.has(st.id));
                const combinedTools = [...mappedDbTools, ...filteredStaticTools];
                setTools(combinedTools);
            }
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
            setIsLoadingTools(false);
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

    const handleUpdateTool = async (tool: DbTool, data: Partial<DbTool>) => {
        const toastId = toast.loading("جاري تحديث الأداة...");
        const { updateToolState } = await import('@/app/actions/admin');
        const res = await updateToolState(tool.id, data);

        if (res.error) {
            toast.error(res.error, { id: toastId });
        } else {
            toast.success(res.success, { id: toastId });
            setActiveToolDropdown(null);
            loadData();
        }
    };

    if (isUnauthorized || userRole !== 'admin') return (
        <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-6 text-center">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                <ShieldCheck className="w-10 h-10" />
            </div>
            <div className="space-y-2">
                <h3 className="text-2xl font-black text-text-primary">وصول غير مصرح به</h3>
                <p className="text-text-muted max-w-sm">ليس لديك الصلاحيات الكافية لعرض هذه الصفحة. يرجى التأكد من تسجيل الدخول بحساب المدير.</p>
            </div>
        </div>
    );

    if (loading) return (
        <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
            <p className="text-text-muted font-bold animate-pulse">جاري تحميل لوحة التحكم...</p>
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-border-subtle">
                <div className="space-y-2 text-right">
                    <h2 className="text-4xl font-black text-text-primary bg-clip-text text-transparent bg-gradient-to-l from-text-primary via-text-primary to-text-primary/50">لوحة الإدارة الرائعة</h2>
                    <p className="text-text-muted font-medium">تحكم في كامل المنصة وراقب الأداء لحظة بلحظة.</p>
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
                        <div className="absolute top-0 right-0 w-32 h-32 bg-surface-glass blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-primary/10 transition-all" />
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className={`w-12 h-12 rounded-2xl bg-surface-glass flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="text-4xl font-black text-text-primary mb-2 relative z-10 tracking-tight">{stat.value}</h3>
                        <p className="text-text-muted text-sm font-bold uppercase tracking-widest relative z-10">{stat.title}</p>
                    </motion.div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-4 border-b border-border-subtle overflow-x-auto no-scrollbar">
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-6 py-4 font-bold text-sm flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${activeTab === 'analytics' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-text-muted hover:text-text-primary'
                        }`}
                >
                    <Activity className="w-4 h-4" /> الإحصائيات (Analytics)
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-6 py-4 font-bold text-sm flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${activeTab === 'users' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-text-muted hover:text-text-primary'
                        }`}
                >
                    <Users className="w-4 h-4" /> إدارة المستخدمين
                </button>
                <button
                    onClick={() => setActiveTab('tools')}
                    className={`px-6 py-4 font-bold text-sm flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${activeTab === 'tools' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-text-muted hover:text-text-primary'
                        }`}
                >
                    <Activity className="w-4 h-4" /> إدارة الأدوات والتحكم
                </button>
            </div>

            {/* Analytics Tab */}
            {activeTab === 'analytics' && analyticsData && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Users Growth Chart */}
                        <div className="bg-surface-glass border border-border-subtle rounded-3xl p-6 lg:p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                            <h3 className="text-xl font-black text-text-primary mb-6 relative z-10 font-cairo">نمو المستخدمين (آخر 7 أيام)</h3>
                            <div className="h-[300px] w-full relative z-10 text-xs font-cairo" dir="ltr">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={analyticsData.userGrowthData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                                        <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
                                        <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: '16px', color: 'var(--text-primary)' }}
                                            itemStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
                                        />
                                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                        <Line type="monotone" dataKey="users" name="المستخدمين الجدد" stroke="#8B5CF6" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                                        <Line type="monotone" dataKey="proUsers" name="مشتراكات PRO" stroke="#10b981" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Tool Categories Chart */}
                        <div className="bg-surface-glass border border-border-subtle rounded-3xl p-6 lg:p-8 relative overflow-hidden group">
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
                            <h3 className="text-xl font-black text-text-primary mb-6 relative z-10 font-cairo">توزيع الأدوات المتوفرة بالمنصة</h3>
                            <div className="h-[300px] w-full relative z-10 text-xs font-cairo" dir="ltr">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={analyticsData.categoriesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                                        <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
                                        <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} allowDecimals={false} />
                                        <Tooltip
                                            cursor={{ fill: 'var(--border-subtle)' }}
                                            contentStyle={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: '16px', color: 'var(--text-primary)' }}
                                            itemStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
                                        />
                                        <Bar dataKey="value" name="عدد الأدوات" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h3 className="text-2xl font-black text-text-primary flex items-center gap-3">
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
                                className="w-full bg-surface-glass border border-border-subtle rounded-2xl py-3 pr-11 pl-4 text-text-primary focus:border-brand-primary/50 outline-none transition-all focus:bg-surface-raised"
                            />
                        </div>
                    </div>

                    <div className="stitch-glass rounded-3xl overflow-hidden border border-border-strong">
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead className="bg-surface-glass text-text-muted text-xs font-black uppercase tracking-widest">
                                    <tr>
                                        <th className="px-8 py-5">المستخدم</th>
                                        <th className="px-8 py-5">البريد الإلكتروني</th>
                                        <th className="px-8 py-5">الرصيد</th>
                                        <th className="px-8 py-5">حالة الاشتراك</th>
                                        <th className="px-8 py-5">الصلاحية</th>
                                        <th className="px-8 py-5 text-left">إجراءات الإدارة</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-subtle text-sm">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-surface-glass transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center text-brand-primary font-bold">
                                                        {user.name?.[0] || 'U'}
                                                    </div>
                                                    <span className="font-bold text-text-primary group-hover:text-brand-primary transition-colors">{user.name || 'مستخدم غير معروف'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-text-muted font-mono text-xs">{user.email}</td>
                                            <td className="px-8 py-6">
                                                <span className="text-green-400 font-bold bg-green-400/10 px-3 py-1 rounded-lg">
                                                    {user.wallet?.balance.toFixed(2)} ر.س
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                {user.isPro ? (
                                                    <span className="bg-brand-primary/10 text-brand-primary px-3 py-1.5 rounded-xl text-[10px] font-black border border-brand-primary/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">PRO MEMBER</span>
                                                ) : (
                                                    <span className="bg-surface-glass text-text-muted px-3 py-1.5 rounded-xl text-[10px] font-black border border-border-subtle">FREE USER</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black border ${user.role === 'ADMIN' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-surface-glass text-text-muted border-border-subtle'}`}>
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
                                                        className="text-[10px] font-black bg-surface-glass hover:bg-surface-raised text-text-primary px-4 py-2 rounded-xl border border-border-subtle transition-all"
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
            )}

            {/* Tools Tab */}
            {activeTab === 'tools' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h3 className="text-2xl font-black text-text-primary flex items-center gap-3">
                            <Activity className="text-brand-primary w-6 h-6" />
                            التحكم في الأدوات
                        </h3>
                    </div>

                    <div className="stitch-glass rounded-3xl overflow-hidden border border-border-strong">
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead className="bg-surface-glass text-text-muted text-xs font-black uppercase tracking-widest">
                                    <tr>
                                        <th className="px-8 py-5">اسم الأداة</th>
                                        <th className="px-8 py-5">القسم</th>
                                        <th className="px-8 py-5">تعتبر كـ</th>
                                        <th className="px-8 py-5">الحالة العامة</th>
                                        <th className="px-8 py-5 text-left">إجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-subtle text-sm">
                                    {isLoadingTools ? (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-20 text-center text-text-muted font-bold">
                                                جاري تحميل الأدوات...
                                            </td>
                                        </tr>
                                    ) : tools.map((tool) => (
                                        <tr key={tool.id} className="hover:bg-surface-glass transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-text-primary text-base">{tool.name}</span>
                                                </div>
                                            </td>

                                            <td className="px-8 py-6">
                                                <span className="text-text-muted text-xs font-mono bg-surface-glass px-3 py-1.5 rounded-xl border border-border-subtle">{tool.category}</span>
                                            </td>

                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-2 w-fit">
                                                    <span className={`px-3 py-1.5 flex items-center gap-1.5 rounded-xl text-[10px] font-black w-fit border ${tool.isPremium
                                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                                                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'}`}>
                                                        {tool.isPremium ? 'PRO TOOL' : 'FREE TOOL'}
                                                    </span>
                                                    {tool.isFreeForLimitedTime && (
                                                        <span className="px-3 py-1.5 flex items-center gap-1.5 rounded-xl text-[10px] font-black w-fit bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                                                            LIMITED FREE
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-8 py-6">
                                                {tool.isActive ? (
                                                    tool.isMaintenance ? (
                                                        <span className="text-amber-500 text-xs font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 w-fit">تحت الصيانة 🛠️</span>
                                                    ) : (
                                                        <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 w-fit">فعالة ✅</span>
                                                    )
                                                ) : (
                                                    <span className="text-text-muted text-xs font-bold bg-surface-glass px-3 py-1.5 rounded-xl border border-border-strong w-fit">مخفية 👁️‍🗨️</span>
                                                )}
                                            </td>

                                            <td className="px-8 py-6 text-left relative">
                                                <button
                                                    onClick={() => setActiveToolDropdown(activeToolDropdown === tool.id ? null : tool.id)}
                                                    className="p-2 rounded-xl hover:bg-surface-glass text-text-muted transition-colors inline-block border border-transparent hover:border-border-subtle"
                                                >
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-1 h-1 bg-current rounded-full" />
                                                        <div className="w-1 h-1 bg-current rounded-full" />
                                                        <div className="w-1 h-1 bg-current rounded-full" />
                                                    </div>
                                                </button>

                                                {/* Dropdown Menu */}
                                                {activeToolDropdown === tool.id && (
                                                    <div className="absolute left-8 top-1/2 z-50 mt-1 w-48 bg-surface-raised border border-border-subtle rounded-2xl shadow-2xl py-2 overflow-hidden">
                                                        <div className="absolute inset-0 bg-black/40 pointer-events-none" />

                                                        {/* Actions */}
                                                        <button onClick={() => handleUpdateTool(tool, { isPremium: !tool.isPremium })} className="relative w-full text-right px-4 py-2 hover:bg-surface-glass text-xs font-bold text-text-primary transition-colors">
                                                            {tool.isPremium ? 'جعلها مجانية' : 'تحويل لـ PRO'}
                                                        </button>
                                                        <button onClick={() => handleUpdateTool(tool, { isFreeForLimitedTime: !tool.isFreeForLimitedTime })} className="relative w-full text-right px-4 py-2 hover:bg-surface-glass text-xs font-bold text-text-primary transition-colors">
                                                            {tool.isFreeForLimitedTime ? 'إلغاء المؤقت' : 'مجاني لفترة'}
                                                        </button>
                                                        <div className="h-px w-full bg-border-subtle my-1 relative" />
                                                        <button onClick={() => handleUpdateTool(tool, { isActive: !tool.isActive })} className="relative w-full text-right px-4 py-2 hover:bg-surface-glass text-xs font-bold text-text-primary transition-colors">
                                                            {tool.isActive ? 'إخفاء الأداة' : 'إظهار الأداة'}
                                                        </button>
                                                        <button onClick={() => handleUpdateTool(tool, { isMaintenance: !tool.isMaintenance })} className="relative w-full text-right px-4 py-2 hover:bg-surface-glass text-xs font-bold text-text-primary transition-colors">
                                                            {tool.isMaintenance ? 'إنهاء الصيانة' : 'تفعيل وضع الصيانة'}
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSuite;
