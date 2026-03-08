import type { Metadata } from "next/types";

import configPromise from "@payload-config";
import { getPayload } from "payload";
import PageClient from "./page.client";
import { PostsPageLayout } from "./_components/PostsPageLayout";
import { JsonLd } from "@/components/Seo/JsonLd";
import { mergeOpenGraph } from "@/lib/utils/mergeOpenGraph";
import { getAbsoluteURL, getCollectionURL } from "@/lib/utils/getURL";
import {
  getBreadcrumbSchema,
  getCollectionPageSchema,
  getItemListSchema,
} from "@/lib/seo/schema";

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

  const canonicalURL = getCollectionURL("posts");
  const schemas = [
    getCollectionPageSchema({
      name: "Posts",
      description: "배우고 익힌 내용을 정리합니다",
      url: canonicalURL,
    }),
    getBreadcrumbSchema([
      {
        name: "Home",
        item: getAbsoluteURL("/"),
      },
      {
        name: "Posts",
        item: canonicalURL,
      },
    ]),
  ];
  const archiveItems = posts.docs
    .filter((post) => Boolean(post.slug) && Boolean(post.title))
    .map((post) => ({
      name: post.title,
      url: getAbsoluteURL(`/posts/${post.slug}`),
    }));

  if (archiveItems.length > 0) {
    schemas.push(
      getItemListSchema({
        name: "Posts Archive",
        items: archiveItems,
      })
    );
  }

  return (
    <>
      <JsonLd schema={schemas} />
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
  const canonicalURL = getCollectionURL("posts");

  return {
    title: `Posts | junlog`,
    description: "배우고 익힌 내용을 정리합니다",
    openGraph: mergeOpenGraph({
      title: `Posts | junlog`,
      description: "배우고 익힌 내용을 정리합니다",
      url: canonicalURL,
    }),
    alternates: {
      canonical: canonicalURL,
    },
  };
}
