import { toast } from "@/hooks/use-toast"

export async function handleApiResponse(response: Response, successMessage?: string) {
  const data = await response.json()

  if (data.success) {
    if (successMessage) {
      toast({
        title: "Success",
        description: successMessage,
      })
    }
    return data
  } else {
    toast({
      title: "Error",
      description: data.error || "An error occurred",
      variant: "destructive",
    })
    throw new Error(data.error || "API request failed")
  }
}

export async function apiRequest(url: string, options: RequestInit = {}, successMessage?: string) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    return await handleApiResponse(response, successMessage)
  } catch (error) {
    if (error instanceof Error && error.message !== "API request failed") {
      toast({
        title: "Network Error",
        description: "Failed to connect to server. Please try again.",
        variant: "destructive",
      })
    }
    throw error
  }
}
