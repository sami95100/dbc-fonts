import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "session_id required" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      order_number: session.metadata?.order_number || null,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email || null,
    });
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }
}
