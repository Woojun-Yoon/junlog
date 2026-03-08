import type { CollectionConfig } from "payload";

import { authenticated } from "@/payload/auth/authenticated";

export const Users: CollectionConfig = {
  slug: "users",
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ["name", "email"],
    useAsTitle: "name",
  },
  auth: true,
  fields: [
    {
      name: "name",
      type: "text",
      admin: {
        description: "Author name shown on posts and structured data.",
      },
    },
    {
      name: "bio",
      type: "textarea",
      admin: {
        description: "Short public bio used for author structured data.",
      },
    },
    {
      name: "profileImage",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Public profile image for author rich results and bylines.",
      },
    },
    {
      name: "website",
      type: "text",
      admin: {
        description: "Public website URL for this author.",
      },
    },
    {
      name: "githubUrl",
      type: "text",
      label: "GitHub URL",
    },
  ],
  timestamps: true,
};
