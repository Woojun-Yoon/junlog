import type { Metadata } from "next/types";

import { CollectionArchive } from "@/components/CollectionArchive/CollectionArchive";
import { PageRange } from "@/components/PageRange";
import { Pagination } from "@/components/Pagination";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import PageClient from "./page.client";

export const dynamic = "force-static";
export const revalidate = 600;

export const POSTS_SIZE = 12;

// The reason we don't use searchParams for pagination is because otherwise posts list wouldn't be statically generated
// In case you want to use search params, it's as simple as using a searchParams prop and passing it to payload.find (and remove 'force-static' and the page/[pageNumber] folder)
export default async function PostPage() {
  const payload = await getPayload({ config: configPromise });

  const posts = await payload.find({
    collection: "posts",
    depth: 1,
    limit: POSTS_SIZE,
    overrideAccess: false,
  });

  return (
    <div className="pt-12 pb-24">
      <PageClient />
      <div className="container mb-12">
        <div className="prose dark:prose-invert text-center max-w-none">
          <h1 className="font-semibold text-3xl md:text-3xl lg:text-5xl">
            Posts
          </h1>
          <p className="text-center text-lg font-normal text-neutral-600 dark:text-neutral-400">
            배우고 익힌 내용을 정리합니다
          </p>
        </div>
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container mt-8">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: `Junlog Posts`,
  };
}
