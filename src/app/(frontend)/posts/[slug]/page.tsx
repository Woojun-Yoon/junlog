import type { Metadata } from "next";

import { RelatedPosts } from "@/payload/blocks/RelatedPosts/Component";
import { PayloadRedirects } from "@/components/PayloadRedirects";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import { draftMode } from "next/headers";
import React, { cache } from "react";
import RichText from "@/components/RichText";

import type { Post } from "@/payload-types";

import { PostHero } from "@/app/(frontend)/posts/[slug]/PostHero";
import { parseToc } from "./TableOfContents/parse";
import { generateMeta } from "@/lib/utils/generateMeta";
import PageClient from "./page.client";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { HeadingItem } from "./TableOfContents/types";
import TableOfContent from "./TableOfContents";
import TableOfContentTop from "./TableOfContents/TableOfContentTop";
import FloatingButton from "./FloatingButton";
import Giscus from "./Comment/Giscus";

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });
  const posts = await payload.find({
    collection: "posts",
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  });

  const params = posts.docs.map(({ slug }) => {
    return { slug };
  });

  return params;
}

type Args = {
  params: Promise<{
    slug?: string;
  }>;
};

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode();
  const { slug = "" } = await paramsPromise;
  const url = "/posts/" + slug;
  const post = await queryPostBySlug({ slug });
  const headings: [string, string][] =
    post.content?.root?.children
      .filter((node: any) => node.type === "heading")
      .map((heading: any) => [heading.children[0]?.text || "", heading.tag]) ||
    [];
  const tocHeadings: HeadingItem[] = parseToc(headings);

  if (!post) return <PayloadRedirects url={url} />;

  return (
    <article className="pt-16 pb-16">
      <PageClient />

      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className="relative container flex justify-center">
        <div className="max-w-[48rem] w-full">
          <hr className="my-8" />
          <FloatingButton />
          <TableOfContentTop toc={tocHeadings} />
          <RichText
            className="mx-auto break-words overflow-x-hidden"
            data={post.content}
            enableGutter={false}
          />
          <hr className="my-8" />
          <Giscus />
          <hr className="my-8" />
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-6"
              docs={post.relatedPosts.filter((p) => typeof p === "object")}
            />
          )}
        </div>

        <aside className="hidden xl:block absolute right-8 top-0 w-[200px]">
          <div className="fixed top-68">
            <TableOfContent toc={tocHeadings} />
          </div>
        </aside>
      </div>
    </article>
  );
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode();

  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: "posts",
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return result.docs?.[0] || null;
});

export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  const { slug = "" } = await paramsPromise;
  const post = await queryPostBySlug({ slug });

  return generateMeta({ doc: post });
}
