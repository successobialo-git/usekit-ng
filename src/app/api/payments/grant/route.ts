import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type PaymentPurpose = "invoice_watermark" | "cv_watermark";

export async function GET(request: NextRequest) {
  const purpose = request.nextUrl.searchParams.get("purpose");
  if (purpose !== "invoice_watermark" && purpose !== "cv_watermark") {
    return NextResponse.json({ verified: false }, { status: 400 });
  }

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ verified: false }, { status: 503 });

  const token = request.cookies.get("usekit_paid_" + (purpose as PaymentPurpose))?.value || "";
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return NextResponse.json({ verified: false });

  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  const suppliedBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  if (suppliedBuffer.length !== expectedBuffer.length || !timingSafeEqual(suppliedBuffer, expectedBuffer)) {
    return NextResponse.json({ verified: false });
  }

  try {
    const grant = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      purpose?: string;
      expiresAt?: number;
    };
    const verified = grant.purpose === purpose && typeof grant.expiresAt === "number" && grant.expiresAt > Date.now();
    return NextResponse.json({ verified, purpose: verified ? purpose : undefined });
  } catch {
    return NextResponse.json({ verified: false });
  }
}
