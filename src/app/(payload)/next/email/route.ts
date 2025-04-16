import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config: configPromise });
  const body = await req.formData();

  const to = process.env.ADMIN_EMAIL!;
  const name = body.get("name")?.toString() || "익명";
  const email = body.get("email")?.toString() || "noreply@example.com";
  const subjectRaw = body.get("subject")?.toString() || "제목 없음";
  const message = body.get("message")?.toString() || "";

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
    console.error("Email send failed:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
