// components/request/API.tsx
"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Home } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Check,
  Loader2,
  Shield,
  KeyRound,
  Globe,
  Server,
  Circle,
  CircleCheck,
  Info,
} from "lucide-react";

/* --------------------------------- Types --------------------------------- */
type OrgType = "central" | "odpc" | "ppho" | "hospital" | "other";
type AuthMethod = "oauth2" | "client_credentials" | "apikey";
type Env = "sandbox" | "production";

export type RequestFormValues = {
  // ผู้ยื่นคำขอ
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  orgType: OrgType;

  // โครงการ/ระบบ
  projectName: string;
  description: string;
  environment: Env;

  // การเข้าถึง/ขอบเขต
  scopes: string[];
  purpose: string;
  dataTypes: string[];
  retentionDays: number;

  // การพิสูจน์ตัวตน/การเชื่อมต่อ
  authMethod: AuthMethod;
  redirectUris?: string;
  allowedIPs?: string;
  callbackUrl?: string;

  rateLimitNeeded?: string;
  agree: boolean;
};

/* ------------------------------- Const lists ------------------------------ */
const ORG_OPTIONS: { value: OrgType; label: string }[] = [
  { value: "central", label: "ส่วนกลาง (กรม/กอง)" },
  { value: "odpc", label: "เขต (สคร./ODPC)" },
  { value: "ppho", label: "จังหวัด (สสจ./PPHO)" },
  { value: "hospital", label: "หน่วยบริการ/โรงพยาบาล" },
  { value: "other", label: "อื่น ๆ" },
];

const SCOPE_OPTIONS = [
  { value: "read:events", label: "อ่านเหตุการณ์เฝ้าระวัง (EBS)" },
  { value: "write:events", label: "ส่ง/แก้ไขเหตุการณ์ (EBS)" },
  { value: "read:lab", label: "อ่านผลแลบ" },
  { value: "notify:send", label: "ส่งการแจ้งเตือน (Notification)" },
  { value: "profile:read", label: "อ่านข้อมูลผู้ใช้/ระบบ" },
];

const DATA_TYPE_OPTIONS = [
  "ข้อมูลเหตุการณ์ (EBS)",
  "ข้อมูลแลบสรุป",
  "ข้อมูลผู้ติดต่อระบบ",
  "เมตาดาต้า/สถิติรวม",
];

const RATE_HINTS = [
  "มาตรฐาน (เช่น 60 req/นาที)",
  "สูง (อธิบายเหตุผล)",
  "เป็นระยะ (batch) – ระบุหน้าต่างเวลา",
];

/* ------------------------------ Helpers ---------------------------------- */
const isHttpsUrl = (s: string) => {
  try {
    const u = new URL(s.trim());
    return u.protocol === "https:";
  } catch {
    return false;
  }
};
const isIpOrCidr = (s: string) => {
  const ipv4 =
    /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
  const cidr =
    /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\/([0-9]|[1-2][0-9]|3[0-2])$/;
  const v = s.trim();
  return ipv4.test(v) || cidr.test(v);
};

