import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";

type RouteContext = {
  params: Promise<{
    slug?: string;
  }>;
};

const responseHeaders = {
  "Cache-Control": "no-store",
};

const findPost = async (slug: string) => {
  const payload = await getPayload({ config: configPromise });

  const posts = await payload.find({
    collection: "posts",
    depth: 0,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    select: {
      views: true,
    },
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return {
    payload,
    post: posts.docs[0],
  };
};

export async function GET(_req: NextRequest, context: RouteContext) {
  const { slug } = await context.params;

  if (!slug) {
    return NextResponse.json(
      { error: "Missing slug" },
      { status: 400, headers: responseHeaders },
    );
  }

  const { post } = await findPost(slug);

  if (!post) {
    return NextResponse.json(
      { error: "Post not found" },
      { status: 404, headers: responseHeaders },
    );
  }

  return NextResponse.json(
    { views: post.views ?? 0 },
    { headers: responseHeaders },
  );
}

export async function POST(_req: NextRequest, context: RouteContext) {
  const { slug } = await context.params;

  if (!slug) {
    return NextResponse.json(
      { error: "Missing slug" },
      { status: 400, headers: responseHeaders },
    );
  }

  const { payload, post } = await findPost(slug);

  if (!post) {
    return NextResponse.json(
      { error: "Post not found" },
      { status: 404, headers: responseHeaders },
    );
  }

  const newViews = (post.views || 0) + 1;

  await payload.update({
    collection: "posts",
    id: post.id,
    // 외부 API에서는 views 쓰기를 막고 이 서버 경로에서만 갱신한다.
    overrideAccess: true,
    context: {
      disableRevalidate: true,
      skipContentUpdatedAt: true,
    },
    data: {
      views: newViews,
    },
  });

  return NextResponse.json({ views: newViews }, { headers: responseHeaders });
}
