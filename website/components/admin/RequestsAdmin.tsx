// components/admin/RequestsAdmin.tsx
"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Dialog, Transition } from "@headlessui/react";
import {
  Search, Filter, RefreshCw, Calendar, Slash, Server,
  CheckCircle2, Clock, XCircle, Info, Eye, Copy, KeyRound, ChevronRight
} from "lucide-react";
import Link from "next/link";
// ต้องเปิด resolveJsonModule ใน tsconfig.json
import requestsJson from "../../stores/Data/Request.json";

/* ============================================================================
   TYPES (แบบที่ UI ใช้งาน)
============================================================================ */
type Status = "pending" | "approved" | "rejected";
type Environment = "sandbox" | "production";
type Row = {
  id: string;
  system: string;
  requester: string;
  createdAt: string;                 // YYYY-MM-DD HH:mm
  environment: Environment;
  auth: "apikey";
  scopes: string[];
  status: Status;
  apiKey: string | null;
  note: string;
};
type RequestsAdminProps = { initialRows?: Row[] };

/* ============================================================================
   RAW JSON TYPE + NORMALIZER (แปลง JSON ดิบ -> Row)
============================================================================ */
type RawRequest = {
  id: string;
  requester_name?: string;
  requester_email?: string;
  requester_phone?: string;
  organizer_name?: string;
  agree?: boolean;
  allowed_ips?: string[] | string;
  auth_method?: string;
  callback_url?: string;
  data_format?: string;
  data_source?: string;
  description?: string;
  project_name?: string;
  purpose?: string;
  rate_limit_per_minute?: number | string;
  retention_days?: number | string;
  user_record?: string;
  status?: string;                   // pending/approved/rejected (case-insensitive)
  created_at?: string;               // "YYYY-MM-DD HH:mm" หรือ ISO
  updated_at?: string;
  environment?: "sandbox" | "production" | string;
  scopes?: string[] | string;        // อาจเป็น array หรือ comma-separated
  api_key?: string | null;
  note?: string | null;
};

function asStatus(s?: string): Status {
  const v = (s || "pending").toLowerCase();
  return v === "approved" || v === "rejected" ? (v as Status) : "pending";
}
function asEnv(v?: string): Environment {
  return v === "production" ? "production" : "sandbox";
}
function toArray(x?: string[] | string): string[] {
  if (Array.isArray(x)) return x.filter(Boolean);
  if (typeof x === "string" && x.trim())
    return x.split(",").map(s => s.trim()).filter(Boolean);
  return [];
}
function formatCreatedAt(s?: string): string {
  if (!s) return "";
  // แปลง ISO -> "YYYY-MM-DD HH:mm"
  if (s.includes("T")) return s.replace("T", " ").slice(0, 16);
  return s.slice(0, 16);
}
function normalizeRow(x: RawRequest): Row {
  return {
    id: x.id,
    system: x.project_name || x.description || x.data_source || "-",
    requester: x.requester_name || x.organizer_name || "-",
    createdAt: formatCreatedAt(x.created_at),
    environment: asEnv(x.environment),
    auth: "apikey",
    scopes: toArray(x.scopes),
    status: asStatus(x.status),
    apiKey: x.api_key ?? null,
    note: x.note ?? "",
  };
}

/* ============================================================================
   UI HELPERS
============================================================================ */
const cx = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(" ");
const maskKey = (k?: string | null) => (k ? `${k.slice(0, 6)}…${k.slice(-4)}` : "-");

