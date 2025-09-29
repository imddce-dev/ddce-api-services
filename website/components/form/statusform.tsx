// components/apis/StatusForm.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import {
  Search, Filter, RefreshCw, Calendar,
  CheckCircle2, Clock, XCircle, Server, Slash,
  KeySquare, Copy, Check, ChevronRight,
} from "lucide-react";

/* ---------- types & mock ---------- */
type Status = "pending" | "approved" | "rejected";
type Row = {
  id: string;
  system: string;
  requester: string;
  createdAt: string;
  environment: "sandbox" | "production";
  auth: "apikey";
  scopes: string[];
  status: Status;
};

const rows: Row[] = [
  { id:"REQ-25-0010", system:"EBS Sync Chiangmai", requester:"สสจ. เชียงใหม่", createdAt:"2025-09-16 09:30", environment:"sandbox",    auth:"apikey", scopes:["read:events","notify:send"], status:"pending" },
  { id:"REQ-25-0009", system:"M-EBS Dashboard",    requester:"สคร. 1 เชียงใหม่", createdAt:"2025-09-15 10:22", environment:"production", auth:"apikey", scopes:["read:events"],              status:"approved" },
  { id:"REQ-25-0008", system:"Provincial Lab Bridge", requester:"ศูนย์ Lab กลาง", createdAt:"2025-09-12 14:05", environment:"sandbox",    auth:"apikey", scopes:["read:lab"],                 status:"rejected" },
  { id:"REQ-25-0007", system:"Notification Relay", requester:"สสจ. ขอนแก่น", createdAt:"2025-09-11 08:15", environment:"production", auth:"apikey", scopes:["notify:send"],            status:"pending" },
];

/* ---------- helpers ---------- */
const cx = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(" ");
const genApiKey = (r: Row) =>
  `APIK-${
    Array.from(new TextEncoder().encode(`${r.id}|${r.environment}|${r.auth}`))
      .map(b => b.toString(16).padStart(2,"0")).join("").slice(0,24).toUpperCase()
      .replace(/(.{6})(.{6})(.{6})(.{6})/, "$1-$2-$3-$4")
  }`;

