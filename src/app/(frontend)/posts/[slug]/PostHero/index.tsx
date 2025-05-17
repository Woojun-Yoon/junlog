import { formatDateTime } from "@/lib/utils/formatDateTime";
import React from "react";

import type { Post } from "@/payload-types";

import { formatAuthors } from "@/lib/utils/formatAuthors";
import { Eye } from "lucide-react";

export const PostHero: React.FC<{
  post: Post;
}> = ({ post }) => {
  const { populatedAuthors, publishedAt, title, views } = post;

  const hasAuthors =
    populatedAuthors &&
    populatedAuthors.length > 0 &&
    formatAuthors(populatedAuthors) !== "";

  return (
    <div className="relative flex flex-col items-center text-center pb-1 px-4 md:px-6">
      {/* Title */}
      <div className="max-w-[48rem] w-full">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-8 break-words">
          {title}
        </h1>
      </div>

      {/* Author and Date */}
      <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4 text-gray-600 text-sm">
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
        {/* Views */}
        <div className="flex items-center gap-1">
          <Eye size={16} className="text-gray-400" />
          <span>{views ?? 0}</span>
        </div>
      </div>
    </div>
  );
};
