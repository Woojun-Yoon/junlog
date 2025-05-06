import { getCachedGlobal } from "@/lib/utils/getGlobals";
import Link from "next/link";
import React from "react";

import type { Footer } from "@/payload-types";

import { CMSLink } from "@/payload/fields/Link/index";
import { Logo } from "@/components/Logo/Logo";
import { Lock } from "lucide-react";

export async function Footer() {
  const footerData = (await getCachedGlobal("footer", 1)()) as Footer;

  const navItems = footerData?.navItems || [];

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 gap-8 flex flex-row justify-between">
        <Link className="flex items-center" href="/">
          <Logo />
        </Link>

        <div className="flex flex-row flex-wrap items-center gap-4">
          <CMSLink url={"/admin"} newTab>
            <Lock className="h-4 w-4" />
          </CMSLink>

          <nav className="flex flex-wrap gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />;
            })}
          </nav>
        </div>
      </div>
    </footer>
  );
}
