// components/apis/StatusForm.tsx
"use client";

import React from "react";
import Link from "next/link";
import {
  Search, Filter, RefreshCw, ChevronRight, ChevronLeft, Calendar,
  CheckCircle2, Clock, XCircle, KeyRound, Server, Globe, Shield, Slash,
} from "lucide-react";

/* ------------ types & mock ------------ */
type Status = "pending" | "approved" | "rejected";
type Row = {
  id: string;
  system: string;
  requester: string;
  createdAt: string;
  environment: "sandbox" | "production";
  auth: "oauth2" | "client_credentials" | "apikey";
  scopes: string[];
  status: Status;
};

const mock: Row[] = [
  { id:"REQ-25-0010", system:"EBS Sync Chiangmai", requester:"สสจ. เชียงใหม่", createdAt:"2025-09-16 09:30", environment:"sandbox", auth:"oauth2", scopes:["read:events","notify:send"], status:"pending" },
  { id:"REQ-25-0009", system:"M-EBS Dashboard", requester:"สคร. 1 เชียงใหม่", createdAt:"2025-09-15 10:22", environment:"production", auth:"apikey", scopes:["read:events"], status:"approved" },
  { id:"REQ-25-0008", system:"Provincial Lab Bridge", requester:"ศูนย์ Lab กลาง", createdAt:"2025-09-12 14:05", environment:"sandbox", auth:"client_credentials", scopes:["read:lab"], status:"rejected" },
  { id:"REQ-25-0007", system:"Notification Relay", requester:"สสจ. ขอนแก่น", createdAt:"2025-09-11 08:15", environment:"production", auth:"oauth2", scopes:["notify:send"], status:"pending" },
];