/* --------------------------------- UI ------------------------------------ */
export default function APIForm({
  onSubmit: onSubmitProp,
  defaultValues,
}: {
  onSubmit?: (values: RequestFormValues) => Promise<void> | void;
  defaultValues?: Partial<RequestFormValues>;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitting, dirtyFields },
    reset,
  } = useForm<RequestFormValues>({
    mode: "onChange",
    defaultValues: {
      environment: "sandbox",
      scopes: [],
      dataTypes: [],
      retentionDays: 30,
      authMethod: "oauth2",
      ...defaultValues,
    },
  });

  const authMethod = watch("authMethod");

  const validateRedirectUris = (v?: string) => {
    if (authMethod !== "oauth2") return true;
    const raw = (v ?? "").trim();
    if (!raw) return "กรอก Redirect URI";
    const lines = raw
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) return "กรอก Redirect URI";
    return lines.every(isHttpsUrl) || "ต้องเป็น https:// และถูกต้องตามมาตรฐาน";
  };

  const validateCallbackUrl = (v?: string) =>
    !v || isHttpsUrl(v) || "ต้องเป็น https://…";

  const validateAllowedIPs = (v?: string) => {
    if (!v) return true;
    const lines = v
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean);
    return (
      lines.every(isIpOrCidr) ||
      "รูปแบบ IP/CIDR ไม่ถูกต้อง (เช่น 203.0.113.10 หรือ 203.0.113.0/24)"
    );
  };

  const onSubmit = async (values: RequestFormValues) => {
    if (onSubmitProp) {
      await onSubmitProp(values);
    } else {
      console.log("request payload:", values);
      alert("ส่งคำขอเรียบร้อย (ตัวอย่าง)");
      reset();
    }
  };

  /* -------- Quick progress: นับฟิลด์ที่บังคับกรอก -------- */
  const requiredKeys: (keyof RequestFormValues)[] = [
    "requesterName",
    "requesterEmail",
    "requesterPhone",
    "orgType",
    "projectName",
    "description",
    "purpose",
    "retentionDays",
    "agree",
  ];
  const doneCount = requiredKeys.filter((k) => {
    const v = watch(k as any);
    if (k === "agree") return !!v;
    return v !== undefined && v !== null && String(v).trim() !== "";
  }).length;
  const progress = Math.round((doneCount / requiredKeys.length) * 100);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* QuickNav + Progress */}
      <div className="sticky top-0 z-10 -mx-4 mb-1 border-b border-white/10 bg-slate-900/60 px-4 py-3 backdrop-blur md:rounded-xl">
        <div className="flex flex-wrap items-center gap-2">
          <QuickLink href="#sec-applicant" done={isSectionDone(["requesterName", "requesterEmail", "requesterPhone", "orgType"], watch)}>
            ผู้ยื่น
          </QuickLink>
          <QuickLink href="#sec-project" done={isSectionDone(["projectName", "description", "environment"], watch)}>
            โครงการ
          </QuickLink>
          <QuickLink href="#sec-scope" done={isSectionDone(["scopes", "purpose", "retentionDays"], watch)}>
            Scopes
          </QuickLink>
          <QuickLink href="#sec-auth" done={isSectionDone(["authMethod", "redirectUris", "callbackUrl"], watch, authMethod)}>
            Auth/Connect
          </QuickLink>

          <div className="ml-auto flex items-center gap-2 text-xs text-slate-300">
            <span>ความคืบหน้า</span>
            <div className="h-1.5 w-32 overflow-hidden rounded bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="tabular-nums text-slate-200">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Grid 2 คอลัมน์ตั้งแต่ md ขึ้นไป */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* ----------------------------- ผู้ยื่น ----------------------------- */}
        <SectionCard id="sec-applicant" title="ข้อมูลผู้ยื่นคำขอ" icon={<Shield className="h-4 w-4 text-cyan-300" />}>
          <Field label="ชื่อ-สกุล *" error={errors.requesterName?.message}>
            <input
              className="input"
              placeholder="เช่น สมชาย ใจดี"
              {...register("requesterName", { required: "กรอกชื่อ-สกุล" })}
            />
          </Field>

          <Field label="อีเมล *" error={errors.requesterEmail?.message}>
            <input
              type="email"
              className="input"
              placeholder="name@example.com"
              {...register("requesterEmail", {
                required: "กรอกอีเมล",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "รูปแบบอีเมลไม่ถูกต้อง" },
              })}
              autoComplete="email"
            />
          </Field>

          <Field label="เบอร์ติดต่อ *" error={errors.requesterPhone?.message}>
            <input
              type="tel"
              className="input"
              placeholder="เช่น 081-234-5678 หรือ +66 81 234 5678"
              {...register("requesterPhone", {
                required: "กรอกเบอร์ติดต่อ",
                validate: (v) => {
                  const d = (v ?? "").replace(/[^\d+]/g, "");
                  const only = d.startsWith("+") ? d.slice(1) : d;
                  if (!/^\d+$/.test(only)) return "รูปแบบเบอร์ไม่ถูกต้อง";
                  if (only.length < 9 || only.length > 15) return "ความยาวควร 9–15 หลัก";
                  return true;
                },
              })}
              inputMode="tel"
              autoComplete="tel"
            />
          </Field>

          <Field label="หน่วยงาน *" error={errors.orgType?.message}>
            <select className="input" defaultValue="" {...register("orgType", { required: "เลือกหน่วยงาน" })}>
              <option value="" disabled>เลือกหน่วยงาน</option>
              {ORG_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
        </SectionCard>

        {/* ----------------------------- โครงการ ----------------------------- */}
        <SectionCard id="sec-project" title="ข้อมูลระบบ/โครงการ" icon={<Server className="h-4 w-4 text-emerald-300" />}>
          <Field label="ชื่อระบบ/โครงการ *" error={errors.projectName?.message}>
            <input
              className="input"
              placeholder="เช่น EBS Sync Chiangmai"
              {...register("projectName", { required: "กรอกชื่อระบบ/โครงการ" })}
            />
          </Field>

          <Field label="สภาพแวดล้อม *">
            <div className="flex flex-wrap gap-2">
              <Pill
                active={watch("environment") === "sandbox"}
                onClick={() => setValue("environment", "sandbox", { shouldDirty: true, shouldValidate: true })}
                tone="emerald"
              >
                <Server className="h-3.5 w-3.5" />
                Sandbox
                {watch("environment") === "sandbox" ? <Check className="h-3.5 w-3.5" /> : null}
              </Pill>
              <Pill
                active={watch("environment") === "production"}
                onClick={() => setValue("environment", "production", { shouldDirty: true, shouldValidate: true })}
                tone="emerald"
              >
                <Server className="h-3.5 w-3.5" />
                Production
                {watch("environment") === "production" ? <Check className="h-3.5 w-3.5" /> : null}
              </Pill>
            </div>
          </Field>

          <Field label="คำอธิบาย/บริบทการใช้งาน *" error={errors.description?.message}>
            <textarea
              className="input min-h-[88px]"
              placeholder="อธิบายวัตถุประสงค์ ระบบที่จะเชื่อมต่อ ผู้ใช้งานปลายทาง ฯลฯ"
              {...register("description", {
                required: "กรอกรายละเอียด",
                minLength: { value: 20, message: "อย่างน้อย 20 ตัวอักษร" },
              })}
            />
          </Field>
        </SectionCard>

        {/* ----------------------------- Scopes ------------------------------ */}
        <SectionCard id="sec-scope" title="ขอบเขตการเข้าถึง (Scopes)" icon={<KeyRound className="h-4 w-4 text-amber-300" />}>
          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {SCOPE_OPTIONS.map((s) => (
                <label key={s.value} className="flex items-center gap-3 text-sm text-slate-200">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-slate-900/60"
                    value={s.value}
                    {...register("scopes", {
                      validate: (arr) => (arr && arr.length > 0) || "เลือกอย่างน้อย 1 ขอบเขต",
                    })}
                  />
                  <span>{s.label}</span>
                </label>
              ))}
            </div>
            <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
              <Info className="h-3.5 w-3.5" /> เลือกเฉพาะสิทธิ์ที่จำเป็น (least privilege)
            </p>
            {errors.scopes && <p className="mt-1 text-xs text-rose-300">{errors.scopes.message as string}</p>}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="ประเภทข้อมูลที่ต้องใช้" hint="คลิกเลือกหลายข้อได้">
              <TagGroup
                options={DATA_TYPE_OPTIONS}
                values={watch("dataTypes")}
                onToggle={(val) => {
                  const curr = new Set(watch("dataTypes"));
                  curr.has(val) ? curr.delete(val) : curr.add(val);
                  setValue("dataTypes", Array.from(curr), { shouldDirty: true });
                }}
              />
            </Field>

            <Field label="ระยะเวลาการเก็บรักษาข้อมูล (วัน) *" error={errors.retentionDays?.message}>
              <input
                type="number"
                className="input"
                min={1}
                max={3650}
                {...register("retentionDays", {
                  required: "กำหนดจำนวนวัน",
                  valueAsNumber: true,
                  min: { value: 1, message: "อย่างน้อย 1 วัน" },
                  max: { value: 3650, message: "ไม่เกิน 10 ปี (3650 วัน)" },
                })}
              />
            </Field>
          </div>

          <Field label="วัตถุประสงค์การใช้งาน (purpose) *" error={errors.purpose?.message}>
            <textarea
              className="input min-h-[88px]"
              placeholder="เหตุผลตามภารกิจ/กฎหมายที่ต้องใช้ข้อมูล และผลกระทบหากไม่ได้รับอนุญาต"
              {...register("purpose", {
                required: "กรอกวัตถุประสงค์",
                minLength: { value: 20, message: "อย่างน้อย 20 ตัวอักษร" },
              })}
            />
          </Field>
        </SectionCard>

        {/* ----------------------------- Auth/Connect ------------------------ */}
        <SectionCard id="sec-auth" title="การพิสูจน์ตัวตนและการเชื่อมต่อ" icon={<Globe className="h-4 w-4 text-cyan-300" />}>
          <div className="flex flex-wrap gap-2">
            <Pill active={authMethod === "oauth2"} onClick={() => setValue("authMethod", "oauth2", { shouldDirty: true })}>
              <KeyRound className="h-3.5 w-3.5" />
              OAuth2 (Authorization Code)
              {authMethod === "oauth2" ? <Check className="h-3.5 w-3.5" /> : null}
            </Pill>
            <Pill
              active={authMethod === "client_credentials"}
              onClick={() => setValue("authMethod", "client_credentials", { shouldDirty: true })}
            >
              <KeyRound className="h-3.5 w-3.5" />
              Client Credentials
              {authMethod === "client_credentials" ? <Check className="h-3.5 w-3.5" /> : null}
            </Pill>
            <Pill active={authMethod === "apikey"} onClick={() => setValue("authMethod", "apikey", { shouldDirty: true })}>
              <KeyRound className="h-3.5 w-3.5" />
              API Key
              {authMethod === "apikey" ? <Check className="h-3.5 w-3.5" /> : null}
            </Pill>
          </div>

          {authMethod === "oauth2" ? (
            <Field label="Redirect URIs *" hint="1 บรรทัดต่อ 1 URI (ต้องเป็น https://)" error={errors.redirectUris?.message}>
              <textarea
                className="input min-h-[88px]"
                placeholder={"https://example.com/oauth/callback\nhttps://example.com/oauth/callback2"}
                {...register("redirectUris", { validate: validateRedirectUris })}
              />
            </Field>
          ) : (
            <Field label="Callback URL (ถ้ามี)" hint="ใช้รับ Webhook หรือผลประมวลผล" error={errors.callbackUrl?.message}>
              <input className="input" placeholder="https://example.com/webhook" {...register("callbackUrl", { validate: validateCallbackUrl })} />
            </Field>
          )}

          <Field
            label="IP / CIDR ที่อนุญาต (ถ้ามี)"
            hint="บรรทัดละ 1 รายการ เช่น 203.0.113.10 หรือ 203.0.113.0/24"
            error={errors.allowedIPs?.message}
          >
            <textarea
              className="input min-h-[88px]"
              placeholder={"203.0.113.10\n203.0.113.0/24"}
              {...register("allowedIPs", { validate: validateAllowedIPs })}
            />
          </Field>

          <Field label="คำขออัตราใช้งาน (Rate limit) (ถ้ามี)">
            <select className="input" defaultValue="" {...register("rateLimitNeeded")}>
              <option value="">เลือก</option>
              {RATE_HINTS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </Field>
        </SectionCard>
      </div>

      {/* ----------------------------- ยืนยัน + Actions ----------------------------- */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <label className="flex items-start gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-white/20 bg-slate-900/60"
            {...register("agree", { required: "กรุณายอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว" })}
          />
          <span>ฉันยืนยันว่าได้อ่านเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว และยอมรับข้อกำหนดทั้งหมด</span>
        </label>
        {errors.agree && <p className="mt-1 text-xs text-rose-300">{errors.agree.message as string}</p>}
      </div>

      {/* Action Bar ติดท้าย */}
      <div className="sticky bottom-0 z-10 -mx-4 border-t border-white/10 bg-slate-900/70 px-4 py-3 backdrop-blur md:rounded-xl">
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-cyan-500/90 px-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-400/30 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> กำลังส่งคำขอ…
              </>
            ) : (
              "ส่งคำขอใช้งาน"
            )}
          </button>

          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-medium text-slate-200 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/20"
          >
            ล้างแบบฟอร์ม
          </button>

          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-medium text-slate-200 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/20"
          >
            <Home className="mr-2 h-4 w-4" />
            กลับหน้าหลัก
          </Link>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">
          * โปรดระบุเฉพาะข้อมูลเท่าที่จำเป็น • ระบบจะพิจารณาตามหลักความจำเป็นและสัดส่วน (data minimization)
        </p>
      </div>
    </form>
  );
}

