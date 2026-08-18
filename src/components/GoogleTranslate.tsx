"use client";

import { useEffect, useState } from "react";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "mr", label: "मराठी (Marathi)" },
];

export default function GoogleTranslate() {
  const [currentLang, setCurrentLang] = useState<string>("en");

  useEffect(() => {
    // Check initial cookie
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
      return match ? match[2] : null;
    };

    const googtrans = getCookie("googtrans");
    if (googtrans) {
      const code = googtrans.split("/").pop();
      if (code && ["en", "hi", "mr"].includes(code)) {
        setCurrentLang(code);
      }
    }

    // Add Google Translate script if not already added
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi,mr",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
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

    // Suppress raw browser script Event unhandled rejection overlays in dev mode
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason instanceof Event || (event.reason && typeof event.reason === "object" && "type" in event.reason && !("message" in event.reason))) {
        event.preventDefault();
      }
    };
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    // Remove Google Translate banner frames and top margin overrides
    const interval = setInterval(() => {
      const banner = document.querySelector(".goog-te-banner-frame") || document.querySelector("iframe[class*='VIpgJd']");
      if (banner) {
        banner.remove();
      }
      if (document.body.style.top !== "0px") {
        document.body.style.top = "0px";
      }
    }, 500);

    return () => {
      clearInterval(interval);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);

    // Set googletranslate cookie
    document.cookie = `googtrans=/en/${langCode}; path=/`;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;

    // Trigger select element inside google translate container
    const selectEl = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (selectEl) {
      selectEl.value = langCode;
      selectEl.dispatchEvent(new Event("change"));
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="relative inline-block">
      {/* Offscreen container so Google Translate can instantiate .goog-te-combo */}
      <div id="google_translate_element" className="absolute top-0 left-0 opacity-0 pointer-events-none w-0 h-0 overflow-hidden" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-200 hover:text-white hover:bg-slate-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/60 font-medium"
          >
            <Languages className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold">
              {LANGUAGES.find((l) => l.code === currentLang)?.label || "Language"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-slate-900 border-2 border-slate-700 text-slate-100 min-w-[160px] shadow-2xl z-50">
          {LANGUAGES.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`hover:bg-slate-800 cursor-pointer font-medium flex items-center justify-between text-xs py-2.5 px-3 ${
                currentLang === lang.code ? "text-emerald-400 font-extrabold bg-slate-800/80" : "text-slate-200"
              }`}
            >
              <span>{lang.label}</span>
              {currentLang === lang.code && <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Global CSS overrides to hide Google Translate banner frame & top bar */}
      <style jsx global>{`
        .goog-te-banner-frame {
          display: none !important;
        }
        body {
          top: 0px !important;
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
      `}</style>
    </div>
  );
}
