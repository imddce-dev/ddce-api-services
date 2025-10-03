import React from "react";
import { Clock, ShieldCheck, XCircle } from "lucide-react";

function normalize(s?: string) {
  return (s ?? "").toLowerCase().trim().replace(/\s+/g, "");
}

export default function StatusBadge({ status }: { status: string }) {
  const n = normalize(status);

  let label = status;
  let cls = "bg-slate-600/20 text-slate-300 ring-1 ring-inset ring-slate-600/40";
  let Icon: React.ElementType | null = null;

  // สามสถานะหลักของคุณ
  if (n.includes("sending")) {
    label = "ส่งคำขอ";
    cls = "bg-slate-500/15 text-slate-300 ring-1 ring-inset ring-slate-500/30";
    Icon = Clock;
  } else if (n.includes("pending")) {
    label = "กำลังดำเนินการ";
    cls = "bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/30";
    Icon = Clock;
  } else if (n.includes("active")) {
    label = "อนุมัติ";
    cls = "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30";
    Icon = ShieldCheck;
  }

  // ปฏิเสธ (ถ้ามี)
  if (["rejected", "denied", "failed", "ปฏิเสธ", "ปฏิสธ", "ปัฏิสธ"].some((k) => n.includes(k)))
  {
    label = "ปฏิเสธ";
    cls = "bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-500/30";
    Icon = XCircle;
  }

  const I = Icon ?? Clock;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}
    >
      <I className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
