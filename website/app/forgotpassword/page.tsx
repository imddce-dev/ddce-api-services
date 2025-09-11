"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  // ====== CONFIG สำหรับทดสอบ ======
  // ตั้ง true เพื่อจำลอง error โดยไม่เรียก backend จริง
  const SHOULD_FAIL = false;

  // ====== STATE ======
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  function reset() {
    setState("idle");
    setErrMsg(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailOk || state === "sending") return;

    setState("sending");
    setErrMsg(null);

    // ====== จำลองการส่ง (แทนการเรียก API จริง) ======
    setTimeout(() => {
      if (SHOULD_FAIL) {
        setErrMsg("ขณะนี้ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง");
        setState("error");
      } else {
        setState("done");
      }
    }, 900);
  }

  return (
    <main className="relative grid min-h-[100svh] place-items-center bg-white text-slate-900 overflow-hidden p-4">
      {/* BG เบา ๆ ให้เข้าธีม */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[-20%] -z-10 blur-[14px]"
        style={{
          background:
            "radial-gradient(32vmax 32vmax at 10% 20%, rgba(191,231,218,.14), transparent 60%), radial-gradient(38vmax 38vmax at 90% 15%, rgba(136,205,189,.10), transparent 60%), radial-gradient(30vmax 30vmax at 30% 90%, rgba(207,236,228,.10), transparent 60%)",
        }}
      />

      <section
        className="w-[min(520px,94vw)] rounded-2xl border-2 border-emerald-200/70 bg-white/85 p-6 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-white/78"
        role="region"
        aria-label="กู้คืนรหัสผ่าน"
      >
        {/* โลโก้ */}
        <div className="mb-2 grid place-items-center">
          <img
            src="/ddcelogo.png"
            alt="DDCE"
            className="h-14 w-auto object-contain drop-shadow-sm"
          />
        </div>

        <header className="mb-3 text-center">
          <h1 className="text-xl font-extrabold tracking-tight">
            ลืมรหัสผ่าน (Forgot Password)
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            กรอกอีเมลที่ใช้สมัคร ระบบจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปให้
          </p>
        </header>

        {/* ====== STATES ====== */}
        {state === "done" ? (
          <SuccessPanel email={email} onSendAgain={reset} />
        ) : state === "error" ? (
          <ErrorPanel message={errMsg} onRetry={reset} />
        ) : (
          <form onSubmit={onSubmit} className="grid gap-4" noValidate>
            {/* Email field */}
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                placeholder=" "
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                className="peer w-full rounded-xl border border-slate-200 bg-white px-4 pb-2 pt-5 text-sm outline-none ring-0 transition focus:border-emerald-400 focus:shadow-[0_0_0_4px_rgba(16,185,129,.16)]"
              />
              <label
                htmlFor="email"
                className="pointer-events-none absolute left-4 top-2.5 origin-left bg-white px-1 text-[13px] text-slate-500 transition peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2.5 peer-focus:text-[13px] peer-focus:text-emerald-600"
              >
                อีเมล
              </label>
            </div>

            {/* ปุ่มส่ง */}
            <button
              type="submit"
              disabled={!emailOk || state === "sending"}
              className="mt-1 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-2.5 font-semibold text-white shadow-md transition hover:brightness-[1.05] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {state === "sending" ? "กำลังส่งลิงก์..." : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
            </button>

            <div className="mt-1 text-center text-xs text-slate-500">
              ถ้าไม่ได้รับอีเมลภายใน 5–10 นาที โปรดตรวจดูใน Junk/Spam
            </div>
          </form>
        )}

        {/* ลิงก์ล่างการ์ด */}
        <div className="mt-5 grid gap-2 text-center">
          <Link
            href="/login"
            className="inline-block rounded-xl border border-emerald-300/60 bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
          >
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
          <Link
            href="/register"
            className="text-xs font-medium text-emerald-700 underline-offset-4 hover:underline"
          >
            ยังไม่มีบัญชี? สมัครใช้งาน
          </Link>
        </div>
      </section>
    </main>
  );
}

/* ====== Panels ====== */
function SuccessPanel({
  email,
  onSendAgain,
}: {
  email: string;
  onSendAgain: () => void;
}) {
  return (
    <div className="grid gap-4">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
        <p className="text-sm text-emerald-900">
          เราได้ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปที่{" "}
          <b className="break-all">{email}</b> แล้ว
        </p>
        <ul className="mt-2 list-inside list-disc text-xs text-emerald-800/90">
          <li>ลิงก์มีอายุจำกัด โปรดดำเนินการภายในเวลาที่กำหนด</li>
          <li>ถ้าไม่เห็นอีเมล โปรดตรวจกล่อง Junk/Spam</li>
        </ul>
      </div>

      <button
        onClick={onSendAgain}
        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        ส่งใหม่อีกครั้ง
      </button>
    </div>
  );
}

function ErrorPanel({
  message,
  onRetry,
}: {
  message: string | null;
  onRetry: () => void;
}) {
  return (
    <div className="grid gap-4">
      <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-sm text-rose-900/90">
        {message || "ขณะนี้ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง"}
        <ul className="mt-2 list-inside list-disc text-xs">
          <li>ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</li>
          <li>ลองใหม่อีกครั้ง หรือใช้บัญชีอีเมลอื่น</li>
        </ul>
      </div>

      <button
        onClick={onRetry}
        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:brightness-[1.05]"
      >
        ลองส่งใหม่
      </button>
    </div>
  );
}
