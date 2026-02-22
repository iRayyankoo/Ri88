"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, X, Trash2, GripVertical, Search, Zap, Sun, Star, Sparkles, Target, Gauge
} from 'lucide-react';
import { tools } from '@/data/tools';
import { useNavigation } from '@/context/NavigationContext';
import { AVAILABLE_WIDGETS } from '@/data/widgets';
import Link from 'next/link';

// --- Types ---

interface NotesWidgetProps {
    notes: string;
    setNotes: (v: string) => void;
    onSave: () => void;
}

interface WidgetWrapperProps {
    children: React.ReactNode;
    title: string;
    icon: React.ElementType;
    onRemove: () => void;
    size?: 'small' | 'medium' | 'large';
}

// --- Widget Registry Mapping (Mapping IDs to Components) ---
// In a real app, these would be separate files.

const TodoWidget = () => (
    <div className="space-y-2">
        {['تصميم واجهة المستخدم', 'كتابة المحتوى', 'تحديث السيرفر'].map((item, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5 group/todo">
                <input
                    type="checkbox"
                    title="تحديد المهمة كمكتملة"
                    aria-label="تحديد المهمة كمكتملة"
                    className="w-3.5 h-3.5 rounded border-white/10 bg-transparent accent-brand-primary"
                />
                <span className="text-[10px] text-slate-300 font-medium">{item}</span>
            </div>
        ))}
    </div>
);

const ResourceWidget = () => (
    <div className="space-y-4">
        <div className="flex items-end justify-between">
            <span className="text-2xl font-black text-white tabular-nums">84%</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">4.2 GB / 5.0 GB</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: '84%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-brand-primary to-cyan-500"
            />
        </div>
    </div>
);

const NotesWidget = ({ notes, setNotes, onSave }: NotesWidgetProps) => (
    <div className="h-full flex flex-col">
        <textarea
            value={notes}
            title="ملاحظاتك الشخصية"
            aria-label="ملاحظاتك الشخصية"
            onChange={(e) => setNotes(e.target.value)}
            onBlur={onSave}
            placeholder="اكتب شيئاً هنا..."
            className="w-full flex-1 bg-white/[0.02] rounded-xl p-3 text-xs text-slate-300 placeholder:text-slate-700 outline-none resize-none border border-white/5 focus:border-brand-primary/20 transition-all font-cairo"
        />
    </div>
);

const AccountWidget = () => (
    <div className="flex flex-col justify-between h-full gap-4">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center border border-brand-primary/20 text-brand-primary font-black">R</div>
            <div className="flex flex-col">
                <span className="text-white text-xs font-bold font-cairo">ريان المطور</span>
                <span className="text-[9px] text-brand-secondary font-black uppercase tracking-[0.1em]">عضوية برو ✦</span>
            </div>
        </div>
        <div className="p-3 rounded-xl bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-between group/upgrade cursor-pointer hover:bg-brand-primary/10 transition-all">
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-brand-primary uppercase">الرصيد المتاح</span>
                <span className="text-lg font-black text-white">$1,240.50</span>
            </div>
            {/* ArrowLeft is removed from imports, using a generic arrow or removing it */}
            <span className="text-brand-primary group-hover:-translate-x-1 transition-transform">→</span>
        </div>
    </div>
);

const ActivityWidget = () => (
    <div className="space-y-3">
        {[
            { action: "تم ضغط صورة", time: "منذ دقيقتين", icon: Star }, // Using Star as a placeholder for ImageIcon
            { action: "تحويل PDF إلى Word", time: "منذ ساعة", icon: Star }, // Using Star as a placeholder for FileText
            { action: "تنسيق كود JSON", time: "أمس", icon: Star }, // Using Star as a placeholder for Code
        ].map((act, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.02] transition-colors">
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-500"><act.icon size={12} /></div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-300 font-medium">{act.action}</span>
                    <span className="text-[8px] text-slate-600 font-bold">{act.time}</span>
                </div>
            </div>
        ))}
    </div>
);

const QuoteWidget = () => (
    <div className="h-full flex flex-col justify-center italic text-center p-2">
        <Sparkles className="w-5 h-5 text-brand-primary/40 mx-auto mb-2" />
        <p className="text-xs text-slate-300 font-medium tracking-tight lh-relaxed">
            &quot;النجاح ليس نهائياً، والفشل ليس قاتلاً؛ ما يهم هو الشجاعة للاستمرار.&quot;
        </p>
        <span className="text-[9px] text-slate-600 font-bold mt-2">— وينستون تشرشل</span>
    </div>
);

