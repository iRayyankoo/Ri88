"use client";
import React, { useEffect, useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Plus, Search, Receipt, TrendingUp, HandCoins, Calendar, MoreVertical, CheckCircle2, Clock, AlertCircle, Printer } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import AccessDenied from '@/components/AccessControl/AccessDenied';
import { useSession } from 'next-auth/react';

interface Invoice {
    id: string;
    number: string;
    client: { name: string, company: string | null } | null;
    status: string;
    issueDate: string;
    dueDate: string | null;
    totalAmount: number;
}

export default function FinanceDashboard() {
    const { currentWorkspace, permissions, workspaceRole } = useWorkspace();
    const { data: session } = useSession();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchInvoices = async () => {
        if (!currentWorkspace) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/finance/invoices?workspaceId=${currentWorkspace.id}`);
            if (res.ok) {
                const data = await res.json();
                setInvoices(data.invoices || []);
            }
        } catch (error) {
            console.error("Error fetching invoices:", error);
            toast.error("فشل في تحميل الفواتير");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (currentWorkspace?.id) {
            fetchInvoices();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentWorkspace]);

    const handleStatusChange = async (id: string, newStatus: string) => {
        if (!currentWorkspace) return;

        // Optimistic update
        setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));

        try {
            const res = await fetch('/api/finance/invoices', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workspaceId: currentWorkspace.id, id, status: newStatus })
            });
            if (!res.ok) {
                toast.error("حدث خطأ أثناء التحديث");
                fetchInvoices(); // revert
            }
        } catch (error) {
            console.error("Error updating invoice:", error);
        }
    };

    const handlePrint = () => {
        // Simple print implementation for now
        toast.info("جاري فحص اتصال الطابعة...");
        window.print();
    };

    // Calculate metrics
    const totalRevenue = invoices.filter(i => i.status === 'PAID').reduce((sum, inv) => sum + inv.totalAmount, 0);
    const pendingRevenue = invoices.filter(i => i.status === 'SENT').reduce((sum, inv) => sum + inv.totalAmount, 0);
    const draftedInvoicesCount = invoices.filter(i => i.status === 'DRAFT').length;

    const isAdmin = session?.user?.role === 'ADMIN' || workspaceRole === 'ADMIN' || workspaceRole === 'OWNER';
    const canAccess = isAdmin || (permissions && permissions['can_access_finance'] === true);

    if (!currentWorkspace) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh]">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 text-slate-500">
                    <Receipt size={32} />
                </div>
                <h2 className="text-xl font-black text-white">الرجاء اختيار مساحة عمل أولاً</h2>
            </div>
        );
    }

    if (!canAccess) {
        return <AccessDenied moduleName="الإدارة المالية والفواتير" />;
    }

    return (
        <div className="space-y-6 pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-brand-primary mb-1">
                        <Receipt size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">الإدارة المالية والفواتير</span>
                    </div>
                    <h1 className="text-2xl font-black text-white font-cairo">المالية</h1>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href="/pro/finance/invoices/new"
                        className="h-11 px-6 flex items-center justify-center gap-2 rounded-xl bg-brand-primary text-black font-black text-sm hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 active:scale-95"
                    >
                        <Plus size={18} strokeWidth={3} />
                        فاتورة جديدة
                    </Link>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-surface-base border border-border-subtle p-5 rounded-2xl shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                                <TrendingUp size={18} />
                            </div>
                            <span className="text-xs font-bold text-text-muted">الإيرادات المحصلة</span>
                        </div>
                        <h3 className="text-3xl font-black text-white flex items-end gap-1">
                            {totalRevenue.toLocaleString('ar-SA')} ر.س <span className="text-sm font-bold text-emerald-500 mb-1">+المدفوعة</span>
                        </h3>
                    </div>
                </div>

                <div className="bg-surface-base border border-border-subtle p-5 rounded-2xl shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-brand-primary/20 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
                                <HandCoins size={18} />
                            </div>
                            <span className="text-xs font-bold text-text-muted">مبالغ مستحقة</span>
                        </div>
                        <h3 className="text-3xl font-black text-white flex items-end gap-1">
                            {pendingRevenue.toLocaleString('ar-SA')} ر.س <span className="text-sm font-bold text-brand-primary mb-1">بانتظار الدفع</span>
                        </h3>
                    </div>
                </div>

                <div className="bg-surface-base border border-border-subtle p-5 rounded-2xl shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                <Receipt size={18} />
                            </div>
                            <span className="text-xs font-bold text-text-muted">مسودات الفواتير</span>
                        </div>
                        <h3 className="text-3xl font-black text-white flex items-end gap-1">
                            {draftedInvoicesCount} <span className="text-sm font-bold text-text-muted mb-1">مسودة غير مرسلة</span>
                        </h3>
                    </div>
                </div>
            </div>

            {/* Invoices List */}
            <div className="bg-surface-base border border-border-strong rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-border-subtle bg-surface-raised flex items-center justify-between">
                    <h2 className="text-lg font-black text-white font-cairo flex items-center gap-2">
                        سجل الفواتير
                    </h2>
                    <div className="relative w-64">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="ابحث عن فاتورة..."
                            className="w-full h-9 bg-surface-base border border-border-subtle rounded-lg pr-9 pl-3 text-sm text-foreground placeholder:text-text-muted outline-none focus:border-brand-primary/50 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-right min-w-[800px]">
                        <thead>
                            <tr className="bg-surface-raised border-b border-border-subtle">
                                <th className="py-3 px-6 text-[10px] font-black text-text-muted uppercase tracking-wider">رقم الفاتورة</th>
                                <th className="py-3 px-6 text-[10px] font-black text-text-muted uppercase tracking-wider">العميل</th>
                                <th className="py-3 px-6 text-[10px] font-black text-text-muted uppercase tracking-wider">التاريخ</th>
                                <th className="py-3 px-6 text-[10px] font-black text-text-muted uppercase tracking-wider">المبلغ الإجمالي</th>
                                <th className="py-3 px-6 text-[10px] font-black text-text-muted uppercase tracking-wider">الحالة</th>
                                <th className="py-3 px-6 text-[10px] font-black text-text-muted uppercase tracking-wider text-left">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-text-muted">
                                        <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                                    </td>
                                </tr>
                            ) : invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-text-muted flex flex-col items-center justify-center">
                                        <Receipt size={32} className="opacity-20 mb-3" />
                                        لا توجد فواتير بعد
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-surface-glass transition-colors">
                                        <td className="py-4 px-6">
                                            <span className="text-sm font-bold text-brand-secondary font-mono bg-brand-secondary/10 px-2 py-1 rounded-md">
                                                {invoice.number}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            {invoice.client ? (
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white">{invoice.client.name}</span>
                                                    {invoice.client.company && <span className="text-[10px] text-text-muted">{invoice.client.company}</span>}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-text-muted">-</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-slate-300 flex items-center gap-1.5"><Calendar className="w-3 h-3 text-brand-primary" /> {new Date(invoice.issueDate).toLocaleDateString('ar-SA')}</span>
                                                {invoice.dueDate && (
                                                    <span className="text-[10px] text-text-muted flex items-center gap-1.5"><Clock className="w-3 h-3" /> يستحق: {new Date(invoice.dueDate).toLocaleDateString('ar-SA')}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm font-black text-white tabular-nums">{invoice.totalAmount.toLocaleString('ar-SA')} ر.س</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="relative group inline-block">
                                                <select
                                                    title="تغيير حالة الفاتورة"
                                                    value={invoice.status}
                                                    onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                                                    className={`appearance-none bg-transparent outline-none cursor-pointer pr-8 pl-2 py-1.5 rounded-md text-xs font-black uppercase tracking-wider border transition-all
                                                        ${invoice.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:border-emerald-500/50' :
                                                            invoice.status === 'SENT' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:border-blue-500/50' :
                                                                invoice.status === 'DRAFT' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20 hover:border-slate-500/50' :
                                                                    'bg-red-500/10 text-red-500 border-red-500/20 hover:border-red-500/50'}
                                                    `}
                                                >
                                                    <option value="DRAFT" className="bg-surface-base text-white">مسودة</option>
                                                    <option value="SENT" className="bg-surface-base text-white">مرسلة</option>
                                                    <option value="PAID" className="bg-surface-base text-white">مدفوعة</option>
                                                    <option value="CANCELLED" className="bg-surface-base text-white">ملغاة</option>
                                                </select>
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    {invoice.status === 'PAID' ? <CheckCircle2 size={12} className="text-emerald-500" /> :
                                                        invoice.status === 'CANCELLED' ? <AlertCircle size={12} className="text-red-500" /> :
                                                            <div className="w-2 h-2 rounded-full bg-current opacity-50"></div>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-left">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handlePrint()}
                                                    className="p-2 text-text-muted hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                                                    title="طباعة"
                                                >
                                                    <Printer size={16} />
                                                </button>
                                                <button className="p-2 text-text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="خيارات إضافية">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    nav, aside, button, footer, .no-print {
                        display: none !important;
                    }
                    body {
                        background: white !important;
                        color: black !important;
                    }
                    .bg-surface-base, .bg-surface-raised {
                        background: white !important;
                        border: 1px solid #eee !important;
                        box-shadow: none !important;
                    }
                    .text-white, .text-text-primary {
                        color: black !important;
                    }
                    .text-text-muted, .text-slate-500 {
                        color: #666 !important;
                    }
                    table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                    }
                    th, td {
                        border: 1px solid #eee !important;
                        padding: 8px !important;
                    }
                }
            `}</style>
        </div>
    );
}
