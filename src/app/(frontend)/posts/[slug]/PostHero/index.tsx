import { formatDateTime } from "@/lib/utils/formatDateTime";
import React from "react";

import type { Post } from "@/payload-types";

import { Media } from "@/components/Media";
import { formatAuthors } from "@/lib/utils/formatAuthors";
import ViewCounter from "../ViewCounter";

export const PostHero: React.FC<{
  post: Post;
  slug: string;
}> = ({ post, slug }) => {
  const { heroImage, populatedAuthors, publishedAt, title, views } = post;

  const hasAuthors =
    populatedAuthors &&
    populatedAuthors.length > 0 &&
    formatAuthors(populatedAuthors) !== "";

  return (
    <div className="relative flex flex-col items-center text-center pb-1 px-4 md:px-6">
      {heroImage && typeof heroImage === "object" && (
        <div className="relative mb-8 aspect-[40/21] w-full max-w-[48rem] overflow-hidden rounded-lg md:hidden">
          <Media
            fill
            htmlElement={null}
            imgClassName="object-cover"
            priority
            resource={heroImage}
            sizes="(max-width: 767px) calc(100vw - 2rem), 1px"
          />
        </div>
      )}

      {/* Title */}
      <div className="max-w-[48rem] w-full">
        <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold leading-tight mb-8 break-keep">
          {title}
        </h1>
      </div>

      {/* Author and Date */}
      <div className="flex flex-row flex-wrap items-center justify-center gap-2 md:gap-4 text-gray-600 text-sm">
        {hasAuthors && (
          <div className="flex items-center gap-1 md:gap-2">
            <span>By</span>
            <span className="font-medium">
              {formatAuthors(populatedAuthors)}
            </span>
          </div>
        )}
        {hasAuthors && publishedAt && <span className="text-gray-400">·</span>}
        {publishedAt && (
          <div className="flex items-center">
            <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
          </div>
        )}
        {publishedAt && <span className="text-gray-400">·</span>}
        <ViewCounter key={slug} initialViews={views ?? 0} slug={slug} />
      </div>
    </div>
  );
};
