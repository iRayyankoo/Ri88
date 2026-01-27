"use client";
import React, { useState, useEffect } from 'react';
import {
    CloudSun, Calendar, Clock, Trophy, Quote, Coins, RefreshCw, StickyNote, Timer, Zap, CheckCircle2,
    Settings2, Moon, Activity, Banknote, ListTodo, Link as LinkIcon, Rss, Wifi, Droplets, Wind, TrendingUp
} from 'lucide-react';
import { useSession } from "next-auth/react";

// --- Types ---
export type WidgetSize = 'sm' | 'md' | 'lg';

export interface WidgetDef {
    id: string;
    title_ar: string;
    defaultSize: WidgetSize;
    component: React.FC<unknown>;
    icon: React.ElementType;
    gradient?: string;
}

// --- Styles (The new Accent System) ---
const WidgetStyles = () => (
    <style jsx global>{`
        .widgetInner {
            padding: 20px 32px 20px 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            height: 100%;
            width: 100%;
            justify-content: space-between;
            position: relative;
        }

        .widgetInner::before {
            content: "";
            position: absolute;
            inset: 12px 12px auto auto;
            left: auto; right: 12px; top: 12px;
            width: 6px;
            height: 32px;
            border-radius: 999px;
            background: rgba(var(--acc), 0.95);
            box-shadow: 0 0 18px rgba(var(--acc), 0.35);
            opacity: 0.95;
            z-index: 5;
        }
        
        .widgetInner::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: inherit;
            pointer-events: none;
            box-shadow:
                inset 0 0 0 1px rgba(var(--acc), 0.10),
                inset 0 0 40px rgba(var(--acc), 0.06);
            transition: box-shadow 0.2s ease;
        }
        
        .dashboardCard:hover .widgetInner::after {
             box-shadow:
                inset 0 0 0 1px rgba(var(--acc), 0.16),
                inset 0 0 55px rgba(var(--acc), 0.10);
        }

        .widgetHeader {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            width: 100%;
        }

        .widgetTitle {
            font-size: 14px;
            font-weight: 650;
            line-height: 1.2;
            opacity: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #fff;
        }

        .widgetIcon {
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(var(--acc), 0.95);
            filter: drop-shadow(0 0 10px rgba(var(--acc), 0.25));
        }
        
        .widgetValueContainer {
            min-height: 40px; 
            display: flex; 
            align-items: flex-end;
        }

        .widgetValue {
            font-size: 32px;
            font-weight: 800;
            line-height: 1.0;
            letter-spacing: 0.2px;
            color: #fff;
        }

        .widgetSub {
            font-size: 12px;
            font-weight: 550;
            opacity: 0.72;
            line-height: 1.2;
            color: #ccc;
        }

        .widgetMeta {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: auto; 
        }

        .widgetChip {
            font-size: 11px;
            font-weight: 600;
            padding: 5px 10px;
            border-radius: 999px;
            display: flex;
            align-items: center;
            gap: 6px;
            background: rgba(var(--acc), 0.10);
            border: 1px solid rgba(var(--acc), 0.18);
            box-shadow: 0 0 0 1px rgba(255,255,255,0.02) inset;
            color: rgba(255,255,255,0.9);
        }
        
        .widgetChip.up { --acc: 34, 197, 94; color: #4ade80; }
        .widgetChip.down { --acc: 239, 68, 68; color: #f87171; }
        
        /* Interactive Elements */
        .widget-btn {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            padding: 4px 8px;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .widget-btn:hover { background: rgba(var(--acc), 0.2); border-color: rgba(var(--acc), 0.3); }
        .widget-checkbox {
            width: 18px; height: 18px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.2);
            display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .widget-checkbox.checked { background: rgba(var(--acc), 0.8); border-color: transparent; color: black; }
    `}</style>
);

// --- Widgets ---

