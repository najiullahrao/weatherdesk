import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const buf = await req.arrayBuffer();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(Buffer.from(buf), sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    // Save Stripe customerId and set subscriptionStatus to active
    await prisma.user.update({
      where: { email: session.customer_email! },
      data: {
        subscriptionStatus: "active",
        stripeCustomerId: session.customer as string,
      },
    });
  }
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;
    await prisma.user.updateMany({
      where: { stripeCustomerId: customerId },
      data: { subscriptionStatus: "canceled" },
    });
  }
  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;
    const status = subscription.status === "active" ? "active" : "past_due";
    await prisma.user.updateMany({
      where: { stripeCustomerId: customerId },
      data: { subscriptionStatus: status },
    });
  }

  return NextResponse.json({ received: true });
} 