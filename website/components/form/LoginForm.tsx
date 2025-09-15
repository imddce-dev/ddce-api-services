
"use client"; 
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LogIn } from "lucide-react"; // ไอคอนสวยๆ

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    // --- จำลองการเรียก API ---
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // -------------------------

    if (email === "admin@example.com" && password === "password") {
      console.log("Login successful!");
      // TODO: Redirect ไปหน้า Dashboard
      // router.push('/dashboard');
    } else {
      setError("Invalid email or password. Please try again.");
    }
    setIsLoading(false);
  };
  return (
    <div className={cn("flex items-center justify-center", className)} {...props}>
      <Card className="w-full  bg-transparent border-none shadow-none text-white">
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md text-sm">
                <p>{error}</p>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-[16px]">username</Label>
              <Input
                id="username"
                type="username"
                placeholder="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2 mb-4">
              <div className="flex items-center">
                <Label htmlFor="password" className="text-[16px]">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                disabled={isLoading}
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
      </Card>
    </div>
  );
}