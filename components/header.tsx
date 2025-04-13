"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { CartIcon } from "./cart-icon"
import { useAuth } from "@/contexts/AuthContext" // Corrected import path

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-black bg-background">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="border-r-4 border-black">
              <SheetHeader>
                <SheetTitle className="text-left text-2xl font-bold">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-4">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <Button variant={isActive("/") ? "default" : "ghost"} className="w-full justify-start text-lg">
                    Home
                  </Button>
                </Link>
                <Link href="/plans" onClick={() => setIsOpen(false)}>
                  <Button variant={isActive("/plans") ? "default" : "ghost"} className="w-full justify-start text-lg">
                    eSIM Plans
                  </Button>
                </Link>
                <Link href="/how-it-works" onClick={() => setIsOpen(false)}>
                  <Button
                    variant={isActive("/how-it-works") ? "default" : "ghost"}
                    className="w-full justify-start text-lg"
                  >
                    How It Works
                  </Button>
                </Link>
                <Link href="/about" onClick={() => setIsOpen(false)}>
                  <Button variant={isActive("/about") ? "default" : "ghost"} className="w-full justify-start text-lg">
                    About
                  </Button>
                </Link>
                <Link href="/faq" onClick={() => setIsOpen(false)}>
                  <Button variant={isActive("/faq") ? "default" : "ghost"} className="w-full justify-start text-lg">
                    FAQ
                  </Button>
                </Link>
                <Link href="/contact" onClick={() => setIsOpen(false)}>
                  <Button variant={isActive("/contact") ? "default" : "ghost"} className="w-full justify-start text-lg">
                    Contact
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center">
            <span className="text-2xl font-black">SORAVIO</span>
          </Link>

          <nav className="ml-8 hidden lg:block">
            <ul className="flex gap-1">
              <li>
                <Link href="/plans">
                  <Button variant={isActive("/plans") ? "default" : "ghost"}>eSIM Plans</Button>
                </Link>
              </li>
              <li>
                <Link href="/how-it-works">
                  <Button variant={isActive("/how-it-works") ? "default" : "ghost"}>How It Works</Button>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <Button variant={isActive("/about") ? "default" : "ghost"}>About</Button>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <Button variant={isActive("/faq") ? "default" : "ghost"}>FAQ</Button>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <Button variant={isActive("/contact") ? "default" : "ghost"}>Contact</Button>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <CartIcon />

          <ThemeToggle />

          {user ? (
            <Link href="/dashboard">
              <Button variant="default" className="neobrutalist-button">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/auth/sign-in">
              <Button variant="default" className="neobrutalist-button">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
