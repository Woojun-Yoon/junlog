"use client";

import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import React from "react";

// improved pagination with auto page number in URL path
export const Pagination: React.FC<{
  className?: string;
  page: number;
  totalPages: number;
  pageHref?: string;
  previousHref?: string;
  nextHref?: string;
}> = (props) => {
  const pathname = usePathname();

  const { className, page, totalPages, previousHref, pageHref, nextHref } =
    props;
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const hasExtraPrevPages = page - 1 > 1;
  const hasExtraNextPages = page + 1 < totalPages;

  const createPageUrl = (pageNumber: number) => {
    // Remove any existing /page/N from the path
    const basePath = pathname.replace(/\/page\/\d+$/, "");

    if (pageNumber === 1) {
      return basePath;
    }

    return `${basePath}/page/${pageNumber}`;
  };

  const resolvedPageHref = pageHref || createPageUrl(page);
  const resolvedPreviousHref = hasPrevPage
    ? previousHref || createPageUrl(page - 1)
    : undefined;
  const resolvedNextHref = hasNextPage
    ? nextHref || createPageUrl(page + 1)
    : undefined;

  return (
    <div className={cn("py-2", className)}>
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={!hasPrevPage}
              href={resolvedPreviousHref}
            />
          </PaginationItem>

          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {hasPrevPage && (
            <PaginationItem>
              <PaginationLink href={resolvedPreviousHref}>
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink isActive href={resolvedPageHref}>
              {page}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <PaginationLink href={resolvedNextHref}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              disabled={!hasNextPage}
              href={resolvedNextHref}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  );
};
