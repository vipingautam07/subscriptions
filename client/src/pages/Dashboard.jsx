import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useGetSubscriptions } from "../hooks/useSubscriptions"
import { SubscriptionDetailsModal } from "../components/SubscriptionDetailsModal"
import { SubscriptionFormModal } from "../components/SubscriptionFormModal"

import { DashboardStats } from "../components/dashboard/DashboardStats"
import { SmartInsights } from "../components/dashboard/SmartInsights"
import { UpcomingRenewals } from "../components/dashboard/UpcomingRenewals"
import { CategoryAnalytics } from "../components/dashboard/CategoryAnalytics"
import { RecentActivity } from "../components/dashboard/RecentActivity"

export function Dashboard() {
  const { user } = useAuth()
  const { data: response, isLoading, isError } = useGetSubscriptions()
  
  const [selectedSub, setSelectedSub] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSub, setEditingSub] = useState(null)

  const subscriptions = response?.data || []

  if (isLoading) return <div className="p-8 text-center font-black uppercase text-xl">Loading Dashboard...</div>
  if (isError) return <div className="p-8 text-center font-black uppercase text-xl text-danger">Failed to load data</div>

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="border-l-8 border-primary pl-4">
          <h1 className="text-4xl font-black uppercase tracking-widest text-black dark:text-white">Dashboard</h1>
          <p className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mt-2">
            Welcome back{user?.name ? `, ${user.name}` : ''}! Overview of your subscriptions.
          </p>
        </div>
        <button 
          onClick={() => {
            setEditingSub(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 border-2 border-black bg-primary px-6 py-3 font-black uppercase tracking-widest text-black shadow-neo transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-neo-lg active:translate-x-0 active:translate-y-0 active:shadow-neo dark:border-white w-full sm:w-auto"
        >
          + Add Sub
        </button>
      </div>

      {/* KPI Stats */}
      <DashboardStats subscriptions={subscriptions} />

      {/* Smart Insights Banner */}
      <SmartInsights subscriptions={subscriptions} />

      {/* Grid: Upcoming Renewals + Category Analytics */}
      <div className="grid gap-8 lg:grid-cols-2">
        <UpcomingRenewals 
          subscriptions={subscriptions} 
          onCardClick={setSelectedSub} 
        />
        <CategoryAnalytics 
          subscriptions={subscriptions} 
        />
      </div>

      {/* Recent Activity */}
      <RecentActivity 
        subscriptions={subscriptions} 
        onCardClick={setSelectedSub} 
      />

      {/* Modals */}
      <SubscriptionFormModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingSub(null);
        }} 
        selectedSub={editingSub} 
      />

      <SubscriptionDetailsModal 
        selectedSub={selectedSub} 
        onClose={() => setSelectedSub(null)} 
        onEdit={(sub) => {
          setEditingSub(sub);
          setIsModalOpen(true);
          setSelectedSub(null);
        }}
      />
    </div>
  )
}

