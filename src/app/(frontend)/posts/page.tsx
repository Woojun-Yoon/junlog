import type { Metadata } from "next/types";

import configPromise from "@payload-config";
import { getPayload } from "payload";
import PageClient from "./page.client";
import { PostsPageLayout } from "./_components/PostsPageLayout";

export const dynamic = "force-static";
export const revalidate = 600;
const POSTS_SIZE = 12;

// The reason we don't use searchParams for pagination is because otherwise posts list wouldn't be statically generated
// In case you want to use search params, it's as simple as using a searchParams prop and passing it to payload.find (and remove 'force-static' and the page/[pageNumber] folder)
export default async function PostPage() {
  const payload = await getPayload({ config: configPromise });

  // Get all categories for the filter
  const categoriesResult = await payload.find({
    collection: "categories",
    limit: 100,
    overrideAccess: false,
    sort: "title",
  });

  const posts = await payload.find({
    collection: "posts",
    depth: 1,
    limit: POSTS_SIZE,
    overrideAccess: false,
    sort: "-publishedAt",
  });

  return (
    <>
      <PageClient />
      <PostsPageLayout
        categories={categoriesResult.docs}
        posts={posts.docs}
        activeCategory={null}
        totalDocs={posts.totalDocs}
        page={posts.page || 1}
        totalPages={posts.totalPages}
      />
    </>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: `Junlog Posts`,
    description: "배우고 익힌 내용을 정리합니다",
    openGraph: {
      title: `Junlog Posts`,
      description: "배우고 익힌 내용을 정리합니다",
      url: "https://junlog.com/posts",
    },
    alternates: {
      canonical: "https://junlog.com/posts",
    },
  };
}
