"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface Deal {
  id: string
  stage: string
  value: number
}

interface DealsStageChartProps {
  deals: Deal[]
}

export function DealsStageChart({ deals }: DealsStageChartProps) {
  const activeStages = ["Lead", "Qualified", "Proposal", "Negotiation"]

  const chartData = activeStages.map((stage) => {
    const stageDeals = deals.filter((deal) => deal.stage === stage)
    return {
      stage,
      count: stageDeals.length,
      value: stageDeals.reduce((sum, deal) => sum + deal.value, 0),
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deals by Stage (Active)</CardTitle>
        <CardDescription>Distribution of active deals across pipeline stages</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            count: {
              label: "Deal Count",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[250px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 40 }} barCategoryGap="20%">
              <XAxis dataKey="stage" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={60} interval={0} />
              <YAxis tick={{ fontSize: 11 }} width={30} />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-blue-600">Deals: {data.count}</p>
                        <p className="text-sm text-green-600">Value: ${data.value.toLocaleString()}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={[2, 2, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
