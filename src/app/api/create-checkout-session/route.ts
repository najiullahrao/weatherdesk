// app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Force dynamic rendering - prevents build-time execution
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: session.user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?canceled=1`,
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// If you have other methods, add the same pattern
export async function GET(request: NextRequest) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}