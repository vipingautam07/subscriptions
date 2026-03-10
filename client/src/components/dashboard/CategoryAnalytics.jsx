import { useMemo } from "react"
import { useAuth } from "../../context/AuthContext"
import { formatCurrency } from "../../lib/utils"

export function CategoryAnalytics({ subscriptions }) {
  const { user } = useAuth();
  const categoryData = useMemo(() => {
    const totals = {};
    let grandTotal = 0;

    subscriptions.forEach(sub => {
      if (sub.status !== 'active' && sub.status !== 'upcoming') return;
      
      let monthlyPrice = typeof sub.price === 'number' ? sub.price : parseFloat(sub.price) || 0;
      if (sub.frequency && sub.frequency.toLowerCase() === 'yearly') monthlyPrice = monthlyPrice / 12;
      else if (sub.frequency && sub.frequency.toLowerCase() === 'weekly') monthlyPrice = monthlyPrice * 4.33;
      else if (sub.frequency && sub.frequency.toLowerCase() === 'daily') monthlyPrice = monthlyPrice * 30;

      const cat = sub.category ? sub.category.toUpperCase() : 'OTHER';
      
      totals[cat] = (totals[cat] || 0) + monthlyPrice;
      grandTotal += monthlyPrice;
    });

    return Object.entries(totals)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: grandTotal > 0 ? (amount / grandTotal) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [subscriptions]);

  if (categoryData.length === 0) return null;

  return (
    <div className="space-y-6 flex flex-col items-stretch">
      <div className="flex items-center justify-between border-b-4 border-black pb-4 dark:border-white">
        <h2 className="text-2xl font-black uppercase tracking-widest text-black dark:text-white">Spend by Category</h2>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">(Monthly Avg)</span>
      </div>
      
      <div className="flex-1 border-4 border-black bg-white p-6 shadow-neo dark:bg-dark-card dark:border-white">
        <div className="space-y-6">
          {categoryData.slice(0, 5).map((cat, i) => {
            const colors = ["bg-primary", "bg-accent", "bg-secondary", "bg-warning", "bg-purple-400"];
            const colorClass = colors[i % colors.length];

            return (
              <div key={cat.name} className="space-y-2 group">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-black dark:text-white group-hover:text-primary transition-colors">
                  <span>{cat.name}</span>
                  <span>{formatCurrency(cat.amount, user?.currency)}</span>
                </div>
                <div className="h-4 w-full bg-gray-200 border-2 border-black dark:bg-gray-800 dark:border-white overflow-hidden">
                  <div 
                    className={`h-full border-r-2 border-black dark:border-white ${colorClass} transition-all duration-1000 ease-out`} 
                    style={{ width: `${Math.max(cat.percentage, 2)}%` }} 
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
