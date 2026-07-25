"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const ANALYTICS_CONSENT_STORAGE_KEY = "junlog-analytics-consent";
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const POSTHOG_IS_CONFIGURED = Boolean(POSTHOG_KEY && POSTHOG_HOST);

type AnalyticsConsent = "denied" | "granted" | "unknown";

type PostHogClient = {
  capture: (eventName: string, properties?: Record<string, unknown>) => void;
  opt_out_capturing?: () => void;
};

type WindowWithPostHog = Window & {
  posthog?: PostHogClient;
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout: number },
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

type NavigatorWithPrivacyControl = Navigator & {
  globalPrivacyControl?: boolean;
};

const getPostHog = () => (window as WindowWithPostHog).posthog;

const readAnalyticsConsent = (): AnalyticsConsent => {
  const privacyAwareNavigator = navigator as NavigatorWithPrivacyControl;

  if (
    privacyAwareNavigator.globalPrivacyControl === true ||
    navigator.doNotTrack === "1"
  ) {
    return "denied";
  }

  try {
    const storedConsent = window.localStorage.getItem(
      ANALYTICS_CONSENT_STORAGE_KEY,
    );

    if (storedConsent === "granted" || storedConsent === "denied") {
      return storedConsent;
    }
  } catch {
    // Storage can be unavailable in private or hardened browser contexts.
  }

  return "unknown";
};

const persistAnalyticsConsent = (
  consent: Exclude<AnalyticsConsent, "unknown">,
) => {
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, consent);
  } catch {
    // The in-memory choice still applies for the current page.
  }
};

const postHogBootstrap = `
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog&&window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init hi $r kr ui wr Er capture Ri calculateEventProperties Ir register register_once register_for_session unregister unregister_for_session Fr getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty Cr Tr createPersonProfile Or yr Mr opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing Pr debug L Rr getPageViewId captureTraceFeedback captureTraceMetric gr".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  posthog.init(${JSON.stringify(POSTHOG_KEY ?? "")},{api_host:${JSON.stringify(
    POSTHOG_HOST ?? "",
  )},person_profiles:"identified_only",capture_pageview:false});
`;

function PostHogPageView({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastCapturedUrl = useRef<string | null>(null);

  useEffect(() => {
    const postHog = getPostHog();

    if (!enabled || !pathname || !postHog) return;

    const query = searchParams?.toString();
    const url = `${window.location.origin}${pathname}${query ? `?${query}` : ""}`;

    if (lastCapturedUrl.current === url) return;

    lastCapturedUrl.current = url;
    postHog.capture("$pageview", { $current_url: url });
  }, [enabled, pathname, searchParams]);

  useEffect(() => {
    if (!enabled) return;

    const capturePageLeave = () => {
      getPostHog()?.capture("$pageleave");
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        capturePageLeave();
      }
    };

    window.addEventListener("beforeunload", capturePageLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", capturePageLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled]);

  return null;
}

function AnalyticsConsentBanner({
  onChoose,
}: {
  onChoose: (consent: Exclude<AnalyticsConsent, "unknown">) => void;
}) {
  return (
    <aside
      aria-describedby="analytics-consent-description"
      aria-labelledby="analytics-consent-title"
      className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 rounded-2xl border border-border/80 bg-background/95 p-4 text-foreground shadow-2xl backdrop-blur-md sm:p-5"
      role="dialog"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="min-w-0 flex-1">
          <p
            className="mb-1.5 text-sm font-semibold tracking-tight sm:text-base"
            id="analytics-consent-title"
          >
            쿠키 사용 안내
          </p>
          <p
            className="text-pretty text-[13px] leading-5 text-muted-foreground sm:text-sm sm:leading-6"
            id="analytics-consent-description"
          >
            방문, 이용 통계를 분석해 블로그를 개선하기 위해 쿠키 및 유사 기술을
            사용합니다. ‘허용’을 선택하면 방문 페이지, 기기·브라우저 정보 등이
            수집·이용될 수 있으며, ‘거부’를 선택해도 이용에는 영향이 없습니다.
          </p>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex">
          <button
            className="h-10 w-full rounded-lg border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto sm:min-w-[5rem]"
            onClick={() => onChoose("denied")}
            type="button"
          >
            거부
          </button>
          <button
            className="h-10 w-full rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto sm:min-w-[5rem]"
            onClick={() => onChoose("granted")}
            type="button"
          >
            허용
          </button>
        </div>
      </div>
    </aside>
  );
}

export function PostHogProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);
  const [shouldInitialize, setShouldInitialize] = useState(false);
  const [isPostHogReady, setIsPostHogReady] = useState(false);

  useEffect(() => {
    if (!POSTHOG_IS_CONFIGURED) {
      setConsent("denied");
      return;
    }

    setConsent(readAnalyticsConsent());

    const handleStorage = (event: StorageEvent) => {
      if (event.key === ANALYTICS_CONSENT_STORAGE_KEY) {
        setConsent(readAnalyticsConsent());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (consent !== "granted" || shouldInitialize) return;

    const idleWindow = window as WindowWithPostHog;
    let idleCallbackId: number | undefined;
    let fallbackTimerId: number | undefined;
    let disposed = false;

    const initialize = () => {
      if (!disposed) {
        setShouldInitialize(true);
      }
    };

    const scheduleWhenIdle = () => {
      if (idleWindow.requestIdleCallback) {
        idleCallbackId = idleWindow.requestIdleCallback(initialize, {
          timeout: 4000,
        });
      } else {
        fallbackTimerId = window.setTimeout(initialize, 2000);
      }
    };

    if (document.readyState === "complete") {
      scheduleWhenIdle();
    } else {
      window.addEventListener("load", scheduleWhenIdle, { once: true });
    }

    return () => {
      disposed = true;
      window.removeEventListener("load", scheduleWhenIdle);

      if (idleCallbackId !== undefined) {
        idleWindow.cancelIdleCallback?.(idleCallbackId);
      }

      if (fallbackTimerId !== undefined) {
        window.clearTimeout(fallbackTimerId);
      }
    };
  }, [consent, shouldInitialize]);

  useEffect(() => {
    if (consent === "denied") {
      getPostHog()?.opt_out_capturing?.();
    }
  }, [consent]);

  const handleConsent = useCallback(
    (nextConsent: Exclude<AnalyticsConsent, "unknown">) => {
      persistAnalyticsConsent(nextConsent);
      setConsent(nextConsent);
    },
    [],
  );

  return (
    <>
      {shouldInitialize && consent === "granted" && (
        <Script
          dangerouslySetInnerHTML={{ __html: postHogBootstrap }}
          id="posthog-js"
          onReady={() => setIsPostHogReady(true)}
          strategy="afterInteractive"
        />
      )}
      <Suspense fallback={null}>
        <PostHogPageView enabled={isPostHogReady && consent === "granted"} />
      </Suspense>
      {children}
      {consent === "unknown" && (
        <AnalyticsConsentBanner onChoose={handleConsent} />
      )}
    </>
  );
}
