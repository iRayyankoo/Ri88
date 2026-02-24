"use client";
import React, { useState } from 'react';
import { ToolShell, ToolInputRow } from './ToolShell';
import { ToolInput, ToolButton, ToolSelect } from './ToolUi';
import { FinalResultView } from '../Outputs/FinalResultView';
import { calculateLoan, calculateVAT, calculateSalary, calculateZakat, calculateSavings, calculateDiscount, calculateBillSplit, convertCurrency, convertCrypto, calculateInvoice, EXCHANGE_RATES, CRYPTO_PRICES } from '@/lib/tools/finance';
import { saveToHistory } from '@/lib/actions/history';
import { toast } from 'sonner';

interface ToolProps {
    toolId: string;
}

// --- 1. Loan Calculator (Verified) ---
// --- 1. Loan Calculator (Premium) ---
function LoanCalculator() {
    const [amount, setAmount] = useState<string>('');
    const [rate, setRate] = useState<string>('');
    const [term, setTerm] = useState<string>('');
    const [result, setResult] = useState<null | { monthly: string; interest: string; total: string }>(null);

    const calculate = () => {
        const P = parseFloat(amount);
        const r = parseFloat(rate);
        const termYears = parseFloat(term);

        if (!P || !termYears) return;

        try {
            const res = calculateLoan({ amount: P, rate: r, term: termYears });
            setResult({
                monthly: res.monthly,
                interest: res.interest,
                total: res.total
            });
        } catch (e) {
            console.error(e);
        }
    };

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!result) return;
        setIsSaving(true);
        try {
            const res = await saveToHistory({
                title: `حساب قرض: ${amount} ريال`,
                type: 'finance-loan',
                data: { ...result, inputAmount: amount, rate, term }
            });
            if (res.success) toast.success("تم الحفظ في السجل!");
            else toast.error(res.error || "فشل الحفظ");
        } finally {
            setIsSaving(false);
        }
    };

    const clear = () => {
        setAmount('');
        setRate('');
        setTerm('');
        setResult(null);
    };

    return (
        <ToolShell
            title="حاسبة القروض"
            description="حساب الدفعات الشهرية وتفاصيل الفوائد للقروض الشخصية والعقارية."
            onSave={result ? handleSave : undefined}
            isSaving={isSaving}
            results={result ? (
                <div className="h-full flex flex-col justify-center">
                    <div className="bg-white/5 border border-brand-primary/20 rounded-2xl p-8 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-brand-primary/5 blur-xl group-hover:bg-brand-primary/10 transition-colors duration-500" />
                        <p className="text-brand-secondary text-sm font-bold uppercase tracking-widest mb-4 relative z-10">القسط الشهري</p>
                        <h3 className="text-5xl font-black text-brand-primary mb-2 relative z-10 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                            {result.monthly} <span className="text-2xl text-white/50">ريال</span>
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-center">
                            <span className="text-xs text-slate-500 block mb-1">إجمالي الفوائد</span>
                            <span className="text-lg font-bold text-white">{result.interest}</span>
                        </div>
                        <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-center">
                            <span className="text-xs text-slate-500 block mb-1">المبلغ الإجمالي</span>
                            <span className="text-lg font-bold text-brand-secondary">{result.total}</span>
                        </div>
                    </div>
                </div>
            ) : null}
        >
            <div className="space-y-6">
                <ToolInputRow label="قيمة القرض (ريال)">
                    <ToolInput type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="100000" className="text-lg font-bold h-14" />
                </ToolInputRow>
                <div className="grid grid-cols-2 gap-4">
                    <ToolInputRow label="نسبة الفائدة (%)">
                        <ToolInput type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="3.5" step="0.1" className="text-lg font-bold h-14" />
                    </ToolInputRow>
                    <ToolInputRow label="المدة (سنوات)">
                        <ToolInput type="number" value={term} onChange={e => setTerm(e.target.value)} placeholder="5" className="text-lg font-bold h-14" />
                    </ToolInputRow>
                </div>
                <div className="flex gap-3 pt-4">
                    <ToolButton variant="ghost" onClick={clear} className="h-14 px-8">مسح</ToolButton>
                    <ToolButton onClick={calculate} className="w-full h-14 text-lg shadow-[0_0_30px_rgba(139,92,246,0.2)]">احسب القسط</ToolButton>
                </div>
            </div>
        </ToolShell>
    );
}

