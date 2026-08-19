import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
} from "@payloadcms/plugin-seo/fields";
import type { TextareaField, TextField, UploadField } from "payload";

type MetaTextFieldOptions = {
  description: string;
  hasGenerateFn?: boolean;
};

const addAdminDescription = <TField extends TextField | TextareaField>(
  field: TField,
  description: string,
): TField => {
  return {
    ...field,
    admin: {
      ...field.admin,
      components: {
        ...field.admin?.components,
        afterInput: [
          ...(field.admin?.components?.afterInput || []),
          {
            path: "@/payload/fields/AdminFieldDescription#AdminFieldDescription",
            clientProps: {
              description,
            },
          },
        ],
      },
    },
  } as TField;
};

export const createMetaTitleField = ({
  description,
  hasGenerateFn = false,
}: MetaTextFieldOptions) => {
  return addAdminDescription(
    MetaTitleField({
      hasGenerateFn,
      overrides: {
        label: "검색 제목",
      },
    }),
    description,
  );
};

export const createMetaDescriptionField = ({
  description,
  hasGenerateFn = false,
}: MetaTextFieldOptions) => {
  return addAdminDescription(
    MetaDescriptionField({
      hasGenerateFn,
      overrides: {
        label: "검색 설명",
      },
    }),
    description,
  );
};

export const createMetaImageField = (relationTo: string): UploadField => {
  const field = MetaImageField({
    relationTo,
    overrides: {
      label: "검색·공유 이미지",
    },
  });

  return {
    ...field,
    admin: {
      ...field.admin,
      description:
        "검색 결과와 공유 카드에 표시됩니다. 1200×630 비율의 이미지를 권장합니다.",
    },
  } as UploadField;
};
