import {NextRequest,NextResponse} from "next/server";

export const runtime = "nodejs";

type PaymentPurpose = "invoice_watermark" | "cv_watermark";

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: "Payments are not configured yet." }, { status: 503 });
    }

    const body = await request.json() as { email?: string; purpose?: string };
    const email = (body.email || "").trim().toLowerCase();
    const requestedPurpose = body.purpose;

    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      return NextResponse.json({ error: "A valid email and document type are required." }, { status: 400 });
    }
    if (requestedPurpose !== "invoice_watermark" && requestedPurpose !== "cv_watermark") {
      return NextResponse.json({ error: "A valid email and document type are required." }, { status: 400 });
    }

    const purpose: PaymentPurpose = requestedPurpose;
    const site = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + secret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: 50000,
        currency: "NGN",
        callback_url: site + "/payment/verify?purpose=" + encodeURIComponent(purpose),
        metadata: {
          purpose,
          product: "UseKit watermark removal",
          custom_fields: [{
            display_name: "Document",
            variable_name: "document_type",
            value: purpose === "invoice_watermark" ? "Invoice/quotation" : "CV",
          }],
        },
      }),
      cache: "no-store",
    });

    const data = await response.json();
    if (!response.ok || !data.status || !data.data?.authorization_url || !data.data?.reference) {
      return NextResponse.json({ error: data.message || "Could not start payment." }, { status: 502 });
    }

    return NextResponse.json({
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch {
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 500 });
  }
}
