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

const codeFontFamily =
  "var(--font-jetbrains-mono, ui-monospace), SFMono-Regular, Menlo, Monaco, Consolas, monospace";

export const Code: React.FC<Props> = ({ code, language = "text" }) => {
  const { theme } = useTheme();
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  const isDark = hasMounted && theme === "dark";
  const syntaxTheme = isDark ? oneDark : oneLight;

  if (!code) return null;

  const lineNumbers = code
    .replace(/\n$/, "")
    .split("\n")
    .map((_, index) => index + 1)
    .join("\n");

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
        <div className="flex overflow-x-auto text-[10px] md:text-xs">
          <span
            aria-hidden="true"
            className="m-0 hidden min-w-[4rem] shrink-0 select-none whitespace-pre border-r border-border bg-transparent p-4 text-right text-muted-foreground md:block"
            style={{
              fontFamily: codeFontFamily,
              lineHeight: "1.6",
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
          >
            {lineNumbers}
          </span>
          <SyntaxHighlighter
            language={language}
            style={syntaxTheme}
            wrapLines
            codeTagProps={{
              style: {
                fontSize: "inherit",
                lineHeight: "1.6",
                tabSize: 4,
              },
            }}
            customStyle={{
              flex: "1 0 auto",
              minWidth: "max-content",
              overflow: "visible",
              margin: 0,
              padding: "1rem",
              borderWidth: 0,
              borderRadius: 0,
              fontSize: "inherit",
              lineHeight: "1.6",
              background: "transparent",
              fontFamily: codeFontFamily,
              tabSize: 4,
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};
