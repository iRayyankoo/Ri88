export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // Replace with your real Stripe Price ID
        const priceId = process.env.STRIPE_PRO_PRICE_ID;

        if (!priceId) {
            return new NextResponse("Stripe Price ID not configured", { status: 500 });
        }

        const stripe = getStripe();
        const checkoutSession = await stripe.checkout.sessions.create({
            mode: "subscription",
            customer_email: user.email!,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXTAUTH_URL}/dashboard?status=success`,
            cancel_url: `${process.env.NEXTAUTH_URL}/pricing?status=cancelled`,
            metadata: {
                userId: user.id,
            },
        });

        return NextResponse.redirect(checkoutSession.url!);
    } catch (error) {
        console.error("[STRIPE_CHECKOUT_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
