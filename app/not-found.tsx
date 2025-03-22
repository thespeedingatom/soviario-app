"use client"

import Link from "next/link"
import { Home, Search, Map, Compass, HelpCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-[80vh] flex flex-col items-center justify-center">
      {/* Main Content */}
      <div className="w-full max-w-4xl">
        <div className="neobrutalist-card mb-8 relative overflow-hidden">
          {/* 404 Background Text */}
          <div className="absolute -right-8 -top-8 text-[180px] md:text-[250px] font-bold text-black/5 select-none pointer-events-none z-0">
            404
          </div>

          {/* Content */}
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl mb-4 font-bold">
              <span className="text-primary">Oops!</span> Page Not Found
            </h1>

            <div className="h-2 w-32 bg-secondary mb-6"></div>

            <p className="text-lg md:text-xl mb-8">
              The page you're looking for seems to have wandered off the map. Maybe it's enjoying an eSIM in another
              country?
            </p>

            {/* Error Details */}
            <div className="p-4 bg-muted mb-8 border-4 border-black">
              <p className="font-mono text-sm">
                <span className="font-bold">Error 404:</span> The requested URL was not found on this server.
              </p>
            </div>

            {/* Primary Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/" className="neobrutalist-button flex items-center justify-center gap-2">
                <Home size={20} />
                Back to Homepage
              </Link>

              <Link
                href="/plans"
                className="neobrutalist-button flex items-center justify-center gap-2 bg-secondary text-secondary-foreground"
              >
                <Compass size={20} />
                Browse eSIM Plans
              </Link>
            </div>
          </div>
        </div>

        {/* Secondary Content - Popular Destinations */}
        <div className="neobrutalist-card">
          <h2 className="text-2xl font-bold mb-4">Looking for something specific?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="border-4 border-black p-4 hover:bg-muted transition-colors">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Map size={20} />
                Popular Destinations
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/plans?region=europe" className="underline hover:text-primary">
                    Europe eSIMs
                  </Link>
                </li>
                <li>
                  <Link href="/plans?region=asia" className="underline hover:text-primary">
                    Asia eSIMs
                  </Link>
                </li>
                <li>
                  <Link href="/plans?region=americas" className="underline hover:text-primary">
                    Americas eSIMs
                  </Link>
                </li>
                <li>
                  <Link href="/plans" className="underline hover:text-primary">
                    All Destinations
                  </Link>
                </li>
              </ul>
            </div>

            <div className="border-4 border-black p-4 hover:bg-muted transition-colors">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <HelpCircle size={20} />
                Help & Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/how-it-works" className="underline hover:text-primary">
                    How eSIMs Work
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="underline hover:text-primary">
                    Frequently Asked Questions
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="underline hover:text-primary">
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="underline hover:text-primary">
                    About Sovario
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search for destinations, plans, or help topics..."
              className="neobrutalist-input pl-12"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // In a real implementation, this would redirect to search results
                  window.location.href = `/search?q=${encodeURIComponent(e.currentTarget.value)}`
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

