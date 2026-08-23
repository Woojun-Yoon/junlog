"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpToLine, Link2, MessageSquareText } from "lucide-react";
import { toast } from "sonner";
import { GISCUS_CONTAINER_ID, GISCUS_LOAD_EVENT } from "../Comment/constants";

interface ButtonProps {
  size?: number;
  className?: string;
}

const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <>{children}</> : null;
};

export const ScrollTop = ({ size = 16, className }: ButtonProps) => {
  const scrollTop = () => {
    window.scrollTo({ top: 0 });
  };

  return (
    <ClientOnly>
      <Button
        aria-label="페이지 맨 위로 이동"
        variant="outline"
        size="icon"
        onClick={scrollTop}
        className={className}
      >
        <ArrowUpToLine size={size} />
      </Button>
    </ClientOnly>
  );
};

export const ScrollToComment = ({ size = 16, className }: ButtonProps) => {
  const scrollToGiscus = () => {
    const commentSection = document.getElementById(GISCUS_CONTAINER_ID);

    if (!commentSection) return;

    window.dispatchEvent(new Event(GISCUS_LOAD_EVENT));
    commentSection.scrollIntoView({ block: "start" });
  };

  return (
    <ClientOnly>
      <Button
        aria-label="댓글로 이동"
        variant="outline"
        size="icon"
        onClick={scrollToGiscus}
        className={className}
      >
        <MessageSquareText size={size} />
      </Button>
    </ClientOnly>
  );
};

export const CopyPostLink = ({ size = 16, className }: ButtonProps) => {
  const copyPostLink = async () => {
    try {
      const url = new URL(window.location.href);
      url.search = "";
      url.hash = "";

      await navigator.clipboard.writeText(url.toString());
      toast.success("링크가 클립보드에 복사되었습니다.");
    } catch {
      toast.error("링크를 복사하지 못했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <ClientOnly>
      <Button
        aria-label="현재 글 링크 복사"
        variant="outline"
        size="icon"
        onClick={copyPostLink}
        className={className}
      >
        <Link2 size={size} />
      </Button>
    </ClientOnly>
  );
};
