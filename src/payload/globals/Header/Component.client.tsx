"use client";
import { useHeaderTheme } from "@/components/ThemeProvider/HeaderTheme";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import type { Header } from "@/payload-types";

import { Logo } from "@/components/Logo/Logo";
import { HeaderNav } from "./Nav";
import { ThemeSelector } from "@/components/ThemeProvider/Theme/ThemeSelector";

interface HeaderClientProps {
  data: Header;
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null);
  const { headerTheme, setHeaderTheme } = useHeaderTheme();
  const pathname = usePathname();

  useEffect(() => {
    setHeaderTheme(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme]);

  return (
    <header
      className="container relative z-20"
      {...(theme ? { "data-theme": theme } : {})}
    >
      <div className="py-6 flex flex-col gap-y-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <Link href="/">
            <Logo
              loading="eager"
              priority="high"
              className="invert dark:invert-0"
            />
          </Link>
          <div className="ml-4 sm:ml-6">
            <ThemeSelector />
          </div>
        </div>

        <HeaderNav data={data} />
      </div>
    </header>
  );
};