/* ---------------------------- Reusable pieces ---------------------------- */
function SectionCard({
  id,
  title,
  icon,
  children,
}: React.PropsWithChildren<{ id?: string; title: string; icon?: React.ReactNode }>) {
  return (
    <section
      id={id}
      className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 ring-1 ring-inset ring-white/5 md:p-5"
    >
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-semibold text-slate-200">{title}</h2>
      </div>
      <div className="grid grid-cols-1 gap-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  error,
  className = "",
  children,
}: React.PropsWithChildren<{ label: string; hint?: string; error?: string; className?: string }>) {
  return (
    <div className={className}>
      <div className="mb-1 flex items-center gap-2">
        <span className="text-xs text-slate-300">{label}</span>
        {error ? <Badge tone="rose" icon={<Circle className="h-3 w-3" />}>ต้องแก้</Badge> : null}
      </div>
      {children}
      {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
      {error && <p className="mt-1 text-[11px] text-rose-300">{error}</p>}
    </div>
  );
}

function Pill({
  children,
  active,
  onClick,
  tone = "cyan",
}: React.PropsWithChildren<{ active?: boolean; onClick?: () => void; tone?: "cyan" | "emerald" | "amber" }>) {
  const activeCls =
    tone === "emerald"
      ? "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30"
      : tone === "amber"
        ? "bg-amber-500/15 text-amber-300 ring-amber-400/30"
        : "bg-cyan-500/15 text-cyan-300 ring-cyan-400/30";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs ring-1 transition",
        active ? activeCls : "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10",
      ].join(" ")}
      aria-pressed={!!active}
    >
      {children}
    </button>
  );
}

