"use client";
import React, { useState } from 'react';
import { ToolShell, ToolInputRow } from './ToolShell';
import { ToolInput, ToolButton, ToolSelect } from './ToolUi';

interface ToolProps {
    toolId: string;
}

// 1. EOS
function EOSCalculator() {
    const [salary, setSalary] = useState('');
    const [years, setYears] = useState('');
    const [reason, setReason] = useState('term');
    const [result, setResult] = useState<string | null>(null);

    const calculate = () => {
        const s = parseFloat(salary);
        const y = parseFloat(years);
        if (!s || !y) return;

        let baseReward = 0;
        if (y <= 5) baseReward = (s / 2) * y;
        else baseReward = ((s / 2) * 5) + (s * (y - 5));

        let reward = baseReward;
        if (reason === 'resign') {
            if (y < 2) reward = 0;
            else if (y < 5) reward = baseReward / 3;
            else if (y < 10) reward = (baseReward * 2) / 3;
        }

        setResult(reward.toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' ريال');
    };

    return (
        <ToolShell
            description="حساب مكافأة نهاية الخدمة حسب نظام العمل السعودي."
            results={result && (
                <div className="h-full flex flex-col justify-center items-center p-8 bg-white/5 rounded-3xl border border-white/5 text-center">
                    <span className="text-sm font-bold text-gray-400 mb-2">المكافأة التقديرية</span>
                    <div className="text-4xl font-extrabold text-brand-secondary my-4">{result}</div>
                    <div className="text-xs text-brand-secondary/50 font-medium">* تقدير مبني على نظام العمل السعودي.</div>
                </div>
            )}
        >
            <ToolInputRow label="الراتب الإجمالي">
                <ToolInput type="number" value={salary} onChange={e => setSalary(e.target.value)} placeholder="e.g. 5000" />
            </ToolInputRow>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <ToolInputRow label="سنوات الخدمة">
                    <ToolInput type="number" value={years} onChange={e => setYears(e.target.value)} placeholder="e.g. 6.5" />
                </ToolInputRow>
                <ToolInputRow label="سبب الإنهاء" id="eos-reason">
                    <ToolSelect id="eos-reason" value={reason} onChange={e => setReason(e.target.value)} aria-label="Termination Reason" title="سبب انتهاء الخدمة (Termination Reason)">
                        <option value="term">إنهاء (كامل)</option>
                        <option value="resign">استقالة</option>
                    </ToolSelect>
                </ToolInputRow>
            </div>
            <ToolButton onClick={calculate} className="w-full text-lg">احسب المكافأة</ToolButton>
        </ToolShell>
    );
}

// 2. Vacation
function VacationCalculator() {
    const [salary, setSalary] = useState('');
    const [days, setDays] = useState('');
    const [startDate, setStartDate] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [returnDate, setReturnDate] = useState<string | null>(null);

    const calculate = () => {
        const s = parseFloat(salary);
        const d = parseFloat(days);
        if (s && d) setResult(((s / 30) * d).toFixed(2));
        if (startDate && d) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + d);
            setReturnDate(date.toLocaleDateString('ar-SA'));
        }
    };

    return (
        <ToolShell
            description="حساب راتب الإجازة المقدم وتاريخ العودة."
            results={result && (
                <div className="h-full flex flex-col justify-center gap-6 p-8 bg-white/5 rounded-3xl border border-white/5 text-center">
                    <div>
                        <span className="block text-sm font-bold text-gray-400 mb-1">الراتب المقدم</span>
                        <div className="text-3xl font-extrabold text-brand-primary">{result} ريال</div>
                    </div>
                    {returnDate && (
                        <div>
                            <span className="block text-sm font-bold text-gray-400 mb-1">تاريخ العودة</span>
                            <div className="text-3xl font-extrabold text-brand-secondary">{returnDate}</div>
                        </div>
                    )}
                </div>
            )}
        >
            <ToolInputRow label="الراتب الإجمالي">
                <ToolInput type="number" value={salary} onChange={e => setSalary(e.target.value)} aria-label="Total Salary" />
            </ToolInputRow>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <ToolInputRow label="مدة الإجازة (أيام)">
                    <ToolInput type="number" value={days} onChange={e => setDays(e.target.value)} aria-label="Vacation Days" />
                </ToolInputRow>
                <ToolInputRow label="تاريخ البداية">
                    <ToolInput type="date" value={startDate} onChange={e => setStartDate(e.target.value)} aria-label="Start Date" className="text-right" />
                </ToolInputRow>
            </div>

            <ToolButton onClick={calculate} className="w-full text-lg">احسب</ToolButton>
        </ToolShell>
    );
}

