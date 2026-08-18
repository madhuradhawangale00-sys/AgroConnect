"use client";

import { useEffect, useState } from "react";
import { Languages, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/components/LanguageContext";
import { LANGUAGES, LanguageCode } from "@/lib/i18n";

interface GoogleTranslateProps {
  variant?: "dropdown" | "compact" | "floating";
  className?: string;
}

export default function GoogleTranslate({ variant = "dropdown", className = "" }: GoogleTranslateProps) {
  const { currentLang, changeLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];
  const displayLabel = mounted ? activeLangObj.label : LANGUAGES[0].label;
  const displayShort = mounted ? activeLangObj.short : LANGUAGES[0].short;

  return (
    <div className={`relative inline-block ${className}`} suppressHydrationWarning>
      {variant === "floating" ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-2xl rounded-full px-3.5 py-2 flex items-center gap-2 border-2 border-emerald-400/50 backdrop-blur-md"
            >
              <Globe className="h-4 w-4 animate-pulse text-emerald-200" />
              <span className="text-xs tracking-wide" suppressHydrationWarning>
                {displayLabel.split(" ")[0]}
              </span>
              <ChevronDown className="h-3 w-3 opacity-80" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="top"
            className="bg-slate-900 border-2 border-slate-700 text-slate-100 min-w-[190px] max-h-[320px] overflow-y-auto shadow-2xl z-[9999]"
          >
            <div className="px-3 py-2 text-[11px] font-bold uppercase text-emerald-400 border-b border-slate-800 tracking-wider">
              Select Language / भाषा चुनें
            </div>
            {LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => changeLanguage(lang.code as LanguageCode)}
                className={`hover:bg-slate-800 cursor-pointer font-medium flex items-center justify-between text-xs py-2 px-3 ${
                  mounted && currentLang === lang.code ? "text-emerald-400 font-extrabold bg-slate-800/80" : "text-slate-200"
                }`}
              >
                <span>{lang.label}</span>
                {mounted && currentLang === lang.code && (
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : variant === "compact" ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-200 hover:text-white hover:bg-slate-800/80 flex items-center gap-1 px-2 py-1 rounded-md border border-slate-700/60 font-semibold text-xs"
            >
              <Languages className="h-3.5 w-3.5 text-emerald-400" />
              <span suppressHydrationWarning>{displayShort}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-slate-900 border-2 border-slate-700 text-slate-100 min-w-[180px] max-h-[320px] overflow-y-auto shadow-2xl z-50"
          >
            {LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => changeLanguage(lang.code as LanguageCode)}
                className={`hover:bg-slate-800 cursor-pointer font-medium flex items-center justify-between text-xs py-2 px-3 ${
                  mounted && currentLang === lang.code ? "text-emerald-400 font-extrabold bg-slate-800/80" : "text-slate-200"
                }`}
              >
                <span>{lang.label}</span>
                {mounted && currentLang === lang.code && (
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-200 hover:text-white hover:bg-slate-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/60 font-medium"
            >
              <Languages className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-semibold" suppressHydrationWarning>
                {displayLabel}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-slate-900 border-2 border-slate-700 text-slate-100 min-w-[180px] max-h-[340px] overflow-y-auto shadow-2xl z-50"
          >
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-800 tracking-wider">
              Language / भाषा
            </div>
            {LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => changeLanguage(lang.code as LanguageCode)}
                className={`hover:bg-slate-800 cursor-pointer font-medium flex items-center justify-between text-xs py-2 px-3 ${
                  mounted && currentLang === lang.code ? "text-emerald-400 font-extrabold bg-slate-800/80" : "text-slate-200"
                }`}
              >
                <span>{lang.label}</span>
                {mounted && currentLang === lang.code && (
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}


