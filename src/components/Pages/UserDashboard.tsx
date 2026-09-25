"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, X, Trash2, GripVertical, Search, Zap, Sun, Star, Sparkles, Target, Gauge
} from 'lucide-react';
import { tools } from '@/data/tools';
import { useNavigation } from '@/context/NavigationContext';
import { useFavorites } from '@/context/FavoritesContext';
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
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-surface-glass border border-border-subtle group/todo">
                <input
                    type="checkbox"
                    title="تحديد المهمة كمكتملة"
                    aria-label="تحديد المهمة كمكتملة"
                    className="w-3.5 h-3.5 rounded border-border-strong bg-transparent accent-brand-primary"
                />
                <span className="text-[10px] text-text-primary font-medium">{item}</span>
            </div>
        ))}
    </div>
);

const ResourceWidget = () => (
    <div className="space-y-4">
        <div className="flex items-end justify-between">
            <span className="text-2xl font-black text-text-primary tabular-nums">84%</span>
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">4.2 GB / 5.0 GB</span>
        </div>
        <div className="w-full h-2 bg-surface-glass rounded-full overflow-hidden border border-border-subtle">
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
            className="w-full flex-1 bg-surface-glass rounded-xl p-3 text-xs text-text-primary placeholder:text-text-muted outline-none resize-none border border-border-subtle focus:border-brand-primary/40 transition-all font-cairo"
        />
    </div>
);

const AccountWidget = () => (
    <div className="flex flex-col justify-between h-full gap-4">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center border border-brand-primary/20 text-brand-primary font-black">R</div>
            <div className="flex flex-col">
                <span className="text-text-primary text-xs font-bold font-cairo">ريان المطور</span>
                <span className="text-[9px] text-brand-secondary font-black uppercase tracking-[0.1em]">عضوية برو ✦</span>
            </div>
        </div>
        <div className="p-3 rounded-xl bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-between group/upgrade cursor-pointer hover:bg-brand-primary/10 transition-all">
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-brand-primary uppercase">الرصيد المتاح</span>
                <span className="text-lg font-black text-text-primary">$1,240.50</span>
            </div>
            <span className="text-brand-primary group-hover:-translate-x-1 transition-transform">→</span>
        </div>
    </div>
);

const ActivityWidget = () => (
    <div className="space-y-3">
        {[
            { action: "تم ضغط صورة", time: "منذ دقيقتين", icon: Star },
            { action: "تحويل PDF إلى Word", time: "منذ ساعة", icon: Star },
            { action: "تنسيق كود JSON", time: "أمس", icon: Star },
        ].map((act, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-glass transition-colors">
                <div className="w-7 h-7 rounded-lg bg-surface-glass border border-border-subtle flex items-center justify-center text-text-muted"><act.icon size={12} /></div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-text-primary font-medium">{act.action}</span>
                    <span className="text-[8px] text-text-muted font-bold">{act.time}</span>
                </div>
            </div>
        ))}
    </div>
);

const QuoteWidget = () => (
    <div className="h-full flex flex-col justify-center italic text-center p-2">
        <Sparkles className="w-5 h-5 text-brand-primary/40 mx-auto mb-2" />
        <p className="text-xs text-text-primary font-medium tracking-tight lh-relaxed">
            &quot;النجاح ليس نهائياً، والفشل ليس قاتلاً؛ ما يهم هو الشجاعة للاستمرار.&quot;
        </p>
        <span className="text-[9px] text-text-muted font-bold mt-2">— وينستون تشرشل</span>
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
                <div key={i} className="flex items-center justify-between border-b border-border-subtle pb-2 last:border-0 last:pb-0">
                    <span className="text-[10px] font-bold text-text-muted">{t.city}</span>
                    <span className="text-xs font-black text-text-primary tabular-nums">{t.time}</span>
                </div>
            ))}
        </div>
    );
};

const DailyGoalWidget = () => (
    <div className="h-full flex flex-col justify-center gap-2">
        <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase">
            <Target size={12} className="text-brand-primary" />
            <span>الهدف اليومي</span>
        </div>
        <input
            type="text"
            placeholder="حدد هدفك لليوم..."
            className="w-full bg-surface-glass border border-border-subtle rounded-lg p-2 text-xs text-text-primary outline-none focus:border-brand-primary/50 transition-all placeholder:text-text-muted"
        />
    </div>
);

