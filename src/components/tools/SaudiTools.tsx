"use client";
import React, { useState, useEffect } from 'react';

interface ToolProps {
    toolId: string;
}

// ----------------------------------------------------------------------
// 1. End of Service Calculator
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
        <div className="tool-ui-group">
            <div className="input-row">
                <label>الراتب الإجمالي (ريال)</label>
                <input type="number" value={salary} onChange={e => setSalary(e.target.value)} className="glass-input" placeholder="e.g. 5000" />
            </div>
            <div className="input-row">
                <label>سنوات الخدمة</label>
                <input type="number" value={years} onChange={e => setYears(e.target.value)} className="glass-input" placeholder="e.g. 6.5" />
            </div>
            <div className="input-row">
                <label>سبب إنهاء الخدمة</label>
                <select value={reason} onChange={e => setReason(e.target.value)} className="glass-input">
                    <option value="term">إنهاء من قبل صاحب العمل (كامل)</option>
                    <option value="resign">استقالة</option>
                </select>
            </div>
            <button onClick={calculate} className="btn-primary full-width">احسب المكافأة</button>

            {result && (
                <div className="result-box">
                    <h3>المكافأة التقديرية</h3>
                    <div style={{ fontSize: '2em', color: 'var(--accent-pink)', fontWeight: 'bold' }}>{result}</div>
                    <p className="tool-desc" style={{ fontSize: '0.8em' }}>*تنبيه: تقدير مبني على نظام العمل السعودي. راجع الموارد البشرية.</p>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// 2. Vacation Salary & Return Date
function VacationCalculator() {
    const [salary, setSalary] = useState('');
    const [days, setDays] = useState('');
    const [startDate, setStartDate] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [returnDate, setReturnDate] = useState<string | null>(null);

    const calculate = () => {
        // Salary
        const s = parseFloat(salary);
        const d = parseFloat(days);
        if (s && d) {
            setResult(((s / 30) * d).toFixed(2));
        }

        // Return Date
        if (startDate && d) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + d);
            setReturnDate(date.toLocaleDateString('ar-SA')); // Hijri/Arabic format preference often
        }
    };

    return (
        <div className="tool-ui-group">
            <div className="input-row"><label>الراتب الإجمالي</label><input type="number" value={salary} onChange={e => setSalary(e.target.value)} className="glass-input" /></div>
            <div className="input-row"><label>مدة الإجازة (أيام)</label><input type="number" value={days} onChange={e => setDays(e.target.value)} className="glass-input" /></div>
            <div className="input-row"><label>تاريخ بداية الإجازة</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="glass-input" /></div>

            <button onClick={calculate} className="btn-primary full-width">احسب</button>

            {result && (
                <div className="result-box">
                    <h3>الراتب المقدم</h3>
                    <div style={{ fontSize: '2em', color: 'var(--accent-pink)' }}>{result} ريال</div>
                </div>
            )}
            {returnDate && (
                <div className="result-box" style={{ marginTop: '10px', borderColor: 'var(--accent-cyan)' }}>
                    <h3>تاريخ العودة المتوقع</h3>
                    <div style={{ fontSize: '1.5em', color: 'var(--accent-cyan)' }}>{returnDate}</div>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// 5. IBAN Validator
function IbanValidator() {
    const [iban, setIban] = useState('');
    const [valid, setValid] = useState<boolean | null>(null);

    const validate = () => {
        // Basic SA IBAN check: SA + 2 digits + 20 alphanumeric = 24 chars total
        // Simple logic: Starts with SA, length 24
        const clean = iban.replace(/\s/g, '').toUpperCase();
        if (clean.startsWith('SA') && clean.length === 24) {
            setValid(true);
        } else {
            setValid(false);
        }
        // Full algorithm (mod 97) is better but keeping it lightweight for now unless requested
    };

    return (
        <div className="tool-ui-group">
            <input value={iban} onChange={e => setIban(e.target.value)} className="glass-input full-width mb-4" placeholder="SA..." />
            <button onClick={validate} className="btn-primary full-width">تحقق</button>
            {valid !== null && (
                <div className={`mt-4 text-center font-bold ${valid ? 'text-green-500' : 'text-red-500'}`}>
                    {valid ? 'IBAN صحيح (شكلياً)' : 'IBAN غير صالح'}
                </div>
            )}
        </div>
    );
}


// ----------------------------------------------------------------------
// 6. Tafqeet (Number to Text)
function TafqeetTool() {
    const [num, setNum] = useState('');
    const [text, setText] = useState('');

    const convert = () => {
        const n = parseInt(num);
        if (isNaN(n)) return;

        // Simplified Tafqeet Logic for Demo
        // Full logic requires extensive grammar rules.
        // This is a placeholder for the logic or a basic implementation for small numbers.

        const units = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
        const teens = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
        const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
        const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

        if (n === 0) { setText('صفر'); return; }

        // Very basic 0-999 handler for demonstration
        let res = '';
        if (n < 10) res = units[n];
        else if (n < 20) res = teens[n - 10];
        else if (n < 100) res = units[n % 10] + (n % 10 ? ' و ' : '') + tens[Math.floor(n / 10)];
        else if (n < 1000) res = hundreds[Math.floor(n / 100)] + (n % 100 ? ' و ' + (n % 100) : ''); // simplified recursive optional
        else res = "العدد كبير، يرجى استخدام مكتبة تفقيط متخصصة.";

        setText(res + ' ريال فقط لا غير');
    };

    return (
        <div className="tool-ui-group">
            <input type="number" value={num} onChange={e => setNum(e.target.value)} className="glass-input full-width mb-4" placeholder="المبلغ (مثال: 150)" />
            <button onClick={convert} className="btn-primary full-width">تحويل إلى نص</button>
            {text && (
                <div className="glass-panel p-4 mt-4 text-center font-bold text-lg text-accent-pink">
                    {text}
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// 3. Hijri Date Converter (Simple)
function HijriDate() {
    const [today, setToday] = useState('');
    useEffect(() => {
        setToday(new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date()));
    }, []);
    return (
        <div className="tool-ui-group">
            <h3 className="text-center text-xl mb-4" style={{ textAlign: 'center' }}>تاريخ اليوم الهجري</h3>
            <div className="glass-panel p-6 text-center text-2xl font-bold text-accent-cyan" style={{ padding: '20px', textAlign: 'center', fontSize: '1.5em', color: 'var(--accent-cyan)' }}>
                {today}
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// 4. Saudi Events (Simple Placeholder)
function SaudiEvents() {
    return (
        <div className="tool-ui-group">
            <h3 className="text-center text-xl mb-4" style={{ textAlign: 'center' }}>الأحداث السعودية القادمة</h3>
            <div className="glass-panel" style={{ padding: '15px', marginBottom: '10px', textAlign: 'center' }}>
                🎉 <b>يوم التأسيس</b> <br /> 22 فبراير
            </div>
            <div className="glass-panel" style={{ padding: '15px', textAlign: 'center' }}>
                🇸🇦 <b>اليوم الوطني</b> <br /> 23 سبتمبر
            </div>
        </div>
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
        default: return <div style={{ padding: '20px', textAlign: 'center' }}>Tool coming soon: {toolId}</div>
    }
}
