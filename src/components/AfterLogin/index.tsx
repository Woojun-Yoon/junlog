"use client";

import React, { useEffect, useRef, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

const LOGIN_FORM_SELECTOR = "form.login__form";
const SUBMIT_BUTTON_SELECTOR = `${LOGIN_FORM_SELECTOR} button[type="submit"]`;

const AfterLogin: React.FC = () => {
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const formRef = useRef<HTMLFormElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const turnstileRef = useRef<{ reset?: () => void } | null>(null);
  const turnstileTokenRef = useRef("");
  const allowNextSubmitRef = useRef(false);
  const isVerifyingRef = useRef(false);

  const syncSubmitButtonState = () => {
    const submitButton = submitButtonRef.current;

    if (!submitButton) {
      return;
    }

    const isDisabled =
      !turnstileTokenRef.current || isVerifyingRef.current;

    submitButton.disabled = isDisabled;
    submitButton.style.opacity = isDisabled ? "0.6" : "1";
    submitButton.style.cursor = isDisabled ? "not-allowed" : "pointer";
  };

  const resetTurnstile = () => {
    turnstileRef.current?.reset?.();
    turnstileTokenRef.current = "";
    setTurnstileToken("");
  };

  const submitLoginForm = () => {
    const loginForm = formRef.current;

    if (!loginForm) {
      return;
    }

    if (typeof loginForm.requestSubmit === "function") {
      loginForm.requestSubmit();
      return;
    }

    loginForm.dispatchEvent(
      new Event("submit", {
        bubbles: true,
        cancelable: true,
      })
    );
  };

  useEffect(() => {
    turnstileTokenRef.current = turnstileToken;
    syncSubmitButtonState();
  }, [turnstileToken]);

  useEffect(() => {
    const handleSubmit = async (event: Event) => {
      if (allowNextSubmitRef.current) {
        allowNextSubmitRef.current = false;
        return;
      }

      event.preventDefault();

      if (!turnstileTokenRef.current || isVerifyingRef.current) {
        return;
      }

      isVerifyingRef.current = true;
      syncSubmitButtonState();

      try {
        const captchaResponse = await fetch("/next/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: turnstileTokenRef.current }),
        });

        if (!captchaResponse.ok) {
          resetTurnstile();
          return;
        }

        allowNextSubmitRef.current = true;
        submitLoginForm();
      } catch {
        resetTurnstile();
      } finally {
        isVerifyingRef.current = false;
        syncSubmitButtonState();
      }
    };

    const handleClick = (event: MouseEvent) => {
      if (!turnstileTokenRef.current || isVerifyingRef.current) {
        event.preventDefault();
      }
    };

    const bindLoginForm = () => {
      const loginForm = document.querySelector(LOGIN_FORM_SELECTOR);
      const submitButton = document.querySelector(SUBMIT_BUTTON_SELECTOR);

      if (loginForm instanceof HTMLFormElement && loginForm !== formRef.current) {
        formRef.current?.removeEventListener("submit", handleSubmit, true);
        formRef.current = loginForm;
        formRef.current.addEventListener("submit", handleSubmit, true);
      }

      if (
        submitButton instanceof HTMLButtonElement &&
        submitButton !== submitButtonRef.current
      ) {
        submitButtonRef.current?.removeEventListener("click", handleClick);
        submitButtonRef.current = submitButton;
        submitButtonRef.current.addEventListener("click", handleClick);
      }

      syncSubmitButtonState();
    };

    bindLoginForm();

    const timeoutId = window.setTimeout(bindLoginForm, 100);

    const observer = new MutationObserver(bindLoginForm);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.clearTimeout(timeoutId);
      observer.disconnect();
      formRef.current?.removeEventListener("submit", handleSubmit, true);
      submitButtonRef.current?.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <Turnstile
      ref={(instance) => {
        turnstileRef.current = instance ?? null;
      }}
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
      onSuccess={(token) => {
        turnstileTokenRef.current = token;
        setTurnstileToken(token);
      }}
      onError={() => {
        resetTurnstile();
      }}
      options={{
        action: "submit-form",
        theme: "auto",
        size: "flexible",
      }}
      onExpire={() => {
        resetTurnstile();
      }}
    />
  );
};

export default AfterLogin;