// --- 2. VAT Calculator (Premium Redesign) ---
function VATCalculator() {
    const [amount, setAmount] = useState<string>('');
    const [rate, setRate] = useState<string>('15');
    const [result, setResult] = useState<null | { orig: string; tax: string; final: string; label: string }>(null);

    const calculate = (mode: 'add' | 'remove') => {
        const amt = parseFloat(amount);
        const r = parseFloat(rate);
        if (isNaN(amt)) return;

        const res = calculateVAT({ amount: amt, rate: r, mode });

        setResult({
            orig: res.original,
            tax: res.tax,
            final: res.final,
            label: res.label
        });
    };

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!result) return;
        setIsSaving(true);
        try {
            const res = await saveToHistory({
                title: `${result.label}: ${result.final} ريال`,
                type: 'finance-vat',
                data: { ...result, inputAmount: amount, rate }
            });
            if (res.success) toast.success("تم الحفظ في السجل!");
            else toast.error(res.error || "فشل الحفظ");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <ToolShell
            title="حاسبة الضريبة (VAT)"
            description="حساب ضريبة القيمة المضافة بدقة عالية (إضافة أو خصم)."
            onSave={result ? handleSave : undefined}
            isSaving={isSaving}
            results={result ? (
                <div className="h-full flex flex-col justify-center">
                    {/* Main Result Card - High Contrast */}
                    <div className="bg-white/5 border border-brand-primary/20 rounded-2xl p-8 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-brand-primary/5 blur-xl group-hover:bg-brand-primary/10 transition-colors duration-500" />

                        <p className="text-brand-secondary text-sm font-bold uppercase tracking-widest mb-4 relative z-10">{result.label}</p>
                        <h3 className="text-5xl font-black text-brand-primary mb-2 relative z-10 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                            {result.final} <span className="text-2xl text-white/50">ريال</span>
                        </h3>
                    </div>

                    {/* Sub-Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-center">
                            <span className="text-xs text-slate-500 block mb-1">المبلغ الأساسي</span>
                            <span className="text-lg font-bold text-white">{result.orig}</span>
                        </div>
                        <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-center">
                            <span className="text-xs text-slate-500 block mb-1">قيمة الضريبة</span>
                            <span className="text-lg font-bold text-brand-secondary">{result.tax}</span>
                        </div>
                    </div>
                </div>
            ) : null}
        >
            <div className="space-y-6">
                <ToolInputRow label="المبلغ (ريال)">
                    <ToolInput
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="1000"
                        className="text-lg font-bold h-14"
                        autoFocus
                    />
                </ToolInputRow>

                <ToolInputRow label="نسبة الضريبة (%)">
                    <ToolInput
                        type="number"
                        value={rate}
                        onChange={e => setRate(e.target.value)}
                        className="text-lg font-bold h-14"
                    />
                </ToolInputRow>

                <div className="pt-6 grid grid-cols-1 gap-4">
                    <ToolButton
                        onClick={() => calculate('add')}
                        className="w-full h-14 text-lg shadow-[0_0_30px_rgba(139,92,246,0.2)] hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]"
                    >
                        حساب الضريبة (إضافة +)
                    </ToolButton>
                    <ToolButton
                        variant="ghost"
                        onClick={() => calculate('remove')}
                        className="w-full"
                    >
                        حساب الضريبة (خصم -)
                    </ToolButton>
                </div>
            </div>
        </ToolShell>
    );
}

// --- 3. Net Salary ---
// --- 3. Net Salary (Premium) ---
function SalaryCalculator() {
    const [gross, setGross] = useState<string>('');
    const [basic, setBasic] = useState<string>('');
    const [housing, setHousing] = useState<string>('');
    const [result, setResult] = useState<null | { gosi: string; net: string }>(null);

    const calculate = () => {
        const b = parseFloat(basic);
        const h = parseFloat(housing);
        const g = parseFloat(gross);

        try {
            const res = calculateSalary({ gross: g, basic: b, housing: h });
            setResult({
                gosi: res.gosi,
                net: res.net
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ToolShell description="تقدير صافي الراتب بعد خصم التأمينات الاجتماعية (GOSI)."
            results={result ? (
                <div className="h-full flex flex-col justify-center">
                    <div className="bg-white/5 border border-brand-primary/20 rounded-2xl p-8 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-brand-primary/5 blur-xl group-hover:bg-brand-primary/10 transition-colors duration-500" />
                        <p className="text-brand-secondary text-sm font-bold uppercase tracking-widest mb-4 relative z-10">صافي الراتب</p>
                        <h3 className="text-5xl font-black text-brand-primary mb-2 relative z-10 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                            {result.net} <span className="text-2xl text-white/50">ريال</span>
                        </h3>
                    </div>
                    <div className="mt-6 bg-black/20 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                        <span className="text-slate-400">خصم التأمينات (9.75%)</span>
                        <span className="text-xl font-bold text-red-400">-{result.gosi}</span>
                    </div>
                </div>
            ) : null}
        >
            <div className="space-y-8">
                <ToolInputRow label="إجمالي الراتب (مع البدلات)">
                    <ToolInput type="number" value={gross} onChange={e => setGross(e.target.value)} placeholder="مثال: 8000" className="text-xl h-16" />
                </ToolInputRow>
                <div className="grid grid-cols-2 gap-6">
                    <ToolInputRow label="الراتب الأساسي (اختياري)">
                        <ToolInput type="number" value={basic} onChange={e => setBasic(e.target.value)} placeholder="6000" className="h-14" />
                    </ToolInputRow>
                    <ToolInputRow label="بدل السكن (اختياري)">
                        <ToolInput type="number" value={housing} onChange={e => setHousing(e.target.value)} placeholder="2000" className="h-14" />
                    </ToolInputRow>
                </div>
                <ToolButton variant="iridescent" size="xl" onClick={calculate} className="w-full mt-4">احسب الصافي</ToolButton>
            </div>
        </ToolShell>
    );
}

// --- 6. Zakat ---
// --- 6. Zakat (Premium) ---
function ZakatCalculator() {
    const [assets, setAssets] = useState<string>('');
    const [result, setResult] = useState<string | null>(null);

    const calculate = () => {
        const val = parseFloat(assets);
        if (!val) return;

        try {
            const res = calculateZakat({ assets: val });
            setResult(res.zakat);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ToolShell description="حساب الزكاة الشرعية (2.5%) على إجمالي الأصول والمدخرات."
            results={result ? (
                <div className="h-full flex flex-col justify-center">
                    <div className="bg-white/5 border border-brand-primary/20 rounded-2xl p-8 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-brand-primary/5 blur-xl group-hover:bg-brand-primary/10 transition-colors duration-500" />
                        <p className="text-brand-secondary text-sm font-bold uppercase tracking-widest mb-4 relative z-10">الزكاة المستحقة</p>
                        <h3 className="text-5xl font-black text-brand-primary mb-2 relative z-10 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                            {result} <span className="text-2xl text-white/50">ريال</span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-2 relative z-10">(ربع العشر 2.5%)</p>
                    </div>
                </div>
            ) : null}
        >
            <div className="space-y-10">
                <ToolInputRow label="إجمالي الأصول (النقد، الذهب، عروض التجارة)">
                    <ToolInput type="number" value={assets} onChange={e => setAssets(e.target.value)} placeholder="مثال: 100000" className="text-xl h-20" />
                </ToolInputRow>
                <ToolButton variant="iridescent" size="xl" onClick={calculate} className="w-full">احسب الزكاة</ToolButton>
            </div>
        </ToolShell>
    );
}

// --- 5. Savings ---
// --- 5. Savings (Premium) ---
function SavingsCalculator() {
    const [goal, setGoal] = useState('');
    const [current, setCurrent] = useState('');
    const [monthly, setMonthly] = useState('');
    const [result, setResult] = useState<null | { time: string, total: string }>(null);

    const calculate = () => {
        const g = parseFloat(goal);
        const c = parseFloat(current);
        const m = parseFloat(monthly);

        try {
            const res = calculateSavings({ goal: g, current: c, monthly: m });
            setResult({
                time: res.time,
                total: res.total
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ToolShell description="خطط للوصول لهدفك المالي؛ احسب كم من الوقت تحتاج."
            results={result ? (
                <div className="h-full flex flex-col justify-center">
                    <div className="bg-white/5 border border-brand-primary/20 rounded-2xl p-8 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-brand-primary/5 blur-xl group-hover:bg-brand-primary/10 transition-colors duration-500" />
                        <p className="text-brand-secondary text-sm font-bold uppercase tracking-widest mb-4 relative z-10">المدة المتوقعة</p>
                        <h3 className="text-5xl font-black text-brand-primary mb-2 relative z-10 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                            {result.time}
                        </h3>
                    </div>
                    <div className="mt-6 bg-black/20 p-4 rounded-xl border border-white/5 text-center">
                        <span className="text-xs text-slate-500 block mb-1">المبلغ المتبقي للهدف</span>
                        <span className="text-lg font-bold text-white">{(parseFloat(goal) - parseFloat(current)).toLocaleString()} ريال</span>
                    </div>
                </div>
            ) : null}
        >
            <div className="space-y-8">
                <ToolInputRow label="هدفك المالي (ريال)">
                    <ToolInput type="number" value={goal} onChange={e => setGoal(e.target.value)} className="h-16 text-xl" placeholder="1000000" />
                </ToolInputRow>
                <div className="grid grid-cols-2 gap-6">
                    <ToolInputRow label="رصيدك الحالي">
                        <ToolInput type="number" value={current} onChange={e => setCurrent(e.target.value)} className="h-14" placeholder="0" />
                    </ToolInputRow>
                    <ToolInputRow label="الادخار الشهري">
                        <ToolInput type="number" value={monthly} onChange={e => setMonthly(e.target.value)} className="h-14" placeholder="5000" />
                    </ToolInputRow>
                </div>
                <ToolButton variant="iridescent" size="xl" onClick={calculate} className="w-full mt-4">احسب المدة</ToolButton>
            </div>
        </ToolShell>
    );
}

// --- 7. Currency ---
// --- 7. Currency (Premium) ---
function CurrencyConverter() {
    const [amount, setAmount] = useState('1');
    const [from, setFrom] = useState('USD');
    const [to, setTo] = useState('SAR');
    const [res, setRes] = useState<string | null>(null);

    // Use centralized rates
    const rates = EXCHANGE_RATES;

    const convert = () => {
        const val = parseFloat(amount);
        if (!val) return;

        try {
            const res = convertCurrency({ amount: val, from, to });
            setRes(res.converted);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <ToolShell description="أسعار صرف العملات المباشرة والمحدثة دوريًا."
            results={res ? (
                <div className="h-full flex flex-col justify-center">
                    <div className="bg-white/5 border border-brand-primary/20 rounded-2xl p-8 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-brand-primary/5 blur-xl group-hover:bg-brand-primary/10 transition-colors duration-500" />
                        <p className="text-brand-secondary text-sm font-bold uppercase tracking-widest mb-4 relative z-10">القيمة المحولة</p>
                        <h3 className="text-5xl font-black text-brand-primary mb-2 relative z-10 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                            {res} <span className="text-2xl text-white/50">{to}</span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-4 relative z-10">
                            1 {from} = {(rates[to] / rates[from]).toFixed(4)} {to}
                        </p>
                    </div>
                </div>
            ) : null}
        >
            <div className="space-y-6">
                <ToolInputRow label="المبلغ">
                    <ToolInput type="number" value={amount} onChange={e => setAmount(e.target.value)} className="h-16 text-xl" />
                </ToolInputRow>
                <div className="grid grid-cols-2 gap-6">
                    <ToolInputRow label="من" id="curr-from">
                        <ToolSelect id="curr-from" value={from} onChange={e => setFrom(e.target.value)} className="h-14" aria-label="From Currency" title="من عملة (From Currency)">
                            {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
                        </ToolSelect>
                    </ToolInputRow>
                    <ToolInputRow label="إلى" id="curr-to">
                        <ToolSelect id="curr-to" value={to} onChange={e => setTo(e.target.value)} className="h-14" aria-label="To Currency" title="إلى عملة (To Currency)">
                            {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
                        </ToolSelect>
                    </ToolInputRow>
                </div>
                <ToolButton variant="iridescent" size="xl" onClick={convert} className="w-full mt-6">تحويل العملة</ToolButton>
            </div>
        </ToolShell>
    );
}

// --- 8. Crypto ---
// --- 8. Crypto (Premium) ---
function CryptoConverter() {
    const [amount, setAmount] = useState('1');
    const [coin, setCoin] = useState('BTC');
    const [currency, setCurrency] = useState('USD');
    const [res, setRes] = useState<string | null>(null);

    // Use centralized prices/rates
    const prices = CRYPTO_PRICES;
    const rates = EXCHANGE_RATES;

    const convert = () => {
        const val = parseFloat(amount);
        if (!val) return;

        try {
            const res = convertCrypto({ amount: val, coin, currency });
            setRes(res.value);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <ToolShell description="تتبع أسعار العملات الرقمية لحظة بلحظة."
            results={res ? (
                <div className="h-full flex flex-col justify-center">
                    <div className="bg-white/5 border border-brand-primary/20 rounded-2xl p-8 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-brand-primary/5 blur-xl group-hover:bg-brand-primary/10 transition-colors duration-500" />
                        <p className="text-brand-secondary text-sm font-bold uppercase tracking-widest mb-4 relative z-10">قيمة المحفظة</p>
                        <h3 className="text-5xl font-black text-brand-primary mb-2 relative z-10 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                            {res} <span className="text-2xl text-white/50">{currency}</span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-4 relative z-10">
                            1 {coin} = {(prices[coin] * rates[currency]).toLocaleString()} {currency}
                        </p>
                    </div>
                </div>
            ) : null}
        >
            <div className="space-y-8">
                <ToolInputRow label="الكمية">
                    <ToolInput type="number" value={amount} onChange={e => setAmount(e.target.value)} className="h-16 text-xl" />
                </ToolInputRow>
                <div className="grid grid-cols-2 gap-6">
                    <ToolInputRow label="العملة الرقمية" id="crypto-coin">
                        <ToolSelect id="crypto-coin" value={coin} onChange={e => setCoin(e.target.value)} className="h-14" aria-label="Crypto Coin" title="العملة الرقمية (Crypto Coin)">
                            {Object.keys(prices).map(c => <option key={c} value={c}>{c}</option>)}
                        </ToolSelect>
                    </ToolInputRow>
                    <ToolInputRow label="مقابل" id="crypto-target">
                        <ToolSelect id="crypto-target" value={currency} onChange={e => setCurrency(e.target.value)} className="h-14" aria-label="Target Currency" title="العملة الهدف (Target Currency)">
                            {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
                        </ToolSelect>
                    </ToolInputRow>
                </div>
                <ToolButton variant="iridescent" size="xl" onClick={convert} className="w-full mt-6">احسب القيمة</ToolButton>
            </div>
        </ToolShell>
    );
}

// ---// 3. Invoice Generator
export function InvoiceGenerator() {
    const [client, setClient] = useState('');
    const [items, setItems] = useState<{ desc: string, price: number }[]>([]);
    const [desc, setDesc] = useState('');
    const [price, setPrice] = useState('');



    const addItem = () => {
        if (!desc || !price) return;
        setItems([...items, { desc, price: parseFloat(price) }]);
        setDesc('');
        setPrice('');
    };

    const calculation = calculateInvoice({ items });
    const total = calculation.total;

    return (
        <ToolShell description="إنشاء فواتير احترافية جاهزة للطباعة."
            results={items.length > 0 ? (
                <div className="h-full flex flex-col">
                    <FinalResultView
                        resultData={items.map(i => ({ 'الصنف': i.desc, 'السعر': i.price.toLocaleString() + ' ريال' }))}
                        type="code"
                        title={`فاتورة: ${client || 'عميل نقدي'}`}
                        onDownload={() => window.print()}
                    />
                    <div className="mt-4 bg-brand-primary/10 border border-brand-primary/20 rounded-xl p-4 flex justify-between items-center">
                        <span className="font-bold text-brand-primary">الإجمالي النهائي</span>
                        <span className="text-2xl font-black text-white">{total.toLocaleString()} ريال</span>
                    </div>
                </div>
            ) : null}
        >
            <div className="space-y-6">
                <ToolInputRow label="بيانات العميل">
                    <ToolInput value={client} onChange={e => setClient(e.target.value)} className="h-12" placeholder="اسم العميل أو الشركة" />
                </ToolInputRow>

                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <h4 className="text-sm font-bold text-slate-400 mb-4">إضافة أصناف</h4>
                    <div className="space-y-3">
                        <ToolInput value={desc} onChange={e => setDesc(e.target.value)} className="h-10 text-sm" placeholder="وصف المنتج/الخدمة" />
                        <div className="flex gap-2">
                            <ToolInput type="number" value={price} onChange={e => setPrice(e.target.value)} className="h-10 text-sm flex-1" placeholder="السعر" />
                            <ToolButton variant="ghost" onClick={addItem} className="h-10 w-10 p-0 flex items-center justify-center bg-brand-primary/20 text-brand-primary border-brand-primary/30 hover:bg-brand-primary hover:text-white">+</ToolButton>
                        </div>
                    </div>
                </div>

                {/* Mini List in Input Area for Quick Reference */}
                {items.length > 0 && (
                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                        {items.map((it, i) => (
                            <div key={i} className="flex justify-between items-center text-sm p-2 rounded hover:bg-white/5 group">
                                <span className="text-slate-300">{it.desc}</span>
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-slate-400">{it.price}</span>
                                    <button
                                        onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                                        className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                    >
                                        حذف
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <ToolButton onClick={() => window.print()} className="w-full h-14 text-lg shadow-[0_0_30px_rgba(139,92,246,0.2)]">طباعة الفاتورة</ToolButton>
            </div>
        </ToolShell >
    );
}

// ---// 4. Bill Splitter
export function BillSplitter() {
    const [total, setTotal] = useState('');
    const [people, setPeople] = useState('2');
    const [tip, setTip] = useState('0');

    // Derived
    const t = parseFloat(total);
    const p = parseFloat(people);
    const tp = parseFloat(tip);

    const { perPerson, totalPay: totalBill, tipAmount } = calculateBillSplit({ total: t, people: p, tip: tp });

    return (
        <ToolShell description="تقسيم الفاتورة مع الإكرامية."
            results={
                <div className="mt-4 bg-white/5 border border-white/10 rounded-3xl p-8 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-brand-primary/5 blur-2xl group-hover:bg-brand-primary/10 transition-colors duration-500" />
                    <span className="text-sm text-slate-400 uppercase tracking-widest font-black font-cairo relative z-10">نصيب كل شخص</span>
                    <div className="text-6xl font-black text-brand-primary my-6 drop-shadow-[0_0_20px_rgba(139,92,246,0.3)] relative z-10">{perPerson}</div>
                    <div className="grid grid-cols-3 text-xs pt-6 border-t border-white/10 gap-6 mt-6 relative z-10 font-cairo">
                        <div className='flex flex-col'>
                            <span className='text-slate-500 mb-1 opacity-60 uppercase'>الإجمالي</span>
                            <span className='font-black text-white text-lg'>{totalBill}</span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-slate-500 mb-1 opacity-60 uppercase'>الفاتورة</span>
                            <span className='font-black text-white text-lg'>{t || 0}</span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-slate-500 mb-1 opacity-60 uppercase'>الإكرامية</span>
                            <span className='font-black text-brand-secondary text-lg'>{tipAmount}</span>
                        </div>
                    </div>
                </div>
            }
        >
            <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                    <ToolInputRow label="إجمالي الفاتورة">
                        <ToolInput type="number" value={total} onChange={e => setTotal(e.target.value)} className="h-16 text-xl" placeholder="500" />
                    </ToolInputRow>
                    <ToolInputRow label="عدد الأشخاص">
                        <ToolInput type="number" value={people} onChange={e => setPeople(e.target.value)} className="h-16 text-xl" placeholder="2" />
                    </ToolInputRow>
                </div>
                <ToolInputRow label={`نسبة الإكرامية (${tip}%)`}>
                    <div className="grid grid-cols-4 gap-3">
                        {[0, 10, 15, 20].map(t => (
                            <ToolButton
                                key={t}
                                variant={tip === t.toString() ? 'iridescent' : 'secondary'}
                                size="sm"
                                onClick={() => setTip(t.toString())}
                                className="h-12"
                            >
                                {t}%
                            </ToolButton>
                        ))}
                    </div>
                </ToolInputRow>
            </div>

            <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <span className="text-sm text-slate-400 uppercase tracking-widest font-bold">لكل شخص</span>
                <div className="text-5xl font-black text-brand-primary my-4 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">{perPerson}</div>
                <div className="grid grid-cols-3 text-sm pt-4 border-t border-white/10 gap-4 mt-4">
                    <div className='flex flex-col'>
                        <span className='text-slate-500 mb-1'>الإجمالي</span>
                        <span className='font-bold text-white'>{totalBill}</span>
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-slate-500 mb-1'>الفاتورة</span>
                        <span className='font-bold text-white'>{t || 0}</span>
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-slate-500 mb-1'>الإكرامية</span>
                        <span className='font-bold text-brand-secondary'>{tipAmount}</span>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}

function SimpleDiscountCalc() {
    const [price, setPrice] = useState('');
    const [off, setOff] = useState('');
    const [result, setResult] = useState<null | { final: string, save: string }>(null);

    const calc = () => {
        const p = parseFloat(price);
        const o = parseFloat(off);

        try {
            const res = calculateDiscount({ price: p, off: o });
            setResult({
                final: res.final,
                save: res.save
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <ToolShell description="حساب السعر بعد الخصم السريع."
            results={result ? (
                <div className="h-full flex flex-col justify-center">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-brand-primary/5 blur-2xl group-hover:bg-brand-primary/10 transition-colors duration-500" />
                        <div className="grid grid-cols-1 gap-8 relative z-10">
                            <div>
                                <span className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] font-cairo mb-4 block">السعر النهائي</span>
                                <strong className="text-6xl font-black text-brand-primary drop-shadow-[0_0_20px_rgba(139,92,246,0.3)] font-cairo">{result.final}</strong>
                            </div>
                            <div className="pt-8 border-t border-white/5">
                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest font-cairo mb-2 block">وفرت اليوم</span>
                                <strong className="text-3xl font-black text-green-400 font-cairo">{result.save}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        >
            <div className="space-y-8">
                <ToolInputRow label="السعر الأصلي">
                    <ToolInput type="number" value={price} onChange={e => setPrice(e.target.value)} className="h-16 text-xl" placeholder="1000" />
                </ToolInputRow>
                <ToolInputRow label="نسبة الخصم (%)">
                    <ToolInput type="number" value={off} onChange={e => setOff(e.target.value)} className="h-14" placeholder="15" />
                </ToolInputRow>
                <ToolButton variant="iridescent" size="xl" onClick={calc} className="w-full mt-6">تطبيق الخصم</ToolButton>
            </div>
        </ToolShell>
    );
}

export default function FinanceTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'loan-calc': return <LoanCalculator />;
        case 'vat-calc': return <VATCalculator />;
        case 'net-salary': return <SalaryCalculator />;
        case 'zakat': return <ZakatCalculator />;
        case 'savings': return <SavingsCalculator />;
        case 'fin-discount': return <SimpleDiscountCalc />;
        case 'currency': return <CurrencyConverter />;
        case 'fin-crypto': return <CryptoConverter />;
        case 'prod-inv': return <InvoiceGenerator />;
        case 'life-bill': return <BillSplitter />;
        case 'life-tip': return <BillSplitter />;
        default: return <div className="text-center py-12 text-gray-400">Tool not implemented yet: {toolId}</div>
    }
}
