'use client'
import { useRouter } from "next/navigation"
import { useState } from "react"
import {login as loginService} from '@/services/authervice'
import { CardContent, CardFooter } from "../ui/card"
import { Button } from "../ui/button"
import { Loader2, LogIn } from "lucide-react"

export default function LoginForm(){
  const router = useRouter()
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError('');
      setLoading(true)
      try{
        const result = await loginService(username, password)
        if (result && result.success){
          alert('login Successfully')
          router.push('/dashboard')
        }else{
          setError(result.message || 'An unknown error occurred.');
        }
      }catch(error){
        setError('Failed to connect to the server. Please try again later.');
      } finally{
        setLoading(false)
      }
  }
return(
   <CardContent className="space-y-5">
  <form onSubmit={handleSubmit} className="space-y-4">
    {/* Username */}
    <div className="space-y-1.5">
      <label htmlFor="username" className="text-sm text-slate-200">
        ชื่อผู้ใช้
      </label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
        placeholder="Enter your username"
        required
        autoComplete="username"
        className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-slate-100 placeholder:text-slate-400 outline-none ring-1 ring-inset ring-white/5 focus:ring-2 focus:ring-cyan-400/40"
      />
    </div>

    {/* Password + forgot link */}
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor="password" className="text-sm text-slate-200">
          รหัสผ่าน
        </label>
      </div>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        placeholder="Enter your password"
        required
        autoComplete="current-password"
        className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-slate-100 placeholder:text-slate-400 outline-none ring-1 ring-inset ring-white/5 focus:ring-2 focus:ring-cyan-400/40"
      />
    </div>
 <div className="text-right">
  <a
    href="/auth/forgot-password"
    className="inline-block text-xs text-cyan-300 hover:text-cyan-200"
  >
    ลืมรหัสผ่าน?
  </a>
</div>
    {/* Error */}
    {error && (
      <div
        role="alert"
        className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
      >
        {error}
      </div>
    )}

    <CardFooter className="mt-2 flex flex-col gap-4 p-0">
      <Button
        type="submit"
        className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-cyan-500/20 hover:from-cyan-500/90 hover:to-emerald-500/90"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ลงชื่อเข้าใช้...
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            ลงชื่อเข้าใช้
          </>
        )}
      </Button>

      <div className="text-center text-sm text-slate-400">
        ยังไม่มีบัญชี?{" "}
        <a href="/auth/register" className="text-cyan-300 underline-offset-2 hover:text-cyan-200 hover:underline">
          สมัครสมาชิก
        </a>
      </div>
    </CardFooter>
  </form>
</CardContent>
  )    
}