"use client";

import { Category } from "@/payload-types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useRef, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";

interface CategoryFilterProps {
  categories: Category[];
  activeCategory?: string | null;
  className?: string;
}

// Storage key for scroll position
const SCROLL_POSITION_KEY = "category-filter-scroll";

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  className,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLAnchorElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const isAllActive = !activeCategory || activeCategory === "all";

  // All categories including "all" option
  const allCategories = [
    { id: "all", slug: "all", title: "all", href: "/posts" },
    ...categories.map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      title: cat.title,
      href: `/posts/category/${cat.slug}`,
    })),
  ];

  // Restore scroll position on mount
  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Try to restore saved scroll position
    const savedPosition = sessionStorage.getItem(SCROLL_POSITION_KEY);
    if (savedPosition) {
      container.scrollLeft = parseInt(savedPosition, 10);
    }

    // Scroll active item into view (centered) after a small delay
    const timer = setTimeout(() => {
      if (activeItemRef.current && container) {
        const containerRect = container.getBoundingClientRect();
        const itemRect = activeItemRef.current.getBoundingClientRect();
        const scrollLeft =
          itemRect.left -
          containerRect.left +
          container.scrollLeft -
          containerRect.width / 2 +
          itemRect.width / 2;

        container.scrollTo({
          left: Math.max(0, scrollLeft),
          behavior: "smooth",
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [activeCategory]);

  // Save scroll position before navigation
  const handleClick = () => {
    if (scrollContainerRef.current) {
      sessionStorage.setItem(
        SCROLL_POSITION_KEY,
        String(scrollContainerRef.current.scrollLeft),
      );
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-2 md:pb-0 md:flex-wrap md:justify-center"
          onMouseLeave={() => setHoveredId(null)}
        >
          {allCategories.map((category) => {
            const isActive =
              category.slug === "all"
                ? isAllActive
                : activeCategory === category.slug;
            const isHovered = hoveredId === category.id;

            return (
              <Link
                key={category.id}
                href={category.href}
                onClick={handleClick}
                onMouseEnter={() => setHoveredId(String(category.id))}
                ref={isActive ? activeItemRef : null}
                className={cn(
                  "relative inline-flex items-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium",
                  "transition-colors duration-150",
                  isActive
                    ? "text-neutral-900 dark:text-neutral-100"
                    : "text-neutral-500 dark:text-neutral-400",
                )}
              >
                {/* Hover background */}
                {isHovered && !isActive && (
                  <motion.span
                    layoutId="hoverBg"
                    className="absolute inset-0 rounded-lg bg-neutral-100 dark:bg-neutral-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}

                {/* Active indicator */}
                {isActive && (
                  <motion.span
                    layoutId="activeIndicator"
                    className="absolute inset-0 rounded-lg bg-neutral-900 dark:bg-white"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}

                <span
                  className={cn(
                    "relative z-10 transition-colors duration-150",
                    isActive && "text-white dark:text-neutral-900",
                  )}
                >
                  {category.title}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Fade effect for mobile scroll indication */}
        <div className="absolute right-0 top-0 bottom-2 md:bottom-0 w-8 bg-gradient-to-l from-white dark:from-neutral-950 pointer-events-none md:hidden" />
      </div>
    </div>
  );
};

export default CategoryFilter;
