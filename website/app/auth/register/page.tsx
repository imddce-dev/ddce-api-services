'use client';
import React, { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  HeartPulse, UserPlus, Mail, Phone, Building2, Lock, ArrowRight,
  Eye, EyeOff, ShieldCheck, CheckCircle2, CircleAlert
} from 'lucide-react';
import { motion } from 'framer-motion';

/* shadcn/ui */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/* ---------- helpers ---------- */
const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-12 gap-x-6 gap-y-4">{children}</div>
);
/* ช่องฟิลด์ (ให้กิน 6 คอลัมน์บนจอกว้าง, เต็มแถวบนจอเล็ก) */
const Col = ({ children }: { children: React.ReactNode }) => (
  <div className="col-span-12 md:col-span-6">{children}</div>
);
const Field = ({ children }: { children: React.ReactNode }) => (
  <div className="grid gap-1 [--h:44px]">{children}</div>
);
const Hint = ({ children }: { children?: React.ReactNode }) => (
  <div className="min-h-5 text-xs leading-5">{children ?? <span>&nbsp;</span>}</div>
);
const ErrorText = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 text-rose-600">
    <CircleAlert className="h-3.5 w-3.5" />
    {children}
  </span>
);

/* ---------- bg ---------- */
function EKG({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1600 260" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="ekg-g-1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#34d399" />
          <stop offset="1" stopColor="#2dd4bf" />
        </linearGradient>
      </defs>
      <path d="M0,130 L120,130 170,60 210,200 250,130 420,130 460,58 500,202 540,130 820,130 860,60 900,200 940,130 1180,130 1220,58 1260,202 1300,130 1600,130"
        fill="none" stroke="url(#ekg-g-1)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"
        className="[stroke-dasharray:12_18] motion-safe:[animation:ekgDash_6s_linear_infinite] opacity-35" />
      <path d="M0,130 L120,130 170,60 210,200 250,130 420,130 460,58 500,202 540,130 820,130 860,60 900,200 940,130 1180,130 1220,58 1260,202 1300,130 1600,130"
        fill="none" stroke="#e8f7f1" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"
        className="blur-[2px] [stroke-dasharray:12_18] motion-safe:[animation:ekgDash_6s_linear_infinite] opacity-35" />
      <style>{`@keyframes ekgDash{to{stroke-dashoffset:-400}}`}</style>
    </svg>
  );
}

/* ---------- validation state ---------- */
type Errs = Partial<Record<'username' | 'org' | 'fullname' | 'email' | 'phone' | 'password' | 'confirm' | 'agree', string>>;

