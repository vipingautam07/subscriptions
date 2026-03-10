import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";
import { useMemo } from "react";
import { Card } from "../../ui/Card";
import { formatCurrency } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

export function TopSubscriptionsChart({ subscriptions }) {
  const { user } = useAuth();
  
  const data = useMemo(() => {
    const activeSubs = subscriptions.filter(sub => sub.status === 'active' || sub.status === 'upcoming');
    
    return activeSubs.map(sub => {
      let monthlyPrice = typeof sub.price === 'number' ? sub.price : parseFloat(sub.price) || 0;
      if (sub.frequency && sub.frequency.toLowerCase() === 'yearly') monthlyPrice = monthlyPrice / 12;
      else if (sub.frequency && sub.frequency.toLowerCase() === 'weekly') monthlyPrice = monthlyPrice * 4.33;
      else if (sub.frequency && sub.frequency.toLowerCase() === 'daily') monthlyPrice = monthlyPrice * 30;

      return {
        name: sub.name,
        cost: monthlyPrice
      };
    }).sort((a, b) => b.cost - a.cost).slice(0, 5); // Top 5
  }, [subscriptions]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border-4 border-black p-3 shadow-neo font-black uppercase tracking-widest text-sm dark:bg-dark-card dark:border-white">
          <p className="text-black dark:text-white">{`${payload[0].payload.name} : ${formatCurrency(payload[0].value, user?.currency)}/mo`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-8 h-[400px] flex flex-col bg-white border-4 border-black shadow-neo dark:bg-dark-card dark:border-white">
      <div className="flex items-center justify-between mb-8 border-b-4 border-black pb-4 dark:border-white">
        <h3 className="text-xl font-black uppercase tracking-widest text-black dark:text-white">Costliest Subscriptions</h3>
      </div>
      <div className="flex-1 w-full min-h-0">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center font-black uppercase text-black dark:text-white">No Top Subscriptions</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
              <XAxis 
                type="number" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fontWeight: 900, fontFamily: 'inherit' }}
                tickFormatter={(val) => formatCurrency(val, user?.currency)}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fontWeight: 900, fontFamily: 'inherit' }}
                width={80}
              />
              <RechartsTooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
              <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#f87171' : '#a3e635'} stroke="#000" strokeWidth={3} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