// 1. Welcome
const WelcomeWidget = () => {
    const { data: session } = useSession();
    const [greeting, setGreeting] = useState('أهلاً');
    useEffect(() => {
        const h = new Date().getHours();
        setGreeting(h < 12 ? 'صباح الخير' : h < 17 ? 'مساء الخير' : 'مساء النور');
    }, []);
    const name = session?.user?.name?.split(' ')[0] || 'مبدع';
    return (
        <div className="widgetInner">
            <WidgetStyles />
            <div className="widgetHeader">
                <span className="widgetTitle">الترحيب</span>
                <div className="widgetIcon"><RefreshCw size={22} /></div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="widgetValue" style={{ fontSize: '24px' }}>{greeting}، {name}!</div>
                <div className="widgetSub">يومك سعيد ومليء بالإنجازات</div>
            </div>
            <div className="widgetMeta"><div className="widgetChip">✨ يوم سعيد</div></div>
        </div>
    );
};

// 2. Time
const TimeWidget = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    return (
        <div className="widgetInner">
            <div className="widgetHeader"><span className="widgetTitle">الساعة</span><div className="widgetIcon"><Clock size={22} /></div></div>
            <div className="widgetValueContainer"><div className="widgetValue">{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</div></div>
            <div className="widgetMeta"><div className="widgetChip">مكة المكرمة</div></div>
        </div>
    );
};

// 3. Date
const DateWidget = () => {
    const d = new Date();
    return (
        <div className="widgetInner">
            <div className="widgetHeader"><span className="widgetTitle">التاريخ</span><div className="widgetIcon"><Calendar size={22} /></div></div>
            <div className="widgetValueContainer"><div className="widgetValue">{d.getDate()}</div></div>
            <div className="widgetMeta">
                <div className="widgetChip">{d.toLocaleDateString('ar-SA', { weekday: 'long' })}</div>
                <div className="widgetChip opacity-75">{d.toLocaleDateString('ar-SA', { month: 'short' })}</div>
            </div>
        </div>
    );
};

// 4. Weather
const WeatherWidget = () => (
    <div className="widgetInner">
        <div className="widgetHeader"><span className="widgetTitle">الطقس</span><div className="widgetIcon"><CloudSun size={22} /></div></div>
        <div className="widgetValueContainer"><div className="widgetValue">28°</div></div>
        <div className="widgetMeta"><div className="widgetChip">الرياض</div><div className="widgetChip">مشمس</div></div>
    </div>
);

// 5. Gold
const GoldWidget = () => (
    <div className="widgetInner">
        <div className="widgetHeader"><span className="widgetTitle">الذهب</span><div className="widgetIcon"><Coins size={22} /></div></div>
        <div className="widgetValueContainer"><div className="widgetValue">$2,045</div></div>
        <div className="widgetMeta"><div className="widgetChip up">▲ 1.2%</div><div className="widgetChip opacity-70">أونصة</div></div>
    </div>
);

// 6. Prayer Times (NEW)
const PrayerWidget = () => {
    // Mock logic for next prayer
    return (
        <div className="widgetInner">
            <div className="widgetHeader"><span className="widgetTitle">الصلاة القادمة</span><div className="widgetIcon"><Moon size={22} /></div></div>
            <div className="widgetValueContainer"><div className="widgetValue">3:45</div></div>
            <div className="widgetMeta"><div className="widgetChip">العصر</div><div className="widgetChip opacity-80">-01:20:00</div></div>
        </div>
    );
};

// 7. TASI (NEW)
const TasiWidget = () => (
    <div className="widgetInner">
        <div className="widgetHeader"><span className="widgetTitle">تاسي</span><div className="widgetIcon"><TrendingUp size={22} /></div></div>
        <div className="widgetValueContainer"><div className="widgetValue text-[28px]">12,180</div></div>
        <div className="widgetMeta"><div className="widgetChip up">▲ 0.45%</div><div className="widgetChip">السوق</div></div>
    </div>
);

// 8. Hijri (NEW)
const HijriWidget = () => (
    <div className="widgetInner">
        <div className="widgetHeader"><span className="widgetTitle">الهجري</span><div className="widgetIcon"><Calendar size={22} /></div></div>
        <div className="widgetValueContainer"><div className="widgetValue">15</div></div>
        <div className="widgetMeta"><div className="widgetChip">رجب</div><div className="widgetChip">1447</div></div>
    </div>
);

