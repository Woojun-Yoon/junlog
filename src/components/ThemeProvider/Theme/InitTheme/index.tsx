import React from "react";

import { defaultTheme, themeLocalStorageKey } from "../ThemeSelector/types";

const initThemeScript = `
  (function () {
    function getImplicitPreference() {
      if (typeof window.matchMedia !== 'function') {
        return null
      }

      var mediaQuery = '(prefers-color-scheme: dark)'
      var mql = window.matchMedia(mediaQuery)
      var hasImplicitPreference = typeof mql.matches === 'boolean'

      if (hasImplicitPreference) {
        return mql.matches ? 'dark' : 'light'
      }

      return null
    }

    function themeIsValid(theme) {
      return theme === 'light' || theme === 'dark'
    }

    var themeToSet = '${defaultTheme}'
    var preference = null

    try {
      preference = window.localStorage.getItem('${themeLocalStorageKey}')
    } catch (_) {
      // Fall back to the system preference when storage is unavailable.
    }

    if (themeIsValid(preference)) {
      themeToSet = preference
    } else {
      var implicitPreference = getImplicitPreference()

      if (implicitPreference) {
        themeToSet = implicitPreference
      }
    }

    var root = document.documentElement
    root.setAttribute('data-theme', themeToSet)
    root.style.colorScheme = themeToSet
  })();
`;

export const InitTheme: React.FC = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: initThemeScript,
      }}
      id="theme-script"
    />
  );
};
