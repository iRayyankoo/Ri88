
import Stripe from "stripe";

const apiKey = process.env.STRIPE_API_KEY;

if (!apiKey) {
    console.warn("STRIPE_API_KEY is not defined");
}

let stripeInstance: Stripe | null = null;

export const getStripe = () => {
    if (!stripeInstance) {
        stripeInstance = new Stripe(process.env.STRIPE_API_KEY || "", {
            apiVersion: "2026-01-28.clover",
            typescript: true,
        });
    }
    return stripeInstance;
};

// For backward compatibility: avoid top-level execution during build
// export const stripe = getStripe(); 