const WorldClockWidget = () => {
    const times = [
        { city: 'مكة المكرمة', time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) },
        { city: 'لندن', time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' }) },
        { city: 'نيويورك', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York' }) }
    ];
    return (
        <div className="space-y-3 py-1">
            {times.map((t, i) => (
                <div key={i} className="flex items-center justify-between border-b border-white/[0.03] pb-2 last:border-0 last:pb-0">
                    <span className="text-[10px] font-bold text-slate-400">{t.city}</span>
                    <span className="text-xs font-black text-white tabular-nums">{t.time}</span>
                </div>
            ))}
        </div>
    );
};

const DailyGoalWidget = () => (
    <div className="h-full flex flex-col justify-center gap-2">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
            <Target size={12} className="text-brand-primary" />
            <span>الهدف اليومي</span>
        </div>
        <input
            type="text"
            placeholder="حدد هدفك لليوم..."
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-brand-primary/40 transition-all"
        />
    </div>
);

const PrayerTimesWidget = () => (
    <div className="grid grid-cols-2 gap-2">
        <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 flex flex-col items-center">
            <span className="text-[8px] text-slate-500 font-bold">الفجر</span>
            <span className="text-[11px] font-black text-white">4:52 AM</span>
        </div>
        <div className="p-2 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex flex-col items-center">
            <span className="text-[8px] text-brand-primary font-black">الظهر</span>
            <span className="text-[11px] font-black text-white">12:12 PM</span>
        </div>
    </div>
);

const CurrencyWidget = () => (
    <div className="space-y-2">
        <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-slate-400 font-bold">1 USD</span>
            <span className="text-xs font-black text-brand-secondary">3.75 SAR</span>
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-slate-400 font-bold">1 EUR</span>
            <span className="text-xs font-black text-slate-300">3.94 SAR</span>
        </div>
    </div>
);

// --- Dashboard Component ---

const WidgetWrapper = ({ children, title, icon: Icon, onRemove, size = 'medium' }: WidgetWrapperProps) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`${size === 'large' ? 'col-span-1 md:col-span-2 lg:col-span-3' : size === 'medium' ? 'col-span-1' : 'col-span-1'}
        relative overflow-hidden rounded-[24px] bg-[#0F1115] border border-white/5 p-5 group flex flex-col h-full shadow-2xl`}
    >
        <div className="flex items-center justify-between mb-4 shrink-0">
            <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                    <Icon className="w-4 h-4 text-brand-primary" />
                </div>
                <h3 className="text-xs font-black text-white font-cairo uppercase tracking-widest opacity-80">{title}</h3>
            </div>
            <div className="flex items-center gap-2">
                <span title="اسحب لتغيير الترتيب" className="cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-4 h-4 text-slate-700 hover:text-slate-400 transition-colors" />
                </span>
                <button
                    onClick={onRemove}
                    title="إزالة الويدجت"
                    aria-label="إزالة الويدجت"
                    className="p-1 px-1.5 rounded-lg bg-white/5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                >
                    <Trash2 size={12} />
                </button>
            </div>
        </div>
        <div className="flex-1 relative z-10 transition-all">
            {children}
        </div>
    </motion.div>
);

