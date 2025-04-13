import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { cookies } from "next/headers"; // Import cookies
import { saleorGetCurrentUser } from "@/domains/saleor/services/saleorApi"; // Adjust path if needed
import { AuthProvider } from "@/contexts/AuthContext"; // Adjust path if needed
import { Inter } from "next/font/google"
import { Analytics } from '@vercel/analytics/next';
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Soravio eSIM - Travel Connectivity Made Simple",
  description:
    "Get instant mobile data access worldwide with our eSIM plans. No physical SIM card needed.",
  generator: "v0.dev",
};

export default async function RootLayout({ // Make layout async
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("saleor-access-token")?.value;
  let userData = null;

  if (accessToken) {
    try {
      const userResult = await saleorGetCurrentUser(accessToken);
      // Ensure we access the nested 'me' property correctly
      userData = userResult.data?.me ?? null;
    } catch (error) {
      console.error("Failed to fetch user in RootLayout:", error);
      // Optionally clear invalid cookies here if error indicates token expiry
      // cookies().delete('saleor-access-token');
      // cookies().delete('saleor-refresh-token');
      userData = null;
    }
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider initialUser={userData}> {/* Wrap with AuthProvider */}
          <Providers>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Analytics />
              <Footer />
            </div>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}

// Removed duplicate import './globals.css'
