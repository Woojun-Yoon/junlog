import Link from "next/link";
import Image from "next/image";

import type { Post } from "@/payload-types";

import { Media } from "@/components/Media";
import { formatDateTime } from "@/lib/utils/formatDateTime";

export type PostListItemData = Pick<Post, "id" | "title"> &
  Partial<
    Pick<Post, "createdAt" | "meta" | "publishedAt" | "slug" | "summary">
  >;

type PostListItemProps = {
  post: PostListItemData;
  priority?: boolean;
  showDate?: boolean;
};

export function PostListItem({
  post,
  priority = false,
  showDate = true,
}: PostListItemProps) {
  const metaImage = post.meta?.image;

  return (
    <Link
      href={`/posts/${post.slug}`}
      prefetch={false}
      className="group -mx-2 block rounded-md px-2 transition-all duration-300 hover:bg-muted/80 hover:shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:-mx-4 sm:px-4"
    >
      <div className="flex items-center space-x-4 py-6 text-left">
        <div className="min-w-0 flex-1 space-y-2">
          <h3 className="break-keep text-xl font-semibold text-foreground sm:text-2xl md:text-3xl">
            {post.title}
          </h3>

          {showDate && post.createdAt && (
            <p className="text-xs text-muted-foreground sm:text-sm">
              <time dateTime={post.publishedAt ?? post.createdAt}>
                {formatDateTime(post.publishedAt || post.createdAt)}
              </time>
            </p>
          )}

          {post.summary && (
            <p className="line-clamp-3 break-keep text-sm text-muted-foreground sm:text-base md:text-lg">
              {post.summary}
            </p>
          )}
        </div>

        <div className="relative hidden aspect-[40/21] w-48 flex-shrink-0 overflow-hidden rounded-md md:block">
          {metaImage && typeof metaImage === "object" ? (
            <Media
              fill
              htmlElement={null}
              imgClassName="rounded-md object-cover"
              priority={priority}
              resource={metaImage}
              sizes="192px"
            />
          ) : (
            <Image
              src="/junlog-og.webp"
              alt={`${post.title} 대표 이미지`}
              fill
              priority={priority}
              sizes="192px"
              className="rounded-md object-cover"
            />
          )}
        </div>
      </div>
    </Link>
  );
}