// 9. Currency (NEW)
const CurrencyWidget = () => (
    <div className="widgetInner">
        <div className="widgetHeader"><span className="widgetTitle">تحويل عملات</span><div className="widgetIcon"><Banknote size={22} /></div></div>
        <div className="widgetValueContainer"><div className="widgetValue text-[28px]">3.75</div></div>
        <div className="widgetMeta"><div className="widgetChip">USD</div><div className="widgetChip">SAR</div></div>
    </div>
);

// 10. Todo (NEW)
const TodoWidget = () => (
    <div className="widgetInner">
        <div className="widgetHeader"><span className="widgetTitle">مهام سريعة</span><div className="widgetIcon"><ListTodo size={22} /></div></div>
        <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-2 text-sm opacity-80"><div className="widget-checkbox checked">✓</div> <span>مراجعة الإيميل</span></div>
            <div className="flex items-center gap-2 text-sm opacity-80"><div className="widget-checkbox"></div> <span>اجتماع الزوم</span></div>
        </div>
        <div className="widgetMeta"><div className="widgetChip">1/2 منجز</div></div>
    </div>
);

// 11. Habit (NEW)
const HabitWidget = () => (
    <div className="widgetInner">
        <div className="widgetHeader"><span className="widgetTitle">عادة اليوم</span><div className="widgetIcon"><Activity size={22} /></div></div>
        <div className="flex-1 flex flex-col justify-center gap-2">
            <div className="text-sm font-bold opacity-90">شرب 2 لتر ماء</div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[rgba(var(--acc),0.8)] w-[60%]"></div>
            </div>
        </div>
        <div className="widgetMeta"><div className="widgetChip">+1 تم</div></div>
    </div>
);

// 12. Shortcuts (NEW)
const ShortcutsWidget = () => (
    <div className="widgetInner">
        <div className="widgetHeader"><span className="widgetTitle">روابط</span><div className="widgetIcon"><LinkIcon size={22} /></div></div>
        <div className="grid grid-cols-4 gap-2 mt-2">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 cursor-pointer text-xs font-bold">
                    Link
                </div>
            ))}
        </div>
    </div>
);

// 13. Tech News (NEW)
const TechNewsWidget = () => (
    <div className="widgetInner">
        <div className="widgetHeader"><span className="widgetTitle">تقنية</span><div className="widgetIcon"><Rss size={22} /></div></div>
        <div className="flex-1 flex items-center">
            <p className="text-xs leading-relaxed opacity-80 font-medium">أبل تطلق نظارتها الجديدة في الشرق الأوسط رسمياً...</p>
        </div>
        <div className="widgetMeta"><div className="widgetChip">قبل ساعة</div></div>
    </div>
);

// 14. Net Speed (NEW)
const NetSpeedWidget = () => (
    <div className="widgetInner">
        <div className="widgetHeader"><span className="widgetTitle">الشبكة</span><div className="widgetIcon"><Wifi size={22} /></div></div>
        <div className="widgetValueContainer"><div className="widgetValue">450</div></div>
        <div className="widgetMeta"><div className="widgetChip">Mbps</div><div className="widgetChip">5G</div></div>
    </div>
);

// 15. Water (NEW)
const WaterWidget = () => (
    <div className="widgetInner">
        <div className="widgetHeader"><span className="widgetTitle">الماء</span><div className="widgetIcon"><Droplets size={22} /></div></div>
        <div className="widgetValueContainer"><div className="widgetValue">1.2</div></div>
        <div className="widgetMeta"><div className="widgetChip">L</div><div className="widgetChip">من 3.0</div></div>
    </div>
);

// 16. Breathing (NEW)
const BreathingWidget = () => (
    <div className="widgetInner">
        <div className="widgetHeader"><span className="widgetTitle">تنفس</span><div className="widgetIcon"><Wind size={22} /></div></div>
        <div className="flex-1 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-[rgba(var(--acc),0.3)] animate-pulse"></div>
        </div>
        <div className="widgetMeta justify-center"><div className="widgetChip">بدء</div></div>
    </div>
);

