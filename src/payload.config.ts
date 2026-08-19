import { mongooseAdapter } from "@payloadcms/db-mongodb";

import { buildConfig } from "payload";
import { payloadTotp } from "payload-totp";
import { s3Storage } from "@payloadcms/storage-s3";
import { ko } from "@payloadcms/translations/languages/ko";
import sharp from "sharp";

import { Categories } from "@/payload/collections/Categories";
import { Media } from "@/payload/collections/Media";
import { Pages } from "@/payload/collections/Pages";
import { Posts } from "@/payload/collections/Posts";
import { Users } from "@/payload/collections/Users";
import { defaultLexical } from "@/payload/fields/defaultLexical";
import { Footer } from "@/payload/globals/Footer/config";
import { Header } from "@/payload/globals/Header/config";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";

import { getServerSideURL } from "@/lib/utils/getURL";
import { plugins } from "./payload/plugins";

export default buildConfig({
  email: nodemailerAdapter({
    defaultFromAddress: "no-reply@junlog.com",
    defaultFromName: "Junlog",
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
  admin: {
    dateFormat: "yyyy-MM-dd HH:mm",
    timezones: {
      defaultTimezone: "Asia/Seoul",
      supportedTimezones: [
        {
          label: "한국 표준시 (Asia/Seoul)",
          value: "Asia/Seoul",
        },
      ],
    },
    meta: {
      titleSuffix: " | junlog Admin",
      icons: [
        {
          url: "/favicon-32x32.png",
          fetchPriority: "high",
          sizes: "16x16",
        },
      ],
    },
    components: {
      beforeLogin: ["@/components/BeforeLogin"],
      afterLogin: ["@/components/AfterLogin"],
      beforeDashboard: ["@/components/BeforeDashboard"],
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: "Mobile",
          name: "mobile",
          width: 375,
          height: 667,
        },
        {
          label: "Tablet",
          name: "tablet",
          width: 768,
          height: 1024,
        },
        {
          label: "Desktop",
          name: "desktop",
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  collections: [Users, Media, Pages, Posts, Categories],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  i18n: {
    fallbackLanguage: "ko",
    supportedLanguages: { ko },
    translations: {
      ko: {
        "plugin-redirects": {
          customUrl: "직접 입력 URL",
          documentToRedirect: "이동할 문서",
          fromUrl: "이전 URL",
          internalLink: "내부 링크",
          redirectType: "리디렉션 유형",
          toUrlType: "이동 대상 유형",
        },
      },
    },
  },
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: "src/payload-types.ts",
  },
  plugins: [
    ...plugins,
    payloadTotp({
      collection: "users",
      forceSetup: true,
      disableAccessWrapper: true,
      totp: {
        issuer: "junlog admin dashboard",
        algorithm: "SHA256",
        digits: 6,
        period: 30,
      },
    }),
    s3Storage({
      collections: {
        ["media"]: {
          disableLocalStorage: true,
          generateFileURL: (args: any) => {
            return `${process.env.NEXT_PUBLIC_CF_URL}/${args.prefix}/${args.filename}`;
          },
          prefix: "media",
        },
      },
      bucket: process.env.S3_BUCKET!,
      config: {
        region: process.env.S3_REGION,
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
      },
    }),
  ],
});
