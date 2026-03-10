import { useMemo } from "react";
import { Wallet, CalendarRange, CreditCard, CalendarClock } from "lucide-react";
import { StatsCard } from "../../ui/StatsCard";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../lib/utils";

export function AnalyticsStats({ subscriptions }) {
  const { user } = useAuth();
  
  const stats = useMemo(() => {
    let monthlySpend = 0;
    let activeSubs = 0;
    let upcoming30Days = 0;
    
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
         let price = typeof sub.price === 'number' ? sub.price : parseFloat(sub.price) || 0;
         if (sub.frequency && sub.frequency.toLowerCase() === 'yearly') price = price / 12;
         else if (sub.frequency && sub.frequency.toLowerCase() === 'weekly') price = price * 4.33;
         else if (sub.frequency && sub.frequency.toLowerCase() === 'daily') price = price * 30;

         monthlySpend += price;
         
         // Calculate renewals explicitly in next 30 days
         if (sub.renewalDate) {
           const renewal = new Date(sub.renewalDate);
           if (renewal >= today && renewal <= next30Days) {
             upcoming30Days++;
           }
         }
      }
    });

    const yearlySpend = monthlySpend * 12;

    return { 
      monthlySpend, 
      yearlySpend, 
      activeSubs, 
      upcoming30Days 
    };
  }, [subscriptions]);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard title="Monthly Spend" value={formatCurrency(stats.monthlySpend, user?.currency)} icon={Wallet} trend="up" trendValue={4.2} />
      <StatsCard title="Yearly Spend" value={formatCurrency(stats.yearlySpend, user?.currency)} icon={CalendarRange} />
      <StatsCard title="Active Subs" value={stats.activeSubs.toString()} icon={CreditCard} />
      <StatsCard title="Upcoming (30d)" value={stats.upcoming30Days.toString()} icon={CalendarClock} />
    </div>
  );
}
