/**
 * Calculate loan details including monthly payment, total interest, and total payment.
 * @param amount Principal loan amount
 * @param rate Annual interest rate (percentage)
 * @param term Loan term in years
 */
export function calculateLoan({ amount, rate, term }: { amount: number; rate: number; term: number }) {
    if (!amount || !term) {
        throw new Error("Amount and Term are required.");
    }

    const r = rate / 100 / 12;
    const n = term * 12;

    let monthly = 0;

    if (rate === 0) {
        monthly = amount / n;
    } else {
        monthly = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const totalPay = monthly * n;
    const totalInt = totalPay - amount;

    return {
        monthly: monthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        interest: totalInt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        total: totalPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        raw: { monthly, totalInt, totalPay }
    };
}

/**
 * Calculate VAT details (Add or Remove tax).
 * @param amount The monetary amount
 * @param rate VAT percentage (default 15)
 * @param mode 'add' to add VAT, 'remove' to remove VAT
 */
export function calculateVAT({ amount, rate = 15, mode }: { amount: number; rate: number; mode: 'add' | 'remove' }) {
    const r = rate / 100;

    let original, tax, final, label;

    if (mode === 'add') {
        original = amount;
        tax = amount * r;
        final = amount + tax;
        label = "المبلغ شامل الضريبة";
    } else {
        final = amount;
        original = amount / (1 + r);
        tax = final - original;
        label = "المبلغ قبل الضريبة";
    }

    return {
        original: original.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        tax: tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        final: final.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        label,
        raw: { original, tax, final }
    };
}

/**
 * Calculate Net Salary after GOSI deduction.
 * @param gross Total gross salary
 * @param basic Basic salary component (optional if gross provided)
 * @param housing Housing allowance component (optional if gross provided)
 */
export function calculateSalary({ gross, basic = 0, housing = 0 }: { gross?: number; basic?: number; housing?: number }) {
    let total = gross;

    if (!total && (basic || housing)) {
        total = basic + housing;
    }

    if (!total) {
        throw new Error("Either gross salary or basic + housing must be provided.");
    }

    const gosi = total * 0.0975;
    const net = total - gosi;

    return {
        gosi: gosi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        net: net.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        raw: { gosi, net, total }
    };
}

/**
 * Calculate Zakat (2.5%) on total assets.
 * @param assets Total assets value
 */
export function calculateZakat({ assets }: { assets: number }) {
    if (!assets) {
        throw new Error("Assets amount is required.");
    }

    const zakat = assets * 0.025;

    return {
        zakat: zakat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        raw: { zakat }
    };
}

/**
 * Calculate savings goal projection.
 * @param goal Target savings amount
 * @param current Current savings balance
 * @param monthly Monthly contribution amount
 */
export function calculateSavings({ goal, current, monthly }: { goal: number; current: number; monthly: number }) {
    if (!goal || !monthly) {
        throw new Error("Goal and Monthly savings amount are required.");
    }

    const remaining = goal - current;

    if (remaining <= 0) {
        return {
            time: "مبروك! حققت الهدف",
            total: "0",
            raw: { months: 0, total: 0 }
        };
    }

    const months = Math.ceil(remaining / monthly);
    const total = months * monthly;

    return {
        time: `${months} شهر`,
        total: total.toLocaleString() + ' ريال',
        remaining: remaining.toLocaleString() + ' ريال',
        raw: { months, total, remaining }
    };
}

/**
 * Calculate discounted price.
 * @param price Original price
 * @param off Discount percentage
 */
export function calculateDiscount({ price, off }: { price: number; off: number }) {
    if (!price || !off) {
        throw new Error("Price and Discount percentage are required.");
    }

    const save = price * (off / 100);
    const final = price - save;

    return {
        final: final.toFixed(2),
        save: save.toFixed(2),
        raw: { final, save }
    };
}

/**
 * Calculate bill split with calculated tip.
 * @param total Total bill amount
 * @param people Number of people splitting
 * @param tip Tip percentage
 */
export function calculateBillSplit({ total, people, tip }: { total: number; people: number; tip: number }) {
    const count = people || 1;
    const tipAmount = total * (tip / 100);
    const totalPay = total + tipAmount;
    const perPerson = totalPay / count;

    return {
        perPerson: perPerson.toFixed(2),
        totalPay: totalPay.toFixed(2),
        tipAmount: tipAmount.toFixed(2),
        raw: { perPerson, totalPay, tipAmount }
    };
}

// ------------------------------------------------------------------
// Converters & Invoice Logic (Batch 2)
// ------------------------------------------------------------------

export const EXCHANGE_RATES: Record<string, number> = {
    'USD': 1, 'SAR': 3.75, 'EUR': 0.92, 'GBP': 0.79, 'AED': 3.67, 'KWD': 0.31, 'EGP': 47.5
};

export const CRYPTO_PRICES: Record<string, number> = {
    'BTC': 65000, 'ETH': 3500, 'SOL': 140, 'BNB': 600, 'XRP': 0.60
};

/**
 * Convert currency amount.
 * @param amount Amount to convert
 * @param from Source currency
 * @param to Target currency
 */
export function convertCurrency({ amount, from = 'USD', to = 'SAR' }: { amount: number; from: string; to: string }) {
    const rate = EXCHANGE_RATES[to] / EXCHANGE_RATES[from];
    const converted = amount * rate;

    return {
        converted: converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        rate: rate.toFixed(4),
        raw: { converted, rate }
    };
}

/**
 * Convert crypto to fiat currency.
 * @param amount Crypto amount
 * @param coin Crypto symbol (BTC, ETH, etc)
 * @param currency Target fiat currency (USD, SAR, etc)
 */
export function convertCrypto({ amount, coin = 'BTC', currency = 'USD' }: { amount: number; coin: string; currency: string }) {
    const priceInUSD = CRYPTO_PRICES[coin];
    const rate = EXCHANGE_RATES[currency]; // USD base
    const totalValue = amount * priceInUSD * rate;

    return {
        value: totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 }),
        unitPrice: (priceInUSD * rate).toLocaleString(),
        raw: { totalValue }
    };
}

/**
 * Calculate invoice total.
 * @param items Array of invoice items { desc, price }
 */
export function calculateInvoice({ items }: { items: { desc: string; price: number }[] }) {
    const total = items.reduce((acc, curr) => acc + curr.price, 0);
    return {
        total: total.toLocaleString(),
        count: items.length,
        raw: { total }
    };
}
