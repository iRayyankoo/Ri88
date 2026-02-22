export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        return new NextResponse("Stripe Webhook Secret not configured", { status: 500 });
    }

    try {
        const stripe = getStripe();
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            webhookSecret
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const stripe = getStripe();
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        if (!session?.metadata?.userId) {
            return new NextResponse("User id is required", { status: 400 });
        }

        await prisma.user.update({
            where: {
                id: session.metadata.userId,
            },
            data: {
                stripeCustomerId: session.customer as string,
                isPro: true,
            },
        });
    }

    if (event.type === "customer.subscription.deleted") {
        // Handle subscription cancellation
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.user.update({
            where: {
                stripeCustomerId: subscription.customer as string,
            },
            data: {
                isPro: false
            }
        });
    }

    return new NextResponse(null, { status: 200 });
}
