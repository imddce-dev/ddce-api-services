"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Network } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ArrowRight, Copy, Check, Server, FileJson } from "lucide-react";
/* ก่อน map การ์ด เพิ่มแม็พชื่อ -> สลั๊ก */
const slugMap: Record<string, string> = {
  "Modernized Event-based Surveillance": "M-EBS",
  "Event-based Surveillance for DDC": "EBSDDC",
  "Modernized Event-based Surveillance for Province": "EBSProvince",
};
const logoMap: Record<string, string | undefined> = {
  "M-EBS": "/M-EBSlogo.png",
  "EBSDDC": "/ddclogo.png",
  "EBS Province": "/ddclogo.png", // มีไฟล์ค่อยเปิด ใช้ชื่อ tag ให้ตรง!
};


/* ---------- mock template list ---------- */
const templates = [
  { title: "Modernized Event-based Surveillance", desc: "โปรแกรมเฝ้าระวังเหตุการณ์โรคและภัยสุขภาพ กรมควบคุมโรค", tag: "M-EBS" },
  { title: "Event-based Surveillance for DDC", desc: "โปรแกรมตรวจสอบข่าวการระบาด", tag: "EBSDDC" },
  { title: "Modernized Event-based Surveillance for Province", desc: "โปรแกรมตรวจสอบข่าวการระบาด ระดับจังหวัด", tag: "EBS Province" },
];

const exampleJson = JSON.stringify(
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
        tags: ["EBS", "respiratory"],
      }
    ],
  },
  null,
  4
);


/* ---------- พื้นหลัง: ใช้ภาพ bgintroduction.jpg + overlay โทนฟ้า/เขียว ---------- */
function BGWithImage() {
  return (
    // เปลี่ยน -z-10 -> z-0
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* ภาพพื้นหลัง */}
      <div
        className="absolute inset-0 bg-fixed bg-cover bg-center opacity-90"
        style={{ backgroundImage: "url('/bgintroduction1.jpg')" }}
      />
      {/* overlay โทนฟ้า-เขียว + grid + noise (เหมือนเดิม) */}
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

/* ---------- Header / Bottom Bar (คงเดิม แก้โลโก้ให้เป็นไซส์ที่มีจริง) ---------- */
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

export default function IntroductionPage() {
  const [copied, setCopied] = React.useState(false);
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060913] text-slate-100">
      <BGWithImage />
      <FixedHeader />
      <FixedBottomBar />

      {/* ทำให้คอนเทนต์อยู่เหนือแบ็กกราวด์ */}
      <div className="relative z-10 pt-16 pb-[72px] md:pb-[68px]">
        {/* HERO */}
        <section className="relative">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 md:grid-cols-2 md:px-8 md:py-16">
            <div>
              <Badge className="mb-3 bg-cyan-600/20 text-cyan-300 ring-1 ring-inset ring-cyan-400/30">
                IM-DDCE API V.1.0
              </Badge>
              <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                ระบบคำขอ API พัฒนาโดย <br className="hidden sm:block" /> กลุ่มการจัดการข้อมูลภาวะฉุกเฉินทางสาธารณสุข <br className="hidden sm:block" />
                พร้อม API ตัวอย่าง
              </h1>
              <p className="mt-3 max-w-xl text-slate-200/90">
                ระบบ API สำหรับนักพัฒนา ที่ต้องการเชื่อมต่อข้อมูลข่าวสารเหตุการณ์โรคและภัยสุขภาพ จากกรมควบคุมโรค โดย กลุ่มการจัดการข้อมูลภาวะฉุกเฉินทางสาธารณะสุข กองควบคุมโรคและภัยสุขภาพในภาวะฉุกเฉิน (DDCE)
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/auth/register"
                  className="rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-slate-100 hover:bg-white/20"
                >
                  สมัครใช้งาน
                </Link>
              </div>
            </div>

            {/* code preview */}
            <Card className="border-white/10 bg-slate-900/60 backdrop-blur">
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                  {/* จะใช้ Server หรือ FileJson ก็ได้ */}
                  <FileJson className="h-4 w-4" /> JSON ตัวอย่าง
                </div>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg border border-white/10 bg-[#0a0f1e] p-4 text-sm leading-relaxed text-slate-200 shadow-inner">
                    {exampleJson}
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(exampleJson).then(() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1300);
                      });
                    }}
                    className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/10 text-slate-100 hover:bg-white/20"
                    aria-label="คัดลอก JSON"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* INTRO */}
        <section className="mx-auto max-w-3xl px-5 pb-6 text-center md:pb-10">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            ระบบข้อมูล API ที่พร้อมใช้งาน
          </h2>
          <p className="mt-3 text-slate-300">
            สามารถสมัครเพื่อกรอกคำขอรับข้อมูล API Key
          </p>
        </section>

        {/* TEMPLATES */}
        <section id="templates" className="mx-auto max-w-6xl px-5 pb-16 md:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 text-white" >
           {templates.map((t) => {
  const logoSrc = logoMap[t.tag]; // ดึงตาม tag ของการ์ด
  return (
    <Card
      key={t.title}
      className="group overflow-hidden border-white/10 bg-slate-900/70 transition hover:-translate-y-0.5 hover:border-cyan-400/40 text-white"
    >
      {/* Header */}
      <div className="relative h-40 w-full 
        bg-[radial-gradient(120%_120%_at_0%_0%,rgba(14,165,233,.12)_0%,transparent_55%),
            radial-gradient(120%_120%_at_100%_100%,rgba(16,185,129,.10)_0%,transparent_55%)]">
        {/* โลโก้ (ถ้ามี) */}
        {logoSrc && (
          <div className="absolute inset-0 flex items-center justify-center">
      <Image
  src={logoSrc}
  alt={`${t.tag} logo`}
  width={200}
  height={200}
  className="h-20 w-auto md:h-45"  // << ปรับที่นี่
/>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-base font-semibold">{t.title}</h3>
          <Badge variant="outline" className="border-cyan-400/40 text-cyan-300">
            {t.tag}
          </Badge>
        </div>
        <p className="text-sm text-slate-300">{t.desc}</p>
        <div className="mt-3">
          <Button
            asChild
            size="sm"
            variant="secondary"
            className="bg-white/10 text-slate-100 hover:bg-white/20"
          >
            <Link href={`/introduction/information/${slugMap[t.title]}`}>
              ดูรายละเอียด
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
})}
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
