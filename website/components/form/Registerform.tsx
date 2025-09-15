"use client";

import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import PrivacyDialog from "@/components/common/PrivacyDialog"; // ปรับ path ให้ตรงโปรเจกต์

type OrgType = "central" | "odpc" | "ppho" | "hospital" | "other";

type FormValues = {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  orgType: OrgType;
  password: string;
  confirm: string;
  agree: boolean;
};

const ORG_OPTIONS: { value: OrgType; label: string }[] = [
  { value: "central", label: "ส่วนกลาง (กรม/กอง)" },
  { value: "odpc", label: "เขต (สคร./ODPC)" },
  { value: "ppho", label: "จังหวัด (สสจ./PPHO)" },
  { value: "hospital", label: "หน่วยบริการ/โรงพยาบาล" },
  { value: "other", label: "อื่น ๆ" },
];

/** ------- Password Policy & Helpers ------- **/
const pwdRules = {
  minLen: 10,
  lower: /[a-z]/,
  upper: /[A-Z]/,
  digit: /[0-9]/,
  special: /[^A-Za-z0-9\s]/,
  noSpace: /^\S+$/,
};

// รหัสผ่านยอดฮิต (ตัวอย่างชุดสั้น ๆ — เพิ่มได้ภายหลัง)
const commonPasswords = new Set([
  "123456","123456789","password","qwerty","111111","12345678","abc123",
  "password1","123123","qwerty123","iloveyou","000000","1234","12345",
]);

// ให้คะแนน 0–6 และหักแต้มถ้ามีข้อมูลส่วนตัว/รหัสฮิต
function scorePassword(pwd: string, personal: string[] = []) {
  if (!pwd) return 0;
  let s = 0;
  if (pwd.length >= pwdRules.minLen) s++;
  if (pwdRules.lower.test(pwd)) s++;
  if (pwdRules.upper.test(pwd)) s++;
  if (pwdRules.digit.test(pwd)) s++;
  if (pwdRules.special.test(pwd)) s++;
  if (pwdRules.noSpace.test(pwd)) s++;
  const pStr = personal.filter(Boolean).map((t) => t.toLowerCase()).join("|");
  if (pStr && new RegExp(pStr, "i").test(pwd)) s = Math.max(0, s - 2);
  if (commonPasswords.has(pwd.toLowerCase())) s = Math.max(0, s - 3);
  return s;
}

function containsPersonalInfo(pwd: string, username?: string, fullName?: string) {
  const parts = [
    username?.toLowerCase() ?? "",
    ...(fullName ? fullName.toLowerCase().split(/\s+/).filter(Boolean) : []),
  ].filter(Boolean);
  if (!pwd) return false;
  const p = pwd.toLowerCase();
  return parts.some((t) => t.length >= 3 && p.includes(t));
}

// ตรวจเบอร์: อนุญาตตัวเลข ช่องว่าง ขีด วงเล็บ และเครื่องหมาย +
function validatePhonePretty(v: string) {
  if (!v) return "กรอกเบอร์ติดต่อ";
  const digits = v.replace(/[^\d+]/g, "");
  if (digits.slice(1).includes("+")) return "รูปแบบเบอร์ไม่ถูกต้อง";
  const onlyNums = digits.startsWith("+") ? digits.slice(1) : digits;
  if (!/^\d+$/.test(onlyNums)) return "รูปแบบเบอร์ไม่ถูกต้อง";
  if (onlyNums.length < 9 || onlyNums.length > 15) return "ความยาวเบอร์ควรอยู่ระหว่าง 9–15 หลัก";
  return true;
}

// username: เริ่มด้วยตัวอักษร, a-z0-9_ ยาว 4–20
const usernameRegex = /^[a-z][a-z0-9_]{3,19}$/;

/** ------- UI helpers ------- **/
function RuleItem({ ok, text }: { ok: boolean; text: string }) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={
          "inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] " +
          (ok ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30" : "bg-white/10 text-slate-300")
        }
        aria-hidden
      >
        {ok ? "✓" : "•"}
      </span>
      <span className={ok ? "text-slate-300" : "text-slate-400"}>{text}</span>
    </li>
  );
}

