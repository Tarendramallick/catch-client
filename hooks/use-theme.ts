"use client"

import { useEffect, useState } from "react"

export function useTheme() {
  const [theme, setThemeState] = useState<string | undefined>(undefined)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedTheme = localStorage.getItem("catchclients-theme") || "light"
    setThemeState(storedTheme)
  }, [])

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme)
    localStorage.setItem("catchclients-theme", newTheme)

    const htmlElement = document.documentElement
    htmlElement.classList.remove("light", "dark")
    if (newTheme !== "light") {
      htmlElement.classList.add(newTheme)
    }
  }

  return {
    theme: mounted ? theme : undefined,
    setTheme,
    mounted,
  }
}
