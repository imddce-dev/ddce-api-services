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
    <CardContent>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        {error && (
          <div style={{ color: 'red', marginTop: '8px' }}>{error}</div>
        )}
        <CardFooter className="flex flex-col gap-4 ">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="mr-2 h-4 w-4" />
            )}
            {loading ? "ลงชื่อเข้าใช้..." : "ลงชื่อเข้าใช้"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <a href="#" className="underline">
              Sign up
            </a>
          </div>
        </CardFooter>
      </form>
    </CardContent>
  )    
}