"use client";

import { Category } from "@/payload-types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useRef, useLayoutEffect } from "react";
import { motion, LayoutGroup } from "framer-motion";

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <LayoutGroup>
          <motion.div
            ref={scrollContainerRef}
            className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0 md:flex-wrap md:justify-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {allCategories.map((category) => {
              const isActive =
                category.slug === "all"
                  ? isAllActive
                  : activeCategory === category.slug;

              return (
                <motion.div key={category.id} variants={itemVariants}>
                  <Link
                    href={category.href}
                    onClick={handleClick}
                    ref={isActive ? activeItemRef : null}
                    className={cn(
                      "relative inline-flex items-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                      "border border-transparent",
                      isActive
                        ? "text-white dark:text-neutral-900"
                        : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeCategory"
                        className="absolute inset-0 bg-neutral-900 dark:bg-white rounded-full -z-0"
                        style={{ originX: 0.5, originY: 0.5 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{category.title}</span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </LayoutGroup>

        {/* Fade effect for mobile scroll indication */}
        <div className="absolute right-0 top-0 bottom-2 md:bottom-0 w-8 bg-gradient-to-l from-white dark:from-neutral-950 pointer-events-none md:hidden" />
      </div>
    </div>
  );
};

export default CategoryFilter;
