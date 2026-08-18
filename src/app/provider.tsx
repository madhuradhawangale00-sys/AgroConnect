"use client";

import React, { useEffect } from "react";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason instanceof Event ||
        (event.reason && typeof event.reason === "object" && "type" in event.reason && !("message" in event.reason))
      ) {
        event.preventDefault();
      }
    };

    const handleError = (event: ErrorEvent) => {
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

  return <SessionProvider>{children}</SessionProvider>;
}