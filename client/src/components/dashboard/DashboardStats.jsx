import { useMemo } from "react"
import { Wallet, CreditCard, Calendar, Activity } from "lucide-react"
import { StatsCard } from "../../ui/StatsCard"
import { useAuth } from "../../context/AuthContext"
import { formatCurrency } from "../../lib/utils"

export function DashboardStats({ subscriptions }) {
  const { user } = useAuth();
  const stats = useMemo(() => {
    let totalSpend = 0;
    let activeSubs = 0;
    let upcoming = 0;
    let expired = 0;
    const today = new Date();
    today.setHours(0,0,0,0);
    const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    subscriptions.forEach(sub => {
      // Count active subs
      if (sub.status === 'active' || sub.status === 'upcoming') {
         activeSubs++;
      }

      // Calculate true forward-looking MRR
      if (sub.status === 'active' || sub.status === 'upcoming') {
         // Normalize to monthly spend for more accurate representation
         let monthlyPrice = typeof sub.price === 'number' ? sub.price : parseFloat(sub.price) || 0;
         if (sub.frequency && sub.frequency.toLowerCase() === 'yearly') monthlyPrice = monthlyPrice / 12;
         else if (sub.frequency && sub.frequency.toLowerCase() === 'weekly') monthlyPrice = monthlyPrice * 4.33;
         else if (sub.frequency && sub.frequency.toLowerCase() === 'daily') monthlyPrice = monthlyPrice * 30;

         totalSpend += monthlyPrice;

         // Calculate renewals explicitly in next 30 days
         if (sub.renewalDate) {
           const renewal = new Date(sub.renewalDate);
           if (renewal >= today && renewal <= next30Days) {
             upcoming++;
           }
         }
      }
      
      if (sub.status === 'expired' || sub.status === 'ended' || sub.status === 'cancelled') expired++
    })
    
    return { totalSpend: totalSpend.toFixed(2), activeSubs, upcoming, expired }
  }, [subscriptions])

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard title="Total Spend / Mo" value={formatCurrency(stats.totalSpend, user?.currency)} icon={Wallet} trend="up" trendValue={12.5} />
      <StatsCard title="Active Subs" value={stats.activeSubs.toString()} icon={CreditCard} trend="down" trendValue={2.4} />
      <StatsCard title="Upcoming" value={stats.upcoming.toString()} icon={Calendar} />
      <StatsCard title="Inactive" value={stats.expired.toString()} icon={Activity} />
    </div>
  )
}
