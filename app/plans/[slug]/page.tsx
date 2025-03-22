import Link from "next/link"
import Image from "next/image"
import { Check, Wifi, Clock, MapPin, Globe } from "lucide-react"
import { NeoButton } from "@/components/ui/neo-button"
import { NeoCard } from "@/components/ui/neo-card"
import { NeoBanner } from "@/components/ui/neo-banner"
import { NeoTabs } from "@/components/ui/neo-tabs"
import { fetchProductBySlug, fetchRelatedProducts } from "@/app/actions/product-actions"
import AddToCartButton from "@/components/add-to-cart-button"
import { notFound } from "next/navigation"

// Function to get the appropriate image based on region
const getRegionImage = (region: string) => {
  if (!region) return "/placeholder.svg?height=800&width=1200"

  const regionLower = region.toLowerCase()

  if (regionLower.includes("europe")) {
    return "/images/europe-bg.jpg"
  } else if (regionLower.includes("usa") || regionLower.includes("america")) {
    return "/images/america-bg.jpg"
  } else if (regionLower.includes("asia")) {
    return "/images/asia-bg.jpg"
  } else if (regionLower.includes("japan")) {
    return "/images/japan-bg.jpg"
  } else if (regionLower.includes("australia")) {
    return "/images/australia-bg.jpg"
  }

  // Default placeholder for other regions
  return `/placeholder.svg?height=800&width=1200&text=${region}`
}

