import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { OnboardingRedirect } from "@/components/onboarding-redirect"
import { MainLayoutContent } from "@/components/main-layout-content"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CatchClients - Smart CRM for Modern Teams",
  description: "Modern CRM platform to manage client relationships, track leads, and streamline sales operations",
    generator: 'tarendra-mallick.vercel.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light" // Start with light theme
          enableSystem={false} // Disable system preference for explicit control
          disableTransitionOnChange={false}
          storageKey="catchclients-theme" // Custom storage key for next-themes
          themes={["light", "dark"]} // Explicitly define themes
        >
          <OnboardingRedirect />
          <MainLayoutContent>{children}</MainLayoutContent>
        </ThemeProvider>
      </body>
    </html>
  )
}
