"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useEffect, useState } from "react"

export function RevenueChart() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/analytics?metric=revenue")
        const result = await response.json()

        if (result.success && result.data?.monthly) {
          setData(result.data.monthly)
        } else {
          // Fallback data if API fails
          setData([
            { month: "Jan", value: 45000 },
            { month: "Feb", value: 52000 },
            { month: "Mar", value: 48000 },
            { month: "Apr", value: 61000 },
            { month: "May", value: 55000 },
            { month: "Jun", value: 67000 },
          ])
        }
      } catch (error) {
        console.error("Error fetching revenue data:", error)
        // Fallback data on error
        setData([
          { month: "Jan", value: 45000 },
          { month: "Feb", value: 52000 },
          { month: "Mar", value: 48000 },
          { month: "Apr", value: 61000 },
          { month: "May", value: 55000 },
          { month: "Jun", value: 67000 },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchRevenueData()

    // Refresh data every 30 seconds
    const interval = setInterval(fetchRevenueData, 30000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading revenue data...</div>
      </div>
    )
  }

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
          <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
