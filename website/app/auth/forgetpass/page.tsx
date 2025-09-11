"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  SendHorizontal,
  MailCheck,
  MailX,
  ChevronLeft,
  Timer,
  X,
  CheckCircle2,
} from "lucide-react";

/**
 * Forgot Password (สวย + ใช้งานได้จริง)
 * - Floating label + ไอคอน + ring gradient
 * - ตรวจรูปแบบอีเมล + แสดง error
 * - แผง success/error
 * - นับถอยหลังกลับ /auth/login พร้อมยกเลิกได้
 */
export default function ForgotPasswordPage() {
  // ===== CONFIG (ทดสอบ error เปลี่ยน true) =====
  const SHOULD_FAIL = false;
  const REDIRECT_AFTER = 6; // วินาที

  // ===== STATE =====
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // นับถอยหลัง + ยกเลิกการเด้ง
  const [countdown, setCountdown] = useState(REDIRECT_AFTER);
  const [autoRedirect, setAutoRedirect] = useState(true);

  const emailOk = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    [email]
  );

  function reset() {
    setState("idle");
    setErrMsg(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailOk || state === "sending") return;
    setState("sending");
    setErrMsg(null);

    // จำลองการเรียก API
    setTimeout(() => {
      if (SHOULD_FAIL) {
        setErrMsg(
          "ขณะนี้ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง"
        );
        setState("error");
      } else {
        setState("done");
      }
    }, 900);
  }

  // เริ่มนับถอยหลังเมื่อส่งสำเร็จ
  useEffect(() => {
    if (state !== "done" || !autoRedirect) return;

    setCountdown(REDIRECT_AFTER);
    const deadline = Date.now() + REDIRECT_AFTER * 1000;

    const tick = setInterval(() => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setCountdown(left);
    }, 250);

    const to = setTimeout(() => {
      router.push("/auth/login");
    }, REDIRECT_AFTER * 1000);

    return () => {
      clearInterval(tick);
      clearTimeout(to);
    };
  }, [state, autoRedirect, router]);

  return (
    <main className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-gradient-to-b from-white to-emerald-50/50 text-slate-900">
      {/* BG : grid + blobs นุ่ม ๆ */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,.05)_1px,transparent_1px)] bg-[size:18px_18px]" />
        <div className="absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute -right-24 bottom-1/5 h-80 w-80 rounded-full bg-teal-200/40 blur-3xl" />
      </div>

      <section
        className="w-[min(560px,94vw)] overflow-hidden rounded-3xl border border-emerald-200/70 bg-white/80 shadow-[0_20px_60px_rgba(16,36,30,.10)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/70"
        role="region"
        aria-label="กู้คืนรหัสผ่าน"
      >
        {/* Accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />

        {/* Header (ปุ่มกลับ) */}
        <header className="flex items-center justify-between px-6 pt-4">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-sm transition hover:bg-emerald-50"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            กลับเข้าสู่ระบบ
          </Link>
        </header>

        <div className="px-6 pb-6 pt-3">
          <div className="mb-4 text-center">
            <h1 className="text-xl font-extrabold tracking-tight">
              ลืมรหัสผ่าน (Forgot Password)
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              กรอกอีเมลที่ใช้สมัคร ระบบจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปให้
            </p>
          </div>

          {/* ==== STATES ==== */}
          {state === "done" ? (
            <SuccessPanel
              email={email}
              countdown={countdown}
              autoRedirect={autoRedirect}
              onCancelAuto={() => setAutoRedirect(false)}
              onSendAgain={reset}
              onGoNow={() => router.push("/auth/login")}
            />
          ) : state === "error" ? (
            <ErrorPanel message={errMsg} onRetry={reset} />
          ) : (
            <form onSubmit={onSubmit} className="grid gap-4" noValidate>
              {/* Email field – crisp floating label + gradient ring */}
              <div className="relative">
                {/* gradient ring */}
                <div className="rounded-2xl p-[1.6px] bg-[linear-gradient(180deg,rgba(15,164,120,.35),rgba(45,212,191,.35))] focus-within:shadow-[0_0_0_6px_rgba(16,185,129,.08)] transition">
                  {/* inner box */}
                  <div
                    className={`relative rounded-[calc(theme(borderRadius.2xl)-1.6px)] bg-white shadow-[inset_0_1px_0_rgba(0,0,0,.03)]
                    ${email.length > 0 && !emailOk ? "ring-2 ring-rose-300/70 bg-rose-50/60" : "ring-0"}`}
                  >
                    <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder=" "
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.currentTarget.value)}
                      aria-invalid={email.length > 0 && !emailOk}
                      aria-describedby="email-help"
                      className="peer w-full rounded-[inherit] bg-transparent px-4 pl-14 pb-2 pt-5 text-sm outline-none"
                    />
                    {/* floating label with white outline */}
                    <label
                      htmlFor="email"
                      className="pointer-events-none absolute left-14 top-3.5 origin-left rounded bg-white px-1 text-sm text-slate-600 transition
                                 peer-focus:top-2.5 peer-focus:text-[13px] peer-focus:text-emerald-700
                                 peer-[&:not(:placeholder-shown)]:top-2.5 peer-[&:not(:placeholder-shown)]:text-[13px]
                                 shadow-[0_0_0_2px_rgb(255_255_255)]"
                    >
                      อีเมล
                    </label>
                  </div>
                </div>

                {/* help / error */}
                <div id="email-help" className="mt-1 min-h-[20px] text-xs">
                  {email.length > 0 && !emailOk ? (
                    <span className="inline-flex items-center gap-1 text-rose-600">
                      <MailX className="h-3.5 w-3.5" />
                      รูปแบบอีเมลไม่ถูกต้อง
                    </span>
                  ) : (
                    <span className="text-slate-500">
                      ใช้อีเมลเดียวกับที่ลงทะเบียน
                    </span>
                  )}
                </div>
              </div>

              {/* ปุ่มส่ง */}
              <button
                type="submit"
                disabled={!emailOk || state === "sending"}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:brightness-[1.05] disabled:cursor-not-allowed disabled:opacity-60"
                aria-busy={state === "sending"}
              >
                {state === "sending" ? (
                  <>
                    <SendHorizontal className="h-4 w-4 animate-pulse" />
                    กำลังส่งลิงก์...
                  </>
                ) : (
                  <>
                    <SendHorizontal className="h-4 w-4" />
                    ส่งลิงก์รีเซ็ตรหัสผ่าน
                  </>
                )}
              </button>

              <div className="mt-1 text-center text-xs text-slate-500">
                ถ้าไม่ได้รับอีเมลภายใน 5–10 นาที โปรดตรวจดูใน Junk/Spam
              </div>
            </form>
          )}

          {/* ลิงก์ล่าง */}
          <div className="mt-6 grid gap-2 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-300/60 bg-white px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm transition hover:bg-emerald-50"
            >
              <ChevronLeft className="h-4 w-4" />
              กลับไปหน้าเข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ========= Panels ========= */

