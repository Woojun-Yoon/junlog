import type { Metadata } from "next/types";

import { Pagination } from "@/components/Pagination";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import React from "react";
import PageClient from "./page.client";
import { notFound } from "next/navigation";
import { CollectionArchive } from "@/components/CollectionArchive/CollectionArchive";

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

  const posts = await payload.find({
    collection: "posts",
    depth: 1,
    limit: POSTS_SIZE,
    page: sanitizedPageNumber,
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
        {posts?.page && posts?.totalPages > 1 && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });
  const { totalDocs } = await payload.count({
    collection: "posts",
    overrideAccess: false,
  });

  const totalPages = Math.ceil(totalDocs / 10);

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
  };
}
