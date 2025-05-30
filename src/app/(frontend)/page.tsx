import type { Metadata } from "next/types";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import PageClient from "./page.client";
import Link from "next/link";
import Image from "next/image";
import { Media } from "@/components/Media";
import { formatDateTime } from "@/lib/utils/formatDateTime";

const POSTS_SIZE = 5;

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise });

  const { docs: posts } = await payload.find({
    collection: "posts",
    depth: 1,
    limit: POSTS_SIZE,
    overrideAccess: false,
    select: {
      title: true,
      summary: true,
      createdAt: true,
      slug: true,
      meta: true,
    },
  });

  return (
    <>
      <PageClient />

      {/* Latest Section */}
      <section className="w-full max-w-4xl px-4 sm:px-8 md:px-12 mx-auto py-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          Latest
        </h2>

        <div className="divide-y divide-border">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="block group transition-all duration-300 hover:bg-muted/80 hover:shadow-sm rounded-md px-2 sm:px-4 -mx-2 sm:-mx-4"
            >
              <div className="py-6 flex items-center space-x-4 text-left">
                {/* 텍스트 섹션 */}
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground">
                    <time dateTime={post.createdAt}>
                      {formatDateTime(post.createdAt)}
                    </time>
                  </p>

                  {post.summary && (
                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground line-clamp-3">
                      {post.summary}
                    </p>
                  )}
                </div>

                {/* 이미지 섹션 */}
                <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden rounded-md hidden md:block">
                  {post.meta?.image ? (
                    <Media resource={post.meta.image} />
                  ) : (
                    <Image
                      src="/junlog-og.webp"
                      alt="Default Image"
                      fill
                      priority
                      sizes="50%"
                      className="object-cover rounded-md"
                    />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: `Junlog Home`,
  };
}
