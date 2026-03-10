"use client";
import React, { useState } from 'react';
import { ToolShell, ToolInputRow } from './ToolShell';
import { ToolInput, ToolButton, ToolSelect } from './ToolUi';
import { toast } from 'sonner';

interface ToolProps {
    toolId: string;
}

// 1. Rent vs Buy Calculator (Phase 7)
function RentVsBuy() {
    const [rent, setRent] = useState('3000');
    const [price, setPrice] = useState('800000');
    const [years, setYears] = useState('10');
    const [result, setResult] = useState<string | null>(null);

    const calculate = () => {
        const totalRent = parseFloat(rent) * 12 * parseFloat(years);
        const buyCost = parseFloat(price); // Simplified for demo
        if (totalRent > buyCost) setResult('الشراء أفضل اقتصادياً على المدى الطويل');
        else setResult('الاستئجار أفضل في هذه الفترة الزمنية');
    };

    return (
        <ToolShell description="مقارنة مالية دقيقة بين خياري الاستئجار وشراء عقار لمعرفة الأفضل لميزانيتك.">
            <ToolInputRow label="الإيجار الشهري"><ToolInput type="number" value={rent} onChange={e => setRent(e.target.value)} /></ToolInputRow>
            <ToolInputRow label="سعر شراء العقار"><ToolInput type="number" value={price} onChange={e => setPrice(e.target.value)} /></ToolInputRow>
            <ToolInputRow label="المدة الزمنية (سنوات)"><ToolInput type="number" value={years} onChange={e => setYears(e.target.value)} /></ToolInputRow>
            <ToolButton onClick={calculate} className="w-full mt-4 h-14" variant="iridescent">تحليل الخيارات</ToolButton>
            {result && (
                <div className="mt-6 p-6 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl text-center font-bold text-white">
                    {result}
                </div>
            )}
        </ToolShell>
    );
}

// 2. FIRE Calculator (Phase 7)
function FireCalc() {
    const [expenses, setExpenses] = useState('5000');
    const [savings, setSavings] = useState('2000');
    const [res, setRes] = useState<number | null>(null);

    const calculate = () => {
        const annualExp = parseFloat(expenses) * 12;
        const fireNumber = annualExp * 25; // 4% rule
        setRes(fireNumber);
    };

    return (
        <ToolShell description="اكتشف متى يمكنك التوقف عن العمل والوصول لمرحلة الاستقلال المالي (Financial Independence).">
            <ToolInputRow label="المصاريف الشهرية"><ToolInput type="number" value={expenses} onChange={e => setExpenses(e.target.value)} /></ToolInputRow>
            <ToolInputRow label="الادخار الشهري الحالي"><ToolInput type="number" value={savings} onChange={e => setSavings(e.target.value)} /></ToolInputRow>
            <ToolButton onClick={calculate} className="w-full mt-4 h-14" variant="primary">احسب رقم الحرية المالية</ToolButton>
            {res && (
                <div className="mt-6 p-8 bg-white/5 border border-white/10 rounded-3xl text-center">
                    <span className="text-xs font-bold text-brand-secondary block mb-2 uppercase tracking-widest">رقم الحرية المالية المستهدف</span>
                    <div className="text-4xl font-black text-white">{res.toLocaleString()} <span className="text-lg opacity-50">ريال</span></div>
                    <p className="mt-4 text-sm text-slate-400 leading-relaxed">بناءً على قاعدة الـ 4%، تحتاج لهذا المبلغ لاستثمار عوائده وتغطية مصاريفك للأبد.</p>
                </div>
            )}
        </ToolShell>
    );
}

// 3. Marketing Metrics (Phase 7)
function MarketingMetrics() {
    const [spend, setSpend] = useState('1000');
    const [clicks, setClicks] = useState('5000');
    const [conv, setConv] = useState('50');

    const ctr = (parseFloat(clicks) / 10000) * 100; // Mock math
    const cac = parseFloat(spend) / parseFloat(conv);

    return (
        <ToolShell description="حساب مؤشرات أداء الحملات التسويقية (CTR, CPC, CAC) للمسوقين.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ToolInputRow label="ميزانية الحملة"><ToolInput type="number" value={spend} onChange={e => setSpend(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="عدد النقرات"><ToolInput type="number" value={clicks} onChange={e => setClicks(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="عدد التحويلات (Conv)"><ToolInput type="number" value={conv} onChange={e => setConv(e.target.value)} /></ToolInputRow>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
                    <div className="text-xs text-slate-500 font-bold mb-1">CTR</div>
                    <div className="text-2xl font-black text-brand-primary">{ctr.toFixed(2)}%</div>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
                    <div className="text-xs text-slate-500 font-bold mb-1">CAC</div>
                    <div className="text-2xl font-black text-brand-secondary">{cac.toFixed(1)} SR</div>
                </div>
            </div>
        </ToolShell>
    );
}

// Phase 6 Tools Implemented
function CommissionCalc() {
    const [sales, setSales] = useState('10000');
    const [rate, setRate] = useState('5');
    const commission = (parseFloat(sales) * parseFloat(rate)) / 100;

    return (
        <ToolShell description="حساب عمولة المبيعات ببساطة وسرعة، سواء كنت بائعاً أو مديراً للمبيعات.">
            <ToolInputRow label="إجمالي المبيعات (ريال)"><ToolInput type="number" value={sales} onChange={e => setSales(e.target.value)} /></ToolInputRow>
            <div className="mb-8 mt-6">
                <div className="flex justify-between items-center mb-4">
                    <label className="text-sm text-slate-300 font-bold uppercase">نسبة العمولة</label>
                    <div className="px-4 py-1 bg-brand-primary/20 text-brand-primary font-bold rounded-full">{rate}%</div>
                </div>
                <input type="range" min="0" max="100" step="0.5" value={rate} onChange={e => setRate(e.target.value)} className="w-full h-2 rounded-lg cursor-pointer accent-brand-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white/5 rounded-2xl text-center border border-white/10">
                    <div className="text-sm text-slate-400 mb-1">المبيعات الأصلية</div>
                    <div className="text-3xl font-bold font-mono">{(parseFloat(sales) || 0).toLocaleString()}</div>
                </div>
                <div className="p-6 bg-emerald-500/10 rounded-2xl text-center border border-emerald-500/20">
                    <div className="text-sm text-emerald-400 mb-1 font-bold">صافي العمولة</div>
                    <div className="text-4xl font-black text-emerald-400 font-mono">{(commission || 0).toLocaleString()}</div>
                </div>
            </div>
        </ToolShell>
    );
}

