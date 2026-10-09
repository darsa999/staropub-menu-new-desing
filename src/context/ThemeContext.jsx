import React, { createContext, useContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Safe initial state that matches SSR/HTML default
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  // Synchronize client-only preference safely after mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("app_theme");
      if (saved) {
        setTheme(saved);
      } else if (
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setTheme("dark");
      }
    } catch {}
  }, []);

  // Update DOM class and localStorage whenever theme changes after mount
  useEffect(() => {
    if (!mounted) return;
    try {
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      localStorage.setItem("app_theme", theme);
    } catch {}
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isDark: theme === "dark",
        mounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
