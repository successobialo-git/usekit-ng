import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type PaymentPurpose = "invoice_watermark" | "cv_watermark";

function signGrant(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: "Payments are not configured yet." }, { status: 503 });
    }

    const body = await request.json() as { reference?: string; purpose?: string };
    const reference = (body.reference || "").trim();
    const requestedPurpose = body.purpose;
    if (!/^[A-Za-z0-9_-]{8,100}$/.test(reference)) {
      return NextResponse.json({ error: "Invalid payment reference." }, { status: 400 });
    }
    if (requestedPurpose !== "invoice_watermark" && requestedPurpose !== "cv_watermark") {
      return NextResponse.json({ error: "Invalid payment purpose." }, { status: 400 });
    }
    const purpose: PaymentPurpose = requestedPurpose;

    const response = await fetch("https://api.paystack.co/transaction/verify/" + encodeURIComponent(reference), {
      headers: { Authorization: "Bearer " + secret },
      cache: "no-store",
    });
    const result = await response.json();
    const tx = result.data as {
      status?: string;
      amount?: number;
      currency?: string;
      reference?: string;
      metadata?: { purpose?: string };
    } | undefined;

    const valid = response.ok && result.status === true &&
      tx?.status === "success" && tx.amount === 50000 &&
      tx.currency === "NGN" && tx.reference === reference &&
      tx.metadata?.purpose === purpose;

    if (!valid) {
      return NextResponse.json({ verified: false, error: "Payment could not be verified for this document." }, { status: 402 });
    }

    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
    const payload = Buffer.from(JSON.stringify({ purpose, reference, expiresAt })).toString("base64url");
    const signature = signGrant(payload, secret);
    const grant = payload + "." + signature;
    const responseBody = NextResponse.json({ verified: true, purpose, reference });
    responseBody.cookies.set("usekit_paid_" + purpose, grant, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });
    return responseBody;
  } catch {
    return NextResponse.json({ error: "Payment verification failed. Please try again." }, { status: 500 });
  }
}
