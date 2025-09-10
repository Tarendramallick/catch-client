"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle } from "lucide-react"

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [companyName, setCompanyName] = useState("")
  const [companyLogoUrl, setCompanyLogoUrl] = useState("")
  const [purpose, setPurpose] = useState("")
  const router = useRouter()

  const handleNext = () => {
    if (step === 1) {
      if (companyName.trim() === "") {
        alert("Please enter your company name.")
        return
      }
      setStep(2)
    }
  }

  const handleFinish = () => {
    if (purpose === "") {
      alert("Please select what you will use CatchClients for.")
      return
    }
    // Save onboarding data (simulated)
    localStorage.setItem("companyName", companyName)
    localStorage.setItem("companyLogoUrl", companyLogoUrl)
    localStorage.setItem("userPurpose", purpose)
    localStorage.setItem("isOnboarded", "true")
    console.log("Onboarding complete. isOnboarded set to:", localStorage.getItem("isOnboarded")) // Debug log

    // Add a small delay before redirecting, just in case of a race condition in some environments
    setTimeout(() => {
      router.push("/dashboard") // Redirect to dashboard
    }, 50) // 50ms delay
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="h-12 w-12 mx-auto rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
            <span className="text-white font-bold text-lg">CC</span>
          </div>
          <CardTitle className="text-2xl">Welcome to CatchClients!</CardTitle>
          <CardDescription>Let's set up your account.</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-center">Step 1: Company Information</h3>
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  placeholder="Your Company Name"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-logo">Company Logo URL (Optional)</Label>
                <Input
                  id="company-logo"
                  placeholder="https://yourcompany.com/logo.png"
                  value={companyLogoUrl}
                  onChange={(e) => setCompanyLogoUrl(e.target.value)}
                />
              </div>
              <Button onClick={handleNext} className="w-full">
                Next
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-center">Step 2: What will you use CatchClients for?</h3>
              <RadioGroup value={purpose} onValueChange={setPurpose} className="grid grid-cols-2 gap-4">
                <Label
                  htmlFor="sales"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem id="sales" value="sales" className="sr-only" />
                  <CheckCircle
                    className={`mb-3 h-6 w-6 ${purpose === "sales" ? "text-primary" : "text-muted-foreground"}`}
                  />
                  Sales
                </Label>
                <Label
                  htmlFor="customer-success"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem id="customer-success" value="customer-success" className="sr-only" />
                  <CheckCircle
                    className={`mb-3 h-6 w-6 ${purpose === "customer-success" ? "text-primary" : "text-muted-foreground"}`}
                  />
                  Customer Success
                </Label>
                <Label
                  htmlFor="recruiting"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem id="recruiting" value="recruiting" className="sr-only" />
                  <CheckCircle
                    className={`mb-3 h-6 w-6 ${purpose === "recruiting" ? "text-primary" : "text-muted-foreground"}`}
                  />
                  Recruiting
                </Label>
                <Label
                  htmlFor="investing"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem id="investing" value="investing" className="sr-only" />
                  <CheckCircle
                    className={`mb-3 h-6 w-6 ${purpose === "investing" ? "text-primary" : "text-muted-foreground"}`}
                  />
                  Investing
                </Label>
              </RadioGroup>
              <Button onClick={handleFinish} className="w-full">
                Finish Setup
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
