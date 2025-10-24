"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

export function OnboardingRedirect() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    const isOnboarded = localStorage.getItem("isOnboarded") === "true"

    console.log("OnboardingRedirect: pathname", pathname)
    console.log("OnboardingRedirect: isLoggedIn", isLoggedIn)
    console.log("OnboardingRedirect: isOnboarded", isOnboarded)

    if (pathname === "/login" || pathname === "/onboarding") {
      // Allow access to login and onboarding pages
      return
    }

    if (!isLoggedIn) {
      console.log("OnboardingRedirect: Not logged in, redirecting to /login")
      router.replace("/login")
    }
    // else if (!isOnboarded) { // Temporarily comment this out
    //   console.log("OnboardingRedirect: Logged in but not onboarded, redirecting to /onboarding")
    //   router.replace("/onboarding")
    // }
    else {
      console.log("OnboardingRedirect: Logged in and onboarded, allowing access.")
    }
  }, [pathname, router])

  return null
}
