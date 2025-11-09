import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";

async function verifyTurnstile(token: string): Promise<boolean> {
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY!,
        response: token,
      }),
    }
  );

  const data = await response.json();
  return data.success;
}

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config: configPromise });
  const body = await req.formData();

  const to = process.env.ADMIN_EMAIL!;
  const name = body.get("name")?.toString() || "익명";
  const email = body.get("email")?.toString() || "noreply@example.com";
  const subjectRaw = body.get("subject")?.toString() || "제목 없음";
  const message = body.get("message")?.toString() || "";
  const turnstileToken = body.get("turnstileToken") as string;

  if (!turnstileToken) {
    return NextResponse.json(
      { error: "CAPTCHA 토큰이 필요합니다." },
      { status: 400 }
    );
  }

  const isValidCaptcha = await verifyTurnstile(turnstileToken);
  if (!isValidCaptcha) {
    return NextResponse.json(
      { error: "CAPTCHA 검증에 실패했습니다." },
      { status: 400 }
    );
  }

  const from = `junlog contact <${email}>`;
  const subject = `${name}님이 문의를 보냈습니다: ${subjectRaw}`;

  try {
    await payload.sendEmail({
      to,
      from,
      subject,
      text: message,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
