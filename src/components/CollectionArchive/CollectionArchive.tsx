import { cn } from "@/lib/utils";
import React from "react";

import { Card, CardPostData } from "@/components/Card";

export type Props = {
  posts: CardPostData[];
  priorityFirstImage?: boolean;
};

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts, priorityFirstImage = false } = props;

  const archiveCardImageSizes =
    "(max-width: 639px) calc(100vw - 2rem), (max-width: 767px) 292px, (max-width: 1023px) 340px, (max-width: 1279px) 277px, (max-width: 1375px) 347px, 379px";

  return (
    <div className={cn("container py-4")}>
      <div>
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-6 gap-x-6 lg:gap-y-8 lg:gap-x-8 xl:gap-x-10 xl:gap-y-10 lg:mx-8 xl:mx-12">
          {posts?.map((result, index) => {
            if (typeof result === "object" && result !== null) {
              return (
                <div className="col-span-4" key={index}>
                  <Card
                    className="h-full"
                    doc={result}
                    priority={priorityFirstImage && index === 0}
                    relationTo="posts"
                    showCategories
                    sizes={archiveCardImageSizes}
                  />
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};
