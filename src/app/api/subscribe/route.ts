import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const emailRaw = typeof body?.email === "string" ? body.email.trim() : "";

    if (!emailRaw || !EMAIL_RE.test(emailRaw) || emailRaw.length > 254) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    const email = emailRaw.toLowerCase();
    const sourceRaw = typeof body?.source === "string" ? body.source.trim() : "";
    const source = /^[a-z0-9-]{1,40}$/.test(sourceRaw) ? sourceRaw : "ew2h-sales";
    console.log(`[newsletter] subscribe: ${email}`);

    const webhook = process.env.NEWSLETTER_WEBHOOK_URL;
    if (webhook) {
      try {
        const res = await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            source,
            ts: new Date().toISOString(),
          }),
        });
        if (!res.ok) {
          console.error(`[newsletter] webhook failed: ${res.status}`);
        }
      } catch (err) {
        console.error("[newsletter] webhook error:", err);
      }
    }

    return NextResponse.json({
      ok: true,
      message: "You're on the list",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to subscribe. Try again." },
      { status: 500 }
    );
  }
}
