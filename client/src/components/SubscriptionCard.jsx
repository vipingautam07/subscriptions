import { Card } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { cn, formatCurrency } from "../lib/utils"
import { useAuth } from "../context/AuthContext"

export function SubscriptionCard({
  logoUrl,
  name,
  price,
  currency,
  frequency = "Monthly",
  renewalDate,
  status = "active", // "active", "upcoming", "expired"
  category,
  className,
  onClick
}) {
  const { user } = useAuth();
  const displayCurrency = user?.currency || currency || "INR";

  return (
    <Card onClick={onClick} className={cn("p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-dark-card hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg transition-transform", onClick ? "cursor-pointer" : "", className)}>
      <div className="flex items-center gap-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-black bg-accent shadow-neo-sm dark:border-white">
          {logoUrl ? (
            <img src={logoUrl} alt={name} className="h-10 w-10 object-contain mix-blend-multiply" />
          ) : (
            <div className="flex items-center justify-center text-black font-black text-xl uppercase">
              {name ? name.charAt(0) : '?'}
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-1">
          <h4 className="text-lg font-black text-black dark:text-white uppercase tracking-wide">{name}</h4>
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
            {category} <span className="mx-1">•</span> 
            {status === 'active' || status === 'upcoming' ? `Renews ${renewalDate ? new Date(renewalDate).toLocaleDateString("en-GB") : 'N/A'}` : null}
            {status === 'cancelled' ? `Access until ${renewalDate ? new Date(renewalDate).toLocaleDateString("en-GB") : 'N/A'}` : null}
            {status === 'paused' ? `Paused` : null}
            {status === 'ended' || status === 'expired' ? `Inactive` : null}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 sm:gap-8">
        <div className="text-right flex flex-col gap-1">
          <p className="text-2xl font-black text-black dark:text-white">
            {formatCurrency(price, displayCurrency)}
          </p>
          <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">{frequency}</p>
        </div>
        <Badge variant={status} className="w-24 justify-center">
          {status ? status.toUpperCase() : 'UNKNOWN'}
        </Badge>
      </div>
    </Card>
  )
}
