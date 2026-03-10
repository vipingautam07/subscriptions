import { useState, useEffect } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Modal } from "../ui/Modal"
import { useAddSubscription, useUpdateSubscription } from "../hooks/useSubscriptions"
import { useAuth } from "../context/AuthContext"

export function SubscriptionFormModal({ isOpen, onClose, selectedSub = null }) {
  const addSubscription = useAddSubscription()
  const updateSubscription = useUpdateSubscription()
  const { user } = useAuth()
  
  const isEditing = !!selectedSub
  
  const [formData, setFormData] = useState({ 
    name: '', 
    price: '', 
    frequency: 'MONTHLY', 
    category: 'ENTERTAINMENT',
    paymentMethod: 'Card',
    currency: user?.currency || 'USD',
    startDate: new Date().toISOString().split('T')[0]
  })

  // Sync formData with selectedSub when editing
  useEffect(() => {
    if (isOpen) {
      if (isEditing && selectedSub) {
        setFormData({
          name: selectedSub.name || '',
          price: selectedSub.price || '',
          frequency: selectedSub.frequency ? selectedSub.frequency.toUpperCase() : 'MONTHLY',
          category: selectedSub.category ? selectedSub.category.toUpperCase() : 'ENTERTAINMENT',
          paymentMethod: selectedSub.paymentMethod || 'Card',
          currency: user?.currency || selectedSub.currency || 'USD',
          startDate: selectedSub.startDate ? new Date(selectedSub.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        });
      } else {
        setFormData({ 
          name: '', 
          price: '', 
          frequency: 'MONTHLY', 
          category: 'ENTERTAINMENT', 
          paymentMethod: 'Card', 
          currency: user?.currency || 'USD', 
          startDate: new Date().toISOString().split('T')[0] 
        });
      }
    }
  }, [isOpen, selectedSub, isEditing]);

  const handleSave = () => {
    const payload = {
      ...formData,
      price: Number(formData.price),
      frequency: formData.frequency.toLowerCase(),
      category: formData.category.toLowerCase()
    };

    const handleSuccess = () => {
      onClose();
    };

    if (isEditing && selectedSub) {
      updateSubscription.mutate({ id: selectedSub._id || selectedSub.id, data: payload }, { onSuccess: handleSuccess });
    } else {
      addSubscription.mutate(payload, { onSuccess: handleSuccess });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "EDIT SUBSCRIPTION" : "ADD NEW SUBSCRIPTION"}>
      <div className="space-y-6 mt-4">
        <div>
          <label className="mb-2 block text-sm font-black uppercase tracking-wider text-black dark:text-white">Name</label>
          <Input placeholder="E.G. NETFLIX" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="mb-2 block text-sm font-black uppercase tracking-wider text-black dark:text-white">Price ({formData.currency})</label>
            <Input type="number" placeholder="0.00" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-black uppercase tracking-wider text-black dark:text-white">Billing Cycle</label>
            <div className="relative">
              <select 
                className="h-12 w-full appearance-none border-2 border-black bg-white px-4 py-2 font-black uppercase tracking-wider text-black focus:outline-none focus:shadow-neo dark:border-white dark:bg-dark-card dark:text-white"
                value={formData.frequency}
                onChange={e => setFormData({...formData, frequency: e.target.value})}
              >
                <option value="MONTHLY">MONTHLY</option>
                <option value="YEARLY">YEARLY</option>
                <option value="WEEKLY">WEEKLY</option>
                <option value="DAILY">DAILY</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-black dark:text-white">
                <div className="h-0 w-0 border-x-4 border-x-transparent border-t-8 border-t-black dark:border-t-white"></div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-black uppercase tracking-wider text-black dark:text-white">Category</label>
          <div className="relative">
            <select 
              className="h-12 w-full appearance-none border-2 border-black bg-white px-4 py-2 font-black uppercase tracking-wider text-black focus:outline-none focus:shadow-neo dark:border-white dark:bg-dark-card dark:text-white"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="ENTERTAINMENT">ENTERTAINMENT</option>
              <option value="EDUCATION">EDUCATION</option>
              <option value="TECHNOLOGY">TECHNOLOGY</option>
              <option value="PRODUCTIVITY">PRODUCTIVITY</option>
              <option value="HEALTH">HEALTH</option>
              <option value="FINANCE">FINANCE</option>
              <option value="OTHER">OTHER</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-black dark:text-white">
              <div className="h-0 w-0 border-x-4 border-x-transparent border-t-8 border-t-black dark:border-t-white"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="mb-2 block text-sm font-black uppercase tracking-wider text-black dark:text-white">Start Date</label>
            <Input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-black uppercase tracking-wider text-black dark:text-white">Payment Method</label>
            <Input placeholder="Card, PayPal..." value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} />
          </div>
        </div>
        
        <div className="pt-6 flex justify-end gap-4 border-t-4 border-black dark:border-white mt-4">
          <Button variant="outline" onClick={onClose} className="uppercase tracking-widest border-2">CANCEL</Button>
          <Button 
             onClick={handleSave} 
             disabled={addSubscription.isPending || updateSubscription.isPending}
             className="uppercase tracking-widest border-2 bg-secondary hover:bg-green-400"
          >
             {(addSubscription.isPending || updateSubscription.isPending) ? 'SAVING...' : 'SAVE'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
