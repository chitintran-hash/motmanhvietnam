"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations, Language } from "@/lib/translations";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (path: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "vi",
  setLang: () => {},
  toggleLang: () => {},
  t: (path: string, fallback?: string) => fallback || path,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("vi");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Lấy ngôn ngữ đã lưu từ localStorage
    try {
      const savedLang = localStorage.getItem("mm_lang") as Language;
      if (savedLang === "vi" || savedLang === "en") {
        setLangState(savedLang);
        document.documentElement.lang = savedLang;
      } else {
        localStorage.setItem("mm_lang", "vi");
        document.documentElement.lang = "vi";
      }
    } catch (e) {
      // Ignore if localStorage unavailable
    }
    setMounted(true);

    // 2. Lắng nghe thay đổi ngôn ngữ từ các tab / component khác
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "mm_lang" && (e.newValue === "vi" || e.newValue === "en")) {
        setLangState(e.newValue);
        document.documentElement.lang = e.newValue;
      }
    };

    const handleCustomChange = (e: any) => {
      const newLang = e.detail?.lang;
      if (newLang === "vi" || newLang === "en") {
        setLangState(newLang);
        document.documentElement.lang = newLang;
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("mm_language_changed", handleCustomChange as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("mm_language_changed", handleCustomChange as EventListener);
    };
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem("mm_lang", newLang);
      document.documentElement.lang = newLang;
      window.dispatchEvent(
        new CustomEvent("mm_language_changed", { detail: { lang: newLang } })
      );
    } catch (e) {}
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "vi" ? "en" : "vi");
  }, [lang, setLang]);

  const t = useCallback(
    (path: string, fallback?: string): string => {
      const keys = path.split(".");
      let currentObj: any = translations[lang] || translations.vi;

      for (const k of keys) {
        if (currentObj && typeof currentObj === "object" && k in currentObj) {
          currentObj = currentObj[k];
        } else {
          // Fallback to Vietnamese if key missing in current language
          let fallbackObj: any = translations.vi;
          for (const fbKey of keys) {
            if (fallbackObj && typeof fallbackObj === "object" && fbKey in fallbackObj) {
              fallbackObj = fallbackObj[fbKey];
            } else {
              fallbackObj = undefined;
              break;
            }
          }
          if (typeof fallbackObj === "string") return fallbackObj;
          return fallback !== undefined ? fallback : path;
        }
      }

      return typeof currentObj === "string" ? currentObj : fallback !== undefined ? fallback : path;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
