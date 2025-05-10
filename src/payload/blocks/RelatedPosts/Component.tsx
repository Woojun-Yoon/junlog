import clsx from "clsx";
import React from "react";
import RichText from "@/components/RichText";
import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

import type { Post } from "@/payload-types";

import { Card } from "@/components/Card";

export type RelatedPostsProps = {
  className?: string;
  docs?: Post[];
  introContent?: SerializedEditorState;
};

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, introContent } = props;

  return (
    <div className={clsx("lg:container", className)}>
      {introContent && <RichText data={introContent} enableGutter={false} />}
      <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {docs?.map((doc, index) => {
          if (typeof doc === "string") return null;

          return (
            <div className="col-span-1" key={index}>
              <Card
                className="h-full"
                doc={doc}
                relationTo="posts"
                showCategories
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
