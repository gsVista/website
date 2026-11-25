"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-lg bg-surface-2 border border-line " />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="p-1.5 rounded-lg bg-surface-2 hover:bg-surface-2 border border-line text-muted transition-colors flex items-center justify-center active:scale-95 shadow-sm"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-brand-strong" />
      ) : (
        <Moon className="w-4 h-4 text-brand-strong" />
      )}
    </button>
  );
}
