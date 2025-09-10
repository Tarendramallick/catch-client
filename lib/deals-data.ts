// Export deals data for dashboard integration
export interface Deal {
  id: string
  title: string
  company: string
  industry: string
  value: number
  stage: string
  probability: number
  closeDate: string
  assigneeId: string
  assignee: string
  avatar?: string
  description: string
  createdDate: string
  lastUpdated: string
}

// Get deals from localStorage (browser-side only)
export const getDealsFromStorage = (): Deal[] => {
  if (typeof window === "undefined") return []

  try {
    const dealsData = localStorage.getItem("catchclients-deals")
    return dealsData ? JSON.parse(dealsData) : []
  } catch (error) {
    console.error("Error parsing deals data:", error)
    return []
  }
}

export const getActivePipelineDeals = (): Deal[] => {
  const deals = getDealsFromStorage()
  return deals.filter((deal) => !["closed-won", "closed-lost"].includes(deal.stage))
}

export const getClosedWonDeals = (): Deal[] => {
  const deals = getDealsFromStorage()
  return deals.filter((deal) => deal.stage === "closed-won")
}

export const getClosedLostDeals = (): Deal[] => {
  const deals = getDealsFromStorage()
  return deals.filter((deal) => deal.stage === "closed-lost")
}

export const getPipelineValue = (): number => {
  return getActivePipelineDeals().reduce((sum, deal) => sum + deal.value, 0)
}

export const getAverageDealSize = (): number => {
  const activeDeals = getActivePipelineDeals()
  return activeDeals.length > 0 ? getPipelineValue() / activeDeals.length : 0
}

export const getWinRate = (): number => {
  const closedWon = getClosedWonDeals()
  const closedLost = getClosedLostDeals()
  const totalClosed = closedWon.length + closedLost.length
  return totalClosed > 0 ? (closedWon.length / totalClosed) * 100 : 0
}

export const getPipelineDataForCharts = () => {
  const deals = getDealsFromStorage()
  const stages = [
    { id: "lead", name: "Lead", color: "#8884d8" },
    { id: "qualified", name: "Qualified", color: "#82ca9d" },
    { id: "proposal", name: "Proposal", color: "#ffc658" },
    { id: "negotiation", name: "Negotiation", color: "#ff7300" },
    { id: "closed-won", name: "Closed Won", color: "#00ff00" },
  ]

  return stages
    .map((stage) => {
      const stageDeals = deals.filter((deal) => deal.stage === stage.id)
      return {
        name: stage.name,
        value: stageDeals.reduce((sum, deal) => sum + deal.value, 0),
        count: stageDeals.length,
        color: stage.color,
      }
    })
    .filter((stage) => stage.count > 0)
}

export const getRevenueDataForCharts = () => {
  const deals = getDealsFromStorage()
  const closedWonDeals = deals.filter((deal) => deal.stage === "closed-won")

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  const currentMonth = new Date().getMonth()

  return months.map((month, index) => {
    let revenue = 45000 + Math.random() * 20000 // Base revenue

    if (index <= currentMonth) {
      const monthDeals = closedWonDeals.filter((deal) => {
        const dealDate = new Date(deal.lastUpdated || deal.createdDate)
        return dealDate.getMonth() === index
      })

      const dealRevenue = monthDeals.reduce((sum, deal) => sum + deal.value, 0)
      revenue += dealRevenue
    }

    return {
      month,
      revenue: Math.round(revenue),
    }
  })
}
