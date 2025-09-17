'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login as loginService } from "@/services/authervice";
import { CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Loader2, LogIn } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Transition } from '@headlessui/react';

type FormValues = {
  username: string;
  password: string;
};

export default function LoginForm() {
  const {
    register, // เปลี่ยนจาก 'login' เป็น 'register'
    handleSubmit,
    formState: { errors, isSubmitting }, 
  } = useForm<FormValues>({ mode: "onChange" });

  const router = useRouter();
  const [apiError, setApiError] = useState<string>("");


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setApiError("");
    console.log(data)
    try {
      const result = await loginService(data);
      if (result && result.success) {
        alert("login Successfully");
        router.push("/auth/register");
      } else {
        setApiError(result?.message || "An unknown error occurred.");
      }
    } catch {
      setApiError("Failed to connect to the server. Please try again later.");
    }
  };

  return (
    <>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-1 block text-[16px] font-extrabold text-white/90">
              ชื่อผู้ใช้ (Username)
            </label>
            <input
              id="username"
              className={`h-9 w-full rounded-lg border bg-slate-900/80 px-3 text-slate-100 outline-none transition duration-700 ease-in-out focus:ring-2 ${
                errors.username
                  ? 'border-red-400 focus:ring-red-400/40'
                  : 'border-white/10 focus:border-cyan-400 [&:not(:placeholder-shown)]:border-cyan-400 focus:ring-cyan-400/40'
              }`}
              placeholder="username"
              {...register("username", { required: "กรุณาป้อนชื่อผู้ใช้ให้ถูกต้อง" })}
            />
            <Transition
              show={!!errors.username}
              enter="transition-opacity duration-700" enterFrom="opacity-0" enterTo="opacity-100"
              leave="transition-opacity duration-700" leaveFrom="opacity-100" leaveTo="opacity-0"
            >
              <p className="mt-1 text-[12px] font-bold text-red-400" role="alert">
                {errors.username?.message}
              </p>
            </Transition>
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-[16px] font-extrabold text-white/90">
              รหัสผ่าน (Password)
            </label>
            <input
              id="password"
              type="password"
              className={`h-9 w-full rounded-lg border bg-slate-900/80 px-3 text-slate-100 outline-none transition duration-700 ease-in-out focus:ring-2 ${
                errors.password
                  ? 'border-red-400 focus:ring-red-400/40'
                  : 'border-white/10 focus:border-cyan-400 [&:not(:placeholder-shown)]:border-cyan-400 focus:ring-cyan-400/40'
              }`}
              placeholder="Password"
              {...register("password", { required: "กรุณาป้อนรหัสผ่านให้ถูกต้อง" })}
            />
            <Transition
              show={!!errors.password}
              enter="transition-opacity duration-700" enterFrom="opacity-0" enterTo="opacity-100"
              leave="transition-opacity duration-700" leaveFrom="opacity-100" leaveTo="opacity-0"
            >
              <p className="mt-1 text-[12px] font-bold text-red-400" role="alert">
                {errors.password?.message}
              </p>
            </Transition>
          </div>

          {apiError && <div className="text-sm text-rose-300">{apiError}</div>}
          <div className="flex">
            <a href="/auth/forgot-password" className="ml-auto text-xs text-cyan-300 hover:text-cyan-200">
              ลืมรหัสผ่าน?
            </a>
          </div>

          <Button type="submit" className="w-full text-white/90 text-[16px] p-1" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                กำลังลงชื่อเข้าใช้...
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

      {/* <CardFooter className="flex flex-col gap-2">
        <div className="text-center text-sm text-slate-400">
          ยังไม่มีบัญชี?{" "}
          <a href="/auth/register" className="text-cyan-300 underline-offset-2 hover:text-cyan-200 hover:underline">
            สมัครสมาชิก
          </a>
        </div>
      </CardFooter> */}
    </>
  );
}