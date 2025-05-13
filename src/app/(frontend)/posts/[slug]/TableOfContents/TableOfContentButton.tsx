"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpToLine, MessageSquareText } from "lucide-react";

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
  const scrollToGiscus = () =>
    document.querySelector(".giscus")?.scrollIntoView();

  return (
    <ClientOnly>
      <Button
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
