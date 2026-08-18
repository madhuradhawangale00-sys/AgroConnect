"use client";

import React from "react";
import { ShieldCheck, Clock, AlertCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface KYCBadgeProps {
  status?: "Not Submitted" | "Pending" | "Verified" | "Rejected" | string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function KYCBadge({ status = "Not Submitted", size = "md", showText = true }: KYCBadgeProps) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

  if (status === "Verified") {
    return (
      <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-1.5 px-2.5 py-1 shadow-sm">
        <ShieldCheck className={iconSize} />
        {showText && <span>KYC Verified</span>}
      </Badge>
    );
  }

  if (status === "Pending") {
    return (
      <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/30 font-medium flex items-center gap-1.5 px-2.5 py-1">
        <Clock className={iconSize} />
        {showText && <span>KYC Pending</span>}
      </Badge>
    );
  }

  if (status === "Rejected") {
    return (
      <Badge variant="destructive" className="font-medium flex items-center gap-1.5 px-2.5 py-1">
        <XCircle className={iconSize} />
        {showText && <span>KYC Rejected</span>}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium flex items-center gap-1.5 px-2.5 py-1">
      <AlertCircle className={iconSize} />
      {showText && <span>KYC Unverified</span>}
    </Badge>
  );
}
