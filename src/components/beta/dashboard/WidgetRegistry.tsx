"use client";
import React, { useState, useEffect } from 'react';
import { CloudSun, Calendar, Clock, Trophy, Quote, Coins, RefreshCw, StickyNote, Timer, Zap, CheckCircle2, Circle } from 'lucide-react';

// --- Types ---
import { useSession } from "next-auth/react";
export type WidgetSize = 'sm' | 'md' | 'lg';

export interface WidgetDef {
    id: string;
    title_ar: string;
    defaultSize: WidgetSize;
    component: React.FC<unknown>;
    icon: React.ElementType;
    gradient?: string; // Optional custom background gradient
}

// --- Mock Data & Helper Components ---

// 1. Welcome Widget
const WelcomeWidget = () => {
    const { data: session } = useSession();
    const [greeting] = useState(() => {
        if (typeof window === 'undefined') return '';
        const hour = new Date().getHours();
        if (hour < 12) return 'صباح الخير';
        if (hour < 17) return 'مساء الخير';
        return 'مساء النور';
    });

    // Initial greeting logic moved to lazy state initialization to prevent hydration mismatch / sync setState issue

    const firstName = session?.user?.name ? session.user.name.split(' ')[0] : '';

    return (
        <div className="flex flex-col justify-center h-full">
            {session?.user ? (
                <>
                    <h3 className="text-4xl font-extrabold mb-3 leading-tight text-white">
                        {greeting}، {firstName}! <span className="inline-block animate-wave">👋</span>
                    </h3>
                    <p className="text-xl font-medium text-gray-400">أتمنى لك يوماً مثمراً.</p>
                </>
            ) : (
                <h3 className="text-5xl font-extrabold text-white">
                    {greeting} <span className="inline-block">✨</span>
                </h3>
            )}
        </div>
    );
};

// 2. Time Widget
const TimeWidget = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="text-7xl font-black tracking-wider tabular-nums">
                {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
            <div className="text-lg font-bold mt-4 text-[#D35BFF]">توقيت مكة المكرمة</div>
        </div>
    );
};

// 3. Date Widget
const DateWidget = () => {
    const date = new Date();
    const dayName = date.toLocaleDateString('ar-SA', { weekday: 'long' });
    const dayNum = date.toLocaleDateString('en-US', { day: 'numeric' });
    const month = date.toLocaleDateString('ar-SA', { month: 'long' });

    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-xl font-bold mb-2 text-[#D35BFF]">{dayName}</div>
            <div className="text-7xl font-black my-2">{dayNum}</div>
            <div className="text-xl font-medium text-gray-300 mt-2">{month}</div>
        </div>
    );
};

// 4. Weather Widget (Mock)
const WeatherWidget = () => {
    return (
        <div className="flex items-center justify-between h-full px-5">
            <div>
                <div className="text-6xl font-bold mb-2">28°</div>
                <div className="text-lg text-gray-300 font-medium">الرياض، مشمس</div>
            </div>
            <CloudSun size={64} color="#FFB800" />
        </div>
    );
};

// 5. Gold Price (Mock)
const GoldWidget = () => {
    return (
        <div className="flex flex-col justify-center h-full px-4">
            <div className="flex items-center gap-3 mb-4 text-[#FFD700]">
                <Coins size={28} />
                <span className="font-bold text-lg">أونصة الذهب</span>
            </div>
            <div className="text-5xl font-bold mb-2">$2,045.50</div>
            <div className="text-base text-green-400 mt-2 flex items-center gap-2 font-bold">
                ▲ +1.2% <span className="opacity-60 font-normal text-white">اليوم</span>
            </div>
        </div>
    );
};

// 6. Ayah / Quote (Mock)
const AyahWidget = () => {
    return (
        <div className="flex flex-col justify-center h-full text-center relative overflow-hidden px-6">
            <Quote size={140} className="ayah-bg-icon" />
            <p className="font-semibold mb-4 text-2xl leading-relaxed">
                &quot;وَقُل رَّبِّ زِدْنِي عِلْمًا&quot;
            </p>
            <span className="font-bold block text-base text-[#D35BFF]">سورة طه - آية 114</span>
            <style jsx>{`
                :global(.ayah-bg-icon) {
                    position: absolute; top: -20px; left: -20px; opacity: 0.05;
                }
            `}</style>
        </div>
    );
};

// 7. Events (Mock)
const EventsWidget = () => {
    return (
        <div className="flex flex-col h-full justify-center px-2">
            <div className="text-base font-bold mb-5 uppercase flex items-center gap-2 text-gray-400">
                <Trophy size={20} /> الأحداث القادمة
            </div>
            <div className="space-y-6">
                <div className="flex items-center gap-5">
                    <div className="w-2 h-12 bg-blue-500 rounded-full"></div>
                    <div>
                        <div className="text-xl font-bold mb-1">إطلاق النسخة التجريبية</div>
                        <div className="text-base text-gray-400">اليوم، 4:00 م</div>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <div className="w-2 h-12 bg-purple-500 rounded-full"></div>
                    <div>
                        <div className="text-xl font-bold mb-1">اجتماع الفريق</div>
                        <div className="text-base text-gray-400">غداً، 10:00 ص</div>
                    </div>
                </div>
            </div>
        </div>
    );
};



