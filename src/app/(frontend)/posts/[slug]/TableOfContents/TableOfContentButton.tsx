"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpToLine, MessageSquareText } from "lucide-react";
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
