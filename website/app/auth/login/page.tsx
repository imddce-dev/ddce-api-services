'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Lock, User, ArrowRight, Shield, KeyRound } from 'lucide-react';

/* ===== เส้น EKG วิ่งแบบ dashed เรืองแสง (อยู่ "หลัง" การ์ดฟอร์ม) ===== */
function EKGLine({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1600 160" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="ekg-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#34d399" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <path
        d="M0,80 L120,80 170,30 210,130 250,80 420,80 460,28 500,132 540,80 820,80 860,30 900,130 940,80 1180,80 1220,28 1260,132 1300,80 1600,80"
        fill="none"
        stroke="url(#ekg-g)"
        strokeWidth={3}
        className="[stroke-dasharray:12_18] motion-safe:[animation:ekgDash_6s_linear_infinite] opacity-35 [filter:drop-shadow(0_0_6px_rgba(34,211,238,.35))]"
      />
      <style>{`@keyframes ekgDash{to{stroke-dashoffset:-400}}`}</style>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const userOk = useMemo(() => username.trim().length >= 4, [username]);
  const pwOk = useMemo(() => pw.trim().length >= 6, [pw]);
  const canSubmit = userOk && pwOk && !sending;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSending(true);
    setErr(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pw }),
      });
      if (res.ok) router.push('/');
      else setErr((await res.text()) || 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่');
    } catch {
      setErr('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="relative grid h-dvh place-items-center">
      {/* เส้นพาดกลางจอ — อยู่หลังฟอร์ม และหน้าจอไม่เลื่อน */}
      <EKGLine className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 w-full -translate-y-1/2" />

      {/* ===== กล่องคอนเทนท์: 1 คอลัมน์บนจอเล็ก / 2 คอลัมน์ตั้งแต่ lg ขึ้นไป ===== */}
      <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 items-center gap-8 px-4 lg:grid-cols-5">
        {/* แบรนด์/ข้อมูล (ซ่อนบนจอเล็กเพื่อไม่เบียดฟอร์ม) */}
        <Card className="hidden rounded-2xl border-slate-700/60 bg-slate-900/40 backdrop-blur lg:col-span-2 lg:block">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500 to-emerald-500 text-sm font-bold text-white">DD</span>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-white">DDCE API</div>
                <div className="text-xs text-slate-400">IM-DDCE • v1 • Public Beta</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <h2 className="text-2xl font-extrabold leading-snug">
              เข้าสู่ระบบ<br />เพื่อเชื่อมต่อข้อมูล
              <span className="ml-2 bg-gradient-to-r from-cyan-300 via-emerald-200 to-amber-200 bg-clip-text text-transparent">เหตุการณ์สุขภาพ</span>
            </h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Shield className="h-4 w-4 text-cyan-300" /> OAuth2 / OIDC • TLS 1.3</li>
              <li className="flex items-center gap-2"><KeyRound className="h-4 w-4 text-emerald-300" /> RBAC ตามบทบาท/หน่วยงาน</li>
            </ul>
            <p className="pt-2 text-xs text-slate-400">
              ยังไม่มีบัญชี? <Link href="/register" className="text-cyan-300 hover:text-cyan-200">สมัครใช้งาน</Link>
            </p>
          </CardContent>
        </Card>

        {/* ฟอร์มล็อกอิน */}
        <div className="relative w-[min(560px,94vw)] justify-self-center lg:col-span-3 lg:w-auto lg:justify-self-stretch">
          {/* halo glow */}
          <div className="absolute -inset-0.5 -z-10 rounded-2xl bg-gradient-to-r from-cyan-500/40 via-emerald-400/40 to-amber-300/40 opacity-40 blur-xl" />
          <Card className="rounded-2xl border-slate-700/70 bg-slate-900/50 backdrop-blur">
            <CardHeader className="pb-2">
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="secondary" className="bg-cyan-600/20 text-cyan-300 ring-1 ring-inset ring-cyan-400/30">IM-DDCE API</Badge>
                <Badge variant="outline" className="border-emerald-400/40 text-emerald-300">Login</Badge>
              </div>
              <CardTitle className="text-lg font-semibold text-slate-100">ลงชื่อเข้าใช้ระบบ</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={onSubmit} className="grid gap-4" noValidate>
                {/* Username */}
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 z-[1] h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="username"
                    name="username"
                    placeholder=" "
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.currentTarget.value)}
                    className="peer h-11 rounded-xl border-slate-700/60 bg-slate-900/60 pl-10 text-slate-100 placeholder:text-transparent focus:border-cyan-400 focus:ring-0"
                  />
                  {/* patch ใต้ label ป้องกันกลืนพื้นหลัง */}
                  <span className="pointer-events-none absolute left-9 right-9 top-3 block h-4 rounded bg-slate-900/60" aria-hidden />
                  <label
                    htmlFor="username"
                    className="pointer-events-none absolute left-10 top-2.5 origin-left rounded bg-slate-900/60 px-1 text-xs text-slate-400 transition
                               peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm
                               peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-cyan-300"
                  >
                    Username
                  </label>
                  <div className="mt-1 text-xs text-slate-400">แนะนำ 4–20 ตัว a-z / 0-9 / . _ -</div>
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 z-[1] h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPw ? 'text' : 'password'}
                    placeholder=" "
                    autoComplete="current-password"
                    required
                    value={pw}
                    onChange={(e) => setPw(e.currentTarget.value)}
                    className="peer h-11 rounded-xl border-slate-700/60 bg-slate-900/60 pl-10 pr-10 text-slate-100 placeholder:text-transparent focus:border-cyan-400 focus:ring-0"
                  />
                  <span className="pointer-events-none absolute left-9 right-16 top-3 block h-4 rounded bg-slate-900/60" aria-hidden />
                  <label
                    htmlFor="password"
                    className="pointer-events-none absolute left-10 top-2.5 origin-left rounded bg-slate-900/60 px-1 text-xs text-slate-400 transition
                               peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm
                               peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-cyan-300"
                  >
                    รหัสผ่าน
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-slate-700/60 bg-slate-800/50 p-1.5 text-slate-300 hover:bg-slate-800"
                    aria-label={showPw ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" name="remember" className="h-3.5 w-3.5 accent-cyan-500" /> จดจำฉันไว้
                    </label>
                    <Link href="/auth/forgetpass" className="text-cyan-300 hover:text-cyan-200">ลืมรหัสผ่าน?</Link>
                  </div>
                </div>

                {err && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                    {err}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="mt-1 h-11 w-full gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/20 disabled:opacity-60"
                >
                  เข้าสู่ระบบ <ArrowRight className="h-4 w-4" />
                </Button>

                <Button
                  variant="secondary"
                  asChild
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/10 text-slate-100 hover:bg-white/20"
                >
                  <Link href="/register">สมัครใช้งาน (Register)</Link>
                </Button>
              </form>

              {/* ลิงก์เพิ่มเติมใต้การ์ด */}
              <div className="mt-6 text-center text-sm text-slate-400">
                <span className="mr-2">ต้องการดูข้อมูลระบบ?</span>
                <Link href="/introduction" className="text-cyan-300 hover:text-cyan-200">ไปหน้า Introduction</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
