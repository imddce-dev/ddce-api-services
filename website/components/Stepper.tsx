import React from "react";
import { Clock, ShieldCheck, XCircle } from "lucide-react";

/* ------------------------ helpers ------------------------ */
function normalizeStatus(s?: string) {
  if (!s) return "";
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")                 // ลบช่องว่างทั้งหมด
    .replace(/[^\p{L}\p{N}]/gu, "");     // เก็บเฉพาะตัวอักษร/ตัวเลข (กันอักขระพิเศษ)
}

/** แปลง status -> step (1..3) + denied
 * รองรับ: sending -> 1, pending -> 2, active -> 3
 * ไทย: กำลังดำเนินการ/อนุมัติ/ปฏิเสธ
 * อังกฤษ: pending/approved/rejected (และคำพ้อง)
 */
export function stepFromStatus(status?: string): { step: 1 | 2 | 3; denied: boolean } {
  const n = normalizeStatus(status);

  // เส้นทางใหม่ตามที่แจ้ง: sending → pending → active
  if (n.includes("sending")) return { step: 1, denied: false };
  if (n.includes("pending")) return { step: 2, denied: false };
  if (n.includes("active"))  return { step: 3, denied: false };

  // ไทย
  if (n.includes("กำลังดำเนินการ")) return { step: 2, denied: false };
  if (n.includes("อนุมัติ"))        return { step: 3, denied: false };
  if (n.includes("ปฏิเสธ") || n.includes("ปฏิสธ") || n.includes("ปัฏิสธ"))
    return { step: 3, denied: true };

  // อังกฤษพ้อง
  if (n.includes("approved") || n.includes("success"))  return { step: 3, denied: false };
  if (n.includes("rejected") || n.includes("denied") || n.includes("failed"))
    return { step: 3, denied: true };
  if (n.includes("inprogress") || n.includes("processing")) return { step: 2, denied: false };

  // ไม่รู้จัก = ขั้น 1
  return { step: 1, denied: false };
}

/* ------------------------ Stepper ------------------------ */
export type StepperProps =
  | { status: string; step?: never }
  | { step: 1 | 2 | 3; status?: never };

export default function Stepper(props: StepperProps) {
  const { step, denied } =
    "status" in props ? stepFromStatus(props.status) : { step: props.step, denied: false };

  return (
    <div className="flex items-center gap-2">
      <Dot active label="ส่งคำขอ" />
      <Line active={step >= 2} />
      <Dot active={step >= 2} label="กำลังดำเนินการ" icon={Clock} />
      <Line active={step >= 3} />
      <Dot
        active={step >= 3}
        label={denied ? "ปฏิเสธ" : "อนุมัติ"}
        icon={denied ? XCircle : ShieldCheck}
        denied={denied}
      />
    </div>
  );
}

function Dot({
  active,
  denied,
  label,
  icon: Icon,
}: {
  active?: boolean;
  denied?: boolean;
  label: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={[
          "grid h-3.5 w-3.5 place-items-center rounded-full transition-colors",
          active ? (denied ? "bg-rose-500" : "bg-emerald-500") : "bg-slate-600",
        ].join(" ")}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-white/85" />
      </span>
      <span
        className={`text-xs inline-flex items-center gap-1 ${
          active ? (denied ? "text-rose-300" : "text-emerald-300") : "text-slate-500"
        }`}
      >
        {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
        {label}
      </span>
    </div>
  );
}

function Line({ active }: { active?: boolean }) {
  return (
    <span
      className={`h-px w-10 md:w-14 lg:w-20 transition-colors ${
        active ? "bg-gradient-to-r from-slate-600 via-emerald-500/50 to-slate-600" : "bg-slate-700"
      }`}
    />
  );
}
