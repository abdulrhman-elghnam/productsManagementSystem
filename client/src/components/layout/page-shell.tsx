import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type PageShellProps = {
  children: ReactNode
  className?: string
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cn("mx-auto flex w-full max-w-7xl flex-col gap-6", className)}>
      {children}
    </div>
  )
}

type PageToolbarProps = {
  children?: ReactNode
  className?: string
}

export function PageToolbar({ children, className }: PageToolbarProps) {
  if (!children) {
    return null
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      {children}
    </div>
  )
}
