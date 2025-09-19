// components/form/ForgotPasswordForm.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  CheckCircle2,
  Loader2,
  Mail,
  MailCheck,
  MailX,
  SendHorizontal,
  Timer,
  X,
} from "lucide-react";
import { Transition } from "@headlessui/react";

export type ForgotPasswordProps = {
  redirectPath?: string;
  autoRedirectSeconds?: number;
  requestReset?: (email: string, signal?: AbortSignal) => Promise<void>;
  frameless?: boolean;
};

export default function ForgotPasswordForm({
  redirectPath = "/auth/login",
  autoRedirectSeconds = 6,
  requestReset,
  frameless = true,
}: ForgotPasswordProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [countdown, setCountdown] = useState(autoRedirectSeconds);
  const [autoRedirect, setAutoRedirect] = useState(true);

  const aborter = useRef<AbortController | null>(null);

  async function defaultRequest(email: string, signal?: AbortSignal) {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      signal,
    });
    if (!res.ok) {
      let msg = "Request failed";
      try {
        const data = await res.json();
        msg = data?.message || msg;
      } catch {
        try { msg = await res.text(); } catch {}
      }
      throw new Error(msg);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (phase === "sending") return;

    aborter.current?.abort();
    aborter.current = new AbortController();

    setPhase("sending");
    setErrMsg(null);

    try {
      const fn = requestReset || defaultRequest;
      await fn(email, aborter.current.signal);
      setPhase("done");
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setErrMsg(err?.message || "ขณะนี้ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง");
      setPhase("error");
    }
  }

  useEffect(() => {
    if (phase !== "done" || !autoRedirect) return;

    setCountdown(autoRedirectSeconds);
    const end = Date.now() + autoRedirectSeconds * 1000;

    const tick = setInterval(() => {
      const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setCountdown(left);
    }, 250);

    const to = setTimeout(() => {
      router.push(redirectPath);
    }, autoRedirectSeconds * 1000);

    return () => {
      clearInterval(tick);
      clearTimeout(to);
    };
  }, [phase, autoRedirect, autoRedirectSeconds, redirectPath, router]);

  return (
    <div className="relative mx-auto w-[min(650px,94vw)]">
      <div
        className={
          frameless
            ? "px-0"
            : "rounded-2xl border border-slate-700/70 bg-slate-900/60 backdrop-blur-2xl shadow-xl px-6 pb-6"
        }
      >
        <div className="px-0 pb-2 pt-1 text-center">
          <h1 className="text-2xl font-semibold text-slate-100">ลืมรหัสผ่าน</h1>
          <p className="mt-1 text-sm text-slate-300">
            กรอกอีเมลที่ใช้สมัคร ระบบจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้
          </p>
        </div>

        <div>
          {/* ===== Form (idle/sending) ===== */}
          <Transition
            show={phase === "idle" || phase === "sending"}
            appear
            enter="transform transition ease-out duration-300"
            enterFrom="opacity-0 translate-y-2 scale-[0.98]"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transform transition ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 -translate-y-1 scale-[0.98]"
          >
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-[16px] font-extrabold text-white/90"
                >
                  อีเมล (Email)
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    required
                    className="w-full rounded-lg border bg-slate-900/80 pl-10 pr-4 py-2
                               text-slate-100 outline-none transition duration-300 ease-in-out
                               focus:ring-2 border-white/10 focus:border-cyan-400
                               [&:not(:placeholder-shown)]:border-cyan-400 focus:ring-cyan-400/40"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={phase === "sending"}
                className="w-full inline-flex items-center justify-center gap-1.5
                           rounded-lg bg-cyan-500/90 px-3 py-2 text-sm font-semibold text-white
                           cursor-pointer transition-all duration-300 ease-in-out
                           hover:scale-[1.01] hover:bg-cyan-500/80
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                aria-busy={phase === "sending"}
              >
                {phase === "sending" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    กำลังส่งลิงก์…
                  </>
                ) : (
                  <>
                    <SendHorizontal className="h-4 w-4" />
                    ส่งลิงก์รีเซ็ตรหัสผ่าน
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400">
                ถ้าไม่ได้รับอีเมลภายใน 5–10 นาที โปรดตรวจดูใน Junk/Spam
              </p>
            </form>
          </Transition>

          {/* ===== Success ===== */}
          <Transition
            show={phase === "done"}
            appear
            enter="transform transition ease-out duration-300"
            enterFrom="opacity-0 translate-y-2 scale-[0.98]"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transform transition ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 -translate-y-1 scale-[0.98]"
          >
            <div>
              <SuccessPanel
                email={email}
                countdown={countdown}
                totalSeconds={autoRedirectSeconds}
                autoRedirect={autoRedirect}
                onCancelAuto={() => setAutoRedirect(false)}
                onGoNow={() => router.push(redirectPath)}
                onSendAgain={() => {
                  setPhase("idle");
                  setErrMsg(null);
                }}
              />
            </div>
          </Transition>

          {/* ===== Error ===== */}
          <Transition
            show={phase === "error"}
            appear
            enter="transform transition ease-out duration-300"
            enterFrom="opacity-0 translate-y-2 scale-[0.98]"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transform transition ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 -translate-y-1 scale-[0.98]"
          >
            <div>
              <ErrorPanel
                message={errMsg ?? "ขณะนี้ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง"}
                onRetry={() => {
                  setPhase("idle");
                  setErrMsg(null);
                }}
              />
            </div>
          </Transition>

          {/* link back */}
          <div className="mt-6 text-center">
            <Link
              href={redirectPath}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-cyan-200 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-cyan-400/20"
            >
              <ChevronLeft className="h-4 w-4" />
              กลับไปหน้าเข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Sub-components ===== */

function SuccessPanel({
  email,
  countdown,
  totalSeconds,
  autoRedirect,
  onCancelAuto,
  onSendAgain,
  onGoNow,
}: {
  email: string;
  countdown: number;
  totalSeconds: number;
  autoRedirect: boolean;
  onCancelAuto: () => void;
  onSendAgain: () => void;
  onGoNow: () => void;
}) {
  const percent = Math.max(0, Math.min(100, (countdown / totalSeconds) * 100));
  return (
    <div
      className="grid gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-start gap-2">
        <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
        <div className="text-sm">
          <div className="font-semibold text-emerald-200">ส่งลิงก์เรียบร้อย</div>
          <div className="text-emerald-100">
            ลิงก์สำหรับรีเซ็ตรหัสผ่านถูกส่งไปที่{" "}
            <b className="break-all text-white">{email}</b> แล้ว
          </div>
        </div>
      </div>

      <div className="grid gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="flex items-center justify-between text-xs text-slate-200">
          <span className="inline-flex items-center gap-1">
            <Timer className="h-4 w-4 text-emerald-300" />
            {autoRedirect ? (
              <>
                กำลังกลับสู่หน้าล็อกอินใน <b className="tabular-nums">{countdown}s</b>
              </>
            ) : (
              "ยกเลิกการเด้งกลับอัตโนมัติแล้ว"
            )}
          </span>

          {autoRedirect ? (
            <button
              type="button"
              onClick={onCancelAuto}
              className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[11px] font-medium text-slate-100 hover:bg-white/10"
            >
              <X className="h-3.5 w-3.5" />
              ยกเลิก
            </button>
          ) : (
            <button
              type="button"
              onClick={onGoNow}
              className="inline-flex items-center gap-1 rounded-full border border-cyan-300/40 bg-cyan-500/20 px-2 py-1 text-[11px] font-medium text-cyan-100 hover:bg-cyan-500/30"
            >
              ไปหน้าเข้าสู่ระบบตอนนี้
            </button>
          )}
        </div>

        {autoRedirect && (
          <div className="h-2 w-full overflow-hidden rounded-full bg-emerald-900/30">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-[width]"
              style={{ width: `${percent}%` }}
              aria-hidden
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          onClick={onGoNow}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-cyan-500/90 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-500"
        >
          ไปหน้าเข้าสู่ระบบตอนนี้
        </button>
        <button
          onClick={onSendAgain}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-white/10"
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
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="grid gap-4" role="alert" aria-live="assertive" aria-atomic="true">
      <div className="flex items-start gap-3 rounded-2xl border border-rose-400/20 bg-rose-500/15 p-4 text-sm text-rose-100">
        <MailX className="mt-0.5 h-5 w-5 text-rose-300" />
        <div>
          {message}
          <ul className="mt-2 list-inside list-disc text-xs text-rose-200/90">
            <li>ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</li>
            <li>ลองใหม่อีกครั้ง หรือใช้บัญชีอีเมลอื่น</li>
          </ul>
        </div>
      </div>

      <button
        onClick={onRetry}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500/90 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-500"
      >
        <MailCheck className="h-4 w-4" />
        ลองส่งใหม่
      </button>
    </div>
  );
}
