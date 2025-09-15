'use client'
import { useRouter } from "next/navigation"
import { useState } from "react"
import {login as loginService} from '@/services/authervice'

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
          router.push('/dashbord')
        }else{
          setError(result?.message || 'An unknown error occurred.');
        }
      }catch(error){
        setError('Failed to connect to the server.');
      } finally{
        setLoading(false)
      }
  }

  return(
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
          </CardContent>
          <CardFooter className="flex flex-col gap-4 ">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "ลงชื่อเข้าใช้..." : "ลงชื่อเข้าใช้"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline">
                Sign up
              </a>
            </div>
          </CardFooter>
        </form>
  )

}