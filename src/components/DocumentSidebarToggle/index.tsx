"use client";

import { Button } from "@payloadcms/ui";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import "./index.scss";

const baseClass = "document-sidebar-toggle";
const storageKey = "junlog:admin:document-sidebar-collapsed";

const DocumentSidebarToggle = () => {
  const [controlsWrapper, setControlsWrapper] = useState<HTMLElement | null>(
    null,
  );
  const [hasLoadedPreference, setHasLoadedPreference] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const mountRef = useRef<HTMLSpanElement | null>(null);
  const sidebarId = useId();

  useEffect(() => {
    setControlsWrapper(
      mountRef.current?.closest<HTMLElement>(
        ".doc-controls__controls-wrapper",
      ) ?? null,
    );
  }, []);

  useEffect(() => {
    try {
      setIsCollapsed(window.sessionStorage.getItem(storageKey) === "true");
    } catch (error) {
      console.warn("사이드바 설정을 불러오지 못했습니다.", error);
    } finally {
      setHasLoadedPreference(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedPreference) {
      return;
    }

    try {
      window.sessionStorage.setItem(storageKey, String(isCollapsed));
    } catch (error) {
      console.warn("사이드바 설정을 저장하지 못했습니다.", error);
    }
  }, [hasLoadedPreference, isCollapsed]);

  useEffect(() => {
    const editView = controlsWrapper?.closest<HTMLElement>(".collection-edit");
    const sidebar = editView?.querySelector<HTMLElement>(
      ".document-fields__sidebar-wrap",
    );

    if (!editView || !sidebar) {
      return;
    }

    const previousSidebarId = sidebar.getAttribute("id");
    const previousCollapsedState = editView.dataset.documentSidebarCollapsed;

    sidebar.id = sidebarId;
    editView.dataset.documentSidebarCollapsed = String(isCollapsed);

    return () => {
      if (previousSidebarId) {
        sidebar.id = previousSidebarId;
      } else {
        sidebar.removeAttribute("id");
      }

      if (previousCollapsedState) {
        editView.dataset.documentSidebarCollapsed = previousCollapsedState;
      } else {
        delete editView.dataset.documentSidebarCollapsed;
      }
    };
  }, [controlsWrapper, isCollapsed, sidebarId]);

  const label = isCollapsed ? "사이드바 펼치기" : "사이드바 접기";
  const Icon = isCollapsed ? PanelRightOpen : PanelRightClose;

  return (
    <>
      <span
        aria-hidden="true"
        className={`${baseClass}__mount`}
        ref={mountRef}
      />
      {controlsWrapper &&
        createPortal(
          <Button
            aria-label={label}
            buttonStyle="subtle"
            className={baseClass}
            extraButtonProps={{
              "aria-controls": sidebarId,
              "aria-expanded": !isCollapsed,
            }}
            icon={<Icon aria-hidden="true" focusable="false" />}
            margin={false}
            onClick={() => setIsCollapsed((collapsed) => !collapsed)}
            size="medium"
            tooltip={label}
          />,
          controlsWrapper,
        )}
    </>
  );
};

export default DocumentSidebarToggle;
