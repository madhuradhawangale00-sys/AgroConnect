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
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
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
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

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
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);

    // Set google translate cookie for current domain and root path
    const domain = window.location.hostname;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${domain}`;
    document.cookie = `googtrans=/en/${langCode}; path=/`;

    // Attempt to trigger select element inside google translate container
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
      {/* Hidden container for Google Translate element */}
      <div id="google_translate_element" className="hidden" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-200 hover:text-white hover:bg-slate-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/60"
          >
            <Languages className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold">
              {LANGUAGES.find((l) => l.code === currentLang)?.label || "Language"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-slate-900 border-2 border-slate-700 text-slate-100 min-w-[140px] shadow-xl">
          {LANGUAGES.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`hover:bg-slate-800 cursor-pointer font-medium flex items-center justify-between text-xs py-2 ${
                currentLang === lang.code ? "text-emerald-400 font-bold bg-slate-800/60" : "text-slate-200"
              }`}
            >
              <span>{lang.label}</span>
              {currentLang === lang.code && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
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
