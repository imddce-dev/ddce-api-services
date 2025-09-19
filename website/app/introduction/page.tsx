"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, Copy, Check, FileJson } from "lucide-react";

/* ---------- mapping ---------- */
const slugMap: Record<string, string> = {
  "Modernized Event-based Surveillance": "M-EBS",
  "Event-based Surveillance for DDC": "EBS DDC",
  "Event-based Surveillance for Province": "EBS Province",
};
const logoMap: Record<string, string | undefined> = {
  "M-EBS": "/M-EBSlogo.png",
  "EBS DDC": "/ddclogo.png",
  "EBS Province": "/ddclogo.png",
};
const logoSizeMap: Record<string, string> = {
  "M-EBS": "h-24 md:h-50",
  "EBS DDC": "h-24 md:h-45",
  "EBS Province": "h-24 md:h-45",
};

/* ---------- data ---------- */
const templates = [
  {
    title: "Modernized Event-based Surveillance",
    desc: "โปรแกรมเฝ้าระวังเหตุการณ์โรคและภัยสุขภาพ กรมควบคุมโรค",
    tag: "M-EBS",
  },
  {
    title: "Event-based Surveillance for DDC",
    desc: "โปรแกรมตรวจสอบข่าวการระบาด",
    tag: "EBS DDC",
  },
  {
    title: "Event-based Surveillance for Province",
    desc: "โปรแกรมตรวจสอบข่าวการระบาด ระดับจังหวัด",
    tag: "EBS Province",
  },
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
        source: {
          type: "news",
          name: "ThaiNews",
          url: "https://news.example.com/article/abc123",
        },
        location: { province: "กรุงเทพมหานคร", district: "บางเขน" },
        reported_at: "2025-09-15T03:21:45Z",
        updated_at: "2025-09-15T05:02:10Z",
        tags: ["EBS", "respiratory"],
      },
    ],
  },
  null,
  4
);

/* ---------- Smooth background (fade-in) ---------- */
function BGWithImage() {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setShow(true), 40);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* ภาพพื้นหลัง */}
      <div
        className={[
          "absolute inset-0 bg-fixed bg-cover bg-center transition-opacity duration-700 ease-out will-change-[opacity]",
          show ? "opacity-90" : "opacity-0",
        ].join(" ")}
        style={{ backgroundImage: "url('/bgintroduction1.jpg')" }}
      />

      {/* overlay gradients */}
      <div
        className={[
          "absolute inset-0 transition-opacity duration-700 ease-out will-change-[opacity]",
          show ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_10%,rgba(34,211,238,.22),transparent_70%),radial-gradient(60%_40%_at_90%_0%,rgba(16,185,129,.18),transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.08]
          [background:linear-gradient(to_right,rgba(255,255,255,.28)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.28)_1px,transparent_1px)]
          bg-[size:28px_28px]
          [mask-image:radial-gradient(70%_70%_at_50%_35%,black,transparent)]
          animate-[grid-move_22s_linear_infinite]" />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay animate-[grain_1.8s_steps(6)_infinite]
          [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%2240%22 height=%2240%22 filter=%22url(%23n)%22 opacity=%220.5%22 /></svg>')]" />
      </div>
    </div>
  );
}

