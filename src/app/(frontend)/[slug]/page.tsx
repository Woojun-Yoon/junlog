import type { Metadata } from "next";

import { PayloadRedirects } from "@/components/PayloadRedirects";
import configPromise from "@payload-config";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import { cache } from "react";

import type { Page as PageType } from "@/payload-types";

import { LivePreviewListener } from "@/components/LivePreviewListener";
import { JsonLd } from "@/components/Seo/JsonLd";
import { generateMeta } from "@/lib/utils/generateMeta";
import { getAbsoluteURL, getCollectionURL } from "@/lib/utils/getURL";
import { getBreadcrumbSchema, getPageSchema } from "@/lib/seo/schema";
import { RenderBlocks } from "@/payload/blocks/RenderBlocks";
import PageClient from "./page.client";

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });
  const pages = await payload.find({
    collection: "pages",
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  });

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== "home";
    })
    .map(({ slug }) => {
      return { slug };
    });

  return params;
}

type Args = {
  params: Promise<{
    slug?: string;
  }>;
};

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode();
  const { slug = "home" } = await paramsPromise;
  const url = "/" + slug;

  const page: PageType | null = await queryPageBySlug({
    slug,
  });

  if (!page) {
    return <PayloadRedirects url={url} />;
  }

  const { blocks } = page;
  const canonicalURL = page.meta?.canonicalUrl || getCollectionURL("pages", page.slug);

  return (
    <article className="pt-16 pb-24">
      <JsonLd
        schema={[
          getPageSchema(page),
          getBreadcrumbSchema([
            {
              name: "Home",
              item: getAbsoluteURL("/"),
            },
            {
              name: page.title,
              item: canonicalURL,
            },
          ]),
        ]}
      />
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderBlocks blocks={blocks} />
    </article>
  );
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode();

  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: "pages",
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
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
}): Promise<Metadata> {
  const { slug = "home" } = await paramsPromise;
  const page = await queryPageBySlug({
    slug,
  });

  return generateMeta({ collection: "pages", doc: page });
}
