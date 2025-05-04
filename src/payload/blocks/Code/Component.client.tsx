"use client";
import { Highlight, themes, Prism } from "prism-react-renderer";
import React from "react";
import { CopyButton } from "./CopyButton";

type Props = {
  code: string;
  language?: string;
};

// Java syntax highlighting
(typeof global !== "undefined" ? global : window).Prism = Prism;
require("prismjs/components/prism-java");
require("prismjs/components/prism-groovy");
require("prismjs/components/prism-bash");

export const Code: React.FC<Props> = ({ code, language = "" }) => {
  if (!code) return null;

  return (
    <div className="relative group">
      <Highlight code={code} language={language} theme={themes.oneDark}>
        {({ getLineProps, getTokenProps, tokens }) => (
          <pre className="bg-gray-900 text-gray-100 rounded-lg shadow-md p-4 text-base leading-relaxed overflow-x-auto font-mono relative">
            {tokens.map((line, i) => (
              <div
                key={i}
                {...getLineProps({ className: "table-row", line })}
                className="flex"
              >
                <span className="w-6 text-right pr-3 text-gray-500 select-none border-r border-gray-700">
                  {i + 1}
                </span>

                <span className="flex-1 pl-4">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
      <CopyButton code={code} />
    </div>
  );
};
