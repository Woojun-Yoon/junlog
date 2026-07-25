"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider/Theme";
import { useCallback, useEffect, useRef, useState } from "react";
import { GISCUS_CONTAINER_ID, GISCUS_LOAD_EVENT } from "./constants";

const GISCUS_IS_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_GISCUS_REPO &&
  process.env.NEXT_PUBLIC_GISCUS_REPO_ID &&
  process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
);

type LoadStatus = "error" | "idle" | "loaded" | "loading";

export default function Giscus() {
  const sectionRef = useRef<HTMLElement>(null);
  const giscusRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const { theme } = useTheme();

  const resolvedTheme = theme === "dark" ? "dark" : "light";

  const requestLoad = useCallback(() => {
    if (!GISCUS_IS_CONFIGURED) return;

    setStatus((currentStatus) =>
      currentStatus === "idle" || currentStatus === "error"
        ? "loading"
        : currentStatus,
    );
    setShouldLoad(true);
  }, []);

  useEffect(() => {
    if (shouldLoad || !GISCUS_IS_CONFIGURED || !sectionRef.current) return;

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          requestLoad();
          observer.disconnect();
        }
      },
      { threshold: 0.01 },
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [requestLoad, shouldLoad]);

  useEffect(() => {
    const handleLoadRequest = () => requestLoad();

    window.addEventListener(GISCUS_LOAD_EVENT, handleLoadRequest);
    return () =>
      window.removeEventListener(GISCUS_LOAD_EVENT, handleLoadRequest);
  }, [requestLoad]);

  useEffect(() => {
    const container = giscusRef.current;

    if (!shouldLoad || !container) return;

    const existingScript = container.querySelector<HTMLScriptElement>(
      "script[data-junlog-giscus]",
    );
    const script = existingScript ?? document.createElement("script");

    const handleLoad = () => setStatus("loaded");
    const handleError = () => {
      script.remove();
      setStatus("error");
    };

    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);

    if (!existingScript) {
      script.src = "https://giscus.app/client.js";
      script.async = true;
      script.crossOrigin = "anonymous";
      script.dataset.junlogGiscus = "true";

      script.setAttribute("data-repo", process.env.NEXT_PUBLIC_GISCUS_REPO!);
      script.setAttribute(
        "data-repo-id",
        process.env.NEXT_PUBLIC_GISCUS_REPO_ID!,
      );
      script.setAttribute("data-category", "Comment");
      script.setAttribute(
        "data-category-id",
        process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID!,
      );
      script.setAttribute("data-mapping", "pathname");
      script.setAttribute("data-strict", "0");
      script.setAttribute("data-reactions-enabled", "1");
      script.setAttribute("data-emit-metadata", "0");
      script.setAttribute("data-input-position", "bottom");
      script.setAttribute("data-theme", resolvedTheme);
      script.setAttribute("data-lang", "ko");

      container.appendChild(script);
    } else {
      script.setAttribute("data-theme", resolvedTheme);
    }

    return () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
  }, [loadAttempt, resolvedTheme, shouldLoad]);

  useEffect(() => {
    const container = giscusRef.current;

    if (!shouldLoad || !container) return;

    const updateTheme = () => {
      const iframe = container.querySelector<HTMLIFrameElement>(
        "iframe.giscus-frame",
      );

      if (!iframe) return false;

      iframe.contentWindow?.postMessage(
        {
          giscus: {
            setConfig: {
              theme: resolvedTheme,
            },
          },
        },
        "https://giscus.app",
      );

      return true;
    };

    if (updateTheme()) return;

    const observer = new MutationObserver(() => {
      if (updateTheme()) {
        observer.disconnect();
      }
    });

    observer.observe(container, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [loadAttempt, resolvedTheme, shouldLoad]);

  const retryLoad = () => {
    giscusRef.current?.querySelector("script[data-junlog-giscus]")?.remove();
    setStatus("loading");
    setLoadAttempt((attempt) => attempt + 1);
  };

  return (
    <section
      aria-busy={status === "loading"}
      aria-label="댓글"
      className="min-h-32 scroll-mt-24"
      id={GISCUS_CONTAINER_ID}
      ref={sectionRef}
    >
      {!GISCUS_IS_CONFIGURED && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          댓글 기능이 설정되지 않았습니다.
        </p>
      )}

      {GISCUS_IS_CONFIGURED && status === "idle" && (
        <div className="flex min-h-32 flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm text-muted-foreground">
            댓글은 필요할 때만 불러옵니다.
          </p>
          <Button onClick={requestLoad} type="button" variant="outline">
            댓글 불러오기
          </Button>
        </div>
      )}

      {status === "loading" && (
        <p
          aria-live="polite"
          className="min-h-32 py-8 text-center text-sm text-muted-foreground"
          role="status"
        >
          댓글을 불러오는 중입니다…
        </p>
      )}

      {status === "error" && (
        <div
          className="flex min-h-32 flex-col items-center justify-center gap-3 text-center"
          role="alert"
        >
          <p className="text-sm text-muted-foreground">
            댓글을 불러오지 못했습니다.
          </p>
          <Button onClick={retryLoad} type="button" variant="outline">
            다시 시도
          </Button>
        </div>
      )}

      <div ref={giscusRef} />
    </section>
  );
}
