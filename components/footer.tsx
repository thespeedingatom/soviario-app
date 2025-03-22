"use client"

import Link from "next/link"
import { Globe, Mail, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t-4 border-black bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-primary">
                <Globe className="absolute inset-1 text-white" />
              </div>
              <span className="text-2xl font-bold">SORAVIO</span>
            </Link>
            <p className="mt-4 text-muted-foreground">Stay connected anywhere in the world with Soravio eSIM plans.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/plans" className="hover:text-primary">
                  Browse Plans
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-primary">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold">Support</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/faq" className="hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <a href="mailto:info@soravio.com" className="hover:text-primary">
                  info@soravio.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <a href="tel:+1234567890" className="hover:text-primary">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="font-bold">Newsletter</h4>
              <div className="mt-2 flex">
                <input type="email" placeholder="Your email" className="neobrutalist-input" />
                <button className="neobrutalist-button ml-2">Subscribe</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t-2 border-black pt-6 text-center">
          <p>&copy; {new Date().getFullYear()} Soravio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

