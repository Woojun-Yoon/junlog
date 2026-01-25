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
  const { headerTheme, setHeaderTheme } = useHeaderTheme();
  const pathname = usePathname();

  const [theme, setTheme] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setHeaderTheme(null);
  }, [pathname, setHeaderTheme]);

  useEffect(() => {
    if (headerTheme) {
      setTheme(headerTheme);
    }
  }, [headerTheme]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY < 100) {
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY) {
            setIsVisible(false);
          } else if (currentScrollY < lastScrollY) {
            setIsVisible(true);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      {...(theme ? { "data-theme": theme } : {})}
    >
      <div className="container">
        <div className="py-4 flex flex-col gap-y-4 sm:flex-row sm:justify-between sm:items-center">
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
      </div>
    </header>
  );
};
