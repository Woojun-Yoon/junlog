import type { Metadata } from "next/types";

import configPromise from "@payload-config";
import { getPayload } from "payload";
import React from "react";
import PageClient from "./page.client";
import { notFound, redirect } from "next/navigation";
import { PostsPageLayout } from "../../_components/PostsPageLayout";
import { mergeOpenGraph } from "@/lib/utils/mergeOpenGraph";
import { getAbsoluteURL } from "@/lib/utils/getURL";

export const dynamic = "force-static";
export const revalidate = 600;
const POSTS_SIZE = 12;

type Args = {
  params: Promise<{
    pageNumber: string;
  }>;
};

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise;
  const payload = await getPayload({ config: configPromise });

  const sanitizedPageNumber = Number(pageNumber);

  if (!Number.isInteger(sanitizedPageNumber)) notFound();
  if (sanitizedPageNumber === 1) redirect("/posts");
  if (sanitizedPageNumber < 1) notFound();

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
    page: sanitizedPageNumber,
    overrideAccess: false,
    sort: "-publishedAt",
  });

  if (posts.totalPages === 0 || sanitizedPageNumber > posts.totalPages) {
    notFound();
  }

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

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });
  const { totalDocs } = await payload.count({
    collection: "posts",
    overrideAccess: false,
  });

  const totalPages = Math.ceil(totalDocs / POSTS_SIZE);

  const pages: { pageNumber: string }[] = [];

  for (let i = 2; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) });
  }

  return pages;
}

export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise;
  const canonicalURL = getAbsoluteURL(`/posts/page/${pageNumber}`);
  const title = `Posts - Page ${pageNumber} | junlog`;

  return {
    title,
    description: "배우고 익힌 내용을 정리합니다",
    robots: {
      index: false,
      follow: true,
    },
    openGraph: mergeOpenGraph({
      title,
      description: "배우고 익힌 내용을 정리합니다",
      url: canonicalURL,
    }),
    alternates: {
      canonical: canonicalURL,
    },
  };
}
