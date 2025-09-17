"use client";
import React from "react";
import Link from "next/link";
import { Network, Server, Shield, Globe2, Activity, Layers, FileJson, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* ---------- BG แบบเดียวกับหน้า Introduction ---------- */
function BGWithImage() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 bg-fixed bg-cover bg-center opacity-90"
        style={{ backgroundImage: "url('/bgintroduction1.jpg')" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_10%,rgba(34,211,238,.25),transparent_70%),radial-gradient(60%_40%_at_90%_0%,rgba(16,185,129,.22),transparent_70%)]" />
      <div
        className="absolute inset-0 opacity-[0.08]
        [background:linear-gradient(to_right,rgba(255,255,255,.28)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.28)_1px,transparent_1px)]
        bg-[size:28px_28px]
        [mask-image:radial-gradient(70%_70%_at_50%_35%,black,transparent)]
        animate-[grid-move_22s_linear_infinite]"
      />
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay animate-[grain_1.8s_steps(6)_infinite]
        [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%2240%22 height=%2240%22 filter=%22url(%23n)%22 opacity=%220.5%22 /></svg>')]"
      />
    </div>
  );
}

/* ---------- บาร์บน/ล่าง: ยกมาจากหน้า Introduction ---------- */
function FixedHeader() {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] border-b border-white/10 bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-black/50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="inline-flex h-10 w-10 items-center justify-center rounded-md
               bg-gradient-to-br from-cyan-500 to-emerald-500 text-white
               ring-1 ring-white/20"
            aria-label="DDCE API"
          >
            <Network className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold text-slate-100">DDCE API</span>
        </Link>

        <nav className="hidden items-center gap-4 sm:flex">
          <Link className="text-slate-300 hover:text-white" href="/docs">Docs</Link>
          <Link className="text-slate-300 hover:text-white" href="/introduction/contact">Contact</Link>
          <Link
            href="/auth/register"
            className="rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-slate-100 hover:bg-white/20"
          >
            สมัครใช้งาน
          </Link>
          <Link
            href="/auth/login"
            className="rounded-md bg-gradient-to-r from-cyan-500 to-emerald-500 px-3 py-1.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/10"
          >
            Login
          </Link>
        </nav>
      </div>
    </div>
  );
}
function FixedBottomBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-black/50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 md:px-8">
        <p className="hidden text-sm text-slate-300 md:block">
          Powered by <b>IM-DDCE Team</b>
        </p>
        <div className="ml-auto flex gap-2">
          <Link
            href="/auth/register"
            className="rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-slate-100 hover:bg-white/20"
          >
            สมัครใช้งาน
          </Link>
          <Link
            href="/auth/login"
            className="rounded-md bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------- หน้าโปรแกรม M-EBS ---------- */
