"use client";

import Link from "next/link";

import { HeadingItem } from "./types";
import { useHeadingsObserver } from "./useHeadingsObserver";
import { cn } from "@/lib/utils";
import {
  CopyPostLink,
  ScrollToComment,
  ScrollTop,
} from "./TableOfContentButton";

interface Props {
  toc: HeadingItem[];
}

const TableOfContent = ({ toc }: Props) => {
  const activeIdList = useHeadingsObserver("h1, h2, h3, h4");

  return (
    <div className="sticky top-16 w-[200px] z-10">
      <div className="border-l border-foreground/20 pl-4">
        <div className="text-sm font-semibold text-muted-foreground mb-3">
          On this page
        </div>
        <ul className="space-y-1 text-sm leading-relaxed">
          {toc.map((item) => {
            const isH3 = item.indent === 1;
            const isH4 = item.indent === 2;
            const isActive = activeIdList.includes(item.link);

            return (
              <li
                key={item.link}
                className={cn(
                  "transition-colors break-words overflow-x-hidden line-clamp-1",
                  isH3 && "ml-4 text-muted-foreground",
                  isH4 && "ml-8 text-muted-foreground",
                  isActive
                    ? "text-foreground font-medium underline decoration-primary decoration-2 underline-offset-4"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Link href={item.link} className="block">
                  {item.text}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-4 flex gap-1">
        <ScrollTop className="rounded-xl" />
        <ScrollToComment className="rounded-xl" />
        <CopyPostLink className="rounded-xl" />
      </div>
    </div>
  );
};

export default TableOfContent;
