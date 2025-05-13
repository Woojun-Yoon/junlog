import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";

type RouteContext = {
  params?: {
    slug?: string;
  };
};

export async function POST(req: NextRequest, context: RouteContext) {
  const payload = await getPayload({ config: configPromise });

  const { slug } = (await context.params) || {};

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const posts = await payload.find({
    collection: "posts",
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  if (!posts.docs.length) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const post = posts.docs[0];
  const newViews = (post.views || 0) + 1;

  await payload.update({
    collection: "posts",
    id: post.id,
    data: {
      views: newViews,
    },
  });

  return NextResponse.json({ views: newViews });
}
