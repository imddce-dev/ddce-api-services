// components/request/API.tsx
"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { ChevronDown, Check as CheckIcon, X, FileDown } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useUserStore } from "@/stores/useUserStore";
import { createApiRequest} from "@/services/apiService";
import { CustomAlertSuccess, CustomAlertError } from "@/lib/alerts";
import { useRouter } from "next/navigation";

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
  Database,
  Lock,
  Paperclip,
} from "lucide-react";

/* --------------------------------- Types --------------------------------- */
type AuthMethod = "oauth2" | "client_credentials" | "apikey";
type DataSource = "mebs2" | "ebs_ddc" | "ebs_province";
type DataFormat = "json";

export type RequestFormValues = {
  // ผู้ยื่นคำขอ
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;

  // 🔹 เพิ่มฟิลด์จากฐาน
  organizerName: string;

  // โครงการ/ระบบ
  projectName: string;
  description: string;

  // แหล่งฐานข้อมูล (เลือกได้ 1)
  dataSource: DataSource;

  // การเข้าถึง/ขอบเขต
  scopes: string[];
  purpose: string;
  retentionDays: number;

  // รูปแบบข้อมูล (บังคับ JSON เท่านั้น)
  dataFormat: DataFormat;

  // การพิสูจน์ตัวตน/การเชื่อมต่อ
  authMethod: AuthMethod;
  redirectUris?: string;
  allowedIPs?: string;
  callbackUrl?: string;

  // แนบไฟล์เพื่อการพิสูจน์ตัวตน (ใช้ Array เพื่อให้ลบได้)
  authAttachment?: File[];

  // บังคับ 60 req/นาที เท่านั้น
  rateLimitPerMinute: number;

  agree: boolean;
};

/* ------------------------------- Const lists ------------------------------ */
const SCOPE_OPTIONS = [
  { value: "Methods Get", label: "Methods Get" },
  { value: "Methods Post", label: "Methods Post" },
];

