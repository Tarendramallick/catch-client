"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useEffect, useState } from "react"

// Generate dynamic revenue data based on deals
const getDynamicRevenueData = () => {
  if (typeof window !== "undefined") {
    const dealsData = localStorage.getItem("catchclients-deals")
    if (dealsData) {
      try {
        const deals = JSON.parse(dealsData)
        const closedWonDeals = deals.filter((deal: any) => deal.stage === "closed-won")

        // Generate monthly revenue based on closed deals
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
        const currentMonth = new Date().getMonth()

        return months.map((month, index) => {
          let revenue = 45000 + Math.random() * 20000 // Base revenue

          // Add revenue from closed deals for current and recent months
          if (index <= currentMonth) {
            const monthDeals = closedWonDeals.filter((deal: any) => {
              const dealDate = new Date(deal.lastUpdated || deal.createdDate)
              return dealDate.getMonth() === index
            })

            const dealRevenue = monthDeals.reduce((sum: number, deal: any) => sum + deal.value, 0)
            revenue += dealRevenue
          }

          return {
            month,
            revenue: Math.round(revenue),
          }
        })
      } catch (error) {
        console.error("Error parsing deals data:", error)
      }
    }
  }

  // Fallback data
  return [
    { month: "Jan", revenue: 45000 },
    { month: "Feb", revenue: 52000 },
    { month: "Mar", revenue: 48000 },
    { month: "Apr", revenue: 61000 },
    { month: "May", revenue: 55000 },
    { month: "Jun", revenue: 67000 },
  ]
}

export function RevenueChart() {
  const [data, setData] = useState(getDynamicRevenueData())

  useEffect(() => {
    const updateData = () => {
      setData(getDynamicRevenueData())
    }

    updateData()

    // Listen for storage changes
    const handleStorageChange = () => {
      updateData()
    }

    window.addEventListener("storage", handleStorageChange)
    const interval = setInterval(updateData, 5000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" fontSize={12} tickMargin={5} />
          <YAxis fontSize={12} tickMargin={5} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
            contentStyle={{
              fontSize: "12px",
              padding: "8px",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
            }}
          />
          <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