function StatusPill({ s }: { s: Status }) {
  const m = {
    approved: { t: "อนุมัติแล้ว", c: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20", i: <CheckCircle2 className="h-4 w-4" /> },
    pending:  { t: "รอตรวจสอบ",  c: "bg-amber-500/10  text-amber-300  ring-amber-400/20",  i: <Clock className="h-4 w-4" /> },
    rejected: { t: "ปฏิเสธ",      c: "bg-rose-500/10   text-rose-300   ring-rose-400/20",   i: <XCircle className="h-4 w-4" /> },
  }[s];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ring-1 ${m.c}`}>{m.i}{m.t}</span>;
}
const EnvPill = ({ env }: { env: Row["environment"] }) => (
  <span className={cx(
    "rounded-full px-2 py-0.5 text-[11px] ring-1",
    env === "production" ? "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20" : "bg-cyan-500/10 text-cyan-300 ring-cyan-400/20"
  )}>{env}</span>
);

/* ---------- dialog ---------- */
function ApiKeyDialog({ open, onClose, row }: { open: boolean; onClose: () => void; row: Row | null }) {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => setCopied(false), [open]);
  if (!row) return null;
  const apiKey = genApiKey(row);

  return (
    <Transition appear show={open} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={React.Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={React.Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-6 text-slate-100 shadow-xl">
                <Dialog.Title className="text-lg font-semibold">API Key — {row.system}</Dialog.Title>
                <div className="mt-1 text-xs text-slate-400">รหัสคำขอ {row.id}</div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="text-xs text-slate-400">ผู้ยื่น</div>
                  <div className="text-sm text-slate-200">{row.requester}</div>
                  <div className="text-xs text-slate-400">Environment</div>
                  <div><EnvPill env={row.environment} /></div>
                  <div className="text-xs text-slate-400">Scopes</div>
                  <div className="flex flex-wrap gap-1">
                    {row.scopes.map(s => <span key={s} className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-slate-300 ring-1 ring-white/10">{s}</span>)}
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-1 text-xs text-slate-400">API Key</div>
                  <div className="flex items-stretch gap-2">
                    <div className="select-all flex-1 rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 font-mono text-sm">{apiKey}</div>
                    <button
                      onClick={async () => { await navigator.clipboard.writeText(apiKey); setCopied(true); setTimeout(()=>setCopied(false), 1200); }}
                      className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 text-sm hover:bg-white/15"
                      aria-label="คัดลอก API Key"
                    >
                      {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />} คัดลอก
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5">ปิด</button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

/* ---------- small ---------- */
function Chip({ active, onClick, icon, children }: { active?: boolean; onClick?: () => void; icon?: React.ReactNode; children: React.ReactNode; }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ring-1 transition",
        active ? "bg-cyan-500/15 text-cyan-300 ring-cyan-400/30" : "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10"
      )}
    >
      {icon}{children}
    </button>
  );
}

/* ---------- main (USER) ---------- */
export default function StatusForm() {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<Status | "all">("all");
  const [env, setEnv] = React.useState<"all" | "sandbox" | "production">("all");
  const [dlgOpen, setDlgOpen] = React.useState(false);
  const [active, setActive] = React.useState<Row | null>(null);

  const list = rows.filter(r => {
    const text = q.trim().toLowerCase();
    const byText   = !text || [r.id, r.system, r.requester, ...r.scopes].join(" ").toLowerCase().includes(text);
    const byStat   = status === "all" || r.status === status;
    const byEnv    = env === "all"    || r.environment === env;
    return byText && byStat && byEnv;
  });

  return (
    <section className="w-full max-w-[1180px] mx-auto px-0 sm:px-0 no-scrollbar">
      <div className=" rounded-2xl border border-white/10 bg-slate-900/60 ring-1 ring-inset ring-white/5">
        {/* Toolbar (ติดในกรอบ, ซ่อนสกรอลบาร์เอง) */}
        <div className="sticky top-0 z-10 rounded-t-2xl border-b border-white/10 bg-slate-900/80 px-4 sm:px-5 py-4 backdrop-blur">
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative flex-1 min-w-[220px]" aria-label="กล่องค้นหา">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e)=>setQ(e.target.value)}
                placeholder="ค้นหา รหัสคำขอ / ระบบ / ผู้ยื่น / scope…"
                className="h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 text-sm outline-none ring-1 ring-inset ring-white/5 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-400/40"
              />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <Chip active={status==="all"} onClick={()=>setStatus("all")} icon={<Slash className="h-4 w-4" />}>ทั้งหมด</Chip>
              <Chip active={status==="pending"} onClick={()=>setStatus("pending")} icon={<Clock className="h-4 w-4" />}>รอตรวจ</Chip>
              <Chip active={status==="approved"} onClick={()=>setStatus("approved")} icon={<CheckCircle2 className="h-4 w-4" />}>อนุมัติ</Chip>
              <Chip active={status==="rejected"} onClick={()=>setStatus("rejected")} icon={<XCircle className="h-4 w-4" />}>ปฏิเสธ</Chip>
            </div>

            <div className="ml-auto flex flex-wrap items-center gap-2">
              {/* <Chip active={env==="sandbox"} onClick={()=>setEnv(env==="sandbox"?"all":"sandbox")} icon={<Server className="h-4 w-4" />}>Sandbox</Chip>
              <Chip active={env==="production"} onClick={()=>setEnv(env==="production"?"all":"production")} icon={<Server className="h-4 w-4" />}>Production</Chip> */}

              {/* <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10" aria-label="เลือกช่วงวัน">
                <Calendar className="mr-1 inline h-4 w-4" /> ช่วงวัน
              </button>
              <button onClick={()=>{ setQ(""); setStatus("all"); setEnv("all"); }} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10">
                <Filter className="mr-1 inline h-4 w-4" /> ล้างฟิลเตอร์
              </button>
              <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10">
                <RefreshCw className="mr-1 inline h-4 w-4" /> รีเฟรช
              </button> */}
            </div>
          </div>
        </div>

        {/* Cards (auto-fit กันล้น) */}
        <div className="p-5 sm:p-6">
          {list.length === 0 ? (
            <div className="grid place-items-center rounded-xl border border-dashed border-white/10 p-10 text-sm text-slate-400">
              ไม่พบรายการที่ตรงกับเงื่อนไข
            </div>
          ) : (
            <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
              {list.map((r) => (
                <article key={r.id} className="group flex flex-col rounded-2xl border border-white/10 bg-slate-900/70 p-4 ring-1 ring-inset ring-white/5 transition hover:border-cyan-400/30 hover:ring-cyan-400/20">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/request/${r.id}`} className="text-cyan-300 hover:text-cyan-200">{r.id}</Link>
                      <div className="mt-1 text-[13px] text-slate-300">{r.system}</div>
                    </div>
                    <StatusPill s={r.status} />
                  </div>

                  <div className="mt-3 grid grid-cols-[auto,1fr] gap-x-3 gap-y-2 text-[13px]">
                    <div className="text-slate-400">ผู้ยื่น</div><div className="text-slate-200">{r.requester}</div>
                    <div className="text-slate-400">Env</div><div><EnvPill env={r.environment} /></div>
                    <div className="text-slate-400">Scopes</div>
                    <div className="flex flex-wrap gap-1">
                      {r.scopes.map(s => <span key={s} className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-slate-300 ring-1 ring-white/10">{s}</span>)}
                    </div>
                    <div className="text-slate-400">วันที่ยื่น</div><div className="tabular-nums text-slate-300">{r.createdAt}</div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1 text-[11px] text-slate-300 ring-1 ring-white/10">
                      <KeySquare className="h-4 w-4" /> API Key
                    </span>

                    {r.status === "approved" ? (
                      <button
                        onClick={()=>{ setActive(r); setDlgOpen(true); }}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-medium text-white shadow hover:bg-emerald-500"
                        aria-label={`ดู API Key ของ ${r.id}`}
                      >
                        <KeySquare className="h-4 w-4" /> ดู API Key
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-400">
                        รออนุมัติ <ChevronRight className="h-4 w-4 opacity-60" />
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-4 text-right text-xs text-slate-500">แสดง {list.length} รายการ</div>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500">เคล็ดลับ: รายการที่ “อนุมัติแล้ว” จะมีปุ่ม “ดู API Key” ให้กดเพื่อเปิดดู/คัดลอก</div>

      <ApiKeyDialog open={dlgOpen} onClose={()=>setDlgOpen(false)} row={active} />
    </section>
  );
}
