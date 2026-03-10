import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Hexagon, Lock, Mail } from "lucide-react"
import { useState } from "react"
import api from "../api/api.js"
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"
import { useAuth } from "../context/AuthContext.jsx";

export function AuthPage({ isLogin = true }) {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post(isLogin ? "/auth/signin" : "/auth/signup", formData);
      console.log("form submitted", response.data.data.user); //log data
      login(response.data.data.user)
      toast.success(isLogin ? "Login successful" : "Signup successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12 dark:bg-dark-bg sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Neobrutalist background decorations */}
      <div className="absolute top-10 left-10 w-48 h-48 border-4 border-black bg-primary shadow-neo rotate-[-10deg] opacity-50 dark:border-white dark:shadow-neo-dark"></div>
      <div className="absolute top-20 right-20 w-32 h-32 border-4 border-black bg-secondary shadow-neo rotate-[15deg] opacity-50 dark:border-white dark:shadow-neo-dark"></div>
      <div className="absolute bottom-10 left-1/4 w-64 h-24 border-4 border-black bg-accent shadow-neo rotate-[5deg] opacity-50 dark:border-white dark:shadow-neo-dark"></div>

      <div className="w-full max-w-md space-y-8 bg-white dark:bg-dark-card p-10 border-4 border-black shadow-neo-lg relative z-10 dark:border-white dark:shadow-neo-dark">
        <div>
          <div className="mx-auto flex h-20 w-20 items-center justify-center border-4 border-black bg-primary shadow-neo dark:border-white dark:shadow-neo-dark">
            <Hexagon className="h-10 w-10 text-black stroke-[3] dark:text-white" />
          </div>
          <h2 className="mt-8 text-center text-4xl font-black uppercase tracking-widest text-black dark:text-white">
            {isLogin ? "Sign In" : "Sign Up"}
          </h2>
          <p className="mt-4 text-center text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
            {isLogin ? "Or " : "Already have an account? "}
            <Link to={isLogin ? "/signup" : "/signin"} className="text-black bg-warning px-2 py-0.5 border-2 border-black inline-block mt-1 shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all dark:bg-warning dark:text-black">
              {isLogin ? "SIGN UP FOR FREE" : "SIGN IN HERE"}
            </Link>
          </p>
        </div>
        
        <form className="mt-10 space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
          <div className="space-y-6">
            {!isLogin && (
              <div className="relative">
                <label className="mb-2 block text-sm font-black uppercase tracking-widest text-black dark:text-white">Full Name</label>
                <Input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="JOHN DOE" />
              </div>
            )}
            <div className="relative group">
              <label className="mb-2 block text-sm font-black uppercase tracking-widest text-black dark:text-white">Email Address</label>
              <div className="absolute bottom-3 left-4 flex items-center pointer-events-none text-black dark:text-white">
                <Mail className="h-6 w-6 stroke-[3]" />
              </div>
              <Input id="email-address" name="email" type="email" autoComplete="email" required className="pl-12" value={formData.email} onChange={handleChange} placeholder="HELLO@EXAMPLE.COM" />
            </div>
            <div className="relative group">
              <label className="mb-2 block text-sm font-black uppercase tracking-widest text-black dark:text-white">Password</label>
              <div className="absolute bottom-3 left-4 flex items-center pointer-events-none text-black dark:text-white">
                <Lock className="h-6 w-6 stroke-[3]" />
              </div>
              <Input id="password" name="password" type="password" autoComplete="current-password" required className="pl-12" value={formData.password} onChange={handleChange} placeholder="••••••••" />
            </div>
          </div>

          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-5 w-5 border-2 border-black appearance-none checked:bg-primary checked:border-black focus:ring-0 dark:border-white dark:bg-dark-card dark:checked:bg-primary checked:after:content-['✓'] checked:after:text-black checked:after:font-bold checked:after:flex checked:after:items-center checked:after:justify-center" />
                <label htmlFor="remember-me" className="ml-3 block text-sm font-bold uppercase tracking-wider text-black dark:text-white">Remember me</label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-bold text-black border-b-2 border-black hover:bg-danger dark:text-white dark:border-white transition-colors uppercase tracking-wider">Forgot password?</a>
              </div>
            </div>
          )}

          <div>
            <Button type="submit" disabled={loading} className="w-full h-14 text-xl tracking-widest"
            >
              {loading ? "Loading..." :isLogin ? "SIGN IN" : "SIGN UP"}
            </Button>
          </div>
          
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-4 border-black dark:border-white" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 font-black uppercase tracking-widest text-black border-4 border-black dark:bg-dark-card dark:text-white dark:border-white">OR CONTINUE WITH</span>
              </div>
            </div>

            <div className="mt-8">
              <Button type="button" variant="outline" className="w-full gap-3 h-14 bg-white dark:bg-black font-black tracking-widest">
                 <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 48 48">
<path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
</svg>
                 <span className="text-lg">Google</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
