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
      <Badge variant="verified" className="flex items-center gap-1.5 px-2.5 py-1">
        <ShieldCheck className={iconSize} />
        {showText && <span>KYC Verified</span>}
      </Badge>
    );
  }

  if (status === "Pending") {
    return (
      <Badge variant="pending" className="flex items-center gap-1.5 px-2.5 py-1">
        <Clock className={iconSize} />
        {showText && <span>KYC Pending</span>}
      </Badge>
    );
  }

  if (status === "Rejected") {
    return (
      <Badge variant="rejected" className="flex items-center gap-1.5 px-2.5 py-1">
        <XCircle className={iconSize} />
        {showText && <span>KYC Rejected</span>}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="flex items-center gap-1.5 px-2.5 py-1">
      <AlertCircle className={iconSize} />
      {showText && <span>KYC Unverified</span>}
    </Badge>
  );
}
