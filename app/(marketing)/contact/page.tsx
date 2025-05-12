"use client"

import type React from "react"

import { useState } from "react"
import { NeoButton } from "@/components/ui/neo-button"
import { NeoCard } from "@/components/ui/neo-card"
import { NeoBanner } from "@/components/ui/neo-banner"
import { NeoInput } from "@/components/ui/neo-input"
import { NeoAlert } from "@/components/ui/neo-alert"
import { Mail, Phone, MessageSquare, MapPin, Send } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send the form data to your backend
    console.log("Form submitted:", formState)
    setFormSubmitted(true)

    // Reset form after submission
    setFormState({
      name: "",
      email: "",
      subject: "",
      message: "",
    })

    // Reset submission status after 5 seconds
    setTimeout(() => {
      setFormSubmitted(false)
    }, 5000)
  }

  return (
    <div className="flex flex-col">
      <NeoBanner color="pink">GET IN TOUCH • CUSTOMER SUPPORT • 24/7 ASSISTANCE</NeoBanner>

      {/* Hero Section */}
      <section className="bg-[#FFBDBD] py-16">
        <div className="container">
          <div className="text-center">
            <div className="inline-block bg-black px-4 py-2 text-sm font-bold uppercase text-white">CONTACT US</div>
            <h1 className="mt-4 text-5xl font-black uppercase tracking-tight">GET IN TOUCH</h1>
            <div className="mx-auto mt-2 h-1 w-32 bg-black"></div>
            <p className="mx-auto mt-6 max-w-2xl text-xl">
              Have questions or need assistance? Our team is here to help you stay connected around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <NeoCard color="blue">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Email Us</h3>
                <p className="mt-2">
                  <a href="mailto:support@soravio.com" className="hover:underline">
                    support@soravio.com
                  </a>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">We'll respond within 24 hours</p>
              </div>
            </NeoCard>

            <NeoCard color="yellow">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Call Us</h3>
                <p className="mt-2">
                  <a href="tel:+1234567890" className="hover:underline">
                    +1 (234) 567-890
                  </a>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Available 24/7 for urgent issues</p>
              </div>
            </NeoCard>

            <NeoCard color="green">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Live Chat</h3>
                <p className="mt-2">
                  <a href="#" className="hover:underline">
                    Start a Chat
                  </a>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Available 9am-9pm, 7 days a week</p>
              </div>
            </NeoCard>

            <NeoCard color="pink">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Office</h3>
                <p className="mt-2">
                  123 Connectivity Street
                  <br />
                  San Francisco, CA 94105
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Mon-Fri: 9am-5pm</p>
              </div>
            </NeoCard>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <NeoCard>
              <div className="p-8">
                <h2 className="text-3xl font-bold text-center">Send Us a Message</h2>
                <p className="mt-2 text-center text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>

                {formSubmitted && (
                  <div className="mt-6">
                    <NeoAlert variant="success" title="Message Sent" dismissible>
                      Thank you for your message! We'll respond to you shortly.
                    </NeoAlert>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <NeoInput label="Your Name" name="name" value={formState.name} onChange={handleChange} required />

                    <NeoInput
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <NeoInput label="Subject" name="subject" value={formState.subject} onChange={handleChange} required />

                  <div className="space-y-2">
                    <label htmlFor="message" className="block font-bold uppercase">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formState.message}
                      onChange={handleChange}
                      required
                      className="w-full border-4 border-black bg-white px-4 py-3 font-medium focus:outline-none"
                    ></textarea>
                  </div>

                  <div className="flex justify-center">
                    <NeoButton type="submit" size="lg">
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </NeoButton>
                  </div>
                </form>
              </div>
            </NeoCard>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">Find quick answers to common questions.</p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <NeoCard color="blue">
              <h3 className="text-xl font-bold">How do I activate my eSIM?</h3>
              <p className="mt-2">
                After purchase, you&apos;ll receive a QR code via email. On your device, go to Settings &gt;
                Cellular/Mobile &gt; Add Cellular/Mobile Plan, then scan the QR code. Follow the on-screen instructions
                to complete activation.
              </p>
            </NeoCard>

            <NeoCard color="yellow">
              <h3 className="text-xl font-bold">What if I need more data?</h3>
              <p className="mt-2">
                If you run out of data before your plan expires, you can purchase a top-up or a new plan from your
                account dashboard. Some of our unlimited plans will reduce speeds after you reach a certain threshold.
              </p>
            </NeoCard>

            <NeoCard color="green">
              <h3 className="text-xl font-bold">Is my device compatible?</h3>
              <p className="mt-2">
                Most newer smartphones support eSIM, including iPhone XS and newer, Google Pixel 3 and newer, Samsung
                Galaxy S20 and newer, and many other recent models. Check our compatibility page for details.
              </p>
            </NeoCard>

            <NeoCard color="pink">
              <h3 className="text-xl font-bold">How long does shipping take?</h3>
              <p className="mt-2">
                There's no shipping involved! eSIMs are delivered instantly to your email after purchase. You can
                activate your eSIM immediately by scanning the QR code we send you.
              </p>
            </NeoCard>
          </div>

          <div className="mt-12 text-center">
            <Link href="/faq">
              <NeoButton variant="outline" size="lg">
                View All FAQs
              </NeoButton>
            </Link>
          </div>
        </div>
      </section>

      <NeoBanner color="black">24/7 SUPPORT • INSTANT ACTIVATION • GLOBAL COVERAGE</NeoBanner>
    </div>
  )
}

