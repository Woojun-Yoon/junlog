"use client";
import { cn } from "@/lib/utils";
import useClickableCard from "@/lib/utils/useClickableCard";
import Link from "next/link";
import React from "react";

import type { Post } from "@/payload-types";

import { Media } from "@/components/Media";
import Image from "next/image";
import { formatDateTime } from "@/lib/utils/formatDateTime";

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
        "cursor-pointer rounded-xl overflow-hidden shadow-sm dark:shadow-slate-300/20 hover:shadow-xl hover:shadow-black/15 dark:hover:shadow-white/15 transition-shadow duration-300 flex flex-col h-[400px]",
        className
      )}
      ref={card.ref}
    >
      {/* 이미지 섹션 */}
      <div className="w-full aspect-[2/1] overflow-hidden">
        {metaImage && typeof metaImage !== "string" ? (
          <Media
            resource={metaImage}
            imgClassName="object-cover object-center w-full h-full"
          />
        ) : (
          <Image
            src="/junlog-og.webp"
            alt="Default Image"
            width={192}
            height={128}
            priority
            className="object-cover object-center w-full h-full"
          />
        )}
      </div>

      {/* 콘텐츠 섹션 */}
      <div className="flex flex-col justify-between mx-6 my-4 flex-1 overflow-hidden">
        {showCategories && hasCategories && (
          <div className="mb-2 flex flex-wrap gap-2 text-xs">
            {categories?.map((category, index) => {
              if (typeof category === "object") {
                const categoryTitle = category.title || "Untitled";
                return (
                  <span
                    key={index}
                    className="font-medium text-neutral-800 bg-neutral-200 px-2 py-1 rounded-lg dark:text-neutral-200 dark:bg-neutral-700"
                  >
                    {categoryTitle}
                  </span>
                );
              }
              return null;
            })}
          </div>
        )}

        {titleToUse && (
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 break-words line-clamp-2 mb-2">
            <Link href={href} ref={link.ref} className="hover:underline">
              {titleToUse}
            </Link>
          </h3>
        )}

        {description && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 break-words line-clamp-2 mb-2">
            {sanitizedDescription}
          </p>
        )}

        {createdAt && (
          <p className="text-xs text-neutral-400 dark:text-neutral-400">
            <time dateTime={createdAt}>{formatDateTime(createdAt)}</time>
          </p>
        )}
      </div>
    </article>
  );
};