export default function MebsDetailPage() {
  const [copiedCurl, setCopiedCurl] = React.useState(false);
  const [copiedJson, setCopiedJson] = React.useState(false);

  const curl = `curl -X GET "https://api.ddce.go.th/v1/events?limit=10&category=outbreak" \\
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"`;

  const sampleJson = JSON.stringify(
    {
      data: [
        {
          id: "31678",
          title: "ผู้ป่วยยืนยันไข้หวัดใหญ่",
          category: "influenza",
          severity: "moderate",
          status: "monitoring",
          source: { type: "news", name: "ThaiNews", url: "https://news.example.com/article/abc123" },
          location: { province: "กรุงเทพมหานคร", district: "บางเขน" },
          reported_at: "2025-09-15T03:21:45Z",
          updated_at: "2025-09-15T05:02:10Z",
          tags: ["M-EBS", "respiratory"]
        }
      ],
      meta: { count: 1 }
    },
    null,
    2
  );

  return (
    <main className="relative min-h-screen overflow-hidden text-slate-100">
      <BGWithImage />
      <FixedHeader />
      <FixedBottomBar />

      {/* กันไม่ให้ทับบาร์ */}
      <div className="relative z-10 pt-16 pb-[72px] md:pb-[68px]">
        {/* HERO */}
        <section className="relative">
          <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-16">
            <Badge className="mb-3 bg-cyan-600/20 text-cyan-300 ring-1 ring-inset ring-cyan-400/30">
              Program
            </Badge>
            <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Modernized Event-based Surveillance (M-EBS)
            </h1>
            <p className="mt-4 max-w-3xl text-slate-200/90">
              ระบบเฝ้าระวังเหตุการณ์ยุคใหม่ของกรมควบคุมโรค ที่รวบรวมข่าว/สัญญาณจากแหล่งสาธารณะและพันธมิตร
              ทำความสะอาดข้อมูล จัดหมวดหมู่อัตโนมัติ และเปิดให้นักพัฒนาดึงข้อมูลผ่าน API
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                href="/auth/register"
                className="rounded-md bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white"
              >
                ขอ API Key
              </Link>
              <Link
                href="/docs"
                className="rounded-md border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-100 hover:bg-white/20"
              >
                ดูเอกสารประกอบ
              </Link>
            </div>
          </div>
        </section>

        {/* คุณสมบัติหลัก */}
        <section className="mx-auto max-w-6xl grid gap-5 px-5 md:grid-cols-3 md:px-8">
          {[
            { icon: Globe2, title: "หลายแหล่งข้อมูล", desc: "ครอบคลุมข่าว เว็บบอร์ด สื่อสังคม และแหล่งข้อมูลภาครัฐ" },
            { icon: Activity, title: "คะแนนความเสี่ยง", desc: "ประเมินความรุนแรง/ความเร่งด่วน ช่วยจัดลำดับการติดตาม" },
            { icon: Layers, title: "จัดหมวดหมู่อัตโนมัติ", desc: "NLP/Rules แยกโรค อาการ พื้นที่ เหตุการณ์ซ้ำซ้อน" },
          ].map((f) => (
            <Card key={f.title} className="border-white/10 bg-slate-900/60">
              <CardContent className="flex items-start gap-3 p-4">
                <span className="rounded-md bg-white/10 p-2 ring-1 ring-white/10">
                  <f.icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-semibold">{f.title}</div>
                  <div className="text-sm text-slate-300">{f.desc}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* ตัวอย่างการเรียกใช้งาน */}
        <section className="mx-auto mt-8 max-w-6xl grid gap-5 px-5 md:grid-cols-2 md:px-8">
          {/* cURL */}
          <Card className="border-white/10 bg-slate-900/60">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                <Server className="h-4 w-4" /> ตัวอย่าง cURL
              </div>
              <div className="relative">
                <pre className="overflow-x-auto rounded-lg border border-white/10 bg-[#0a0f1e] p-4 text-sm leading-relaxed text-slate-200 shadow-inner">
{curl}
                </pre>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(curl);
                    setCopiedCurl(true);
                    setTimeout(() => setCopiedCurl(false), 1200);
                  }}
                  className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/10 hover:bg-white/20"
                  aria-label="คัดลอก cURL"
                >
                  {copiedCurl ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* JSON */}
          <Card className="border-white/10 bg-slate-900/60">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                <FileJson className="h-4 w-4" /> ตัวอย่างผลลัพธ์ JSON
              </div>
              <div className="relative">
                <pre className="overflow-x-auto rounded-lg border border-white/10 bg-[#0a0f1e] p-4 text-sm leading-relaxed text-slate-200 shadow-inner">
{sampleJson}
                </pre>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(sampleJson);
                    setCopiedJson(true);
                    setTimeout(() => setCopiedJson(false), 1200);
                  }}
                  className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/10 hover:bg-white/20"
                  aria-label="คัดลอก JSON"
                >
                  {copiedJson ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ความปลอดภัย & การเข้าถึง */}
        <section className="mx-auto mt-8 max-w-6xl px-5 md:px-8">
          <Card className="border-white/10 bg-slate-900/60">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-100">
                <Shield className="h-4 w-4" />
                <b>การยืนยันตัวตน & ข้อควรระวัง</b>
              </div>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
                <li>ทุกคำขอต้องส่ง Header <code className="rounded bg-white/10 px-1">Authorization: Bearer &lt;API_KEY&gt;</code></li>
                <li>อย่าเผยแพร่ API Key บน client-side หรือ repository สาธารณะ</li>
                <li>ปริมาณการใช้งานอาจมี Rate Limit เพื่อความเสถียรของระบบ</li>
              </ul>
              <div className="mt-4 flex gap-2">
                <Link href="/docs" className="rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-slate-100 hover:bg-white/20">
                  อ่านเอกสาร API
                </Link>
                <Link href="/introduction/contact" className="rounded-md bg-gradient-to-r from-cyan-500 to-emerald-500 px-3 py-1.5 text-sm font-semibold text-white">
                  ติดต่อทีมงาน
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ปุ่มย้อนกลับ */}
        <div className="mx-auto mt-8 max-w-6xl px-5 md:px-8">
          <Link href="/" className="text-sm text-cyan-300 hover:underline">
            ← กลับไปหน้าเทมเพลต
          </Link>
        </div>
      </div>
    </main>
  );
}
