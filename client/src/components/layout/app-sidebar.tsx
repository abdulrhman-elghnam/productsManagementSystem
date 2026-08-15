import { NavLink } from "react-router-dom"
import { Boxes, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { routeMeta } from "@/routes/paths"

type AppSidebarProps = {
  onNavigate?: () => void
  className?: string
}

export function AppSidebar({ onNavigate, className }: AppSidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-72 shrink-0 flex-col border-r border-border/60 bg-card/80 backdrop-blur-xl",
        className,
      )}
    >
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Boxes className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight">
              Inventory Hub
            </h1>
            <p className="text-xs text-muted-foreground">
              Product management system
            </p>
          </div>
        </div>
      </div>

      <Separator className="opacity-60" />

      <nav className="flex flex-1 flex-col gap-1 p-3">
        <p className="px-3 pb-1 text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          Navigation
        </p>
        {routeMeta.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg transition-colors",
                      isActive
                        ? "bg-primary-foreground/10"
                        : "bg-muted group-hover:bg-background",
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="flex min-w-0 flex-col items-start gap-0.5">
                    <span className="font-medium">{item.label}</span>
                    <span
                      className={cn(
                        "line-clamp-1 text-xs",
                        isActive
                          ? "text-primary-foreground/75"
                          : "text-muted-foreground",
                      )}
                    >
                      {item.description}
                    </span>
                  </span>
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-border/60 p-4">
        <div className="rounded-xl border border-dashed bg-muted/30 px-3 py-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Quick tip</p>
          <p className="mt-1">
            Add suppliers first, then products, then record sales to populate
            reports.
          </p>
        </div>
      </div>
    </aside>
  )
}

export function MobileNavTrigger({
  onOpen,
}: {
  onOpen: () => void
}) {
  return (
    <Button
      variant="outline"
      size="icon-sm"
      className="lg:hidden"
      onClick={onOpen}
      aria-label="Open navigation"
    >
      <Menu />
    </Button>
  )
}