// 8. Quick Notes (Sticky Note)
const QuickNotesWidget = () => {
    const [note, setNote] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('widget_quick_note') || '';
        }
        return '';
    });

    // Removed useEffect for loading state since we use lazy init now

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setNote(val);
        localStorage.setItem('widget_quick_note', val);
    };

    return (
        <div className="flex flex-col h-full relative group px-2">
            <div className="flex items-center gap-3 mb-4 text-yellow-500">
                <StickyNote size={24} />
                <span className="text-base font-bold">ملاحظات سريعة</span>
            </div>
            <textarea
                className="flex-1 bg-transparent border-none resize-none text-xl outline-none w-full h-full placeholder-gray-600 font-medium leading-relaxed text-[#eee]"
                placeholder="اكتب شيئاً حتى لا تنساه..."
                value={note}
                onChange={handleChange}
                onMouseDown={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-0 left-0 text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                يتم الحفظ تلقائياً
            </div>
        </div>
    );
};

// 9. Crypto Ticker (Mock)
const CryptoWidget = () => {
    return (
        <div className="flex flex-col justify-center h-full gap-6 px-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl font-bold">₿</div>
                    <span className="font-bold text-xl">Bitcoin</span>
                </div>
                <div className="text-2xl font-mono font-bold">$42,150</div>
                <div className="text-base text-green-400 font-bold bg-green-500/10 px-3 py-1 rounded-lg">+2.4%</div>
            </div>
            <div className="h-[1px] bg-white/5 w-full"></div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">Ξ</div>
                    <span className="font-bold text-xl">Ethereum</span>
                </div>
                <div className="text-2xl font-mono font-bold">$2,250</div>
                <div className="text-base text-red-400 font-bold bg-red-500/10 px-3 py-1 rounded-lg">-0.8%</div>
            </div>
        </div>
    );
};

// 10. Pomodoro Timer
const PomodoroWidget = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        // Timer finished
                        setIsActive(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsActive(!isActive);
    };

    const resetTimer = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsActive(false);
        setTimeLeft(25 * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="text-lg font-bold text-gray-400 mb-3 flex items-center gap-3">
                <Timer size={24} /> تركيز
            </div>
            <div className="text-7xl font-black font-mono tracking-wider mb-6">
                {formatTime(timeLeft)}
            </div>
            <div className="flex gap-4">
                <button
                    onClick={toggleTimer}
                    className={`px-8 py-3 rounded-full text-base font-bold transition flex items-center gap-2 ${isActive ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'}`}
                >
                    {isActive ? 'إيقاف' : 'إبدأ'}
                </button>
                <button
                    onClick={resetTimer}
                    className="px-8 py-3 rounded-full text-base font-bold bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 flex items-center gap-2"
                >
                    إعادة
                </button>
            </div>
        </div>
    );
};

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
    'welcome': {
        id: 'welcome', title_ar: 'الترحيب', defaultSize: 'md', component: WelcomeWidget, icon: RefreshCw,
        gradient: 'linear-gradient(135deg, #2D2E40 0%, #3A3B52 100%)'
    },
    'time': {
        id: 'time', title_ar: 'الساعة', defaultSize: 'sm', component: TimeWidget, icon: Clock,
        gradient: 'linear-gradient(135deg, #1A1B26 0%, #232433 100%)'
    },
    'date': {
        id: 'date', title_ar: 'التاريخ', defaultSize: 'sm', component: DateWidget, icon: Calendar,
        gradient: 'linear-gradient(135deg, #1A1B26 0%, #232433 100%)'
    },
    'weather': {
        id: 'weather', title_ar: 'الطقس', defaultSize: 'sm', component: WeatherWidget, icon: CloudSun,
        gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)'
    },
    'gold': {
        id: 'gold', title_ar: 'سعر الذهب', defaultSize: 'sm', component: GoldWidget, icon: Coins,
        gradient: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1) 0%, rgba(202, 138, 4, 0.05) 100%)'
    },
    'ayah': {
        id: 'ayah', title_ar: 'آية / حكمة', defaultSize: 'md', component: AyahWidget, icon: Quote,
        gradient: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(126, 34, 206, 0.05) 100%)'
    },
    'events': {
        id: 'events', title_ar: 'الأحداث', defaultSize: 'md', component: EventsWidget, icon: Trophy,
        gradient: 'linear-gradient(135deg, #232433 0%, #1e1f2b 100%)'
    },
    'quick-notes': {
        id: 'quick-notes', title_ar: 'ملاحظات', defaultSize: 'md', component: QuickNotesWidget, icon: StickyNote,
        gradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)'
    },
    'crypto': {
        id: 'crypto', title_ar: 'العملات الرقمية', defaultSize: 'md', component: CryptoWidget, icon: Zap,
        gradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)'
    },
    'pomodoro': {
        id: 'pomodoro', title_ar: 'مؤقت التركيز', defaultSize: 'sm', component: PomodoroWidget, icon: Timer,
        gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.04) 100%)'
    },
    'progress': {
        id: 'progress', title_ar: 'الإنجاز اليومي', defaultSize: 'sm', component: DailyProgressWidget, icon: CheckCircle2,
        gradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)'
    },
};
