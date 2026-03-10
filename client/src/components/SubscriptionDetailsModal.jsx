import { Button } from "../ui/Button"
import { Modal } from "../ui/Modal"
import { useCancelSubscription, useDeleteSubscription, useResumeSubscription } from "../hooks/useSubscriptions"
import { formatCurrency } from "../lib/utils"
import { useAuth } from "../context/AuthContext"

export function SubscriptionDetailsModal({ selectedSub, onClose, onEdit }) {
  const cancelSubscription = useCancelSubscription()
  const deleteSubscription = useDeleteSubscription()
  const resumeSubscription = useResumeSubscription()
  const { user } = useAuth()

  if (!selectedSub) return null;

  const displayCurrency = user?.currency || selectedSub.currency || "USD";

  return (
    <Modal isOpen={!!selectedSub} onClose={onClose} title="SUBSCRIPTION DETAILS">
      <div className="space-y-6 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-black uppercase text-gray-500">Name</p>
            <p className="text-xl font-black uppercase text-black dark:text-white">{selectedSub.name}</p>
          </div>
          <div>
            <p className="text-xs font-black uppercase text-gray-500">Price</p>
            <p className="text-xl font-black text-black dark:text-white">{formatCurrency(selectedSub.price, displayCurrency)}</p>
          </div>
          <div>
            <p className="text-xs font-black uppercase text-gray-500">Frequency</p>
            <p className="text-lg font-black uppercase text-black dark:text-white">{selectedSub.frequency}</p>
          </div>
          <div>
            <p className="text-xs font-black uppercase text-gray-500">Category</p>
            <p className="text-lg font-black uppercase text-black dark:text-white">{selectedSub.category}</p>
          </div>
          <div>
            <p className="text-xs font-black uppercase text-gray-500">Start Date</p>
            <p className="text-lg font-bold text-black dark:text-white">{selectedSub.startDate ? new Date(selectedSub.startDate).toLocaleDateString("en-GB") : 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs font-black uppercase text-gray-500">Next Renewal</p>
            <p className="text-lg font-bold text-black dark:text-white">{selectedSub.renewalDate ? new Date(selectedSub.renewalDate).toLocaleDateString("en-GB") : 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs font-black uppercase text-gray-500">Status</p>
            <p className="text-lg font-black uppercase text-black dark:text-white">{selectedSub.status || 'Active'}</p>
          </div>
        </div>
        
        <div className="pt-6 flex flex-col sm:flex-row justify-end gap-4 border-t-4 border-black dark:border-white mt-4">
          {onEdit && (
            <Button 
              variant="outline" 
              onClick={() => onEdit(selectedSub)} 
              className="uppercase tracking-widest border-2 bg-gray-200 text-black hover:bg-gray-300"
            >
              EDIT
            </Button>
          )}

          {selectedSub.status === 'cancelled' ? (
            <Button 
              variant="outline" 
              onClick={() => {
                resumeSubscription.mutate(selectedSub._id || selectedSub.id, {
                  onSuccess: () => onClose()
                })
              }} 
              disabled={resumeSubscription.isPending}
              className="uppercase tracking-widest border-2 bg-accent text-black hover:bg-yellow-400"
            >
              {resumeSubscription.isPending ? 'RESUMING...' : 'RESUME SUBSCRIPTION'}
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => {
                cancelSubscription.mutate(selectedSub._id || selectedSub.id, {
                  onSuccess: () => onClose()
                })
              }} 
              disabled={cancelSubscription.isPending || selectedSub.status !== 'active'}
              className="uppercase tracking-widest border-2"
            >
              {cancelSubscription.isPending ? 'CANCELLING...' : 'CANCEL SUBSCRIPTION'}
            </Button>
          )}
          <Button 
             onClick={() => {
               deleteSubscription.mutate(selectedSub._id || selectedSub.id, {
                 onSuccess: () => onClose()
               })
             }} 
             disabled={deleteSubscription.isPending}
             className="uppercase tracking-widest border-2 bg-danger hover:bg-red-500"
          >
             {deleteSubscription.isPending ? 'DELETING...' : 'DELETE'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
