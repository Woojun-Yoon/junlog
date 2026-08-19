import { Link } from "@payloadcms/ui";
import React from "react";

import "./index.scss";

const baseClass = "before-dashboard";

const quickActions = [
  {
    description: "새 게시글 작성을 시작합니다.",
    href: "/admin/collections/posts/create",
    label: "새 글 작성",
  },
  {
    description: "게시글에 사용할 이미지와 파일을 추가합니다.",
    href: "/admin/collections/media/create",
    label: "미디어 업로드",
  },
  {
    description: "작성 중이거나 발행된 게시글을 관리합니다.",
    href: "/admin/collections/posts",
    label: "게시글 목록",
  },
] as const;

const BeforeDashboard: React.FC = () => {
  return (
    <section aria-labelledby={`${baseClass}-title`} className={baseClass}>
      <header className={`${baseClass}__header`}>
        <h1 className={`${baseClass}__title`} id={`${baseClass}-title`}>
          콘텐츠 관리
        </h1>
        <p className={`${baseClass}__description`}>
          자주 사용하는 관리 화면으로 바로 이동하세요.
        </p>
      </header>

      <nav aria-labelledby={`${baseClass}-quick-actions`}>
        <h2
          className={`${baseClass}__section-title`}
          id={`${baseClass}-quick-actions`}
        >
          빠른 작업
        </h2>
        <ul className={`${baseClass}__actions`}>
          {quickActions.map((action) => (
            <li className={`${baseClass}__action`} key={action.href}>
              <Link className={`${baseClass}__link`} href={action.href}>
                <span className={`${baseClass}__link-label`}>
                  {action.label}
                </span>
                <span className={`${baseClass}__link-description`}>
                  {action.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
};

export default BeforeDashboard;
