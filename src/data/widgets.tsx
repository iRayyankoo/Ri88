import React from 'react';
import {
    Clock, Database,
    QrCode,
    Hash, Languages,
    Timer, Calendar, Cloud, Bitcoin,
    LifeBuoy,
    ListTodo, Palette, Gauge, Quote, FileText, Search,
    Globe, Trophy, Target, Sparkles,
    DollarSign, Moon,
    AlignLeft, StickyNote, Activity
} from 'lucide-react';

export type WidgetSize = 'small' | 'medium' | 'large';

export interface WidgetDefinition {
    id: string;
    title: string;
    description: string;
    category: 'utility' | 'productivity' | 'developer' | 'data' | 'content' | 'platform';
    icon: React.ElementType;
    defaultSize: WidgetSize;
    isPremium?: boolean;
}

export const AVAILABLE_WIDGETS: WidgetDefinition[] = [
    // --- Utility & Daily Help (User requested focus) ---
    { id: 'world-clock', title: 'ساعة عالمية', description: 'توقيت المدن العالمية الكبرى', category: 'utility', icon: Globe, defaultSize: 'medium' },
    { id: 'weather', title: 'حالة الطقس', description: 'تنبؤات وتقارير الجو الحالية', category: 'utility', icon: Cloud, defaultSize: 'small' },
    { id: 'quote', title: 'إلهام اليوم', description: 'حكمة يومية متجددة لزيادة طاقتك', category: 'utility', icon: Sparkles, defaultSize: 'small' },
    { id: 'daily-goal', title: 'هدف اليوم', description: 'نركز اليوم على تحقيق هدف واحد', category: 'utility', icon: Target, defaultSize: 'small' },
    { id: 'prayer-times', title: 'أوقات الصلاة', description: 'تنبيهات ومواعيد الصلاة حسب الموقع', category: 'utility', icon: Moon, defaultSize: 'small' },

    // --- Productivity ---
    { id: 'todo', title: 'قائمة المهام', description: 'إدارة مهامك اليومية بفعالية', category: 'productivity', icon: ListTodo, defaultSize: 'medium' },
    { id: 'notes', title: 'ملاحظات سريعة', description: 'مفكرة ذكية لحفظ أفكارك وروابطك', category: 'productivity', icon: StickyNote, defaultSize: 'medium' },
    { id: 'pomodoro', title: 'مؤقت بومودورو', description: 'تقنية التركيز (25 دقيقة عمل)', category: 'productivity', icon: Timer, defaultSize: 'small' },
    { id: 'calendar', title: 'التقويم المباشر', description: 'عرض ذكي للتاريخ واليوم', category: 'productivity', icon: Calendar, defaultSize: 'small' },
    { id: 'currency', title: 'تحويل العملات', description: 'أسعار الصرف الفورية مقابل الريال', category: 'utility', icon: DollarSign, defaultSize: 'small' },

    // --- Data & System ---
    { id: 'resource-usage', title: 'مراقب النظام', description: 'صحة الجهاز واستهلاك الموارد', category: 'data', icon: Activity, defaultSize: 'medium' },
    { id: 'crypto', title: 'العملات الرقمية', description: 'نبض السوق (BTC, ETH, SOL)', category: 'data', icon: Bitcoin, defaultSize: 'medium' },
    { id: 'network-speed', title: 'سرعة الشبكة', description: 'اختبار سرعة الإنترنت الحالية', category: 'data', icon: Gauge, defaultSize: 'small' },

    // --- Content Helpers ---
    { id: 'word-counter', title: 'مدقق النصوص', description: 'حساب كلمات ونقاء النص المكتوب', category: 'content', icon: AlignLeft, defaultSize: 'small' },
    { id: 'translator', title: 'مترجم سريع', description: 'ترجمة فورية للنصوص المحددة', category: 'content', icon: Languages, defaultSize: 'small' },

    // --- Developer Utils ---
    { id: 'json-format', title: 'منسق JSON', description: 'تنظيف وتجميل أكواد JSON', category: 'developer', icon: BracesIcon, defaultSize: 'medium' },
    { id: 'color-palette', title: 'باليت ألوان', description: 'اختيار وتنسيق ألوان التصميم', category: 'developer', icon: Palette, defaultSize: 'small' },
    { id: 'qr-gen', title: 'مولد QR', description: 'تحويل الروابط لرموز استجابة', category: 'developer', icon: QrCode, defaultSize: 'small' },

    // --- Platform Perks ---
    { id: 'account-pro', title: 'عضوية ريَّان', description: 'حالة اشتراكك والامتيازات المفعّلة', category: 'platform', icon: Trophy, defaultSize: 'medium' },
    { id: 'recent-activity', title: 'سجل العمليات', description: 'تتبع آخر 5 عمليات قمت بها', category: 'platform', icon: Clock, defaultSize: 'medium' },
];

function BracesIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m18 16 2-2-2-2" />
            <path d="m6 8-2 2 2 2" />
            <path d="m14.5 4-5 16" />
        </svg>
    )
}
