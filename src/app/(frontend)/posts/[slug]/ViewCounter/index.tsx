"use client";

import { Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const VIEWED_POST_STORAGE_PREFIX = "junlog:viewed-post:";

type ViewCounterProps = {
  initialViews: number;
  slug: string;
};

type ViewsResponse = {
  views: number;
};

const getViewedPostStorageKey = (slug: string) =>
  `${VIEWED_POST_STORAGE_PREFIX}${encodeURIComponent(slug)}`;

const isViewsResponse = (data: unknown): data is ViewsResponse => {
  return (
    typeof data === "object" &&
    data !== null &&
    "views" in data &&
    typeof data.views === "number"
  );
};

const ViewCounter = ({ initialViews, slug }: ViewCounterProps) => {
  const [views, setViews] = useState(initialViews);
  const requestedRef = useRef(false);

  useEffect(() => {
    if (requestedRef.current) {
      return;
    }

    requestedRef.current = true;

    const syncViews = async () => {
      const storageKey = getViewedPostStorageKey(slug);
      let hasViewedPost = false;
      let pendingMarker: string | null = null;

      try {
        hasViewedPost = window.localStorage.getItem(storageKey) !== null;

        if (!hasViewedPost) {
          pendingMarker = Date.now().toString();
          window.localStorage.setItem(storageKey, pendingMarker);
        }
      } catch {
        // 스토리지를 사용할 수 없으면 중복 방지 없이 조회수를 집계한다.
      }

      try {
        const response = await fetch(
          `/next/posts-view/${encodeURIComponent(slug)}`,
          {
            method: hasViewedPost ? "GET" : "POST",
            cache: "no-store",
            keepalive: !hasViewedPost,
          },
        );

        if (!response.ok) {
          throw new Error(`조회수 요청 실패: ${response.status}`);
        }

        const data: unknown = await response.json();

        if (!isViewsResponse(data)) {
          throw new Error("조회수 응답 형식이 올바르지 않습니다.");
        }

        setViews(data.views);
      } catch (error) {
        if (pendingMarker) {
          try {
            if (window.localStorage.getItem(storageKey) === pendingMarker) {
              window.localStorage.removeItem(storageKey);
            }
          } catch {
            // 스토리지를 사용할 수 없는 환경에서는 별도 복구가 필요하지 않다.
          }
        }

        console.error("조회수를 불러오지 못했습니다.", error);
      }
    };

    void syncViews();
  }, [slug]);

  return (
    <div className="flex items-center gap-1" aria-live="polite">
      <Eye size={16} className="text-gray-400" aria-hidden="true" />
      <span className="sr-only">조회수</span>
      <span>{views}</span>
    </div>
  );
};

export default ViewCounter;