function TagGroup({
  options,
  values,
  onToggle,
}: {
  options: string[];
  values?: string[];
  onToggle: (v: string) => void;
}) {
  const set = useMemo(() => new Set(values ?? []), [values]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = set.has(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={[
              "rounded-full px-3 py-1 text-xs ring-1 transition",
              active
                ? "bg-amber-500/15 text-amber-300 ring-amber-400/30"
                : "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10",
            ].join(" ")}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function Badge({
  children,
  icon,
  tone = "cyan",
}: React.PropsWithChildren<{ icon?: React.ReactNode; tone?: "cyan" | "emerald" | "amber" | "rose" }>) {
  const map: Record<string, string> = {
    cyan: "text-cyan-300 bg-cyan-500/15 ring-cyan-400/30",
    emerald: "text-emerald-300 bg-emerald-500/15 ring-emerald-400/30",
    amber: "text-amber-300 bg-amber-500/15 ring-amber-400/30",
    rose: "text-rose-300 bg-rose-500/15 ring-rose-400/30",
  };
  return (
    <span className={"inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] ring-1 " + map[tone]}>
      {icon}
      {children}
    </span>
  );
}

function QuickLink({ href, done, children }: React.PropsWithChildren<{ href: string; done?: boolean }>) {
  return (
    <a
      href={href}
      className={[
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ring-1 transition",
        done
          ? "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30"
          : "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10",
      ].join(" ")}
    >
      {done ? <CircleCheck className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
      {children}
    </a>
  );
}

function isSectionDone(keys: (keyof RequestFormValues)[], watchFn: any, authMethod?: AuthMethod) {
  return keys.every((k) => {
    if (k === "redirectUris" && authMethod !== "oauth2") return true;
    const v = watchFn(k as any);
    if (Array.isArray(v)) return v.length > 0;
    return v !== undefined && v !== null && String(v).trim() !== "";
  });
}