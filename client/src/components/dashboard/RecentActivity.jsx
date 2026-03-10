import { SubscriptionCard } from "../SubscriptionCard"
import { useNavigate } from "react-router-dom"

export function RecentActivity({ subscriptions, onCardClick }) {
  const navigate = useNavigate();
  // Sort by newest first, taking the latest 3
  const recentSubs = [...subscriptions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b-4 border-black pb-4 dark:border-white">
        <h2 className="text-2xl font-black uppercase tracking-widest text-black dark:text-white">Recent Activity</h2>
        <button 
          className="text-sm font-black uppercase tracking-widest text-black border-2 border-black px-3 py-1 bg-warning hover:bg-yellow-300 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all dark:border-white dark:text-black dark:bg-warning" 
          onClick={() => navigate('/subscriptions')}
        >
          View All
        </button>
      </div>
      <div className="space-y-4">
        {recentSubs.length === 0 ? (
           <div className="p-4 border-4 border-black bg-white shadow-neo dark:bg-dark-card dark:border-white font-black uppercase text-center">No recent activity</div>
        ) : (
           recentSubs.map(sub => (
             <SubscriptionCard 
               key={sub._id || sub.id} 
               {...sub} 
               className="bg-white/90 dark:bg-dark-card/90" 
               onClick={() => onCardClick(sub)} 
             />
           ))
        )}
      </div>
    </div>
  )
}
