import Link from "next/link"
import { NeoButton } from "@/components/ui/neo-button"
import { NeoCard } from "@/components/ui/neo-card"
import { NeoBanner } from "@/components/ui/neo-banner"
import { NeoTabs } from "@/components/ui/neo-tabs"
import { Smartphone, QrCode, Wifi, ArrowRight } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col">
      <NeoBanner color="black">EASY SETUP • INSTANT ACTIVATION • GLOBAL COVERAGE</NeoBanner>

      {/* Hero Section */}
      <section className="bg-[#FFE566] py-16">
        <div className="container">
          <div className="text-center">
            <div className="inline-block bg-black px-4 py-2 text-sm font-bold uppercase text-white">GUIDE</div>
            <h1 className="mt-4 text-5xl font-black uppercase tracking-tight">HOW IT WORKS</h1>
            <div className="mx-auto mt-2 h-1 w-32 bg-black"></div>
            <p className="mx-auto mt-6 max-w-2xl text-xl">
              Getting connected with Soravio eSIMs is quick and easy. Follow these simple steps to stay connected
              anywhere in the world.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-none border-4 border-black bg-primary text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-4xl font-black">1</span>
              </div>
              <h2 className="mt-6 text-2xl font-bold uppercase">Choose a Plan</h2>
              <p className="mt-2 text-muted-foreground">
                Browse our selection of eSIM plans and choose the one that fits your travel needs.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-none border-4 border-black bg-secondary text-secondary-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-4xl font-black">2</span>
              </div>
              <h2 className="mt-6 text-2xl font-bold uppercase">Complete Purchase</h2>
              <p className="mt-2 text-muted-foreground">
                Pay securely online and receive your eSIM details instantly via email.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-none border-4 border-black bg-accent text-accent-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-4xl font-black">3</span>
              </div>
              <h2 className="mt-6 text-2xl font-bold uppercase">Scan QR Code</h2>
              <p className="mt-2 text-muted-foreground">
                Scan the QR code with your phone to add the eSIM to your device.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-none border-4 border-black bg-muted text-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-4xl font-black">4</span>
              </div>
              <h2 className="mt-6 text-2xl font-bold uppercase">Connect & Enjoy</h2>
              <p className="mt-2 text-muted-foreground">
                Activate your eSIM and start using data right away. No physical SIM card needed!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Instructions Section */}
      <section className="bg-[#B8E3FF] py-20">
        <div className="container">
          <div className="text-center">
            <div className="inline-block bg-black px-4 py-2 text-sm font-bold uppercase text-white">SETUP</div>
            <h2 className="mt-4 text-4xl font-black uppercase tracking-tight">DETAILED INSTRUCTIONS</h2>
            <div className="mx-auto mt-2 h-1 w-32 bg-black"></div>
            <p className="mx-auto mt-6 max-w-2xl text-xl">
              Follow these step-by-step instructions to get your eSIM up and running.
            </p>
          </div>

          <div className="mt-16">
            <NeoTabs
              tabs={[
                {
                  id: "iphone",
                  label: "iPhone",
                  content: (
                    <div className="p-6">
                      <div className="grid gap-12 md:grid-cols-2">
                        <div>
                          <h3 className="text-2xl font-bold uppercase">iPhone Installation</h3>
                          <p className="mt-2 text-muted-foreground">
                            Compatible with iPhone XS, XR, and newer models running iOS 12.1 or later.
                          </p>

                          <ol className="mt-6 space-y-6">
                            <li className="flex items-start gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-none border-4 border-black bg-primary text-white font-bold">
                                1
                              </div>
                              <div>
                                <p className="font-bold">Go to Settings</p>
                                <p className="text-muted-foreground">Open the Settings app on your iPhone.</p>
                              </div>
                            </li>
                            <li className="flex items-start gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-none border-4 border-black bg-primary text-white font-bold">
                                2
                              </div>
                              <div>
                                <p className="font-bold">Tap on Cellular/Mobile Data</p>
                                <p className="text-muted-foreground">
                                  Select "Cellular" or "Mobile Data" depending on your region.
                                </p>
                              </div>
                            </li>
                            <li className="flex items-start gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-none border-4 border-black bg-primary text-white font-bold">
                                3
                              </div>
                              <div>
                                <p className="font-bold">Add Cellular/Mobile Plan</p>
                                <p className="text-muted-foreground">
                                  Tap on "Add Cellular Plan" or "Add Mobile Plan".
                                </p>
                              </div>
                            </li>
                            <li className="flex items-start gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-none border-4 border-black bg-primary text-white font-bold">
                                4
                              </div>
                              <div>
                                <p className="font-bold">Scan QR Code</p>
                                <p className="text-muted-foreground">
                                  Use your iPhone to scan the QR code we sent to your email.
                                </p>
                              </div>
                            </li>
                            <li className="flex items-start gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-none border-4 border-black bg-primary text-white font-bold">
                                5
                              </div>
                              <div>
                                <p className="font-bold">Confirm and Activate</p>
                                <p className="text-muted-foreground">
                                  Follow the on-screen instructions to complete the setup.
                                </p>
                              </div>
                            </li>
                          </ol>
                        </div>

                        <div className="flex items-center justify-center">
                          <div className="relative h-[500px] w-[250px] rounded-none border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black rounded-b-xl"></div>
                            <div className="h-full w-full bg-muted rounded-none border-2 border-black p-4 flex flex-col">
                              <div className="text-center text-sm font-bold mb-4 uppercase">Settings</div>
                              <div className="flex items-center p-2 bg-white rounded-none border-2 border-black mb-2">
                                <div className="w-8 h-8 rounded-none border-2 border-black bg-primary flex items-center justify-center text-white">
                                  <Smartphone className="h-4 w-4" />
                                </div>
                                <span className="ml-2 font-bold">Cellular</span>
                                <div className="ml-auto font-bold">›</div>
                              </div>
                              <div className="flex items-center p-2 bg-white rounded-none border-2 border-black mb-2">
                                <div className="w-8 h-8 rounded-none border-2 border-black bg-secondary flex items-center justify-center">
                                  <QrCode className="h-4 w-4" />
                                </div>
                                <span className="ml-2 font-bold">Add eSIM</span>
                                <div className="ml-auto font-bold">›</div>
                              </div>
                              <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="mx-auto w-32 h-32 rounded-none border-4 border-black bg-white p-2 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <QrCode className="h-24 w-24" />
                                  </div>
                                  <div className="mt-4 text-sm font-bold uppercase">Scan QR Code</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: "android",
                  label: "Android",
                  content: (
                    <div className="p-6">
                      <div className="grid gap-12 md:grid-cols-2">
                        <div>
                          <h3 className="text-2xl font-bold uppercase">Android Installation</h3>
                          <p className="mt-2 text-muted-foreground">
                            Compatible with Samsung Galaxy S20, Google Pixel 3, and newer models running Android 10 or
                            later.
                          </p>

                          <ol className="mt-6 space-y-6">
                            <li className="flex items-start gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-none border-4 border-black bg-primary text-white font-bold">
                                1
                              </div>
                              <div>
                                <p className="font-bold">Go to Settings</p>
                                <p className="text-muted-foreground">Open the Settings app on your Android device.</p>
                              </div>
                            </li>
                            <li className="flex items-start gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-none border-4 border-black bg-primary text-white font-bold">
                                2
                              </div>
                              <div>
                                <p className="font-bold">Tap on Connections</p>
                                <p className="text-muted-foreground">
                                  Select "Connections" or "Network & Internet" depending on your device.
                                </p>
                              </div>
                            </li>
                            <li className="flex items-start gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-none border-4 border-black bg-primary text-white font-bold">
                                3
                              </div>
                              <div>
                                <p className="font-bold">Mobile Networks/SIM Manager</p>
                                <p className="text-muted-foreground">
                                  Tap on "Mobile Networks", "SIM Manager", or "SIM Card Manager".
                                </p>
                              </div>
                            </li>
                            <li className="flex items-start gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-none border-4 border-black bg-primary text-white font-bold">
                                4
                              </div>
                              <div>
                                <p className="font-bold">Add Mobile Plan</p>
                                <p className="text-muted-foreground">
                                  Look for "Add Mobile Plan", "Download SIM", or "+ Add eSIM".
                                </p>
                              </div>
                            </li>
                            <li className="flex items-start gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-none border-4 border-black bg-primary text-white font-bold">
                                5
                              </div>
                              <div>
                                <p className="font-bold">Scan QR Code</p>
                                <p className="text-muted-foreground">
                                  Use your Android device to scan the QR code we sent to your email.
                                </p>
                              </div>
                            </li>
                            <li className="flex items-start gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-none border-4 border-black bg-primary text-white font-bold">
                                6
                              </div>
                              <div>
                                <p className="font-bold">Confirm and Activate</p>
                                <p className="text-muted-foreground">
                                  Follow the on-screen instructions to complete the setup.
                                </p>
                              </div>
                            </li>
                          </ol>
                        </div>

                        <div className="flex items-center justify-center">
                          <div className="relative h-[500px] w-[250px] rounded-none border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <div className="h-full w-full bg-muted rounded-none border-2 border-black p-4 flex flex-col">
                              <div className="text-center text-sm font-bold mb-4 uppercase">Settings</div>
                              <div className="flex items-center p-2 bg-white rounded-none border-2 border-black mb-2">
                                <div className="w-8 h-8 rounded-none border-2 border-black bg-accent flex items-center justify-center">
                                  <Wifi className="h-4 w-4" />
                                </div>
                                <span className="ml-2 font-bold">Connections</span>
                                <div className="ml-auto font-bold">›</div>
                              </div>
                              <div className="flex items-center p-2 bg-white rounded-none border-2 border-black mb-2">
                                <div className="w-8 h-8 rounded-none border-2 border-black bg-secondary flex items-center justify-center">
                                  <Smartphone className="h-4 w-4" />
                                </div>
                                <span className="ml-2 font-bold">SIM Manager</span>
                                <div className="ml-auto font-bold">›</div>
                              </div>
                              <div className="flex items-center p-2 bg-white rounded-none border-2 border-black mb-2">
                                <div className="w-8 h-8 rounded-none border-2 border-black bg-primary flex items-center justify-center text-white">
                                  <QrCode className="h-4 w-4" />
                                </div>
                                <span className="ml-2 font-bold">Add eSIM</span>
                                <div className="ml-auto font-bold">›</div>
                              </div>
                              <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="mx-auto w-32 h-32 rounded-none border-4 border-black bg-white p-2 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <QrCode className="h-24 w-24" />
                                  </div>
                                  <div className="mt-4 text-sm font-bold uppercase">Scan QR Code</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: "other",
                  label: "Other Devices",
                  content: (
                    <div className="p-6">
                      <h3 className="text-2xl font-bold uppercase">Other eSIM Compatible Devices</h3>
                      <p className="mt-2 text-muted-foreground">
                        Many newer tablets, smartwatches, and laptops also support eSIM technology.
                      </p>

                      <div className="mt-8 grid gap-8 md:grid-cols-2">
                        <NeoCard color="blue">
                          <h4 className="text-xl font-bold uppercase">iPad Installation</h4>
                          <p className="mt-2 text-muted-foreground">
                            Compatible with iPad Pro, iPad Air, and iPad Mini models with cellular capability released
                            after 2018.
                          </p>
                          <ol className="mt-4 space-y-2">
                            <li className="flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-none border-2 border-black bg-primary text-white font-bold">
                                1
                              </div>
                              <span>
                                Go to Settings {">"} Cellular Data {">"} Add Cellular Plan
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-none border-2 border-black bg-primary text-white font-bold">
                                2
                              </div>
                              <span>Scan the QR code we sent to your email</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-none border-2 border-black bg-primary text-white font-bold">
                                3
                              </div>
                              <span>Follow the on-screen instructions to complete setup</span>
                            </li>
                          </ol>
                        </NeoCard>

                        <NeoCard color="yellow">
                          <h4 className="text-xl font-bold uppercase">Windows Laptops with eSIM</h4>
                          <p className="mt-2 text-muted-foreground">
                            Compatible with select Windows laptops like Surface Pro X, HP Spectre, and Lenovo ThinkPad.
                          </p>
                          <ol className="mt-4 space-y-2">
                            <li className="flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-none border-2 border-black bg-secondary text-secondary-foreground font-bold">
                                1
                              </div>
                              <span>
                                Go to Settings {">"} Network & Internet {">"} Cellular
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-none border-2 border-black bg-secondary text-secondary-foreground font-bold">
                                2
                              </div>
                              <span>Click on "Add a new eSIM" or "Set up a new data plan"</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-none border-2 border-black bg-secondary text-secondary-foreground font-bold">
                                3
                              </div>
                              <span>Scan the QR code we sent to your email</span>
                            </li>
                          </ol>
                        </NeoCard>
                      </div>

                      <div className="mt-8 rounded-none border-4 border-black bg-muted p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h4 className="text-xl font-bold uppercase">Need Help?</h4>
                        <p className="mt-2">
                          If you're having trouble installing your eSIM, our customer support team is here to help.
                          Contact us via email, chat, or phone for assistance.
                        </p>
                        <div className="mt-4">
                          <Link href="/contact">
                            <NeoButton>Contact Support</NeoButton>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ),
                },
              ]}
              defaultTab="iphone"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center">
            <div className="inline-block bg-black px-4 py-2 text-sm font-bold uppercase text-white">HELP</div>
            <h2 className="mt-4 text-4xl font-black uppercase tracking-tight">FREQUENTLY ASKED QUESTIONS</h2>
            <div className="mx-auto mt-2 h-1 w-32 bg-black"></div>
            <p className="mx-auto mt-6 max-w-2xl text-xl">Got questions? We've got answers.</p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <NeoCard color="blue">
              <h3 className="text-xl font-bold uppercase">What is an eSIM?</h3>
              <p className="mt-2 text-muted-foreground">
                An eSIM (embedded SIM) is a digital SIM that allows you to activate a cellular plan without having to
                use a physical SIM card. It's built into your device and can be programmed to connect to different
                networks.
              </p>
            </NeoCard>

            <NeoCard color="yellow">
              <h3 className="text-xl font-bold uppercase">Is my device compatible with eSIM?</h3>
              <p className="mt-2 text-muted-foreground">
                Most newer smartphones support eSIM, including iPhone XS and newer, Google Pixel 3 and newer, Samsung
                Galaxy S20 and newer, and many other recent models. Check your device specifications or visit our
                compatibility page.
              </p>
            </NeoCard>

            <NeoCard color="pink">
              <h3 className="text-xl font-bold uppercase">Can I use my phone number with an eSIM?</h3>
              <p className="mt-2 text-muted-foreground">
                Our eSIMs provide data connectivity only. You can keep your regular SIM card in your phone for calls and
                texts, or use apps like WhatsApp, Telegram, or FaceTime for communication over data.
              </p>
            </NeoCard>

            <NeoCard color="green">
              <h3 className="text-xl font-bold uppercase">What happens if I run out of data?</h3>
              <p className="mt-2 text-muted-foreground">
                If you run out of data before your plan expires, you can purchase a top-up or a new plan from your
                account dashboard. Some plans also offer reduced speeds after your high-speed data is used up.
              </p>
            </NeoCard>

            <NeoCard color="purple">
              <h3 className="text-xl font-bold uppercase">Can I share my eSIM data with other devices?</h3>
              <p className="mt-2 text-muted-foreground">
                Yes, you can use your phone's hotspot feature to share your eSIM data connection with other devices like
                laptops or tablets.
              </p>
            </NeoCard>

            <NeoCard color="blue">
              <h3 className="text-xl font-bold uppercase">How long does it take to activate an eSIM?</h3>
              <p className="mt-2 text-muted-foreground">
                eSIM activation is usually instant. Once you scan the QR code and follow the setup instructions, you
                should be connected within minutes.
              </p>
            </NeoCard>
          </div>

          <div className="mt-12 text-center">
            <Link href="/faq">
              <NeoButton variant="outline" size="lg" className="rounded-none border-4 border-black text-lg">
                View All FAQs
                <ArrowRight className="ml-2 h-5 w-5" />
              </NeoButton>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 text-white">
        <div className="container">
          <div className="rounded-none border-4 border-black bg-primary p-8 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-12">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-3xl font-black uppercase md:text-4xl">READY TO STAY CONNECTED?</h2>
                <p className="mt-4 text-xl">Browse our selection of eSIM plans and get connected in minutes.</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/plans">
                    <NeoButton color="white" size="lg">
                      Browse Plans
                    </NeoButton>
                  </Link>
                  <Link href="/contact">
                    <NeoButton variant="outline" color="white" size="lg">
                      Contact Support
                    </NeoButton>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-48 w-48">
                  <div className="absolute inset-0 rounded-none border-4 border-white bg-white bg-opacity-20 animate-pulse"></div>
                  <div className="absolute inset-8 rounded-none border-4 border-white bg-white bg-opacity-30 animate-pulse delay-300"></div>
                  <div className="absolute inset-16 rounded-none border-4 border-white bg-white bg-opacity-40 animate-pulse delay-500"></div>
                  <div className="absolute inset-24 rounded-none border-4 border-white flex items-center justify-center">
                    <QrCode className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NeoBanner color="black">EASY SETUP • INSTANT ACTIVATION • GLOBAL COVERAGE</NeoBanner>
    </div>
  )
}

