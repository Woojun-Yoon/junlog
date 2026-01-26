import { CollectionArchive } from "@/components/CollectionArchive/CollectionArchive";
import { Pagination } from "@/components/Pagination";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Category, Post } from "@/payload-types";

export interface PostsPageLayoutProps {
  categories: Category[];
  posts: Post[];
  activeCategory?: string | null;
  currentCategoryTitle?: string | null;
  totalDocs: number;
  page: number;
  totalPages: number;
}

export function PostsPageLayout({
  categories,
  posts,
  activeCategory,
  currentCategoryTitle,
  totalDocs,
  page,
  totalPages,
}: PostsPageLayoutProps) {
  return (
    <div className="pt-6 pb-12">
      <div className="container mb-8">
        <div className="prose dark:prose-invert text-center max-w-none">
          <h1 className="font-semibold text-4xl md:text-4xl lg:text-5xl">
            Posts
          </h1>
          <p className="text-center text-base md:text-base lg:text-lg font-normal text-neutral-600 dark:text-neutral-400">
            배우고 익힌 내용을 정리합니다
          </p>
        </div>
      </div>

      <div className="container mb-8">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
        />
      </div>

      <CollectionArchive posts={posts} />

      <div className="container mt-8">
        {totalPages > 1 && page && (
          <Pagination page={page} totalPages={totalPages} />
        )}
      </div>
    </div>
  );
}