function RegisterForm() {
  const [org, setOrg] = useState('');
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [errs, setErrs] = useState<Errs>({});
  const usernameRef = useRef<HTMLInputElement | null>(null);

  /* password rules */
  const pwLen = pw.length >= 8;
  const pwUpper = /[A-Z]/.test(pw);
  const pwLower = /[a-z]/.test(pw);
  const pwNum = /\d/.test(pw);
  const pwSymbol = /[^A-Za-z0-9]/.test(pw);

  const pwScore = [pwLen, pwUpper, pwLower, pwNum, pwSymbol].filter(Boolean).length;
  const pwOk = pwLen && pwUpper && pwLower && pwNum && pwSymbol;
  const match = useMemo(() => pw && pw2 && pw === pw2, [pw, pw2]);

  const strengthLabel =
    pwScore >= 5 ? 'ความปลอดภัยดีมาก'
      : pwScore === 4 ? 'ความปลอดภัยดี'
      : pwScore === 3 ? 'พอใช้'
      : pwScore === 2 ? 'อ่อน'
      : 'เริ่มพิมพ์รหัสผ่าน';
  const strengthWidth =
    pwScore === 0 ? 'w-0' : pwScore === 1 ? 'w-1/5' : pwScore === 2 ? 'w-2/5' : pwScore === 3 ? 'w-3/5' : pwScore === 4 ? 'w-4/5' : 'w-full';
  const strengthColor =
    pwScore >= 5 ? 'bg-emerald-500'
      : pwScore === 4 ? 'bg-lime-500'
      : pwScore === 3 ? 'bg-amber-500'
      : pwScore === 2 ? 'bg-orange-400'
      : 'bg-rose-400';

  const errInput = 'border-rose-300 bg-rose-50/60 focus-visible:ring-rose-400';
  const Rule = ({ ok, text }: { ok: boolean; text: string }) => (
    <span className={`inline-flex items-center gap-1 ${ok ? 'text-emerald-600' : 'text-slate-500'}`}>
      {ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <CircleAlert className="h-3.5 w-3.5" />}
      {text}
    </span>
  );

  function clearErr(name: keyof Errs) {
    setErrs((p) => ({ ...p, [name]: undefined }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const next: Errs = {};
    const must = (name: keyof Errs, label: string) => {
      const v = (fd.get(name) || '').toString().trim();
      if (!v) next[name] = `กรุณากรอก${label}`;
    };

    must('username', 'ชื่อผู้ใช้');
    must('fullname', 'ชื่อ–นามสกุล');
    must('email', 'อีเมล');
    must('phone', 'เบอร์ติดต่อ');
    must('password', 'รหัสผ่าน');
    must('confirm', 'ยืนยันรหัสผ่าน');

    if (!org) next.org = 'กรุณาเลือกหน่วยงาน';
    if (!agree) next.agree = 'กรุณายอมรับเงื่อนไขในการใช้งานระบบ';

    if (fd.get('password')) {
      if (!pwLen) next.password = 'รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร';
      else if (!pwUpper || !pwLower || !pwNum || !pwSymbol)
        next.password = 'ต้องมี ตัวพิมพ์ใหญ่/เล็ก ตัวเลข และอักขระพิเศษ';
    }
    if (fd.get('confirm') && !match) next.confirm = 'รหัสผ่านไม่ตรงกัน';

    setErrs(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', body: fd });
      if (res.ok) window.location.href = '/auth/login?created=1';
      else alert((await res.text()) || 'สมัครไม่สำเร็จ กรุณาลองใหม่');
    } catch {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-white">
      {/* bg */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <EKG className="absolute left-[-22vw] top-1/2 w-[70vw] -translate-y-1/2" />
        <EKG className="absolute right-[-20vw] top-1/3 w-[60vw] rotate-180 opacity-60" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .35, ease: 'easeOut' }}
        className="z-20 w-[min(980px,96vw)]"
      >
        <Card className="overflow-hidden rounded-2xl border border-emerald-200/70 bg-white/95 shadow-[0_10px_30px_rgba(16,36,30,.08)] backdrop-blur supports-[backdrop-filter]:bg-white/85">
          <div className="h-[3px] w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />

          {/* header */}
          <CardHeader className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-500 text-white shadow ring-2 ring-emerald-200/70">
                  <UserPlus className="h-5 w-5" />
                </span>
                <div>
                  <CardTitle className="text-[18px] font-extrabold tracking-tight text-slate-900">สมัครใช้งาน DDCE API</CardTitle>
                  <CardDescription className="text-[12px] leading-tight">
                    กรอกข้อมูลเพื่อสร้างบัญชี <b className="text-emerald-700">DDCE API</b>
                  </CardDescription>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" /> สมัครอย่างปลอดภัย
              </span>
            </div>
          </CardHeader>

          {/* body */}
          <CardContent className="px-6 pb-6">
            <form className="grid gap-5" onSubmit={onSubmit} noValidate>
              {/* panel */}
              <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/40 p-5">
                <div className="mb-4 flex items-center gap-2 text-[12px] font-semibold tracking-wide text-emerald-700">
                  ข้อมูลผู้ใช้ <span className="h-px flex-1 rounded bg-emerald-100" />
                </div>

                {/* grid 2 คอลัมน์เสมอกัน */}
                <Row>
                  {/* left col */}
                  <Col>
                    <Field>
                      <Label htmlFor="username" className="text-slate-700">ชื่อผู้ใช้</Label>
                      <div className="relative">
                        <Input
                          id="username" name="username" placeholder="username"
                          pattern="^[a-z0-9._-]{4,20}$"
                          title="ใช้ a-z, 0-9, ., -, _ (4–20 ตัวอักษร)" required
                          aria-invalid={!!errs.username} onChange={() => clearErr('username')}
                          className={`h-[var(--h)] rounded-lg border-slate-200 pr-9 focus-visible:ring-2 focus-visible:ring-emerald-400 ${errs.username ? errInput : ''}`}
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">@</span>
                      </div>
                      <Hint>{errs.username ? <ErrorText>{errs.username}</ErrorText> : <span className="text-slate-500">อนุญาต a-z, 0–9, ., -, _ (4–20)</span>}</Hint>
                    </Field>
                  </Col>

                  <Col>
                    <Field>
                      <Label htmlFor="org" className="text-slate-700">หน่วยงาน</Label>
                      <div className="relative">
                        <Building2 className="pointer-events-none absolute left-3 top-1/2 z-[1] h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Select name="org" onValueChange={(v) => { setOrg(v); clearErr('org'); }}>
                          <SelectTrigger id="org" className={`h-[var(--h)] rounded-lg pl-10 pr-8 focus:ring-emerald-400 ${errs.org ? 'border-rose-300 bg-rose-50/60' : ''}`}>
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
                      <Hint>{errs.org ? <ErrorText>{errs.org}</ErrorText> : <span className="text-slate-500">เลือกตามสังกัด</span>}</Hint>
                    </Field>
                  </Col>

                  <Col>
                    <Field>
                      <Label htmlFor="fullname" className="text-slate-700">ชื่อ – นามสกุล</Label>
                      <div className="relative">
                        <Input
                          id="fullname" name="fullname" placeholder="ชื่อ นามสกุล" required
                          aria-invalid={!!errs.fullname} onChange={() => clearErr('fullname')}
                          className={`h-[var(--h)] rounded-lg border-slate-200 pr-9 focus-visible:ring-2 focus-visible:ring-emerald-400 ${errs.fullname ? errInput : ''}`}
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <HeartPulse className="h-4 w-4 text-emerald-500/70" />
                        </span>
                      </div>
                      <Hint>{errs.fullname && <ErrorText>{errs.fullname}</ErrorText>}</Hint>
                    </Field>
                  </Col>

                  <Col>
                    <Field>
                      <Label htmlFor="email" className="text-slate-700">อีเมล</Label>
                      <div className="relative">
                        <Input
                          id="email" name="email" type="email" autoComplete="email" placeholder="name@domain.go.th" required
                          aria-invalid={!!errs.email} onChange={() => clearErr('email')}
                          className={`h-[var(--h)] rounded-lg border-slate-200 pr-9 focus-visible:ring-2 focus-visible:ring-emerald-400 ${errs.email ? errInput : ''}`}
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <Mail className="h-4 w-4 text-slate-400" />
                        </span>
                      </div>
                      <Hint>{errs.email && <ErrorText>{errs.email}</ErrorText>}</Hint>
                    </Field>
                  </Col>

                  <Col>
                    <Field>
                      <Label htmlFor="phone" className="text-slate-700">เบอร์ติดต่อ</Label>
                      <div className="relative">
                        <Input
                          id="phone" name="phone" inputMode="numeric" pattern="[0-9]{9,10}"
                          title="กรอกหมายเลข 9–10 หลัก" placeholder="08xxxxxxxx" required
                          aria-invalid={!!errs.phone} onChange={() => clearErr('phone')}
                          className={`h-[var(--h)] rounded-lg border-slate-200 pr-9 focus-visible:ring-2 focus-visible:ring-emerald-400 ${errs.phone ? errInput : ''}`}
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <Phone className="h-4 w-4 text-slate-400" />
                        </span>
                      </div>
                      <Hint>{errs.phone && <ErrorText>{errs.phone}</ErrorText>}</Hint>
                    </Field>
                  </Col>

                  <div className="col-span-12 my-1 h-px rounded bg-emerald-100/70" />

                  <Col>
                    <Field>
                      <Label htmlFor="password" className="text-slate-700">รหัสผ่าน</Label>
                      <div className="relative">
                        <Input
                          id="password" name="password" type={showPw ? 'text' : 'password'}
                          autoComplete="new-password"
                          placeholder="≥ 8 ตัว | มี A-Z, a-z, 0-9, อักขระพิเศษ"
                          required
                          onChange={(e) => { setPw(e.currentTarget.value); if (errs.password) clearErr('password'); }}
                          aria-invalid={!!errs.password}
                          className={`h-[var(--h)] rounded-lg border-slate-200 pl-9 pr-9 focus-visible:ring-2 focus-visible:ring-emerald-400 ${errs.password ? errInput : ''}`}
                        />
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <button type="button" onClick={() => setShowPw(v => !v)}
                          className="absolute inset-y-0 right-2 flex items-center rounded px-2 text-slate-500 transition hover:bg-slate-100"
                          aria-label={showPw ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}>
                          {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      {/* checklist & meter – full width, ไม่เบี้ยว */}
                      <div className="mt-2 rounded-lg border border-emerald-100 bg-white/70 p-3">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11.5px]">
                          <Rule ok={pwLen} text="ยาวอย่างน้อย 8 ตัวอักษร" />
                          <Rule ok={pwUpper} text="มีตัวพิมพ์ใหญ่ (A-Z)" />
                          <Rule ok={pwLower} text="มีตัวพิมพ์เล็ก (a-z)" />
                          <Rule ok={pwNum} text="มีตัวเลข (0-9)" />
                          <Rule ok={pwSymbol} text="มีอักขระพิเศษ (!@#$…)" />
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[11.5px] text-slate-600">
                          <span className={pw ? (pwScore >= 4 ? 'text-emerald-600' : '') : 'text-slate-500'}>
                            {strengthLabel}
                          </span>
                          <span className="inline-flex h-1.5 w-44 overflow-hidden rounded bg-slate-200">
                            <span className={`h-full transition-all ${strengthWidth} ${strengthColor}`} />
                          </span>
                        </div>
                      </div>

                      <Hint>{errs.password && <ErrorText>{errs.password}</ErrorText>}</Hint>
                    </Field>
                  </Col>

                  <Col>
                    <Field>
                      <Label htmlFor="confirm" className="text-slate-700">ยืนยันรหัสผ่าน</Label>
                      <div className="relative">
                        <Input
                          id="confirm" name="confirm" type={showPw2 ? 'text' : 'password'}
                          autoComplete="new-password" placeholder="พิมพ์รหัสผ่านอีกครั้ง" required
                          onChange={(e) => { setPw2(e.currentTarget.value); if (errs.confirm) clearErr('confirm'); }}
                          aria-invalid={!!errs.confirm}
                          className={`h-[var(--h)] rounded-lg border-slate-200 pl-9 pr-9 focus-visible:ring-2 focus-visible:ring-emerald-400 ${errs.confirm ? errInput : ''}`}
                        />
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <button type="button" onClick={() => setShowPw2(v => !v)}
                          className="absolute inset-y-0 right-2 flex items-center rounded px-2 text-slate-500 transition hover:bg-slate-100"
                          aria-label={showPw2 ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}>
                          {showPw2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <Hint>
                        {errs.confirm
                          ? <ErrorText>{errs.confirm}</ErrorText>
                          : (pw2
                              ? <span className={`inline-flex items-center gap-1 ${match ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {match ? <CheckCircle2 className="h-3.5 w-3.5" /> : <CircleAlert className="h-3.5 w-3.5" />}
                                  {match ? 'รหัสผ่านตรงกัน' : 'รหัสผ่านไม่ตรงกัน'}
                                </span>
                              : <span className="text-slate-500">ยืนยันให้ตรงกับรหัสผ่าน</span>
                            )}
                      </Hint>
                    </Field>
                  </Col>
                </Row>
              </div>

              {/* controls */}
              <Row>
                <div className="col-span-12 md:col-span-8">
                  <label className={`flex items-start gap-3 rounded-lg p-3 text-sm border ${errs.agree ? 'border-rose-300 bg-rose-50/60' : 'border-emerald-200 bg-emerald-50/70'}`}>
                    <Checkbox checked={agree} onCheckedChange={(v) => { setAgree(Boolean(v)); clearErr('agree'); }} />
                    <span>
                      <span className="font-medium">ยอมรับเงื่อนไขในการใช้งานระบบ</span>
                      <span className="block text-xs text-slate-500">ยืนยันยอมรับนโยบายความเป็นส่วนตัวและข้อกำหนดในการใช้งาน</span>
                    </span>
                  </label>
                  {errs.agree && <div className="mt-1"><ErrorText>{errs.agree}</ErrorText></div>}
                </div>
              </Row>
                   <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full md:w-auto rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow hover:from-emerald-600 hover:to-teal-500"
                  >
                    {submitting ? 'กำลังสมัคร...' : 'สมัครใช้งาน'} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
            </form>
          </CardContent>

          {/* footer */}
          <div className="flex h-[64px] items-center justify-center gap-1 px-6 text-xs text-slate-600">
            มีบัญชีอยู่แล้ว?
            <Link href="/auth/login" className="ml-1 font-medium text-emerald-700 underline-offset-4 hover:underline">
              เข้าสู่ระบบที่นี่
            </Link>
          </div>
        </Card>
      </motion.div>
    </main>
  );
}

/* ---------- page ---------- */
export default function Page() {
  return <RegisterForm />;
}
