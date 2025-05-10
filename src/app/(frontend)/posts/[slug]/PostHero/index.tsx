import { formatDateTime } from "@/lib/utils/formatDateTime";
import React from "react";

import type { Post } from "@/payload-types";

import { formatAuthors } from "@/lib/utils/formatAuthors";

export const PostHero: React.FC<{
  post: Post;
}> = ({ post }) => {
  const { populatedAuthors, publishedAt, title } = post;

  const hasAuthors =
    populatedAuthors &&
    populatedAuthors.length > 0 &&
    formatAuthors(populatedAuthors) !== "";

  return (
    <div className="relative flex flex-col items-center text-center pb-4 px-4 md:px-6">
      {/* Title */}
      <h1 className="text-5xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
        {title}
      </h1>

      {/* Author and Date */}
      <div className="flex flex-col md:flex-row items-center gap-4 text-gray-600 text-sm">
        {hasAuthors && (
          <div className="flex items-center gap-2">
            <span>By</span>
            <span className="font-medium">
              {formatAuthors(populatedAuthors)}
            </span>
          </div>
        )}
        {publishedAt && (
          <div className="flex items-center gap-2">
            <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
          </div>
        )}
      </div>
    </div>
  );
};