/* ---------- Simple FadeIn wrapper ---------- */
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setOn(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={[
        "transform-gpu transition-all duration-700 ease-out will-change-[opacity,transform]",
        on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

/* ---------- Logo (Image with fallback) ---------- */
/* ---------- Logo (Image with fallback) ---------- */
// function LogoMark({ size = 28 }: { size?: number }) {
//   const [ok, setOk] = React.useState(true);
//   return ok ? (
//     // <Image
//     //   src="/ddce-ct-short.png"
//     //   alt="DDCE logo"
//     //   width={size}
//     //   height={size}
//     //   className="shrink-0 rounded-md object-contain"
//     //   priority
//     //   onError={() => setOk(false)}
//     // />
//   ) : (
//     <span className="inline-flex items-center justify-center shrink-0 rounded-md bg-gradient-to-br from-cyan-500 to-emerald-500 ring-1 ring-white/20"
//           style={{ width: size, height: size }}>
//       <Network className="h-4 w-4 text-white" aria-hidden="true" />
//     </span>
//   );
// }


/* ---------- Header / Bottom Bar ---------- */
function FixedHeader() {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] border-b border-white/10 bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-black/50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-8">
        {/* โลโก้ชิดซ้ายอยู่ข้างข้อความ */}
        <Link
          href="/"
          className="flex flex-col items-center gap-1 min-w-0"
          aria-label="DDCE API – Home"
        >
          {/* <LogoMark size={80} /> */}
          <span className="text-sm font-medium text-white text-center">
            DDCE API Request
          </span>
        </Link>
        <nav className="hidden items-center gap-4 sm:flex">
          <Link className="text-slate-300 transition-colors duration-200 hover:text-white" href="/introduction/docs">
            Docs
          </Link>
          <Link className="text-slate-300 transition-colors duration-200 hover:text-white" href="/introduction/contact">
            Contact
          </Link>
          <Link
            href="/auth/register"
            className="rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-slate-100 transition-all duration-200 hover:bg-white/20 active:scale-[0.98]"
          >
            สมัครใช้งาน
          </Link>
          <Link
            href="/auth/login"
            className="rounded-md bg-gradient-to-r from-cyan-500 to-emerald-500 px-3 py-1.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/10 transition-transform duration-200 active:scale-[0.98]"
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
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-black/50 transition-colors duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 md:px-8">
        <p className="hidden text-sm text-slate-300 md:block">
          Powered by <b>IM-DDCE Team</b>
        </p>
        {/* <div className="ml-auto flex gap-2">
          <Link
            href="/auth/register"
            className="rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-slate-100 transition-all duration-200 hover:bg-white/20 active:scale-[0.98]"
          >
            สมัครใช้งาน
          </Link>
          <Link
            href="/auth/login"
            className="rounded-md bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-transform duration-200 active:scale-[0.98]"
          >
            Login
          </Link>
        </div> */}
      </div>
    </div>
  );
}

/* ---------- Page ---------- */
export default function IntroductionPage() {
  const [copied, setCopied] = React.useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060913] text-slate-100">
      <BGWithImage />
      <FixedHeader />
      <FixedBottomBar />

      {/* content over background */}
      <div className="relative z-10 pt-16 pb-[72px] md:pb-[68px]">
        {/* HERO */}
        <section className="relative">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 md:grid-cols-2 md:px-8 md:py-16">
            <FadeIn delay={80}>
              <Badge className="mb-3 bg-cyan-600/20 text-cyan-300 ring-1 ring-inset ring-cyan-400/30">
                IM-DDCE API V.1.0
              </Badge>
              <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                DDCE API Request
              </h1>
              <p className="mt-3 max-w-xl text-slate-200/90">
                ระบบบริการข้อมูลเหตุการณ์โรคและภัยสุขภาพ (Event Based Surveillance) <br/>กรมควบคุมโรค
                ผ่านระบบ API โดยกลุ่มงานการจัดการข้อมูลภาวะฉุกเฉินทางสาธารณสุข Information
                Management (IM) <br/>กองควบคุมโรคและภัยสุขภาพในภาวะฉุกเฉิน กรมควบคุมโรค
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/auth/register"
                  className="rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-slate-100 transition-all duration-200 hover:bg-white/20 active:scale-[0.98]"
                >
                  สมัครใช้งาน
                </Link>
              </div>
            </FadeIn>

            {/* code preview */}
            <FadeIn delay={180}>
              <Card className="border-white/10 bg-slate-900/60 backdrop-blur transition-shadow duration-300 hover:shadow-cyan-500/10">
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
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
                      className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/10 text-slate-100 transition-all duration-150 hover:bg-white/20 active:scale-95"
                      aria-label="คัดลอก JSON"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </section>

        {/* INTRO */}
        <FadeIn delay={120}>
          <section className="mx-auto max-w-3xl px-5 pb-6 text-center md:pb-10">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              ระบบ API ที่พร้อมให้บริการ
            </h2>
            <p className="mt-3 text-slate-300">สามารถสมัครเพื่อกรอกคำขอรับข้อมูล API Key</p>
          </section>
        </FadeIn>

        {/* TEMPLATES */}
        <section id="templates" className="mx-auto max-w-6xl px-5 pb-16 md:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 text-white">
            {templates.map((t, i) => {
              const logoSrc = logoMap[t.tag];
              return (
                <FadeIn key={t.title} delay={80 + i * 100} className="h-full">
                  <Card className="group h-full overflow-hidden border-white/10 bg-slate-900/70 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-cyan-500/10">
                    {/* Header / logo */}
                    <div className="relative h-40 w-full bg-[radial-gradient(120%_120%_at_0%_0%,rgba(14,165,233,.12)_0%,transparent_55%),radial-gradient(120%_120%_at_100%_100%,rgba(16,185,129,.10)_0%,transparent_55%)]">
                      {logoSrc && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Image
                            src={logoSrc}
                            alt={`${t.tag} logo`}
                            width={220}
                            height={220}
                            className={`${logoSizeMap[t.tag] ?? "h-20"} w-auto transition-transform duration-300 ease-out group-hover:scale-105`}
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
                          className="bg-white/10 text-slate-100 transition-all duration-200 hover:bg-white/20 active:scale-[0.98]"
                        >
                          {/* <Link href={`/introduction/information/${slugMap[t.title]}`}>
                            ดูรายละเอียด
                          </Link> */}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        </section>
      </div>

      {/* global helpers for smooth scroll / motion-reduce */}
      <style jsx global>{`
        html { scroll-behavior: smooth; }
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
          .transition-all, .transition-colors, .transition-transform, .transition-opacity { transition: none !important; }
          .animate-\[grid-move_22s_linear_infinite\],
          .animate-\[grain_1\.8s_steps\(6\)_infinite] { animation: none !important; }
        }
      `}</style>
    </main>
  );
}
