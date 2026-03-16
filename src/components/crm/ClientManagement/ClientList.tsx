import React from 'react';
import { Pencil, Users, MessageCircle, Mail, Phone, Download, Plus } from 'lucide-react';
import { Client } from '@/types/crm';
import { useRouter } from 'next/navigation';
import { exportToCSV } from '@/lib/exportUtils';

interface ClientListProps {
    clients: Client[];
    canManageClients: boolean;
    onEditClient: (client: Client) => void;
    onNewClient: () => void;
}

export const ClientList: React.FC<ClientListProps> = ({
    clients,
    canManageClients,
    onEditClient,
    onNewClient
}) => {
    const router = useRouter();

    if (clients.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-20 bg-surface-base rounded-3xl border border-dashed border-border-strong group hover:border-brand-primary/30 transition-all">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-slate-600 group-hover:text-brand-primary transition-colors">
                    <Users size={32} />
                </div>
                <h3 className="text-lg font-black text-white mb-1">لا يوجد عملاء حالياً</h3>
                <p className="text-xs text-slate-500 mb-6">ابدأ بإضافة أول عميل لمساحة العمل الخاصة بك</p>
                {canManageClients && (
                    <button 
                        onClick={onNewClient}
                        className="bg-brand-primary text-black px-6 py-2.5 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> إضافة عميل جديد
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                        <Users size={16} />
                    </div>
                    <h3 className="text-sm font-black text-white">قائمة العملاء ({clients.length})</h3>
                </div>
                <div className="flex items-center gap-2">
                    {canManageClients && (
                        <button 
                            onClick={onNewClient}
                            className="bg-brand-primary text-black px-4 py-2 rounded-xl font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2"
                        >
                            <Plus size={16} /> إضافة عميل
                        </button>
                    )}
                    <button 
                        onClick={() => {
                            const exportData = clients.map(c => ({
                                "الاسم": c.name,
                                "الشركة": c.company || '-',
                                "الجوال": c.phone || '-',
                                "البريد": c.email || '-',
                                "المصدر": c.source || '-',
                                "الحالة": c.status,
                                "المنطقة": c.location || '-',
                                "تاريخ الإضافة": new Date(c.createdAt).toLocaleDateString('ar-SA')
                            }));
                            exportToCSV(exportData, `clients_${new Date().toISOString().split('T')[0]}`);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl border border-white/5 transition-all text-xs font-bold"
                        title="تصدير البيانات إلى CSV"
                    >
                        <Download size={14} />
                        تصدير
                    </button>
                </div>
            </div>
            
            <div className="bg-surface-base border border-border-strong rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                <table className="w-full text-right min-w-[700px]">
                    <thead>
                        <tr className="bg-surface-raised border-b border-border-subtle text-slate-500 uppercase">
                            <th className="py-4 px-6 text-[10px] font-black tracking-widest">الاسم / الشركة</th>
                            <th className="py-4 px-6 text-[10px] font-black tracking-widest">التواصل / المصدر</th>
                            <th className="py-4 px-6 text-[10px] font-black tracking-widest">العقار</th>
                            <th className="py-4 px-6 text-[10px] font-black tracking-widest text-emerald-500">القيمة المالية</th>
                            <th className="py-4 px-6 text-[10px] font-black tracking-widest">المنطقة</th>
                            <th className="py-4 px-6 text-[10px] font-black tracking-widest">الحالة</th>
                            <th className="py-4 px-6 text-[10px] font-black tracking-widest text-center w-20">تعديل</th>
                            <th className="py-4 px-6 text-[10px] font-black tracking-widest">تاريخ الإضافة</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                        {clients.map((client) => (
                            <tr 
                                key={client.id} 
                                className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                                onClick={() => router.push(`/pro/crm/client/${client.id}`)}
                            >
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-secondary/20 to-blue-500/20 flex items-center justify-center text-brand-secondary font-black border border-brand-secondary/10 shrink-0">
                                            {client.name.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span 
                                                className="text-sm font-bold text-white group-hover:text-brand-primary transition-colors"
                                            >
                                                {client.name}
                                            </span>
                                            {client.company && <span className="text-[10px] text-slate-500 font-bold">{client.company}</span>}
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            {client.phone && (
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs text-white font-bold">{client.phone}</span>
                                                    <a 
                                                        href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-all border border-emerald-500/10"
                                                        title="تواصل عبر واتساب"
                                                    >
                                                        <MessageCircle size={14} />
                                                    </a>
                                                    <a 
                                                        href={`tel:${client.phone}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all border border-blue-500/10"
                                                        title="اتصال هاتفياً"
                                                    >
                                                        <Phone size={14} />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {client.email && (
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] text-slate-500 font-bold">{client.email}</span>
                                                    <a 
                                                        href={`mailto:${client.email}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="p-1.5 bg-brand-primary/10 text-brand-primary rounded-lg hover:bg-brand-primary/20 transition-all border border-brand-primary/10"
                                                        title="إرسال بريد إلكتروني"
                                                    >
                                                        <Mail size={12} />
                                                    </a>
                                                </div>
                                            )}
                                            {client.source && (
                                                <span className="text-[10px] text-brand-primary font-black px-2 py-0.5 bg-brand-primary/10 rounded border border-brand-primary/20">
                                                    {client.source}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex flex-col gap-1">
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded w-fit ${client.interestType === 'INVESTOR' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                            {client.interestType === 'INVESTOR' ? 'مستثمر' : 'مشتري'}
                                        </span>
                                        {client.propertyType && <span className="text-[10px] text-slate-500 font-bold">{client.propertyType}</span>}
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-emerald-400 tabular-nums">
                                            {(client.invoices?.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.totalAmount, 0) || 0).toLocaleString('ar-SA')} ر.س
                                        </span>
                                        {client._count && client._count.opportunities > 0 && (
                                            <span className="text-[9px] text-slate-500 font-bold">{client._count.opportunities} صفقات</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className="text-xs text-slate-400">{client.location || '-'}</span>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black border 
                                        ${client.status === 'LEAD' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                          client.status === 'WON' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                          client.status === 'LOST' ? 'bg-red-500/10 text-red-400 border-border-strong' : 
                                          'bg-slate-500/10 text-slate-400 border-border-strong'}`}>
                                        {client.status === 'LEAD' ? 'جديد' : 
                                         client.status === 'CONTACTED' ? 'تم التواصل' :
                                         client.status === 'INTERESTED' ? 'مهتم' :
                                         client.status === 'WON' ? 'تم البيع' :
                                         client.status === 'LOST' ? 'خسارة' : client.status}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditClient(client);
                                        }}
                                        disabled={!canManageClients}
                                        className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-brand-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                        title={canManageClients ? "تعديل بيانات العميل" : "ليس لديك صلاحية"}
                                    >
                                        <Pencil size={16} />
                                    </button>
                                </td>
                                <td className="py-4 px-6 text-xs text-slate-500">
                                    {new Date(client.createdAt).toLocaleDateString('ar-SA')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </div>
        </div>
    );
};
