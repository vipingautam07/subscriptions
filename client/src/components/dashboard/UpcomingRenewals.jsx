import { useMemo } from "react"
import { formatCurrency } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

export function UpcomingRenewals({ subscriptions, onCardClick }) {
  const { user } = useAuth();

  const renewals = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get active/upcoming subs with valid renewals
    const activeSubs = subscriptions.filter(sub => 
      (sub.status === 'active' || sub.status === 'upcoming') && sub.renewalDate
    );
    
    return activeSubs.map(sub => {
      const renewalDate = new Date(sub.renewalDate);
      renewalDate.setHours(0, 0, 0, 0);
      const diffTime = renewalDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        ...sub,
        daysUntil: diffDays
      };
    })
    .filter(sub => sub.daysUntil >= 0 && sub.daysUntil <= 30)
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 3);
  }, [subscriptions]);

  const getUrgencyClasses = (days) => {
    if (days <= 3) return "border-danger bg-danger/10 text-danger";
    if (days <= 7) return "border-warning bg-warning/10 text-warning-dark";
    return "border-primary bg-primary/10 text-primary-dark dark:text-primary";
  };

  const getUrgencyDot = (days) => {
    if (days <= 3) return "bg-danger";
    if (days <= 7) return "bg-warning";
    return "bg-black dark:bg-white";
  };

  return (
    <div className="space-y-6 flex flex-col items-stretch">
      <div className="flex items-center justify-between border-b-4 border-black pb-4 dark:border-white">
        <h2 className="text-2xl font-black uppercase tracking-widest text-black dark:text-white">Upcoming Renewals</h2>
      </div>
      <div className="space-y-4">
        {renewals.length === 0 ? (
           <div className="p-4 border-4 border-black bg-white shadow-neo dark:bg-dark-card dark:border-white font-black uppercase text-center text-gray-500">
             No upcoming renewals in 30 days
           </div>
        ) : (
           renewals.map(sub => {
             const dotClass = getUrgencyDot(sub.daysUntil);
             
             let timeText = `in ${sub.daysUntil} days`;
             if (sub.daysUntil === 0) timeText = "today";
             else if (sub.daysUntil === 1) timeText = "tomorrow";

             const currencyToUse = user?.currency || sub.currency || "USD";

             return (
               <div 
                 key={sub._id || sub.id} 
                 onClick={() => onCardClick(sub)}
                 className={`flex items-center justify-between p-4 border-4 border-black bg-white dark:bg-dark-card dark:border-white shadow-neo hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg transition-transform cursor-pointer relative overflow-hidden group`}
               >
                 {/* Visual Urgency Indicator Strip */}
                 <div className={`absolute left-0 top-0 bottom-0 w-2 ${dotClass} border-r-4 border-black dark:border-white`} />
                 
                 <div className="pl-4 flex flex-col">
                   <span className="font-black uppercase tracking-widest text-black dark:text-white truncate max-w-[150px] sm:max-w-[200px]">
                     {sub.name}
                   </span>
                   <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                     Renews {timeText}
                   </span>
                 </div>
                 
                 <div className="flex flex-col items-end">
                   <span className="font-black text-lg text-black dark:text-white">
                     {formatCurrency(sub.price, currencyToUse)}
                   </span>
                 </div>
               </div>
             )
           })
        )}
      </div>
    </div>
  )
}
