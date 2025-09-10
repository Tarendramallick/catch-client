"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useEffect, useState } from "react"

// Get dynamic pipeline data from deals
const getDynamicPipelineData = () => {
  // This simulates getting data from the deals page
  // In a real app, this would come from a global state or context
  if (typeof window !== "undefined") {
    const dealsData = localStorage.getItem("catchclients-deals")
    if (dealsData) {
      try {
        const deals = JSON.parse(dealsData)
        const stages = [
          { id: "lead", name: "Lead", color: "#8884d8" },
          { id: "qualified", name: "Qualified", color: "#82ca9d" },
          { id: "proposal", name: "Proposal", color: "#ffc658" },
          { id: "negotiation", name: "Negotiation", color: "#ff7300" },
          { id: "closed-won", name: "Closed Won", color: "#00ff00" },
        ]

        return stages
          .map((stage) => {
            const stageDeals = deals.filter((deal: any) => deal.stage === stage.id)
            return {
              name: stage.name,
              value: stageDeals.length,
              color: stage.color,
            }
          })
          .filter((stage) => stage.value > 0)
      } catch (error) {
        console.error("Error parsing deals data:", error)
      }
    }
  }

  // Fallback data
  return [
    { name: "Lead", value: 1, color: "#8884d8" },
    { name: "Qualified", value: 1, color: "#82ca9d" },
    { name: "Proposal", value: 1, color: "#ffc658" },
    { name: "Negotiation", value: 1, color: "#ff7300" },
    { name: "Closed Won", value: 1, color: "#00ff00" },
  ]
}

export function PipelineChart() {
  const [data, setData] = useState(getDynamicPipelineData())

  useEffect(() => {
    // Update chart data when component mounts and periodically
    const updateData = () => {
      setData(getDynamicPipelineData())
    }

    updateData()

    // Listen for storage changes (when deals are updated)
    const handleStorageChange = () => {
      updateData()
    }

    window.addEventListener("storage", handleStorageChange)

    // Also update every 5 seconds to catch local changes
    const interval = setInterval(updateData, 5000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} deals`, name]}
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
