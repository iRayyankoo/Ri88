"use client";
import React, { useState } from 'react';
import { ToolShell, ToolInputRow } from './ToolShell';
import { ToolInput, ToolButton } from './ToolUi';
import { Calculator } from 'lucide-react';

interface ToolProps {
    toolId: string;
}

// 1. Profit Margin Calculator
function ProfitMarginCalc() {
    const [revenue, setRevenue] = useState<string>('');
    const [cost, setCost] = useState<string>('');
    const [margin, setMargin] = useState<number | null>(null);
    const [profit, setProfit] = useState<number | null>(null);

    const calculate = () => {
        const rev = parseFloat(revenue);
        const cst = parseFloat(cost);
        if (isNaN(rev) || isNaN(cst) || rev === 0) return;

        const prof = rev - cst;
        setProfit(prof);
        setMargin((prof / rev) * 100);
    };

    return (
        <ToolShell
            description="حساب هامش الربح الإجمالي وصافي الربح بناءً على التكلفة والإيرادات."
            results={margin !== null && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="stitch-glass p-4 text-center">
                        <p className="text-slate-400 text-xs mb-1">هامش الربح</p>
                        <p className="text-2xl font-black text-brand-secondary">{margin.toFixed(2)}%</p>
                    </div>
                    <div className="stitch-glass p-4 text-center">
                        <p className="text-slate-400 text-xs mb-1">صافي الربح</p>
                        <p className="text-2xl font-black text-white">{profit?.toLocaleString()}</p>
                    </div>
                </div>
            )}
        >
            <div className="space-y-4">
                <ToolInputRow label="الإيرادات (Revenue)">
                    <ToolInput type="number" value={revenue} onChange={e => setRevenue(e.target.value)} placeholder="0.00" />
                </ToolInputRow>
                <ToolInputRow label="التكلفة (Cost)">
                    <ToolInput type="number" value={cost} onChange={e => setCost(e.target.value)} placeholder="0.00" />
                </ToolInputRow>
                <ToolButton onClick={calculate} className="w-full">احسب الهامش</ToolButton>
            </div>
        </ToolShell>
    );
}

// 2. Markup Calculator
function MarkupCalc() {
    const [cost, setCost] = useState<string>('');
    const [markup, setMarkup] = useState<string>('');
    const [price, setPrice] = useState<number | null>(null);
    const [profit, setProfit] = useState<number | null>(null);

    const calculate = () => {
        const cst = parseFloat(cost);
        const mkp = parseFloat(markup);
        if (isNaN(cst) || isNaN(mkp)) return;

        const selPrice = cst * (1 + mkp / 100);
        setPrice(selPrice);
        setProfit(selPrice - cst);
    };

    return (
        <ToolShell
            description="تحديد سعر البيع بناءً على التكلفة ونسبة الربح المطلوبة (Markup)."
            results={price !== null && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="stitch-glass p-4 text-center border-brand-primary/20">
                        <p className="text-slate-400 text-xs mb-1">سعر البيع</p>
                        <p className="text-2xl font-black text-brand-primary">{price.toFixed(2)}</p>
                    </div>
                    <div className="stitch-glass p-4 text-center">
                        <p className="text-slate-400 text-xs mb-1">الربح لكل وحدة</p>
                        <p className="text-2xl font-black text-white">{profit?.toFixed(2)}</p>
                    </div>
                </div>
            )}
        >
            <div className="space-y-4">
                <ToolInputRow label="التكلفة الأساسية">
                    <ToolInput type="number" value={cost} onChange={e => setCost(e.target.value)} placeholder="0.00" />
                </ToolInputRow>
                <ToolInputRow label="نسبة الزيادة (Markup %)">
                    <ToolInput type="number" value={markup} onChange={e => setMarkup(e.target.value)} placeholder="25" />
                </ToolInputRow>
                <ToolButton onClick={calculate} className="w-full">احسب سعر البيع</ToolButton>
            </div>
        </ToolShell>
    );
}

