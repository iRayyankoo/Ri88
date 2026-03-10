"use client";
import React, { useState } from 'react';
import { ToolShell, ToolInputRow } from './ToolShell';
import { ToolInput, ToolButton, ToolSelect } from './ToolUi';
import { calculateEOS, calculateVacation, validateSAIBAN, tafqeet, getSaudiHijriDate } from '@/lib/tools/saudi';

interface ToolProps {
    toolId: string;
}

// 1. EOS
function EOSCalculator() {
    const [salary, setSalary] = useState('');
    const [years, setYears] = useState('');
    const [reason, setReason] = useState<'term' | 'resign'>('term');
    const [result, setResult] = useState<string | null>(null);

    const calculate = () => {
        const s = parseFloat(salary);
        const y = parseFloat(years);
        if (!s || !y) return;

        const reward = calculateEOS(s, y, reason);
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
                    <ToolSelect id="eos-reason" value={reason} onChange={e => setReason(e.target.value as any)} aria-label="Termination Reason" title="سبب انتهاء الخدمة (Termination Reason)">
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
        if (!s || !d) return;

        const res = calculateVacation(s, d, startDate || undefined);
        setResult(res.amount.toFixed(2));
        setReturnDate(res.returnDate);
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
export function IbanValidator() {
    const [iban, setIban] = useState('');
    const [valid, setValid] = useState<boolean | null>(null);

    const validate = () => {
        setValid(validateSAIBAN(iban));
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
        setText(tafqeet(n));
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
export function HijriDate() {
    const [today] = useState(() => getSaudiHijriDate());
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

// Saudi Official Holidays
function SaudiHolidays() {
    const holidays = [
        { name: 'يوم التأسيس', date: '22 فبراير', emoji: '🇸🇦', desc: 'خامس جمادى الثانية 1727هـ' },
        { name: 'عيد الفطر', date: 'أول شوال', emoji: '🌙', desc: '3 أيام إجازة رسمية' },
        { name: 'عيد الأضحى', date: 'التاسع من ذي الحجة', emoji: '🐑', desc: '4 أيام إجازة رسمية' },
        { name: 'اليوم الوطني', date: '23 سبتمبر', emoji: '🎉', desc: 'ذكرى توحيد المملكة' },
    ];
    return (
        <ToolShell description="الإجازات الرسمية في المملكة العربية السعودية.">
            <div className="space-y-4">
                {holidays.map((h, i) => (
                    <div key={i} className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                        <div className="text-4xl">{h.emoji}</div>
                        <div className="flex-1">
                            <div className="font-bold text-white text-lg">{h.name}</div>
                            <div className="text-brand-primary text-sm font-bold">{h.date}</div>
                            <div className="text-slate-400 text-xs mt-1">{h.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
        </ToolShell>
    );
}

export default function SaudiTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'saudi-eos': return <EOSCalculator />;
        case 'saudi-leave': return <VacationCalculator />;
        case 'saudi-vacation': return <VacationCalculator />;
        case 'saudi-hijri': return <HijriDate />;
        case 'saudi-events': return <SaudiEvents />;
        case 'prod-iban':
        case 'saudi-iban': return <IbanValidator />;
        case 'saudi-tafqeet': return <TafqeetTool />;
        case 'saudi-holiday': return <SaudiHolidays />;
        default: return null;
    }
}
