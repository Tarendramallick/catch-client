"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

export function OnboardingRedirect() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    const isOnboarded = localStorage.getItem("isOnboarded") === "true"

    if (pathname === "/login" || pathname === "/onboarding") {
      return
    }

    if (!isLoggedIn) {
      router.replace("/login")
    }
  }, [pathname, router])

  return null
}
