"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  HeartPulse, UserPlus, Mail, Phone, Building2, Lock, ArrowRight,
  Eye, EyeOff, ShieldCheck, CheckCircle2, CircleAlert
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/* ——— helpers ——— */
const Field = ({ children }: { children: React.ReactNode }) => (
  <div className="grid gap-1 [--h:44px]">{children}</div>
);
/** children ไม่บังคับ (แก้ error) + คงความสูงด้วย min-h-5 */
const Hint = ({ children }: { children?: React.ReactNode }) => (
  <p className="min-h-5 text-xs leading-5 text-slate-500">{children ?? "\u00A0"}</p>
);

export default function RegisterForm() {
  const [org, setOrg] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const usernameRef = useRef<HTMLInputElement | null>(null);

  const pwLen = pw.length >= 8;
  const pwHasNum = /\d/.test(pw);
  const pwHasLetter = /[A-Za-z]/.test(pw);
  const pwHasSymbol = /[^A-Za-z0-9]/.test(pw);
  const pwScore = [pwLen, pwHasNum, pwHasLetter, pwHasSymbol].filter(Boolean).length;
  const pwOk = pwLen;
  const match = useMemo(() => pw && pw2 && pw === pw2, [pw, pw2]);
  const usernamePattern = "^[a-z0-9._-]{4,20}$";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agree || !pwOk || !match) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", { method: "POST", body: data });
      if (res.ok) window.location.href = "/login?created=1";
      else alert((await res.text()) || "สมัครไม่สำเร็จ กรุณาลองใหม่");
    } catch {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setSubmitting(false);
    }
  }

  const strengthLabel =
    pwScore >= 4 ? "ความปลอดภัยดีมาก"
      : pwScore === 3 ? "ความปลอดภัยดี"
      : pwScore === 2 ? "พอใช้"
      : pwScore === 1 ? "อ่อน"
      : "อย่างน้อย 8 ตัวอักษร";

  const strengthColor =
    pwScore >= 4 ? "bg-emerald-500"
      : pwScore === 3 ? "bg-lime-500"
      : pwScore === 2 ? "bg-amber-500"
      : pwScore === 1 ? "bg-rose-400"
      : "bg-slate-300";

  return (
    <main className="relative grid min-h-[100svh] place-items-center bg-white text-slate-900">
      {/* เส้น EKG วิ่ง ๆ กลับมาแล้ว */}
      <EKG className="pointer-events-none absolute left-0 right-0 top-1/2 z-10 -translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .45, ease: "easeOut" }}
        className="w-[min(980px,96vw)] h-[92svh] z-20"
      >
        <Card className="h-full w-full overflow-hidden border-2 border-emerald-200/70 bg-white/90 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-white/80">
          {/* Header (fixed height) */}
          <CardHeader className="relative h-[124px] px-6">
            <div className="absolute inset-x-0 top-0 mx-auto h-[2px] w-40 rounded bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400" />
            <div className="flex h-full items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white shadow ring-2 ring-emerald-200/70">
                  <UserPlus className="h-6 w-6" />
                </span>
                <div>
                  <CardTitle className="text-xl font-extrabold tracking-tight">สมัครใช้งาน DDCE API</CardTitle>
                  <CardDescription className="text-[13px] leading-tight">
                    กรอกข้อมูลให้ครบถ้วนเพื่อสร้างบัญชีใช้งานระบบ <b className="text-emerald-700">DDCE API</b>
                  </CardDescription>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/60 px-3 py-1 text-[11px] font-medium text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" /> สมัครอย่างปลอดภัย
              </span>
            </div>
          </CardHeader>

          {/* Body */}
          <CardContent className="h-[calc(100%-124px-84px)] px-6">
            <form
              className="grid h-full grid-rows-[1fr_auto] gap-5"
              onSubmit={onSubmit}
              method="post"
              action="/api/auth/register"
              noValidate
            >
              {/* Fields */}
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                {/* Username */}
                <Field>
                  <Label htmlFor="username">ชื่อผู้ใช้</Label>
                  <div className="relative">
                    <Input
                      ref={usernameRef}
                      id="username"
                      name="username"
                      placeholder="username"
                      pattern={usernamePattern}
                      title="ใช้ a-z, 0-9, ., -, _ (4–20 ตัวอักษร)"
                      required
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      className="h-[var(--h)] pr-10"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">@</span>
                  </div>
                  <Hint>อนุญาต a-z, 0–9, ., -, _ (4–20)</Hint>
                </Field>

                {/* Org */}
                <Field>
                  <Label htmlFor="org">หน่วยงาน</Label>
                  <div className="relative">
                    <Building2 className="pointer-events-none absolute left-3 top-1/2 z-[1] h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Select value={org} onValueChange={setOrg} name="org" required>
                      <SelectTrigger id="org" className="h-[var(--h)] pl-20 pr-10">
                        <SelectValue placeholder="เลือกหน่วยงาน" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="central">กรมควบคุมโรค</SelectItem>
                        <SelectItem value="odpc">สำนักงานป้องกันควบคุมโรคที่ 1</SelectItem>
                        <SelectItem value="ppho">สสจ. (PPHO)</SelectItem>
                        <SelectItem value="hospital">โรงพยาบาล</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Hint>เลือกตามสังกัด</Hint>
                </Field>

                {/* Fullname */}
                <Field>
                  <Label htmlFor="fullname">ชื่อ – นามสกุล</Label>
                  <div className="relative">
                    <Input id="fullname" name="fullname" placeholder="ชื่อ นามสกุล" required className="h-[var(--h)] pr-10" />
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <HeartPulse className="h-4 w-4 text-emerald-500/70" />
                    </span>
                  </div>
                  <Hint />
                </Field>

                {/* Email */}
                <Field>
                  <Label htmlFor="email">อีเมล</Label>
                  <div className="relative">
                    <Input id="email" name="email" type="email" autoComplete="email" placeholder="name@domain.go.th" required className="h-[var(--h)] pr-10" />
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </span>
                  </div>
                  <Hint />
                </Field>

                {/* Phone */}
                <Field>
                  <Label htmlFor="phone">เบอร์ติดต่อ</Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      name="phone"
                      inputMode="numeric"
                      pattern="[0-9]{9,10}"
                      title="กรอกหมายเลข 9–10 หลัก"
                      placeholder="08xxxxxxxx"
                      required
                      className="h-[var(--h)] pr-10"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <Phone className="h-4 w-4 text-slate-400" />
                    </span>
                  </div>
                  <Hint />
                </Field>

                {/* Password */}
                <Field>
                  <Label htmlFor="password">รหัสผ่าน</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPw ? "text" : "password"}
                      autoComplete="new-password"
                      minLength={8}
                      placeholder="อย่างน้อย 8 ตัวอักษร"
                      required
                      onChange={(e) => setPw(e.currentTarget.value)}
                      className="h-[var(--h)] pl-10 pr-10"
                    />
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowPw(v => !v)}
                      className="absolute inset-y-0 right-2 flex items-center rounded px-2 text-slate-500 hover:bg-slate-100"
                      aria-label={showPw ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <Hint>
                    <div className="flex items-center justify-between">
                      <span className={pw ? (pwScore >= 3 ? "text-emerald-600" : "text-slate-600") : "text-slate-500"}>
                        {strengthLabel}
                      </span>
                      <span className="inline-flex h-1.5 w-36 overflow-hidden rounded bg-slate-200">
                        <span
                          className={`h-full transition-all ${
                            pwScore === 0 ? "w-0" : pwScore === 1 ? "w-1/4" : pwScore === 2 ? "w-2/4" : pwScore === 3 ? "w-3/4" : "w-full"
                          } ${strengthColor}`}
                        />
                      </span>
                    </div>
                  </Hint>
                </Field>

                {/* Confirm */}
                <Field>
                  <Label htmlFor="confirm">ยืนยันรหัสผ่าน</Label>
                  <div className="relative">
                    <Input
                      id="confirm"
                      name="confirm"
                      type={showPw2 ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="พิมพ์รหัสผ่านอีกครั้ง"
                      required
                      onChange={(e) => setPw2(e.currentTarget.value)}
                      className="h-[var(--h)] pl-10 pr-10"
                    />
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowPw2(v => !v)}
                      className="absolute inset-y-0 right-2 flex items-center rounded px-2 text-slate-500 hover:bg-slate-100"
                      aria-label={showPw2 ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                    >
                      {showPw2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <Hint>
                    {pw2 ? (
                      <span className={`inline-flex items-center gap-1 ${match ? "text-emerald-600" : "text-rose-600"}`}>
                        {match ? <CheckCircle2 className="h-3.5 w-3.5" /> : <CircleAlert className="h-3.5 w-3.5" />}
                        {match ? "รหัสผ่านตรงกัน" : "รหัสผ่านไม่ตรงกัน"}
                      </span>
                    ) : "ยืนยันให้ตรงกับรหัสผ่าน"}
                  </Hint>
                </Field>
              </div>

              {/* Controls row (ติดก้นการ์ด) */}
              <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[1fr_auto]">
                <label className="flex items-start gap-3 rounded-lg border border-emerald-200/60 bg-emerald-50/50 p-3 text-sm">
                  <Checkbox checked={agree} onCheckedChange={v => setAgree(Boolean(v))} />
                  <span>
                    <span className="font-medium">ยอมรับเงื่อนไขในการใช้งานระบบ</span>
                    <span className="block text-xs text-slate-500">ยืนยันยอมรับนโยบายความเป็นส่วนตัวและข้อกำหนดในการใช้งาน</span>
                  </span>
                </label>

               
                
                </div>
                 <div className="flex justify-center">
                  <Button type="submit" disabled={!agree || !pwOk || !match || submitting} className="min-w-40">
                    {submitting ? "กำลังสมัคร..." : "สมัครใช้งาน"} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
              </div>
            </form>
          </CardContent>

          {/* Footer (fixed height) */}
          <div className="flex h-[84px] items-center justify-center gap-1 px-6 text-xs text-slate-600">
            มีบัญชีอยู่แล้ว?
            <Link href="/login" className="ml-1 font-medium text-emerald-700 underline-offset-4 hover:underline">
              เข้าสู่ระบบที่นี่
            </Link>
          </div>
        </Card>
      </motion.div>
    </main>
  );
}

/* ——— EKG animated background ——— */
function EKG({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1600 260" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="ekg-g-1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4ea492" />
          <stop offset="1" stopColor="#89cdbd" />
        </linearGradient>
      </defs>
      <path d="M0,130 L120,130 170,60 210,200 250,130 420,130 460,58 500,202 540,130 820,130 860,60 900,200 940,130 1180,130 1220,58 1260,202 1300,130 1600,130"
        fill="none" stroke="url(#ekg-g-1)" strokeWidth={3}
        strokeLinecap="round" strokeLinejoin="round"
        className="[stroke-dasharray:12_18] motion-safe:[animation:ekgDash_6s_linear_infinite] opacity-60" />
      <path d="M0,130 L120,130 170,60 210,200 250,130 420,130 460,58 500,202 540,130 820,130 860,60 900,200 940,130 1180,130 1220,58 1260,202 1300,130 1600,130"
        fill="none" stroke="#cfeee5" strokeWidth={5}
        strokeLinecap="round" strokeLinejoin="round"
        className="blur-sm [stroke-dasharray:12_18] motion-safe:[animation:ekgDash_6s_linear_infinite] opacity-30" />
      <style>{`@keyframes ekgDash{to{stroke-dashoffset:-400}}`}</style>
    </svg>
  );
}
