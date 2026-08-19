"use client";

import { FieldDescription } from "@payloadcms/ui";

type AdminFieldDescriptionProps = {
  description: string;
  path: string;
};

export const AdminFieldDescription = ({
  description,
  path,
}: AdminFieldDescriptionProps) => {
  return <FieldDescription description={description} path={path} />;
};
