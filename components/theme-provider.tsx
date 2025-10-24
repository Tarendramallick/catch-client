"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
  storageKey?: string
  themes?: string[]
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "light",
  enableSystem = false,
  disableTransitionOnChange = false,
  storageKey = "theme",
  themes = ["light", "dark"],
}: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<string | undefined>(undefined)

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true)

    // Get theme from localStorage or use default
    const storedTheme = localStorage.getItem(storageKey)
    const initialTheme = storedTheme || defaultTheme

    setTheme(initialTheme)

    // Apply theme to document
    if (attribute === "class") {
      const htmlElement = document.documentElement
      htmlElement.classList.remove(...themes)
      if (initialTheme !== "light") {
        htmlElement.classList.add(initialTheme)
      }
    }
  }, [])

  // Update theme when it changes
  useEffect(() => {
    if (!mounted || !theme) return

    localStorage.setItem(storageKey, theme)

    if (attribute === "class") {
      const htmlElement = document.documentElement
      htmlElement.classList.remove(...themes)
      if (theme !== "light") {
        htmlElement.classList.add(theme)
      }
    }
  }, [theme, mounted, attribute, themes, storageKey])

  if (!mounted) {
    return <>{children}</>
  }

  return <>{children}</>
}
