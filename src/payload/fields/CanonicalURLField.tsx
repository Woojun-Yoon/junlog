"use client";

import {
  FieldDescription,
  FieldLabel,
  TextInput,
  toast,
  useConfig,
  useDocumentInfo,
  useField,
  useForm,
} from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import type { TextFieldClientProps } from "payload";
import { useCallback, useState } from "react";

export const CanonicalURLField = ({
  field,
  path,
  readOnly,
}: TextFieldClientProps) => {
  const fieldPath = path || field.name;
  const { value, setValue } = useField<string>({ path: fieldPath });
  const { getData } = useForm();
  const { collectionSlug } = useDocumentInfo();
  const {
    config: {
      routes: { api },
    },
  } = useConfig();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCanonicalURL = useCallback(async () => {
    const doc = getData();
    const slug = typeof doc.slug === "string" ? doc.slug.trim() : "";

    if (!slug) {
      toast.error("URL 슬러그를 먼저 입력하세요.");
      return;
    }

    setIsGenerating(true);

    try {
      const endpoint = formatAdminURL({
        apiRoute: api,
        path: "/plugin-seo/generate-url",
      });
      const response = await fetch(endpoint, {
        body: JSON.stringify({ collectionSlug, doc }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Failed to generate canonical URL: ${response.status}`);
      }

      const { result } = (await response.json()) as { result?: unknown };

      if (typeof result !== "string" || !result) {
        throw new Error("Canonical URL generator returned an invalid value");
      }

      setValue(result);
    } catch {
      toast.error("대표 URL을 생성하지 못했습니다. 잠시 후 다시 시도하세요.");
    } finally {
      setIsGenerating(false);
    }
  }, [api, collectionSlug, getData, setValue]);

  return (
    <div className="field-type text">
      <div
        style={{
          alignItems: "center",
          display: "flex",
          marginBottom: "5px",
        }}
      >
        <FieldLabel htmlFor={`field-${fieldPath}`} label={field.label} />
        <span aria-hidden="true">&nbsp; — &nbsp;</span>
        <button
          disabled={Boolean(readOnly) || isGenerating}
          onClick={() => void generateCanonicalURL()}
          style={{
            background: "none",
            border: "none",
            color: "currentColor",
            cursor: isGenerating ? "wait" : "pointer",
            padding: 0,
            textDecoration: "underline",
          }}
          type="button"
        >
          {isGenerating ? "생성 중…" : "자동 생성"}
        </button>
      </div>

      <TextInput
        onChange={setValue}
        path={fieldPath}
        placeholder={field.admin?.placeholder}
        readOnly={Boolean(readOnly)}
        value={value || ""}
      />
      <FieldDescription
        description={field.admin?.description}
        path={fieldPath}
      />
    </div>
  );
};
