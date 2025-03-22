"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-12 min-h-[80vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl">
        <div className="neobrutalist-card mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-full bg-destructive/10 border-4 border-black">
              <AlertTriangle size={48} className="text-destructive" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl mb-4 font-bold text-center">Something Went Wrong</h1>

          <div className="h-2 w-32 bg-destructive mx-auto mb-6"></div>

          <p className="text-lg text-center mb-8">
            We apologize for the inconvenience. An unexpected error has occurred.
          </p>

          {/* Error Details */}
          <div className="p-4 bg-muted mb-8 border-4 border-black">
            <p className="font-mono text-sm">
              <span className="font-bold">Error:</span> {error.message || "Unknown error"}
            </p>
            {error.digest && (
              <p className="font-mono text-sm mt-2">
                <span className="font-bold">ID:</span> {error.digest}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={reset} className="neobrutalist-button flex items-center justify-center gap-2">
              <RefreshCw size={20} />
              Try Again
            </button>

            <Link
              href="/"
              className="neobrutalist-button flex items-center justify-center gap-2 bg-secondary text-secondary-foreground"
            >
              <Home size={20} />
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

