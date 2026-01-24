"use client";
import React, { useState } from 'react';

interface ToolProps {
    toolId: string;
}

// --- 1. Loan Calculator ---
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

    return (
        <div className="tool-ui-group">
            <div className="input-row">
                <label>قيمة القرض (ريال)</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="مثال: 100000" className="glass-input" />
            </div>
            <div className="input-row">
                <label>نسبة الفائدة (%)</label>
                <input type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="مثال: 3.5" step="0.1" className="glass-input" />
            </div>
            <div className="input-row">
                <label>مدة القرض (سنوات)</label>
                <input type="number" value={term} onChange={e => setTerm(e.target.value)} placeholder="مثال: 5" className="glass-input" />
            </div>
            <button onClick={calculate} className="btn-primary full-width">احسب</button>

            {result && (
                <div className="result-box">
                    <div className="res-item"><span>القسط الشهري:</span> <strong>{result.monthly}</strong></div>
                    <div className="res-item"><span>إجمالي الفائدة:</span> <strong>{result.interest}</strong></div>
                    <div className="res-item"><span>إجمالي المبلغ:</span> <strong>{result.total}</strong></div>
                </div>
            )}
        </div>
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
        <div className="tool-ui-group">
            <div className="input-row">
                <label>المبلغ (ريال)</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="مثال: 100" className="glass-input" />
            </div>
            <div className="input-row">
                <label>نسبة الضريبة (%)</label>
                <input type="number" value={rate} onChange={e => setRate(e.target.value)} className="glass-input" />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button onClick={() => calculate('add')} className="btn-primary" style={{ flex: 1 }}>أضف الضريبة (+)</button>
                <button onClick={() => calculate('remove')} className="btn-primary" style={{ flex: 1, background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>أزل الضريبة (-)</button>
            </div>

            {result && (
                <div className="result-box">
                    <div className="res-item"><span>الأصل:</span> <strong>{result.orig}</strong></div>
                    <div className="res-item"><span>قيمة الضريبة:</span> <strong>{result.tax}</strong></div>
                    <div className="res-item"><span>الإجمالي:</span> <strong>{result.final}</strong></div>
                </div>
            )}
        </div>
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

        // GOSI: 9.75% of (Basic + Housing) approx, usually Basic+Housing <= 45000 cap
        // Simplified for demo as per original
        const gosi = g * 0.0975;
        const net = g - gosi;

        setResult({
            gosi: gosi.toFixed(2) + ' ريال',
            net: net.toFixed(2) + ' ريال',
        });
    };

    return (
        <div className="tool-ui-group">
            <div className="input-row">
                <label>إجمالي الراتب (الأساسي + السكن)</label>
                <input type="number" value={gross} onChange={e => setGross(e.target.value)} placeholder="مثال: 8000" className="glass-input" />
            </div>
            <div className="input-row">
                <label>الراتب الأساسي (لحساب التأمينات)</label>
                <input type="number" value={basic} onChange={e => setBasic(e.target.value)} placeholder="مثال: 6000" className="glass-input" />
            </div>
            <div className="input-row">
                <label>بدل السكن</label>
                <input type="number" value={housing} onChange={e => setHousing(e.target.value)} placeholder="مثال: 2000" className="glass-input" />
            </div>
            <button onClick={calculate} className="btn-primary full-width">احسب الصافي</button>

            {result && (
                <div className="result-box">
                    <div className="res-item"><small>التأمينات (9.75%):</small> <strong>{result.gosi}</strong></div>
                    <div className="res-item" style={{ fontSize: '1.2em', color: 'var(--accent-pink)' }}><span>صافي الراتب:</span> <strong>{result.net}</strong></div>
                </div>
            )}
            <p style={{ fontSize: '12px', color: '#aaa', marginTop: '10px' }}>*تقديرات بناءً على تأمينات القطاع الخاص (سعودي).</p>
        </div>
    );
}

// --- 6. Zakat Calculator ---
function ZakatCalculator() {
    const [assets, setAssets] = useState<string>('');
    const [result, setResult] = useState<string | null>(null);

    const calculate = () => {
        const val = parseFloat(assets);
        if (!val) return;
        setResult((val * 0.025).toLocaleString() + ' ريال');
    };

    return (
        <div className="tool-ui-group">
            <div className="input-row">
                <label>إجمالي الأصول الزكوية (ريال)</label>
                <small style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>النقد، الذهب، الفضة، الأسهم، وغيرها.. مر عليها حول.</small>
                <input type="number" value={assets} onChange={e => setAssets(e.target.value)} placeholder="مثال: 100000" className="glass-input" />
            </div>
            <button onClick={calculate} className="btn-primary full-width">احسب الزكاة (2.5%)</button>

            {result && (
                <div className="result-box">
                    <div className="res-item"><span>الزكاة المستحقة:</span> <strong style={{ fontSize: '1.4em', color: 'var(--accent-pink)' }}>{result}</strong></div>
                </div>
            )}
            <p style={{ fontSize: '11px', color: '#aaa', marginTop: '10px', textAlign: 'center' }}>
                *تنبيه: هذه حاسبة مبسطة. استشر مختصاً للأصول المعقدة أو زكاة العروض التجارية.
            </p>
        </div>
    );
}

// --- 5. Savings Goal ---
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
            setResult({ time: "تم الوصول للهدف!", total: "0" });
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
        <div className="tool-ui-group">
            <div className="input-row">
                <label>هدف الادخار (ريال)</label>
                <input type="number" value={goal} onChange={e => setGoal(e.target.value)} placeholder="مثال: 50000" className="glass-input" />
            </div>
            <div className="input-row">
                <label>المدخرات الحالية</label>
                <input type="number" value={current} onChange={e => setCurrent(e.target.value)} placeholder="مثال: 5000" className="glass-input" />
            </div>
            <div className="input-row">
                <label>المساهمة الشهرية</label>
                <input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} placeholder="مثال: 1000" className="glass-input" />
            </div>
            <button onClick={calculate} className="btn-primary full-width">احسب الخطة</button>

            {result && (
                <div className="result-box">
                    <div className="res-item"><span>الوقت للوصول للهدف:</span> <strong>{result.time}</strong></div>
                    <div className="res-item"><span>إجمالي المساهمات:</span> <strong>{result.total}</strong></div>
                </div>
            )}
        </div>
    );
}

