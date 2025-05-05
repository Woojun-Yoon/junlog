"use client";
import { cn } from "@/lib/utils";
import useClickableCard from "@/lib/utils/useClickableCard";
import Link from "next/link";
import React from "react";

import type { Post } from "@/payload-types";

import { Media } from "@/components/Media";

export type CardPostData = Pick<Post, "slug" | "categories" | "meta" | "title">;

export const Card: React.FC<{
  alignItems?: "center";
  className?: string;
  doc?: CardPostData & { createdAt?: string };
  relationTo?: "posts";
  showCategories?: boolean;
  title?: string;
}> = (props) => {
  const { card, link } = useClickableCard({});
  const {
    className,
    doc,
    relationTo,
    showCategories,
    title: titleFromProps,
  } = props;

  const { slug, categories, meta, title, createdAt } = doc || {};
  const { description, image: metaImage } = meta || {};

  const hasCategories =
    categories && Array.isArray(categories) && categories.length > 0;
  const titleToUse = titleFromProps || title;
  const sanitizedDescription = description?.replace(/\s/g, " "); // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`;

  return (
    <article
      className={cn(
        "rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300",
        className
      )}
      ref={card.ref}
    >
      {/* 이미지 섹션 */}
      <div className="relative w-full h-48">
        {metaImage && typeof metaImage !== "string" ? (
          <Media resource={metaImage} size="33vw" />
        ) : (
          <img
            src="/junlog-og.webp"
            alt="Default Image"
            className="object-cover w-full h-full"
          />
        )}
      </div>
      {/* 콘텐츠 섹션 */}
      <div className="p-6">
        {/* 카테고리 */}
        {showCategories && hasCategories && (
          <div className="mb-4 flex flex-wrap gap-2">
            {categories?.map((category, index) => {
              if (typeof category === "object") {
                const { title: titleFromCategory } = category;
                const categoryTitle = titleFromCategory || "Untitled";

                return (
                  <span
                    key={index}
                    className="text-xs font-medium text-neutral-800 bg-neutral-200 px-3 py-1 rounded-md dark:text-neutral-200 dark:bg-neutral-700"
                  >
                    {categoryTitle}
                  </span>
                );
              }
              return null;
            })}
          </div>
        )}
        {/* 제목 */}
        {titleToUse && (
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            <Link href={href} ref={link.ref} className="hover:underline">
              {titleToUse}
            </Link>
          </h3>
        )}

        {/* 설명 */}
        {description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {sanitizedDescription}
          </p>
        )}

        {/* 생성일 */}
        {createdAt && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </article>
  );
};
