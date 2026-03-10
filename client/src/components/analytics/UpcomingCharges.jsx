import { useMemo } from "react";
import { Card } from "../../ui/Card";
import { CalendarClock } from "lucide-react";
import { formatCurrency } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

export function UpcomingCharges({ subscriptions }) {
  const { user } = useAuth();

  const charges = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

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
    .slice(0, 5); // top 5 immediate charges
  }, [subscriptions]);

  const getUrgencyClasses = (days) => {
    if (days <= 3) return "border-danger bg-danger/10 text-danger";
    if (days <= 7) return "border-warning bg-warning/10 text-warning-dark";
    return "border-primary bg-primary/10 text-primary-dark dark:text-primary";
  };

  const getUrgencyDot = (days) => {
    if (days <= 3) return "bg-danger";
    if (days <= 7) return "bg-warning";
    return "bg-primary";
  };

  return (
    <Card className="p-8 border-4 border-black bg-white shadow-neo dark:bg-dark-card dark:border-white h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 border-b-4 border-black pb-4 dark:border-white">
        <h3 className="text-xl font-black uppercase tracking-widest text-black dark:text-white">Upcoming Charges</h3>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">(30 Days)</span>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {charges.length === 0 ? (
          <div className="text-center py-8 font-black uppercase text-gray-500">
            No upcoming charges in 30 days
          </div>
        ) : (
          charges.map((charge) => {
            const urgencyClass = getUrgencyClasses(charge.daysUntil);
            const dotClass = getUrgencyDot(charge.daysUntil);
            
            let timeText = `in ${charge.daysUntil} days`;
            if (charge.daysUntil === 0) timeText = "today";
            else if (charge.daysUntil === 1) timeText = "tomorrow";

            const currencyToUse = user?.currency || charge.currency || "USD";

            return (
              <div 
                key={charge._id || charge.id} 
                className={`flex items-center justify-between p-4 border-2 border-black dark:border-white shadow-neo-sm relative overflow-hidden group`}
              >
                {/* Visual Urgency Indicator Strip */}
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${dotClass} border-r-2 border-black dark:border-white`} />
                
                <div className="pl-4 flex flex-col">
                  <span className="font-black uppercase tracking-widest text-black dark:text-white truncate max-w-[150px] sm:max-w-[200px]">
                    {charge.name}
                  </span>
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                    Renews {timeText}
                  </span>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className="font-black text-lg text-black dark:text-white">
                    {formatCurrency(charge.price, currencyToUse)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
