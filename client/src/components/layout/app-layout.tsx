import { Link, Outlet, useLocation } from "react-router-dom"
import { useState } from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { AppSidebar, MobileNavTrigger } from "@/components/layout/app-sidebar"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { getRouteMeta, ROUTES } from "@/routes/paths"

export function AppLayout() {
  const location = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const meta = getRouteMeta(location.pathname)

  return (
    <div className="flex min-h-svh bg-background">
      <div className="hidden lg:block">
        <AppSidebar className="fixed inset-y-0 left-0 z-30" />
      </div>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>Main application navigation</SheetDescription>
          </SheetHeader>
          <AppSidebar onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5">
            <div className="min-w-0 space-y-3">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink render={<Link to={ROUTES.dashboard} />}>
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{meta.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {meta.label}
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  {meta.description}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <ThemeToggle />
              <MobileNavTrigger onOpen={() => setMobileNavOpen(true)} />
            </div>
          </div>
        </header>

        <main className="relative flex-1 overflow-auto">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.92_0.02_250/0.35),transparent_45%),radial-gradient(circle_at_bottom_left,oklch(0.95_0.01_160/0.25),transparent_40%)] dark:bg-[radial-gradient(circle_at_top_right,oklch(0.28_0.04_250/0.35),transparent_45%),radial-gradient(circle_at_bottom_left,oklch(0.24_0.03_160/0.2),transparent_40%)]" />
          <div className="relative px-4 py-6 sm:px-6 sm:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
