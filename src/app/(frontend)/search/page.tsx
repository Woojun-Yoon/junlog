import type { Metadata } from "next";

import configPromise from "@payload-config";
import { Search as SearchIcon } from "lucide-react";
import { getPayload } from "payload";

import { PostListItem } from "@/components/PostListItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAbsoluteURL } from "@/lib/utils/getURL";
import { mergeOpenGraph } from "@/lib/utils/mergeOpenGraph";

const SEARCH_LIMIT = 20;
const MAX_QUERY_LENGTH = 100;

type SearchPageProps = {
  searchParams: Promise<{
    q?: string | string[];
  }>;
};

const normalizeQuery = (query?: string | string[]) => {
  const value = Array.isArray(query) ? query[0] : query;

  return value?.trim().slice(0, MAX_QUERY_LENGTH) || "";
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = normalizeQuery(q);
  const payload = await getPayload({ config: configPromise });

  const searchResults = query
    ? await payload.find({
        collection: "search",
        depth: 0,
        limit: SEARCH_LIMIT,
        overrideAccess: false,
        select: {
          doc: true,
          slug: true,
          summary: true,
          title: true,
        },
        sort: "-updatedAt",
        where: {
          or: [
            {
              title: {
                contains: query,
              },
            },
            {
              summary: {
                contains: query,
              },
            },
          ],
        },
      })
    : null;

  const postIDs =
    searchResults?.docs.map((result) =>
      typeof result.doc.value === "string"
        ? result.doc.value
        : result.doc.value.id,
    ) || [];

  const matchingPosts =
    postIDs.length > 0
      ? await (async () => {
          const { docs } = await payload.find({
            collection: "posts",
            depth: 1,
            limit: SEARCH_LIMIT,
            overrideAccess: false,
            pagination: false,
            select: {
              meta: true,
              slug: true,
              summary: true,
              title: true,
            },
            where: {
              id: {
                in: postIDs,
              },
            },
          });
          const postsByID = new Map(docs.map((post) => [post.id, post]));

          return postIDs
            .map((postID) => postsByID.get(postID))
            .filter((post) => post !== undefined);
        })()
      : [];

  return (
    <main className="container min-h-[70vh] pb-20 pt-24 sm:pt-28">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            검색
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            게시글 제목과 요약에서 키워드를 찾습니다.
          </p>
        </header>

        <form action="/search" className="flex gap-2" role="search">
          <label className="sr-only" htmlFor="search-query">
            검색어
          </label>
          <Input
            id="search-query"
            name="q"
            type="search"
            defaultValue={query}
            maxLength={MAX_QUERY_LENGTH}
            placeholder="검색어를 입력하세요"
            className="h-11"
          />
          <Button type="submit" className="h-11 shrink-0 px-4">
            <SearchIcon aria-hidden="true" />
            검색
          </Button>
        </form>

        <section aria-live="polite" aria-label="검색 결과" className="mt-10">
          {!query ? (
            <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
              검색어를 입력하면 일치하는 게시글을 보여드립니다.
            </p>
          ) : searchResults && matchingPosts.length > 0 ? (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{query}</span>{" "}
                검색 결과 {searchResults.totalDocs}개
              </p>
              <ol className="divide-y divide-border border-y border-border">
                {matchingPosts.map((post) => (
                  <li key={post.id}>
                    <PostListItem post={post} showDate={false} />
                  </li>
                ))}
              </ol>
              {searchResults.hasNextPage && (
                <p className="mt-5 text-sm text-muted-foreground">
                  검색 결과가 많아 최신 {SEARCH_LIMIT}개만 표시합니다.
                </p>
              )}
            </>
          ) : (
            <div className="rounded-md border border-dashed p-8 text-center">
              <p className="font-medium">일치하는 게시글이 없습니다.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                다른 검색어나 더 짧은 단어로 다시 찾아보세요.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export const metadata: Metadata = {
  title: "검색 | junlog",
  description: "junlog 게시글의 제목과 요약을 검색합니다.",
  alternates: {
    canonical: getAbsoluteURL("/search"),
  },
  openGraph: mergeOpenGraph({
    title: "검색 | junlog",
    description: "junlog 게시글의 제목과 요약을 검색합니다.",
    url: getAbsoluteURL("/search"),
  }),
  robots: {
    follow: true,
    index: false,
  },
};
