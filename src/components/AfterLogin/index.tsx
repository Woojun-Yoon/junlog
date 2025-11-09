"use client";

import React, { useEffect, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

const AfterLogin: React.FC = () => {
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileRef, setTurnstileRef] = useState<any>(null);

  useEffect(() => {
    const interceptLoginForm = () => {
      const loginForm = document.querySelector("form") as HTMLFormElement;
      const submitButton = document.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;

      if (loginForm && submitButton) {
        loginForm.onsubmit = async (e) => {
          e.preventDefault();

          if (!turnstileToken) {
            return false;
          }

          try {
            const captchaResponse = await fetch("/next/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token: turnstileToken }),
            });

            if (!captchaResponse.ok) {
              turnstileRef?.reset();
              setTurnstileToken("");
              return false;
            }

            const formData = new FormData(loginForm);
            formData.append("turnstileToken", turnstileToken);

            const loginResponse = await fetch("/api/users/login", {
              method: "POST",
              body: formData,
            });

            if (loginResponse.ok) {
              window.location.reload();
            } else {
              turnstileRef?.reset();
              setTurnstileToken("");
            }
          } catch (error) {
            turnstileRef?.reset();
            setTurnstileToken("");
          }

          return false;
        };

        submitButton.onclick = (e) => {
          if (!turnstileToken) {
            e.preventDefault();
            return false;
          }
        };

        submitButton.disabled = !turnstileToken;
        if (!turnstileToken) {
          submitButton.style.opacity = "0.6";
          submitButton.style.cursor = "not-allowed";
        } else {
          submitButton.style.opacity = "1";
          submitButton.style.cursor = "pointer";
        }
      }
    };

    setTimeout(interceptLoginForm, 100);

    const observer = new MutationObserver(interceptLoginForm);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [turnstileToken, turnstileRef]);

  useEffect(() => {
    const submitButton = document.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    if (submitButton) {
      submitButton.disabled = !turnstileToken;
      submitButton.style.opacity = turnstileToken ? "1" : "0.6";
      submitButton.style.cursor = turnstileToken ? "pointer" : "not-allowed";
    }
  }, [turnstileToken]);

  return (
    <Turnstile
      ref={setTurnstileRef}
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
      onSuccess={(token) => {
        setTurnstileToken(token);
      }}
      onError={() => {
        setTurnstileToken("");
      }}
      options={{
        action: "submit-form",
        theme: "auto",
        size: "flexible",
      }}
      onExpire={() => {
        setTurnstileToken("");
      }}
    />
  );
};

export default AfterLogin;
