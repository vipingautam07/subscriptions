import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "../../ui/Card";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../lib/utils";

export function SpendingLineChart({ subscriptions }) {
  const { user } = useAuth();
  // Generate historical MRR trend based on subscription start dates
  const data = useMemo(() => {
    const months = [];
    const today = new Date();
    
    // Generate labels for the last 6 months
    for (let i = 5; i >= 0; i--) {
      months.push({
        date: new Date(today.getFullYear(), today.getMonth() - i, 1),
        spend: 0
      });
    }

    subscriptions.forEach(sub => {
      // Only track active or upcoming subscriptions
      if (sub.status !== 'active' && sub.status !== 'upcoming') return;

      let monthlyPrice = typeof sub.price === 'number' ? sub.price : parseFloat(sub.price) || 0;
      if (sub.frequency && sub.frequency.toLowerCase() === 'yearly') monthlyPrice = monthlyPrice / 12;
      else if (sub.frequency && sub.frequency.toLowerCase() === 'weekly') monthlyPrice = monthlyPrice * 4.33;
      else if (sub.frequency && sub.frequency.toLowerCase() === 'daily') monthlyPrice = monthlyPrice * 30;

      // Treat missing start dates as an older subscription that's always been active in this 6mo window
      const startDate = sub.startDate ? new Date(sub.startDate) : new Date(0); 

      months.forEach(m => {
        // If this calendar month is after or equal to the subscription's start month/year, the subscription was active.
        const isActiveInMonth = m.date.getFullYear() > startDate.getFullYear() || 
                                (m.date.getFullYear() === startDate.getFullYear() && m.date.getMonth() >= startDate.getMonth());
        
        if (isActiveInMonth) {
          m.spend += monthlyPrice;
        }
      });
    });

    return months.map(m => ({
      month: m.date.toLocaleString('default', { month: 'short' }),
      spend: Number(m.spend.toFixed(2))
    }));
  }, [subscriptions]);

  return (
    <Card className="p-8 h-[400px] flex flex-col relative overflow-hidden bg-white dark:bg-dark-card border-4 border-black shadow-neo dark:border-white dark:shadow-neo-dark">
      <div className="flex items-center justify-between mb-8 border-b-4 border-black pb-4 dark:border-white">
        <h3 className="text-xl font-black uppercase tracking-widest text-black dark:text-white">Monthly Spending Trend</h3>
      </div>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fontWeight: 900, fontFamily: 'inherit' }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fontWeight: 900, fontFamily: 'inherit' }}
              tickFormatter={(value) => formatCurrency(value, user?.currency)}
              dx={-10}
            />
            <Tooltip 
              cursor={{ stroke: '#000', strokeWidth: 2, strokeDasharray: '4 4' }}
              contentStyle={{ border: '4px solid #000', borderRadius: 0, boxShadow: '4px 4px 0px 0px #000', fontWeight: 900, textTransform: 'uppercase' }}
              formatter={(value) => [formatCurrency(value, user?.currency), 'Spend']}
            />
            <Line 
              type="monotone" 
              dataKey="spend" 
              stroke="#000" 
              strokeWidth={4}
              dot={{ stroke: '#000', strokeWidth: 4, r: 4, fill: '#fff' }}
              activeDot={{ r: 8, stroke: '#000', strokeWidth: 4, fill: '#a3e635' }} // bg-primary equivalent
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
