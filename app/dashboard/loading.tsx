import { Loader2 } from "lucide-react"

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        <h2 className="mt-4 text-xl font-bold">Loading your dashboard...</h2>
        <p className="mt-2 text-muted-foreground">Please wait while we retrieve your information.</p>
      </div>
    </div>
  )
}

