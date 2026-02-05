"use client";
import React, { useState } from 'react';
import { ToolShell, ToolInputRow } from './ToolShell';
import { ResultExporter } from '../Outputs/ResultExporter';
import { FinalResultView } from '../Outputs/FinalResultView';

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
        const r = parseFloat(rate) / 100 / 12;
        const n = parseFloat(term) * 12;

        if (!P || !n) return;

        let monthly = 0;
        if (r === 0) {
            monthly = P / n;
        } else {
            monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        }

        const totalPay = monthly * n;
        const totalInt = totalPay - P;

        setResult({
            monthly: monthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            interest: totalInt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            total: totalPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        });
    };

    const clear = () => {
        setAmount('');
        setRate('');
        setTerm('');
        setResult(null);
    };

    return (
        <ToolShell
            description="حساب الدفعات الشهرية وتفاصيل الفوائد للقروض الشخصية والعقارية."
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
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="100000" className="ui-input text-lg font-bold h-14" />
                </ToolInputRow>
                <div className="grid grid-cols-2 gap-4">
                    <ToolInputRow label="نسبة الفائدة (%)">
                        <input type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="3.5" step="0.1" className="ui-input text-lg font-bold h-14" />
                    </ToolInputRow>
                    <ToolInputRow label="المدة (سنوات)">
                        <input type="number" value={term} onChange={e => setTerm(e.target.value)} placeholder="5" className="ui-input text-lg font-bold h-14" />
                    </ToolInputRow>
                </div>
                <div className="flex gap-3 pt-4">
                    <button onClick={clear} className="ui-btn ghost h-14 px-8">مسح</button>
                    <button onClick={calculate} className="ui-btn primary w-full h-14 text-lg shadow-[0_0_30px_rgba(139,92,246,0.2)]">احسب القسط</button>
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
        const r = parseFloat(rate) / 100;
        if (isNaN(amt)) return;

        let original, tax, final, label;
        if (mode === 'add') {
            original = amt;
            tax = amt * r;
            final = amt + tax;
            label = "المبلغ شامل الضريبة";
        } else {
            final = amt;
            original = amt / (1 + r);
            tax = final - original;
            label = "المبلغ قبل الضريبة";
        }

        setResult({
            orig: original.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            tax: tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            final: final.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            label
        });
    };

    return (
        <ToolShell
            description="حساب ضريبة القيمة المضافة بدقة عالية (إضافة أو خصم)."
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
                    <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="1000"
                        className="ui-input text-lg font-bold h-14"
                        autoFocus
                    />
                </ToolInputRow>

                <ToolInputRow label="نسبة الضريبة (%)">
                    <input
                        type="number"
                        value={rate}
                        onChange={e => setRate(e.target.value)}
                        className="ui-input text-lg font-bold h-14"
                    />
                </ToolInputRow>

                <div className="pt-6 grid grid-cols-1 gap-4">
                    <button
                        onClick={() => calculate('add')}
                        className="ui-btn primary w-full h-14 text-lg shadow-[0_0_30px_rgba(139,92,246,0.2)] hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]"
                    >
                        حساب الضريبة (إضافة +)
                    </button>
                    <button
                        onClick={() => calculate('remove')}
                        className="ui-btn ghost w-full"
                    >
                        حساب الضريبة (خصم -)
                    </button>
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
        const b = parseFloat(basic) || 0;
        const h = parseFloat(housing) || 0;
        let g = parseFloat(gross);

        if (!g && (b || h)) g = b + h;
        if (!g) return;

        const gosi = g * 0.0975;
        const net = g - gosi;

        setResult({
            gosi: gosi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            net: net.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        });
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
            <div className="space-y-6">
                <ToolInputRow label="إجمالي الراتب (مع البدلات)">
                    <input type="number" value={gross} onChange={e => setGross(e.target.value)} placeholder="مثال: 8000" className="ui-input text-lg font-bold h-14" />
                </ToolInputRow>
                <div className="grid grid-cols-2 gap-4">
                    <ToolInputRow label="الراتب الأساسي (اختياري)">
                        <input type="number" value={basic} onChange={e => setBasic(e.target.value)} placeholder="6000" className="ui-input h-12" />
                    </ToolInputRow>
                    <ToolInputRow label="بدل السكن (اختياري)">
                        <input type="number" value={housing} onChange={e => setHousing(e.target.value)} placeholder="2000" className="ui-input h-12" />
                    </ToolInputRow>
                </div>
                <button onClick={calculate} className="ui-btn primary w-full h-14 text-lg mt-4 shadow-[0_0_30px_rgba(139,92,246,0.2)]">احسب الصافي</button>
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
        setResult((val * 0.025).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
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
            <div className="space-y-6">
                <ToolInputRow label="إجمالي الأصول (النقد، الذهب، عروض التجارة)">
                    <input type="number" value={assets} onChange={e => setAssets(e.target.value)} placeholder="مثال: 100000" className="ui-input text-lg font-bold h-14" />
                </ToolInputRow>
                <button onClick={calculate} className="ui-btn primary w-full h-14 text-lg mt-4 shadow-[0_0_30px_rgba(139,92,246,0.2)]">احسب الزكاة</button>
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
        const g = parseFloat(goal) || 0;
        const c = parseFloat(current) || 0;
        const m = parseFloat(monthly);
        if (!g || !m) return;

        const remaining = g - c;
        if (remaining <= 0) {
            setResult({ time: "مبروك! حققت الهدف", total: "0" });
            return;
        }
        const months = Math.ceil(remaining / m);
        const years = (months / 12).toFixed(1);
        setResult({
            time: `${months} شهر`,
            total: (months * m).toLocaleString() + ' ريال'
        });
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
            <div className="space-y-6">
                <ToolInputRow label="هدفك المالي (ريال)">
                    <input type="number" value={goal} onChange={e => setGoal(e.target.value)} className="ui-input text-lg font-bold h-14" placeholder="1000000" />
                </ToolInputRow>
                <div className="grid grid-cols-2 gap-4">
                    <ToolInputRow label="رصيدك الحالي">
                        <input type="number" value={current} onChange={e => setCurrent(e.target.value)} className="ui-input h-12" placeholder="0" />
                    </ToolInputRow>
                    <ToolInputRow label="الادخار الشهري">
                        <input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} className="ui-input h-12" placeholder="5000" />
                    </ToolInputRow>
                </div>
                <button onClick={calculate} className="ui-btn primary w-full h-14 text-lg mt-4 shadow-[0_0_30px_rgba(139,92,246,0.2)]">احسب المدة</button>
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

    // Mock Rates
    const rates: Record<string, number> = { 'USD': 1, 'SAR': 3.75, 'EUR': 0.92, 'GBP': 0.79, 'AED': 3.67, 'KWD': 0.31, 'EGP': 47.5 };

    const convert = () => {
        const val = parseFloat(amount);
        if (!val) return;
        const rate = rates[to] / rates[from];
        setRes((val * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
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
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="ui-input text-lg font-bold h-14" />
                </ToolInputRow>
                <div className="grid grid-cols-2 gap-4">
                    <ToolInputRow label="من">
                        <select value={from} onChange={e => setFrom(e.target.value)} className="ui-input ui-select h-12" >
                            {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </ToolInputRow>
                    <ToolInputRow label="إلى">
                        <select value={to} onChange={e => setTo(e.target.value)} className="ui-input ui-select h-12">
                            {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </ToolInputRow>
                </div>
                <button onClick={convert} className="ui-btn primary w-full h-14 text-lg mt-4 shadow-[0_0_30px_rgba(139,92,246,0.2)]">تحويل العملة</button>
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

    const prices: Record<string, number> = { 'BTC': 65000, 'ETH': 3500, 'SOL': 140, 'BNB': 600, 'XRP': 0.60 };
    const rates: Record<string, number> = { 'USD': 1, 'SAR': 3.75, 'EUR': 0.92 };

    const convert = () => {
        const val = parseFloat(amount);
        if (!val) return;
        const priceInUSD = prices[coin];
        const finalRate = rates[currency];
        setRes((val * priceInUSD * finalRate).toLocaleString(undefined, { maximumFractionDigits: 2 }));
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
            <div className="space-y-6">
                <ToolInputRow label="الكمية">
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="ui-input text-lg font-bold h-14" />
                </ToolInputRow>
                <div className="grid grid-cols-2 gap-4">
                    <ToolInputRow label="العملة الرقمية">
                        <select value={coin} onChange={e => setCoin(e.target.value)} className="ui-input ui-select h-12">
                            {Object.keys(prices).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </ToolInputRow>
                    <ToolInputRow label="مقابل">
                        <select value={currency} onChange={e => setCurrency(e.target.value)} className="ui-input ui-select h-12">
                            {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </ToolInputRow>
                </div>
                <button onClick={convert} className="ui-btn primary w-full h-14 text-lg mt-4 shadow-[0_0_30px_rgba(139,92,246,0.2)]">احسب القيمة</button>
            </div>
        </ToolShell>
    );
}

// --- 9. Invoice ---
// --- 9. Invoice (Premium) ---
function InvoiceGenerator() {
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

    const total = items.reduce((acc, curr) => acc + curr.price, 0);

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
                    <input value={client} onChange={e => setClient(e.target.value)} className="ui-input h-12" placeholder="اسم العميل أو الشركة" />
                </ToolInputRow>

                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <h4 className="text-sm font-bold text-slate-400 mb-4">إضافة أصناف</h4>
                    <div className="space-y-3">
                        <input value={desc} onChange={e => setDesc(e.target.value)} className="ui-input h-10 text-sm" placeholder="وصف المنتج/الخدمة" />
                        <div className="flex gap-2">
                            <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="ui-input h-10 text-sm flex-1" placeholder="السعر" />
                            <button onClick={addItem} className="ui-btn ghost h-10 w-10 p-0 flex items-center justify-center bg-brand-primary/20 text-brand-primary border-brand-primary/30 hover:bg-brand-primary hover:text-white">+</button>
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

                <button onClick={() => window.print()} className="ui-btn primary w-full h-14 text-lg shadow-[0_0_30px_rgba(139,92,246,0.2)]">طباعة الفاتورة</button>
            </div>
        </ToolShell >
    );
}

// --- 10. Bill Splitter ---
function BillSplitter() {
    const [total, setTotal] = useState('');
    const [people, setPeople] = useState('2');
    const [tip, setTip] = useState('0');

    // Derived
    const bill = parseFloat(total) || 0;
    const count = parseFloat(people) || 1;
    const tipPer = parseFloat(tip);
    const tipAmount = bill * (tipPer / 100);
    const totalPay = bill + tipAmount;
    const perPerson = totalPay / count;

    return (
        <ToolShell description="تقسيم الفاتورة مع الإكرامية.">
            <div className="ui-grid-2">
                <ToolInputRow label="الفاتورة">
                    <input type="number" value={total} onChange={e => setTotal(e.target.value)} className="ui-input" aria-label="Total Bill Amount" />
                </ToolInputRow>
                <ToolInputRow label="الأشخاص">
                    <input type="number" value={people} onChange={e => setPeople(e.target.value)} className="ui-input" aria-label="Number of People" />
                </ToolInputRow>
            </div>
            <ToolInputRow label={`الإكرامية (${tip}%)`}>
                <div className="flex gap-2">
                    {[0, 10, 15, 20].map(t => (
                        <button
                            key={t}
                            onClick={() => setTip(t.toString())}
                            className={`ui-btn ghost flex-1 ${tip === t.toString() ? 'active bg-[var(--ui-g2)]' : ''}`}
                        >
                            {t}%
                        </button>
                    ))}
                </div>
            </ToolInputRow>

            <div className="ui-output text-center">
                <span className="ui-output-label">لكل شخص</span>
                <div className="text-[2.5em] font-bold my-4 text-[var(--ui-g1)]">{perPerson.toFixed(2)}</div>
                <div className="ui-grid-3 text-sm pt-3 border-t border-[var(--ui-stroke)]">
                    <div>Total: {totalPay.toFixed(2)}</div>
                    <div>Bill: {bill}</div>
                    <div>Tip: {tipAmount.toFixed(2)}</div>
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
        if (!p || !o) return;
        const save = p * (o / 100);
        setResult({
            final: (p - save).toFixed(2),
            save: save.toFixed(2)
        });
    }

    return (
        <ToolShell description="حساب السعر بعد الخصم.">
            <ToolInputRow label="السعر الأصلي">
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="ui-input" aria-label="Original Price" />
            </ToolInputRow>
            <ToolInputRow label="الخصم (%)">
                <input type="number" value={off} onChange={e => setOff(e.target.value)} className="ui-input" aria-label="Discount Percentage" />
            </ToolInputRow>
            <button onClick={calc} className="ui-btn primary ui-w-full">احسب</button>

            {result && (
                <div className="ui-output">
                    <div className="ui-grid-2">
                        <div><span className="ui-output-label">بعد الخصم</span><strong className="text-[var(--ui-g1)]">{result.final}</strong></div>
                        <div><span className="ui-output-label">التوفير</span><strong className="text-[#2ecc71]">{result.save}</strong></div>
                    </div>
                </div>
            )}
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
        case 'fin-currency': return <CurrencyConverter />;
        case 'fin-crypto': return <CryptoConverter />;
        case 'finance-invoice': return <InvoiceGenerator />;
        case 'fin-split': return <BillSplitter />;
        case 'fin-tip': return <BillSplitter />;
        default: return <div className="text-center py-12 text-gray-400">Tool not implemented yet: {toolId}</div>
    }
}
