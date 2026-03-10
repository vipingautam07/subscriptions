import { useGetSubscriptions } from "../hooks/useSubscriptions"
import { AnalyticsHeader } from "../components/analytics/AnalyticsHeader"
import { AnalyticsStats } from "../components/analytics/AnalyticsStats"
import { SpendingLineChart } from "../components/analytics/SpendingLineChart"
import { CategoryPieChart } from "../components/analytics/CategoryPieChart"
import { TopSubscriptionsChart } from "../components/analytics/TopSubscriptionsChart"
import { UpcomingCharges } from "../components/analytics/UpcomingCharges"
import { InsightsPanel } from "../components/analytics/InsightsPanel"

export function AnalyticsPage() {
  const { data: response, isLoading, isError } = useGetSubscriptions()
  const subscriptions = response?.data || []

  if (isLoading) return <div className="p-8 text-center font-black uppercase text-xl">Loading Analytics...</div>
  if (isError) return <div className="p-8 text-center font-black uppercase text-xl text-danger">Failed to load data</div>

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <AnalyticsHeader />
      
      {/* KPI Stats */}
      <AnalyticsStats subscriptions={subscriptions} />

      {/* Main Charts Row */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Line Chart takes up 2 columns */}
        <div className="lg:col-span-2 shadow-neo dark:shadow-neo-dark">
          <SpendingLineChart subscriptions={subscriptions} />
        </div>
        
        {/* Pie Chart takes 1 column */}
        <div className="shadow-neo dark:shadow-neo-dark">
          <CategoryPieChart subscriptions={subscriptions} />
        </div>
      </div>

      {/* Secondary Row */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Top Costs takes up 1 column */}
        <div className="shadow-neo dark:shadow-neo-dark">
          <TopSubscriptionsChart subscriptions={subscriptions} />
        </div>
        
        {/* Upcoming Charges takes up 1 column */}
        <div className="shadow-neo dark:shadow-neo-dark h-[400px]">
          <UpcomingCharges subscriptions={subscriptions} />
        </div>

        {/* Smart Insights Panel takes up 1 column */}
        <div className="shadow-neo dark:shadow-neo-dark h-[400px]">
          <InsightsPanel subscriptions={subscriptions} />
        </div>
      </div>
    </div>
  )
}