export default async function PlanDetailPage({ params }: { params: { slug: string } }) {
  const plan = await fetchProductBySlug(params.slug)

  if (!plan) {
    notFound()
  }

  const imageSrc = getRegionImage(plan.region)
  let relatedProducts = []
  try {
    relatedProducts = await fetchRelatedProducts(plan.region, plan.slug)
  } catch (error) {
    console.error("Error fetching related products:", error)
  }

  // Ensure features and country_list are always arrays
  const features = plan.features || []
  const countryList = plan.country_list || []

  return (
    <div className="flex flex-col">
      <NeoBanner color="black">GLOBAL CONNECTIVITY • INSTANT ACTIVATION • TRAVEL ANYWHERE</NeoBanner>

      {/* Hero Section */}
      <section className="relative py-16 bg-muted">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={`${plan.region} background`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        <div className="container relative z-10">
          <div className="mb-8">
            <div className="inline-block bg-black px-4 py-2 text-sm font-bold uppercase text-white">
              {plan.region} PLAN
            </div>
            <h1 className="mt-4 text-5xl font-black uppercase tracking-tight text-white">{plan.name}</h1>
            <div className="mt-2 h-1 w-32 bg-white"></div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-xl text-white">{plan.description}</p>

              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="rounded-none border-4 border-black bg-white p-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Wifi className="mx-auto h-8 w-8 text-primary" />
                  <div className="mt-2 text-2xl font-bold">{plan.data_amount}</div>
                  <div className="text-sm font-medium">Data</div>
                </div>

                <div className="rounded-none border-4 border-black bg-white p-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Clock className="mx-auto h-8 w-8 text-primary" />
                  <div className="mt-2 text-2xl font-bold">{plan.duration}</div>
                  <div className="text-sm font-medium">Duration</div>
                </div>

                <div className="rounded-none border-4 border-black bg-white p-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <MapPin className="mx-auto h-8 w-8 text-primary" />
                  <div className="mt-2 text-2xl font-bold">{plan.countries}</div>
                  <div className="text-sm font-medium">Countries</div>
                </div>
              </div>
            </div>

            <div>
              <NeoCard color={plan.color as any}>
                <div className="p-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold uppercase">{plan.name}</h2>
                    <div className="mt-2 text-4xl font-black">${plan.price.toFixed(2)}</div>
                    <p className="mt-2 text-sm">One-time payment, no auto-renewal</p>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <span>{plan.data_amount} of high-speed data</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <span>Valid for {plan.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <span>Coverage in {plan.countries} countries</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <span>Instant delivery via email</span>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <AddToCartButton
                      product={{
                        id: plan.slug,
                        name: plan.name,
                        duration: plan.duration,
                        price: plan.price,
                        region: plan.region,
                        data: plan.data_amount,
                      }}
                    />

                    <Link href="/checkout" className="block w-full">
                      <NeoButton variant="outline" className="w-full" size="lg">
                        Buy Now
                      </NeoButton>
                    </Link>
                  </div>
                </div>
              </NeoCard>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Details Section */}
      <section className="py-16">
        <div className="container">
          <NeoTabs
            tabs={[
              {
                id: "details",
                label: "Plan Details",
                content: (
                  <div className="p-6">
                    <h2 className="text-2xl font-bold uppercase">Plan Details</h2>
                    <p className="mt-4">{plan.description}</p>

                    <h3 className="mt-8 text-xl font-bold uppercase">Features</h3>
                    <ul className="mt-4 space-y-4">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                            <Check className="h-5 w-5" />
                          </div>
                          <span className="text-lg">{feature}</span>
                        </li>
                      ))}
                      {features.length === 0 && (
                        <li className="text-muted-foreground">No specific features listed for this plan.</li>
                      )}
                    </ul>

                    <h3 className="mt-8 text-xl font-bold uppercase">How to Activate</h3>
                    <ol className="mt-4 space-y-6">
                      <li className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-none border-4 border-black bg-primary text-white font-bold">
                          1
                        </div>
                        <div>
                          <p className="font-bold">Purchase your eSIM</p>
                          <p className="text-muted-foreground">
                            Complete your purchase and receive an email with your eSIM details and QR code.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-none border-4 border-black bg-primary text-white font-bold">
                          2
                        </div>
                        <div>
                          <p className="font-bold">Scan the QR code</p>
                          <p className="text-muted-foreground">
                            Go to your phone's settings, find the eSIM or cellular settings, and scan the QR code.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-none border-4 border-black bg-primary text-white font-bold">
                          3
                        </div>
                        <div>
                          <p className="font-bold">Activate your plan</p>
                          <p className="text-muted-foreground">
                            Follow the on-screen instructions to complete the activation process.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-none border-4 border-black bg-primary text-white font-bold">
                          4
                        </div>
                        <div>
                          <p className="font-bold">Start using your data</p>
                          <p className="text-muted-foreground">
                            Once activated, you can start using your data immediately.
                          </p>
                        </div>
                      </li>
                    </ol>
                  </div>
                ),
              },
              {
                id: "coverage",
                label: "Coverage",
                content: (
                  <div className="p-6">
                    <h2 className="text-2xl font-bold uppercase">Coverage</h2>
                    <p className="mt-4">This plan provides coverage in the following {plan.countries} countries:</p>

                    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {countryList.map((country, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-none border-2 border-black bg-primary"></div>
                          <span>{country}</span>
                        </div>
                      ))}
                      {countryList.length === 0 && (
                        <div className="col-span-full text-muted-foreground">
                          Country list not available. Please contact support for details.
                        </div>
                      )}
                    </div>

                    <div className="mt-8 rounded-none border-4 border-black bg-muted p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <h3 className="text-xl font-bold uppercase">Network Information</h3>
                      <p className="mt-2">
                        Our eSIMs connect to premium local networks in each country to ensure the best possible coverage
                        and speeds. 4G/LTE is available in most urban areas, with 3G coverage in more remote locations.
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                id: "faq",
                label: "FAQ",
                content: (
                  <div className="p-6">
                    <h2 className="text-2xl font-bold uppercase">Frequently Asked Questions</h2>

                    <div className="mt-6 space-y-6">
                      <div className="rounded-none border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="text-xl font-bold">What happens if I run out of data?</h3>
                        <p className="mt-2 text-muted-foreground">
                          If you run out of data before your plan expires, you can purchase a top-up or a new plan from
                          your account dashboard.
                        </p>
                      </div>

                      <div className="rounded-none border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="text-xl font-bold">Can I use this eSIM for calls and texts?</h3>
                        <p className="mt-2 text-muted-foreground">
                          Our eSIMs provide data connectivity only. You can use apps like WhatsApp, Telegram, or
                          FaceTime for calls and messages over data.
                        </p>
                      </div>

                      <div className="rounded-none border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="text-xl font-bold">Can I share my data with other devices?</h3>
                        <p className="mt-2 text-muted-foreground">
                          Yes, you can use your phone's hotspot feature to share your eSIM data connection with other
                          devices like laptops or tablets.
                        </p>
                      </div>

                      <div className="rounded-none border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="text-xl font-bold">What if I have technical issues?</h3>
                        <p className="mt-2 text-muted-foreground">
                          Our customer support team is available 24/7 to help with any technical issues. You can contact
                          us via email, chat, or phone.
                        </p>
                      </div>
                    </div>
                  </div>
                ),
              },
            ]}
            defaultTab="details"
          />
        </div>
      </section>

      {/* Related Plans Section */}
      <section className="bg-muted py-16">
        <div className="container">
          <div className="mb-12">
            <div className="inline-block bg-black px-4 py-2 text-sm font-bold uppercase text-white">MORE OPTIONS</div>
            <h2 className="mt-4 text-4xl font-black uppercase tracking-tight">You Might Also Like</h2>
            <div className="mt-2 h-1 w-32 bg-primary"></div>
            <p className="mt-4 max-w-2xl text-xl">Check out these other plans for {plan.region}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {relatedProducts.map((relatedPlan) => (
              <NeoCard
                key={relatedPlan.id}
                title={relatedPlan.name}
                color={relatedPlan.color as any}
                link={`/plans/${relatedPlan.slug}`}
              >
                <div className="mb-4">
                  <p className="text-sm">{relatedPlan.duration}</p>
                  <div className="mt-2 text-3xl font-bold">${relatedPlan.price.toFixed(2)}</div>
                </div>
                <p className="text-sm">{relatedPlan.description}</p>
                <div className="mt-6">
                  <Link href={`/plans/${relatedPlan.slug}`}>
                    <NeoButton className="w-full">View Plan</NeoButton>
                  </Link>
                </div>
              </NeoCard>
            ))}
            {relatedProducts.length === 0 && (
              <div className="col-span-3 text-center py-8">
                <p className="text-muted-foreground">No related plans found for this region.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <div className="rounded-none border-4 border-black bg-primary p-8 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-12">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-3xl font-black uppercase md:text-4xl">Ready to Stay Connected?</h2>
                <p className="mt-4 text-xl">Get your eSIM now and enjoy seamless connectivity during your travels.</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <AddToCartButton
                    product={{
                      id: plan.slug,
                      name: plan.name,
                      duration: plan.duration,
                      price: plan.price,
                      region: plan.region,
                      data: plan.data_amount,
                    }}
                    buttonProps={{
                      color: "white",
                      size: "lg",
                    }}
                  />
                  <Link href="/plans">
                    <NeoButton variant="outline" color="white" size="lg">
                      Browse More Plans
                    </NeoButton>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-48 w-48">
                  <div className="absolute inset-0 rounded-full border-4 border-white bg-white bg-opacity-20 animate-pulse"></div>
                  <div className="absolute inset-8 rounded-full border-4 border-white bg-white bg-opacity-30 animate-pulse delay-300"></div>
                  <div className="absolute inset-16 rounded-full border-4 border-white bg-white bg-opacity-40 animate-pulse delay-500"></div>
                  <div className="absolute inset-24 rounded-full border-4 border-white flex items-center justify-center">
                    <Globe className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NeoBanner color="black">STAY CONNECTED ANYWHERE • GLOBAL CONNECTIVITY • INSTANT ACTIVATION</NeoBanner>
    </div>
  )
}