const DATA_SOURCE_OPTIONS: { value: DataSource; label: string }[] = [
  { value: "mebs2", label: "M-EBS" },
  { value: "ebs_ddc", label: "EBS DDC" },
  { value: "ebs_province", label: "EBS Province" },
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

function formatDate(d: Date) {
  return d.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
function addYears(d: Date, n: number) {
  const out = new Date(d);
  out.setFullYear(out.getFullYear() + n);
  return out;
}
function addMonths(d: Date, n: number) {
  const out = new Date(d);
  const day = out.getDate();
  out.setMonth(out.getMonth() + n);
  if (out.getDate() !== day) out.setDate(0);
  return out;
}
function filesToText(list?: File[]) {
  if (!list || list.length === 0) return "-";
  return list.map((f) => f.name).join(", ");
}

// 🔹 กำหนดเพดานไฟล์
const MAX_FILES = 2;
const MAX_SIZE_MB = 2;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function APIForm({
  onSubmit: onSubmitProp,
  defaultValues,
}: {
  onSubmit?: (values: RequestFormValues) => Promise<void> | void;
  defaultValues?: Partial<RequestFormValues>;
}) {
  const [submitted, setSubmitted] = useState<RequestFormValues | null>(null);
  const [authFiles, setAuthFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  // 🔹 ดึงโปรไฟล์จากฐาน
  const userProfile = useUserStore((s) => s.userProfile);
  const fetchUserProfile = useUserStore((s) => s.fetchUserProfile);
  const isLoadingProfile = useUserStore((s) => s.isLoading);
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    trigger,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<RequestFormValues>({
    mode: "onChange",
    defaultValues: {
      requesterName: "",
      requesterEmail: "",
      requesterPhone: "",
      organizerName: "",
      scopes: [],
      retentionDays: 30,
      dataSource: undefined as unknown as DataSource,
      dataFormat: "json",
      authMethod: "client_credentials",
      rateLimitPerMinute: 60,
      authAttachment: [],
      ...defaultValues,
    },
  });

  // 🔹 โหลดโปรไฟล์ครั้งแรก
  useEffect(() => {
    if (!userProfile && !isLoadingProfile) {
      fetchUserProfile().catch(() => void 0);
    }
  }, [userProfile, isLoadingProfile, fetchUserProfile]);

  // 🔹 พรีฟิลค่าจากโปรไฟล์เข้าฟอร์ม
  useEffect(() => {
    if (!userProfile) return;
    if (userProfile.name) setValue("requesterName", userProfile.name, { shouldValidate: true });
    if (userProfile.email) setValue("requesterEmail", userProfile.email, { shouldValidate: true });
    if (userProfile.phone) setValue("requesterPhone", userProfile.phone, { shouldValidate: true });
    if (userProfile.organizerName)
      setValue("organizerName", userProfile.organizerName, { shouldValidate: true });
  }, [userProfile, setValue]);

  // sync local -> form state + trigger validate เมื่อ authFiles เปลี่ยน
  useEffect(() => {
    setValue("authAttachment", authFiles, { shouldDirty: true, shouldValidate: true });
    trigger("authAttachment");
  }, [authFiles, setValue, trigger]);

  // พร้อมส่งถ้ามีไฟล์ PDF อย่างน้อย 1 และไม่มี error
  const pdfReady = authFiles.length > 0 && !fileError;

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
      .split(/\น+/)
      .map((l) => l.trim())
      .filter(Boolean);
    return (
      lines.every(isIpOrCidr) ||
      "รูปแบบ IP/CIDR ไม่ถูกต้อง (เช่น 203.0.113.10 หรือ 203.0.113.0/24)"
    );
  };

  /* STEP 1: submit ฟอร์ม -> แค่เปิดโมดัลสรุป (ยังไม่ยิงจริง) */
  const onSubmit = async (values: RequestFormValues) => {
    if (values.rateLimitPerMinute !== 60) {
      alert("Rate limit ต้องเป็น 60 ครั้งต่อนาทีเท่านั้น");
      return;
    }
    if (values.dataFormat !== "json") {
      alert("รูปแบบข้อมูลต้องเป็น JSON เท่านั้น");
      return;
    }
    if (authFiles.length === 0) {
      setFileError("ต้องแนบไฟล์ PDF อย่างน้อย 1 ไฟล์");
      await trigger("authAttachment");
      return;
    }
    if (fileError) return;

    setSubmitted(values);
  };

  /* -------- Quick progress -------- */
  const requiredKeys: (keyof RequestFormValues)[] = [
    "requesterName",
    "requesterEmail",
    "requesterPhone",
    "organizerName",
    "projectName",
    "description",
    "dataSource",
    "dataFormat",
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

  /* -------- แนบไฟล์: PDF เท่านั้น + ลบได้ + จำกัดจำนวน/ขนาด -------- */
  const onPickFiles: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const list = e.target.files;
    if (!list || list.length === 0) return;

    const incoming = Array.from(list);

    // 1) อนุญาตเฉพาะ PDF
    const onlyPdf = incoming.filter(
      (f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name)
    );
    const rejectedType = incoming.filter((f) => !onlyPdf.includes(f));

    // 2) ตัดไฟล์ที่เกินขนาด
    const oversize = onlyPdf.filter((f) => f.size > MAX_SIZE_BYTES);
    const validBySize = onlyPdf.filter((f) => f.size <= MAX_SIZE_BYTES);

    // 3) รวมกับไฟล์เดิม + ไม่ให้ซ้ำ
    const map = new Map<string, File>();
    [...authFiles, ...validBySize].forEach((f) => map.set(`${f.name}:${f.size}`, f));
    let merged = Array.from(map.values());

    // 4) จำกัดจำนวนสูงสุด
    if (merged.length > MAX_FILES) {
      merged = merged.slice(0, MAX_FILES);
    }

    // 5) สร้างข้อความ error ตามเหตุผล
    const reasons: string[] = [];
    if (rejectedType.length > 0) reasons.push("อนุญาตเฉพาะไฟล์ PDF เท่านั้น");
    if (oversize.length > 0) reasons.push(`ขนาดไฟล์ละไม่เกิน ${MAX_SIZE_MB} MB`);
    if (authFiles.length + validBySize.length > MAX_FILES) {
      reasons.push(`อัปโหลดได้สูงสุด ${MAX_FILES} ไฟล์`);
    }
    setFileError(reasons.length ? reasons.join(" • ") : null);

    setAuthFiles(merged);
    e.currentTarget.value = "";
  };

  const removeFile = (key: string) => {
    setAuthFiles((prev) => prev.filter((f) => `${f.name}:${f.size}` !== key));
  };

  return (
    <>
      {/* Summary Modal */}
      {submitted && (
        <SummaryModal
          values={submitted}
          onConfirm={async () => {
            try {
                if (onSubmitProp) {
                  await onSubmitProp(submitted);
                } else {
                  const formData = new FormData();
                  Object.entries(submitted).forEach(([key, value]) => {
                    if (key === "authAttachment") return; 
                    if (key === "scopes") return;        

                    if (Array.isArray(value)) {
                      value.forEach((v) => formData.append(`${key}[]`, v.toString()));
                    } else if (value !== undefined && value !== null) {
                      formData.append(key, value.toString());
                    }
                  });
                    if (userProfile?.id) {
                      formData.append("userRecord", userProfile.id.toString());
                    }
                  if (submitted.authAttachment?.length) {
                    submitted.authAttachment.forEach((file) => {
                      formData.append("authAttachment[]", file);
                    });
                  }
                  const res = await createApiRequest(formData);

                  if (res.success) {
                    const alertSucc = await CustomAlertSuccess("บันทึกข้อมูลสำเร็จ","กรุณารอผลอนุมัติภายใน 7 วันทำการ")
                    if(alertSucc.isConfirmed){
                      router.push('/dashboard')
                      reset();
                      setAuthFiles([]);
                      setFileError(null);
                      setSubmitted(null);
                    }
                  } else {
                    CustomAlertError("",`ผิดพลาด: ${res.code}`)
                  }
                }
            } catch (err) {
              CustomAlertError("","เกิดข้อผิดพลาดในการส่งข้อมูล");
            } 
  }}
  onClose={() => setSubmitted(null)}
/>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* QuickNav + Progress */}
        <div className="sticky top-0 z-10 -mx-4 mb-1 border-b border-white/10 bg-slate-900/60 px-4 py-3 backdrop-blur md:rounded-xl">
          <div className="flex flex-wrap items-center gap-2">
            <QuickLink href="#sec-applicant" done={isSectionDone(
              ["requesterName","requesterEmail","requesterPhone","organizerName"],
              watch
            )}>
              ผู้ยื่น
            </QuickLink>
            <QuickLink href="#sec-project" done={isSectionDone(
              ["projectName","description","dataSource"],
              watch
            )}>
              โครงการ/ฐานข้อมูล
            </QuickLink>
            <QuickLink href="#sec-scope" done={isSectionDone(
              ["scopes","purpose","retentionDays","dataFormat"],
              watch
            )}>
              Scopes/Format
            </QuickLink>
            <QuickLink href="#sec-auth" done={isSectionDone(
              ["authMethod","redirectUris","callbackUrl"],
              watch,
              watch("authMethod")
            )}>
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
          <SectionCard
            id="sec-applicant"
            title="ข้อมูลผู้ยื่นคำขอ"
            icon={<Shield className="h-4 w-4 text-cyan-300" />}
          >
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
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "รูปแบบอีเมลไม่ถูกต้อง",
                  },
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
                    if (only.length < 9 || only.length > 15)
                      return "ความยาวควร 9–15 หลัก";
                    return true;
                  },
                })}
                inputMode="tel"
                autoComplete="tel"
              />
            </Field>

            {/* 🔹 หน่วยงานจากฐาน: แสดงแบบอ่านอย่างเดียว */}
            <Field label="หน่วยงาน *" error={errors.organizerName?.message}>
              <input
                className="input"
                readOnly
                placeholder="ระบบจะเติมจากโปรไฟล์"
                {...register("organizerName", { required: "ระบบไม่พบหน่วยงานในโปรไฟล์" })}
              />
              {userProfile?.organizerName && (
                <p className="mt-1 text-[11px] text-slate-400">
                  จากโปรไฟล์: {userProfile.organizerName}
                </p>
              )}
            </Field>
          </SectionCard>

          {/* ----------------------------- โครงการ ----------------------------- */}
          <SectionCard
            id="sec-project"
            title="ข้อมูลระบบ/โครงการ"
            icon={<Server className="h-4 w-4 text-emerald-300" />}
          >
            <Field label="ชื่อระบบ/โครงการ *" error={errors.projectName?.message}>
              <input
                className="input"
                placeholder="เช่น EBS Sync Chiangmai"
                {...register("projectName", { required: "กรอกชื่อระบบ/โครงการ" })}
              />
            </Field>

            <Field
              label="คำอธิบาย/บริบทการใช้งาน *"
              error={errors.description?.message}
            >
              <textarea
                className="input min-h-[88px]"
                placeholder="อธิบายวัตถุประสงค์ ระบบที่จะเชื่อมต่อ ผู้ใช้งานปลายทาง ฯลฯ"
                {...register("description", {
                  required: "กรอกรายละเอียด",
                  minLength: { value: 60, message: "อย่างน้อย 60 ตัวอักษร" },
                })}
              />
            </Field>

            <Field
              label="ฐานข้อมูลที่ต้องการเชื่อม *"
              error={errors.dataSource?.message}
            >
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {DATA_SOURCE_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
                  >
                    <input
                      type="radio"
                      className="h-4 w-4 rounded-full border-white/20 bg-slate-900/60"
                      value={opt.value}
                      {...register("dataSource", { required: "เลือกฐานข้อมูล" })}
                    />
                    <span className="inline-flex items-center gap-2">
                      <Database className="h-4 w-4 text-amber-300" />
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                เลือกได้เพียง 1 แหล่งข้อมูลสำหรับคำขอนี้
              </p>
            </Field>
          </SectionCard>

          {/* ----------------------------- Scopes ------------------------------ */}
          <SectionCard
              id="sec-scope"
              title="ขอบเขตการเข้าถึง (Scopes) และรูปแบบข้อมูล"
              icon={<KeyRound className="h-4 w-4 text-amber-300" />}
            >
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {SCOPE_OPTIONS.map((s) => (
                    <label
                      key={s.value}
                      className="flex items-center gap-3 text-sm text-slate-200"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/20 bg-slate-900/60"
                        value={s.value}
                        checked
                        readOnly   
                      />
                      <span>{s.label}</span>
                    </label>
                  ))}
                </div>
                
              </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field
                label="ระยะเวลาการเก็บรักษาข้อมูล (วัน) *"
                error={errors.retentionDays?.message}
              >
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

              {/* Data format: JSON only */}
              <Field
                label="รูปแบบข้อมูล (Data format) *"
                error={errors.dataFormat?.message}
              >
                <Controller
                  name="dataFormat"
                  control={control}
                  rules={{
                    required: "เลือก Data format",
                    validate: (v) => v === "json" || "อนุญาตเฉพาะ JSON เท่านั้น",
                  }}
                  render={({ field }) => (
                    <FancySelect
                      placeholder="เลือกรูปแบบข้อมูล"
                      options={[{ value: "json", label: "JSON" }]}
                      value={field.value}
                      onChange={(v) => field.onChange(v as DataFormat)}
                      readOnly
                    />
                  )}
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  ระบบรองรับเฉพาะ JSON เท่านั้น
                </p>
              </Field>
            </div>

            <Field
              label="วัตถุประสงค์การใช้งาน (purpose) *"
              error={errors.purpose?.message}
            >
              <textarea
                className="input min-h-[88px]"
                placeholder="เหตุผลตามภารกิจ/กฎหมายที่ต้องใช้ข้อมูล และผลกระทบหากไม่ได้รับอนุญาต"
                {...register("purpose", {
                  required: "กรอกวัตถุประสงค์",
                  minLength: { value: 60, message: "อย่างน้อย 60 ตัวอักษร" },
                })}
              />
            </Field>

            {/* Rate limit */}
            <Field label="อัตราการเรียกใช้งาน (Rate limit)">
              <div className="flex items-center gap-2">
                <input
                  className="input w-32"
                  type="number"
                  readOnly
                  value={60}
                  {...register("rateLimitPerMinute", {
                    valueAsNumber: true,
                    validate: (v) =>
                      v === 60 || "Rate limit ต้องเป็น 60 ครั้งต่อนาทีเท่านั้น",
                  })}
                />
                <span className="text-sm text-slate-300">ครั้ง/นาที</span>
                <Badge tone="emerald" icon={<Lock className="h-3 w-3" />}>
                  กำหนดโดยระบบ
                </Badge>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                คำขอทั้งหมดในสัญญานี้ถูกจำกัดที่ <strong>60 ครั้งต่อนาที</strong> (per client)
              </p>
            </Field>
          </SectionCard>

          {/* ----------------------------- Auth/Connect ------------------------ */}
          <SectionCard
            id="sec-auth"
            title="การพิสูจน์ตัวตนและการเชื่อมต่อ"
            icon={<Globe className="h-4 w-4 text-cyan-300" />}
          >
            <div className="flex flex-wrap gap-2">
              <Pill
                active={authMethod === "client_credentials"}
                onClick={() =>
                  setValue("authMethod", "client_credentials", {
                    shouldDirty: true,
                  })
                }
              >
                <KeyRound className="h-3.5 w-3.5" />
                Client Credentials
                {authMethod === "client_credentials" ? (
                  <Check className="h-3.5 w-3.5" />
                ) : null}
              </Pill>
              <Pill
                active={authMethod === "apikey"}
                onClick={() =>
                  setValue("authMethod", "apikey", { shouldDirty: true })
                }
              >
                <KeyRound className="h-3.5 w-3.5" />
                API Key
                {authMethod === "apikey" ? (
                  <Check className="h-3.5 w-3.5" />
                ) : null}
              </Pill>
            </div>

            {authMethod === "oauth2" ? (
              <Field
                label="Redirect URIs *"
                hint="1 บรรทัดต่อ 1 URI (ต้องเป็น https://)"
                error={errors.redirectUris?.message}
              >
                <textarea
                  className="input min-h-[88px]"
                  placeholder={
                    "https://example.com/oauth/callback\nhttps://example.com/oauth/callback2"
                  }
                  {...register("redirectUris", { validate: validateRedirectUris })}
                />
              </Field>
            ) : (
              <Field
                label="Callback URL (ถ้ามี)"
                hint="ใช้รับ Webhook หรือผลประมวลผล"
                error={errors.callbackUrl?.message}
              >
                <input
                  className="input"
                  placeholder="https://example.com/webhook"
                  {...register("callbackUrl", { validate: validateCallbackUrl })}
                />
              </Field>
            )}

            {/* แนบไฟล์การพิสูจน์ตัวตน (PDF เท่านั้น) */}
            <Field
              label={`แนบไฟล์เอกสาร * (PDF เท่านั้น, สูงสุด ${MAX_FILES} ไฟล์, ไฟล์ละ ≤ ${MAX_SIZE_MB} MB)`} // 🔹
              hint="เช่น หนังสือ/แบบฟอร์มที่เกี่ยวข้อง"
              error={fileError || ((errors.authAttachment?.message as string) ?? undefined)}
            >
              <input
                type="file"
                multiple
                accept="application/pdf,.pdf"
                onChange={onPickFiles}
                className="block w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-200 file:mr-3 file:rounded-lg file:border-0 file:bg-cyan-500/20 file:px-3 file:py-1.5 file:text-cyan-200 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-cyan-400/20"
              />

              {/* ฟิลด์ซ่อนเพื่อผูก validation กับ react-hook-form */}
              <input
                type="hidden"
                {...register("authAttachment", {
                  validate: (arr) => {
                    const files = (arr as File[]) || [];
                    if (files.length === 0) return "ต้องแนบไฟล์ PDF อย่างน้อย 1 ไฟล์";
                    if (files.length > MAX_FILES) return `อัปโหลดได้สูงสุด ${MAX_FILES} ไฟล์`;
                    const overs = files.filter((f) => f.size > MAX_SIZE_BYTES);
                    if (overs.length > 0) return `ขนาดไฟล์ละไม่เกิน ${MAX_SIZE_MB} MB`;
                    const okType = files.every((f) => /\.pdf$/i.test(f.name));
                    return okType || "ต้องแนบเฉพาะไฟล์ PDF เท่านั้น";
                  },
                })}
              />

              {authFiles.length > 0 && (
                <div className="mt-2 flex max-h-40 flex-wrap gap-2 overflow-auto">
                  {authFiles.map((f) => {
                    const key = `${f.name}:${f.size}`;
                    return (
                      <span
                        key={key}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-200"
                        title={f.name}
                      >
                        <Paperclip className="h-3.5 w-3.5 text-slate-400" />
                        <span className="max-w-[220px] truncate">
                          {f.name} ({(f.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(key)}
                          className="rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-white/20"
                          aria-label={`นำออก ${f.name}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
              <p className="mt-2 text-[11px] text-slate-400">
                อัปโหลดแล้ว {authFiles.length}/{MAX_FILES} ไฟล์
              </p>
            </Field>

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
          </SectionCard>
        </div>

        {/* ----------------------------- ยืนยัน + Actions ----------------------------- */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <label className="flex items-start gap-3 text-sm text-slate-300">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-white/20 bg-slate-900/60"
              {...register("agree", {
                required:
                  "กรุณายอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว",
              })}
            />
            <span>
              ฉันยืนยันว่าได้อ่านเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว
              และยอมรับข้อกำหนดทั้งหมด
            </span>
          </label>
          {errors.agree && (
            <p className="mt-1 text-xs text-rose-300">
              {errors.agree.message as string}
            </p>
          )}
        </div>

        {/* Action Bar ติดท้าย */}
        <div className="sticky bottom-0 z-10 -mx-4 border-t border-white/10 bg-slate-900/70 px-4 py-3 backdrop-blur md:rounded-xl">
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="submit"
              disabled={!isValid || isSubmitting || !pdfReady}
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
              onClick={() => {
                reset();
                setAuthFiles([]);
                setFileError(null);
              }}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-medium text-slate-200 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/20"
            >
              ล้างแบบฟอร์ม
            </button>

            <a
              href="https://drive.google.com/drive/folders/1cpPBejMWzIhgMDsXr4tmZj1G6bUEf2vj?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-medium text-slate-200 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/20"
            >
              <FileDown className="mr-2 h-4 w-4" />
              Download เอกสารตัวอย่าง (PDF)
            </a>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            * โปรดระบุเฉพาะข้อมูลเท่าที่จำเป็น • ระบบจะพิจารณาตามหลักความจำเป็นและสัดส่วน (data minimization)
          </p>
        </div>
      </form>
    </>
  );
}

/* ---------------------------- Reusable pieces ---------------------------- */
function SectionCard({
  id,
  title,
  icon,
  children,
}: React.PropsWithChildren<{
  id?: string;
  title: string;
  icon?: React.ReactNode;
}>) {
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
}: React.PropsWithChildren<{
  label: string;
  hint?: string;
  error?: string;
  className?: string;
}>) {
  return (
    <div className={className}>
      <div className="mb-1 flex items-center gap-2">
        <span className="text-xs text-slate-300">{label}</span>
        {error ? (
          <Badge tone="rose" icon={<Circle className="h-3 w-3" />}>
            ต้องแก้
          </Badge>
        ) : null}
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
}: React.PropsWithChildren<{
  active?: boolean;
  onClick?: () => void;
  tone?: "cyan" | "emerald" | "amber";
}>) {
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
        active
          ? activeCls
          : "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10",
      ].join(" ")}
      aria-pressed={!!active}
    >
      {children}
    </button>
  );
}

function Badge({
  children,
  icon,
  tone = "cyan",
}: React.PropsWithChildren<{
  icon?: React.ReactNode;
  tone?: "cyan" | "emerald" | "amber" | "rose";
}>) {
  const map: Record<string, string> = {
    cyan: "text-cyan-300 bg-cyan-500/15 ring-cyan-400/30",
    emerald: "text-emerald-300 bg-emerald-500/15 ring-emerald-400/30",
    amber: "text-amber-300 bg-amber-500/15 ring-amber-400/30",
    rose: "text-rose-300 bg-rose-500/15 ring-rose-400/30",
  };
  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] ring-1 " +
        map[tone]
      }
    >
      {icon}
      {children}
    </span>
  );
}

function QuickLink({
  href,
  done,
  children,
}: React.PropsWithChildren<{ href: string; done?: boolean }>) {
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

function isSectionDone(
  keys: (keyof RequestFormValues)[],
  watchFn: any,
  authMethod?: AuthMethod
) {
  return keys.every((k) => {
    if (k === "redirectUris" && authMethod !== "oauth2") return true;
    const v = watchFn(k as any);
    if (Array.isArray(v)) return v.length > 0;
    return v !== undefined && v !== null && String(v).trim() !== "";
  });
}

/* ------------------------------- Summary UI ------------------------------ */
function Row({ k, v }: { k: string; v?: string | number | boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-slate-400">{k}</span>
      <span className="text-sm text-slate-200">{String(v ?? "-")}</span>
    </div>
  );
}

function humanDS(ds?: DataSource) {
  return DATA_SOURCE_OPTIONS.find((o) => o.value === ds)?.label ?? "-";
}

/* --------------------------- Summary Modal + Transition ------------------ */
function SummaryModal({
  values,
  onConfirm,
  onClose,
}: {
  values: RequestFormValues;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
}) {
  const [loading, setLoading] = React.useState(false);
  const [show, setShow] = React.useState(false);

  const today = React.useMemo(() => new Date(), []);
  const contractStart = today;
  const contractEnd = addYears(today, 1);
  const apiKeyExpire = addMonths(today, 6);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 180);
  };

  return (
    <div
      className={[
        "fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-4",
        "bg-black/0 transition-colors duration-150",
        show ? "bg-black/60" : "bg-black/0",
      ].join(" ")}
      aria-modal
      role="dialog"
    >
      <div
        className={[
          "w-full max-w-[min(100vw-1.5rem,44rem)] sm:max-w-[min(100vw-2rem,48rem)]",
          "max-h-[90svh] overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 shadow-2xl ring-1 ring-white/10 backdrop-blur",
          "transform transition-all duration-150 origin-center",
          show ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1",
        ].join(" ")}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-white/10 bg-slate-900/90 px-4 py-3">
          <h3 className="text-base font-semibold text-slate-100">สรุปคำขอใช้งาน API</h3>
          <Badge tone="cyan">ตรวจสอบข้อมูล</Badge>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-4 py-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Applicant */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <h4 className="mb-2 text-xs font-semibold text-slate-300">ผู้ยื่น</h4>
              <div className="space-y-1.5">
                <Row k="ชื่อ-สกุล" v={values.requesterName} />
                <Row k="อีเมล" v={values.requesterEmail} />
                <Row k="เบอร์" v={values.requesterPhone} />
                <Row k="หน่วยงาน" v={values.organizerName} />
              </div>
            </div>

            {/* Project */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <h4 className="mb-2 text-xs font-semibold text-slate-300">โครงการ</h4>
              <div className="space-y-1.5">
                <Row k="ชื่อระบบ/โครงการ" v={values.projectName} />
                <Row k="ฐานข้อมูล" v={humanDS(values.dataSource)} />
                <Row k="Data format" v={values.dataFormat.toUpperCase()} />
                <Row k="Rate limit" v={`${values.rateLimitPerMinute} ครั้ง/นาที`} />
              </div>
            </div>

            {/* Detail */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 sm:col-span-2">
              <h4 className="mb-2 text-xs text-slate-300 font-semibold">รายละเอียด</h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Row k="Scopes" v={(values.scopes || []).join(", ") || "-"} />
                  <Row k="Retention (วัน)" v={values.retentionDays} />
                </div>
                <div className="space-y-1.5">
                  <Row k="Auth Method" v={values.authMethod} />
                  <Row k="Callback URL" v={values.callbackUrl || "-"} />
                </div>
              </div>

              <div className="mt-2 rounded-lg border border-white/10 bg-white/5 p-2">
                <div className="text-xs text-slate-400">วัตถุประสงค์</div>
                <div className="whitespace-pre-wrap text-sm text-slate-200">
                  {values.purpose}
                </div>
              </div>

              <div className="mt-2 rounded-lg border border-white/10 bg-white/5 p-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Paperclip className="h-3.5 w-3.5" />
                  ไฟล์ที่แนบ (การพิสูจน์ตัวตน)
                </div>
                <div className="text-sm text-slate-200 truncate">
                  {filesToText(values.authAttachment)}
                </div>
              </div>
            </div>
          </div>

          <DialogNotes authMethod={values.authMethod} />
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 flex flex-col gap-2 border-t border-white/10 bg-slate-900/90 px-4 py-3 sm:flex-row">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-cyan-500/90 px-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-400/30 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                กำลังยืนยัน…
              </>
            ) : (
              "ยืนยันการส่งคำขอ"
            )}
          </button>
          <button
            onClick={handleClose}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-medium text-slate-200 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/20"
          >
            แก้ไขข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
}

function DialogNotes({ authMethod }: { authMethod: AuthMethod }) {
  const today = useMemo(() => new Date(), []);
  const contractStart = today;
  const contractEnd = addYears(today, 1);
  const apiKeyExpire = addMonths(today, 6);
  return (
    <div className="mt-4 space-y-2">
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">
        คำขอนี้จะได้รับการพิจารณาผลใน <strong>7–15 วันทำการ</strong> และทีมงานจะติดต่อกลับทางอีเมลที่ระบุ
      </div>
      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-sm text-cyan-200">
        โดยสัญญาการขอมีระยะเวลา <strong>1 ปี</strong> นับจาก{" "}
        <span className="mx-1 underline decoration-cyan-300">{formatDate(contractStart)}</span>
        ถึง{" "}
        <span className="mx-1 underline decoration-cyan-300">{formatDate(contractEnd)}</span>
        รวมเป็นเวลา 1 ปีเต็ม
      </div>
      {authMethod === "apikey" && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-200">
          อายุ <strong>API Key</strong> อยู่ได้ <strong>6 เดือน</strong> นับจากวันที่อนุมัติ
          (ประมาณ{" "}
          <span className="underline decoration-amber-300">
            {formatDate(apiKeyExpire)}
          </span>
          ) หลังจากนั้นสามารถต่ออายุ/ออกคีย์ใหม่ได้
        </div>
      )}
    </div>
  );
}

/* ------------------------ FancySelect ---------------------- */
type FancyOption<T extends string> = { value: T; label: string };

function FancySelect<T extends string>({
  options,
  value,
  onChange,
  placeholder = "เลือกค่า",
  readOnly,
}: {
  options: FancyOption<T>[];
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState<number>(-1);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (readOnly) return;
    if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
      setOpen(true);
      setCursor(Math.max(0, options.findIndex((o) => o.value === value)));
      e.preventDefault();
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      setCursor((c) => (c + 1) % options.length);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setCursor((c) => (c - 1 + options.length) % options.length);
      e.preventDefault();
    } else if (e.key === "Enter") {
      const opt = options[cursor];
      if (opt) onChange(opt.value);
      setOpen(false);
      e.preventDefault();
    } else if (e.key === "Escape") {
      setOpen(false);
      e.preventDefault();
    }
  };

  return (
    <div className="relative" ref={ref} onKeyDown={onKeyDown}>
      <button
        type="button"
        disabled={readOnly}
        onClick={() => setOpen((v) => !v)}
        className={[
          "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left text-sm text-slate-200",
          "focus:outline-none focus:ring-4 focus:ring-cyan-400/20",
          readOnly ? "cursor-not-allowed opacity-80" : "hover:bg-white/10",
        ].join(" ")}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex items-center justify-between">
          <span className={selected ? "" : "text-slate-400"}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown
            className={[
              "h-4 w-4 transition-transform duration-150",
              open ? "rotate-180 text-slate-200" : "text-slate-400",
            ].join(" ")}
          />
        </div>
      </button>

      <div
        role="listbox"
        className={[
          "absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 p-1 shadow-2xl ring-1 ring-white/10 backdrop-blur",
          "origin-top transform transition-all duration-150",
          open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none",
        ].join(" ")}
      >
        <ul className="max-h-56 overflow-auto">
          {options.map((o, i) => {
            const active = i === cursor || o.value === value;
            return (
              <li
                key={o.value}
                role="option"
                aria-selected={o.value === value}
                className={[
                  "flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-sm",
                  "transition-colors duration-100",
                  active ? "bg-white/10 text-slate-100" : "text-slate-200 hover:bg-white/5",
                ].join(" ")}
                onMouseEnter={() => setCursor(i)}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
              >
                <span>{o.label}</span>
                {o.value === value ? (
                  <CheckIcon className="h-4 w-4 text-emerald-300 transition-opacity duration-150" />
                ) : (
                  <span className="h-4 w-4" />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
