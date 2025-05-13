"use client";

import { useEffect } from "react";

const ViewCounter = ({ slug }: { slug: string }) => {
  useEffect(() => {
    fetch(`/next/posts-view/${slug}`, {
      method: "POST",
    }).catch(() => {
      return null;
    });
  }, [slug]);

  return null;
};

export default ViewCounter;
