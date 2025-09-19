'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login as loginService } from "@/services/authervice";
import { CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Loader2, LogIn, MessageSquareWarning, Timer } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Transition } from '@headlessui/react';
import { PasswordInput } from "./PasswordInput";
import { motion, AnimatePresence } from "framer-motion";

type FormValues = {
  username: string;
  password: string;
};

export default function LoginForm() {
  const {
    register, 
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }, 
  } = useForm<FormValues>({ mode: "onChange" });
  const router = useRouter();
  const [apiError, setApiError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false); 

 const onSubmit: SubmitHandler<FormValues> = async (data) => {
  setApiError("");
  setIsLoading(true);
  try {
    await loginService(data);
    router.push("/dashboard/Dashboard");
  } catch (error: any) {
    setApiError(error.message);

    if (error.errorCode === 'RATE_LIMIT_EXCEEDED') {
      setApiError("login ผิดพลาดเกิน 7 ครั้ง กรุณารอ 5 นาที เพื่อเข้าสู่ระบบอีกครั้ง");
      setIsRateLimited(true);
      setTimeout(() => {
        setIsRateLimited(false);
        setApiError(''); 
      }, 60000); 
    }
  } finally {
    setIsLoading(false);
  }
};

  return (
    <>
      <CardContent>
      <div className="h-auto"> {/* 2. สร้างพื้นที่ว่างสำหรับ Error Message */}
        <AnimatePresence>
          {apiError && (
            <motion.div
              key={apiError} // 3. Key สำหรับ AnimatePresence
              className="flex items-center justify-center gap-2 rounded-md border border-red-500/30 bg-red-500/60 p-1 text-sm  text-white" // 4. ปรับ Style ให้สวยขึ้น
              initial={{ opacity: 0, y: -10, scale: 0.95 }} // 5. Style เริ่มต้น (โปร่งใส, อยู่สูงกว่าปกติเล็กน้อย)
              animate={{ opacity: 1, y: 0, scale: 1 }}     // 6. Style ตอนปรากฏ (ทึบแสง, กลับมาตำแหน่งปกติ)
              exit={{ opacity: 0, y: -10, scale: 0.95 }}      // 7. Style ตอนหายไป
              transition={{ duration: 0.2, ease: "easeInOut" }} // 8. กำหนดความเร็วและสไตล์ของ Animation
            >
              <MessageSquareWarning className="h-4 w-4 flex-shrink-0" />
              <span>{apiError}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="">
            <label htmlFor="username" className="mb-1 block text-[16px] font-extrabold text-white/90">
              ชื่อผู้ใช้ (Username)
            </label>
            <input
                id="username"
                className={`w-full rounded-lg border bg-slate-900/80 
                          px-4 py-2 
                          text-slate-100 outline-none transition duration-700 ease-in-out focus:ring-2 ${
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

          <div className="">
            <label htmlFor="password" className="mb-1 block text-[16px] font-extrabold text-white/90">
              รหัสผ่าน (Password)
            </label>
            <PasswordInput
              register={register}
              errors={errors}
              name="password" 
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
          <div className="flex">
            <a href="/auth/forgot-password" className="ml-auto text-xs text-cyan-300 hover:text-cyan-200">
              ลืมรหัสผ่าน?
            </a>
          </div>
         <Button
            type="submit"
            className="w-full text-white text-[18px] p-4 bg-cyan-500/90 cursor-pointer 
                      transition-all duration-700 ease-in-out 
                      hover:scale-102 hover:bg-cyan-500/50
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100" 
            disabled={isSubmitting || isRateLimited} 
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                กำลังลงชื่อเข้าใช้...
              </>
            ) : isRateLimited ? ( 
              <>
                <Timer className="mr-2 h-4 w-4 " />
                โปรดลองอีกครั้งในภายหลัง
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                ลงชื่อเข้าใช้
              </>
            )}
          </Button>
        </form>
        <div className="flex flex-col md:mt-4 text-start">
          <div className="text-sm text-slate-400">
            ยังไม่มีบัญชี ?{" "}
            <a href="/auth/register" className="text-cyan-300 underline-offset-2 hover:text-cyan-200 hover:underline">
              สมัครสมาชิก
            </a>
          </div>
        </div>
      </CardContent>

      
    </>
  );
}