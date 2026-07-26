"use client";
import { CopyIcon } from "lucide-react";
import { useState } from "react";

export function CopyButton({ code }: { code: string }) {
  const [text, setText] = useState("Copy");

  function updateCopyStatus() {
    if (text === "Copy") {
      setText(() => "Copied!");
      setTimeout(() => {
        setText(() => "Copy");
      }, 2000);
    }
  }

  return (
    <button
      className="absolute top-2 right-2 bg-white text-gray-700 ring-1 ring-gray-300 shadow-sm hover:bg-gray-100 hover:text-gray-950 dark:bg-gray-800 dark:text-gray-300 dark:ring-0 dark:shadow-none dark:hover:bg-gray-700 dark:hover:text-white text-xs px-3 py-1 rounded transition-opacity opacity-0 group-hover:opacity-100"
      onClick={async () => {
        await navigator.clipboard.writeText(code);
        updateCopyStatus();
      }}
    >
      {text === "Copy" ? (
        <div className="flex items-center gap-2">
          <CopyIcon aria-hidden="true" className="h-4 w-4" />
          <span>{text}</span>
        </div>
      ) : (
        <span>{text}</span>
      )}
    </button>
  );
}