const UserDashboard = () => {
    const { launchTool } = useNavigation();

    // Initialize state directly from localStorage to avoid useEffect setState warning
    const [activeWidgetIds, setActiveWidgetIds] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            const savedIds = localStorage.getItem('ri88-active-widgets');
            return savedIds ? JSON.parse(savedIds) : ['account', 'resource-usage', 'notes', 'todo'];
        }
        return ['account', 'resource-usage', 'notes', 'todo'];
    });

    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [notes, setNotes] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('ri88-user-notes') || "";
        }
        return "";
    });

    const [cryptoData] = useState({ btc: '64,231', eth: '3,452', sol: '142' });
    const [weather] = useState({ temp: '28°C', city: 'الرياض', condition: 'مشمس' });

    const saveWidgetConfig = (newIds: string[]) => {
        setActiveWidgetIds(newIds);
        localStorage.setItem('ri88-active-widgets', JSON.stringify(newIds));
    };

    const addWidget = (id: string) => {
        if (!activeWidgetIds.includes(id)) {
            saveWidgetConfig([...activeWidgetIds, id]);
        }
        setIsGalleryOpen(false);
    };

    const removeWidget = (id: string) => {
        saveWidgetConfig(activeWidgetIds.filter(wid => wid !== id));
    };

    const renderWidgetContent = (id: string) => {
        switch (id) {
            case 'todo': return <TodoWidget />;
            case 'notes': return <NotesWidget notes={notes} setNotes={setNotes} onSave={() => localStorage.setItem('ri88-user-notes', notes)} />;
            case 'resource-usage': return <ResourceWidget />;
            case 'account-pro': return <AccountWidget />;
            case 'recent-activity': return <ActivityWidget />;
            case 'quote': return <QuoteWidget />;
            case 'world-clock': return <WorldClockWidget />;
            case 'daily-goal': return <DailyGoalWidget />;
            case 'prayer-times': return <PrayerTimesWidget />;
            case 'currency': return <CurrencyWidget />;
            case 'crypto': return (
                <div className="grid grid-cols-1 gap-2">
                    {Object.entries(cryptoData).map(([coin, val]) => (
                        <div key={coin} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                            <span className="text-[10px] font-black text-white uppercase">{coin}</span>
                            <span className="text-xs font-bold text-emerald-400 tabular-nums">${val}</span>
                        </div>
                    ))}
                </div>
            );
            case 'weather': return (
                <div className="flex flex-col items-center justify-center h-full">
                    <Sun className="w-8 h-8 text-yellow-500 mb-2 animate-pulse" />
                    <span className="text-2xl font-black text-white">{weather.temp}</span>
                    <span className="text-[10px] text-slate-500 font-bold">{weather.city} - {weather.condition}</span>
                </div>
            );
            case 'network-speed': return (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                    <Gauge size={24} className="text-brand-primary/40" />
                    <div className="text-center">
                        <div className="text-xl font-black text-white">42 MB/s</div>
                        <div className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest">مستقر تماماً</div>
                    </div>
                </div>
            );
            default: return (
                <div className="flex flex-col items-center justify-center h-full opacity-40">
                    <Zap size={20} className="mb-2" />
                    <span className="text-[9px] font-black uppercase tracking-widest italic">متاح لمستخدمي Pro</span>
                </div>
            );
        }
    };

    return (
        <div className="space-y-6 pb-24 relative">

            {/* 1. Header & Quick Search */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 px-1">
                <div className="flex flex-col">
                    <h1 className="text-xl font-black text-white font-cairo">لوحة التحكم الذكية</h1>
                    <p className="text-slate-500 text-xs font-medium">مرحباً بك مجدداً، نظم عملك بذكاء.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group flex-1 max-w-md hidden sm:block">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-primary transition-colors" />
                        <input
                            type="text"
                            title="البحث عن أدوات"
                            aria-label="البحث عن أدوات"
                            placeholder="ابحث عن أداة..."
                            className="w-full h-11 bg-[#0F1115] border border-white/5 rounded-xl pr-11 pl-4 text-sm text-white placeholder:text-slate-600 outline-none focus:border-brand-primary/40 transition-all font-medium"
                        />
                    </div>
                    <button
                        onClick={() => setIsGalleryOpen(true)}
                        className="h-11 px-4 flex items-center gap-2 rounded-xl bg-brand-primary text-black font-black text-xs hover:bg-brand-primary/90 transition-all active:scale-95 shadow-lg shadow-brand-primary/20"
                    >
                        <Plus size={16} strokeWidth={3} />
                        تخصيص
                    </button>
                </div>
            </div>

            {/* 2. Widget Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence mode="popLayout">
                    {activeWidgetIds.map((id) => {
                        const def = AVAILABLE_WIDGETS.find(w => w.id === id);
                        if (!def) return null;
                        return (
                            <WidgetWrapper
                                key={id}
                                title={def.title}
                                icon={def.icon}
                                size={def.defaultSize}
                                onRemove={() => removeWidget(id)}
                            >
                                {renderWidgetContent(id)}
                            </WidgetWrapper>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* 3. Featured Tools (Static for now) */}
            <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-sm font-black text-white font-cairo uppercase tracking-widest opacity-60">الأدوات المفضلة</h2>
                    <Link href="/pro/tools" className="text-[10px] font-black text-brand-primary hover:underline">عرض الكل</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                    {tools.slice(0, 4).map((tool) => (
                        <div
                            key={tool.id}
                            onClick={() => launchTool(tool.id)}
                            className="flex items-center gap-3 p-3 rounded-2xl bg-[#0F1115] border border-white/5 hover:bg-white/5 hover:border-brand-primary/20 transition-all cursor-pointer group/tool"
                        >
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover/tool:text-brand-primary group-hover/tool:scale-110 transition-all">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col min-w-0 text-right">
                                <span className="text-white text-[11px] font-bold font-cairo truncate">{tool.titleAr || tool.title}</span>
                                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{tool.cat}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- Widget Gallery Modal --- */}
            <AnimatePresence>
                {isGalleryOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsGalleryOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#0F1115] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
                                <div className="flex flex-col">
                                    <h2 className="text-xl font-black text-white font-cairo">متجر الويدجت</h2>
                                    <p className="text-slate-500 text-xs font-medium">اختر الصناديق التي تريد إضافتها للوحة التحكم</p>
                                </div>
                                <button
                                    onClick={() => setIsGalleryOpen(false)}
                                    title="إغلاق المتجر"
                                    aria-label="إغلاق المتجر"
                                    className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {AVAILABLE_WIDGETS.map((widget) => (
                                        <div
                                            key={widget.id}
                                            onClick={() => addWidget(widget.id)}
                                            className={`p-4 rounded-2xl border transition-all cursor-pointer group/item
                                                ${activeWidgetIds.includes(widget.id)
                                                    ? 'bg-brand-primary/5 border-brand-primary/20 opacity-50 pointer-events-none'
                                                    : 'bg-white/[0.02] border-white/5 hover:border-brand-primary/40 hover:bg-white/[0.04]'}`}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`p-2 rounded-xl bg-white/5 border border-white/10 group-hover/item:text-brand-primary transition-colors`}>
                                                    <widget.icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <h3 className="text-sm font-bold text-white font-cairo">{widget.title}</h3>
                                                    <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{widget.category}</span>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{widget.description}</p>
                                            {activeWidgetIds.includes(widget.id) && (
                                                <div className="mt-2 text-[9px] font-black text-brand-primary uppercase">مضاف حالياً</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserDashboard;
