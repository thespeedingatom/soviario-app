"use client"

import { useState } from "react"
import { NeoButton } from "@/components/ui/neo-button"
import { NeoCard } from "@/components/ui/neo-card"
import { NeoBanner } from "@/components/ui/neo-banner"
import { NeoInput } from "@/components/ui/neo-input"
import { NeoTag } from "@/components/ui/neo-tag"
import { Search, Plus, Minus } from "lucide-react"
import Link from "next/link"

// FAQ data
const faqData = [
  {
    category: "General",
    questions: [
      {
        question: "What is an eSIM?",
        answer:
          "An eSIM (embedded SIM) is a digital SIM that allows you to activate a cellular plan without having to use a physical SIM card. It's built into your device and can be programmed to connect to different networks.",
      },
      {
        question: "How does an eSIM work?",
        answer:
          "An eSIM works by storing your SIM card information digitally on your device. When you purchase an eSIM plan, you'll receive a QR code that you can scan with your device to download and activate the eSIM profile. Once activated, your device can connect to the mobile network just like with a physical SIM card.",
      },
      {
        question: "What are the advantages of using an eSIM?",
        answer:
          "eSIMs offer several advantages: no need to swap physical SIM cards when traveling, ability to have multiple plans on one device, no risk of losing or damaging a physical SIM, instant delivery and activation, and they're more environmentally friendly as they reduce plastic waste.",
      },
    ],
  },
  {
    category: "Compatibility",
    questions: [
      {
        question: "Is my device compatible with eSIM?",
        answer:
          "Most newer smartphones support eSIM, including iPhone XS and newer, Google Pixel 3 and newer, Samsung Galaxy S20 and newer, and many other recent models. Check your device specifications or visit our compatibility page for a complete list.",
      },
      {
        question: "Can I use an eSIM and a physical SIM at the same time?",
        answer:
          "Yes, most eSIM-compatible devices support Dual SIM Dual Standby (DSDS), which means you can use both an eSIM and a physical SIM simultaneously. This allows you to keep your regular number for calls and texts while using the eSIM for data.",
      },
      {
        question: "Do I need to unlock my phone to use an eSIM?",
        answer:
          "Yes, your device needs to be unlocked to use an eSIM from a different carrier. If your phone is locked to a specific carrier, you'll need to contact them to request an unlock before you can use our eSIM plans.",
      },
    ],
  },
  {
    category: "Plans & Pricing",
    questions: [
      {
        question: "How much data do I need for my trip?",
        answer:
          "The amount of data you need depends on your usage habits. For light usage (emails, messaging, maps), 1-3GB should be sufficient for a week. For moderate usage including social media and some streaming, 5GB is recommended. Heavy users who stream videos or use hotspot frequently should consider unlimited plans.",
      },
      {
        question: "Do your plans include calls and texts?",
        answer:
          "Our eSIM plans provide data connectivity only. You can use apps like WhatsApp, Telegram, FaceTime, or other VoIP services to make calls and send messages over data. Alternatively, you can keep your regular SIM card active for calls and texts.",
      },
      {
        question: "What happens if I use all my data before the plan expires?",
        answer:
          "If you exhaust your data allowance before your plan expires, you can purchase a top-up or a new plan from your account dashboard. Some of our unlimited plans will reduce speeds after you reach a certain threshold rather than cutting off service completely.",
      },
    ],
  },
  {
    category: "Activation & Usage",
    questions: [
      {
        question: "How do I activate my eSIM?",
        answer:
          "After purchase, you'll receive a QR code via email. On your device, go to Settings > Cellular/Mobile > Add Cellular/Mobile Plan, then scan the QR code. Follow the on-screen instructions to complete activation. We also provide detailed step-by-step guides for different device models.",
      },
      {
        question: "Can I share my eSIM data with other devices?",
        answer:
          "Yes, you can use your phone's hotspot feature to share your eSIM data connection with other devices like laptops or tablets. Keep in mind that this will consume your data more quickly.",
      },
      {
        question: "How long does it take to activate an eSIM?",
        answer:
          "eSIM activation is usually instant. Once you scan the QR code and follow the setup instructions, you should be connected within minutes. In rare cases, it might take up to an hour for the activation to complete.",
      },
    ],
  },
  {
    category: "Support & Troubleshooting",
    questions: [
      {
        question: "What if I have trouble activating my eSIM?",
        answer:
          "If you're having trouble activating your eSIM, first ensure your device is compatible and unlocked. Check that you're following the correct activation steps for your specific device model. If you still have issues, contact our customer support team via email, chat, or phone for assistance.",
      },
      {
        question: "Can I transfer my eSIM to another device?",
        answer:
          "eSIMs cannot be directly transferred between devices. If you get a new device, you'll need to deactivate your eSIM on the old device and activate it on the new one. In some cases, you may need to purchase a new eSIM plan. Contact our support team for assistance with this process.",
      },
      {
        question: "What should I do if I lose my device with an active eSIM?",
        answer:
          "If you lose your device with an active eSIM, contact our support team immediately. We can help you deactivate the eSIM to prevent unauthorized usage. You'll need to activate a new eSIM on your replacement device.",
      },
    ],
  },
]

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("General")
  const [searchQuery, setSearchQuery] = useState("")
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>({})

  const toggleQuestion = (question: string) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [question]: !prev[question],
    }))
  }

  const filteredFAQs = faqData.flatMap((category) =>
    category.questions
      .filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .map((q) => ({ ...q, category: category.category })),
  )

  const displayFAQs = searchQuery ? filteredFAQs : faqData.find((c) => c.category === activeCategory)?.questions || []

  return (
    <div className="flex flex-col">
      <NeoBanner color="yellow">FREQUENTLY ASKED QUESTIONS • HELP CENTER • SUPPORT</NeoBanner>

      {/* Hero Section */}
      <section className="bg-[#FFE566] py-16">
        <div className="container">
          <div className="text-center">
            <div className="inline-block bg-black px-4 py-2 text-sm font-bold uppercase text-white">HELP CENTER</div>
            <h1 className="mt-4 text-5xl font-black uppercase tracking-tight">FREQUENTLY ASKED QUESTIONS</h1>
            <div className="mx-auto mt-2 h-1 w-32 bg-black"></div>
            <p className="mx-auto mt-6 max-w-2xl text-xl">
              Find answers to common questions about eSIMs, our plans, activation process, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8">
        <div className="container">
          <div className="mx-auto max-w-2xl relative">
            <NeoInput
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              inputClassName="pr-12"
            />
            <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-8">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-4">
            {faqData.map((category) => (
              <NeoTag
                key={category.category}
                active={activeCategory === category.category && !searchQuery}
                onClick={() => {
                  setActiveCategory(category.category)
                  setSearchQuery("")
                }}
              >
                {category.category}
              </NeoTag>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-8">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            {searchQuery && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold">
                  Search Results: {filteredFAQs.length} {filteredFAQs.length === 1 ? "result" : "results"} found
                </h2>
              </div>
            )}

            {!searchQuery && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold">{activeCategory}</h2>
              </div>
            )}

            <div className="space-y-4">
              {displayFAQs.map((faq, index) => (
                <NeoCard key={index} className="overflow-hidden">
                  <button
                    className="flex w-full items-center justify-between p-4 text-left font-bold"
                    onClick={() => toggleQuestion(faq.question)}
                  >
                    <span>{faq.question}</span>
                    {openQuestions[faq.question] ? (
                      <Minus className="h-5 w-5 flex-shrink-0" />
                    ) : (
                      <Plus className="h-5 w-5 flex-shrink-0" />
                    )}
                  </button>

                  {openQuestions[faq.question] && (
                    <div className="border-t-2 border-black p-4">
                      <p>{faq.answer}</p>
                      {searchQuery && (
                        <div className="mt-2 text-sm text-muted-foreground">Category: {faq.category}</div>
                      )}
                    </div>
                  )}
                </NeoCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16">
        <div className="container">
          <NeoCard color="blue">
            <div className="p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold">Still Have Questions?</h2>
              <p className="mx-auto mt-4 max-w-2xl">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/contact">
                  <NeoButton size="lg">Contact Support</NeoButton>
                </Link>
                <Link href="/how-it-works">
                  <NeoButton variant="outline" size="lg">
                    How It Works
                  </NeoButton>
                </Link>
              </div>
            </div>
          </NeoCard>
        </div>
      </section>

      <NeoBanner color="black">24/7 SUPPORT • INSTANT ACTIVATION • GLOBAL COVERAGE</NeoBanner>
    </div>
  )
}

