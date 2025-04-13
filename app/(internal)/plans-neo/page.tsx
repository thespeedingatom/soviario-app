import { NeoButton } from "@/components/ui/neo-button"
import { NeoBanner } from "@/components/ui/neo-banner"
import { NeoTabs } from "@/components/ui/neo-tabs"
import { ESIMGrid } from "@/components/esim-grid"
import Link from "next/link"

export default function PlansNeoPage() {
  const tabs = [
    {
      id: "europe",
      label: "Europe",
      content: <ESIMGrid region="europe" />,
    },
    {
      id: "usa",
      label: "USA",
      content: <ESIMGrid region="usa" />,
    },
    {
      id: "asia",
      label: "Asia",
      content: <ESIMGrid region="asia" />,
    },
    {
      id: "other",
      label: "Other Regions",
      content: <ESIMGrid region="other" />,
    },
  ]

  return (
    <div className="flex flex-col">
      <NeoBanner color="black">STAY CONNECTED ANYWHERE • GLOBAL COVERAGE • INSTANT ACTIVATION</NeoBanner>

      <section className="bg-[#FFE566] py-16">
        <div className="container">
          <div className="text-center">
            <div className="inline-block bg-black px-4 py-2 text-sm font-bold uppercase text-white">BROWSE PLANS</div>
            <h1 className="mt-4 text-5xl font-black uppercase tracking-tight">eSIM PLANS</h1>
            <div className="mx-auto mt-2 h-1 w-32 bg-black"></div>
            <p className="mx-auto mt-6 max-w-2xl text-xl">
              Browse our selection of eSIM plans for your next adventure. Stay connected anywhere in the world.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <NeoTabs tabs={tabs} defaultTab="europe" />

          <div className="mt-16 text-center">
            <Link href="/contact">
              <NeoButton size="lg">Need Help Choosing?</NeoButton>
            </Link>
          </div>
        </div>
      </section>

      <NeoBanner color="red">LIMITED TIME OFFER • 10% OFF ALL PLANS • USE CODE: TRAVEL10</NeoBanner>
    </div>
  )
}