const PrayerTimesWidget = () => (
    <div className="grid grid-cols-2 gap-2">
        <div className="p-2 rounded-lg bg-surface-glass border border-border-subtle flex flex-col items-center">
            <span className="text-[8px] text-text-muted font-bold">الفجر</span>
            <span className="text-[11px] font-black text-text-primary">4:52 AM</span>
        </div>
        <div className="p-2 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex flex-col items-center">
            <span className="text-[8px] text-brand-primary font-black">الظهر</span>
            <span className="text-[11px] font-black text-brand-primary">12:12 PM</span>
        </div>
    </div>
);

const CurrencyWidget = () => (
    <div className="space-y-2">
        <div className="flex items-center justify-between p-2 rounded-lg bg-surface-glass border border-border-subtle">
            <span className="text-[10px] text-text-muted font-bold">1 USD</span>
            <span className="text-xs font-black text-brand-primary">3.75 SAR</span>
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-surface-glass border border-border-subtle">
            <span className="text-[10px] text-text-muted font-bold">1 EUR</span>
            <span className="text-xs font-black text-text-primary">3.94 SAR</span>
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
        relative overflow-hidden rounded-2xl bg-surface-raised border border-border-subtle hover:border-brand-primary/40 p-5 group flex flex-col h-full shadow-sm transition-all`}
    >
        <div className="flex items-center justify-between mb-4 shrink-0">
            <div className="flex items-center gap-2">
                <div className="window-dots mr-1">
                    <span className="window-dot red" />
                    <span className="window-dot yellow" />
                    <span className="window-dot green" />
                </div>
                <div className="p-1.5 rounded-lg bg-surface-glass border border-border-subtle">
                    <Icon className="w-3.5 h-3.5 text-brand-primary" />
                </div>
                <h3 className="text-xs font-bold text-text-primary font-cairo tracking-wide">{title}</h3>
            </div>
            <div className="flex items-center gap-2">
                <span title="اسحب لتغيير الترتيب" className="cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-3.5 h-3.5 text-text-muted hover:text-text-primary transition-colors" />
                </span>
                <button
                    onClick={onRemove}
                    title="إزالة الويدجت"
                    aria-label="إزالة الويدجت"
                    className="p-1 px-1.5 rounded-lg bg-surface-glass text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
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
            return savedIds ? JSON.parse(savedIds) : ['favorites', 'todo', 'notes', 'resource-usage'];
        }
        return ['favorites', 'todo', 'notes', 'resource-usage'];
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

    const FavoritesWidget = () => {
        const { favorites } = useFavorites();
        const { launchTool } = useNavigation();
        const favTools = tools.filter(t => favorites.includes(t.id));

        if (favTools.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center py-4">
                    <Star className="w-8 h-8 text-text-muted mb-2 opacity-40" />
                    <p className="text-xs text-text-primary font-bold mb-1">لا توجد أدوات مفضلة بعد</p>
                    <p className="text-[10px] text-text-muted">اضغط على رمز النجمة في أي أداة لإضافتها هنا</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto no-scrollbar">
                {favTools.slice(0, 8).map(t => (
                    <button
                        key={t.id}
                        onClick={() => launchTool(t.id)}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-glass hover:bg-brand-primary/10 border border-border-subtle hover:border-brand-primary/30 transition-all text-right group"
                    >
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                        <span className="text-xs font-bold text-text-primary group-hover:text-brand-primary truncate">{t.titleAr || t.title}</span>
                    </button>
                ))}
            </div>
        );
    };

    const renderWidgetContent = (id: string) => {
        switch (id) {
            case 'favorites': return <FavoritesWidget />;
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
                        <div key={coin} className="flex items-center justify-between p-2 rounded-xl bg-surface-glass border border-border-subtle">
                            <span className="text-[10px] font-black text-text-primary uppercase">{coin}</span>
                            <span className="text-xs font-bold text-emerald-500 tabular-nums">${val}</span>
                        </div>
                    ))}
                </div>
            );
            case 'weather': return (
                <div className="flex flex-col items-center justify-center h-full">
                    <Sun className="w-8 h-8 text-amber-500 mb-2 animate-pulse" />
                    <span className="text-2xl font-black text-text-primary">{weather.temp}</span>
                    <span className="text-[10px] text-text-muted font-bold">{weather.city} - {weather.condition}</span>
                </div>
            );
            case 'network-speed': return (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                    <Gauge size={24} className="text-brand-primary/40" />
                    <div className="text-center">
                        <div className="text-xl font-black text-text-primary">42 MB/s</div>
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
                    <div className="section-tag mb-1">
                        <span className="line" />
                        <span>لوحة التحكم // DASHBOARD</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black text-text-primary font-cairo">منظومة العمل الذكية</h1>
                    <p className="text-text-muted text-xs font-mono">WORKSPACE: ACTIVE · RIYADH DC · 18MS</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group flex-1 max-w-md hidden sm:block">
                        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-brand-primary transition-colors" />
                        <input
                            type="text"
                            title="البحث عن أدوات"
                            aria-label="البحث عن أدوات"
                            placeholder="ابحث عن أداة سريعة..."
                            className="w-full h-10 bg-surface-raised border border-border-subtle rounded-xl pr-10 pl-4 text-xs font-mono text-text-primary placeholder:text-text-muted outline-none focus:border-brand-primary/50 transition-all shadow-sm"
                        />
                    </div>
                    <button
                        onClick={() => setIsGalleryOpen(true)}
                        className="btn-primary-accent text-xs py-2 px-3.5"
                    >
                        <Plus size={14} strokeWidth={3} />
                        <span>تخصيص الصناديق</span>
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
                    <div className="section-tag mb-0">
                        <span className="line" />
                        <span>01 / الأدوات السريعة // QUICK LAUNCH</span>
                    </div>
                    <Link href="/pro/tools" className="text-xs font-mono text-brand-primary hover:underline flex items-center gap-1 font-bold">
                        <span>عرض الكل</span>
                        <span>&gt;</span>
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                    {tools.slice(0, 4).map((tool) => (
                        <div
                            key={tool.id}
                            onClick={() => launchTool(tool.id)}
                            className="p-3.5 rounded-xl bg-surface-raised border border-border-subtle hover:border-brand-primary/50 hover:bg-surface-glass transition-all cursor-pointer group/tool shadow-sm flex items-center gap-3"
                        >
                            <div className="w-9 h-9 rounded-lg bg-surface-glass border border-border-subtle flex items-center justify-center text-text-muted group-hover/tool:text-brand-primary group-hover/tool:scale-110 transition-all shrink-0">
                                <Zap className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col min-w-0 text-right">
                                <span className="text-text-primary text-xs font-bold font-cairo truncate">{tool.titleAr || tool.title}</span>
                                <span className="text-[9px] text-text-muted font-mono uppercase tracking-wider">{tool.cat}</span>
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
                            className="relative w-full max-w-2xl bg-surface-raised border border-border-subtle rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
                        >
                            <div className="p-6 border-b border-border-subtle flex items-center justify-between shrink-0">
                                <div className="flex flex-col">
                                    <h2 className="text-xl font-black text-text-primary font-cairo">متجر الويدجت</h2>
                                    <p className="text-text-muted text-xs font-medium">اختر الصناديق التي تريد إضافتها للوحة التحكم</p>
                                </div>
                                <button
                                    onClick={() => setIsGalleryOpen(false)}
                                    title="إغلاق المتجر"
                                    aria-label="إغلاق المتجر"
                                    className="p-2 rounded-full bg-surface-glass text-text-muted hover:text-text-primary transition-colors"
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
                                                    : 'bg-surface-glass border-border-subtle hover:border-brand-primary/40 hover:bg-surface-raised'}`}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 rounded-xl bg-surface-glass border border-border-subtle group-hover/item:text-brand-primary transition-colors">
                                                    <widget.icon className="w-5 h-5 text-text-muted group-hover/item:text-brand-primary" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <h3 className="text-sm font-bold text-text-primary font-cairo">{widget.title}</h3>
                                                    <span className="text-[9px] text-text-muted uppercase font-black tracking-widest">{widget.category}</span>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-text-muted font-medium leading-relaxed">{widget.description}</p>
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