// --- Main Switcher ---
export default function FinanceTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'loan-calc': return <LoanCalculator />;
        case 'vat-calc': return <VATCalculator />;
        case 'net-salary': return <SalaryCalculator />;
        case 'zakat': return <ZakatCalculator />;
        case 'savings': return <SavingsCalculator />;
        case 'fin-discount': // Using reusing generic text for now or implementation similar to VAT
            // Quick inline implementation for Discount
            return (
                <SimpleDiscountCalc />
            );
        default:
            return <div style={{ padding: '20px', textAlign: 'center' }}>Coming Soon... (Tool ID: {toolId})</div>;
    }
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
        <div className="tool-ui-group">
            <div className="input-row">
                <label>السعر الأصلي</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="glass-input" placeholder="مثال: 200" />
            </div>
            <div className="input-row">
                <label>الخصم (%)</label>
                <input type="number" value={off} onChange={e => setOff(e.target.value)} className="glass-input" placeholder="مثال: 30" />
            </div>
            <button onClick={calc} className="btn-primary full-width">احسب</button>

            {result && (
                <div className="result-box">
                    <div className="res-item"><span>السعر الجديد:</span> <strong style={{ color: 'var(--accent-pink)' }}>{result.final}</strong></div>
                    <div className="res-item"><span>وفرت:</span> <strong style={{ color: '#2ecc71' }}>{result.save}</strong></div>
                </div>
            )}
        </div>
    );
}
