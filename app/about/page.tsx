import { NeoButton } from "@/components/ui/neo-button"
import { NeoCard } from "@/components/ui/neo-card"
import { NeoBanner } from "@/components/ui/neo-banner"
import { Globe, Users, Award, Target } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <NeoBanner color="blue">ABOUT SORAVIO • OUR MISSION • OUR TEAM</NeoBanner>

      {/* Hero Section */}
      <section className="bg-[#B8E3FF] py-16">
        <div className="container">
          <div className="text-center">
            <div className="inline-block bg-black px-4 py-2 text-sm font-bold uppercase text-white">ABOUT US</div>
            <h1 className="mt-4 text-5xl font-black uppercase tracking-tight">OUR MISSION</h1>
            <div className="mx-auto mt-2 h-1 w-32 bg-black"></div>
            <p className="mx-auto mt-6 max-w-3xl text-xl">
              At Soravio, we're on a mission to make global connectivity simple, affordable, and hassle-free for
              travelers around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <div className="inline-block bg-black px-4 py-2 text-sm font-bold uppercase text-white">OUR STORY</div>
              <h2 className="mt-4 text-4xl font-black uppercase tracking-tight">CONNECTING THE WORLD</h2>
              <div className="mt-2 h-1 w-32 bg-[#FF6666]"></div>

              <div className="mt-6 space-y-4">
                <p>
                  Soravio was founded in 2023 by a group of frequent travelers who were frustrated with the high costs
                  and complications of staying connected while abroad.
                </p>
                <p>
                  After experiencing the pain of excessive roaming charges, unreliable public Wi-Fi, and the hassle of
                  buying local SIM cards in each country, we decided there had to be a better way.
                </p>
                <p>
                  We created Soravio to solve these problems with a simple solution: affordable eSIMs that work
                  seamlessly across multiple countries, activated instantly with just a scan.
                </p>
                <p>
                  Today, we're proud to help thousands of travelers stay connected in over 190 countries without the
                  stress, complexity, or high costs traditionally associated with international connectivity.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <Image
                  src="/placeholder.svg?height=600&width=600&text=Team+Photo"
                  alt="Soravio Team"
                  width={600}
                  height={600}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full border-4 border-black bg-[#FFE566] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex h-full w-full items-center justify-center">
                  <Globe className="h-16 w-16" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-[#FFE566] py-16">
        <div className="container">
          <div className="text-center">
            <div className="inline-block bg-black px-4 py-2 text-sm font-bold uppercase text-white">OUR VALUES</div>
            <h2 className="mt-4 text-4xl font-black uppercase tracking-tight">WHAT DRIVES US</h2>
            <div className="mx-auto mt-2 h-1 w-32 bg-black"></div>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <NeoCard title="Simplicity" color="blue">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <p>
                We believe staying connected should be simple. Our products and processes are designed to eliminate
                complexity.
              </p>
            </NeoCard>

            <NeoCard title="Transparency" color="yellow">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black">
                <Users className="h-8 w-8 text-white" />
              </div>
              <p>No hidden fees, no surprises. We're upfront about our pricing and what you get with each plan.</p>
            </NeoCard>

            <NeoCard title="Reliability" color="pink">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black">
                <Award className="h-8 w-8 text-white" />
              </div>
              <p>
                We partner with premium carriers to ensure you have reliable connectivity wherever your travels take
                you.
              </p>
            </NeoCard>

            <NeoCard title="Customer Focus" color="green">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black">
                <Target className="h-8 w-8 text-white" />
              </div>
              <p>
                Our customers are at the center of everything we do. We're constantly improving based on your feedback.
              </p>
            </NeoCard>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center">
            <div className="inline-block bg-black px-4 py-2 text-sm font-bold uppercase text-white">OUR TEAM</div>
            <h2 className="mt-4 text-4xl font-black uppercase tracking-tight">THE PEOPLE BEHIND SORAVIO</h2>
            <div className="mx-auto mt-2 h-1 w-32 bg-[#FF6666]"></div>
            <p className="mx-auto mt-6 max-w-2xl text-xl">
              Meet the passionate team of travelers, tech enthusiasts, and customer experience experts who make Soravio
              possible.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Alex Chen", role: "Founder & CEO", image: "/placeholder.svg?height=400&width=400&text=Alex" },
              { name: "Maria Rodriguez", role: "CTO", image: "/placeholder.svg?height=400&width=400&text=Maria" },
              {
                name: "David Kim",
                role: "Head of Partnerships",
                image: "/placeholder.svg?height=400&width=400&text=David",
              },
              {
                name: "Sarah Johnson",
                role: "Customer Experience",
                image: "/placeholder.svg?height=400&width=400&text=Sarah",
              },
              { name: "Raj Patel", role: "Product Manager", image: "/placeholder.svg?height=400&width=400&text=Raj" },
              {
                name: "Emma Wilson",
                role: "Marketing Director",
                image: "/placeholder.svg?height=400&width=400&text=Emma",
              },
            ].map((member, index) => (
              <NeoCard key={index} color={index % 3 === 0 ? "blue" : index % 3 === 1 ? "yellow" : "pink"}>
                <div className="aspect-square overflow-hidden border-4 border-black mb-4">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </NeoCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <NeoCard color="red" className="text-white">
            <div className="p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold md:text-4xl">Join Our Team</h2>
              <p className="mx-auto mt-4 max-w-2xl text-xl">
                We're always looking for passionate people to join our mission of connecting travelers around the world.
              </p>
              <div className="mt-8">
                <Link href="/careers">
                  <NeoButton color="white" size="lg">
                    View Open Positions
                  </NeoButton>
                </Link>
              </div>
            </div>
          </NeoCard>
        </div>
      </section>

      <NeoBanner color="black">GLOBAL CONNECTIVITY • SIMPLIFIED TRAVEL • RELIABLE SERVICE</NeoBanner>
    </div>
  )
}

