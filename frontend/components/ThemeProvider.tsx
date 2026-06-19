"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const themeStorageKey = "linktree_theme";
const themes = ["light", "dark"] as const;
export type ThemeValue = (typeof themes)[number];

function getInitialTheme(): ThemeValue {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(
    themeStorageKey,
  ) as ThemeValue | null;
  if (stored && themes.includes(stored)) return stored;
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  return "light";
}

function applyTheme(theme: ThemeValue) {
  const html = document.documentElement;

  html.classList.remove(...themes);
  html.classList.add(theme);
  html.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeValue>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: (next: ThemeValue) => {
        setThemeState(next);
      },
      themes,
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

const ThemeContext =
  /*#__PURE__*/
  createContext<{
    theme: ThemeValue;
    setTheme: (theme: ThemeValue) => void;
    themes: readonly ThemeValue[];
  } | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
