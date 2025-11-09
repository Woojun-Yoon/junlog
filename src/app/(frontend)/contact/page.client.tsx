"use client";

import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/toaster";
import { useHeaderTheme } from "@/components/ThemeProvider/HeaderTheme";
import { Turnstile } from "@marsidev/react-turnstile";

export default function ContactPage() {
  const ref = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileRef, setTurnstileRef] = useState<any>(null);
  const { setHeaderTheme } = useHeaderTheme();

  useEffect(() => {
    setHeaderTheme("light");
  }, [setHeaderTheme]);

  const handleSubmit = async (formData: FormData) => {
    if (!turnstileToken) {
      toast.error("CAPTCHA를 완료해주세요.");
      return;
    }

    const toastId = toast.loading("이메일 전송 중입니다...");
    setIsSending(true);

    try {
      formData.append("turnstileToken", turnstileToken);

      const res = await fetch("/next/email", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result?.error || "이메일 전송 실패");
      }

      toast.success("이메일이 성공적으로 전송되었습니다!", {
        id: toastId,
        duration: 5000,
      });

      ref.current?.reset();
      setTurnstileToken("");
      turnstileRef?.reset();
    } catch (err: any) {
      toast.error(`이메일 전송 실패: ${err.message}`, {
        id: toastId,
        duration: 5000,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="pt-20 pb-20">
      <Toaster position="bottom-right" richColors />{" "}
      <div className="container">
        <div className="max-w-xl mx-auto">
          <div className="mb-6">
            <div className="prose dark:prose-invert max-w-none">
              <h1>Contact Me</h1>
            </div>
          </div>

          <p className="mb-8 text-muted-foreground">
            {`문의사항이나 피드백이 있으시면 언제든지 연락주세요.`}
          </p>

          <form
            ref={ref}
            className="space-y-6"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(ref.current!);
              await handleSubmit(formData);
            }}
          >
            <div className="space-y-4">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="name"
                className="w-full px-4 py-2 border rounded-md bg-background border-primary/20"
              />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="email"
                className="w-full px-4 py-2 border rounded-md bg-background border-primary/20"
              />
              <input
                id="subject"
                name="subject"
                type="text"
                autoComplete="off"
                required
                placeholder="subject"
                className="w-full px-4 py-2 border rounded-md bg-background border-primary/20"
              />
              <textarea
                id="message"
                name="message"
                autoComplete="off"
                rows={5}
                required
                placeholder="message"
                className="w-full px-4 py-2 border rounded-md bg-background border-primary/20"
              />
            </div>

            <div className="flex justify-start">
              <Turnstile
                ref={setTurnstileRef}
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onSuccess={(token) => setTurnstileToken(token)}
                onError={() => {
                  setTurnstileToken("");
                }}
                options={{
                  action: "submit-form",
                  theme: "auto",
                  size: "normal",
                }}
                onExpire={() => {
                  setTurnstileToken("");
                }}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isSending}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {isSending ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