// Old Helpers
const EventsWidget = () => (<div className="widgetInner"><div className="widgetHeader"><span className="widgetTitle">أحداث</span><div className="widgetIcon"><Trophy size={22} /></div></div><div className="widgetValueContainer"><div className="widgetValue text-[24px]">الإطلاق</div></div><div className="widgetMeta"><div className="widgetChip">غداً</div></div></div>);
const CryptoWidget = () => (<div className="widgetInner"><div className="widgetHeader"><span className="widgetTitle">BTC</span><div className="widgetIcon"><Zap size={22} /></div></div><div className="widgetValueContainer"><div className="widgetValue text-[28px]">$42k</div></div><div className="widgetMeta"><div className="widgetChip up">+2.4%</div></div></div>);
const AyahWidget = () => (<div className="widgetInner"><div className="widgetHeader"><span className="widgetTitle">إلهام</span><div className="widgetIcon"><Quote size={22} /></div></div><div className="flex-1 center-content"><p className="text-center text-sm font-bold">وقل رب زدني علما</p></div></div>);
const QuickNotesWidget = () => (<div className="widgetInner"><div className="widgetHeader"><span className="widgetTitle">ملاحظات</span><div className="widgetIcon"><StickyNote size={22} /></div></div><div className="flex-1 opacity-50 text-sm">لا ملاحظات</div></div>);
const PomodoroWidget = () => (<div className="widgetInner"><div className="widgetHeader"><span className="widgetTitle">تركيز</span><div className="widgetIcon"><Timer size={22} /></div></div><div className="widgetValueContainer"><div className="widgetValue">25:00</div></div></div>);
const SettingsWidget = () => (<div className="widgetInner"><div className="widgetHeader"><span className="widgetTitle">الإعدادات</span><div className="widgetIcon"><Settings2 size={22} /></div></div></div>);


