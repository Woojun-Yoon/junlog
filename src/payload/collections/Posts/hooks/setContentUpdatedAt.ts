import type { CollectionBeforeChangeHook } from "payload";

import type { Post } from "@/payload-types";

export const setContentUpdatedAt: CollectionBeforeChangeHook<Post> = ({
  data,
  req: { context },
}) => {
  if (context.skipContentUpdatedAt || data._status !== "published") {
    return data;
  }

  return {
    ...data,
    contentUpdatedAt: new Date().toISOString(),
  };
};
