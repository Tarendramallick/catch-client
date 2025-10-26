"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import useSWR from "swr"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  const data = await res.json()
  return data.data || data
}

export function PipelineChart() {
  const { data: deals = [] } = useSWR("/api/deals", fetcher)

  const data = (() => {
    const stages = [
      { id: "lead", name: "Lead", color: "#8884d8" },
      { id: "qualified", name: "Qualified", color: "#82ca9d" },
      { id: "proposal", name: "Proposal", color: "#ffc658" },
      { id: "negotiation", name: "Negotiation", color: "#ff7300" },
      // removed Closed Won from pipeline pie per request
    ]

    return stages
      .map((stage) => {
        const stageDeals = deals.filter((deal: any) => {
          const dealStage = (deal.stage || "").toLowerCase().replace(" ", "-")
          return dealStage === stage.id
        })

        const dealCount = stageDeals.length
        return {
          name: stage.name,
          value: dealCount, // count of deals
          dealCount,
          color: stage.color,
        }
      })
      .filter((stage) => stage.dealCount > 0)
  })()

  const fallbackData = [
    { name: "Lead", value: 2, dealCount: 2, color: "#8884d8" },
    { name: "Qualified", value: 1, dealCount: 1, color: "#82ca9d" },
    { name: "Proposal", value: 1, dealCount: 1, color: "#ffc658" },
    { name: "Negotiation", value: 1, dealCount: 1, color: "#ff7300" },
  ]

  const chartData = data.length > 0 ? data : fallbackData

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => {
              const entry = chartData.find((d) => d.name === name)
              return [`${value} deals`, name]
            }}
            contentStyle={{
              fontSize: "12px",
              padding: "8px",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
            }}
          />
          <Legend
            wrapperStyle={{
              fontSize: "12px",
              paddingTop: "10px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
