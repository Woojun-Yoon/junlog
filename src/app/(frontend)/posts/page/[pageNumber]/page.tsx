import type { Metadata } from "next/types";

import configPromise from "@payload-config";
import { getPayload } from "payload";
import React from "react";
import PageClient from "./page.client";
import { notFound } from "next/navigation";
import { PostsPageLayout } from "../../_components/PostsPageLayout";

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

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) });
  }

  return pages;
}

export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise;
  return {
    title: `Junlog Posts Page ${pageNumber || ""}`,
    description: "배우고 익힌 내용을 정리합니다",
    openGraph: {
      title: `Junlog Posts Page ${pageNumber || ""}`,
      description: "배우고 익힌 내용을 정리합니다",
      url: `https://junlog.com/posts/page/${pageNumber}`,
    },
    alternates: {
      canonical: `https://junlog.com/posts/page/${pageNumber}`,
    },
  };
}
