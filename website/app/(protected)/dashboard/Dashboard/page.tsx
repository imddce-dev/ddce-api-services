"use client";
export const dynamic = 'force-dynamic';
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePage } from "@/contexts/PageContext";
import { FetchApiReqById, type ApiReqData } from "@/services/apiService";
import { useUserStore } from "@/stores/useUserStore";
import {
  ChevronRight,
  FileText,
  Clock,
  KeyRound,
  CheckCircle2,
  XCircle,
  Cpu,
  Activity,
  Database,
  Info,
} from "lucide-react";

/* ============================== Helpers ============================== */
/** แปลงสถานะจาก backend → 3 สถานะมาตรฐานของแดชบอร์ด */
function parseStatusToDash(status?: string): "pending" | "approved" | "rejected" {
  const s = (status ?? "").toLowerCase();
  if (/(อนุมัติ|approved|success|active)/.test(s)) return "approved";
  if (/(ปฏิเสธ|rejected|denied|failed|deny)/.test(s)) return "rejected";
  return "pending";
}

/** รองรับหลากหลายชื่อฟิลด์และรูปแบบ: string, string[], object[] (มี name/code/value) */
function extractScopes(r: ApiReqData): string[] {
  const raw =
    (r as any).scopes ??
    (r as any).scope ??
    (r as any).requested_scopes ??
    (r as any).permissions ??
    [];

  if (Array.isArray(raw)) {
    if (raw.length === 0) return [];
    if (typeof raw[0] === "string") return raw as string[];
    return (raw as any[])
      .map((x) => x?.name ?? x?.code ?? x?.id ?? x?.value)
      .filter(Boolean);
  }

  if (typeof raw === "string") {
    return raw
      .split(/[, \n\r\t]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

const safeDT = (s?: string) => (s ? new Date(s).toLocaleString("th-TH") : "—");

/* ============================== Types UI ============================== */
type RowUI = {
  id: string;
  system: string;
  createdAt: string;
  scope: string[];
  status: "pending" | "approved" | "rejected";
};

/* ============================== Small UI pieces ============================== */
function StatusPill({ s }: { s: RowUI["status"] }) {
  const map = {
    approved: {
      t: "อนุมัติแล้ว",
      c: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20",
      i: <CheckCircle2 className="h-4 w-4" />,
    },
    pending: {
      t: "รอตรวจสอบ",
      c: "bg-amber-500/10 text-amber-300 ring-amber-400/20",
      i: <Clock className="h-4 w-4" />,
    },
    rejected: {
      t: "ปฏิเสธ",
      c: "bg-rose-500/10 text-rose-300 ring-rose-400/20",
      i: <XCircle className="h-4 w-4" />,
    },
  }[s];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${map.c}`}>
      {map.i}
      {map.t}
    </span>
  );
}

function Stat({
  title,
  value,
  foot,
  icon,
}: {
  title: string;
  value: string;
  foot: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950 p-4 ring-1 ring-inset ring-white/5 shdow-5">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-sm">{title}</span>
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{foot}</div>
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`border-b border-white/10 px-4 py-2 text-left font-semibold text-slate-300 ${className}`}>
      {children}
    </th>
  );
}

function Td({
  children,
  className,
  colSpan,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td className={`px-4 py-3 align-top text-slate-400 ${className ?? ""}`} colSpan={colSpan}>
      {children}
    </td>
  );
}

function QuickCard({
  title,
  desc,
  href,
  tone = "cyan",
  icon,
}: {
  title: string;
  desc: string;
  href: string;
  tone?: "cyan" | "emerald" | "amber";
  icon: React.ReactNode;
}) {
  const g = {
    cyan: "from-cyan-500/15 via-cyan-400/10",
    emerald: "from-emerald-500/15 via-emerald-400/10",
    amber: "from-amber-500/15 via-amber-400/10",
  }[tone];
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10  p-4 ring-1 ring-inset ring-white/5 shdow-5">
      <div className={`pointer-events-none absolute -inset-16 -z-10 rounded-3xl bg-gradient-to-b ${g} to-transparent blur-2xl`} />
      <div className="mb-1 inline-flex items-center gap-2 text-slate-200">
        {icon}
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <p className="text-xs text-slate-400">{desc}</p>
      <Link
        href={href}
        className="mt-3 inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
      >
        เปิด <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function Banner({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 ring-1 ring-inset ring-slate-700">
        <Info className="h-4 w-4 text-slate-300" />
      </span>
      <div>
        <div className="text-slate-100">{title}</div>
        {desc ? <div className="text-sm text-slate-400">{desc}</div> : null}
      </div>
    </div>
  );
}

/* ========= ScopesCell: สิทธิ์เฉพาะของ “คำขอนี้” + dialog ดูทั้งหมด ========= */
function ScopesCell({ scopes, reqId }: { scopes: string[]; reqId: string }) {
  const [open, setOpen] = useState(false);
  const shown = scopes.slice(0, 3);
  const more = Math.max(0, scopes.length - shown.length);

  return (
    <>
      <div className="flex max-w-[360px] flex-wrap gap-1">
        {shown.length === 0 ? (
          <span className="text-slate-500">—</span>
        ) : (
          shown.map((s) => (
            <span
              key={`${reqId}-${s}`}
              className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-slate-300 ring-1 ring-white/10"
              title={s}
            >
              {s}
            </span>
          ))
        )}
        {more > 0 && (
          <button
            onClick={() => setOpen(true)}
            className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[11px] text-cyan-300 ring-1 ring-cyan-400/20 hover:bg-cyan-500/15"
            title="ดูทั้งหมด"
          >
            +{more}
          </button>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[1000] grid place-items-center bg-black/60 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-3">
              <h4 className="text-sm font-semibold text-slate-100">สิทธิ์ที่ร้องขอ (ID: {reqId})</h4>
              <button
                className="rounded-lg bg-slate-800/70 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
                onClick={() => setOpen(false)}
              >
                ปิด
              </button>
            </div>
            <div className="max-h-[60vh] overflow-auto px-5 py-4">
              {scopes.length === 0 ? (
                <div className="text-sm text-slate-400">— ไม่มีสิทธิ์ที่ร้องขอ —</div>
              ) : (
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {scopes.map((s) => (
                    <li
                      key={`${reqId}-full-${s}`}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-slate-200"
                      title={s}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================== Page ============================== */
export default function DashboardPage() {
  const { setPageInfo } = usePage();

  // << ดึงผู้ใช้ปัจจุบัน และโหลด “เฉพาะคำขอของผู้ใช้คนนั้น” เหมือนหน้า Status >>
  const userProfile = useUserStore((s) => s.userProfile);
  const currentId = userProfile?.id ?? null;

  const [rows, setRows] = useState<ApiReqData[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setPageInfo({
      title: "ศูนย์บริการ API (กองควบคุมโรคและภัยสุขภาพในภาวะฉุกเฉิน)",
      description: "เริ่มยื่นคำขอ, ตรวจสถานะ และเรียนรู้การใช้งาน API ได้จากแดชบอร์ดนี้",
    });
  }, [setPageInfo]);

  useEffect(() => {
    (async () => {
      if (!currentId) {
        setRows([]);
        setErr("ยังไม่ได้เข้าสู่ระบบ");
        setLoading(false);
        return;
      }
      try {
        const resp = await FetchApiReqById(currentId);
        if (resp?.success) {
          setRows(resp.data ?? []);
          setErr(null);
        } else {
          setRows([]);
          setErr(resp?.message ?? "โหลดข้อมูลไม่สำเร็จ");
        }
      } catch (e: any) {
        console.error(e);
        setRows([]);
        setErr(e?.message ?? "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    })();
  }, [currentId]);

  /* ---------- Stats (นับเฉพาะของผู้ใช้) ---------- */
  const stats = useMemo(() => {
    let total = rows.length;
    let approved = 0;
    let rejected = 0;
    let pending = 0;
    for (const r of rows) {
      const s = parseStatusToDash(r.status);
      if (s === "approved") approved++;
      else if (s === "rejected") rejected++;
      else pending++;
    }
    const keysActive = approved;
    return { total, pending, approved, rejected, keysActive };
  }, [rows]);

  /* ---------- Recent (ล่าสุดของผู้ใช้; ถ้าคุณมี 2 รายการจะเห็น 2 รายการ) ---------- */
  const recent: RowUI[] = useMemo(() => {
    const sorted = [...rows].sort((a, b) => {
      const ta = new Date(a.created_at ?? 0).getTime();
      const tb = new Date(b.created_at ?? 0).getTime();
      return tb - ta;
    });
    return sorted.slice(0, 5).map((r) => ({
      id: String(r.id ?? "-"),
      system: r.project_name || "—",
      createdAt: safeDT(r.created_at),
      scope: extractScopes(r),
      status: parseStatusToDash(r.status),
    }));
  }, [rows]);

  return (
    <div className="min-h-dvh  text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-cyan-700/25 via-emerald-500/15 to-transparent blur-[90px]" />
      <div className="mx-auto flex max-w-[1280px] gap-5  ">
        <main className="relative flex-1">
          {/* Stats */}
          <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Stat
              title="คำขอทั้งหมด"
              value={loading ? "…" : String(stats.total)}
              foot="+2 ภายใน 7 วัน"
              icon={<FileText className="h-4 w-4" />}
            />
            <Stat
              title="รอตรวจสอบ"
              value={loading ? "…" : String(stats.pending)}
              foot="เฉลี่ย 2-3 วันทำการ"
              icon={<Clock className="h-4 w-4" />}
            />
            <Stat
              title="คีย์ที่ใช้งานอยู่"
              value={loading ? "…" : String(stats.keysActive)}
              foot="อัปเดตล่าสุด 2 ชม."
              icon={<KeyRound className="h-4 w-4" />}
            />
          </section>

          {/* CTA */}
          {/* <section className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            <QuickCard
              title="ยื่นคำขอใช้งาน API"
              desc="กรอกข้อมูลผู้ยื่น/หน่วยงาน เลือก Scope และส่งเพื่ออนุมัติ"
              href="/request"
              icon={<FileText className="h-5 w-5" />}
            />
            <QuickCard
              title="อ่านเอกสารนักพัฒนา"
              desc="รูปแบบข้อมูล ตัวอย่างโค้ด และนโยบายความปลอดภัย"
              href="/docs"
              tone="emerald"
              icon={<Activity className="h-5 w-5" />}
            />
            <QuickCard
              title="สำรวจ API ทั้งหมด"
              desc="EBS Events, Lab, Notification และบริการอื่น ๆ"
              href="/apis"
              tone="amber"
              icon={<Database className="h-5 w-5" />}
            />
          </section> */}

          {/* Recent Table (ของผู้ใช้ปัจจุบันเท่านั้น) */}
          <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950 p-4 ring-1 ring-inset ring-white/5 lg:col-span-1 shdow-5">
              <h3 className="mb-1 text-sm font-semibold">ปริมาณการเรียกใช้งาน (7 วัน)</h3>
              <p className="text-xs text-slate-400">รวมทุกบริการ (requests/hour)</p>
              <div className="mt-3 h-40 w-full rounded-xl bg-white/5 p-2">
                <svg viewBox="0 0 320 120" className="h-full w-full">
                  <defs>
                    <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="rgb(34 211 238)" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="rgb(34 211 238)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polyline
                    fill="url(#g1)"
                    stroke="none"
                    points="0,80 20,76 40,78 60,60 80,65 100,48 120,58 140,44 160,46 180,38 200,45 220,36 240,40 260,32 280,38 300,30 320,34 320,120 0,120"
                  />
                  <polyline
                    fill="none"
                    stroke="rgb(34 211 238)"
                    strokeWidth="2"
                    points="0,80 20,76 40,78 60,60 80,65 100,48 120,58 140,44 160,46 180,38 200,45 220,36 240,40 260,32 280,38 300,30 320,34"
                  />
                  <line x1="0" y1="110" x2="320" y2="110" stroke="rgba(255,255,255,.1)" />
                  <line x1="20" y1="10" x2="20" y2="110" stroke="rgba(255,255,255,.05)" />
                </svg>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1">
                  <Cpu className="h-4 w-4 text-cyan-300" /> M-EBS
                </span>
                <span className="inline-flex items-center gap-1">
                  <Activity className="h-4 w-4 text-emerald-300" /> EBS-DDC
                </span>
                <span className="inline-flex items-center gap-1">
                  <Database className="h-4 w-4 text-amber-300" /> EBS-Pro..
                </span>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-0 ring-1 ring-inset ring-white/5 lg:col-span-2 shdow-5">
              <div className="flex items-center justify-between p-4">
                <h3 className="text-sm font-semibold">คำขอล่าสุด</h3>
                <Link href="/dashboard/Status" className="text-xs text-cyan-300 hover:text-cyan-200">
                  ดูทั้งหมด
                </Link>
              </div>
              <table className="w-full border-separate border-spacing-0 text-sm">
                <thead className="bg-white/5">
                  <tr>
                    <Th>รหัสคำขอ</Th>
                    <Th>ระบบ/โครงการ</Th>
                    <Th>Scope</Th>
                    <Th>วันที่ยื่น</Th>
                    <Th className="text-center pr-4">สถานะ</Th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <Td colSpan={5}>
                        <div className="py-6 text-center text-slate-400">กำลังโหลด…</div>
                      </Td>
                    </tr>
                  ) : err ? (
                    <tr>
                      <Td colSpan={5}>
                        <div className="py-6 text-center text-rose-300">{err}</div>
                      </Td>
                    </tr>
                  ) : recent.length === 0 ? (
                    <tr>
                      <Td colSpan={5}>
                        <div className="py-6 text-center text-slate-400">ยังไม่มีคำขอ</div>
                      </Td>
                    </tr>
                  ) : (
                    recent.map((r, i) => (
                      <tr key={r.id} className={`border-t border-white/5 ${i % 2 ? "bg-white/[0.02]" : ""}`}>
                        <Td>
                          <Link href={`/dashboard/Status`} className="text-cyan-300 hover:text-cyan-200">
                            {r.id}
                          </Link>
                        </Td>
                        <Td>{r.system}</Td>
                        <Td>
                          <ScopesCell scopes={r.scope} reqId={r.id} />
                        </Td>
                        <Td>{r.createdAt}</Td>
                        <Td className="pr-4 text-left">
                          <StatusPill s={r.status} />
                        </Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* แจ้งเตือน/สถานะรวมเมื่อไม่มีข้อมูลหรือมี error */}
          {!loading && (err || rows.length === 0) ? (
            <Banner
              title={err ? err : "ยังไม่มีข้อมูลในระบบ"}
              desc={err ? undefined : "เริ่มต้นโดยไปที่เมนู “ยื่นคำขอใช้งาน API”"}
            />
          ) : null}

          {/* Footer */}
          <footer className="mt-8 border-t border-white/10 pt-3 text-xs text-slate-500">
            © {new Date().getFullYear()} Division of Disease Control in Emergencies • DDC
          </footer>
        </main>
      </div>
    </div>
  );
}
