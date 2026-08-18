import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500",
  {
    variants: {
      variant: {
        default:
          "border-emerald-500/30 bg-emerald-950 text-emerald-300 shadow-sm",
        secondary:
          "border-slate-700 bg-slate-800 text-slate-300",
        destructive:
          "border-rose-500/30 bg-rose-950 text-rose-300",
        danger:
          "border-rose-500/30 bg-rose-950 text-rose-300",
        rejected:
          "border-rose-500/30 bg-rose-950 text-rose-300",
        outline: "border-slate-700 text-slate-300",
        success:
          "border-emerald-500/40 bg-emerald-950 text-emerald-300",
        verified:
          "border-emerald-500/40 bg-emerald-950 text-emerald-300",
        warning:
          "border-amber-500/40 bg-amber-950 text-amber-300",
        pending:
          "border-amber-500/40 bg-amber-950 text-amber-300",
        info:
          "border-sky-500/40 bg-sky-950 text-sky-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

