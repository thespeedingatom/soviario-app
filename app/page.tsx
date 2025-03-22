import Link from "next/link"
import { Globe, Wifi, CreditCard, Phone, MapPin, Clock } from "lucide-react"
import { NeoCard } from "@/components/ui/neo-card"
import { NeoButton } from "@/components/ui/neo-button"
import { NeoBanner } from "@/components/ui/neo-banner"
import { AnimatedText } from "@/components/animated-text"
import { ESIMGrid } from "@/components/esim-grid"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="min-h-screen relative overflow-hidden bg-secondary py-20">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent opacity-50"></div>
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-primary opacity-30"></div>

        <div className="container relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="flex flex-col justify-center">
              <h1 className="text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
                Stay Connected <br />
                <AnimatedText words={["Anywhere", "Anytime"]} className="text-primary" /> in the World
              </h1>
              <p className="mt-6 text-xl">
                Navigate foreign cities, overcome language barriers, and breeze through customs with reliable
                connectivity. Browse our eSIM plans for stress-free travel—no physical SIM needed. Just scan, activate,
                and explore with confidence!
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/plans">
                  <NeoButton size="lg">Browse Plans</NeoButton>
                </Link>
                <Link href="/how-it-works">
                  <NeoButton variant="outline" className="neobrutalist-border text-lg">
                    How It Works
                  </NeoButton>
                </Link>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="relative h-[400px] w-[300px] animate-float">
                <div className="absolute inset-0 neobrutalist-card bg-white">
                  <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between border-b-4 border-black p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-primary"></div>
                        <div className="h-4 w-4 rounded-full bg-secondary"></div>
                        <div className="h-4 w-4 rounded-full bg-accent"></div>
                      </div>
                      <div className="text-sm font-bold">12:34</div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="text-lg font-bold">Europe eSIM</div>
                        <div className="rounded-full bg-primary px-2 py-1 text-xs font-bold text-white">ACTIVE</div>
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
                      <div className="mt-6 h-32 rounded-lg border-2 border-dashed border-black bg-muted p-2 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">QR Code</div>
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
                      <button className="w-full rounded-full bg-primary py-2 text-sm font-bold text-white">
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

      {/* Promo Banner */}
      <NeoBanner color="primary">USE CODE "TRAVEL10" FOR 10% OFF YOUR FIRST ESIM PURCHASE</NeoBanner>

      {/* Features Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-20 -left-10 h-40 w-40 bg-primary rotate-12 opacity-20"></div>
        <div className="absolute bottom-40 right-20 h-60 w-60 rounded-full bg-secondary opacity-30"></div>
        <div className="absolute top-1/2 left-1/3 h-24 w-24 bg-accent rotate-45"></div>

        <div className="container relative">
          <div className="mb-20 flex flex-col items-start">
            <div className="w-24 h-8 bg-primary mb-4"></div>
            <h2 className="text-5xl font-bold border-b-4 border-black pb-2">Why Choose Soravio?</h2>
            <p className="mt-6 max-w-2xl text-xl text-muted-foreground ml-12 border-l-4 border-black pl-4">
              We make staying connected while traveling simple, affordable, and hassle-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 md:row-span-1">
              <NeoCard title="Global Coverage" color="blue" className="transform rotate-1 h-full">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                  <Globe className="h-8 w-8" />
                </div>
                <p className="mt-2 text-muted-foreground text-lg">
                  Connect in over 190 countries with our wide range of regional and country-specific plans.
                </p>
              </NeoCard>
            </div>

            <div className="md:col-span-5 md:row-span-2 md:mt-12">
              <NeoCard title="Transparent Pricing" color="yellow" className="transform -rotate-2 h-full">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <CreditCard className="h-8 w-8" />
                </div>
                <p className="mt-2 text-muted-foreground text-lg">
                  No hidden fees or surprises. Pay only for what you need with our clear pricing structure.
                </p>
              </NeoCard>
            </div>

            <div className="md:col-span-7 md:row-span-1 md:-mt-8">
              <NeoCard title="Instant Activation" color="pink" className="transform rotate-1 h-full">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Phone className="h-8 w-8" />
                </div>
                <p className="mt-2 text-muted-foreground text-lg">
                  Get connected in minutes. Purchase, scan the QR code, and you're ready to go.
                </p>
              </NeoCard>
            </div>
          </div>

          <div className="mt-16 ml-auto w-3/4 h-4 bg-black"></div>
          <div className="mt-4 w-1/2 h-4 bg-primary"></div>
        </div>
      </section>

      {/* Featured Plans Section */}
      <section className="bg-muted py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="text-4xl font-bold">Featured Plans</h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-muted-foreground">
              Our most popular eSIM plans for travelers
            </p>
          </div>

          <div className="mt-16">
            <ESIMGrid featured limit={3} />
          </div>

          <div className="mt-12 text-center">
            <Link href="/plans">
              <NeoButton size="lg">View All Plans</NeoButton>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="text-4xl font-bold">How It Works</h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-muted-foreground">
              Getting connected with Soravio is quick and easy.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white neobrutalist-border">
                <span className="text-3xl font-bold">1</span>
              </div>
              <h3 className="mt-6 text-2xl font-bold">Choose a Plan</h3>
              <p className="mt-2 text-muted-foreground">
                Browse our selection of eSIM plans and choose the one that fits your travel needs.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-secondary-foreground neobrutalist-border">
                <span className="text-3xl font-bold">2</span>
              </div>
              <h3 className="mt-6 text-2xl font-bold">Complete Purchase</h3>
              <p className="mt-2 text-muted-foreground">
                Pay securely online and receive your eSIM details instantly via email.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent text-accent-foreground neobrutalist-border">
                <span className="text-3xl font-bold">3</span>
              </div>
              <h3 className="mt-6 text-2xl font-bold">Activate & Connect</h3>
              <p className="mt-2 text-muted-foreground">
                Scan the QR code with your phone, activate your eSIM, and start using data right away.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/how-it-works">
              <NeoButton variant="outline" className="neobrutalist-border text-lg">
                Learn More
              </NeoButton>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <NeoCard color="red" className="text-white">
            <div className="p-8 md:p-12 lg:p-16">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h2 className="text-4xl font-bold md:text-5xl">Ready to Stay Connected on Your Next Trip?</h2>
                  <p className="mt-4 text-xl">
                    Browse our plans, choose the one that fits your needs, and get connected in minutes.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link href="/plans">
                      <NeoButton color="white" size="lg">
                        Browse Plans
                      </NeoButton>
                    </Link>
                    <Link href="/how-it-works">
                      <NeoButton variant="outline" color="white" size="lg">
                        Learn More
                      </NeoButton>
                    </Link>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative h-64 w-64">
                    <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-pulse"></div>
                    <div className="absolute inset-4 rounded-full bg-white opacity-40 animate-pulse delay-300"></div>
                    <div className="absolute inset-8 rounded-full bg-white opacity-60 animate-pulse delay-500"></div>
                    <div className="absolute inset-12 rounded-full bg-white flex items-center justify-center">
                      <Globe className="h-16 w-16 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </NeoCard>
        </div>
      </section>

      {/* Marquee Section */}
      <NeoBanner color="black">STAY CONNECTED ANYWHERE • GLOBAL COVERAGE • INSTANT ACTIVATION</NeoBanner>
    </div>
  )
}