/* ------------ small ui ------------ */
function StatusPill({ s }: { s: Status }) {
  const map = {
    approved: { t: "อนุมัติแล้ว", c: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20", i: <CheckCircle2 className="h-4 w-4" /> },
    pending:  { t: "รอตรวจสอบ",  c: "bg-amber-500/10  text-amber-300  ring-amber-400/20",  i: <Clock className="h-4 w-4" /> },
    rejected: { t: "ปฏิเสธ",      c: "bg-rose-500/10   text-rose-300   ring-rose-400/20",   i: <XCircle className="h-4 w-4" /> },
  }[s];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ring-1 ${map.c}`}>{map.i}{map.t}</span>;
}
function Chip({ children, active, onClick }: React.PropsWithChildren<{ active?: boolean; onClick?: () => void }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ring-1 transition",
        active ? "bg-cyan-500/15 text-cyan-300 ring-cyan-400/30" : "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
const Th = ({ children, className = "" }: any) =>
  <th className={`px-3 py-2 text-left text-xs font-medium text-slate-300 ${className}`}>{children}</th>;
const Td = ({ children, className = "" }: any) =>
  <td className={`px-3 py-2 align-top ${className}`}>{children}</td>;

/* ------------ main component ------------ */
export default function StatusForm() {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<Status | "all">("all");
  const [env, setEnv] = React.useState<"all" | "sandbox" | "production">("all");
  const [auth, setAuth] = React.useState<"all" | Row["auth"]>("all");

  const filtered = mock.filter((r) => {
    const byText =
      q.trim() === "" ||
      [r.id, r.system, r.requester, ...r.scopes].join(" ").toLowerCase().includes(q.toLowerCase());
    const byStatus = status === "all" || r.status === status;
    const byEnv = env === "all" || r.environment === env;
    const byAuth = auth === "all" || r.auth === auth;
    return byText && byStatus && byEnv && byAuth;
  });

  return (
    <>
      {/* Toolbar (sticky) */}
      <div className="sticky top-0 z-10 -mx-4 border-y border-white/10 bg-slate-900/70 px-4 py-3 backdrop-blur md:rounded-xl">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 text-sm outline-none ring-1 ring-inset ring-white/5 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-400/40"
              placeholder="ค้นหา รหัสคำขอ / ระบบ / ผู้ยื่น / scope…"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Chip active={status === "all"} onClick={() => setStatus("all")}><Slash className="h-4 w-4" /> ทั้งหมด</Chip>
            <Chip active={status === "pending"} onClick={() => setStatus("pending")}><Clock className="h-4 w-4" /> รอตรวจ</Chip>
            <Chip active={status === "approved"} onClick={() => setStatus("approved")}><CheckCircle2 className="h-4 w-4" /> อนุมัติ</Chip>
            <Chip active={status === "rejected"} onClick={() => setStatus("rejected")}><XCircle className="h-4 w-4" /> ปฏิเสธ</Chip>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Chip active={env === "sandbox"} onClick={() => setEnv(env === "sandbox" ? "all" : "sandbox")}><Server className="h-4 w-4" /> Sandbox</Chip>
            <Chip active={env === "production"} onClick={() => setEnv(env === "production" ? "all" : "production")}><Server className="h-4 w-4" /> Production</Chip>
            <Chip active={auth === "oauth2"} onClick={() => setAuth(auth === "oauth2" ? "all" : "oauth2")}><KeyRound className="h-4 w-4" /> OAuth2</Chip>
            <Chip active={auth === "client_credentials"} onClick={() => setAuth(auth === "client_credentials" ? "all" : "client_credentials")}><Shield className="h-4 w-4" /> Client Credentials</Chip>
            <Chip active={auth === "apikey"} onClick={() => setAuth(auth === "apikey" ? "all" : "apikey")}><Globe className="h-4 w-4" /> API Key</Chip>

            <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10">
              <Calendar className="mr-1 inline h-4 w-4" />
              ช่วงวัน
            </button>
            <button onClick={() => { setQ(""); setStatus("all"); setEnv("all"); setAuth("all"); }} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10">
              <Filter className="mr-1 inline h-4 w-4" /> ล้างฟิลเตอร์
            </button>
            <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10">
              <RefreshCw className="mr-1 inline h-4 w-4" /> รีเฟรช
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <section className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 ring-1 ring-inset ring-white/5">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-sm font-semibold">รายการคำขอ ({filtered.length})</h2>
          <Link href="/request" className="text-xs text-cyan-300 hover:text-cyan-200">สร้างคำขอใหม่</Link>
        </div>

        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead className="bg-white/5">
            <tr>
              <Th className="w-[140px]">รหัสคำขอ</Th>
              <Th className="min-w-[220px]">ระบบ/โครงการ</Th>
              <Th className="min-w-[160px]">ผู้ยื่น</Th>
              <Th>Scope</Th>
              <Th className="w-[120px]">Env</Th>
              <Th className="w-[140px]">Auth</Th>
              <Th className="w-[160px]">วันที่ยื่น</Th>
              <Th className="text-right pr-4 w-[140px]">สถานะ</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} className={`border-t border-white/5 ${i % 2 ? "bg-white/[0.02]" : ""}`}>
                <Td><Link href={`/request/${r.id}`} className="text-cyan-300 hover:text-cyan-200">{r.id}</Link></Td>
                <Td className="text-slate-200">{r.system}</Td>
                <Td className="text-slate-300">{r.requester}</Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {r.scopes.map((s) => (
                      <span key={s} className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-slate-300 ring-1 ring-white/10">{s}</span>
                    ))}
                  </div>
                </Td>
                <Td>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] ring-1 ${
                    r.environment === "production"
                      ? "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20"
                      : "bg-cyan-500/10 text-cyan-300 ring-cyan-400/20"
                  }`}>{r.environment}</span>
                </Td>
                <Td className="capitalize">{r.auth.replace("_", " ")}</Td>
                <Td className="tabular-nums text-slate-300">{r.createdAt}</Td>
                <Td className="pr-4 text-right"><StatusPill s={r.status} /></Td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <Td colSpan={8} className="p-8 text-center text-sm text-slate-400">ไม่พบรายการที่ตรงกับเงื่อนไข</Td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Bottom bar (ตัวอย่าง) */}
        <div className="flex flex-col gap-2 border-t border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-slate-400">แสดง {Math.min(filtered.length, 10)} จาก {filtered.length} รายการ</div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10">
              <ChevronLeft className="h-4 w-4" /> ก่อนหน้า
            </button>
            <button className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10">
              ถัดไป <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <div className="mt-4 text-xs text-slate-500">เคล็ดลับ: คลิกรหัสคำขอเพื่อเปิดรายละเอียด</div>
    </>
  );
}
