import { useState } from "react"
import { Plus, Filter } from "lucide-react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { SubscriptionCard } from "../components/SubscriptionCard"
import { SubscriptionDetailsModal } from "../components/SubscriptionDetailsModal"
import { SubscriptionFormModal } from "../components/SubscriptionFormModal"
import { useGetSubscriptions } from "../hooks/useSubscriptions"

export function SubscriptionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSub, setSelectedSub] = useState(null)
  const [editingSub, setEditingSub] = useState(null)
  
  const { data: response, isLoading, isError } = useGetSubscriptions()

  const subscriptions = response?.data || []
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="border-l-8 border-secondary pl-4">
          <h1 className="text-4xl font-black uppercase tracking-widest text-black dark:text-white">Subscriptions</h1>
          <p className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mt-2">Manage all your active and expired subscriptions.</p>
        </div>
        <Button 
          onClick={() => {
            setEditingSub(null);
            setIsModalOpen(true);
          }} 
          className="gap-3 shrink-0 uppercase tracking-widest text-lg h-14 bg-secondary hover:bg-green-400"
        >
          <Plus className="h-6 w-6 stroke-[3]" />
          ADD SUB
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-dark-card p-6 border-4 border-black dark:border-white shadow-neo dark:shadow-neo-dark">
        <div className="w-full sm:w-96">
          <Input placeholder="SEARCH NAME OR CATEGORY..." className="w-full bg-gray-50 border-2 dark:bg-black font-black uppercase tracking-widest placeholder:opacity-50" />
        </div>
        <div className="flex w-full sm:w-auto gap-4">
          <Button variant="outline" className="gap-2 w-full sm:w-auto h-12 uppercase font-black tracking-widest border-2">
            <Filter className="h-5 w-5 stroke-[3]" />
            FILTER
          </Button>
        </div>
      </div>

      <div className="grid gap-6 mt-8">
        {isLoading ? (
          <div className="p-8 border-4 border-black bg-white shadow-neo dark:bg-dark-card dark:border-white font-black uppercase text-xl text-center">Loading subscriptions...</div>
        ) : isError ? (
          <div className="p-8 border-4 border-black bg-danger shadow-neo dark:border-white font-black uppercase text-xl text-center text-black">Failed to load subscriptions</div>
        ) : subscriptions.length === 0 ? (
          <div className="p-8 border-4 border-black bg-white shadow-neo dark:bg-dark-card dark:border-white font-black uppercase text-xl text-center">No subscriptions found. Add one!</div>
        ) : (
          subscriptions.map(sub => (
            <SubscriptionCard key={sub._id || sub.id} {...sub} onClick={() => setSelectedSub(sub)} />
          ))
        )}
      </div>

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
