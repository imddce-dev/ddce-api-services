"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Network, Server, Shield, Globe2, Activity, Layers, FileJson, Copy, Check, KeyRound, BookOpen, Sparkles
} from "lucide-react";
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
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_10%,rgba(34,211,238,.22),transparent_70%),radial-gradient(60%_40%_at_90%_0%,rgba(16,185,129,.18),transparent_70%)]" />
      <div className="absolute inset-0 opacity-[0.08]
        [background:linear-gradient(to_right,rgba(255,255,255,.28)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.28)_1px,transparent_1px)]
        bg-[size:28px_28px]
        [mask-image:radial-gradient(70%_70%_at_50%_35%,black,transparent)]
        animate-[grid-move_22s_linear_infinite]" />
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay animate-[grain_1.8s_steps(6)_infinite]
        [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%2240%22 height=%2240%22 filter=%22url(%23n)%22 opacity=%220.5%22 /></svg>')]" />
    </div>
  );
}

/* ---------- บาร์บน/ล่าง (เหมือนหน้า Introduction) ---------- */
function FixedHeader() {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] border-b border-white/10 bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-black/50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500 to-emerald-500 text-white ring-1 ring-white/20">
            <Network className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold text-slate-100">DDCE API</span>
        </Link>

        <nav className="hidden items-center gap-4 sm:flex">
          <Link className="text-slate-300 hover:text-white" href="/docs">Docs</Link>
          <Link className="text-slate-300 hover:text-white" href="/introduction/contact">Contact</Link>
          <Link href="/auth/register" className="rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-slate-100 hover:bg-white/20">
            สมัครใช้งาน
          </Link>
          <Link href="/auth/login" className="rounded-md bg-gradient-to-r from-cyan-500 to-emerald-500 px-3 py-1.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/10">
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
          <Link href="/auth/register" className="rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-slate-100 hover:bg-white/20">
            สมัครใช้งาน
          </Link>
          <Link href="/auth/login" className="rounded-md bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------- หน้า EBSDDC ---------- */
export default function EbsDdcDetailPage() {
  const [copiedCurl, setCopiedCurl] = React.useState(false);
  const [copiedJson, setCopiedJson] = React.useState(false);

  const curl = `curl -X GET "https://api.ddce.go.th/v1/events?limit=10&program=ebsddc" \\
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"`;

  const sampleJson = JSON.stringify(
    {
      data: [
        {
          id: "44102",
          title: "สัญญาณระบาดโรคทางเดินอาหาร",
          category: "diarrhea",
          severity: "high",
          status: "investigating",
          source: { type: "news", name: "LocalWatch", url: "https://news.example.com/xyz" },
          location: { province: "นครราชสีมา", district: "เมือง" },
          reported_at: "2025-09-16T02:11:00Z",
          updated_at: "2025-09-16T04:00:00Z",
          tags: ["EBS DDC", "water-borne"]
        }
      ],
      meta: { program: "ebsddc", count: 1 }
    },
    null,
    2
  );

  return (
    <main className="relative min-h-screen overflow-hidden text-slate-100">
      <BGWithImage />
      <FixedHeader />
      <FixedBottomBar />

      <div className="relative z-10 pt-16 pb-[72px] md:pb-[68px]">
        {/* HERO */}
        <section className="relative">
          <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-16">
            <div className="grid gap-8 md:grid-cols-[380px,1fr]">
              {/* โลโก้ */}
              <div className="relative">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <div className="absolute -inset-px rounded-2xl opacity-50 blur-2xl [background:conic-gradient(from_180deg_at_50%_50%,rgba(34,211,238,.35),rgba(16,185,129,.35),transparent)]" />
                  <div className="relative flex h-56 items-center justify-center">
                    <Image
                      src="/ddclogo.png"   /* วางโลโก้ไว้ใน /public */
                      alt="EBS DDC logo"
                      width={320}
                      height={160}
                      className="h-28 w-auto md:h-75 drop-shadow-[0_8px_30px_rgba(14,165,233,.35)]"
                      priority
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Badge className="bg-cyan-600/20 text-cyan-200 ring-1 ring-cyan-400/30">Program</Badge>
                    <Badge variant="outline" className="border-cyan-400/40 text-cyan-200">EBS DDC</Badge>
                  </div>
                </div>
              </div>

              {/* เนื้อหา */}
              <div>
                <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                  Event-based Surveillance for DDC
                </h1>
                <p className="mt-4 text-lg text-slate-200/90">
                  ระบบเฝ้าระวังเหตุการณ์ที่ปรับจูนสำหรับบริบทของกรมควบคุมโรค ช่วยรวบรวมสัญญาณจากหลายแหล่งข่าว
                  จัดหมวดหมู่/สกัดแท็กอัตโนมัติ ประเมินความเสี่ยง และส่งต่อสู่ขั้นตอนตอบโต้ของทีมปฏิบัติการได้อย่างคล่องตัว
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white">
                    <KeyRound className="h-4 w-4" /> ขอ API Key
                  </Link>
                  <Link href="/docs" className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-100 hover:bg-white/20">
                    <BookOpen className="h-4 w-4" /> ดูเอกสารประกอบ
                  </Link>
                </div>  
              </div>
            </div>
          </div>
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
                <li>มี Rate Limit เพื่อความเสถียรของระบบ</li>
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
          <Link href="/" className="text-sm text-cyan-300 hover:underline">← กลับไปหน้าแรก</Link>
        </div>
      </div>

      {/* keyframes (ถ้ายังไม่ได้ประกาศ global) */}
      <style jsx global>{`
        @keyframes grid-move {
          from { background-position: 0px 0px, 0px 0px; }
          to   { background-position: 28px 28px, 28px 28px; }
        }
        @keyframes grain {
          0% { transform: translate(0,0); }
          10% { transform: translate(-5%,-10%); }
          20% { transform: translate(-15%,5%); }
          30% { transform: translate(7%,-25%); }
          40% { transform: translate(-5%,25%); }
          50% { transform: translate(-15%,10%); }
          60% { transform: translate(15%,0%); }
          70% { transform: translate(0%,15%); }
          80% { transform: translate(3%,35%); }
          90% { transform: translate(-10%,10%); }
          100% { transform: translate(0,0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-[grid-move_22s_linear_infinite],
          .animate-[grain_1.8s_steps(6)_infinite] { animation: none !important; }
        }
      `}</style>
    </main>
  );
}
