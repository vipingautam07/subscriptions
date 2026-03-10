import { Card } from "../ui/Card"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Select } from "../ui/Select"
import { useAuth } from "../context/AuthContext"
import { useState, useEffect } from "react"
import { userService } from "../api/user.service"
import toast from "react-hot-toast"

export function SettingsPage() {
  const { user, login } = useAuth()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currency: 'USD',
    profilePicture: 'https://i.pinimg.com/736x/92/b4/e7/92b4e7c57de1b5e1e8c5e883fd915450.jpg'
  })
  
  const [isSaving, setIsSaving] = useState(false)

  // Initialize form when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currency: user.currency || 'USD',
        profilePicture: user.profilePicture || 'https://i.pinimg.com/736x/92/b4/e7/92b4e7c57de1b5e1e8c5e883fd915450.jpg'
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCurrencyChange = (e) => {
    setFormData(prev => ({ ...prev, currency: e.target.value }))
  }

  const handleSave = async () => {
    if (!user?._id) return;
    try {
      setIsSaving(true);
      const res = await userService.updateUser(user._id, formData);
      login(res.data); // Update global auth state
      toast.success("Settings updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  }
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-l-8 border-warning pl-4">
        <h1 className="text-4xl font-black uppercase tracking-widest text-black dark:text-white">Settings</h1>
        <p className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mt-2">Manage your account settings and preferences.</p>
      </div>

      <div className="grid gap-10">
        <Card className="p-8 border-4">
          <h2 className="text-2xl font-black uppercase tracking-widest text-black dark:text-white mb-8 border-b-4 border-black pb-4 dark:border-white">Profile Info</h2>
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <div className="shrink-0 flex flex-col items-center gap-4">
              <img
                src={formData.profilePicture || "https://i.pinimg.com/736x/92/b4/e7/92b4e7c57de1b5e1e8c5e883fd915450.jpg"}
                alt="Profile picture"
                className="h-32 w-32 border-4 border-black shadow-neo dark:border-white dark:shadow-neo-dark grayscale object-cover"
              />
            </div>
            <div className="flex-1 space-y-6 w-full">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-black uppercase tracking-wider text-black dark:text-white">Full Name</label>
                  <Input 
                    name="name"
                    value={formData.name} 
                    onChange={handleChange}
                    className="uppercase font-black" 
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-black uppercase tracking-wider text-black dark:text-white">Email Address</label>
                <Input 
                  name="email"
                  value={formData.email} 
                  onChange={handleChange}
                  type="email" 
                  className="uppercase font-black bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400" 
                  readOnly
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-black uppercase tracking-wider text-black dark:text-white">Profile Picture URL</label>
                <Input 
                  name="profilePicture"
                  value={formData.profilePicture} 
                  onChange={handleChange}
                  type="url"
                  placeholder="Paste an image URL here..."
                  className="font-black" 
                />
              </div>
            </div>
          </div>
          <div className="mt-10 flex justify-end">
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="uppercase tracking-widest h-14 bg-primary text-xl border-4"
            >
              {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
            </Button>
          </div>
        </Card>

        <Card className="p-8 border-4">
          <h2 className="text-2xl font-black uppercase tracking-widest text-black dark:text-white mb-8 border-b-4 border-black pb-4 dark:border-white">Preferences</h2>
          <div className="space-y-8">
             <div className="flex items-center justify-between">
                <div>
                   <h4 className="text-lg font-black uppercase tracking-widest text-black dark:text-white">Email Alerts</h4>
                   <p className="text-sm font-bold uppercase tracking-wider text-gray-500 mt-1 dark:text-gray-400">Receive alerts before a subscription renews.</p>
                </div>
                {/* Custom Neobrutalist Toggle */}
                <button className="w-16 h-8 bg-secondary border-4 border-black shadow-neo-sm relative transition-colors focus:outline-none dark:border-white">
                   <div className="w-6 h-6 bg-white border-2 border-black absolute top-0 right-0 block transition-transform dark:border-black"></div>
                </button>
             </div>
             <div className="h-1 bg-black dark:bg-white" />
             <div className="flex items-center justify-between">
                <div>
                   <h4 className="text-lg font-black uppercase tracking-widest text-black dark:text-white">Currency</h4>
                   <p className="text-sm font-bold uppercase tracking-wider text-gray-500 mt-1 dark:text-gray-400">Currency used for dashboard totals.</p>
                </div>
                <Select 
                  className="w-40 font-black uppercase tracking-widest border-4" 
                  value={formData.currency} 
                  onChange={handleCurrencyChange}
                  options={[
                    { value: 'USD', label: 'USD ($)' },
                    { value: 'EUR', label: 'EUR (€)' },
                    { value: 'GBP', label: 'GBP (£)' },
                    { value: 'INR', label: 'INR (₹)' }
                  ]}
                />
             </div>
          </div>
        </Card>

        <Card className="p-8 border-4 border-danger bg-white dark:bg-dark-card shadow-[8px_8px_0px_rgba(255,107,107,1)]">
          <h2 className="text-2xl font-black uppercase tracking-widest text-danger mb-4">Danger Zone</h2>
          <p className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-gray-300 mb-8 border-l-4 border-danger pl-4">Permanently delete your account and all of your data. This cannot be undone.</p>
          <Button variant="danger" className="uppercase tracking-widest h-14 border-4 group">
            <span className="group-hover:tracking-[0.2em] transition-all">DELETE ACCOUNT</span>
          </Button>
        </Card>
      </div>
    </div>
  )
}
