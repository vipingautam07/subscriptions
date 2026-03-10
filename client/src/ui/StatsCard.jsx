import { Card } from "./Card"
import { cn } from "../lib/utils"

export function StatsCard({ title, value, icon: Icon, trend, trendValue, className }) {
  const isPositive = trend === "up"
  
  return (
    <Card className={cn("p-6 flex flex-col justify-between", className)}>
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-black dark:text-white">{title}</h3>
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center border-2 border-black bg-primary text-black shadow-neo-sm dark:border-white">
            <Icon className="h-6 w-6 stroke-[2.5]" />
          </div>
        )}
      </div>
      <div className="mt-6 flex items-baseline gap-3">
        <p className="text-4xl font-black tracking-tight text-black dark:text-white">{value}</p>
        {trend && (
          <span className={cn(
            "text-sm font-bold border-2 border-black px-2 py-0.5 shadow-neo-sm dark:border-white",
            isPositive ? "bg-danger text-black" : "bg-secondary text-black" 
          )}>
            {isPositive ? "+" : "-"}{trendValue}%
          </span>
        )}
      </div>
    </Card>
  )
}
