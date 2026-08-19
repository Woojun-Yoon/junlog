"use client";

import Link from "next/link";
import React, { useEffect } from "react";

import type { Footer } from "@/payload-types";

import { CMSLink } from "@/payload/fields/Link/index";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo/Logo";
import { Lock, Rss } from "lucide-react";
import { useHeaderTheme } from "@/components/ThemeProvider/HeaderTheme";

interface FooterClientProps {
  data: Footer;
}

export const FooterClient: React.FC<FooterClientProps> = ({ data }) => {
  const navItems = data?.navItems || [];

  const { setHeaderTheme } = useHeaderTheme();

  useEffect(() => {
    setHeaderTheme("light");
  }, [setHeaderTheme]);

  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="container py-8">
        <div className="flex flex-col items-center gap-5 sm:grid sm:grid-cols-[auto_1fr_auto] sm:gap-4">
          <Link aria-label="Junlog 홈" className="flex items-center" href="/">
            <Logo className="invert dark:invert-0" />
          </Link>

          <p className="order-3 text-center text-sm text-foreground/60 sm:order-none">
            © 2026 Junlog. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-end">
            {navItems.length > 0 && (
              <nav
                aria-label="푸터 메뉴"
                className="flex flex-wrap justify-center gap-4"
              >
                {navItems.map(({ link }, i) => {
                  return (
                    <CMSLink className="text-foreground" key={i} {...link} />
                  );
                })}
              </nav>
            )}

            <div className="flex items-center gap-1">
              <Button asChild size="icon" variant="ghost">
                <a
                  aria-label="RSS 피드 구독"
                  href="/feed.xml"
                  title="RSS 피드 구독"
                >
                  <Rss aria-hidden="true" />
                </a>
              </Button>

              <Button asChild size="icon" variant="ghost">
                <Link
                  aria-label="관리자 페이지"
                  href="/admin"
                  prefetch={false}
                  rel="noopener noreferrer"
                  target="_blank"
                  title="관리자 페이지"
                >
                  <Lock aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
