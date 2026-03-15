"use client";
import React, { useState, useEffect } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useRouter } from 'next/navigation';
import { Save, ArrowRight, Plus, Trash2, Building } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

interface Client {
    id: string;
    name: string;
    company: string | null;
}

export default function NewInvoicePage() {
    const { currentWorkspace } = useWorkspace();
    const router = useRouter();

    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<string>('');
    const [issueDate, setIssueDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState<string>('');
    const [items, setItems] = useState<InvoiceItem[]>([
        { id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 }
    ]);
    const [taxRate, setTaxRate] = useState<number>(15);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!currentWorkspace) return;

        const fetchClients = async () => {
            try {
                const res = await fetch(`/api/crm/clients?workspaceId=${currentWorkspace.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setClients(data.clients || []);
                }
            } catch (error) {
                console.error("Error fetching clients", error);
            }
        };
        fetchClients();
    }, [currentWorkspace]);

    const handleAddItem = () => {
        setItems([
            ...items,
            { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0, total: 0 }
        ]);
    };

    const handleRemoveItem = (id: string) => {
        if (items.length === 1) return;
        setItems(items.filter(item => item.id !== id));
    };

    const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value };
                if (field === 'quantity' || field === 'unitPrice') {
                    updatedItem.total = Number(updatedItem.quantity) * Number(updatedItem.unitPrice);
                }
                return updatedItem;
            }
            return item;
        }));
    };

    const subTotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subTotal * taxRate) / 100;
    const totalAmount = subTotal + taxAmount;

    const handleSave = async () => {
        if (!currentWorkspace) return;

        // Basic validation
        const emptyItems = items.filter(i => !i.description.trim() || i.unitPrice <= 0);
        if (emptyItems.length > 0) {
            toast.error('الرجاء التأكد من تعبئة وصف وسعر جميع العناصر');
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch('/api/finance/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workspaceId: currentWorkspace.id,
                    clientId: selectedClientId || null,
                    issueDate,
                    dueDate: dueDate || null,
                    taxRate,
                    items: items.map(i => ({
                        description: i.description,
                        quantity: Number(i.quantity),
                        unitPrice: Number(i.unitPrice)
                    }))
                })
            });

            if (res.ok) {
                toast.success('تم إصدار الفاتورة بنجاح');
                router.push('/pro/finance');
            } else {
                toast.error('حدث خطأ أثناء إصدار الفاتورة');
            }
        } catch (error) {
            console.error('Error saving invoice:', error);
            toast.error('حدث خطأ غير متوقع');
        } finally {
            setIsSaving(false);
        }
    };

    if (!currentWorkspace) return null;

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/pro/finance" className="w-10 h-10 rounded-xl bg-surface-raised flex items-center justify-center text-text-muted hover:text-white hover:bg-surface-glass transition-all border border-border-subtle hover:border-brand-primary/30">
                        <ArrowRight size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-white font-cairo">إنشاء فاتورة جديدة</h1>
                        <p className="text-sm font-bold text-text-muted">قم بتعبئة تفاصيل الفاتورة وحفظها</p>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-11 px-8 flex items-center justify-center gap-2 rounded-xl bg-brand-primary text-black font-black text-sm hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    ) : (
                        <><Save size={18} strokeWidth={3} /> إرسال وتحفظ</>
                    )}
                </button>
            </div>

            <div className="bg-surface-base border border-border-strong rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 mb-10">
                    {/* Client & Dates */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-300 flex items-center gap-2">
                                <Building size={16} className="text-brand-primary" /> العميل
                            </label>
                            <select
                                title="اختر العميل"
                                value={selectedClientId}
                                onChange={(e) => setSelectedClientId(e.target.value)}
                                className="w-full h-11 bg-surface-raised border border-border-subtle rounded-xl px-4 text-sm text-white outline-none focus:border-brand-primary/50 transition-all font-medium appearance-none"
                            >
                                <option value="">بدون عميل (عميل نقدي)</option>
                                {clients.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ''}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-black text-slate-300">تاريخ الإصدار</label>
                                <input
                                    type="date"
                                    title="تاريخ الإصدار"
                                    value={issueDate}
                                    onChange={(e) => setIssueDate(e.target.value)}
                                    className="w-full h-11 bg-surface-raised border border-border-subtle rounded-xl px-4 text-sm text-white outline-none focus:border-brand-primary/50 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-black text-slate-300">تاريخ الاستحقاق <span className="text-xs font-normal text-slate-500">(اختياري)</span></label>
                                <input
                                    type="date"
                                    title="تاريخ الاستحقاق"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full h-11 bg-surface-raised border border-border-subtle rounded-xl px-4 text-sm text-white outline-none focus:border-brand-primary/50 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Invoice Meta */}
                    <div className="bg-surface-raised rounded-2xl p-6 border border-border-subtle flex flex-col justify-center space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-border-subtle">
                            <span className="text-sm font-bold text-text-muted">رقم الفاتورة</span>
                            <span className="text-sm font-black text-brand-secondary">يُولد تلقائياً</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-text-muted">نوع الضريبة</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    title="نسبة الضريبة"
                                    value={taxRate}
                                    onChange={(e) => setTaxRate(Number(e.target.value))}
                                    className="w-16 h-8 bg-surface-base border border-border-strong rounded-lg px-2 text-center text-sm font-bold text-white outline-none focus:border-brand-primary/50"
                                />
                                <span className="text-sm font-bold text-slate-400">%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="space-y-4 relative z-10">
                    <h3 className="text-lg font-black text-white font-cairo">تفاصيل الخدمات / المنتجات</h3>

                    <div className="bg-surface-raised border border-border-subtle rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-right min-w-[700px]">
                                <thead>
                                    <tr className="border-b border-border-subtle bg-surface-base/50">
                                        <th className="py-3 px-4 text-[10px] font-black text-text-muted uppercase w-[50%]">الوصف</th>
                                        <th className="py-3 px-4 text-[10px] font-black text-text-muted uppercase w-[15%]">الكمية</th>
                                        <th className="py-3 px-4 text-[10px] font-black text-text-muted uppercase w-[15%]">سعر الوحدة</th>
                                        <th className="py-3 px-4 text-[10px] font-black text-text-muted uppercase w-[15%]">المجموع</th>
                                        <th className="py-3 px-4 w-[5%]"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-subtle">
                                    {items.map((item) => (
                                        <tr key={item.id} className="group hover:bg-surface-glass/30 transition-colors">
                                            <td className="p-2">
                                                <input
                                                    type="text"
                                                    placeholder="وصف الخدمة أو المنتج..."
                                                    value={item.description}
                                                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                                    className="w-full h-10 bg-transparent border border-transparent focus:border-brand-primary/30 hover:bg-surface-base/50 rounded-lg px-3 text-sm text-white outline-none transition-all placeholder:text-slate-600 font-medium"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    title="الكمية"
                                                    min="1"
                                                    value={item.quantity === 0 ? '' : item.quantity}
                                                    onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                                                    className="w-full h-10 bg-transparent border border-transparent focus:border-brand-primary/30 hover:bg-surface-base/50 rounded-lg px-3 text-center text-sm text-white outline-none transition-all font-mono"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    title="سعر الوحدة"
                                                    min="0"
                                                    step="0.01"
                                                    value={item.unitPrice === 0 ? '' : item.unitPrice}
                                                    onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                                                    className="w-full h-10 bg-transparent border border-transparent focus:border-brand-primary/30 hover:bg-surface-base/50 rounded-lg px-3 text-center text-sm text-white outline-none transition-all font-mono"
                                                />
                                            </td>
                                            <td className="p-3 text-sm font-bold text-white text-center tabular-nums">
                                                {item.total.toLocaleString('ar-SA')} ر.س
                                            </td>
                                            <td className="p-2 text-center">
                                                <button
                                                    title="حذف السطر"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    disabled={items.length === 1}
                                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-3 border-t border-border-subtle bg-surface-base/30">
                            <button
                                onClick={handleAddItem}
                                className="h-9 px-4 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong text-slate-400 font-bold text-xs hover:text-brand-primary hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all w-full"
                            >
                                <Plus size={14} /> أضف سطراً جديداً
                            </button>
                        </div>
                    </div>
                </div>

                {/* Totals Box */}
                <div className="mt-8 flex justify-end relative z-10 w-full md:w-1/2 ml-auto">
                    <div className="bg-surface-raised border border-border-strong rounded-2xl w-full p-6 shadow-xl space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-bold text-text-muted">المجموع الفرعي:</span>
                            <span className="font-black text-white tabular-nums">{subTotal.toLocaleString('ar-SA')} ر.س</span>
                        </div>
                        <div className="flex justify-between items-center text-sm pb-4 border-b border-white/5">
                            <span className="font-bold text-text-muted">ضريبة القيمة المضافة ({taxRate}%):</span>
                            <span className="font-black text-brand-secondary tabular-nums">{taxAmount.toLocaleString('ar-SA')} ر.س</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-lg font-black text-white">الإجمالي المستحق:</span>
                            <span className="text-2xl font-black text-brand-primary tabular-nums">{totalAmount.toLocaleString('ar-SA')} ر.س</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
