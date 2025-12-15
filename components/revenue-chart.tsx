"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import useSWR from "swr"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  const data = await res.json()
  return data.data || data
}

export function RevenueChart() {
  const { data: deals = [] } = useSWR("/api/deals", fetcher)

  const data = (() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()

    // Get last 6 months including current month
    const last6Months = []
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear
      last6Months.push({ monthIndex, year, name: months[monthIndex] })
    }

    return last6Months.map(({ monthIndex, year, name }) => {
      const closedWonDeals = deals.filter((deal: any) => {
        if (!deal) return false
        const stage = (deal.stage || "").toLowerCase().trim()
        if (stage !== "closed-won" && stage !== "closed won") return false

        const dealDate = new Date(deal.updatedAt || deal.updatedDate || deal.createdAt || deal.createdDate || "")
        return dealDate.getMonth() === monthIndex && dealDate.getFullYear() === year
      })

      const actualRevenue = closedWonDeals.reduce((sum: number, deal: any) => {
        const value = deal.value || deal.dealValue || 0
        return sum + (Number.isFinite(value) ? Number(value) : 0)
      }, 0)

      return {
        month: name,
        revenue: actualRevenue,
        dealCount: closedWonDeals.length,
      }
    })
  })()

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
            formatter={(value, name) => {
              if (name === "revenue") return [`$${value.toLocaleString()}`, "Revenue"]
              return [value, name]
            }}
            labelFormatter={(label) => `${label}`}
            contentStyle={{
              fontSize: "12px",
              padding: "8px",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
            }}
          />
          <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
