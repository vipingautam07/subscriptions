import { AlertCircle, CheckCircle2 } from "lucide-react"
import { useMemo } from "react"

export function SmartInsights({ subscriptions }) {
  const insights = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const urgentSubs = subscriptions.filter(sub => {
      if (sub.status !== 'active' && sub.status !== 'upcoming') return false;
      if (!sub.renewalDate) return false;
      const renewal = new Date(sub.renewalDate);
      return renewal >= today && renewal <= nextWeek;
    });

    if (urgentSubs.length > 0) {
      return {
        type: "warning",
        text: `You have ${urgentSubs.length} subscription(s) renewing in the next 7 days. Review them carefully.`
      };
    }
    
    return {
      type: "success",
      text: "All clear! You have no immediate renewals coming up."
    };
  }, [subscriptions]);

  return (
    <div className={`p-4 border-4 border-black shadow-neo flex items-center gap-4 dark:border-white ${
      insights.type === 'warning' ? 'bg-warning' : 'bg-secondary'
    }`}>
      {insights.type === 'warning' ? (
        <AlertCircle className="h-8 w-8 stroke-[2.5] text-black shrink-0" />
      ) : (
        <CheckCircle2 className="h-8 w-8 stroke-[2.5] text-black shrink-0" />
      )}
      <p className="text-black font-black uppercase tracking-widest text-sm sm:text-base">
        {insights.text}
      </p>
    </div>
  )
}
