"use client"

import { useState } from "react"
import { NeoCard } from "@/components/ui/neo-card"
import { NeoButton } from "@/components/ui/neo-button"
import { NeoBadge } from "@/components/ui/neo-badge"
import { NeoTag } from "@/components/ui/neo-tag"
import { NeoAlert } from "@/components/ui/neo-alert"
import { NeoInput } from "@/components/ui/neo-input"
import { NeoTabs } from "@/components/ui/neo-tabs"
import { NeoBanner } from "@/components/ui/neo-banner"
import { NeoGrid } from "@/components/ui/neo-grid"
import { ShoppingCart, Wifi, Clock, MapPin } from "lucide-react"

export default function UIExamples() {
  const [activeTag, setActiveTag] = useState("Europe")

  const tabs = [
    {
      id: "cards",
      label: "Cards",
      content: (
        <div>
          <h2 className="mb-6 text-2xl font-bold">eSIM Plan Cards</h2>
          <NeoGrid>
            <NeoCard
              title="Europe 3GB"
              description="Ideal for travelers needing moderate data across multiple European countries."
              imageSrc="/placeholder.svg?height=400&width=600"
              imageAlt="Europe eSIM"
              tags={["30 Days", "36 Countries", "4G/LTE"]}
              link="/plans/europe-3gb-30days"
              color="blue"
            >
              <div className="mb-4 text-2xl font-bold">$5.63</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  <span className="text-sm">3GB Data</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">30 Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">36 Countries</span>
                </div>
              </div>
            </NeoCard>

            <NeoCard
              title="USA 5GB"
              description="For users needing more data for navigation, social media, or work."
              imageSrc="/placeholder.svg?height=400&width=600"
              imageAlt="USA eSIM"
              tags={["30 Days", "All States", "4G/LTE"]}
              link="/plans/usa-5gb-30days"
              color="yellow"
            >
              <div className="mb-4 text-2xl font-bold">$8.46</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  <span className="text-sm">5GB Data</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">30 Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">All 50 States</span>
                </div>
              </div>
            </NeoCard>

            <NeoCard
              title="Asia 3GB"
              description="Covers multiple Asian countries, ideal for regional travelers."
              imageSrc="/placeholder.svg?height=400&width=600"
              imageAlt="Asia eSIM"
              tags={["30 Days", "14 Countries", "4G/LTE"]}
              link="/plans/asia-3gb-30days"
              color="pink"
              classified
            >
              <div className="mb-4 text-2xl font-bold">$8.86</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  <span className="text-sm">3GB Data</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">30 Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">14 Countries</span>
                </div>
              </div>
            </NeoCard>
          </NeoGrid>
        </div>
      ),
    },
    {
      id: "buttons",
      label: "Buttons",
      content: (
        <div>
          <h2 className="mb-6 text-2xl font-bold">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <NeoButton>Primary Button</NeoButton>
            <NeoButton color="secondary">Secondary</NeoButton>
            <NeoButton color="accent">Accent</NeoButton>
            <NeoButton color="black">Black</NeoButton>
            <NeoButton variant="outline">Outline</NeoButton>
            <NeoButton variant="ghost">Ghost</NeoButton>
            <NeoButton variant="link">Link</NeoButton>
            <NeoButton size="sm">Small</NeoButton>
            <NeoButton size="lg">Large</NeoButton>
            <NeoButton>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </NeoButton>
          </div>
        </div>
      ),
    },
    {
      id: "badges",
      label: "Badges & Tags",
      content: (
        <div>
          <h2 className="mb-6 text-2xl font-bold">Badges</h2>
          <div className="flex flex-wrap gap-4">
            <NeoBadge>Default</NeoBadge>
            <NeoBadge color="red">Red</NeoBadge>
            <NeoBadge color="blue">Blue</NeoBadge>
            <NeoBadge color="green">Green</NeoBadge>
            <NeoBadge color="yellow">Yellow</NeoBadge>
            <NeoBadge color="purple">Purple</NeoBadge>
            <NeoBadge variant="outline">Outline</NeoBadge>
            <NeoBadge variant="outline" color="red">
              Red Outline
            </NeoBadge>
            <NeoBadge size="sm">Small</NeoBadge>
            <NeoBadge size="lg">Large</NeoBadge>
          </div>

          <h2 className="mb-6 mt-8 text-2xl font-bold">Tags</h2>
          <div className="flex flex-wrap gap-4">
            {["Europe", "USA", "Asia", "Australia"].map((region) => (
              <NeoTag key={region} active={activeTag === region} onClick={() => setActiveTag(region)}>
                {region}
              </NeoTag>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "alerts",
      label: "Alerts",
      content: (
        <div>
          <h2 className="mb-6 text-2xl font-bold">Alerts</h2>
          <div className="space-y-4">
            <NeoAlert variant="info" title="Information">
              Your eSIM has been successfully activated.
            </NeoAlert>

            <NeoAlert variant="success" title="Success">
              Your order has been completed. Check your email for eSIM details.
            </NeoAlert>

            <NeoAlert variant="warning" title="Warning">
              Your data usage is at 80%. Consider upgrading your plan.
            </NeoAlert>

            <NeoAlert variant="error" title="Error" dismissible>
              Payment failed. Please check your payment details and try again.
            </NeoAlert>
          </div>
        </div>
      ),
    },
    {
      id: "inputs",
      label: "Inputs",
      content: (
        <div>
          <h2 className="mb-6 text-2xl font-bold">Inputs</h2>
          <div className="space-y-6">
            <NeoInput label="Email Address" placeholder="Enter your email" type="email" />

            <NeoInput label="Password" placeholder="Enter your password" type="password" />

            <NeoInput label="Username" placeholder="Enter your username" error="Username is already taken" />

            <div className="grid gap-6 md:grid-cols-2">
              <NeoInput label="First Name" placeholder="Enter your first name" />

              <NeoInput label="Last Name" placeholder="Enter your last name" />
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-8 py-8">
      <NeoBanner color="red">ACTIVE SURVEILLANCE • CLASSIFIED INFORMATION • ACTIVE SURVEILLANCE</NeoBanner>

      <div className="container">
        <div className="mb-8">
          <div className="inline-block bg-black px-4 py-2 text-sm font-bold uppercase text-white">CLASSIFIED</div>
          <h1 className="mt-4 text-5xl font-black uppercase tracking-tight">NEOBRUTALIST UI COMPONENTS</h1>
          <div className="mt-2 h-1 w-32 bg-red-600"></div>
        </div>

        <NeoTabs tabs={tabs} defaultTab="cards" />
      </div>
    </div>
  )
}

