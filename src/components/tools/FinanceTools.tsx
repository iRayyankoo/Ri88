"use client";
import React, { useState } from 'react';
import { ToolShell, ToolInputRow } from './ToolShell';

interface ToolProps {
    toolId: string;
}

// --- 1. Loan Calculator (Verified) ---
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
            monthly: monthly.toFixed(2) + ' ريال',
            interest: totalInt.toFixed(2) + ' ريال',
            total: totalPay.toFixed(2) + ' ريال',
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
            description="حساب الدفعات الشهرية وتفاصيل الفوائد بناءً على المبلغ والمدة."
            footer={
                <div className="flex w-full gap-3">
                    <button onClick={clear} className="ui-btn ghost min-w-[100px]">مسح</button>
                    <button onClick={calculate} className="ui-btn primary ui-w-full">احسب القسط</button>
                </div>
            }
        >
            <div className="tool-body">
                <ToolInputRow label="قيمة القرض (ريال)">
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="100000" className="ui-input" aria-label="Loan Amount in Riyals" />
                </ToolInputRow>
                <div className="ui-grid-2">
                    <ToolInputRow label="نسبة الفائدة (%)">
                        <input type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="3.5" step="0.1" className="ui-input" aria-label="Interest rate" />
                    </ToolInputRow>
                    <ToolInputRow label="المدة (سنوات)">
                        <input type="number" value={term} onChange={e => setTerm(e.target.value)} placeholder="5" className="ui-input" aria-label="Loan term" />
                    </ToolInputRow>
                </div>

                {result && (
                    <div className="ui-output">
                        <div className="ui-grid-2 mb-4">
                            <div>
                                <span className="ui-output-label">القسط الشهري</span>
                                <div className="text-[1.8em] font-extrabold text-[var(--ui-text)] mt-1">{result.monthly}</div>
                            </div>
                            <div>
                                <span className="ui-output-label">إجمالي الفائدة</span>
                                <div className="text-[1.4em] font-semibold text-[var(--ui-text-muted)] mt-1">{result.interest}</div>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-[var(--ui-stroke)]">
                            <span className="ui-output-label">المبلغ الإجمالي</span>
                            <div className="text-[1.2em] font-bold text-[var(--ui-g2)]">{result.total}</div>
                        </div>
                    </div>
                )}
            </div>
        </ToolShell>
    );
}

// --- 2. VAT Calculator ---
function VATCalculator() {
    const [amount, setAmount] = useState<string>('');
    const [rate, setRate] = useState<string>('15');
    const [result, setResult] = useState<null | { orig: string; tax: string; final: string }>(null);

    const calculate = (mode: 'add' | 'remove') => {
        const amt = parseFloat(amount);
        const r = parseFloat(rate) / 100;
        if (isNaN(amt)) return;

        let original, tax, final;
        if (mode === 'add') {
            original = amt;
            tax = amt * r;
            final = amt + tax;
        } else {
            final = amt;
            original = amt / (1 + r);
            tax = final - original;
        }

        setResult({
            orig: original.toFixed(2),
            tax: tax.toFixed(2),
            final: final.toFixed(2),
        });
    };

    return (
        <ToolShell description="حساب ضريبة القيمة المضافة (إضافة أو خصم).">
            <ToolInputRow label="المبلغ (ريال)">
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="مثال: 100" className="ui-input" aria-label="Amount for VAT" />
            </ToolInputRow>
            <ToolInputRow label="النسبة (%)">
                <input type="number" value={rate} onChange={e => setRate(e.target.value)} className="ui-input" aria-label="VAT Rate" />
            </ToolInputRow>

            <div className="ui-grid-2">
                <button onClick={() => calculate('add')} className="ui-btn primary ui-w-full">أضف الضريبة (+)</button>
                <button onClick={() => calculate('remove')} className="ui-btn ghost ui-w-full">أزل الضريبة (-)</button>
            </div>

            {result && (
                <div className="ui-output">
                    <div className="ui-grid-3">
                        <div><span className="ui-output-label">المبلغ الأصل</span><div>{result.orig}</div></div>
                        <div><span className="ui-output-label">الضريبة</span><div className="text-[var(--ui-g1)]">{result.tax}</div></div>
                        <div><span className="ui-output-label">الإجمالي</span><div className="font-bold">{result.final}</div></div>
                    </div>
                </div>
            )}
        </ToolShell>
    );
}

