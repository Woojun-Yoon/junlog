import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-start justify-start md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6">
      <div className="space-x-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-6xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:border-r-2 md:px-6 md:text-8xl md:leading-14">
          404
        </h1>
      </div>
      <div className="max-w-md">
        <p className="mb-4 text-xl font-bold leading-normal md:text-2xl">
          페이지를 찾을 수 없어요.
        </p>
        <p className="mb-8">페이지 주소를 다시 한번 확인해 주세요.</p>
        <Button asChild variant="default">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
