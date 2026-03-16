import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Plus, Pencil } from 'lucide-react';
import { Client } from '@/types/crm';

interface NewClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    name: string;
    setName: (val: string) => void;
    company: string;
    setCompany: (val: string) => void;
    email: string;
    setEmail: (val: string) => void;
    phone: string;
    setPhone: (val: string) => void;
    interest: string;
    setInterest: (val: any) => void;
    location: string;
    setLocation: (val: string) => void;
    propertyType: string;
    setPropertyType: (val: string) => void;
    financial: string;
    setFinancial: (val: string) => void;
    source: string;
    setSource: (val: string) => void;
    customFieldsDefinition?: any;
    metadata: Record<string, any>;
    setMetadata: (val: Record<string, any>) => void;
}

export const NewClientModal: React.FC<NewClientModalProps> = ({
    isOpen, onClose, onSubmit,
    name, setName,
    company, setCompany,
    email, setEmail,
    phone, setPhone,
    interest, setInterest,
    location, setLocation,
    propertyType, setPropertyType,
    financial, setFinancial,
    source, setSource,
    customFieldsDefinition,
    metadata, setMetadata
}) => {
    const clientFields = customFieldsDefinition?.Client || [];
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-surface-base border border-border-subtle w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden relative font-cairo"
                    >
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-brand-primary/5 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                                    <Plus size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-white">إضافة عميل جديد</h2>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">قم بتسجيل بيانات العميل الجديد في النظام</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={onSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">اسم العميل</label>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all shadow-inner text-right"
                                        placeholder="الاسم الثلاثي"
                                        required
                                    />
                                </div>
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">الشركة / الجهة</label>
                                    <input 
                                        type="text" 
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all shadow-inner text-right"
                                        placeholder="اسم الشركة (اختياري)"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">البريد الإلكتروني</label>
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all shadow-inner text-right"
                                        placeholder="example@mail.com"
                                    />
                                </div>
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">رقم الجوال</label>
                                    <input 
                                        type="tel" 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all shadow-inner text-right"
                                        placeholder="05xxxxxxxx"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">نوع الاهتمام</label>
                                    <select 
                                        value={interest}
                                        onChange={(e) => setInterest(e.target.value)}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all cursor-pointer appearance-none text-right"
                                    >
                                        <option value="" className="bg-surface-base">اختر النوع</option>
                                        <option value="BUYER" className="bg-surface-base">مشتري</option>
                                        <option value="INVESTOR" className="bg-surface-base">مستثمر</option>
                                    </select>
                                </div>
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">مصدر العميل</label>
                                    <input 
                                        type="text" 
                                        value={source}
                                        onChange={(e) => setSource(e.target.value)}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all shadow-inner text-right"
                                        placeholder="مثال: إعلان سناب، توصية..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">المنطقة المستهدفة</label>
                                    <input 
                                        type="text" 
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all shadow-inner text-right"
                                        placeholder="مثال: الرياض، حي الملقا"
                                    />
                                </div>
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">نوع العقار</label>
                                    <input 
                                        type="text" 
                                        value={propertyType}
                                        onChange={(e) => setPropertyType(e.target.value)}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all shadow-inner text-right"
                                        placeholder="مثال: فيلا، شقة، أرض"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 text-right">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">القدرة المالية المتوقعة</label>
                                <input 
                                    type="text" 
                                    value={financial}
                                    onChange={(e) => setFinancial(e.target.value)}
                                    className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all shadow-inner text-right"
                                    placeholder="مثال: 1M - 2M ر.س"
                                />
                            </div>
                            
                            {/* Dynamic Custom Fields */}
                            {clientFields.length > 0 && (
                                <div className="space-y-6 pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-4 bg-brand-primary rounded-full"></div>
                                        <h3 className="text-xs font-black text-white/70 uppercase tracking-widest">حقول إضافية</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        {clientFields.map((field: any, idx: number) => (
                                            <div key={idx} className="space-y-2 text-right">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">{field.label}</label>
                                                <input 
                                                    type={field.type || 'text'}
                                                    value={metadata[field.label] || ''}
                                                    onChange={(e) => setMetadata({ ...metadata, [field.label]: e.target.value })}
                                                    className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all shadow-inner text-right"
                                                    placeholder={`${field.label}...`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 flex gap-4">
                                <button 
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-4 bg-surface-raised/50 text-slate-400 rounded-2xl font-black text-sm hover:text-white transition-all border border-border-subtle"
                                >
                                    إلغاء
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-[2] py-4 bg-brand-primary text-black rounded-2xl font-black text-sm shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    حفظ بيانات العميل
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

interface EditClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    name: string;
    setName: (val: string) => void;
    company: string;
    setCompany: (val: string) => void;
    email: string;
    setEmail: (val: string) => void;
    phone: string;
    setPhone: (val: string) => void;
    interest: string;
    setInterest: (val: any) => void;
    location: string;
    setLocation: (val: string) => void;
    propertyType: string;
    setPropertyType: (val: string) => void;
    financial: string;
    setFinancial: (val: string) => void;
    source: string;
    setSource: (val: string) => void;
    status: string;
    setStatus: (val: string) => void;
    customFieldsDefinition?: any;
    metadata: Record<string, any>;
    setMetadata: (val: Record<string, any>) => void;
}

export const EditClientModal: React.FC<EditClientModalProps> = ({
    isOpen, onClose, onSubmit,
    name, setName,
    company, setCompany,
    email, setEmail,
    phone, setPhone,
    interest, setInterest,
    location, setLocation,
    propertyType, setPropertyType,
    financial, setFinancial,
    source, setSource,
    status, setStatus,
    customFieldsDefinition,
    metadata, setMetadata
}) => {
    const clientFields = customFieldsDefinition?.Client || [];
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-surface-base border border-border-subtle w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden relative font-cairo"
                    >
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-brand-primary/5 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                                    <Pencil size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-white">تعديل بيانات العميل</h2>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">تحديث معلومات العميل الحالية</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={onSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-2 text-right">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">حالة العميل</label>
                                <select
                                title="الحالة"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full h-11 bg-surface-raised border border-border-strong rounded-xl px-4 text-sm text-white outline-none focus:border-brand-primary/50 transition-all font-medium appearance-none"
                            >
                                    <option value="LEAD" className="bg-surface-base">جديد (Lead)</option>
                                    <option value="CONTACTED" className="bg-surface-base">تم التواصل</option>
                                    <option value="INTERESTED" className="bg-surface-base">مهتم</option>
                                    <option value="WON" className="bg-surface-base">تم البيع (Won)</option>
                                    <option value="LOST" className="bg-surface-base">خسارة (Lost)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">اسم العميل</label>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all shadow-inner text-right"
                                        placeholder="الاسم الثلاثي"
                                        required
                                    />
                                </div>
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">الشركة / الجهة</label>
                                    <input 
                                        type="text" 
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all shadow-inner text-right"
                                        placeholder="اسم الشركة (اختياري)"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">البريد الإلكتروني</label>
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all shadow-inner text-right"
                                        placeholder="example@mail.com"
                                    />
                                </div>
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">رقم الجوال</label>
                                    <input 
                                        type="tel" 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all shadow-inner text-right"
                                        placeholder="05xxxxxxxx"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">نوع الاهتمام</label>
                                    <select 
                                        value={interest}
                                        onChange={(e) => setInterest(e.target.value)}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all cursor-pointer appearance-none text-right"
                                    >
                                        <option value="" className="bg-surface-base">اختر النوع</option>
                                        <option value="BUYER" className="bg-surface-base">مشتري</option>
                                        <option value="INVESTOR" className="bg-surface-base">مستثمر</option>
                                    </select>
                                </div>
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">مصدر العميل</label>
                                    <input 
                                        type="text" 
                                        value={source}
                                        onChange={(e) => setSource(e.target.value)}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all shadow-inner text-right"
                                        placeholder="مثال: إعلان سناب، توصية..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">المنطقة المستهدفة</label>
                                    <input 
                                        type="text" 
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all shadow-inner text-right"
                                        placeholder="مثال: الرياض، حي الملقا"
                                    />
                                </div>
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">نوع العقار</label>
                                    <input 
                                        type="text" 
                                        value={propertyType}
                                        onChange={(e) => setPropertyType(e.target.value)}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all shadow-inner text-right"
                                        placeholder="مثال: فيلا، شقة، أرض"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 text-right">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">القدرة المالية المتوقعة</label>
                                <input 
                                    type="text" 
                                    value={financial}
                                    onChange={(e) => setFinancial(e.target.value)}
                                    className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all shadow-inner text-right"
                                    placeholder="مثال: 1M - 2M ر.س"
                                />
                            </div>

                            {/* Dynamic Custom Fields */}
                            {clientFields.length > 0 && (
                                <div className="space-y-6 pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-4 bg-brand-primary rounded-full"></div>
                                        <h3 className="text-xs font-black text-white/70 uppercase tracking-widest">حقول إضافية</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        {clientFields.map((field: any, idx: number) => (
                                            <div key={idx} className="space-y-2 text-right">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">{field.label}</label>
                                                <input 
                                                    type={field.type || 'text'}
                                                    value={metadata[field.label] || ''}
                                                    onChange={(e) => setMetadata({ ...metadata, [field.label]: e.target.value })}
                                                    className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all shadow-inner text-right"
                                                    placeholder={`${field.label}...`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 flex gap-4">
                                <button 
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-4 bg-surface-raised/50 text-slate-400 rounded-2xl font-black text-sm hover:text-white transition-all border border-border-subtle"
                                >
                                    إلغاء
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-[2] py-4 bg-brand-primary text-black rounded-2xl font-black text-sm shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    تحديث بيانات العميل
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
