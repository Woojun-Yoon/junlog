"use client";

import Link from "next/link";
import React, { useEffect } from "react";

import type { Footer } from "@/payload-types";

import { CMSLink } from "@/payload/fields/Link/index";
import { Logo } from "@/components/Logo/Logo";
import { Lock } from "lucide-react";
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
        <div className="grid grid-cols-3 items-center gap-4">
          <Link className="flex items-center" href="/">
            <Logo className="invert dark:invert-0" />
          </Link>

          <p className="text-sm text-black/60 dark:text-white/60 text-center">
            © 2025 Junlog. All rights reserved.
          </p>

          <div className="flex flex-row justify-end items-center gap-4">
            <CMSLink url={"/admin"} newTab>
              <Lock className="h-4 w-4" />
            </CMSLink>

            <nav className="flex gap-4">
              {navItems.map(({ link }, i) => {
                return (
                  <CMSLink
                    className="text-black dark:text-white"
                    key={i}
                    {...link}
                  />
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};
