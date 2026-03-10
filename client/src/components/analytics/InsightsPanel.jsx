import { useMemo } from "react";
import { Card } from "../../ui/Card";
import { Lightbulb, TrendingDown, TrendingUp, AlertCircle } from "lucide-react";
import { formatCurrency } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

export function InsightsPanel({ subscriptions }) {
  const { user } = useAuth();
  
  const insights = useMemo(() => {
    let monthlySpend = 0;
    let unusedSpend = 0;
    const categories = {};
    
    // Calculate stats
    subscriptions.forEach(sub => {
      if (sub.status !== 'active' && sub.status !== 'upcoming') {
        if (sub.status === 'expired' || sub.status === 'cancelled' || sub.status === 'ended') {
           // mock unused spend if they were active
           let price = typeof sub.price === 'number' ? sub.price : parseFloat(sub.price) || 0;
           if (sub.frequency && sub.frequency.toLowerCase() === 'yearly') price = price / 12;
           unusedSpend += price;
        }
        return;
      }
      
      let price = typeof sub.price === 'number' ? sub.price : parseFloat(sub.price) || 0;
      if (sub.frequency && sub.frequency.toLowerCase() === 'yearly') price = price / 12;
      else if (sub.frequency && sub.frequency.toLowerCase() === 'weekly') price = price * 4.33;
      else if (sub.frequency && sub.frequency.toLowerCase() === 'daily') price = price * 30;

      monthlySpend += price;
      
      const cat = sub.category ? sub.category.toUpperCase() : 'OTHER';
      categories[cat] = (categories[cat] || 0) + price;
    });

    // Find top category
    let topCategory = null;
    let topCatAmount = 0;
    Object.entries(categories).forEach(([cat, amount]) => {
      if (amount > topCatAmount) {
        topCatAmount = amount;
        topCategory = cat;
      }
    });

    const topCatPercentage = monthlySpend > 0 ? Math.round((topCatAmount / monthlySpend) * 100) : 0;

    const generatedInsights = [];

    // Core spend insight
    if (monthlySpend > 0) {
      generatedInsights.push({
        id: 'spend',
        icon: TrendingUp,
        color: 'text-warning',
        text: `You are spending ${formatCurrency(monthlySpend, user?.currency)} per month on active subscriptions.`
      });
    }

    // Category insight
    if (topCategory && topCatPercentage > 0) {
      generatedInsights.push({
        id: 'category',
        icon: Lightbulb,
        color: 'text-primary',
        text: `${topCategory} accounts for ${topCatPercentage}% of your total subscription costs.`
      });
    }

    // Savings insight (mocking based on cancelled/expired as examples of potentially saved money)
    if (unusedSpend > 0) {
      generatedInsights.push({
        id: 'savings',
        icon: TrendingDown,
        color: 'text-green-500',
        text: `You are saving ${formatCurrency(unusedSpend, user?.currency)}/mo from cancelled or expired subscriptions.`
      });
    } else if (subscriptions.length > 5) {
      // Generic insight if they have many subs
      generatedInsights.push({
        id: 'audit',
        icon: AlertCircle,
        color: 'text-secondary',
        text: `Consider auditing your ${subscriptions.length} active subscriptions to identify unused services.`
      });
    }

    if (generatedInsights.length === 0) {
      generatedInsights.push({
         id: 'new',
         icon: Lightbulb,
         color: 'text-black',
         text: `Add more subscriptions to unlock AI-driven spending insights.`
      })
    }

    return generatedInsights;
  }, [subscriptions, user?.currency]);

  return (
    <Card className="p-8 border-4 border-black bg-white shadow-neo dark:bg-dark-card dark:border-white h-full flex flex-col">
      <h3 className="text-xl font-black uppercase tracking-widest text-black dark:text-white mb-6 border-b-4 border-black pb-4 dark:border-white">
        Smart Insights
      </h3>
      <div className="flex-1 flex flex-col gap-4 justify-start overflow-y-auto pr-2 pb-2">
        {insights.map((insight) => {
          const Icon = insight.icon;
          return (
            <div key={insight.id} className="flex items-start gap-4 p-4 border-2 border-black bg-gray-50 dark:bg-black/20 dark:border-gray-700 shadow-neo-sm">
              <div className={`mt-0.5 ${insight.color}`}>
                <Icon className="w-6 h-6 stroke-[3]" />
              </div>
              <p className="font-bold text-black dark:text-white leading-relaxed">
                {insight.text}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
