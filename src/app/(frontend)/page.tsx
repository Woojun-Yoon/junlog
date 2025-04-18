import type { Metadata } from "next/types";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import Link from "next/link";
import PageClient from "./page.client";
import { cn } from "@/lib/utils"; // tailwind-merge helper if needed
import { Button } from "@/components/ui/button"; // from shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const POSTS_SIZE = 5;

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise });

  const { docs: posts } = await payload.find({
    collection: "posts",
    depth: 1,
    limit: POSTS_SIZE,
    overrideAccess: false,
    select: {
      title: true,
      summary: true,
      createdAt: true,
      slug: true,
      meta: true,
    },
  });

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <PageClient />

      {/* Hero Section */}
      <section className="relative py-32 text-center bg-gradient-to-br from-indigo-900/80 to-black/90 dark:from-zinc-900 dark:to-zinc-950 text-white">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Junlog
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            백엔드 개발자의 성장과 실무 기록. 트렌디한 개발 이야기들을
            공유합니다.
          </p>
        </div>
      </section>

      {/* Posts Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          ✨ 최신 포스트
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.slug} className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="hover:underline text-foreground"
                  >
                    {post.title}
                  </Link>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                </p>
              </CardHeader>
              <CardContent>
                {post.summary && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {post.summary}
                  </p>
                )}
                <Button
                  variant="link"
                  className="text-indigo-600 dark:text-indigo-400 p-0 h-auto text-sm"
                  asChild
                >
                  <Link href={`/posts/${post.slug}`}>더보기 →</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: `Junlog Home`,
  };
}
