"use client";

import React, { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/components/LanguageContext";
import GoogleTranslate from "@/components/GoogleTranslate";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      const reasonStr = String(event.reason?.message || event.reason?.name || event.reason || "");
      if (
        reasonStr.includes("ChunkLoadError") ||
        reasonStr.includes("Loading chunk") ||
        reasonStr.includes("webpack.js")
      ) {
        event.preventDefault();
        window.location.reload();
        return;
      }

      if (
        event.reason instanceof Event ||
        (event.reason && typeof event.reason === "object" && "type" in event.reason && !("message" in event.reason))
      ) {
        event.preventDefault();
      }
    };

    const handleError = (event: ErrorEvent) => {
      const errStr = String(event.message || event.error?.message || event.error?.name || "");
      if (
        errStr.includes("ChunkLoadError") ||
        errStr.includes("Loading chunk") ||
        errStr.includes("webpack.js")
      ) {
        event.preventDefault();
        window.location.reload();
        return;
      }

      if (event.error instanceof Event || (event.target && event.target !== window)) {
        event.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", handleRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("unhandledrejection", handleRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);

  return (
    <SessionProvider>
      <LanguageProvider>
        {children}
        {/* Persistent Floating Multi-Lingual Switcher Widget */}
        <div className="fixed bottom-4 right-4 z-[9990] notranslate">
          <GoogleTranslate variant="floating" />
        </div>
      </LanguageProvider>
    </SessionProvider>
  );
}