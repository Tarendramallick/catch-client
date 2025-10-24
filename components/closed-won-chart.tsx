"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface Deal {
  id: string
  stage: string
  value: number
  closeDate: string
  lastUpdated: string
}

interface ClosedWonChartProps {
  deals: Deal[]
}

export function ClosedWonChart({ deals }: ClosedWonChartProps) {
  // Get last 6 months
  const months = []
  for (let i = 5; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    months.push({
      month: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      monthKey: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
    })
  }

  const closedWonDeals = deals.filter((deal) => deal.stage === "Closed Won")

  const chartData = months.map(({ month, monthKey }) => {
    const monthDeals = closedWonDeals.filter((deal) => {
      const dealDate = new Date(deal.lastUpdated || deal.closeDate)
      const dealMonthKey = `${dealDate.getFullYear()}-${String(dealDate.getMonth() + 1).padStart(2, "0")}`
      return dealMonthKey === monthKey
    })

    const monthlyRevenue = monthDeals.reduce((sum, deal) => sum + deal.value, 0)

    return {
      month,
      revenue: monthlyRevenue,
      deals: monthDeals.length,
      cumulative: 0, // Will be calculated below
    }
  })

  // Calculate cumulative revenue
  let cumulativeSum = 0
  chartData.forEach((data) => {
    cumulativeSum += data.revenue
    data.cumulative = cumulativeSum
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Closed Won Value Over Time</CardTitle>
        <CardDescription>Monthly revenue from closed won deals</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            revenue: {
              label: "Monthly Revenue",
              color: "hsl(var(--chart-1))",
            },
            cumulative: {
              label: "Cumulative Revenue",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[250px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={60} interval={0} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} width={50} />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-blue-600">Monthly: ${data.revenue.toLocaleString()}</p>
                        <p className="text-sm text-green-600">Cumulative: ${data.cumulative.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Deals: {data.deals}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Monthly Revenue"
              />
              <Line
                type="monotone"
                dataKey="cumulative"
                stroke="var(--color-cumulative)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
                name="Cumulative Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