// 11. Daily Progress Widget
const DailyProgressWidget = () => {
    const [tasks, setTasks] = useState<{ id: number, text: string, done: boolean }[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('widget_daily_tasks');
            return saved ? JSON.parse(saved) : [
                { id: 1, text: 'شرب الماء', done: false },
                { id: 2, text: 'قراءة ورد اليوم', done: false },
                { id: 3, text: 'الرياضة', done: false }
            ];
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem('widget_daily_tasks', JSON.stringify(tasks));
    }, [tasks]);

    const toggleTask = (id: number) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    const completedCount = tasks.filter(t => t.done).length;
    const progress = (completedCount / tasks.length) * 100;

    return (
        <div className="flex flex-col h-full justify-between p-1">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-blue-400">
                    <CheckCircle2 size={20} />
                    <span className="font-bold">إنجاز اليوم</span>
                </div>
                <div className="text-sm font-bold opacity-60">{completedCount}/{tasks.length}</div>
            </div>

            <div className="space-y-3 mb-4 flex-1 overflow-y-auto custom-scrollbar">
                {tasks.map(task => (
                    <div
                        key={task.id}
                        onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                        className={`flex items-center gap-3 cursor-pointer p-2 rounded-xl transition-all ${task.done ? 'bg-white/5 opacity-50' : 'hover:bg-white/5'}`}
                    >
                        {task.done ? <CheckCircle2 size={20} className="text-green-500" /> : <Circle size={20} className="text-gray-500" />}
                        <span className={`text-base font-medium ${task.done ? 'line-through' : ''}`}>{task.text}</span>
                    </div>
                ))}
            </div>

            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

// --- Registry ---
export const WIDGET_REGISTRY: Record<string, WidgetDef> = {
    'welcome': { id: 'welcome', title_ar: 'الترحيب', defaultSize: 'md', component: WelcomeWidget, icon: RefreshCw },
    'time': { id: 'time', title_ar: 'الساعة', defaultSize: 'sm', component: TimeWidget, icon: Clock },
    'date': { id: 'date', title_ar: 'التاريخ', defaultSize: 'sm', component: DateWidget, icon: Calendar },
    'weather': { id: 'weather', title_ar: 'الطقس', defaultSize: 'sm', component: WeatherWidget, icon: CloudSun },
    'gold': { id: 'gold', title_ar: 'الذهب', defaultSize: 'sm', component: GoldWidget, icon: Coins },
    'events': { id: 'events', title_ar: 'الأحداث', defaultSize: 'md', component: EventsWidget, icon: Trophy },
    'quick-notes': { id: 'quick-notes', title_ar: 'ملاحظات', defaultSize: 'md', component: QuickNotesWidget, icon: StickyNote },
    'crypto': { id: 'crypto', title_ar: 'عملات رقمية', defaultSize: 'sm', component: CryptoWidget, icon: Zap },
    'pomodoro': { id: 'pomodoro', title_ar: 'مؤقت', defaultSize: 'sm', component: PomodoroWidget, icon: Timer },
    'ayah': { id: 'ayah', title_ar: 'آية', defaultSize: 'md', component: AyahWidget, icon: Quote },
    'settings': { id: 'settings', title_ar: 'الإعدادات', defaultSize: 'sm', component: SettingsWidget, icon: Settings2 },

    // NEW ONES
    'prayer': { id: 'prayer', title_ar: 'أوقات الصلاة', defaultSize: 'sm', component: PrayerWidget, icon: Moon },
    'tasi': { id: 'tasi', title_ar: 'تاسي (الأسهم)', defaultSize: 'sm', component: TasiWidget, icon: TrendingUp },
    'hijri': { id: 'hijri', title_ar: 'التقويم الهجري', defaultSize: 'sm', component: HijriWidget, icon: Calendar },
    'currency': { id: 'currency', title_ar: 'محول العملات', defaultSize: 'sm', component: CurrencyWidget, icon: Banknote },
    'todo': { id: 'todo', title_ar: 'المهام', defaultSize: 'md', component: TodoWidget, icon: ListTodo },
    'habit': { id: 'habit', title_ar: 'تتبع العادات', defaultSize: 'sm', component: HabitWidget, icon: Activity },
    'shortcuts': { id: 'shortcuts', title_ar: 'روابط سريعة', defaultSize: 'md', component: ShortcutsWidget, icon: LinkIcon },
    'news': { id: 'news', title_ar: 'أخبار التقنية', defaultSize: 'md', component: TechNewsWidget, icon: Rss },
    'net': { id: 'net', title_ar: 'سرعة الشبكة', defaultSize: 'sm', component: NetSpeedWidget, icon: Wifi },
    'water': { id: 'water', title_ar: 'الماء', defaultSize: 'sm', component: WaterWidget, icon: Droplets },
    'breathing': { id: 'breathing', title_ar: 'تمارين تنفس', defaultSize: 'sm', component: BreathingWidget, icon: Wind },
};

/* Additional Style for new IDs - must be added to WidgetCard.tsx to work fully, 
   but we can also inject them via global style here as a fallback/reinforcement.
*/
const WidgetColors = () => (
    <style jsx global>{`
        .dashboardCard[data-type="prayer"]     { --acc: 16, 185, 129; }   /* Emerald */
        .dashboardCard[data-type="tasi"]       { --acc: 34, 197, 94; }    /* Green */
        .dashboardCard[data-type="hijri"]      { --acc: 217, 119, 6; }    /* Amber */
        .dashboardCard[data-type="currency"]   { --acc: 59, 130, 246; }   /* Blue */
        .dashboardCard[data-type="todo"]       { --acc: 99, 102, 241; }   /* Indigo */
        .dashboardCard[data-type="habit"]      { --acc: 236, 72, 153; }   /* Pink */
        .dashboardCard[data-type="shortcuts"]  { --acc: 148, 163, 184; }  /* Slate */
        .dashboardCard[data-type="news"]       { --acc: 249, 115, 22; }   /* Orange */
        .dashboardCard[data-type="net"]        { --acc: 6, 182, 212; }    /* Cyan */
        .dashboardCard[data-type="water"]      { --acc: 59, 130, 246; }   /* Blue */
        .dashboardCard[data-type="breathing"]  { --acc: 20, 184, 166; }   /* Teal */
    `}</style>
);
// Explicitly export it so Next.js picks it up
export const ColorInjector = WidgetColors;
