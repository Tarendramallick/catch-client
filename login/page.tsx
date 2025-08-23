"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const [showDemoCredentials, setShowDemoCredentials] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Demo authentication
    if (
      (email === "demo@catchclients.com" && password === "demo123") ||
      (email === "user@example.com" && password === "password")
    ) {
      // Store login state
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userEmail", email)
      localStorage.setItem("userName", email === "demo@catchclients.com" ? "Demo User" : "Test User")

      // Check if user needs onboarding
      const hasCompletedOnboarding = localStorage.getItem("isOnboarded") === "true"

      if (!hasCompletedOnboarding) {
        router.push("/onboarding")
      } else {
        router.push("/dashboard")
      }
    } else {
      setError("Invalid email or password. Please use the demo credentials.")
    }

    setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    setError("")
    setIsGoogleLoading(true)

    // Simulate Google OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Store login state
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("userEmail", "demo@catchclients.com")
    localStorage.setItem("userName", "Demo User")

    // Check if user needs onboarding
    const hasCompletedOnboarding = localStorage.getItem("isOnboarded") === "true"

    if (!hasCompletedOnboarding) {
      router.push("/onboarding")
    } else {
      router.push("/dashboard")
    }

    setIsGoogleLoading(false)
  }

  const handleForgotPassword = () => {
    setShowDemoCredentials(true)
  }

  const fillDemoCredentials = () => {
    setEmail("demo@catchclients.com")
    setPassword("demo123")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-3 sm:p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-3 sm:mb-4">
            <span className="text-xl sm:text-2xl font-bold text-white">CC</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CatchClients
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base px-2">Welcome back! Please sign in to your account.</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
          <CardHeader className="space-y-1 pb-4 px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl font-semibold text-center">Sign In</CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              Enter your credentials to access your CRM dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            {/* Demo Credentials Alert */}
            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <AlertDescription className="text-blue-800 text-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <strong>Demo Credentials:</strong>
                    <br className="sm:hidden" />
                    <span className="text-xs sm:text-sm">demo@catchclients.com / demo123</span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={fillDemoCredentials}
                    className="text-xs h-7 px-2 bg-blue-100 border-blue-300 hover:bg-blue-200"
                  >
                    Fill Demo
                  </Button>
                </div>
              </AlertDescription>
            </Alert>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
              </Alert>
            )}

            {showDemoCredentials && (
              <Alert className="border-green-200 bg-green-50">
                <AlertCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <AlertDescription className="text-green-800 text-sm">
                  <strong>Demo Accounts:</strong>
                  <br />• demo@catchclients.com / demo123
                  <br />• user@example.com / password
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 text-base"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                    autoComplete="email"
                    inputMode="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 text-base"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="px-0 text-sm text-blue-600 hover:text-blue-800 h-auto p-0 justify-start sm:justify-center"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-11 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent h-11 text-base"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Button variant="link" className="px-0 text-blue-600 hover:text-blue-800 h-auto p-0">
                Sign up
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500 px-4">
          <p>
            By signing in, you agree to our{" "}
            <Button variant="link" className="px-0 text-blue-600 hover:text-blue-800 text-xs sm:text-sm h-auto p-0">
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button variant="link" className="px-0 text-blue-600 hover:text-blue-800 text-xs sm:text-sm h-auto p-0">
              Privacy Policy
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}