function SuccessPanel({
  email,
  countdown,
  autoRedirect,
  onCancelAuto,
  onSendAgain,
  onGoNow,
}: {
  email: string;
  countdown: number;
  autoRedirect: boolean;
  onCancelAuto: () => void;
  onSendAgain: () => void;
  onGoNow: () => void;
}) {
  const percent = Math.max(0, Math.min(100, (countdown / 6) * 100));

  return (
    <div className="grid gap-4" role="status" aria-live="polite" aria-atomic="true">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
        <div className="mb-2 inline-flex items-center gap-2 text-emerald-700">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-semibold">ส่งลิงก์เรียบร้อย</span>
        </div>
        <p className="text-sm text-emerald-900">
          ลิงก์สำหรับรีเซ็ตรหัสผ่านถูกส่งไปที่ <b className="break-all">{email}</b> แล้ว
        </p>

        <div className="mt-3 grid gap-2 rounded-xl border border-emerald-100 bg-white/70 p-3">
          <div className="flex items-center justify-between text-xs text-slate-700">
            <span className="inline-flex items-center gap-1">
              <Timer className="h-4 w-4 text-emerald-600" />
              {autoRedirect ? (
                <>
                  กำลังพากลับหน้าเข้าสู่ระบบใน <b className="tabular-nums">{countdown}s</b>
                </>
              ) : (
                "ยกเลิกการเด้งกลับอัตโนมัติแล้ว"
              )}
            </span>
            {autoRedirect && (
              <button
                type="button"
                onClick={onCancelAuto}
                className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-2 py-1 text-[11px] font-medium text-emerald-700 transition hover:bg-emerald-50"
              >
                <X className="h-3.5 w-3.5" />
                ยกเลิก
              </button>
            )}
          </div>

          {autoRedirect && (
            <div className="h-2 w-full overflow-hidden rounded-full bg-emerald-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-[width]"
                style={{ width: `${percent}%` }}
                aria-hidden
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          onClick={onGoNow}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:brightness-[1.05]"
        >
          ไปหน้าเข้าสู่ระบบตอนนี้
        </button>
        <button
          onClick={onSendAgain}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          ส่งอีเมลอีกครั้ง
        </button>
      </div>
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
    <div className="grid gap-4" role="alert" aria-live="assertive" aria-atomic="true">
      <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-900/90">
        <MailX className="mt-0.5 h-5 w-5 text-rose-600" />
        <div>
          {message || "ขณะนี้ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง"}
          <ul className="mt-2 list-inside list-disc text-xs">
            <li>ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</li>
            <li>ลองใหม่อีกครั้ง หรือใช้บัญชีอีเมลอื่น</li>
          </ul>
        </div>
      </div>

      <button
        onClick={onRetry}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:brightness-[1.05]"
      >
        ลองส่งใหม่
      </button>
    </div>
  );
}
