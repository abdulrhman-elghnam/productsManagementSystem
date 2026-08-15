import { Link } from "react-router-dom"
import { ArrowLeft, Compass } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/layout/empty-state"
import { PageShell } from "@/components/layout/page-shell"
import { ROUTES } from "@/routes/paths"

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <PageShell className="max-w-lg">
        <EmptyState
          icon={Compass}
          title="Page not found"
          description="The page you are looking for does not exist or may have been moved."
          action={
            <Button render={<Link to={ROUTES.dashboard} />}>
              <ArrowLeft />
              Back to dashboard
            </Button>
          }
        />
      </PageShell>
    </div>
  )
}
