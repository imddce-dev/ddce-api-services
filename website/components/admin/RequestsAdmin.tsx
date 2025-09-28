// components/admin/RequestsAdmin.tsx
"use client";

import * as React from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Search, Filter, RefreshCw, Calendar, Slash, Server,
  CheckCircle2, Clock, XCircle, Check, X, Undo2, Trash2,
} from "lucide-react";
import Link from "next/link";

/* ---------- types ---------- */
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

/* ---------- mock data ---------- */
const initialRows: Row[] = [
  { id:"REQ-25-0010", system:"EBS Sync Chiangmai", requester:"สสจ. เชียงใหม่", createdAt:"2025-09-16 09:30", environment:"sandbox",    auth:"apikey", scopes:["read:events","notify:send"], status:"pending" },
  { id:"REQ-25-0009", system:"M-EBS Dashboard",    requester:"สคร. 1 เชียงใหม่", createdAt:"2025-09-15 10:22", environment:"production", auth:"apikey", scopes:["read:events"],              status:"approved" },
  { id:"REQ-25-0008", system:"Provincial Lab Bridge", requester:"ศูนย์ Lab กลาง", createdAt:"2025-09-12 14:05", environment:"sandbox",    auth:"apikey", scopes:["read:lab"],                 status:"rejected" },
  { id:"REQ-25-0007", system:"Notification Relay", requester:"สสจ. ขอนแก่น", createdAt:"2025-09-11 08:15", environment:"production", auth:"apikey", scopes:["notify:send"],            status:"pending" },
];

/* ---------- utils & small parts ---------- */
const cx = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(" ");

