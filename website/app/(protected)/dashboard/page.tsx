"use client";

import React from "react";
import Link from "next/link";
import {
  Menu, X, Search, Bell, LogOut, ChevronRight, ChevronDown,
  LayoutDashboard, BookOpen, FileText, Library, Inbox, Settings, Shield, LifeBuoy,
  KeyRound, Clock, CheckCircle2, XCircle, PlugZap, Cpu, Database, Activity, Waves,
} from "lucide-react";

/* ---------------------------- Mock data ---------------------------- */
type RequestRow = {
  id: string;
  system: string;
  createdAt: string;
  scope: string[];
  status: "pending" | "approved" | "rejected";
};
const recent: RequestRow[] = [
  { id: "REQ-25-0009", system: "EBS Sync Chiangmai", createdAt: "2025-09-15 10:22", scope: ["read:events", "notify:send"], status: "pending" },
  { id: "REQ-25-0008", system: "M-EBS Dashboard", createdAt: "2025-09-12 14:05", scope: ["read:events"], status: "approved" },
  { id: "REQ-25-0007", system: "Provincial Lab Bridge", createdAt: "2025-09-10 09:10", scope: ["read:lab"], status: "rejected" },
];

/* ---------------------------- Small UI ----------------------------- */
function StatusPill({ s }: { s: RequestRow["status"] }) {
  const map = {
    approved: { t: "อนุมัติแล้ว", c: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20", i: <CheckCircle2 className="h-4 w-4" /> },
    pending: { t: "รอตรวจสอบ", c: "bg-amber-500/10 text-amber-300 ring-amber-400/20", i: <Clock className="h-4 w-4" /> },
    rejected: { t: "ปฏิเสธ", c: "bg-rose-500/10 text-rose-300 ring-rose-400/20", i: <XCircle className="h-4 w-4" /> },
  }[s];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ring-1 ${map.c}`}>
      {map.i}{map.t}
    </span>
  );
}
function Stat({ icon, title, value, foot }: { icon: React.ReactNode; title: string; value: string; foot?: string; }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 p-4 ring-1 ring-inset ring-white/5">
      <div className="pointer-events-none absolute -inset-24 -z-10 rounded-[36px] bg-gradient-to-br from-cyan-500/15 via-emerald-400/10 to-transparent blur-2xl" />
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-slate-300">{title}</p>
        <div className="rounded-xl bg-white/5 p-2 text-slate-200">{icon}</div>
      </div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {foot && <p className="mt-1 text-xs text-slate-400">{foot}</p>}
      <svg viewBox="0 0 120 24" className="mt-3 h-6 w-full text-cyan-300/70">
        <polyline fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5"
          points="0,18 12,14 24,16 36,9 48,12 60,7 72,10 84,6 96,8 108,5 120,7" />
      </svg>
    </div>
  );
}
function Th({ children, className = "" }: any) { return <th className={`px-3 py-2 text-left text-xs font-medium text-slate-300 ${className}`}>{children}</th>; }
function Td({ children, className = "" }: any) { return <td className={`px-3 py-2 align-top ${className}`}>{children}</td>; }
function SideLink({ href, icon, children }: React.PropsWithChildren<{ href: string; icon: React.ReactNode }>) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-white/5">
      {icon}<span>{children}</span>
    </Link>
  );
}

/* ------------------------------ Page ------------------------------- */
export default function DashboardPage() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100">
      {/* soft bg aura */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-cyan-700/25 via-emerald-500/15 to-transparent blur-[90px]" />

      <div className="mx-auto flex max-w-[1280px] gap-5 px-4 py-5 md:px-6">
        {/* ---------------- Sidebar ---------------- */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-70 max-w-[260px] transform border-r border-white/10 bg-slate-950/95 p-3 ring-1 ring-white/5 transition-transform md:static md:translate-x-0 md:rounded-2xl ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlugZap className="h-5 w-5 text-cyan-300" />
              <span className="text-sm font-semibold">DDCE • Emergency API</span>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-slate-300 hover:bg-white/5 md:hidden" aria-label="close menu"><X className="h-5 w-5" /></button>
          </div>

          <nav className="space-y-1">
            <SideLink href="#" icon={<LayoutDashboard className="h-4 w-4" />}>หน้าหลัก</SideLink>
            <SideLink href="/Request" icon={<FileText className="h-4 w-4" />}>ยื่นคำขอใช้งาน API</SideLink>
            <SideLink href="/Status" icon={<Library className="h-4 w-4" />}>รายการ API ทั้งหมด</SideLink>
            <SideLink href="/docs" icon={<BookOpen className="h-4 w-4" />}>เอกสารสำหรับนักพัฒนา</SideLink>
            <SideLink href="/inbox" icon={<Inbox className="h-4 w-4" />}>กล่องคำขอ/แจ้งเตือน</SideLink>
            <SideLink href="/settings" icon={<Settings className="h-4 w-4" />}>การตั้งค่า</SideLink>
          </nav>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs">
            <div className="mb-1 flex items-center gap-2 font-medium">
              <Shield className="h-4 w-4 text-cyan-300" /> สถานะระบบ API
            </div>
            <ul className="space-y-1">
              <li className="flex items-center justify-between"><span>Gateway</span><span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-300 ring-1 ring-emerald-400/20">ปกติ</span></li>
              <li className="flex items-center justify-between"><span>Events</span><span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-300 ring-1 ring-emerald-400/20">ปกติ</span></li>
              <li className="flex items-center justify-between"><span>Lab</span><span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-amber-300 ring-1 ring-amber-400/20">ชะลอตัว</span></li>
            </ul>
            <Link href="/status" className="mt-2 inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200">
              รายงานสถานะทั้งหมด <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-4 border-t border-white/10 pt-3">
            <button className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-slate-300 hover:bg-white/5">
              <span className="inline-flex items-center gap-2"><LogOut className="h-4 w-4" /> ออกจากระบบ</span>
              <ChevronDown className="h-4 w-4 opacity-60" />
            </button>
          </div>
        </aside>

        {/* ----------------- Main ------------------ */}
        <main className="relative flex-1">
          {/* Topbar */}
          <div className="mb-4 flex items-center gap-2">
            <button onClick={() => setOpen(true)} className="rounded-xl p-2 text-slate-200 hover:bg-white/5 md:hidden" aria-label="open menu">
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative hidden flex-1 md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                className="h-10 w-full rounded-2xl border border-white/10 bg-white/5 pl-10 pr-3 text-sm outline-none ring-1 ring-inset ring-white/5 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-400/40"
                placeholder="ค้นหา API / คำขอ / เอกสาร…"
              />
            </div>

            <button className="ml-auto rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-200 hover:bg-white/10">
              <Bell className="h-5 w-5" />
            </button>
          </div>

          {/* Header */}
          <header className="mb-5">
            <h1 className="text-xl font-semibold">ศูนย์บริการ API (กองควบคุมโรคและภัยสุขภาพในภาวะฉุกเฉิน)</h1>
            <p className="text-sm text-slate-400">เริ่มยื่นคำขอ, ตรวจสถานะ และเรียนรู้การใช้งาน API ได้จากแดชบอร์ดนี้</p>
          </header>

          {/* Stats */}
          <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Stat title="คำขอทั้งหมด" value="12" foot="+2 ภายใน 7 วัน" icon={<FileText className="h-4 w-4" />} />
            <Stat title="รอตรวจสอบ" value="4" foot="เฉลี่ย 2–3 วันทำการ" icon={<Clock className="h-4 w-4" />} />
            <Stat title="คีย์ที่ใช้งานอยู่" value="3" foot="อัปเดตล่าสุด 2 ชม." icon={<KeyRound className="h-4 w-4" />} />
          </section>

          {/* Quick starts */}
          <section className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
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
              icon={<BookOpen className="h-5 w-5" />}
            />
            <QuickCard
              title="สำรวจ API ทั้งหมด"
              desc="EBS Events, Lab, Notification และบริการอื่น ๆ"
              href="/apis"
              tone="amber"
              icon={<Library className="h-5 w-5" />}
            />
          </section>

          {/* Usage & Requests */}
          <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Usage chart (SVG) */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 ring-1 ring-inset ring-white/5 lg:col-span-1">
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
                  <polyline fill="url(#g1)" stroke="none"
                    points="0,80 20,76 40,78 60,60 80,65 100,48 120,58 140,44 160,46 180,38 200,45 220,36 240,40 260,32 280,38 300,30 320,34 320,120 0,120" />
                  <polyline fill="none" stroke="rgb(34 211 238)" strokeWidth="2"
                    points="0,80 20,76 40,78 60,60 80,65 100,48 120,58 140,44 160,46 180,38 200,45 220,36 240,40 260,32 280,38 300,30 320,34" />
                  {/* axis */}
                  <line x1="0" y1="110" x2="320" y2="110" stroke="rgba(255,255,255,.1)" />
                  <line x1="20" y1="10" x2="20" y2="110" stroke="rgba(255,255,255,.05)" />
                </svg>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1"><Cpu className="h-4 w-4 text-cyan-300" /> Gateway</span>
                <span className="inline-flex items-center gap-1"><Activity className="h-4 w-4 text-emerald-300" /> Events</span>
                <span className="inline-flex items-center gap-1"><Database className="h-4 w-4 text-amber-300" /> Lab</span>
              </div>
            </div>

            {/* Recent requests table */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-0 ring-1 ring-inset ring-white/5 lg:col-span-2 overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <h3 className="text-sm font-semibold">คำขอล่าสุด</h3>
                <Link href="/inbox" className="text-xs text-cyan-300 hover:text-cyan-200">ดูทั้งหมด</Link>
              </div>
              <table className="w-full border-separate border-spacing-0 text-sm">
                <thead className="bg-white/5">
                  <tr>
                    <Th>รหัสคำขอ</Th>
                    <Th>ระบบ/โครงการ</Th>
                    <Th>Scope</Th>
                    <Th>วันที่ยื่น</Th>
                    <Th className="text-right pr-4">สถานะ</Th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((r, i) => (
                    <tr key={r.id} className={`border-t border-white/5 ${i % 2 ? "bg-white/[0.02]" : ""}`}>
                      <Td><Link href={`/request/${r.id}`} className="text-cyan-300 hover:text-cyan-200">{r.id}</Link></Td>
                      <Td>{r.system}</Td>
                      <Td>
                        <div className="flex flex-wrap gap-1">
                          {r.scope.map(s => (
                            <span key={s} className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-slate-300 ring-1 ring-white/10">{s}</span>
                          ))}
                        </div>
                      </Td>
                      <Td>{r.createdAt}</Td>
                      <Td className="pr-4 text-right"><StatusPill s={r.status} /></Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Help / Policies */}
          <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <h4 className="mb-1 flex items-center gap-2 text-sm font-semibold"><Waves className="h-4 w-4 text-cyan-300" /> ขั้นตอนยื่นคำขอสั้น ๆ</h4>
              <ol className="space-y-1 text-xs text-slate-300">
                <li>1) กรอกข้อมูลผู้ยื่นและหน่วยงาน</li>
                <li>2) ระบุวัตถุประสงค์ระบบและเลือก Scope</li>
                <li>3) เลือกวิธีพิสูจน์ตัวตน (เช่น OAuth2)</li>
                <li>4) ส่งคำขอและติดตามผลใน “กล่องคำขอ”</li>
              </ol>
              <Link href="/request" className="mt-3 inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200">ไปยังแบบฟอร์ม <ChevronRight className="h-4 w-4" /></Link>
            </Card>

            <Card>
              <h4 className="mb-1 text-sm font-semibold">ความปลอดภัย & การคุ้มครองข้อมูล</h4>
              <p className="text-xs text-slate-300">ปฏิบัติตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล, ใช้คีย์อย่างปลอดภัย, จำกัดสิทธิตามหน้าที่, และบันทึกการใช้งาน (audit log)</p>
              <div className="mt-3 flex gap-2 text-xs">
                <Link href="/docs/security" className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 hover:bg-white/10">อ่านแนวทาง</Link>
                <Link href="/docs" className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 hover:bg-white/10">เปิดเอกสาร</Link>
                <Link href="/support" className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 hover:bg-white/10"><LifeBuoy className="h-4 w-4" />ขอความช่วยเหลือ</Link>
              </div>
            </Card>
          </section>

          {/* Footer */}
          <footer className="mt-8 border-t border-white/10 pt-3 text-xs text-slate-500">
            © {new Date().getFullYear()} Division of Disease Control in Emergencies • DDC
          </footer>
        </main>
      </div>
    </div>
  );
}

/* -------------------------- Helper Components ------------------------- */
function QuickCard({
  title, desc, href, tone = "cyan", icon,
}: { title: string; desc: string; href: string; tone?: "cyan" | "emerald" | "amber"; icon: React.ReactNode; }) {
  const g = { cyan: "from-cyan-500/15 via-cyan-400/10", emerald: "from-emerald-500/15 via-emerald-400/10", amber: "from-amber-500/15 via-amber-400/10" }[tone];
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 p-4 ring-1 ring-inset ring-white/5">
      <div className={`pointer-events-none absolute -inset-16 -z-10 rounded-3xl bg-gradient-to-b ${g} to-transparent blur-2xl`} />
      <div className="mb-1 inline-flex items-center gap-2 text-slate-200">{icon}<h3 className="text-sm font-semibold">{title}</h3></div>
      <p className="text-xs text-slate-400">{desc}</p>
      <Link href={href} className="mt-3 inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10">
        เปิด <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 ring-1 ring-inset ring-white/5">{children}</div>;
}