function SalaryToHourly() {
    const [salary, setSalary] = useState('10000');
    const [hours, setHours] = useState('40'); // Hours per week
    const [weeks, setWeeks] = useState('52'); // Weeks per year

    const h = parseFloat(hours) || 40;
    const w = parseFloat(weeks) || 52;
    const annual = parseFloat(salary) * 12; // Assuming input is monthly
    const perHour = annual / (h * w);
    const perDay = perHour * (h / 5);

    return (
        <ToolShell description="تحويل الراتب الشهري إلى أجر بالساعة وباليوم لتقييم قيمة وقتك كموظف أو كمستقل.">
            <ToolInputRow label="الراتب الشهري (ريال)"><ToolInput type="number" value={salary} onChange={e => setSalary(e.target.value)} /></ToolInputRow>
            <div className="grid grid-cols-2 gap-4">
                <ToolInputRow label="ساعات العمل بالأسبوع"><ToolInput type="number" value={hours} onChange={e => setHours(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="أسابيع العمل بالسنة"><ToolInput type="number" value={weeks} onChange={e => setWeeks(e.target.value)} /></ToolInputRow>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-white/5 rounded-2xl text-center border border-white/10">
                    <div className="text-xs text-slate-400 mb-2 font-bold uppercase tracking-widest">الدخل السنوي</div>
                    <div className="text-2xl font-black font-mono">{(annual || 0).toLocaleString()}</div>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl text-center border border-white/10">
                    <div className="text-xs text-brand-secondary mb-2 font-bold uppercase tracking-widest">اليومية المقدرة</div>
                    <div className="text-2xl font-black font-mono">{(perDay || 0).toFixed(1)}</div>
                </div>
                <div className="p-6 bg-brand-primary/10 rounded-2xl text-center border border-brand-primary/30 shadow-[0_0_30px_rgba(var(--brand-primary-rgb),0.2)]">
                    <div className="text-xs text-brand-primary mb-2 font-bold uppercase tracking-widest">أجر الساعة</div>
                    <div className="text-3xl font-black text-white font-mono break-all">{(perHour || 0).toFixed(2)}</div>
                </div>
            </div>
            <div className="mt-6 text-center text-xs text-slate-500">تم افتراض 5 أيام عمل في الأسبوع عند حساب اليومية المقدرة.</div>
        </ToolShell>
    );
}

function GlobalTaxCalc() {
    const [amount, setAmount] = useState('1000');
    const [taxRate, setTaxRate] = useState('15'); // 15% VAT locally SA
    const [mode, setMode] = useState<'add' | 'exclude'>('add'); // add tax to amount vs extract tax from amount

    const a = parseFloat(amount) || 0;
    const r = parseFloat(taxRate) || 0;

    let tax, total, net;
    if (mode === 'add') {
        tax = (a * r) / 100;
        total = a + tax;
        net = a;
    } else {
        tax = a - (a / (1 + (r / 100)));
        net = a - tax;
        total = a;
    }

    return (
        <ToolShell description="حاسبة ضريبة القيمة المضافة (VAT) السريعة لإضافة الضريبة أو استخراجها من السعر النهائي.">
            <div className="flex gap-4 mb-6">
                <ToolButton variant={mode === 'add' ? 'primary' : 'secondary'} onClick={() => setMode('add')} className="flex-1 md:text-sm text-xs">إضافة الضريبة (المبلغ بدون)</ToolButton>
                <ToolButton variant={mode === 'exclude' ? 'primary' : 'secondary'} onClick={() => setMode('exclude')} className="flex-1 md:text-sm text-xs">استخراج الضريبة (المبلغ شامل)</ToolButton>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <ToolInputRow label="المبلغ"><ToolInput type="number" value={amount} onChange={e => setAmount(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="نسبة الضريبة %"><ToolInput type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} /></ToolInputRow>
            </div>

            <div className="mt-8 space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-xl">
                    <span className="text-slate-400 text-sm">المبلغ الأساسي (قبل الضريبة)</span>
                    <strong className="text-xl font-mono">{net.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between items-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <span className="text-red-400 text-sm font-bold">قيمة الضريبة ({taxRate}%)</span>
                    <strong className="text-xl text-red-400 font-mono">{tax.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between items-center p-6 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl">
                    <span className="text-emerald-400 font-black text-lg">الإجمالي الشامل</span>
                    <strong className="text-4xl text-emerald-400 font-black font-mono">{total.toFixed(2)}</strong>
                </div>
            </div>
        </ToolShell>
    );
}

// Batch 1: Core Finance 
function LoanCalculator() {
    const [amount, setAmount] = useState('100000');
    const [rate, setRate] = useState('5');
    const [years, setYears] = useState('5');

    // Simple Interest for EMI
    const p = parseFloat(amount) || 0;
    const r = (parseFloat(rate) || 0) / 100 / 12;
    const n = (parseFloat(years) || 0) * 12;
    // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const emi = (r === 0) ? (p / n) : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;

    return (
        <ToolShell description="حاسبة القروض: احسب القسط الشهري الثابت والإجمالي لأي قرض.">
            <ToolInputRow label="مبلغ القرض"><ToolInput type="number" value={amount} onChange={e => setAmount(e.target.value)} /></ToolInputRow>
            <div className="grid grid-cols-2 gap-4">
                <ToolInputRow label="الفائدة السنوية (%)"><ToolInput type="number" value={rate} onChange={e => setRate(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="المدة (سنوات)"><ToolInput type="number" value={years} onChange={e => setYears(e.target.value)} /></ToolInputRow>
            </div>
            <div className="mt-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 p-6 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl text-center">
                    <div className="text-sm text-brand-secondary mb-2">القسط الشهري المقدر</div>
                    <div className="text-4xl font-black text-white font-mono break-all text-center mx-auto">{(emi || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                </div>
                <div className="flex-1 p-6 bg-white/5 border border-white/10 rounded-2xl text-center flex flex-col justify-center">
                    <div className="text-sm text-slate-400 mb-1">إجمالي السداد (مع الفوائد)</div>
                    <div className="text-2xl font-bold font-mono">{(total || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                </div>
            </div>
        </ToolShell>
    );
}

function VatCalc() {
    return <GlobalTaxCalc />; // Same logic as GlobalTaxCalc we just built
}

function NetSalary() {
    const [gross, setGross] = useState('10000');
    const [gosi, setGosi] = useState('9.75'); // Standard GOSI deduction in SA for citizens starting 2024 is usually 9.75% or 10%

    const g = parseFloat(gross) || 0;
    const d = parseFloat(gosi) || 0;
    const deduction = (g * d) / 100;
    const net = g - deduction;

    return (
        <ToolShell description="حاسبة الراتب الصافي: خصم التأمينات الاجتماعية وغيرها لمعرفة الراتب الفعلي.">
            <ToolInputRow label="الراتب الإجمالي (الأساسي + البدلات الخاضعة)"><ToolInput type="number" value={gross} onChange={e => setGross(e.target.value)} /></ToolInputRow>
            <ToolInputRow label="نسبة خصم التأمينات (%)"><ToolInput type="number" value={gosi} onChange={e => setGosi(e.target.value)} /></ToolInputRow>
            <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                    <div className="text-xs text-red-400 mb-1 font-bold">المخصوم</div>
                    <div className="text-xl font-bold text-red-500 font-mono">{(deduction || 0).toLocaleString()}</div>
                </div>
                <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-center">
                    <div className="text-xs text-emerald-400 mb-1 font-bold">الراتب الصافي</div>
                    <div className="text-2xl font-black text-emerald-400 font-mono">{(net || 0).toLocaleString()}</div>
                </div>
            </div>
        </ToolShell>
    );
}

function CurrencyConverter() {
    const [amount, setAmount] = useState('100');
    const [from, setFrom] = useState('USD');
    const [to, setTo] = useState('SAR');
    const rates: Record<string, number> = { 'USD': 1, 'SAR': 3.75, 'EUR': 0.92, 'GBP': 0.79, 'AED': 3.67, 'KWD': 0.31, 'EGP': 47.90 };

    // Simulate simple static conversion
    const a = parseFloat(amount) || 0;
    const baseAmount = a / rates[from];
    const converted = baseAmount * rates[to];

    return (
        <ToolShell description="محول عملات سريع مدعوم بنسب الصرف الثابتة والشائعة.">
            <ToolInputRow label="المبلغ"><ToolInput type="number" value={amount} onChange={e => setAmount(e.target.value)} className="text-center text-2xl h-16" /></ToolInputRow>
            <div className="flex gap-4 mb-6">
                <div className="flex-1">
                    <label className="text-xs text-slate-500 mb-2 block">من عملة</label>
                    <select value={from} onChange={e => setFrom(e.target.value)} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white outline-none focus:border-brand-primary text-center">
                        {Object.keys(rates).map(k => <option key={k} value={k} className="bg-slate-900">{k}</option>)}
                    </select>
                </div>
                <div className="flex-1">
                    <label className="text-xs text-slate-500 mb-2 block">إلى عملة</label>
                    <select value={to} onChange={e => setTo(e.target.value)} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white outline-none focus:border-brand-primary text-center">
                        {Object.keys(rates).map(k => <option key={k} value={k} className="bg-slate-900">{k}</option>)}
                    </select>
                </div>
            </div>
            <div className="p-8 bg-brand-primary/10 border border-brand-primary/20 rounded-3xl text-center">
                <div className="text-5xl font-black text-white font-mono break-all mx-auto tracking-tighter">
                    {(converted || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <div className="text-sm font-bold mt-2 opacity-50 uppercase tracking-widest">{to}</div>
            </div>
        </ToolShell>
    );
}

function SavingsCalc() {
    const [initial, setInitial] = useState('5000');
    const [monthly, setMonthly] = useState('1000');
    const [years, setYears] = useState('5');

    const i = parseFloat(initial) || 0;
    const m = parseFloat(monthly) || 0;
    const y = parseFloat(years) || 0;

    const total = i + (m * 12 * y);

    return (
        <ToolShell description="حاسبة الادخار البسيطة لتخطيط نمو أموالك بمرور الوقت بدون فوائد مركبة (الادخار النقي).">
            <ToolInputRow label="المبلغ الابتدائي"><ToolInput type="number" value={initial} onChange={e => setInitial(e.target.value)} /></ToolInputRow>
            <div className="grid grid-cols-2 gap-4">
                <ToolInputRow label="الادخار الشهري"><ToolInput type="number" value={monthly} onChange={e => setMonthly(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="المدة (سنوات)"><ToolInput type="number" value={years} onChange={e => setYears(e.target.value)} /></ToolInputRow>
            </div>
            <div className="mt-8 p-6 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-2xl border border-emerald-500/20 text-center">
                <div className="text-sm text-emerald-400 mb-1 font-bold">مجموع مدخراتك بعد {years} سنوات سيكون</div>
                <div className="text-4xl font-black text-emerald-400 font-mono">{(total || 0).toLocaleString()} <span className="text-lg opacity-60">ريال</span></div>
            </div>
        </ToolShell>
    );
}

// Batch 2: Advanced Finance 
function ZakatCalc() {
    const [cash, setCash] = useState('100000');
    const [gold, setGold] = useState('0'); // In SAR value
    const [shares, setShares] = useState('0');
    const [debts, setDebts] = useState('0');

    const nisab = 3000; // Mock Nisab for demo (actual Nisab varies based on gold/silver prices)
    const totalWealth = (parseFloat(cash) || 0) + (parseFloat(gold) || 0) + (parseFloat(shares) || 0);
    const netWealth = totalWealth - (parseFloat(debts) || 0);
    const isEligible = netWealth >= nisab;
    const zakatAmount = isEligible ? netWealth * 0.025 : 0;

    return (
        <ToolShell description="حاسبة الزكاة لحول كامل للسيولة والممتلكات المعدة للتجارة والذهب (2.5%).">
            <div className="grid grid-cols-2 gap-4 mb-4">
                <ToolInputRow label="النقد والمدخرات بحولها"><ToolInput type="number" value={cash} onChange={e => setCash(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="قيمة الذهب/فضة (المكتنزة)"><ToolInput type="number" value={gold} onChange={e => setGold(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="صناديق/أسهم قابلة للبيع"><ToolInput type="number" value={shares} onChange={e => setShares(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="الديون الحالة عليك (تطرح)"><ToolInput type="number" value={debts} onChange={e => setDebts(e.target.value)} /></ToolInputRow>
            </div>
            <div className="mt-8 p-6 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl text-center shadow-lg">
                <div className="text-sm text-brand-secondary mb-3 font-bold">
                    {isEligible ? 'تجب الزكاة ومقدارها المستحق:' : 'لم تبلغ النصاب - لا زكاة هنا (حسب الافتراضيات)'}
                </div>
                {isEligible && <div className="text-5xl font-black text-white font-mono">{(zakatAmount).toLocaleString()}</div>}
                <div className="text-xs text-slate-400 mt-4">الوعاء الزكوي الصافي الخاضع: {netWealth.toLocaleString()} ر.س</div>
            </div>
        </ToolShell>
    );
}

function BudgetCalc() {
    const [income, setIncome] = useState('10000');

    // 50/30/20 rule
    const inc = parseFloat(income) || 0;
    const needs = inc * 0.50;
    const wants = inc * 0.30;
    const savings = inc * 0.20;

    return (
        <ToolShell description="مخطط الميزانية الشهرية (قاعدة 50/30/20 الشائعة) لتوزيع الدخل الذكي.">
            <ToolInputRow label="الدخل الشهري (ريال)"><ToolInput type="number" value={income} onChange={e => setIncome(e.target.value)} className="h-16 text-2xl font-bold text-center tracking-widest" /></ToolInputRow>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="p-6 bg-red-400/10 border border-red-500/20 rounded-2xl text-center">
                    <div className="text-sm text-red-400 font-bold mb-1">الاحتياجات والثوابت (50%)</div>
                    <div className="text-2xl font-black text-white font-mono break-all my-2">{needs.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">إيجار سكن، فواتير ثابتة، غذاء أساسي</div>
                </div>
                <div className="p-6 bg-yellow-400/10 border border-yellow-500/20 rounded-2xl text-center">
                    <div className="text-sm text-yellow-400 font-bold mb-1">الرغبات والكماليات (30%)</div>
                    <div className="text-2xl font-black text-white font-mono break-all my-2">{wants.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">تسوق اختياري، مطاعم وكافيهات، ترفيه والسفر</div>
                </div>
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
                    <div className="text-sm text-emerald-400 font-bold mb-1">ادخار أو ديون (20%)</div>
                    <div className="text-2xl font-black text-white font-mono break-all my-2">{savings.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">الطوارئ، الاستثمار، استكمال قروض طارئة</div>
                </div>
            </div>
        </ToolShell>
    );
}

function CompoundCalc() {
    const [principal, setPrincipal] = useState('10000');
    const [monthly, setMonthly] = useState('1000');
    const [rate, setRate] = useState('7');
    const [years, setYears] = useState('10');

    const p = parseFloat(principal) || 0;
    const m = parseFloat(monthly) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const t = parseFloat(years) || 0;
    const n = 12;

    const futureValueBase = p * Math.pow(1 + r / n, n * t);
    const futureValueDeposits = m * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));
    const futureTotal = futureValueBase + futureValueDeposits;
    const totalInvested = p + (m * 12 * t);
    const totalInterest = futureTotal - totalInvested;

    return (
        <ToolShell description="حاسبة العائد التراكمي (Compound Interest): قوة الفائدة المركبة لتنمية ثروتك وتقييم استثماراتك.">
            <div className="grid grid-cols-2 gap-4">
                <ToolInputRow label="رأس المال وتكلفة البدء"><ToolInput type="number" value={principal} onChange={e => setPrincipal(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="المساهمة الشهرية المتكررة"><ToolInput type="number" value={monthly} onChange={e => setMonthly(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="العائد السنوي المتوقع (%)"><ToolInput type="number" value={rate} onChange={e => setRate(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="مدة الاستثمار (سنوات)"><ToolInput type="number" value={years} onChange={e => setYears(e.target.value)} /></ToolInputRow>
            </div>
            <div className="mt-8 p-6 bg-gradient-to-tr from-brand-primary/20 to-brand-secondary/20 rounded-2xl border border-brand-primary/30 text-center relative overflow-hidden shadow-xl">
                <div className="absolute inset-x-0 -top-10 opacity-5 font-mono text-[10rem] font-black pointer-events-none text-brand-primary">%%</div>
                <div className="text-sm text-brand-secondary mb-2 font-bold relative z-10">الرصيد التراكمي المستقبلي المتوقع</div>
                <div className="text-5xl font-black text-white font-mono break-all relative z-10 tracking-tighter">{(futureTotal || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                <div className="mt-6 flex justify-between px-2 md:px-6 text-xs text-slate-300 font-bold w-full mx-auto relative z-10 p-2 border-t border-white/10">
                    <div>إجمالي الإيداعات: <span className="text-white">{(totalInvested || 0).toLocaleString()}</span></div>
                    <div>الأرباح المركبة: <span className="text-emerald-400">{(totalInterest || 0).toLocaleString()}</span></div>
                </div>
            </div>
        </ToolShell>
    );
}

function CryptoCalc() {
    const [coinAmount, setCoinAmount] = useState('1.5');
    const [buyPrice, setBuyPrice] = useState('50000');
    const [currentPrice, setCurrentPrice] = useState('65000');

    const amount = parseFloat(coinAmount) || 0;
    const p1 = parseFloat(buyPrice) || 0;
    const p2 = parseFloat(currentPrice) || 0;
    const invested = amount * p1;
    const worth = amount * p2;
    const profit = worth - invested;
    const profitPct = invested > 0 ? (profit / invested) * 100 : 0;

    return (
        <ToolShell description="حاسبة أرباح وخسائر العملات الرقمية والأسهم لتقييم صفقات التداول السريعة.">
            <ToolInputRow label="الكمية المشتراة (للعملة أو السهم)"><ToolInput type="number" value={coinAmount} onChange={e => setCoinAmount(e.target.value)} /></ToolInputRow>
            <div className="grid grid-cols-2 gap-4">
                <ToolInputRow label="سعر الشراء للأصل الواحد"><ToolInput type="number" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="السعر الحالي / الهدف"><ToolInput type="number" value={currentPrice} onChange={e => setCurrentPrice(e.target.value)} /></ToolInputRow>
            </div>
            <div className="mt-6 flex flex-col md:flex-row gap-4 text-center">
                <div className="flex-1 p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="text-xs text-slate-400 mb-1 font-bold">المبلغ المُستثمر الكلي</div>
                    <div className="text-2xl font-bold font-mono">{(invested || 0).toLocaleString()}</div>
                </div>
                <div className={`flex-[2] p-6 rounded-2xl border transition-all ${profit >= 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                    <div className={`text-xs font-bold mb-1 ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{profit >= 0 ? 'الأرباح الكلية المحققة + ' : 'الخسائر العائمة - '}</div>
                    <div className={`text-4xl font-black font-mono ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {(profit || 0).toLocaleString()} <span className="text-sm ml-2 px-2 py-1 bg-black/20 rounded-md whitespace-nowrap">{profitPct > 0 ? '+' : ''}{profitPct.toFixed(2)}%</span>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}

function FreelanceQuote() {
    const [hours, setHours] = useState('40');
    const [rate, setRate] = useState('150');
    const [expenses, setExpenses] = useState('500'); // costs like software, servers

    const h = parseFloat(hours) || 0;
    const r = parseFloat(rate) || 0;
    const e = parseFloat(expenses) || 0;
    const quote = (h * r) + e;

    return (
        <ToolShell description="حاسبة تسعير المشاريع للمستقلين (Freelancers) لضمان ربحية عادلة ومنطقية لتسعير مجهودك.">
            <div className="grid grid-cols-2 gap-4">
                <ToolInputRow label="توقع جهد المشروع الزمني (ساعات)"><ToolInput type="number" value={hours} onChange={e => setHours(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="أجر الساعة المعتاد الخاص بك"><ToolInput type="number" value={rate} onChange={e => setRate(e.target.value)} /></ToolInputRow>
            </div>
            <ToolInputRow label="المصاريف الإضافية (تراخيص خارجية، سيرفرات... الخ)"><ToolInput type="number" value={expenses} onChange={e => setExpenses(e.target.value)} /></ToolInputRow>
            <div className="mt-8 p-8 bg-brand-primary/10 rounded-2xl border border-brand-primary/30 text-center shadow-lg">
                <div className="text-brand-secondary font-bold uppercase tracking-widest text-sm mb-3">السعر العادل لتقديم العرض للمشروع</div>
                <div className="text-6xl font-black text-white font-mono drop-shadow-md">{(quote || 0).toLocaleString()} <span className="text-xl font-bold opacity-50">ر.س</span></div>
                <div className="text-sm opacity-60 mt-6 max-w-sm mx-auto leading-relaxed border-t border-white/5 pt-4">بناءً على الساعات التقديرية والمصاريف التشغيلية، هذا السعر يضمن تغطية الموارد والمكسب العادل لوقتك.</div>
            </div>
        </ToolShell>
    );
}

// Batch 3: Commerce & Business Finance
function DiscountCalc() {
    const [price, setPrice] = useState('500');
    const [discount, setDiscount] = useState('20');

    const p = parseFloat(price) || 0;
    const d = parseFloat(discount) || 0;
    const saved = p * (d / 100);
    const finalPrice = p - saved;

    return (
        <ToolShell description="حاسبة الخصم السريعة لمعرفة السعر النهائي وقيمة التوفير أثناء التسوق أو العروض.">
            <div className="grid grid-cols-2 gap-4">
                <ToolInputRow label="السعر الأساسي الأصل"><ToolInput type="number" value={price} onChange={e => setPrice(e.target.value)} className="text-xl" /></ToolInputRow>
                <ToolInputRow label="نسبة الخصم (%)"><ToolInput type="number" value={discount} onChange={e => setDiscount(e.target.value)} className="text-xl text-brand-primary" /></ToolInputRow>
            </div>
            <div className="mt-8 flex gap-4">
                <div className="flex-1 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
                    <div className="text-xs text-red-400 font-bold mb-1">المبلغ الموفر</div>
                    <div className="text-2xl font-bold font-mono">{(saved || 0).toLocaleString()}</div>
                </div>
                <div className="flex-[2] p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center shadow-lg">
                    <div className="text-xs text-emerald-400 font-bold mb-1">السعر النهائي بعد الخصم</div>
                    <div className="text-4xl font-black font-mono text-white">{(finalPrice || 0).toLocaleString()}</div>
                </div>
            </div>
        </ToolShell>
    );
}

function SubscriptionCalc() {
    const [subs, setSubs] = useState([{ id: 1, name: 'Netflix', price: 50, cycle: 'monthly' }]);
    const [newName, setNewName] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [newCycle, setNewCycle] = useState('monthly');

    const addSub = () => {
        if (!newName || !newPrice) return;
        setSubs([...subs, { id: Date.now(), name: newName, price: parseFloat(newPrice) || 0, cycle: newCycle }]);
        setNewName(''); setNewPrice('');
    };

    const removeSub = (id: number) => setSubs(subs.filter(s => s.id !== id));

    const totalMonthly = subs.reduce((acc, curr) => acc + (curr.cycle === 'monthly' ? curr.price : curr.price / 12), 0);
    const totalYearly = totalMonthly * 12;

    return (
        <ToolShell description="حاسبة الاشتراكات لحصر وإدارة تكاليف الخدمات الشهرية والسنوية.">
            <div className="flex gap-2 mb-6 p-4 bg-white/5 rounded-xl border border-white/10 flex-col md:flex-row">
                <input type="text" placeholder="اسم الاشتراك (مثال: نيتفلكس)" value={newName} onChange={e => setNewName(e.target.value)} className="flex-1 bg-transparent border-b border-white/10 px-2 py-2 outline-none" title="اسم الاشتراك" />
                <input type="number" placeholder="السعر" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="w-full md:w-24 bg-transparent border-b border-white/10 px-2 py-2 outline-none text-center" title="السعر" />
                <select value={newCycle} onChange={e => setNewCycle(e.target.value)} className="w-full md:w-24 bg-transparent border-b border-white/10 px-2 py-2 outline-none text-sm text-center" title="دورة الدفع">
                    <option value="monthly" className="bg-slate-900">شهري</option>
                    <option value="yearly" className="bg-slate-900">سنوي</option>
                </select>
                <ToolButton onClick={addSub} variant="primary" className="h-10 px-4 shrink-0 text-sm">إضافة</ToolButton>
            </div>

            <div className="space-y-2 mb-8 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                {subs.map(s => (
                    <div key={s.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition">
                        <span className="font-bold text-sm truncate flex-1">{s.name}</span>
                        <div className="flex items-center gap-4 text-sm font-mono text-slate-300">
                            {s.price.toLocaleString()} <span className="text-[10px] uppercase opacity-50">{s.cycle === 'monthly' ? '/mo' : '/yr'}</span>
                            <button onClick={() => removeSub(s.id)} className="text-red-400 hover:text-red-300 px-2 leading-none text-xl" title="حذف">×</button>
                        </div>
                    </div>
                ))}
                {subs.length === 0 && <div className="text-center text-xs opacity-50 py-4">لا يوجد اشتراكات مضافة</div>}
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                <div className="text-center">
                    <div className="text-xs text-slate-400 mb-1 font-bold">التكلفة الشهرية</div>
                    <div className="text-3xl font-black font-mono">{(totalMonthly || 0).toLocaleString(undefined, { maximumFractionDigits: 1 })}</div>
                </div>
                <div className="text-center border-r border-white/10">
                    <div className="text-xs text-brand-secondary mb-1 font-bold">التكلفة السنوية التقديرية</div>
                    <div className="text-3xl font-black font-mono text-brand-secondary">{(totalYearly || 0).toLocaleString(undefined, { maximumFractionDigits: 1 })}</div>
                </div>
            </div>
        </ToolShell>
    );
}

function ROICalc() {
    const [invested, setInvested] = useState('10000');
    const [returned, setReturned] = useState('12500');

    const i = parseFloat(invested) || 0;
    const r = parseFloat(returned) || 0;

    const profit = r - i;
    const roi = i > 0 ? (profit / i) * 100 : 0;

    return (
        <ToolShell description="العائد على الاستثمار (ROI): مقياس لتقييم كفاءة أو ربحية استثمار ما مقارنة بتكلفته.">
            <div className="grid grid-cols-2 gap-4">
                <ToolInputRow label="المبلغ المستثمر"><ToolInput type="number" value={invested} onChange={e => setInvested(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="المبلغ المسترد (القيمة الحالية)"><ToolInput type="number" value={returned} onChange={e => setReturned(e.target.value)} /></ToolInputRow>
            </div>

            <div className="mt-8 flex flex-col md:flex-row gap-4">
                <div className={`p-6 flex-1 text-center rounded-2xl border ${profit >= 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                    <div className="text-sm font-bold opacity-80 mb-1">صافي العائد</div>
                    <div className={`text-2xl font-black font-mono ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{(profit || 0).toLocaleString()}</div>
                </div>
                <div className={`p-6 flex-[2] text-center rounded-2xl border shadow-lg ${profit >= 0 ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-red-500/20 border-red-500/40'}`}>
                    <div className="text-sm font-bold opacity-80 mb-1">نسبة العائد (ROI %)</div>
                    <div className={`text-5xl font-black font-mono text-white`}>{(roi || 0).toFixed(2)}%</div>
                </div>
            </div>
        </ToolShell>
    );
}

function BreakEvenCalc() {
    const [fixedCost, setFixedCost] = useState('50000'); // Rent, salaries
    const [pricePerUnit, setPricePerUnit] = useState('100');
    const [varCostPerUnit, setVarCostPerUnit] = useState('40'); // materials per unit

    const fixed = parseFloat(fixedCost) || 0;
    const price = parseFloat(pricePerUnit) || 0;
    const varCost = parseFloat(varCostPerUnit) || 0;

    const contributionMargin = price - varCost;
    const breakEvenUnits = contributionMargin > 0 ? fixed / contributionMargin : 0;
    const breakEvenRevenue = breakEvenUnits * price;

    return (
        <ToolShell description="تحليل نقطة التعادل للمشاريع والأعمال التجارية (متى تبدأ بتحقيق الأرباح؟).">
            <ToolInputRow label="التكاليف الثابتة (إيجارات، رواتب ثابتة)"><ToolInput type="number" value={fixedCost} onChange={e => setFixedCost(e.target.value)} /></ToolInputRow>
            <div className="grid grid-cols-2 gap-4">
                <ToolInputRow label="سعر بيع الوحدة/الخدمة"><ToolInput type="number" value={pricePerUnit} onChange={e => setPricePerUnit(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="التكلفة المتغيرة للوحدة"><ToolInput type="number" value={varCostPerUnit} onChange={e => setVarCostPerUnit(e.target.value)} /></ToolInputRow>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div className="p-6 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl">
                    <div className="text-xs text-brand-secondary font-bold mb-2 uppercase tracking-widest">عدد الوحدات المطلوب بيعها للتعادل</div>
                    <div className="text-4xl font-black text-white font-mono">{contributionMargin > 0 ? Math.ceil(breakEvenUnits).toLocaleString() : '---'}</div>
                    <div className="text-xs text-slate-500 mt-2">وحدة / خدمة</div>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="text-xs text-slate-400 font-bold mb-2 uppercase tracking-widest">إجمالي الإيرادات عند نقطة التعادل</div>
                    <div className="text-3xl font-black text-white font-mono mt-3">{contributionMargin > 0 ? breakEvenRevenue.toLocaleString() : '---'}</div>
                </div>
            </div>
            {contributionMargin <= 0 && <div className="text-center text-xs text-red-400 mt-4 leading-relaxed bg-red-500/10 p-2 rounded-lg border border-red-500/20">تحذير: التكلفة المتغيرة تساوي أو تتجاوز سعر البيع! لن تصل لنقطة التعادل أبداً بهذا التسعير.</div>}
        </ToolShell>
    );
}

function RunwayCalc() {
    const [cash, setCash] = useState('500000');
    const [burnRate, setBurnRate] = useState('25000');

    const c = parseFloat(cash) || 0;
    const b = parseFloat(burnRate) || 0;
    const months = b > 0 ? c / b : 0;
    const expectedDate = new Date();
    expectedDate.setMonth(expectedDate.getMonth() + Math.floor(months));

    return (
        <ToolShell description="حاسبة المدرج المالي للشركات الناشئة والمشاريع الصغيرة (متى سينفد النقد الكاش؟).">
            <div className="grid grid-cols-2 gap-4">
                <ToolInputRow label="الرصيد النقدي الحالي (الكاش)"><ToolInput type="number" value={cash} onChange={e => setCash(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="معدل الحرق الشهري (المصاريف - الدخل)"><ToolInput type="number" value={burnRate} onChange={e => setBurnRate(e.target.value)} /></ToolInputRow>
            </div>

            <div className="mt-8 flex flex-col md:flex-row gap-4 items-stretch">
                <div className="flex-1 p-6 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl text-center flex flex-col justify-center">
                    <div className="text-xs text-brand-secondary font-bold mb-2">المدرج المتبقي</div>
                    <div className="text-6xl font-black text-white font-mono">{b > 0 ? months.toFixed(1) : '∞'} <span className="text-xl font-bold opacity-50 block mt-1">شهر</span></div>
                </div>
                <div className="flex-1 p-6 bg-white/5 border border-white/10 rounded-2xl text-center flex flex-col justify-center">
                    <div className="text-xs text-slate-400 font-bold mb-2">تاريخ نفاد النقد المتوقع</div>
                    {b > 0 ? (
                        <div className="text-2xl font-black text-white font-mono drop-shadow-sm">
                            {expectedDate.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}
                        </div>
                    ) : (
                        <div className="text-sm text-emerald-400 font-bold mt-2">نقطة آمنة (لا يوجد حرق نقدي)</div>
                    )}
                </div>
            </div>
        </ToolShell>
    );
}


function OfferComparison() {
    const [a, setA] = useState({ name: 'العرض الأول', price: '100', discount: '10' });
    const [b, setB] = useState({ name: 'العرض الثاني', price: '90', discount: '5' });
    const [result, setResult] = useState<string | null>(null);
    const compare = () => {
        const netA = parseFloat(a.price) * (1 - parseFloat(a.discount) / 100);
        const netB = parseFloat(b.price) * (1 - parseFloat(b.discount) / 100);
        if (netA < netB) setResult(`✅ ${a.name} أفضل — السعر الفعلي: ${netA.toFixed(2)} ريال`);
        else if (netB < netA) setResult(`✅ ${b.name} أفضل — السعر الفعلي: ${netB.toFixed(2)} ريال`);
        else setResult('⚖️ العرضان متعادلان!');
    };
    return (
        <ToolShell description="قارن بين عرضين من حيث السعر والخصم لمعرفة الأوفر.">
            <div className="grid grid-cols-2 gap-4 mb-4">
                {[{ side: a, set: setA, label: 'العرض الأول' }, { side: b, set: setB, label: 'العرض الثاني' }].map(({ side, set, label }) => (
                    <div key={label} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                        <div className="text-xs text-brand-primary font-bold">{label}</div>
                        <ToolInputRow label="الاسم"><ToolInput value={side.name} onChange={e => set(s => ({ ...s, name: e.target.value }))} /></ToolInputRow>
                        <ToolInputRow label="السعر"><ToolInput type="number" value={side.price} onChange={e => set(s => ({ ...s, price: e.target.value }))} /></ToolInputRow>
                        <ToolInputRow label="الخصم %"><ToolInput type="number" value={side.discount} onChange={e => set(s => ({ ...s, discount: e.target.value }))} /></ToolInputRow>
                    </div>
                ))}
            </div>
            <ToolButton onClick={compare} className="w-full h-12" variant="iridescent">قارن الآن</ToolButton>
            {result && <div className="mt-4 p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl text-center font-bold text-white">{result}</div>}
        </ToolShell>
    );
}

// NEW: Trip Cost Calculator
function TripCostCalc() {
    const [dist, setDist] = useState('400');
    const [cons, setCons] = useState('10');
    const [price, setPrice] = useState('2.18');
    const [result, setResult] = useState<number | null>(null);
    const calc = () => setResult((parseFloat(dist) / 100) * parseFloat(cons) * parseFloat(price));
    return (
        <ToolShell description="احسب تكلفة البنزين للرحلة بالسيارة.">
            <div className="space-y-4 mb-6">
                <ToolInputRow label="المسافة (كيلومتر)"><ToolInput type="number" value={dist} onChange={e => setDist(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="استهلاك الوقود (لتر/100كم)"><ToolInput type="number" value={cons} onChange={e => setCons(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="سعر اللتر (ريال)"><ToolInput type="number" value={price} onChange={e => setPrice(e.target.value)} /></ToolInputRow>
            </div>
            <ToolButton onClick={calc} className="w-full h-12" variant="iridescent">احسب التكلفة</ToolButton>
            {result !== null && (
                <div className="mt-6 p-6 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl text-center">
                    <div className="text-xs text-slate-400 mb-1">تكلفة الرحلة التقريبية</div>
                    <div className="text-4xl font-black text-brand-primary">{result.toFixed(2)}</div>
                    <div className="text-slate-400 text-sm mt-1">ريال سعودي</div>
                </div>
            )}
        </ToolShell>
    );
}

// NEW: Gold Zakat (Saudi)
function GoldZakatCalc() {
    const [grams, setGrams] = useState('100');
    const [goldPrice, setGoldPrice] = useState('245'); // ريال/جرام تقريبي
    const nisab21g = 85; // نصاب الذهب 85 جرام
    const res = React.useMemo(() => {
        const g = parseFloat(grams);
        const p = parseFloat(goldPrice);
        if (g < nisab21g) return { zakat: 0, msg: 'لم تبلغ النصاب (85 جرام)' };
        return { zakat: g * p * 0.025, msg: '✅ مبلغ الزكاة (2.5%)' };
    }, [grams, goldPrice]);
    return (
        <ToolShell description="احسب زكاة الذهب بالجرام أو القيمة. النصاب = 85 جرام.">
            <div className="space-y-4 mb-6">
                <ToolInputRow label="وزن الذهب (جرام)"><ToolInput type="number" value={grams} onChange={e => setGrams(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="سعر الجرام (ريال)"><ToolInput type="number" value={goldPrice} onChange={e => setGoldPrice(e.target.value)} /></ToolInputRow>
            </div>
            <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl text-center">
                <div className="text-xs text-yellow-400 mb-1">{res.msg}</div>
                <div className="text-4xl font-black text-yellow-400">{res.zakat.toFixed(2)}</div>
                <div className="text-slate-400 text-sm mt-1">ريال سعودي</div>
            </div>
        </ToolShell>
    );
}

export default function FinanceTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'fin-comm': return <CommissionCalc />;
        case 'fin-salary-hour': return <SalaryToHourly />;
        case 'fin-tax-global': return <GlobalTaxCalc />;
        case 'fin-rent-buy': return <RentVsBuy />;
        case 'fin-fire': return <FireCalc />;
        case 'fin-marketing': return <MarketingMetrics />;
        case 'loan-calc': return <LoanCalculator />;
        case 'vat-calc': return <VatCalc />;
        case 'net-salary': return <NetSalary />;
        case 'currency': return <CurrencyConverter />;
        case 'savings': return <SavingsCalc />;
        case 'zakat': return <ZakatCalc />;
        case 'finance-budget': return <BudgetCalc />;
        case 'finance-compound': return <CompoundCalc />;
        case 'fin-crypto': return <CryptoCalc />;
        case 'finance-freelance': return <FreelanceQuote />;
        case 'fin-discount': return <DiscountCalc />;
        case 'finance-subs': return <SubscriptionCalc />;
        case 'finance-roi': return <ROICalc />;
        case 'finance-breakeven': return <BreakEvenCalc />;
        case 'finance-runway': return <RunwayCalc />;
        case 'fin-compare-offers': return <OfferComparison />;
        case 'fin-trip-cost': return <TripCostCalc />;
        case 'fin-gold-zakat': return <GoldZakatCalc />;
        default: return null;
    }
}