// 5. IBAN
function IbanValidator() {
    const [iban, setIban] = useState('');
    const [valid, setValid] = useState<boolean | null>(null);

    const validate = () => {
        const clean = iban.replace(/\s/g, '').toUpperCase();
        if (clean.startsWith('SA') && clean.length === 24) setValid(true);
        else setValid(false);
    };

    return (
        <ToolShell description="التحقق من صحة رقم الآيبان (IBAN) السعودي.">
            <ToolInputRow label="رقم الآيبان">
                <ToolInput value={iban} onChange={e => setIban(e.target.value)} aria-label="IBAN" placeholder="SA..." dir="ltr" className="text-center font-mono text-lg" />
            </ToolInputRow>
            <ToolButton onClick={validate} className="w-full text-lg mb-6">تحقق</ToolButton>
            {valid !== null && (
                <div className={`text-center font-bold text-xl py-4 rounded-xl border ${valid ? 'text-green-400 bg-green-500/10 border-green-500/30' : 'text-red-400 bg-red-500/10 border-red-500/30'}`}>
                    {valid ? '✓ IBAN صحيح (شكلياً)' : '✕ IBAN غير صالح'}
                </div>
            )}
        </ToolShell>
    );
}

// 6. Tafqeet
function TafqeetTool() {
    const [num, setNum] = useState('');
    const [text, setText] = useState('');

    const convert = () => {
        const n = parseInt(num);
        if (isNaN(n)) return;
        // Simplified Logic
        // Re-implementing simplified version:
        const units = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
        const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
        let res = '';
        if (n < 10) res = units[n];
        else if (n < 100) res = units[n % 10] + ' و ' + tens[Math.floor(n / 10)];
        else res = n + " (راجع المكتبة الكاملة)";

        setText(res + ' ريال فقط لا غير');
    };

    return (
        <ToolShell description="تحويل الأرقام إلى نص عربي (تفقيط).">
            <ToolInputRow label="المبلغ">
                <ToolInput type="number" value={num} onChange={e => setNum(e.target.value)} aria-label="Amount" placeholder="مثال: 150" />
            </ToolInputRow>
            <ToolButton onClick={convert} className="w-full text-lg mb-6">تحويل</ToolButton>
            {text && (
                <div className="text-center font-bold text-2xl text-brand-secondary bg-white/5 p-6 rounded-2xl border border-white/5">
                    {text}
                </div>
            )}
        </ToolShell>
    );
}

// 3. Hijri
function HijriDate() {
    const [today] = useState(() => new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date()));
    return (
        <ToolShell description="عرض التاريخ الهجري لليوم.">
            <div className="flex items-center justify-center p-8 min-h-[200px] bg-white/5 rounded-3xl border border-white/5">
                <div className="text-3xl font-bold text-brand-secondary">{today}</div>
            </div>
        </ToolShell>
    );
}

// 4. Events
function SaudiEvents() {
    return (
        <ToolShell description="أهم الأحداث والمناسبات السعودية.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 p-8 rounded-2xl border border-white/5 text-center hover:bg-white/10 transition-colors">
                    <div className="text-6xl mb-4">🎉</div>
                    <b className="block text-xl text-white mb-2">يوم التأسيس</b>
                    <div className="text-gray-400 font-bold">22 فبراير</div>
                </div>
                <div className="bg-white/5 p-8 rounded-2xl border border-white/5 text-center hover:bg-white/10 transition-colors">
                    <div className="text-6xl mb-4">🇸🇦</div>
                    <b className="block text-xl text-white mb-2">اليوم الوطني</b>
                    <div className="text-gray-400 font-bold">23 سبتمبر</div>
                </div>
            </div>
        </ToolShell>
    );
}

export default function SaudiTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'saudi-eos': return <EOSCalculator />;
        case 'saudi-vacation': return <VacationCalculator />;
        case 'saudi-hijri': return <HijriDate />;
        case 'saudi-events': return <SaudiEvents />;
        case 'saudi-iban': return <IbanValidator />;
        case 'saudi-tafqeet': return <TafqeetTool />;
        default: return <div className="text-center py-12">Tool coming soon: {toolId}</div>
    }
}
