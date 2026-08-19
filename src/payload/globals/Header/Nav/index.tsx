"use client";

import { Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import type { Header as HeaderType } from "@/payload-types";
import { CMSLink } from "@/payload/fields/Link/index";
import { cn } from "@/lib/utils";

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || [];
  const pathname = usePathname();

  return (
    <nav aria-label="주요 메뉴" className="flex gap-3 items-center">
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="link" prefetch={false} />;
      })}
      <Link
        href="/search"
        prefetch={false}
        aria-current={pathname === "/search" ? "page" : undefined}
        aria-label="게시글 검색"
        className={cn(
          "inline-flex size-9 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          pathname === "/search" && "bg-muted",
        )}
      >
        <SearchIcon aria-hidden="true" className="size-4" />
        <span className="sr-only">검색</span>
      </Link>
    </nav>
  );
};