// 3. CAGR Calculator
function CAGRCalc() {
    const [startVal, setStartVal] = useState<string>('');
    const [endVal, setEndVal] = useState<string>('');
    const [years, setYears] = useState<string>('');
    const [cagr, setCagr] = useState<number | null>(null);

    const calculate = () => {
        const sv = parseFloat(startVal);
        const ev = parseFloat(endVal);
        const y = parseFloat(years);
        if (isNaN(sv) || isNaN(ev) || isNaN(y) || y === 0 || sv === 0) return;

        const res = (Math.pow(ev / sv, 1 / y) - 1) * 100;
        setCagr(res);
    };

    return (
        <ToolShell
            description="حساب معدل النمو السنوي المركب (CAGR) للاستثمارات أو نمو الأعمال."
            results={cagr !== null && (
                <div className="stitch-glass p-6 text-center border-brand-secondary/30">
                    <p className="text-slate-400 mb-2">معدل النمو السنوي المركب</p>
                    <p className="text-4xl font-black text-brand-secondary">{cagr.toFixed(2)}%</p>
                </div>
            )}
        >
            <div className="space-y-4">
                <ToolInputRow label="القيمة الأولية">
                    <ToolInput type="number" value={startVal} onChange={e => setStartVal(e.target.value)} placeholder="1000" />
                </ToolInputRow>
                <ToolInputRow label="القيمة النهائية">
                    <ToolInput type="number" value={endVal} onChange={e => setEndVal(e.target.value)} placeholder="2000" />
                </ToolInputRow>
                <ToolInputRow label="عدد السنوات">
                    <ToolInput type="number" value={years} onChange={e => setYears(e.target.value)} placeholder="5" />
                </ToolInputRow>
                <ToolButton onClick={calculate} className="w-full">احسب CAGR</ToolButton>
            </div>
        </ToolShell>
    );
}

// 4. Burn Rate Calculator
function BurnRateCalc() {
    const [balance, setBalance] = useState<string>('');
    const [monthlyBurn, setMonthlyBurn] = useState<string>('');
    const [runway, setRunway] = useState<number | null>(null);

    const calculate = () => {
        const bal = parseFloat(balance);
        const burn = parseFloat(monthlyBurn);
        if (isNaN(bal) || isNaN(burn) || burn === 0) return;

        setRunway(bal / burn);
    };

    return (
        <ToolShell
            description="حساب المعدل الزمني المتبقي لنفاذ السيولة (Runway) بناءً على المصاريف الشهرية."
            results={runway !== null && (
                <div className="stitch-glass p-6 text-center border-red-500/20">
                    <p className="text-slate-400 mb-2">المدة المتبقية بالشهور</p>
                    <p className="text-4xl font-black text-red-400">{runway.toFixed(1)} شهر</p>
                    <p className="text-xs text-slate-500 mt-2">بناءً على معدل حصر حالي قدره {monthlyBurn}</p>
                </div>
            )}
        >
            <div className="space-y-4">
                <ToolInputRow label="رصيد السيولة الحالي">
                    <ToolInput type="number" value={balance} onChange={e => setBalance(e.target.value)} placeholder="50000" />
                </ToolInputRow>
                <ToolInputRow label="المصاريف الشهرية (Burn)">
                    <ToolInput type="number" value={monthlyBurn} onChange={e => setMonthlyBurn(e.target.value)} placeholder="5000" />
                </ToolInputRow>
                <ToolButton onClick={calculate} className="w-full">احسب الـ Runway</ToolButton>
            </div>
        </ToolShell>
    );
}

