"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    // Determine the current *actual* theme from the DOM
    const isCurrentlyDark = document.documentElement.classList.contains("dark")
    const newTheme = isCurrentlyDark ? "light" : "dark"

    console.log(`ThemeToggle: Attempting to toggle from "${isCurrentlyDark ? "dark" : "light"}" to "${newTheme}"`)

    // Let next-themes handle its internal state and localStorage
    setTheme(newTheme)

    // --- TEMPORARY WORKAROUND FOR V0 PREVIEW ---
    // Directly manipulate the HTML class to ensure immediate visual change and icon animation
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    // --- END TEMPORARY WORKAROUND ---

    // Add a small delay for debugging to see the state after theme change
    setTimeout(() => {
      console.log(`ThemeToggle: HTML classes after toggle: "${document.documentElement.className}"`)
      console.log(
        `ThemeToggle: Resolved theme from HTML class: "${document.documentElement.classList.contains("dark") ? "dark" : "light"}"`,
      )
    }, 100)
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {mounted ? (
        <>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </>
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