// --- 3. Net Salary ---
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

        const gosi = g * 0.0975; // Approx GOSI
        const net = g - gosi;

        setResult({
            gosi: gosi.toFixed(2) + ' ريال',
            net: net.toFixed(2) + ' ريال',
        });
    };

    return (
        <ToolShell description="تقدير صافي الراتب بعد خصم التأمينات الاجتماعية.">
            <ToolInputRow label="إجمالي الراتب">
                <input type="number" value={gross} onChange={e => setGross(e.target.value)} placeholder="مثال: 8000" className="ui-input" aria-label="Gross Salary" />
            </ToolInputRow>
            <div className="ui-grid-2">
                <ToolInputRow label="الأساسي">
                    <input type="number" value={basic} onChange={e => setBasic(e.target.value)} placeholder="6000" className="ui-input" aria-label="Basic Salary" />
                </ToolInputRow>
                <ToolInputRow label="بدل السكن">
                    <input type="number" value={housing} onChange={e => setHousing(e.target.value)} placeholder="2000" className="ui-input" aria-label="Housing Allowance" />
                </ToolInputRow>
            </div>
            <button onClick={calculate} className="ui-btn primary ui-w-full">احسب الصافي</button>

            {result && (
                <div className="ui-output">
                    <div className="ui-grid-2">
                        <div><span className="ui-output-label">خصم التأمينات</span><div>{result.gosi}</div></div>
                        <div><span className="ui-output-label">صافي الراتب</span><div className="text-[1.4em] font-bold text-[var(--ui-g2)]">{result.net}</div></div>
                    </div>
                </div>
            )}
        </ToolShell>
    );
}

// --- 6. Zakat ---
function ZakatCalculator() {
    const [assets, setAssets] = useState<string>('');
    const [result, setResult] = useState<string | null>(null);

    const calculate = () => {
        const val = parseFloat(assets);
        if (!val) return;
        setResult((val * 0.025).toLocaleString() + ' ريال');
    };

    return (
        <ToolShell description="حساب الزكاة الشرعية (2.5%) على إجمالي الأصول.">
            <ToolInputRow label="إجمالي الأصول (ريال)">
                <input type="number" value={assets} onChange={e => setAssets(e.target.value)} placeholder="مثال: 100000" className="ui-input" aria-label="Total Assets for Zakat" />
            </ToolInputRow>
            <button onClick={calculate} className="ui-btn primary ui-w-full">احسب الزكاة</button>

            {result && (
                <div className="ui-output text-center">
                    <span className="ui-output-label">الزكاة المستحقة</span>
                    <strong className="text-[1.6em] block mt-2 text-[var(--ui-g1)]">{result}</strong>
                </div>
            )}
        </ToolShell>
    );
}

// --- 5. Savings ---
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
            setResult({ time: "تم الوصول!", total: "0" });
            return;
        }
        const months = Math.ceil(remaining / m);
        const years = (months / 12).toFixed(1);
        setResult({
            time: `${months} شهر (${years} سنة)`,
            total: (months * m).toLocaleString() + ' ريال'
        });
    };

    return (
        <ToolShell description="خطط للوصول لهدفك المالي.">
            <ToolInputRow label="الهدف (ريال)">
                <input type="number" value={goal} onChange={e => setGoal(e.target.value)} className="ui-input" aria-label="Savings Goal" />
            </ToolInputRow>
            <div className="ui-grid-2">
                <ToolInputRow label="الحالي">
                    <input type="number" value={current} onChange={e => setCurrent(e.target.value)} className="ui-input" aria-label="Current Amount" />
                </ToolInputRow>
                <ToolInputRow label="ادخار شهري">
                    <input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} className="ui-input" aria-label="Monthly Savings" />
                </ToolInputRow>
            </div>
            <button onClick={calculate} className="ui-btn primary ui-w-full">احسب المدة</button>

            {result && (
                <div className="ui-output">
                    <div className="ui-grid-2">
                        <div><span className="ui-output-label">المدة اللازمة</span><strong>{result.time}</strong></div>
                        <div><span className="ui-output-label">إجمالي المدخرات</span><strong>{result.total}</strong></div>
                    </div>
                </div>
            )}
        </ToolShell>
    );
}

