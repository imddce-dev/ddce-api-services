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
          <span
            className="inline-flex h-10 w-10 items-center justify-center rounded-md
               bg-gradient-to-br from-cyan-500 to-emerald-500 text-white ring-1 ring-white/20"
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

/* ---------- หน้าโปรแกรม M-EBS (ดีไซน์ใหม่) ---------- */
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
            <div className="grid gap-8 md:grid-cols-[380px,1fr]">
              {/* โลโก้ในการ์ดแก้ว */}
              <div className="relative">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <div className="absolute -inset-px rounded-2xl opacity-50 blur-2xl [background:conic-gradient(from_180deg_at_50%_50%,rgba(34,211,238,.35),rgba(16,185,129,.35),transparent)]" />
                  <div className="relative flex h-56 items-center justify-center">
                    <Image
                      src="/M-EBSlogo.png"
                      alt="M-EBS logo"
                      width={320}
                      height={160}
                      className="h-28 w-auto md:h-90 drop-shadow-[0_8px_30px_rgba(16,185,129,.35)]"
                      priority
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Badge className="bg-cyan-600/20 text-cyan-200 ring-1 ring-cyan-400/30">Program</Badge>
                    <Badge variant="outline" className="border-emerald-400/40 text-emerald-200">M-EBS</Badge>
                  </div>
                </div>
              </div>

              {/* ข้อความ */}
              <div>
                <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                  Modernized Event-based Surveillance
                </h1>
                <p className="mt-4 text-lg text-slate-200/90">
        ระบบเฝ้าระวังเหตุการณ์โรคและภัยสุขภาพ (โปรแกรมตรวจสอบข่าวการระบาด : Event-based Surveillance) เป็นเครื่องมือสำคัญที่ใช้ในการตรวจจับการระบาด ดักจับข้อมูลที่มีแนวโน้มว่าจะเป็นความเสี่ยงต่อสาธารณะ ซึ่งข้อมูลที่ได้รับอาจจะเป็นข่าวลือหรือการรายงานข่าวตามปกติ ทั้งจากแหล่งข่าวที่เป็นทางการและไม่เป็นทางการ หรือการรายงานจากเจ้าหน้าที่ผู้รับผิดชอบโดยตรง เพื่อให้ได้ข้อมูลและข่าวสารการเกิดโรคและภัยสุขภาพที่นำไปใช้ในการเตือนภัย ส่งผลให้หน่วยงานที่รับผิดชอบสามารถรับมือ และตอบสนองกับเหตุการณ์ที่เกิดขึ้นได้อย่างรวดเร็วและมีประสิทธิภาพ แต่อย่างไรก็ตามระบบฯ ที่ใช้ปฏิบัติงานในปัจจุบัน ยังพบข้อจำกัดหลายประการ เช่น ความยุ่งยากซับซ้อนในการใช้งาน ฐานข้อมูลขาดความเชื่อมโยงกันในแต่ละระดับและการนำข้อมูลที่ได้ไปใช้ประโยชน์ต่อค่อนข้างยากเนื่องจากโครงสร้างข้อมูลและรูปแบบข้อมูลอยู่ในรูปแบบข้อความ (Text) ทำให้จัดการและวิเคราะห์ข้อมูลได้ลำบาก เป็นต้น 
ด้วยข้อจำกัดเหล่านี้ กองควบคุมโรคและภัยสุขภาพในภาวะฉุกเฉิน โดยกลุ่มการจัดการข้อมูลภาวะฉุกเฉินทางสาธารณสุข จึงมีความจำเป็นต้องปรับปรุงและพัฒนาระบบเฝ้าระวังดังกล่าวให้มีความทันสมัย สะดวกต่อการใช้งาน นำข้อมูลไปใช้ประโยชน์ต่อได้ง่ายและมีคุณภาพ สามารถยกระดับการเตือนภัยและตรวจจับเหตุการณ์ผิดปกติได้อย่างรวดเร็ว และตอบโต้ต่อทุกภัยคุกคามได้ทันเหตุการณ์
 	บัดนี้ โปรแกรมเฝ้าระวังเหตุการณ์โรคและภัยสุขภาพ (Modernized Event-based surveillance: M-EBS) ได้ดำเนินการเสร็จสิ้นแล้ว กองควบคุมโรคและภัยสุขภาพในภาวะฉุกเฉิน จึงได้จัดทำ “ประชุมเชิงปฏิบัติการพัฒนาศักยภาพบุคลากรด้านการรายงานเหตุการณ์โรคและภัยสุขภาพในรูปแบบดิจิทัล” ขึ้น 
เพื่อเป็นการสร้างความรับรู้ของโปรแกรม M-EBS ที่ได้พัฒนาขึ้นให้เป็นที่รู้จักสำหรับผู้บริหารและหน่วยงานเครือข่ายต่างๆ พร้อมทั้งพัฒนาศักยภาพบุคลากร กรมควบคุมโรคทั้งในระดับส่วนกลางและส่วนภูมิภาค (ทีม Watch ส่วนกลาง, ทีม SAT สคร.และสปคม. และ SMEs กรมควบคุมโรค) ที่ปฎิบัติงานเกี่ยวข้องกับการเฝ้าระวังเหตุการณ์โรคและภัยสุขภาพสำหรับรองรับการรายงานเหตุการณ์ผ่านโปรแกรมเฝ้าระวังเหตุการณ์โรคและภัยสุขภาพ (Modernized-Event based surveillance: M-EBS) ต่อไป     

                </p>
                <p className="mt-4 text-lg text-slate-200/90">
วัตถุประสงค์ (Objectives)<br/>
•	เพื่อสร้างความรับรู้และมีส่วนร่วมกับโปรแกรมเฝ้าระวังเหตุการณ์โรคและภัยสุขภาพ (Modernized Event-based surveillance: M-EBS) ต่อผู้บริหารกรมควบคุมโรค และหน่วยงานเครือข่าย <br/>
•	พัฒนาศักยภาพบุคลากร กรมควบคุมโรคทั้งในระดับส่วนกลางและส่วนภูมิภาค (ทีม Watch ส่วนกลาง, ทีม SAT สคร.และ สปคม. และ SMEs กรมควบคุมโรค) ที่ปฎิบัติงานเกี่ยวข้องกับการเฝ้าระวังเหตุการณ์โรคและภัยสุขภาพสำหรับรองรับการรายงานเหตุการณ์ผ่านโปรแกรมเฝ้าระวังเหตุการณ์โรคและภัยสุขภาพ (Modernized Event-based surveillance: M-EBS)  

                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white"
                  >
                    <KeyRound className="h-4 w-4" /> ขอ API Key
                  </Link>
                </div>
                {/* ชิปจุดเด่น */}
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
          <Link href="/" className="text-sm text-cyan-300 hover:underline">
            ← กลับไปหน้าแรก
          </Link>
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