const StatusPill = ({ s }: { s: Status }) => {
  const m = {
    approved: { t: "อนุมัติแล้ว", c: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20", i: <CheckCircle2 className="h-4 w-4" /> },
    pending:  { t: "รอตรวจสอบ",  c: "bg-amber-500/10  text-amber-300  ring-amber-400/20",  i: <Clock className="h-4 w-4" /> },
    rejected: { t: "ปฏิเสธ",      c: "bg-rose-500/10   text-rose-300   ring-rose-400/20",   i: <XCircle className="h-4 w-4" /> },
  }[s];
  return <span className={cx("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ring-1", m.c)}>{m.i}{m.t}</span>;
};

const EnvPill = ({ env }: { env: Row["environment"] }) => (
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

/* ---------- confirm dialog ---------- */
function ConfirmDialog({
  open, onClose, onConfirm, title, children, confirmText = "ยืนยัน", tone = "emerald",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children?: React.ReactNode;
  confirmText?: string;
  tone?: "emerald" | "rose" | "slate";
}) {
  const toneBtn = {
    emerald: "bg-emerald-600 hover:bg-emerald-500 text-white",
    rose: "bg-rose-600 hover:bg-rose-500 text-white",
    slate: "bg-slate-700 hover:bg-slate-600 text-white",
  }[tone];

  return (
    <Transition appear show={open} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-6 text-slate-100 shadow-xl">
                <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
                {children && <div className="mt-3 text-sm text-slate-300">{children}</div>}
                <div className="mt-6 flex justify-end gap-2">
                  <button onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5">ยกเลิก</button>
                  <button onClick={onConfirm} className={cx("rounded-xl px-4 py-2 text-sm", toneBtn)}>{confirmText}</button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

/* ---------- main admin component ---------- */
export default function RequestsAdmin() {
  const [rows, setRows] = React.useState<Row[]>(initialRows);
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<Status | "all">("all");
  const [env, setEnv] = React.useState<"all" | "sandbox" | "production">("all");

  // selection
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const selectedIds = React.useMemo(() => Object.keys(selected).filter((k) => selected[k]), [selected]);

  const list = React.useMemo(() => {
    const text = q.trim().toLowerCase();
    return rows.filter(r => {
      const byText   = !text || [r.id, r.system, r.requester, ...r.scopes].join(" ").toLowerCase().includes(text);
      const byStatus = status === "all" || r.status === status;
      const byEnv    = env === "all"    || r.environment === env;
      return byText && byStatus && byEnv;
    });
  }, [rows, q, status, env]);

  const visibleIds = React.useMemo(() => list.map(r => r.id), [list]);

  function apply(ids: string[], mode: "approve"|"reject"|"reset"|"delete") {
    setRows(prev => {
      if (mode === "delete") return prev.filter(r => !ids.includes(r.id));
      return prev.map(r => ids.includes(r.id)
        ? mode === "approve" ? {...r, status: "approved"}
        : mode === "reject"  ? {...r, status: "rejected"}
        : {...r, status: "pending"}
        : r
      );
    });
    setSelected(prev => {
      const copy = {...prev};
      ids.forEach(id => delete copy[id]);
      return copy;
    });
    setDlg({mode: null, ids: []});
  }

  const [dlg, setDlg] = React.useState<{mode: "approve"|"reject"|"reset"|"delete"|null; ids: string[]}>({mode: null, ids: []});

  const toggleAll = () => {
    const anyUnchecked = visibleIds.some(id => !selected[id]);
    const next: Record<string, boolean> = {...selected};
    visibleIds.forEach(id => { next[id] = anyUnchecked; });
    setSelected(next);
  };

  return (
    /* ทำ full width ภายในหน้าและไม่ “กินขอบ” */
    <section className="mx-auto w-[min(1400px,96vw)] px-4 sm:px-6">
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 ring-1 ring-inset ring-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]">

        {/* Toolbar (sticky, ไม่ถูกตัด) */}
        <div className="sticky top-0 z-10 rounded-t-2xl border-b border-white/10 bg-slate-900/80 px-4 sm:px-5 py-4 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative flex-1 min-w-[260px]" aria-label="กล่องค้นหา">
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
              <Chip active={env==="sandbox"} onClick={()=>setEnv(env==="sandbox"?"all":"sandbox")} icon={<Server className="h-4 w-4" />}>Sandbox</Chip>
              <Chip active={env==="production"} onClick={()=>setEnv(env==="production"?"all":"production")} icon={<Server className="h-4 w-4" />}>Production</Chip>

              <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10">
                <Calendar className="mr-1 inline h-4 w-4" /> ช่วงวัน
              </button>
              <button onClick={()=>{ setQ(""); setStatus("all"); setEnv("all"); }} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10">
                <Filter className="mr-1 inline h-4 w-4" /> ล้างฟิลเตอร์
              </button>
              <button onClick={()=>location.reload()} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10">
                <RefreshCw className="mr-1 inline h-4 w-4" /> รีเฟรช
              </button>
            </div>
          </div>

          {/* bulk actions */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-slate-400">
              เลือก {selectedIds.length} / {visibleIds.length} รายการที่มองเห็น
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggleAll} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10">เลือก/ยกเลิก ทั้งหมด</button>
              <button disabled={!selectedIds.length} onClick={()=>setDlg({mode:"approve", ids:selectedIds})}
                className="disabled:opacity-40 inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs text-white hover:bg-emerald-500">
                <Check className="h-4 w-4" /> อนุมัติ
              </button>
              <button disabled={!selectedIds.length} onClick={()=>setDlg({mode:"reject", ids:selectedIds})}
                className="disabled:opacity-40 inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs text-white hover:bg-rose-500">
                <X className="h-4 w-4" /> ปฏิเสธ
              </button>
              <button disabled={!selectedIds.length} onClick={()=>setDlg({mode:"reset", ids:selectedIds})}
                className="disabled:opacity-40 inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10">
                <Undo2 className="h-4 w-4" /> ตั้งเป็นรอตรวจ
              </button>
              <button disabled={!selectedIds.length} onClick={()=>setDlg({mode:"delete", ids:selectedIds})}
                className="disabled:opacity-40 inline-flex items-center gap-1 rounded-lg border border-rose-600/40 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/15">
                <Trash2 className="h-4 w-4" /> ลบ
              </button>
            </div>
          </div>
        </div>

        {/* Table wrapper: แยก scroll เอง ป้องกัน “กินขอบ” บนจอแคบ */}
        <div className="p-4 sm:p-5">
          <div className="-mx-4 sm:mx-0 overflow-x-auto">
            <table className="min-w-[980px] w-full border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-4 sm:px-3 py-2 text-left text-xs font-medium text-slate-300 w-[40px]"></th>
                  <th className="px-4 sm:px-3 py-2 text-left text-xs font-medium text-slate-300 w-[160px]">รหัสคำขอ</th>
                  <th className="px-4 sm:px-3 py-2 text-left text-xs font-medium text-slate-300 min-w-[260px]">ระบบ/โครงการ</th>
                  <th className="px-4 sm:px-3 py-2 text-left text-xs font-medium text-slate-300 min-w-[180px]">ผู้ยื่น</th>
                  <th className="px-4 sm:px-3 py-2 text-left text-xs font-medium text-slate-300">Scopes</th>
                  <th className="px-4 sm:px-3 py-2 text-left text-xs font-medium text-slate-300 w-[120px]">Env</th>
                  <th className="px-4 sm:px-3 py-2 text-left text-xs font-medium text-slate-300 w-[180px]">วันที่ยื่น</th>
                  <th className="px-4 sm:px-3 py-2 text-right text-xs font-medium text-slate-300 w-[260px] pr-4">สถานะ / การดำเนินการ</th>
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
                    <td className="px-4 sm:px-3 py-2 align-top">
                      <div className="flex flex-wrap gap-1">
                        {r.scopes.map(s => (
                          <span key={s} className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-slate-300 ring-1 ring-white/10">{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 sm:px-3 py-2 align-top"><EnvPill env={r.environment} /></td>
                    <td className="px-4 sm:px-3 py-2 align-top tabular-nums text-slate-300">{r.createdAt}</td>
                    <td className="px-4 sm:px-3 py-2 align-top">
                      <div className="flex items-center justify-end gap-2">
                        <StatusPill s={r.status} />
                        {r.status !== "approved" && (
                          <button onClick={()=>apply([r.id], "approve")}
                                  className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs text-white hover:bg-emerald-500">
                            อนุมัติ
                          </button>
                        )}
                        {r.status !== "rejected" && (
                          <button onClick={()=>apply([r.id], "reject")}
                                  className="rounded-lg bg-rose-600 px-2.5 py-1.5 text-xs text-white hover:bg-rose-500">
                            ปฏิเสธ
                          </button>
                        )}
                        {r.status !== "pending" && (
                          <button onClick={()=>apply([r.id], "reset")}
                                  className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs hover:bg-white/10">
                            ตั้งรอ
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-sm text-slate-400">
                      ไม่พบรายการที่ตรงกับเงื่อนไข
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-right text-xs text-slate-500">แสดง {list.length} รายการ</div>
        </div>
      </div>

      {/* dialogs */}
      <ConfirmDialog
        open={!!dlg.mode && dlg.mode !== "delete"}
        onClose={()=>setDlg({mode:null, ids:[]})}
        onConfirm={()=>apply(dlg.ids, dlg.mode as "approve"|"reject"|"reset")}
        title={
          dlg.mode === "approve" ? "ยืนยันอนุมัติคำขอ"
            : dlg.mode === "reject" ? "ยืนยันปฏิเสธคำขอ"
            : "ตั้งสถานะเป็นรอตรวจสอบ"
        }
        confirmText={
          dlg.mode === "approve" ? "อนุมัติ"
            : dlg.mode === "reject" ? "ปฏิเสธ"
            : "ตั้งรอตรวจ"
        }
        tone={dlg.mode === "reject" ? "rose" : dlg.mode === "approve" ? "emerald" : "slate"}
      >
        รายการที่เลือก {dlg.ids.length} รายการ
      </ConfirmDialog>

      <ConfirmDialog
        open={dlg.mode === "delete"}
        onClose={()=>setDlg({mode:null, ids:[]})}
        onConfirm={()=>apply(dlg.ids, "delete")}
        title="ลบรายการที่เลือก?"
        confirmText="ลบ"
        tone="rose"
      >
        การลบเป็นการลบถาวรจากตารางนี้ (เดโม/Mock)
      </ConfirmDialog>
    </section>
  );
}