// --- 7. Currency ---
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
        setRes((val * rate).toFixed(2));
    }

    return (
        <ToolShell description="أسعار صرف العملات المباشرة.">
            <ToolInputRow label="المبلغ">
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="ui-input" aria-label="Amount to convert" />
            </ToolInputRow>
            <div className="ui-grid-2">
                <ToolInputRow label="من">
                    <select value={from} onChange={e => setFrom(e.target.value)} className="ui-input ui-select" aria-label="From Currency">
                        {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </ToolInputRow>
                <ToolInputRow label="إلى">
                    <select value={to} onChange={e => setTo(e.target.value)} className="ui-input ui-select" aria-label="To Currency">
                        {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </ToolInputRow>
            </div>
            <button onClick={convert} className="ui-btn primary ui-w-full">تحويل</button>
            {res && (
                <div className="ui-output text-center">
                    <strong className="text-[2em] text-[var(--ui-g2)]">{res} {to}</strong>
                </div>
            )}
        </ToolShell>
    );
}

// --- 8. Crypto ---
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
        <ToolShell description="تحويل العملات الرقمية.">
            <ToolInputRow label="الكمية">
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="ui-input" aria-label="Crypto Amount" />
            </ToolInputRow>
            <div className="ui-grid-2">
                <ToolInputRow label="العملة الرقمية">
                    <select value={coin} onChange={e => setCoin(e.target.value)} className="ui-input ui-select" aria-label="Cryptocurrency">
                        {Object.keys(prices).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </ToolInputRow>
                <ToolInputRow label="مقابل">
                    <select value={currency} onChange={e => setCurrency(e.target.value)} className="ui-input ui-select" aria-label="Target Currency">
                        {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </ToolInputRow>
            </div>
            <button onClick={convert} className="ui-btn primary ui-w-full">احسب القيمة</button>
            {res && (
                <div className="ui-output text-center">
                    <strong className="text-[2em] text-[var(--ui-g1)]">{res} {currency}</strong>
                </div>
            )}
        </ToolShell>
    );
}

// --- 9. Invoice ---
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
        <ToolShell description="إنشاء فاتورة بسيطة للطباعة.">
            <ToolInputRow label="العميل">
                <input value={client} onChange={e => setClient(e.target.value)} className="ui-input" aria-label="Client Name" />
            </ToolInputRow>

            <div className="ui-output p-0 bg-transparent border-0">
                <div className="flex gap-2 mb-4">
                    <input value={desc} onChange={e => setDesc(e.target.value)} className="ui-input flex-[2]" placeholder="الوصف" aria-label="Item Description" />
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="ui-input flex-1" placeholder="السعر" aria-label="Item Price" />
                    <button onClick={addItem} className="ui-btn ghost w-auto">+</button>
                </div>

                {items.length > 0 && (
                    <div className="ui-output">
                        {items.map((it, i) => (
                            <div key={i} className="flex justify-between border-b border-[var(--ui-stroke)] pb-2 mb-2">
                                <span>{it.desc}</span>
                                <span>{it.price} ريال</span>
                            </div>
                        ))}
                        <div className="flex justify-between font-bold text-[1.2em] mt-4">
                            <span>الإجمالي</span>
                            <span className="text-[var(--ui-g2)]">{total} ريال</span>
                        </div>
                    </div>
                )}
            </div>
            <button onClick={() => window.print()} className="ui-btn primary ui-w-full">طباعة</button>
        </ToolShell>
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
