"use client";

import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyButton } from "./CopyButton";
import { useTheme } from "@/components/ThemeProvider/Theme";

type Props = {
  code: string;
  language?: string;
};

export const Code: React.FC<Props> = ({ code, language = "text" }) => {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (!theme &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  if (!code) return null;

  return (
    <div className="relative group not-prose">
      {/* Copy 버튼 */}
      <div className="hidden md:block absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton code={code} />
      </div>

      {/* 코드 박스 */}
      <div
        className={`rounded-lg overflow-hidden border ${
          isDark ? "border-gray-700 bg-[#282c34]" : "border-gray-300 bg-gray-50"
        }`}
      >
        <SyntaxHighlighter
          language={language}
          style={isDark ? oneDark : oneLight}
          showLineNumbers
          wrapLines
          lineNumberStyle={{
            minWidth: "2rem",
            paddingRight: "1rem",
            color: isDark ? "#6b7280" : "#9ca3af",
            borderRight: isDark ? "1px solid #374151" : "1px solid #d1d5db",
            marginRight: "1rem",
          }}
          customStyle={{
            margin: 0,
            padding: "1rem",
            fontSize: "1rem",
            lineHeight: "1.6",
            background: "transparent",
            fontFamily:
              "ui-mono, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
