"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface RequestOtpProps {
  length?: number;
  /** ถ้ามี จะถูกเรียกหลังยืนยันสำเร็จ (ไม่ต้องคืนค่า) */
  onSuccess?: () => void;
  /** ref จาก backend (โชว์หน้าจอและส่งไปตรวจสอบ) */
  refCode?: string;
  /** เปลี่ยน endpoint ได้ */
  verifyUrl?: string; // default: /api/auth/verify-otp
}

export default function OtpForm({
  length = 6,
  onSuccess,
  refCode = "ABC123",
  verifyUrl = "/api/auth/verify-otp",
}: RequestOtpProps) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const [timeLeft, setTimeLeft] = useState(300);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    setErrorMsg(""); // เคลียร์ error เมื่อพิมพ์ใหม่

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      submitOtp();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const resetInputsWithShake = () => {
    setDigits(Array(length).fill(""));
    inputsRef.current[0]?.focus();
    // เติมคลาสสั่นเบา ๆ
    inputsRef.current.forEach((el) => {
      if (!el) return;
      el.classList.add("animate-[shake_0.2s_ease-in-out_1]");
      setTimeout(() => el.classList.remove("animate-[shake_0.2s_ease-in-out_1]"), 250);
    });
  };

  const submitOtp = async () => {
    const code = digits.join("");
    if (code.length !== length) {
      setErrorMsg("กรุณากรอก OTP ให้ครบทุกหลัก");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch(verifyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // หมายเหตุ: ไม่ต้องส่ง refCode ก็ได้ ถ้า backend อ่านจาก cookie อยู่แล้ว
        body: JSON.stringify({ code, ref: refCode }),
        credentials: "include", // ให้ส่ง cookie OtpToken ไปด้วย
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data?.success === false) {
        setErrorMsg(data?.message || "รหัสไม่ถูกต้อง หรือหมดอายุ");
        resetInputsWithShake();
        return;
      }

      // สำเร็จ
      onSuccess?.();
      router.replace("/"); // เปลี่ยนเส้นทางตามต้องการ
    } catch (e) {
      setErrorMsg("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ ลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  const expired = timeLeft <= 0;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white text-center">Verification OTP</h2>

      <p className="mt-2 text-center text-slate-300">
        ระบบได้ส่งรหัส OTP ไปยัง <span className="font-semibold">thir***@gmail.com</span>
      </p>
      <p className="mt-1 text-center text-sm text-amber-400">
        โปรดยืนยันภายใน <span className="font-bold">{formatTime(timeLeft)}</span>
      </p>

      {/* Error message */}
      {errorMsg && (
        <div className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          {errorMsg}
        </div>
      )}

      <div className="mt-6 flex justify-center gap-3">
        {digits.map((digit, i) => (
          <input
            key={i}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={expired || isSubmitting}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleBackspace(e, i)}
            ref={(el: HTMLInputElement | null) => {
              inputsRef.current[i] = el;
            }}
            className={[
              "h-14 w-12 rounded-lg border text-center text-xl font-semibold shadow-sm focus:outline-none",
              expired
                ? "bg-slate-700 text-slate-500 border-slate-600"
                : "bg-slate-800 text-white border-slate-600 focus:ring-2",
              errorMsg
                ? "border-rose-500 focus:ring-rose-500"
                : "focus:border-cyan-400 focus:ring-cyan-500",
            ].join(" ")}
          />
        ))}
      </div>

      <p className="mt-1 text-center text-sm text-slate-400">
        Ref: <span className="font-mono font-bold">{refCode}</span>
      </p>

      <button
        onClick={submitOtp}
        disabled={expired || isSubmitting}
        className={[
          "mt-6 w-full rounded-lg px-4 py-2 text-white font-medium shadow-md transition",
          expired || isSubmitting
            ? "cursor-not-allowed bg-slate-600"
            : "bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600",
        ].join(" ")}
      >
        {expired ? "OTP หมดเวลา" : isSubmitting ? "กำลังตรวจสอบ..." : "ยืนยัน"}
      </button>

      {expired && (
        <p className="mt-4 text-center text-sm text-slate-400">
          รหัสหมดเวลาแล้ว{" "}
          <button
            onClick={() => {
              setDigits(Array(length).fill(""));
              setTimeLeft(300);
              router.push("/auth/login");
            }}
            className="text-cyan-400 hover:underline"
          >
            ล็อคอินอีกครั้ง
          </button>
        </p>
      )}

      {/* keyframes สั่นเบา ๆ (ถ้าคุณไม่มีใน global.css ให้เพิ่มเอง) */}
      <style jsx global>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-2px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
