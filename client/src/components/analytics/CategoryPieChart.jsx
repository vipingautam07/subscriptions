import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { useMemo } from "react";
import { Card } from "../../ui/Card";
import { formatCurrency } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

const COLORS = ['#a3e635', '#fde047', '#f87171', '#c084fc', '#60a5fa', '#fb923c']; // Tailwind primary, secondary, danger, etc.

export function CategoryPieChart({ subscriptions }) {
  const { user } = useAuth();

  const data = useMemo(() => {
    const totals = {};
    subscriptions.forEach(sub => {
      if (sub.status !== 'active' && sub.status !== 'upcoming') return;
      
      let monthlyPrice = typeof sub.price === 'number' ? sub.price : parseFloat(sub.price) || 0;
      if (sub.frequency && sub.frequency.toLowerCase() === 'yearly') monthlyPrice = monthlyPrice / 12;
      else if (sub.frequency && sub.frequency.toLowerCase() === 'weekly') monthlyPrice = monthlyPrice * 4.33;
      else if (sub.frequency && sub.frequency.toLowerCase() === 'daily') monthlyPrice = monthlyPrice * 30;

      const cat = sub.category ? sub.category.toUpperCase() : 'OTHER';
      totals[cat] = (totals[cat] || 0) + monthlyPrice;
    });

    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [subscriptions]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border-4 border-black p-3 shadow-neo font-black uppercase tracking-widest text-sm dark:bg-dark-card dark:border-white">
          <p>{`${payload[0].name} : ${formatCurrency(payload[0].value, user?.currency)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-8 h-[400px] flex flex-col bg-warning border-4 border-black shadow-neo dark:bg-warning dark:border-white">
      <div className="flex items-center justify-between mb-8 border-b-4 border-black pb-4 dark:border-black">
        <h3 className="text-2xl font-black uppercase tracking-widest text-black">Categories</h3>
      </div>
      <div className="flex-1 w-full min-h-0">
        {data.length === 0 ? (
           <div className="h-full flex items-center justify-center font-black uppercase text-black">No Active Spending</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="#000"
                strokeWidth={3}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="square"
                formatter={(value) => <span className="font-black text-black text-xs uppercase tracking-widest ml-1">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