const StatusPill = ({ s }: { s: Status }) => {
  const m = {
    approved: { t: "อนุมัติแล้ว", c: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20", i: <CheckCircle2 className="h-4 w-4" /> },
    pending:  { t: "รอตรวจสอบ",  c: "bg-amber-500/10  text-amber-300  ring-amber-400/20",  i: <Clock className="h-4 w-4" /> },
    rejected: { t: "ปฏิเสธ",      c: "bg-rose-500/10   text-rose-300   ring-rose-400/20",   i: <XCircle className="h-4 w-4" /> },
  }[s];
  return <span className={cx("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ring-1", m.c)}>{m.i}{m.t}</span>;
};

const EnvPill = ({ env }: { env: Environment }) => (
  <span className={cx(
    "rounded-full px-2 py-0.5 text-[11px] ring-1",
    env === "production" ? "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20" : "bg-cyan-500/10 text-cyan-300 ring-cyan-400/20"
  )}>{env}</span>
);

const Chip = ({
  active, onClick, icon, children
}: { active?: boolean; onClick?: () => void; icon?: React.ReactNode; children: React.ReactNode }) => (
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

/* ============================================================================
   BodyPortal (โยน Dialog ลง document.body)
============================================================================ */
function BodyPortal({ children }: { children: React.ReactNode }) {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
}

/* ============================================================================
   SLIDE-OVER
============================================================================ */
function randomKey() {
  const abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "pk_";
  for (let i = 0; i < 28; i++) s += abc[Math.floor(Math.random() * abc.length)];
  return s;
}

function SlideOver({
  open, onClose, row, onSave,
}: {
  open: boolean; onClose: () => void; row: Row | null;
  onSave: (payload: {status: Status; apiKey: string | null; note: string}) => void;
}) {
  const [status, setStatus] = React.useState<Status>("pending");
  const [apiKey, setApiKey] = React.useState<string | null>(null);
  const [note, setNote] = React.useState("");

  React.useEffect(() => {
    setStatus(row?.status ?? "pending");
    setApiKey(row?.apiKey ?? null);
    setNote(row?.note ?? "");
  }, [row, open]);

  const needKey = status === "approved" && !(apiKey || "").trim();

  return (
    <BodyPortal>
      <Transition.Root show={open} as={React.Fragment}>
        <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
          {/* overlay */}
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-150"  leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </Transition.Child>

          {/* panel */}
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={React.Fragment}
                  enter="transform transition ease-in-out duration-200"
                  enterFrom="translate-x-full" enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-200"
                  leaveFrom="translate-x-0" leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-xl">
                    <div className="flex h-full flex-col bg-slate-950/95 backdrop-blur border-l border-white/10 shadow-2xl">
                      {/* header */}
                      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                          จัดการคำขอใช้งาน API
                        </div>
                        <button onClick={onClose} className="rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10">ปิด</button>
                      </div>

                      {/* content */}
                      <div className="flex-1 overflow-y-auto px-5 py-5">
                        {row && (
                          <>
                            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="font-medium text-white truncate">{row.system}</div>
                                  <div className="mt-1 text-xs text-slate-400">
                                    <span className="rounded bg-white/5 px-1.5 py-0.5 ring-1 ring-white/10 mr-2">{row.id}</span>
                                    {row.requester} • <span className="tabular-nums">{row.createdAt}</span>
                                  </div>
                                </div>
                                <div className="shrink-0 flex flex-col items-end gap-1">
                                  <EnvPill env={row.environment} />
                                  <StatusPill s={status} />
                                </div>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {row.scopes.map(s => (
                                  <span key={s} className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-slate-300 ring-1 ring-white/10">{s}</span>
                                ))}
                              </div>
                            </div>

                            {/* choose status */}
                            <div className="mt-5 grid gap-2 sm:grid-cols-3">
                              {[
                                {v:"approved",  t:"อนุมัติ",   cls:"bg-emerald-600 text-white", off:"bg-white/5 hover:bg-white/10"},
                                {v:"rejected",  t:"ปฏิเสธ",    cls:"bg-rose-600 text-white",    off:"bg-white/5 hover:bg-white/10"},
                                {v:"pending",   t:"ตั้งรอ",    cls:"bg-slate-700 text-white",   off:"bg-white/5 hover:bg-white/10"},
                              ].map(({v,t,cls,off})=>(
                                <button
                                  key={v}
                                  onClick={()=>setStatus(v as Status)}
                                  className={cx("rounded-xl px-3 py-2 text-sm ring-1 ring-white/10", status===v ? cls : off)}
                                >{t}</button>
                              ))}
                            </div>

                            {/* API key */}
                            <div className="mt-5 rounded-xl border border-white/10 p-3">
                              <div className="flex items-center justify-between">
                                <div className="font-medium flex items-center gap-2">
                                  <KeyRound className="h-4 w-4 text-cyan-300" /> API Key
                                </div>
                                <div className="text-xs text-slate-400">จำเป็นเมื่ออนุมัติ</div>
                              </div>
                              <div className="mt-2 flex gap-2">
                                <input
                                  value={apiKey ?? ""} onChange={(e)=>setApiKey(e.target.value)}
                                  placeholder="pk_XXXXXXXX…"
                                  className="h-10 w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 text-sm outline-none focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
                                />
                                <button onClick={()=>setApiKey(randomKey())} className="rounded-xl border border-white/10 bg-white/5 px-3 text-sm hover:bg-white/10">สร้าง</button>
                                <button
                                  onClick={()=>apiKey && navigator.clipboard.writeText(apiKey)}
                                  disabled={!apiKey}
                                  className="rounded-xl border border-white/10 bg-white/5 px-3 text-sm hover:bg-white/10 disabled:opacity-40"
                                  title="คัดลอก"
                                >
                                  <Copy className="h-4 w-4" />
                                </button>
                              </div>
                              {needKey && <div className="mt-1 text-xs text-rose-300">กรุณาใส่ API Key เพื่ออนุมัติ</div>}
                            </div>

                            {/* note */}
                            <div className="mt-5">
                              <label className="text-xs text-slate-300">
                                หมายเหตุ
                                <textarea
                                  rows={3} value={note} onChange={(e)=>setNote(e.target.value)}
                                  placeholder="ใส่เหตุผลการปฏิเสธ หรือเงื่อนไขการอนุมัติ"
                                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm outline-none focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
                                />
                              </label>
                            </div>
                          </>
                        )}
                      </div>

                      {/* footer */}
                      <div className="border-t border-white/10 p-4 flex justify-end gap-2">
                        <button onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5">ยกเลิก</button>
                        <button
                          onClick={()=>onSave({ status, apiKey: status==="approved" ? (apiKey ?? "") : null, note })}
                          disabled={needKey}
                          className={cx(
                            "rounded-xl px-4 py-2 text-sm",
                            status==="approved" ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                            : status==="rejected" ? "bg-rose-600 hover:bg-rose-500 text-white"
                            : "bg-slate-700 hover:bg-slate-600 text-white",
                            needKey && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          บันทึกผล
                        </button>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </BodyPortal>
  );
}

/* ============================================================================
   HEADER STAT
============================================================================ */
function Stat({ label, value }: {label: string; value: React.ReactNode}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 ring-1 ring-inset ring-white/5">
      <div>
        <div className="text-xs text-slate-400">{label}</div>
        <div className="text-lg font-semibold text-white">{value}</div>
      </div>
    </div>
  );
}

/* ============================================================================
   RESULTS CELL (กระชับ, สองแถวชิดกัน)
============================================================================ */
function ResultsCell({ r }: { r: Row }) {
  return (
    <div className="flex flex-col gap-0.5 leading-tight">
      <div className="flex flex-wrap items-center gap-1">
        <StatusPill s={r.status} />
        <EnvPill env={r.environment} />
      </div>

      {r.status === "approved" && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-lg bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/20 px-2 py-0.5 text-[11px] font-mono" title={r.apiKey ?? ""}>
            {maskKey(r.apiKey)}
          </span>
          {r.apiKey && (
            <button
              onClick={() => navigator.clipboard.writeText(r.apiKey!)}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] hover:bg-white/10"
              title="คัดลอก API Key"
            >
              <Copy className="h-3.5 w-3.5 inline -mt-0.5" /> คัดลอก
            </button>
          )}
          {r.note && (
            <span className="rounded-lg bg-white/5 ring-1 ring-white/10 px-2 py-0.5 text-[11px] text-slate-300 max-w-[320px] truncate" title={r.note}>
              {r.note}
            </span>
          )}
        </div>
      )}

      {r.status === "rejected" && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-lg bg-rose-500/10 text-rose-300 ring-1 ring-rose-400/20 px-2 py-0.5 text-[11px]">ปฏิเสธ</span>
          <span className="rounded-lg bg-white/5 ring-1 ring-white/10 px-2 py-0.5 text-[11px] text-slate-300 max-w-[320px] truncate" title={r.note || "ไม่มีหมายเหตุ"}>
            {r.note || "ไม่มีหมายเหตุ"}
          </span>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   MAIN
============================================================================ */
export default function RequestsAdmin({ initialRows }: RequestsAdminProps) {
  const seed = React.useMemo<Row[]>(
    () =>
      initialRows?.length
        ? initialRows
        : (requestsJson as unknown as RawRequest[]).map(normalizeRow),
    [initialRows]
  );
  const [rows, setRows] = React.useState<Row[]>(seed);

  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<Status | "all">("all");
  const [env, setEnv] = React.useState<"all" | Environment>("all");
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});

  const rowsById = React.useMemo(() => Object.fromEntries(rows.map(r => [r.id, r])), [rows]);

  const list = React.useMemo(() => {
    const text = q.trim().toLowerCase();
    return rows.filter(r => {
      const byText   = !text || [r.id, r.system, r.requester, ...r.scopes].join(" ").toLowerCase().includes(text);
      const byStatus = status === "all" || r.status === status;
      const byEnv    = env === "all"    || r.environment === env;
      return byText && byStatus && byEnv;
    });
  }, [rows, q, status, env]);

  const selectedIds = React.useMemo(() => Object.keys(selected).filter(k => selected[k]), [selected]);
  const visibleIds  = React.useMemo(() => list.map(r => r.id), [list]);

  // slide-over
  const [openId, setOpenId] = React.useState<string | null>(null);
  const openRow = openId ? rowsById[openId] ?? null : null;

  // header stats
  const totalApproved = rows.filter(r=>r.status==="approved").length;
  const totalPending  = rows.filter(r=>r.status==="pending").length;
  const totalRejected = rows.filter(r=>r.status==="rejected").length;

  return (
    <section className="w-full">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div><h1 className="text-xl font-semibold text-white">คำขอใช้งาน API</h1></div>
        <div className="hidden md:flex gap-3">
          <Stat label="อนุมัติแล้ว" value={totalApproved} />
          <Stat label="รอตรวจสอบ" value={totalPending} />
          <Stat label="ปฏิเสธ" value={totalRejected} />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/60 ring-1 ring-inset ring-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]">
        {/* Toolbar */}
        <div className="sticky top-0 z-10 rounded-t-2xl border-b border-white/10 bg-slate-900/80 px-4 sm:px-5 py-4 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative flex-1 min-w-[260px]" aria-label="กล่องค้นหา">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={q} onChange={(e)=>setQ(e.target.value)}
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
              <Chip active={env==="sandbox"} onClick={()=>setEnv(env==="sandbox"?"all":"sandbox")} icon={<Server className="h-4 w-4" />}>Sandbox</Chip>
              <Chip active={env==="production"} onClick={()=>setEnv(env==="production"?"all":"production")} icon={<Server className="h-4 w-4" />}>Production</Chip>

              <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"><Calendar className="mr-1 inline h-4 w-4" /> ช่วงวัน</button>
              <button onClick={()=>{ setQ(""); setStatus("all"); setEnv("all"); }} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"><Filter className="mr-1 inline h-4 w-4" /> ล้างฟิลเตอร์</button>
              <button onClick={()=>location.reload()} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"><RefreshCw className="mr-1 inline h-4 w-4" /> รีเฟรช</button>
            </div>
          </div>

          <div className="mt-3 text-xs text-slate-400 flex items-center justify-between">
            <span>เลือก {selectedIds.length} / {visibleIds.length} รายการที่มองเห็น</span>
            <span className="inline-flex items-center gap-1"><Info className="h-4 w-4" /> ใช้ปุ่ม “ดูข้อมูล” เพื่ออนุมัติ/ปฏิเสธและออกกุญแจ</span>
          </div>
        </div>

        {/* Table */}
        <div className="p-4 sm:p-5">
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="min-w-[1120px] w-full border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-4 sm:px-3 py-2 w-[40px]"></th>
                  <th className="px-4 sm:px-3 py-2 text-left text-xs font-medium text-slate-300 w-[160px]">รหัสคำขอ</th>
                  <th className="px-4 sm:px-3 py-2 text-left text-xs font-medium text-slate-300 min-w-[260px]">ระบบ/โครงการ</th>
                  <th className="px-4 sm:px-3 py-2 text-left text-xs font-medium text-slate-300 min-w-[160px]">ผู้ยื่น</th>
                  <th className="px-4 sm:px-3 py-2 text-left text-xs font-medium text-slate-300 w-[110px]">Env</th>
                  <th className="px-4 sm:px-3 py-2 text-left text-xs font-medium text-slate-300 w-[170px]">วันที่ยื่น</th>
                  <th className="px-4 sm:px-3 py-2 text-left text-xs font-medium text-slate-300 min-w-[360px]">ผลอนุมัติ / API Key / หมายเหตุ</th>
                  <th className="px-4 sm:px-3 py-2 text-right text-xs font-medium text-slate-300 w-[130px] pr-4">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {list.map((r, i) => (
                  <tr key={r.id} className={cx("border-t border-white/5", i % 2 ? "bg-white/[0.02]" : "")}>
                    <td className="px-4 sm:px-3 py-2 align-top">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/20 bg-transparent"
                        checked={!!selected[r.id]}
                        onChange={(e)=>setSelected(prev => ({...prev, [r.id]: e.target.checked}))}
                        aria-label={`เลือก ${r.id}`}
                      />
                    </td>
                    <td className="px-4 sm:px-3 py-2 align-top">
                      <Link href={`/request/${r.id}`} className="text-cyan-300 hover:text-cyan-200">{r.id}</Link>
                    </td>
                    <td className="px-4 sm:px-3 py-2 align-top text-slate-200">{r.system}</td>
                    <td className="px-4 sm:px-3 py-2 align-top text-slate-300">{r.requester}</td>
                    <td className="px-4 sm:px-3 py-2 align-top"><EnvPill env={r.environment} /></td>
                    <td className="px-4 sm:px-3 py-2 align-top tabular-nums text-slate-300">{r.createdAt}</td>

                    {/* ผลรวม (สถานะ + ENV + apiKey/note) ติดกัน */}
                    <td className="px-4 sm:px-3 py-1.5 align-top leading-tight">
                      <ResultsCell r={r} />
                    </td>

                    {/* การดำเนินการ */}
                    <td className="px-4 sm:px-3 py-2 align-top">
                      <div className="flex justify-end">
                        <button
                          onClick={()=>setOpenId(r.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs hover:bg-white/10"
                        >
                          <Eye className="h-4 w-4" /> ดูข้อมูล
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-sm text-slate-400">ไม่พบรายการที่ตรงกับเงื่อนไข</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <div className="inline-flex items-center gap-2"><Info className="h-4 w-4" /> แสดง {list.length} จากทั้งหมด {rows.length} รายการ</div>
          </div>
        </div>
      </div>

      {/* Slide-over */}
      <SlideOver
        open={!!openRow}
        row={openRow}
        onClose={()=>setOpenId(null)}
        onSave={({status, apiKey, note})=>{
          if (!openRow) return;
          setRows(prev=>prev.map(r=> r.id===openRow.id
            ? {...r, status, apiKey: status==="approved" ? (apiKey || randomKey()) : null, note}
            : r
          ));
          setOpenId(null);
        }}
      />
    </section>
  );
}
