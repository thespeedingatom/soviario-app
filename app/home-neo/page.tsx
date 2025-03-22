import { NeoButton } from "@/components/ui/neo-button"
import { NeoBanner } from "@/components/ui/neo-banner"
import { NeoCard } from "@/components/ui/neo-card"
import { NeoAlert } from "@/components/ui/neo-alert"
import { ESIMGrid } from "@/components/esim-grid"
import { Globe, Wifi, CreditCard, Phone, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import { AnimatedText } from "@/components/animated-text"

export default function HomeNeoPage() {
  return (
    <div className="flex flex-col">
      <NeoBanner color="red">ACTIVE SURVEILLANCE • TOP SECRET • CLASSIFIED INFORMATION</NeoBanner>

      {/* Hero Section */}
      <section className="bg-[#B8E3FF] py-20">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="flex flex-col justify-center">
              <div className="inline-block bg-black px-4 py-2 text-sm font-bold uppercase text-white">CLASSIFIED</div>
              <h1 className="mt-4 text-5xl font-black uppercase tracking-tight md:text-6xl lg:text-7xl">
                STAY CONNECTED <br />
                <AnimatedText words={["ANYWHERE", "ANYTIME"]} className="text-[#FF6666]" /> IN THE WORLD
              </h1>
              <div className="mt-2 h-1 w-32 bg-black"></div>
              <p className="mt-6 text-xl">
                Browse, compare, and purchase eSIM plans for international travel. No physical SIM card needed. Just
                scan, activate, and go!
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/plans-neo">
                  <NeoButton size="lg">Browse Plans</NeoButton>
                </Link>
                <Link href="/how-it-works">
                  <NeoButton variant="outline" size="lg">
                    How It Works
                  </NeoButton>
                </Link>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="relative h-[400px] w-[300px] animate-float">
                <div className="absolute inset-0 border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between border-b-4 border-black p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#FF6666]"></div>
                        <div className="h-4 w-4 rounded-full bg-[#FFE566]"></div>
                        <div className="h-4 w-4 rounded-full bg-[#B8E3FF]"></div>
                      </div>
                      <div className="text-sm font-bold">12:34</div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="text-lg font-bold">Europe eSIM</div>
                        <div className="rounded-full bg-[#FF6666] px-2 py-1 text-xs font-bold text-white">ACTIVE</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Wifi className="h-5 w-5" />
                          <span>3GB Data</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          <span>30 Days</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          <span>36 Countries</span>
                        </div>
                      </div>
                      <div className="mt-6 flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-black bg-gray-100 p-2">
                        <div className="text-center">
                          <div className="text-xs text-gray-500">QR Code</div>
                          <div className="mt-2 grid grid-cols-4 grid-rows-4 gap-1">
                            {Array.from({ length: 16 }).map((_, i) => (
                              <div
                                key={i}
                                className={`h-4 w-4 ${Math.random() > 0.5 ? "bg-black" : "bg-transparent"}`}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-t-4 border-black p-4">
                      <button className="w-full rounded-none bg-[#FF6666] py-2 text-sm font-bold text-white border-2 border-black">
                        Manage eSIM
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alert Section */}
      <div className="container py-8">
        <NeoAlert variant="info" title="Limited Time Offer">
          Get 10% off all eSIM plans with code <strong>TRAVEL10</strong> at checkout.
        </NeoAlert>
      </div>

      {/* Featured Plans Section */}
      <section className="py-16">
        <div className="container">
          <div className="mb-12">
            <div className="inline-block bg-black px-4 py-2 text-sm font-bold uppercase text-white">TOP SECRET</div>
            <h2 className="mt-4 text-4xl font-black uppercase tracking-tight">FEATURED PLANS</h2>
            <div className="mt-2 h-1 w-32 bg-[#FF6666]"></div>
          </div>

          <ESIMGrid featured limit={3} />

          <div className="mt-12 text-center">
            <Link href="/plans-neo">
              <NeoButton size="lg">View All Plans</NeoButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#E0BDFF] py-20">
        <div className="container">
          <div className="text-center">
            <div className="inline-block bg-black px-4 py-2 text-sm font-bold uppercase text-white">CONFIDENTIAL</div>
            <h2 className="mt-4 text-4xl font-black uppercase tracking-tight">WHY CHOOSE SORAVIO?</h2>
            <div className="mx-auto mt-2 h-1 w-32 bg-black"></div>
            <p className="mx-auto mt-6 max-w-2xl text-xl">
              We make staying connected while traveling simple, affordable, and hassle-free.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <NeoCard title="Global Coverage" color="purple">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <p>Connect in over 190 countries with our wide range of regional and country-specific plans.</p>
            </NeoCard>

            <NeoCard title="Transparent Pricing" color="yellow">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <p>No hidden fees or surprises. Pay only for what you need with our clear pricing structure.</p>
            </NeoCard>

            <NeoCard title="Instant Activation" color="blue">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black">
                <Wifi className="h-8 w-8 text-white" />
              </div>
              <p>Get connected in minutes. Purchase, scan the QR code, and you're ready to go.</p>
            </NeoCard>

            <NeoCard title="24/7 Support" color="pink">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <p>Our support team is available around the clock to help with any issues or questions.</p>
            </NeoCard>
          </div>
        </div>
      </section>

      <NeoBanner color="black">STAY CONNECTED ANYWHERE • GLOBAL COVERAGE • INSTANT ACTIVATION</NeoBanner>
    </div>
  )
}

