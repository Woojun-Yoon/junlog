import type { Metadata } from "next/types";

import configPromise from "@payload-config";
import { getPayload } from "payload";
import { notFound, redirect } from "next/navigation";
import PageClient from "./page.client";
import { Category } from "@/payload-types";
import { PostsPageLayout } from "../../../../_components/PostsPageLayout";
import { mergeOpenGraph } from "@/lib/utils/mergeOpenGraph";
import { getAbsoluteURL } from "@/lib/utils/getURL";

export const dynamic = "force-static";
export const revalidate = 600;
const POSTS_SIZE = 12;

type Args = {
  params: Promise<{
    categorySlug: string;
    pageNumber: string;
  }>;
};

export default async function CategoryPagePaginated({
  params: paramsPromise,
}: Args) {
  const { categorySlug, pageNumber } = await paramsPromise;
  const payload = await getPayload({ config: configPromise });

  const sanitizedPageNumber = Number(pageNumber);

  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 1) {
    notFound();
  }
  if (sanitizedPageNumber === 1) {
    redirect(`/posts/category/${categorySlug}`);
  }

  // Get all categories for the filter
  const categoriesResult = await payload.find({
    collection: "categories",
    limit: 100,
    overrideAccess: false,
    sort: "title",
  });

  // Find the current category
  const currentCategory = categoriesResult.docs.find(
    (cat) => cat.slug === categorySlug,
  );

  if (!currentCategory) {
    notFound();
  }

  // Get posts filtered by category with pagination
  const posts = await payload.find({
    collection: "posts",
    depth: 1,
    limit: POSTS_SIZE,
    page: sanitizedPageNumber,
    overrideAccess: false,
    sort: "-publishedAt",
    where: {
      categories: {
        contains: currentCategory.id,
      },
    },
  });

  // If page number is out of range, show 404
  if (posts.totalPages === 0 || sanitizedPageNumber > posts.totalPages) {
    notFound();
  }

  return (
    <>
      <PageClient />
      <PostsPageLayout
        categories={categoriesResult.docs}
        posts={posts.docs}
        activeCategory={categorySlug}
        currentCategoryTitle={currentCategory.title}
        totalDocs={posts.totalDocs}
        page={posts.page || 1}
        totalPages={posts.totalPages}
      />
    </>
  );
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });

  // Get all categories
  const categories = await payload.find({
    collection: "categories",
    limit: 100,
    overrideAccess: false,
  });

  const params: { categorySlug: string; pageNumber: string }[] = [];

  // For each category, get the total pages
  for (const category of categories.docs) {
    if (!category.slug) continue;

    const { totalDocs } = await payload.count({
      collection: "posts",
      overrideAccess: false,
      where: {
        categories: {
          contains: category.id,
        },
      },
    });

    const totalPages = Math.ceil(totalDocs / POSTS_SIZE);

    // Generate params for pages 2 and above (page 1 is handled by the main category page)
    for (let i = 2; i <= totalPages; i++) {
      params.push({
        categorySlug: category.slug,
        pageNumber: String(i),
      });
    }
  }

  return params;
}

export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  const { categorySlug, pageNumber } = await paramsPromise;
  const payload = await getPayload({ config: configPromise });

  const categoriesResult = await payload.find({
    collection: "categories",
    where: {
      slug: { equals: categorySlug },
    },
    limit: 1,
  });

  const category = categoriesResult.docs[0];
  const title = category?.title || categorySlug;
  const metaTitle = `${title} Posts - Page ${pageNumber} | junlog`;
  const canonicalURL = getAbsoluteURL(
    `/posts/category/${categorySlug}/page/${pageNumber}`
  );

  return {
    title: metaTitle,
    description: `${title} 카테고리의 게시물 목록 - ${pageNumber}페이지`,
    robots: {
      index: false,
      follow: true,
    },
    openGraph: mergeOpenGraph({
      title: metaTitle,
      description: `${title} 카테고리의 게시물 목록 - ${pageNumber}페이지`,
      url: canonicalURL,
    }),
    alternates: {
      canonical: canonicalURL,
    },
  };
}
