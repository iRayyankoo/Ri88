"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspace } from '@/context/WorkspaceContext';
import { CheckSquare, Clock, Plus, LayoutDashboard, User, Calendar as CalendarIcon, LogIn, LogOut, CheckCircle2, Circle, Calculator, CalendarPlus, Wallet, Plane } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import AccessDenied from '@/components/AccessControl/AccessDenied';
import { useSession } from 'next-auth/react';

// Types
type User = { id: string; name: string | null; image: string | null; email: string | null };
type Task = { id: string; title: string; description: string | null; status: string; assignee: User | null; dueDate: string | null; createdAt: string };
type Attendance = { id: string; date: string; checkIn: string; checkOut: string | null; status: string; notes: string | null; user: User };

export default function HRDashboard() {
    const { currentWorkspace, isLoading: wsLoading, permissions, workspaceRole } = useWorkspace();

    // UI State
    const [activeTab, setActiveTab] = useState<'tasks' | 'attendance'>('tasks');
    const [isCreatingTask, setIsCreatingTask] = useState(false);

    // Data State
    const [tasks, setTasks] = useState<Task[]>([]);
    const [attendanceLog, setAttendanceLog] = useState<Attendance[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    // Form State for new task
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');

    useEffect(() => {
        if (currentWorkspace) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentWorkspace]);

    const fetchData = async () => {
        setIsLoadingData(true);
        try {
            const [tasksRes, attRes] = await Promise.all([
                fetch(`/api/hr/tasks?workspaceId=${currentWorkspace!.id}`),
                fetch(`/api/hr/attendance?workspaceId=${currentWorkspace!.id}`)
            ]);

            if (tasksRes.ok) {
                const data = await tasksRes.json();
                setTasks(data.tasks || []);
            }
            if (attRes.ok) {
                const data = await attRes.json();
                setAttendanceLog(data.attendance || []);
            }
        } catch (error) {
            console.error("Error fetching HR data:", error);
            toast.error("حدث خطأ أثناء تحميل البيانات");
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        const loadingToast = toast.loading("جاري إضافة المهمة...");
        try {
            const res = await fetch('/api/hr/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workspaceId: currentWorkspace!.id,
                    title: newTaskTitle,
                    description: newTaskDesc,
                })
            });

            if (res.ok) {
                toast.success("تمت إضافة المهمة بنجاح", { id: loadingToast });
                setIsCreatingTask(false);
                setNewTaskTitle('');
                setNewTaskDesc('');
                fetchData(); // Refresh list
            } else {
                const data = await res.json();
                toast.error(data.error || "فشل إضافة المهمة", { id: loadingToast });
            }
        } catch {
            toast.error("فشل في تحميل المهام", { id: loadingToast });
        }
    };

    const handleCheckInOut = async (action: 'check-in' | 'check-out') => {
        const loadingToast = toast.loading(action === 'check-in' ? "جاري تسجيل الدخول..." : "جاري تسجيل الانصراف...");
        try {
            const res = await fetch('/api/hr/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workspaceId: currentWorkspace!.id,
                    action: action
                })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(action === 'check-in' ? "تم تسجيل الدخول بنجاح" : "تم تسجيل الانصراف", { id: loadingToast });
                fetchData();
            } else {
                toast.error(data.error || "فشلت العملية", { id: loadingToast });
            }
        } catch {
            toast.error("خطأ بالاتصال", { id: loadingToast });
        }
    };

    // Helper functions
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    };

    const { data: session } = useSession();
    const isAdmin = session?.user?.role === 'ADMIN' || workspaceRole === 'ADMIN' || workspaceRole === 'OWNER';
    const canAccess = isAdmin || (permissions && permissions['can_manage_tasks'] === true);

    if (wsLoading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    if (!currentWorkspace) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh]">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 text-slate-500">
                    <User size={32} />
                </div>
                <h2 className="text-xl font-black text-white">الرجاء اختيار مساحة عمل أولاً</h2>
                <p className="text-slate-500 text-sm mt-2">نظام الموارد البشرية يعمل تحت مظلة الشركة المحددة.</p>
            </div>
        );
    }

    if (!canAccess) {
        return <AccessDenied moduleName="الموارد البشرية (HR)" />;
    }

    // Check if the current user has already checked in today
    const hasCheckedInToday = attendanceLog.some(a => {
        const recordDate = new Date(a.date).toDateString();
        const today = new Date().toDateString();
        // Assuming user check matches logic in production, doing simple frontend check for UI
        return recordDate === today;
    });

    const hasCheckedOutToday = attendanceLog.some(a => {
        const recordDate = new Date(a.date).toDateString();
        const today = new Date().toDateString();
        return recordDate === today && a.checkOut !== null;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header section */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-2xl flex flex-shrink-0 items-center justify-center border border-brand-primary/20 backdrop-blur-md">
                        <User className="w-7 h-7 text-brand-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white font-cairo tracking-tight">الموارد البشرية (HR)</h1>
                        <p className="text-text-muted mt-1 font-medium text-sm flex items-center gap-2">
                            إدارة المهام والحضور لـ <span className="text-brand-primary font-bold">{currentWorkspace.name}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-400 border border-border-subtle bg-surface-base px-4 py-2 rounded-xl">
                        {formatDate(new Date().toISOString())}
                    </span>

                    {!hasCheckedInToday ? (
                        <button
                            onClick={() => handleCheckInOut('check-in')}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
                        >
                            <span>تسجيل حضور</span>
                            <LogIn size={16} />
                        </button>
                    ) : !hasCheckedOutToday ? (
                        <button
                            onClick={() => handleCheckInOut('check-out')}
                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 px-4 py-2 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
                        >
                            <span>تسجيل انصراف</span>
                            <LogOut size={16} />
                        </button>
                    ) : (
                        <span className="bg-slate-500/10 text-slate-400 border border-slate-500/20 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2">
                            <span>اكتمل دوام اليوم</span>
                            <CheckCircle2 size={16} />
                        </span>
                    )}

                    {activeTab === 'tasks' && (
                        <button
                            onClick={() => setIsCreatingTask(true)}
                            className="bg-brand-primary hover:bg-brand-primary/90 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:-translate-y-0.5 flex items-center gap-2"
                        >
                            <span>مهمة جديدة</span>
                            <Plus size={16} />
                        </button>
                    )}
                </div>
            </header>

            {/* Suggested Tools Section */}
            <div className="flex w-full overflow-x-auto no-scrollbar gap-3 pb-2 pt-2 snap-x animate-in slide-in-from-right-8 duration-500 delay-100">
                <div className="flex items-center shrink-0 ml-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">أدوات مقترحة:</span>
                </div>
                <Link href="/tools?id=net-salary" className="snap-center shrink-0 flex items-center gap-2 bg-gradient-to-l from-brand-primary/10 to-transparent border border-brand-primary/20 hover:border-brand-primary/50 text-brand-primary px-4 py-2 rounded-xl text-xs font-bold transition-all hover:bg-brand-primary/20">
                    <Wallet size={14} /> حاسبة الراتب الصافي
                </Link>
                <Link href="/tools?id=saudi-eos" className="snap-center shrink-0 flex items-center gap-2 bg-surface-raised border border-border-strong hover:border-text-muted text-text-primary px-4 py-2 rounded-xl text-xs font-bold transition-all hover:bg-surface-glass">
                    <Calculator size={14} className="text-slate-400" /> مكافأة نهاية الخدمة
                </Link>
                <Link href="/tools?id=saudi-leave" className="snap-center shrink-0 flex items-center gap-2 bg-surface-raised border border-border-strong hover:border-text-muted text-text-primary px-4 py-2 rounded-xl text-xs font-bold transition-all hover:bg-surface-glass">
                    <Plane size={14} className="text-slate-400" /> حاسبة الإجازات
                </Link>
                <Link href="/tools?id=time-add" className="snap-center shrink-0 flex items-center gap-2 bg-surface-raised border border-border-strong hover:border-text-muted text-text-primary px-4 py-2 rounded-xl text-xs font-bold transition-all hover:bg-surface-glass">
                    <CalendarPlus size={14} className="text-slate-400" /> إضافة تاريخ
                </Link>
            </div>

            {/* Navigation Tabs */}
            <div className="flex w-full overflow-x-auto no-scrollbar border-b border-border-subtle relative">
                <div className="flex min-w-max gap-8 px-2">
                    <button
                        onClick={() => setActiveTab('tasks')}
                        className={`pb-4 text-sm font-bold transition-colors relative flex items-center gap-2 ${activeTab === 'tasks' ? 'text-brand-primary' : 'text-text-muted hover:text-white'}`}
                    >
                        <CheckSquare className="w-4 h-4" />
                        المهام والمشاريع
                        {activeTab === 'tasks' && (
                            <motion.div layoutId="hr-active-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-t-full shadow-[0_-2px_8px_rgba(139,92,246,0.5)]" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('attendance')}
                        className={`pb-4 text-sm font-bold transition-colors relative flex items-center gap-2 ${activeTab === 'attendance' ? 'text-brand-primary' : 'text-text-muted hover:text-white'}`}
                    >
                        <Clock className="w-4 h-4" />
                        سجل الحضور والانصراف
                        {activeTab === 'attendance' && (
                            <motion.div layoutId="hr-active-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-t-full shadow-[0_-2px_8px_rgba(139,92,246,0.5)]" />
                        )}
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="relative min-h-[400px]">
                {isLoadingData ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="w-8 h-8 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {activeTab === 'tasks' && (
                            <motion.div
                                key="tasks"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                {isCreatingTask && (
                                    <div className="bg-surface-base border border-border-subtle rounded-2xl p-4 mb-6">
                                        <form onSubmit={handleCreateTask} className="space-y-4">
                                            <div>
                                                <input
                                                    type="text"
                                                    required
                                                    value={newTaskTitle}
                                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                                    placeholder="عنوان المهمة..."
                                                    className="w-full bg-surface-raised border border-border-subtle rounded-xl px-4 py-3 text-sm text-white focus:border-brand-primary outline-none transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <textarea
                                                    value={newTaskDesc}
                                                    onChange={(e) => setNewTaskDesc(e.target.value)}
                                                    placeholder="وصف المهمة (اختياري)..."
                                                    rows={2}
                                                    className="w-full bg-surface-raised border border-border-subtle rounded-xl px-4 py-3 text-sm text-white focus:border-brand-primary outline-none transition-colors resize-none"
                                                />
                                            </div>
                                            <div className="flex justify-end gap-3 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsCreatingTask(false)}
                                                    className="px-4 py-2 text-sm font-bold text-text-muted hover:text-white transition-colors"
                                                >
                                                    إلغاء
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-6 py-2 bg-brand-primary text-white text-sm font-bold rounded-xl hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/20"
                                                >
                                                    حفظ وإضافة
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {tasks.length === 0 ? (
                                    <div className="text-center py-20 bg-surface-base/50 rounded-3xl border border-border-subtle border-dashed">
                                        <CheckSquare className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-50" />
                                        <h3 className="text-lg font-bold text-white mb-2">لا توجد مهام مسجلة</h3>
                                        <p className="text-text-muted text-sm max-w-sm mx-auto">
                                            قم بإضافة أول مهمة لفريقك في مساحة العمل وابدأ التتبع.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {tasks.map(task => (
                                            <div key={task.id} className="bg-surface-base border border-border-subtle hover:border-border-strong rounded-2xl p-5 transition-colors group cursor-pointer flex flex-col h-full">
                                                <div className="flex items-start justify-between mb-3">
                                                    <h3 className="text-base font-bold text-white leading-tight">{task.title}</h3>
                                                    {task.status === 'TODO' && <Circle className="w-5 h-5 text-slate-400 group-hover:text-brand-primary transition-colors flex-shrink-0" />}
                                                    {task.status === 'IN_PROGRESS' && <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />}
                                                    {task.status === 'DONE' && <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
                                                </div>

                                                {task.description && (
                                                    <p className="text-sm text-text-muted mb-4 line-clamp-2 flex-grow">{task.description}</p>
                                                )}

                                                <div className="mt-auto pt-4 border-t border-border-subtle flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {task.assignee ? (
                                                            <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center text-xs font-bold text-brand-primary">
                                                                {task.assignee.name?.[0]?.toUpperCase() || 'U'}
                                                            </div>
                                                        ) : (
                                                            <div className="w-6 h-6 rounded-full bg-surface-raised flex items-center justify-center">
                                                                <User className="w-3 h-3 text-slate-500" />
                                                            </div>
                                                        )}
                                                        <span className="text-xs text-slate-400 truncate max-w-[100px]">
                                                            {task.assignee?.name || 'غير معين'}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                                                        <CalendarIcon className="w-3 h-3" />
                                                        {formatDate(task.createdAt)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'attendance' && (
                            <motion.div
                                key="attendance"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="bg-surface-base border border-border-subtle rounded-3xl overflow-hidden shadow-2xl">
                                    <div className="overflow-x-auto min-h-[300px]">
                                        <table className="w-full text-right text-sm">
                                            <thead>
                                                <tr className="border-b border-border-subtle bg-surface-raised/50">
                                                    <th className="py-4 px-6 font-bold text-text-muted">الموظف</th>
                                                    <th className="py-4 px-6 font-bold text-text-muted">التاريخ</th>
                                                    <th className="py-4 px-6 font-bold text-text-muted">وقت الدخول</th>
                                                    <th className="py-4 px-6 font-bold text-text-muted">وقت الانصراف</th>
                                                    <th className="py-4 px-6 font-bold text-text-muted">الساعات </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {attendanceLog.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} className="py-16 text-center text-text-muted font-medium">
                                                            لا توجد سجلات حضور حتى الآن
                                                        </td>
                                                    </tr>
                                                ) : attendanceLog.map((log) => {
                                                    let hoursStr = '-';
                                                    if (log.checkIn && log.checkOut) {
                                                        const inTime = new Date(log.checkIn);
                                                        const outTime = new Date(log.checkOut);
                                                        const diff = Number(outTime) - Number(inTime);
                                                        const hours = Math.floor(diff / (1000 * 60 * 60));
                                                        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                                                        hoursStr = `${hours}س ${minutes}د`;
                                                    }

                                                    return (
                                                        <tr key={log.id} className="border-b border-border-subtle/50 hover:bg-surface-raised/50 transition-colors">
                                                            <td className="py-4 px-6 border-l border-border-subtle/10">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                                                                        {log.user?.name?.charAt(0) || 'U'}
                                                                    </div>
                                                                    <div className="font-bold text-white">{log.user?.name || 'مستخدم'}</div>
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-6 font-medium text-slate-300 border-l border-border-subtle/10">
                                                                {formatDate(log.date)}
                                                            </td>
                                                            <td className="py-4 px-6 font-bold text-emerald-400 border-l border-border-subtle/10">
                                                                {formatTime(log.checkIn)}
                                                            </td>
                                                            <td className="py-4 px-6 font-bold text-rose-400 border-l border-border-subtle/10">
                                                                {log.checkOut ? formatTime(log.checkOut) : <span className="text-slate-500 font-normal">قيد العمل...</span>}
                                                            </td>
                                                            <td className="py-4 px-6 text-brand-primary font-bold bg-brand-primary/5">
                                                                {hoursStr}
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}

