import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { OnboardingRedirect } from "@/components/onboarding-redirect"
import { MainLayoutContent } from "@/components/main-layout-content"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CatchClients - Smart CRM for Modern Teams",
  description: "Modern CRM platform to manage client relationships, track leads, and streamline sales operations",
  generator: "tarendra-mallick.vercel.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange={false}
            storageKey="catchclients-theme"
            themes={["light", "dark"]}
          >
            <OnboardingRedirect />
            <MainLayoutContent>{children}</MainLayoutContent>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