export function Registerform() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<FormValues>({ mode: "onChange" });

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [openPrivacy, setOpenPrivacy] = useState(false);

  const pwd = watch("password");
  const username = watch("username");
  const fullName = watch("fullName");

  // สถานะเงื่อนไขรหัสผ่าน
  const ruleState = useMemo(() => {
    const len = (pwd?.length ?? 0) >= pwdRules.minLen;
    const lo = pwdRules.lower.test(pwd ?? "");
    const up = pwdRules.upper.test(pwd ?? "");
    const dg = pwdRules.digit.test(pwd ?? "");
    const sp = pwdRules.special.test(pwd ?? "");
    const ns = pwdRules.noSpace.test(pwd ?? "");
    const common = pwd ? !commonPasswords.has(pwd.toLowerCase()) : false;
    const personal = pwd ? !containsPersonalInfo(pwd, username, fullName) : false;
    return { len, lo, up, dg, sp, ns, common, personal };
  }, [pwd, username, fullName]);

  const score = useMemo(() => {
    return scorePassword(pwd ?? "", [username ?? "", ...(fullName?.split(/\s+/) ?? [])]);
  }, [pwd, username, fullName]);

  const strengthLabel = score <= 2 ? "อ่อน" : score <= 4 ? "ปานกลาง" : "แข็งแรง";

  const onSubmit = async (values: FormValues) => {
    // TODO: เปลี่ยนเป็น endpoint ของคุณ
    // await fetch("/api/register", { method: "POST", body: JSON.stringify(values) });
    console.log("register payload:", values);
    alert("สมัครเรียบร้อย");
    reset();
  };

  return (
    <>
      {/* เพิ่ม space และ padding ให้โปร่งขึ้นเล็กน้อย */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-1 py-3 text-sm">
  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* ชื่อ-สกุล */}
          <div>
            <label className="mb-1 block text-xs text-slate-300">ชื่อ-สกุล *</label>
            <input
              className="h-9 w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 text-slate-100 outline-none focus:ring-2 focus:ring-cyan-400/40"
              placeholder="เช่น สมชาย ใจดี"
              {...register("fullName", { required: "กรอกชื่อ-สกุล" })}
            />
            {errors.fullName && <p className="mt-1 text-[11px] text-rose-300" role="alert">{errors.fullName.message}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="mb-1 block text-xs text-slate-300">ชื่อผู้ใช้ (Username) *</label>
            <input
              className="h-9 w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 text-slate-100 outline-none focus:ring-2 focus:ring-cyan-400/40"
              placeholder="เช่น somchai_01"
              {...register("username", {
                required: "กรอกชื่อผู้ใช้",
                validate: (v) => {
                  const val = v.trim().toLowerCase();
                  if (!usernameRegex.test(val)) return "ใช้ a–z, 0–9, _ เริ่มด้วยตัวอักษร ยาว 4–20 ตัว";
                  return true;
                },
              })}
              onBlur={(e) => {
                const val = e.target.value.trim().toLowerCase();
                setValue("username", val, { shouldValidate: true, shouldDirty: true });
              }}
              autoComplete="username"
            />
            <p className="mt-1 text-[11px] text-slate-400">อนุญาตเฉพาะ a–z, 0–9 และขีดล่าง (_)</p>
            {errors.username && <p className="mt-1 text-[11px] text-rose-300" role="alert">{errors.username.message}</p>}
          </div>

          {/* อีเมล */}
          <div>
            <label className="mb-1 block text-xs text-slate-300">อีเมล *</label>
            <input
              type="email"
              className="h-9 w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 text-slate-100 outline-none focus:ring-2 focus:ring-cyan-400/40"
              placeholder="name@example.com"
              {...register("email", {
                required: "กรอกอีเมล",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "รูปแบบอีเมลไม่ถูกต้อง" },
              })}
              autoComplete="email"
            />
            {errors.email && <p className="mt-1 text-[11px] text-rose-300" role="alert">{errors.email.message}</p>}
          </div>

          {/* เบอร์ติดต่อ */}
          <div>
            <label className="mb-1 block text-xs text-slate-300">เบอร์ติดต่อ *</label>
            <input
              type="tel"
              className="h-9 w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 text-slate-100 outline-none focus:ring-2 focus:ring-cyan-400/40"
              placeholder="เช่น 081-234-5678 หรือ +66 81 234 5678"
              {...register("phone", {
                required: "กรอกเบอร์ติดต่อ",
                validate: validatePhonePretty,
              })}
              autoComplete="tel"
              inputMode="tel"
            />
            <p className="mt-1 text-[11px] text-slate-400">ใส่ตัวเลขได้ มี/ไม่มีช่องว่างหรือขีดก็ได้ (ตรวจความยาว 9–15 หลัก)</p>
            {errors.phone && <p className="mt-1 text-[11px] text-rose-300" role="alert">{errors.phone.message as string}</p>}
          </div>

          {/* รหัสผ่าน */}
          <div>
            <label className="mb-1 block text-xs text-slate-300">รหัสผ่าน *</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                className="h-9 w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 pr-10 text-slate-100 outline-none focus:ring-2 focus:ring-cyan-400/40"
                placeholder="อย่างน้อย 10 ตัวอักษร"
                {...register("password", {
                  required: "กรอกรหัสผ่าน",
                  validate: (v) => {
                    if (v.length < pwdRules.minLen) return `อย่างน้อย ${pwdRules.minLen} ตัวอักษร`;
                    if (!pwdRules.lower.test(v)) return "ต้องมีตัวอักษรพิมพ์เล็ก";
                    if (!pwdRules.upper.test(v)) return "ต้องมีตัวอักษรพิมพ์ใหญ่";
                    if (!pwdRules.digit.test(v)) return "ต้องมีตัวเลข";
                    if (!pwdRules.special.test(v)) return "ต้องมีอักขระพิเศษ";
                    if (!pwdRules.noSpace.test(v)) return "ห้ามมีเว้นวรรค";
                    if (commonPasswords.has(v.toLowerCase())) return "รหัสผ่านนี้พบใช้กันบ่อยเกินไป";
                    if (containsPersonalInfo(v, username, fullName)) return "ห้ามมีชื่อผู้ใช้หรือส่วนของชื่อ-สกุลในรหัสผ่าน";
                    return true;
                  },
                })}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-slate-300 hover:text-white"
              >
                {showPwd ? "ซ่อน" : "แสดง"}
              </button>
            </div>

            {/* แถบความแข็งแรง */}
            <div className="mt-1 flex items-center gap-2">
              <div className="h-1 w-full rounded bg-white/10">
                <div
                  className="h-1 rounded"
                  style={{
                    width: `${(score / 6) * 100}%`,
                    background: score <= 2 ? "#fda4af" : score <= 4 ? "#fbbf24" : "#34d399",
                  }}
                />
              </div>
              <span className="text-[11px] text-slate-300">{strengthLabel}</span>
            </div>

            {/* เช็กลิสต์เงื่อนไขแบบเรียลไทม์ */}
            <ul className="mt-2 grid grid-cols-1 gap-1 text-[12px] text-slate-400 sm:grid-cols-2">
              <RuleItem ok={ruleState.len} text={`ยาวอย่างน้อย ${pwdRules.minLen} ตัวอักษร`} />
              <RuleItem ok={ruleState.ns} text="ห้ามมีช่องว่าง" />
              <RuleItem ok={ruleState.lo} text="มีตัวพิมพ์เล็ก (a–z)" />
              <RuleItem ok={ruleState.up} text="มีตัวพิมพ์ใหญ่ (A–Z)" />
              <RuleItem ok={ruleState.dg} text="มีตัวเลข (0–9)" />
              <RuleItem ok={ruleState.sp} text="มีอักขระพิเศษ (!@#$…)" />
              <RuleItem ok={ruleState.common} text="ไม่ใช่รหัสผ่านยอดฮิต" />
              <RuleItem ok={ruleState.personal} text="ไม่มีชื่อผู้ใช้/ชื่อ-สกุล" />
            </ul>

            {errors.password && <p className="mt-1 text-[11px] text-rose-300" role="alert">{errors.password.message}</p>}
          </div>

          {/* ยืนยันรหัสผ่าน */}
          <div>
            <label className="mb-1 block text-xs text-slate-300">ยืนยันรหัสผ่าน *</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                className="h-9 w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 pr-10 text-slate-100 outline-none focus:ring-2 focus:ring-cyan-400/40"
                placeholder="พิมพ์รหัสผ่านซ้ำ"
                {...register("confirm", {
                  required: "กรอกยืนยันรหัสผ่าน",
                  validate: (v) => v === (pwd ?? "") || "รหัสผ่านไม่ตรงกัน",
                })}
                autoComplete="new-password"
                onPaste={(e) => e.preventDefault()}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-slate-300 hover:text-white"
              >
                {showConfirm ? "ซ่อน" : "แสดง"}
              </button>
            </div>
            {errors.confirm && <p className="mt-1 text-[11px] text-rose-300" role="alert">{errors.confirm.message}</p>}
          </div>

          {/* หน่วยงาน */}
          <div>
            <label className="mb-1 block text-xs text-slate-300">หน่วยงาน *</label>
            <select
              className="h-9 w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 text-slate-100 focus:ring-2 focus:ring-cyan-400/40"
              defaultValue=""
              {...register("orgType", { required: "เลือกหน่วยงาน" })}
            >
              <option value="" disabled>เลือกหน่วยงาน</option>
              {ORG_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {errors.orgType && <p className="mt-1 text-[11px] text-rose-300" role="alert">{errors.orgType.message}</p>}
          </div>

          {/* ยอมรับเงื่อนไข + ลิงก์นโยบาย (เต็มแถว) */}
          <div className="md:col-span-2">
            <div className="flex items-start justify-between gap-3">
              <label className="flex flex-1 items-start gap-3 text-xs text-slate-300">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-white/20 bg-slate-900/60"
                  {...register("agree", { required: "กรุณายอมรับเงื่อนไขการใช้งาน" })}
                />
                <span>
                  ฉันยอมรับเงื่อนไขการใช้งาน และ{" "}
                  <button
                    type="button"
                    onClick={() => setOpenPrivacy(true)}
                    className="underline decoration-dotted text-cyan-300 hover:text-cyan-200"
                  >
                    นโยบายความเป็นส่วนตัว
                  </button>
                </span>
              </label>

              {errors.agree && (
                <p className="mt-1 text-[11px] text-rose-300" role="alert">
                  {errors.agree.message as string}
                </p>
              )}
            </div>
          </div>

          {/* ปุ่มส่ง (เต็มแถว) */}
          <div className="md:col-span-2 pt-1">
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="h-9 w-full rounded-xl bg-cyan-500/90 px-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-400/30 disabled:opacity-60"
            >
              {isSubmitting ? "กำลังสมัคร…" : "สมัครใช้งาน"}
            </button>
          </div>

          {/* หมายเหตุ (เต็มแถว) */}
          <p className="md:col-span-2 text-[11px] text-slate-400">
            * ต้องกรอกทุกช่อง • นโยบายรหัสผ่าน: ยาว ≥ {pwdRules.minLen}, มีตัวพิมพ์เล็ก/ใหญ่ ตัวเลข และอักขระพิเศษ,
            ห้ามช่องว่าง, หลีกเลี่ยงคำยอดฮิต และห้ามมีชื่อผู้ใช้หรือชื่อ-สกุล
          </p>
        </div>
      </form>

      {/* Dialog นโยบายความเป็นส่วนตัว */}
      <PrivacyDialog
        open={openPrivacy}
        onClose={() => setOpenPrivacy(false)}
        contactPhone="02-278-1234"
        contactEmail="privacy@ddce.go.th"
      />
    </>
  );
}
