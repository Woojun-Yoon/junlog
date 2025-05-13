"use client";
import { CopyIcon } from "@payloadcms/ui/icons/Copy";
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
      className="absolute top-2 right-2 bg-gray-900 dark:bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white text-xs px-3 py-1 rounded transition-opacity opacity-0 group-hover:opacity-100"
      onClick={async () => {
        await navigator.clipboard.writeText(code);
        updateCopyStatus();
      }}
    >
      {text === "Copy" ? (
        <div className="flex items-center gap-2">
          <CopyIcon />
          <span>{text}</span>
        </div>
      ) : (
        <span>{text}</span>
      )}
    </button>
  );
}