// 5. Business Card Visualizer (Phase 8)
function BizCardVisualizer() {
    const [name, setName] = useState('ريان العتيبي');
    const [title, setTitle] = useState('مطور برمجيات خبير');
    const [email, setEmail] = useState('rayyan@example.com');
    const [phone, setPhone] = useState('+966 50 000 0000');

    return (
        <ToolShell description="تخطيط ومعاينة تصميم بطاقة العمل الخاصة بك بشكل فوري.">
            <div className="space-y-4 mb-8">
                <ToolInputRow label="الاسم"><ToolInput value={name} onChange={e => setName(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="المسمى الوظيفي"><ToolInput value={title} onChange={e => setTitle(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="البريد"><ToolInput value={email} onChange={e => setEmail(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="الجوال"><ToolInput value={phone} onChange={e => setPhone(e.target.value)} /></ToolInputRow>
            </div>
            <div className="relative w-full aspect-[1.75/1] bg-gradient-to-br from-slate-900 to-black border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-[60px] rounded-full -mr-16 -mt-16" />
                <div className="relative h-full flex flex-col justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-white mb-1 transition-all group-hover:text-brand-primary">{name}</h2>
                        <p className="text-brand-secondary font-bold text-sm tracking-widest">{title}</p>
                    </div>
                    <div className="space-y-1 text-slate-400 text-xs">
                        <p>{phone}</p>
                        <p>{email}</p>
                        <p>الرياض, المملكة العربية السعودية</p>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}

// 6. Profit/Loss Calc (Phase 8)
function ProfitLossCalc() {
    const [income, setIncome] = useState('10000');
    const [expenses, setExpenses] = useState('6000');
    const res = parseFloat(income) - parseFloat(expenses);
    return (
        <ToolShell description="حساب صافي الأرباح والخسائر الشهرية لعملك أو مشروعك الخاص.">
            <ToolInputRow label="إجمالي الدخل"><ToolInput type="number" value={income} onChange={e => setIncome(e.target.value)} /></ToolInputRow>
            <ToolInputRow label="إجمالي المصاريف"><ToolInput type="number" value={expenses} onChange={e => setExpenses(e.target.value)} /></ToolInputRow>
            <div className={`mt-8 p-8 rounded-3xl border text-center ${res >= 0 ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                <span className="text-xs text-slate-400 block mb-2">{res >= 0 ? 'صافي الربح' : 'صافي الخسارة'}</span>
                <h3 className={`text-4xl font-black ${res >= 0 ? 'text-green-400' : 'text-red-400'}`}>{res.toLocaleString()} ريال</h3>
            </div>
        </ToolShell>
    );
}

// 7. SaaS Runway (Phase 8)
function SaasRunway() {
    const [cash, setCash] = useState('100000');
    const [mrr, setMrr] = useState('5000');
    const [burn, setBurn] = useState('8000');
    const netBurn = parseFloat(burn) - parseFloat(mrr);
    const runway = netBurn > 0 ? parseFloat(cash) / netBurn : Infinity;

    return (
        <ToolShell description="حساب المدة المتبقية لاستمرارية شركتك الناشئة بناءً على الكاش والـ MRR والمصاريف.">
            <ToolInputRow label="رصيد الكاش"><ToolInput type="number" value={cash} onChange={e => setCash(e.target.value)} /></ToolInputRow>
            <ToolInputRow label="الدخل الشهري (MRR)"><ToolInput type="number" value={mrr} onChange={e => setMrr(e.target.value)} /></ToolInputRow>
            <ToolInputRow label="المصاريف الشهرية (Burn)"><ToolInput type="number" value={burn} onChange={e => setBurn(e.target.value)} /></ToolInputRow>
            <div className="mt-8 p-8 bg-black/40 border border-white/5 rounded-3xl text-center">
                <span className="text-xs text-slate-400 block mb-2">الاستمرارية المتوقعة (Runway)</span>
                <h3 className="text-4xl font-black text-white">
                    {runway === Infinity ? '∞ (مستقر)' : `${runway.toFixed(1)} شهر`}
                </h3>
            </div>
        </ToolShell>
    );
}

export default function BusinessTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'bus-margin': return <ProfitMarginCalc />;
        case 'bus-markup': return <MarkupCalc />;
        case 'bus-cagr': return <CAGRCalc />;
        case 'bus-burn': return <BurnRateCalc />;
        case 'biz-card': return <BizCardVisualizer />;
        case 'biz-profit': return <ProfitLossCalc />;
        case 'biz-runway': return <SaasRunway />;
        default: return <div className="text-center py-20 opacity-50"><Calculator className="w-12 h-12 mx-auto mb-4" /><p>يتم العمل على هذه الأداة...</p></div>;
    }
}
