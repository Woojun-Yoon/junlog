import React from "react";

type SchemaObject = Record<string, unknown>;

export const JsonLd = ({
  schema,
}: {
  schema: SchemaObject | SchemaObject[];
}) => {
  const payload = Array.isArray(schema)
    ? {
        "@context": "https://schema.org",
        "@graph": schema,
      }
    : {
        "@context": "https://schema.org",
        ...schema,
      };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload).replace(/</g, "\\u003c"),
      }}
    />
  );
};
