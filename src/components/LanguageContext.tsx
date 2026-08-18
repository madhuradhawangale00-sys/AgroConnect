"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { LanguageCode, LANGUAGES, getTranslation } from "@/lib/i18n";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

interface LanguageContextType {
  currentLang: LanguageCode;
  changeLanguage: (code: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLang: "en",
  changeLanguage: () => {},
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentLang, setCurrentLang] = useState<LanguageCode>("en");
  const pathname = usePathname();

  // Helper to read cookie
  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
  };

  // Sync Google Translate Combo box with selected lang code
  const triggerGoogleTranslateCombo = useCallback((langCode: string) => {
    if (typeof document === "undefined") return;
    const selectEl = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (selectEl) {
      if (selectEl.value !== langCode) {
        selectEl.value = langCode;
        selectEl.dispatchEvent(new Event("change"));
      }
    }
  }, []);

  const changeLanguage = useCallback((langCode: LanguageCode) => {
    setCurrentLang(langCode);

    // Save in localStorage
    try {
      localStorage.setItem("app_language", langCode);
    } catch (e) {
      console.warn("Could not save language to localStorage", e);
    }

    // Set cookie correctly without breaking domain syntax on localhost
    const hostname = window.location.hostname;
    document.cookie = `googtrans=/en/${langCode}; path=/`;
    if (hostname.includes(".") && hostname !== "localhost" && hostname !== "127.0.0.1") {
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${hostname}`;
    }

    // Broadcast custom event
    window.dispatchEvent(new CustomEvent("agroconnect_lang_change", { detail: langCode }));

    // Trigger Google Translate Combo
    triggerGoogleTranslateCombo(langCode);
    setTimeout(() => triggerGoogleTranslateCombo(langCode), 400);
  }, [triggerGoogleTranslateCombo]);

  useEffect(() => {
    // 0. Safely polyfill Node.prototype.removeChild and Node.prototype.insertBefore
    // to prevent React DOM reconciliation crashes when Google Translate modifies font nodes
    if (typeof window !== "undefined" && typeof Node !== "undefined" && !(window as any).__google_translate_patched) {
      (window as any).__google_translate_patched = true;

      const originalRemoveChild = Node.prototype.removeChild;
      Node.prototype.removeChild = function <T extends Node>(child: T): T {
        if (child.parentNode !== this) {
          if (child.parentNode) {
            return child.parentNode.removeChild(child) as T;
          }
          return child;
        }
        return originalRemoveChild.call(this, child) as T;
      };

      const originalInsertBefore = Node.prototype.insertBefore;
      Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
        if (referenceNode && referenceNode.parentNode !== this) {
          if (referenceNode.parentNode) {
            return referenceNode.parentNode.insertBefore(newNode, referenceNode) as T;
          }
          return this.appendChild(newNode) as T;
        }
        return originalInsertBefore.call(this, newNode, referenceNode) as T;
      };
    }

    // Helper to detect user's browser language if no manual choice is saved
    const detectBrowserLanguage = (): LanguageCode => {
      if (typeof window === "undefined" || typeof navigator === "undefined") return "en";
      const browserLangs = navigator.languages || [navigator.language || "en"];
      for (const langStr of browserLangs) {
        if (!langStr) continue;
        const code = langStr.split("-")[0].toLowerCase() as LanguageCode;
        if (LANGUAGES.some((l) => l.code === code)) {
          return code;
        }
      }
      return "en";
    };

    // 1. Restore language from cookie or localStorage, or auto-detect from browser
    const savedLocal = typeof window !== "undefined" ? (localStorage.getItem("app_language") as LanguageCode | null) : null;
    const googtrans = getCookie("googtrans");
    let activeCode: LanguageCode = "en";

    if (googtrans) {
      const code = googtrans.split("/").pop() as LanguageCode;
      if (code && LANGUAGES.some((l) => l.code === code)) {
        activeCode = code;
      }
    } else if (savedLocal && LANGUAGES.some((l) => l.code === savedLocal)) {
      activeCode = savedLocal;
      document.cookie = `googtrans=/en/${activeCode}; path=/`;
    } else {
      // Auto-detect browser language setting
      const autoDetected = detectBrowserLanguage();
      if (autoDetected !== "en") {
        activeCode = autoDetected;
        document.cookie = `googtrans=/en/${autoDetected}; path=/`;
        try {
          localStorage.setItem("app_language", autoDetected);
        } catch {
          // ignore
        }
      }
    }

    setCurrentLang(activeCode);

    // 2. Initialize Google Translate Script Globally
    const includedCodes = LANGUAGES.map((l) => l.code).join(",");
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: includedCodes,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );

        setTimeout(() => {
          triggerGoogleTranslateCombo(activeCode);
        }, 500);
      }
    };

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onerror = (e) => {
        console.warn("Google Translate script failed to load gracefully", e);
      };
      document.body.appendChild(script);
    } else if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }

    // 3. Interval cleanup for Google Translate top banners
    const interval = setInterval(() => {
      const banner =
        document.querySelector(".goog-te-banner-frame") ||
        document.querySelector("iframe[class*='VIpgJd']") ||
        document.querySelector(".goog-te-balloon-frame");
      if (banner) {
        try {
          banner.remove();
        } catch {
          // ignore
        }
      }
      if (document.body.style.top !== "0px" && document.body.style.top !== "") {
        document.body.style.top = "0px";
      }
    }, 400);

    return () => {
      clearInterval(interval);
    };
  }, [triggerGoogleTranslateCombo]);

  // Re-trigger translation on dynamic route change
  useEffect(() => {
    if (currentLang !== "en") {
      const timer = setTimeout(() => triggerGoogleTranslateCombo(currentLang), 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, currentLang, triggerGoogleTranslateCombo]);

  const t = useCallback(
    (key: string) => getTranslation(key, currentLang),
    [currentLang]
  );

  return (
    <LanguageContext.Provider value={{ currentLang, changeLanguage, t }}>
      {children}
      {/* SINGLE persistent offscreen container for Google Translate element */}
      <div
        id="google_translate_element"
        className="fixed bottom-0 right-0 z-[-1] opacity-0 pointer-events-none w-1 h-1 overflow-hidden"
      />
      <style jsx global>{`
        .goog-te-banner-frame,
        .goog-te-balloon-frame,
        iframe[class*="VIpgJd"],
        iframe.skiptranslate {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          width: 0 !important;
        }
        body {
          top: 0px !important;
          position: static !important;
        }
        .goog-te-gadget {
          display: none !important;
        }
        .goog-tooltip {
          display: none !important;
        }
        .goog-text-highlight {
          background-color: transparent !important;
          box-shadow: none !important;
        }
        #goog-gt-tt {
          display: none !important;
        }
      `}</style>
    </LanguageContext.Provider>
  );
};
