"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Copy, Check, Server } from "lucide-react";

/* ---------- mock template list ---------- */
const templates = [
  { title: "Events Dashboard", desc: "แดชบอร์ดสถานการณ์ & เหตุการณ์", tag: "Dashboard" },
  { title: "Developer Docs", desc: "หน้าเอกสาร API + Search", tag: "Docs" },
  { title: "Minimal Landing", desc: "แลนดิ้งเพจเบา เร็ว โหลดไว", tag: "Landing" },
];

/* ---------- พื้นหลังมีลูกเล่น (Aurora + Grid + Ribbons + Noise) ---------- */
function AuroraBG() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* ริบบิ้นแสงหมุน */}
      <div className="absolute -inset-32 rounded-[999px] blur-3xl opacity-70
        bg-[conic-gradient(from_180deg_at_50%_50%,#22d3ee33_0deg,#34d39933_120deg,#a78bfa33_240deg,#22d3ee33_360deg)]
        animate-[spin-slow_40s_linear_infinite]" />
      {/* blobs */}
      <div className="absolute -left-24 top-6 h-[42rem] w-[42rem] rounded-full bg-cyan-400/30 blur-3xl
        animate-[float_12s_ease-in-out_infinite]" />
      <div className="absolute -right-28 top-24 h-[36rem] w-[36rem] rounded-full bg-emerald-400/30 blur-3xl
        animate-[float_14s_1.2s_ease-in-out_infinite]" />
      <div className="absolute left-1/3 -bottom-28 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/25 blur-3xl
        animate-[drift_18s_ease-in-out_infinite]" />

      {/* grid ขยับ */}
      <div className="absolute inset-0 opacity-[0.12]
        [background:linear-gradient(to_right,rgba(255,255,255,.28)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.28)_1px,transparent_1px)]
        bg-[size:28px_28px]
        [mask-image:radial-gradient(70%_70%_at_50%_35%,black,transparent)]
        animate-[grid-move_22s_linear_infinite]" />

      {/* noise */}
      <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay animate-[grain_1.8s_steps(6)_infinite]
        [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%2240%22 height=%2240%22 filter=%22url(%23n)%22 opacity=%220.55%22 /></svg>')]" />
    </div>
  );
}

/* ---------- Nav บนแบบ fixed ---------- */
function FixedHeader() {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] border-b border-white/10 bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-black/50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500 to-emerald-500 text-sm font-bold text-white">DD</span>
          <span className="text-sm font-semibold text-slate-100">DDCE API</span>
        </Link>

        <nav className="hidden items-center gap-4 sm:flex">
          <Link className="text-slate-300 hover:text-white" href="/docs">Docs</Link>
          <Link className="text-slate-300 hover:text-white" href="/introduction/quickstart">Quickstart</Link>
          <Link
            href="/auth/register"
            className="rounded-md bg-gradient-to-r from-cyan-500 to-emerald-500 px-3 py-1.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/10"
          >
            สมัครใช้งาน
          </Link>
        </nav>
      </div>
    </div>
  );
}

/* ---------- แถบล่างแบบ fixed (Dock bar) ---------- */
function FixedBottomBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-black/50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 md:px-8">
        <p className="hidden text-sm text-slate-300 md:block">
          พร้อมเริ่มใช้งาน? ทดลองใน Sandbox แล้วอัปเกรดเมื่อพร้อม
        </p>
        <div className="ml-auto flex gap-2">
          <Link
            href="/introduction/quickstart"
            className="rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-slate-100 hover:bg-white/20"
          >
            Quickstart
          </Link>
          <Link
            href="/auth/register"
            className="rounded-md bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20"
          >
            สมัครใช้งาน
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function IntroductionPage() {
  const [copied, setCopied] = React.useState(false);
  const curl = `curl -X GET "https://api.ddce.go.th/v1/events?limit=20" \\\n  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"`;

  const copy = () => {
    navigator.clipboard.writeText(curl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1300);
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060913] text-slate-100">
      <AuroraBG />
      <FixedHeader />
      <FixedBottomBar />

      {/* เผื่อพื้นที่ให้แถบ fixed ไม่ทับคอนเทนต์ */}
      <div className="pt-16 pb-[72px] md:pb-[68px]">

        {/* ================================ HERO ================================ */}
        <section className="relative">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 md:grid-cols-2 md:px-8 md:py-16">
            <div>
              <Badge className="mb-3 bg-cyan-600/20 text-cyan-300 ring-1 ring-inset ring-cyan-400/30">
                Free & Responsive
              </Badge>
              <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                เทมเพลตเว็บไซต์สไตล์สถิติง่าย <br className="hidden sm:block" />
                พร้อม API ตัวอย่าง
              </h1>
              <p className="mt-3 max-w-xl text-slate-200/90">
                เริ่มต้นได้ภายในไม่กี่นาทีด้วยโค้ด HTML/React + Tailwind โทนดาร์กแบบ DDCE รองรับมือถือ 100%
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg" className="gap-2 bg-slate-900/60 ring-1 ring-inset ring-white/15 hover:bg-slate-900/80">
                  <Link href="#templates">สำรวจเทมเพลต <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" className="gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white">
                  <Link href="/introduction/quickstart">Quickstart</Link>
                </Button>
              </div>
            </div>

            {/* code preview */}
            <Card className="border-white/10 bg-slate-900/50 backdrop-blur">
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                  <Server className="h-4 w-4" /> cURL ตัวอย่าง
                </div>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg border border-white/10 bg-[#0a0f1e] p-4 text-sm leading-relaxed text-slate-200 shadow-inner">
{curl}
                  </pre>
                  <Button size="sm" variant="secondary" className="absolute right-3 top-3" onClick={copy}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ============================ INTRO BLOCK ============================ */}
        <section className="mx-auto max-w-3xl px-5 pb-6 text-center md:pb-10">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Ready-made static website design templates
          </h2>
          <p className="mt-3 text-slate-300">
            เทมเพลตที่ทีมออกแบบไว้ให้แล้ว โหลดไว แก้ไขง่าย และเข้ากับโทน DDCE คลิกเลือกแล้วนำไปใช้/ปรับแต่งได้ทันที
          </p>
        </section>

        {/* ============================== TEMPLATES ============================== */}
        <section id="templates" className="mx-auto max-w-6xl px-5 pb-16 md:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => (
              <Card key={t.title} className="group overflow-hidden border-white/10 bg-slate-900/50 transition hover:-translate-y-0.5 hover:border-cyan-400/40">
                <div className="h-40 w-full bg-[radial-gradient(120%_120%_at_0%_0%,#0ea5e9_0%,transparent_50%),radial-gradient(120%_120%_at_100%_100%,#10b981_0%,transparent_50%)] opacity-80 transition group-hover:opacity-95" />
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-base font-semibold">{t.title}</h3>
                    <Badge variant="outline" className="border-cyan-400/40 text-cyan-300">{t.tag}</Badge>
                  </div>
                  <p className="text-sm text-slate-300">{t.desc}</p>
                  <div className="mt-3">
                    <Button asChild size="sm" variant="secondary" className="bg-white/10 text-slate-100 hover:bg-white/20">
                      <Link href={`/templates/${t.title.toLowerCase().replace(/\s+/g, "-")}`}>ดูรายละเอียด</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button asChild className="gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white">
              <Link href="/docs">ดูคู่มือทั้งหมด</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
