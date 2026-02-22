import { z } from 'zod';

// --- Previous Schemas ---

export const LoanInputSchema = z.object({
    amount: z.number().positive().describe("The total loan amount in SAR (e.g., 100000)"),
    rate: z.number().min(0).describe("Annual interest rate as a percentage (e.g., 3.5 for 3.5%)"),
    term: z.number().positive().int().describe("Loan duration in years (e.g., 5)")
});

export type LoanInput = z.infer<typeof LoanInputSchema>;

export const VATInputSchema = z.object({
    amount: z.number().positive().describe("The monetary amount in SAR"),
    rate: z.number().min(0).default(15).describe("VAT percentage (default is 15%)"),
    mode: z.enum(['add', 'remove']).describe("Operation: 'add' to calculate price with tax, 'remove' to extract tax from price")
});

export type VATInput = z.infer<typeof VATInputSchema>;

export const SalaryInputSchema = z.object({
    gross: z.number().positive().optional().describe("Total gross salary including all allowances"),
    basic: z.number().nonnegative().optional().describe("Basic salary component"),
    housing: z.number().nonnegative().optional().describe("Housing allowance component")
}).refine(data => data.gross || (data.basic !== undefined || data.housing !== undefined), {
    message: "Either gross salary or basic/housing components must be provided"
});

export type SalaryInput = z.infer<typeof SalaryInputSchema>;

export const ZakatInputSchema = z.object({
    assets: z.number().positive().describe("Total assets value (cash, gold, trade goods) to calculate Zakat on")
});

export type ZakatInput = z.infer<typeof ZakatInputSchema>;

export const SavingsInputSchema = z.object({
    goal: z.number().positive().describe("Target savings goal amount in SAR"),
    current: z.number().nonnegative().default(0).describe("Current saved amount in SAR"),
    monthly: z.number().positive().describe("Monthly contribution amount in SAR")
});

export type SavingsInput = z.infer<typeof SavingsInputSchema>;

export const DiscountInputSchema = z.object({
    price: z.number().positive().describe("Original price in SAR"),
    off: z.number().min(0).max(100).describe("Discount percentage (0-100)")
});

export type DiscountInput = z.infer<typeof DiscountInputSchema>;

export const BillSplitInputSchema = z.object({
    total: z.number().positive().describe("Total bill amount in SAR"),
    people: z.number().int().positive().default(1).describe("Number of people to split the bill"),
    tip: z.number().min(0).default(0).describe("Tip percentage (e.g., 15 for 15%)")
});

export type BillSplitInput = z.infer<typeof BillSplitInputSchema>;

// --- Batch 2 Schemas ---

export const CurrencyInputSchema = z.object({
    amount: z.number().positive().describe("Amount to convert"),
    from: z.string().describe("Source currency code (e.g., USD, SAR, EUR)"),
    to: z.string().describe("Target currency code")
});

export type CurrencyInput = z.infer<typeof CurrencyInputSchema>;

export const CryptoInputSchema = z.object({
    amount: z.number().positive().describe("Amount of cryptocurrency"),
    coin: z.string().describe("Cryptocurrency symbol (e.g., BTC, ETH)"),
    currency: z.string().describe("Target fiat currency (e.g., USD, SAR)")
});

export type CryptoInput = z.infer<typeof CryptoInputSchema>;

export const InvoiceInputSchema = z.object({
    items: z.array(z.object({
        desc: z.string().describe("Item description"),
        price: z.number().positive().describe("Item price")
    })).min(1).describe("List of invoice items")
});

export type InvoiceInput = z.infer<typeof InvoiceInputSchema>;
