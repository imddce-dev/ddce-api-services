'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login as loginService } from "@/services/authervice";
import { CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Loader2, LogIn } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await loginService(username, password);
      if (result && result.success) {
        alert("login Successfully");
        router.push("/dashboard");
      } else {
        setError(result?.message || "An unknown error occurred.");
      }
    } catch {
      setError("Failed to connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-1 block text-sm text-slate-300">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 outline-none focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/30"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-slate-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 outline-none focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/30"
            />
          </div>

          {error && <div className="text-sm text-rose-300">{error}</div>}

          {/* ลิงก์ลืมรหัสผ่านชิดขวา */}
          <div className="flex">
            <a
              href="/auth/forgot-password"
              className="ml-auto text-xs text-cyan-300 hover:text-cyan-200"
            >
              ลืมรหัสผ่าน?
            </a>
          </div>

          {/* ปุ่ม submit อยู่ใน form เพื่อกด Enter ได้ */}
          <Button type="submit" className="w-full" disabled={loading}>
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
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <div className="text-center text-sm text-slate-400">
          ยังไม่มีบัญชี?{" "}
          <a
            href="/auth/register"
            className="text-cyan-300 underline-offset-2 hover:text-cyan-200 hover:underline"
          >
            สมัครสมาชิก
          </a>
        </div>
      </CardFooter>
    </>
  );
}
