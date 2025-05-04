import type { Block } from "payload";

export const Code: Block = {
  slug: "code",
  interfaceName: "CodeBlock",
  fields: [
    {
      name: "language",
      type: "select",
      defaultValue: "java",
      options: [
        {
          label: "Java",
          value: "java",
        },
        {
          label: "Python",
          value: "python",
        },
        {
          label: "Kotlin",
          value: "kotlin",
        },
        {
          label: "Groovy",
          value: "groovy",
        },
        {
          label: "Bash",
          value: "bash",
        },
        {
          label: "YAML",
          value: "yaml",
        },
        {
          label: "Typescript",
          value: "typescript",
        },
        {
          label: "Javascript",
          value: "javascript",
        },
        {
          label: "CSS",
          value: "css",
        },
        {
          label: "HTML",
          value: "html",
        },
        {
          label: "JSON",
          value: "json",
        },
      ],
    },
    {
      name: "code",
      type: "code",
      label: false,
      required: true,
      admin: {
        editorOptions: {
          language: "plaintext",
          automaticLayout: true,
          fontFamily: "monospace",
          fontSize: 16,
          lineHeight: 24,
          wordWrap: "off",
          renderWhitespace: "none",
          insertSpaces: false,
          tabSize: 4,
          theme: "vs-dark",
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
          padding: { top: 10, bottom: 10 },
          scrollbar: {
            vertical: "visible",
          },

          // disable all suggestions
          suggestOnTriggerCharacters: false,
          quickSuggestions: false,
          wordBasedSuggestions: "off",
          parameterHints: {
            enabled: false,
          },
          renderValidationDecorations: "off",
        },
      },
    },
  ],
};
