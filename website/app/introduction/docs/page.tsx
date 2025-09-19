"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen, Server, KeyRound, Link2, ShieldAlert, ListTree, Search, Network, Copy, Check
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

/* ---------------- BG (เหมือนหน้า Introduction) ---------------- */
function BGWithImage() {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setShow(true), 40);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className={[
          "absolute inset-0 bg-fixed bg-cover bg-center transition-opacity duration-700 ease-out will-change-[opacity]",
          show ? "opacity-90" : "opacity-0",
        ].join(" ")}
        style={{ backgroundImage: "url('/bgintroduction1.jpg')" }}
      />
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

/* ---------- Logo (Image with fallback) ---------- */
// function LogoMark({ size = 28 }: { size?: number }) {
//   const [ok, setOk] = React.useState(true);
//   return ok ? (
//     <Image
//       src="/ddce-ct-short.png"
//       alt="DDCE logo"
//       width={size}
//       height={size}
//       className="shrink-0 rounded-md object-contain"
//       priority
//       onError={() => setOk(false)}
//     />
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
        <p className="hidden text-sm text-slate-300 md:block">Powered by <b>IM-DDCE Team</b></p>
        {/* <div className="ml-auto flex gap-2">
          <Link href="/auth/register" className="rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-slate-100 transition-all duration-200 hover:bg-white/20 active:scale-[0.98]">
            สมัครใช้งาน
          </Link>
          <Link href="/auth/login" className="rounded-md bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-transform duration-200 active:scale-[0.98]">
            Login
          </Link>
        </div> */}
      </div>
    </div>
  );
}

/* ---------------- Top scroll progress ---------------- */
function ScrollProgress() {
  const [p, setP] = React.useState(0);
  React.useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const prog = max > 0 ? (h.scrollTop / max) * 100 : 0;
      setP(Math.min(100, Math.max(0, prog)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed left-0 top-[48px] z-[55] h-[3px] w-full bg-transparent md:top-[52px]">
      <div
        style={{ width: `${p}%` }}
        className="h-full origin-left rounded-r bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-300 transition-[width] duration-150"
      />
    </div>
  );
}

/* ---------------- Utils ---------------- */
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setOn(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div className={["transform-gpu transition-all duration-700 ease-out will-change-[opacity,transform]", on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3", className].join(" ")}>
      {children}
    </div>
  );
}

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-lg border border-white/10 bg-[#0a0f1e] p-4 text-sm leading-relaxed text-slate-200 shadow-inner">
        <code className={`language-${lang}`}>{code}</code>
      </pre>
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/10 text-slate-100 transition-all duration-150 hover:bg-white/20 active:scale-95"
        aria-label="คัดลอก"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

/* ---------------- Side Nav (ซ้าย) = Navbar ที่เลื่อนตาม ---------------- */
const sections = [
  { id: "overview", label: "ภาพรวม" },
  { id: "auth", label: "การยืนยันตัวตน" },
  { id: "quickstart", label: "Quickstart" },
  { id: "endpoints", label: "Endpoints" },
  { id: "filters", label: "การกรอง/ค้นหา" },
  { id: "pagination", label: "การแบ่งหน้า" },
  { id: "webhooks", label: "Webhooks" },
  { id: "errors", label: "รูปแบบ Error" },
  { id: "rate", label: "Rate Limit" },
  { id: "security", label: "ความปลอดภัย" },
];

const HEADER_OFFSET = 96;
type ItemRefs = Record<string, HTMLAnchorElement | null>;

function SideNav() {
  const [active, setActive] = React.useState("overview");
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const itemRefs = React.useRef<ItemRefs>({});

  /* ScrollSpy: อัปเดต active ตาม section บนหน้า */
  React.useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && setActive(s.id)),
        { rootMargin: "-40% 0px -50% 0px", threshold: 0.1 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  /* ให้ item ที่ active โผล่ในวิวนิดหน่อยเสมอ */
  React.useEffect(() => {
    const wrap = wrapRef.current;
    const link = itemRefs.current[active];
    if (!wrap || !link) return;

    const linkTop = link.offsetTop;
    const linkBottom = linkTop + link.clientHeight;
    const viewTop = wrap.scrollTop;
    const viewBottom = viewTop + wrap.clientHeight;

    if (linkTop < viewTop + 32) {
      wrap.scrollTo({ top: Math.max(0, linkTop - 32), behavior: "smooth" });
    } else if (linkBottom > viewBottom - 32) {
      wrap.scrollTo({ top: linkBottom - wrap.clientHeight + 32, behavior: "smooth" });
    }
  }, [active]);

  /* deep-link: เปิดมาพร้อม #hash */
  React.useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.replace("#", ""));
    if (!hash) return;
    const el = document.getElementById(hash);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    setTimeout(() => window.scrollTo({ top: y, behavior: "auto" }), 20);
  }, []);

  /* ★★ สำคัญ: เมื่อหมุนเมาส์บนสารบัญ ให้หน้าหลักเลื่อนไปด้วยเสมอ (ทั้งกรอบเลื่อนตาม) ★★ */
  React.useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onWheel = (e: WheelEvent) => {
      // เลื่อนหน้าไปด้วย (ปรับ factor ได้)
      window.scrollBy({ top: e.deltaY * 0.6, behavior: "auto" });
      // ไม่ block การเลื่อนภายในสารบัญ (ให้ไหลธรรมชาติ)
    };

    // ใช้ addEventListener ตรงๆ เพื่อรองรับ passive listeners ของ browser
    wrap.addEventListener("wheel", onWheel, { passive: true });
    return () => wrap.removeEventListener("wheel", onWheel);
  }, []);

  /* คลิกไปหัวข้อ (ชดเชย navbar) */
  const go = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  /* Mobile: top scroller */
  const MobileTabs = (
    <div className="md:hidden sticky top-[52px] z-40 -mx-6 mb-2 overflow-x-auto px-6 py-2 backdrop-blur">
      <nav className="flex gap-2" aria-label="สารบัญ (มือถือ)">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={go(s.id)}
              className={[
                "whitespace-nowrap rounded-full px-3 py-1 text-xs transition-colors",
                isActive ? "bg-white/15 text-white ring-1 ring-white/20" : "bg-white/5 text-slate-300 hover:text-white",
              ].join(" ")}
              aria-current={isActive ? "page" : undefined}
            >
              {s.label}
            </a>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {MobileTabs}

      {/* Desktop Side Nav */}
      <aside
        className="sticky top-24 hidden h-[calc(100vh-7rem)] w-[min(280px,28vw)] shrink-0 rounded-2xl border border-white/10 bg-black/35 backdrop-blur md:flex md:flex-col"
        aria-label="สารบัญ"
      >
        <div className="flex items-center gap-2 px-3 pb-2 pt-3 text-slate-200">
          <ListTree className="h-4 w-4" /> <b>สารบัญ</b>
        </div>

        <div
          ref={wrapRef}
          className="
            relative mx-2 mb-2 overflow-y-auto rounded-xl p-2 pr-3
            h-[calc(100vh-9.5rem)] max-h-[calc(100vh-9.5rem)]
            [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]
          "
        >
          <div className="pointer-events-none absolute left-4 top-2 bottom-2 w-px bg-white/10" />
          <nav className="relative z-10 space-y-1 pl-6">
            {sections.map((s) => {
              const isActive = active === s.id;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  ref={(el) => { itemRefs.current[s.id] = el; }}
                  onClick={go(s.id)}
                  className={[
                    "group relative block rounded-md px-2 py-1.5 text-sm transition-all",
                    isActive
                      ? "bg-white/10 text-white shadow-[0_0_0_1px_rgba(255,255,255,.06)_inset] backdrop-blur"
                      : "text-slate-300 hover:text-white hover:bg-white/5",
                  ].join(" ")}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span
                    className={[
                      "absolute -left-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full transition-all",
                      isActive
                        ? "bg-gradient-to-r from-cyan-400 to-emerald-400 scale-110 shadow-[0_0_12px_rgba(16,185,129,.55)]"
                        : "bg-white/30 group-hover:bg-white/60",
                    ].join(" ")}
                  />
                  {s.label}
                  <span
                    className={[
                      "pointer-events-none absolute right-1 top-1/2 h-px -translate-y-1/2 rounded-full transition-all",
                      isActive ? "w-6 bg-gradient-to-r from-cyan-400/60 to-emerald-400/60" : "w-0 bg-transparent",
                    ].join(" ")}
                  />
                </a>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}

/* ---------------- Page ---------------- */
export default function DocsPage() {
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
          tags: ["EBS", "respiratory"],
        },
      ],
      meta: { count: 1, next_cursor: "eyJpZCI6IjMxNjc4In0=" },
    },
    null,
    2
  );

  const curl = `curl -s -X GET "https://api.ddce.go.th/v1/events?limit=10&category=outbreak" \\
  -H "Authorization: Bearer <YOUR_API_KEY>"`;

  const js = `// JavaScript (fetch)
const res = await fetch("https://api.ddce.go.th/v1/events?limit=10", {
  headers: { Authorization: "Bearer " + process.env.NEXT_PUBLIC_API_KEY }
});
const json = await res.json();`;

  const py = `# Python (requests)
import os, requests
r = requests.get(
  "https://api.ddce.go.th/v1/events",
  params={"limit": 10, "category": "outbreak"},
  headers={"Authorization": f"Bearer {os.environ['API_KEY']}"}
)
print(r.json())`;

  const webhook = `POST https://yourapp.example.com/webhooks/ddce
Content-Type: application/json

{
  "type": "event.created",
  "data": {
    "id": "31880",
    "title": "สัญญาณไข้หวัดใหญ่กลุ่มก้อน",
    "category": "influenza",
    "severity": "high",
    "reported_at": "2025-09-18T01:22:00Z"
  },
  "sent_at": "2025-09-18T01:23:02Z",
  "signature": "<HMAC-SHA256>"
}`;

  const errorJson = JSON.stringify(
    { error: { code: "RATE_LIMITED", message: "Too many requests. Please retry later.", request_id: "req_01HXYZ...", status: 429 } },
    null,
    2
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060913] text-slate-100">
      <BGWithImage />
      <FixedHeader />
      <ScrollProgress />
      <FixedBottomBar />

      <div className="relative z-10 pt-16 pb-[72px] md:pb-[68px]">
        {/* Hero */}
        <header className="relative">
          <div className="mx-auto max-w-6xl px-6 py-10 md:px-8 md:py-14">
            <FadeIn>
              <div className="mb-3 flex items-center gap-2">
                <Badge className="bg-cyan-600/20 text-cyan-300 ring-1 ring-inset ring-cyan-400/30">Documentation</Badge>
                <Badge variant="outline" className="border-emerald-400/40 text-emerald-200">IM-DDCE API</Badge>
              </div>
              <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                เอกสารการใช้งาน API (One-Page)
              </h1>
              <p className="mt-3 max-w-3xl text-lg text-slate-200/90">
                หน้านี้รวมภาพรวม แนวทางยืนยันตัวตน ตัวอย่างโค้ด Endpoints การกรอง/แบ่งหน้า Webhooks รูปแบบ Error และข้อกำหนดด้านความปลอดภัย — ทั้งหมดในหน้าเดียว
              </p>
            </FadeIn>
          </div>
        </header>

        {/* Layout */}
        <section className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-[minmax(240px,280px)_minmax(0,1fr)] md:px-8">
          <FadeIn delay={120}>
            <SideNav />
          </FadeIn>

          <div className="space-y-6">
            <FadeIn>
              <Card id="overview" className="scroll-mt-24 border-white/10 bg-slate-900/60 backdrop-blur">
                <CardContent className="space-y-3 p-5">
                  <div className="mb-1 flex items-center gap-2 text-slate-100"><BookOpen className="h-4 w-4" /> <b>ภาพรวม</b></div>
                  <p className="text-slate-200/90">
                    API ออกแบบแบบ REST ส่งข้อมูลเป็น JSON รองรับการค้นหา/กรอง/แบ่งหน้าและ Webhook สำหรับการแจ้งเหตุการณ์ใหม่
                    ทุกคำขอต้องยืนยันตัวตนด้วย <code className="rounded bg-white/10 px-1">Authorization: Bearer &lt;API_KEY&gt;</code>
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                      <div className="mb-1 text-sm text-slate-300">Base URL</div>
                      <div className="font-mono text-sm">https://api.ddce.go.th/v1</div>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                      <div className="mb-1 text-sm text-slate-300">รูปแบบข้อมูล</div>
                      <div className="font-mono text-sm">Content-Type: application/json</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn>
              <Card id="auth" className="scroll-mt-24 border-white/10 bg-slate-900/60 backdrop-blur">
                <CardContent className="space-y-3 p-5">
                  <div className="mb-1 flex items-center gap-2 text-slate-100"><KeyRound className="h-4 w-4" /> <b>การยืนยันตัวตน</b></div>
                  <p className="text-slate-200/90">
                    สมัครและรับ API Key จากหน้า <Link href="/auth/register" className="text-cyan-300 underline">Register</Link> &nbsp;เมื่อได้ API Key แล้ว ให้ส่งใน Header ทุกคำขอ:
                  </p>
                  <CodeBlock lang="bash" code={`Authorization: Bearer <YOUR_API_KEY>`} />
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn>
              <Card id="quickstart" className="scroll-mt-24 border-white/10 bg-slate-900/60 backdrop-blur">
                <CardContent className="space-y-4 p-5">
                  <div className="mb-1 flex items-center gap-2 text-slate-100"><Server className="h-4 w-4" /> <b>Quickstart</b></div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div><div className="mb-2 text-sm text-slate-300">cURL</div><CodeBlock lang="bash" code={curl} /></div>
                    <div><div className="mb-2 text-sm text-slate-300">JavaScript (fetch)</div><CodeBlock lang="js" code={js} /></div>
                    <div><div className="mb-2 text-sm text-slate-300">Python (requests)</div><CodeBlock lang="python" code={py} /></div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn>
              <Card id="endpoints" className="scroll-mt-24 border-white/10 bg-slate-900/60 backdrop-blur">
                <CardContent className="space-y-4 p-5">
                  <div className="mb-1 flex items-center gap-2 text-slate-100"><Link2 className="h-4 w-4" /> <b>Endpoints</b></div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <div className="font-mono text-sm">GET /events</div>
                    <p className="mt-1 text-sm text-slate-300">ดึงรายการเหตุการณ์ (รองรับ filter & pagination)</p>
                    <CodeBlock lang="bash" code={`curl -s "https://api.ddce.go.th/v1/events?limit=20&category=influenza&province=เชียงใหม่" -H "Authorization: Bearer <API_KEY>"`} />
                    <div className="mt-3 text-sm text-slate-300">ตัวอย่างผลลัพธ์</div>
                    <CodeBlock lang="json" code={sampleJson} />
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <div className="font-mono text-sm">GET /events/{`{id}`}</div>
                    <p className="mt-1 text-sm text-slate-300">รายละเอียดเหตุการณ์ตามรหัส</p>
                    <CodeBlock lang="bash" code={`curl -s "https://api.ddce.go.th/v1/events/31678" -H "Authorization: Bearer <API_KEY>"`} />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn>
              <Card id="filters" className="scroll-mt-24 border-white/10 bg-slate-900/60 backdrop-blur">
                <CardContent className="space-y-3 p-5">
                  <div className="mb-1 flex items-center gap-2 text-slate-100"><Search className="h-4 w-4" /> <b>การกรอง/ค้นหา</b></div>
                  <ul className="list-disc space-y-1 pl-5 text-slate-300">
                    <li><code className="rounded bg-white/10 px-1">category</code> เช่น <code className="rounded bg-white/10 px-1">influenza</code>, <code className="rounded bg-white/10 px-1">diarrhea</code></li>
                    <li><code className="rounded bg-white/10 px-1">severity</code> = <code className="rounded bg-white/10 px-1">low|moderate|high</code></li>
                    <li><code className="rounded bg-white/10 px-1">province</code>, <code className="rounded bg-white/10 px-1">district</code></li>
                    <li><code className="rounded bg-white/10 px-1">from</code>, <code className="rounded bg-white/10 px-1">to</code> (ISO8601)</li>
                    <li><code className="rounded bg-white/10 px-1">q</code> ค้นหาคำในหัวข้อ/แท็ก</li>
                  </ul>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn>
              <Card id="pagination" className="scroll-mt-24 border-white/10 bg-slate-900/60 backdrop-blur">
                <CardContent className="space-y-3 p-5">
                  <div className="mb-1 flex items-center gap-2 text-slate-100"><ListTree className="h-4 w-4" /> <b>การแบ่งหน้า</b></div>
                  <p className="text-slate-200/90">ใช้ cursor-based pagination ผ่านพารามิเตอร์ <code className="rounded bg-white/10 px-1">cursor</code> และ <code className="rounded bg-white/10 px-1">limit</code>.</p>
                  <CodeBlock lang="bash" code={`# หน้าแรก
curl -s "https://api.ddce.go.th/v1/events?limit=20" -H "Authorization: Bearer <API_KEY>"

# หน้าถัดไป
curl -s "https://api.ddce.go.th/v1/events?limit=20&cursor=<NEXT_CURSOR>" -H "Authorization: Bearer <API_KEY>"`} />
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn>
              <Card id="webhooks" className="scroll-mt-24 border-white/10 bg-slate-900/60 backdrop-blur">
                <CardContent className="space-y-3 p-5">
                  <div className="mb-1 flex items-center gap-2 text-slate-100"><Network className="h-4 w-4" /> <b>Webhooks</b></div>
                  <p className="text-slate-200/90">เมื่อมีเหตุการณ์ใหม่/อัปเดต ระบบสามารถ POST ไปยัง URL ของคุณ พร้อมลายเซ็น HMAC-SHA256 ใน Header <code className="rounded bg-white/10 px-1">X-DDCE-Signature</code></p>
                  <CodeBlock lang="http" code={webhook} />
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn>
              <Card id="errors" className="scroll-mt-24 border-white/10 bg-slate-900/60 backdrop-blur">
                <CardContent className="space-y-3 p-5">
                  <div className="mb-1 flex items-center gap-2 text-slate-100"><ShieldAlert className="h-4 w-4" /> <b>รูปแบบ Error</b></div>
                  <p className="text-slate-200/90">ทุก error จะมีฟิลด์ <code className="rounded bg-white/10 px-1">error.code</code>, <code className="rounded bg-white/10 px-1">message</code>, <code className="rounded bg-white/10 px-1">status</code>, และ <code className="rounded bg-white/10 px-1">request_id</code></p>
                  <CodeBlock lang="json" code={errorJson} />
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn>
              <Card id="rate" className="scroll-mt-24 border-white/10 bg-slate-900/60 backdrop-blur">
                <CardContent className="space-y-3 p-5">
                  <div className="mb-1 flex items-center gap-2 text-slate-100"><Server className="h-4 w-4" /> <b>Rate Limit</b></div>
                  <p className="text-slate-200/90">ค่าเริ่มต้น: <b>60 requests/นาที ต่อ API Key</b> หากต้องการเพิ่มโควต้า โปรดติดต่อทีมงาน</p>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn>
              <Card id="security" className="scroll-mt-24 border-white/10 bg-slate-900/60 backdrop-blur">
                <CardContent className="space-y-3 p-5">
                  <div className="mb-1 flex items-center gap-2 text-slate-100"><ShieldAlert className="h-4 w-4" /> <b>ความปลอดภัย & ข้อควรระวัง</b></div>
                  <ul className="list-disc space-y-1 pl-5 text-slate-300">
                    <li>เก็บ API Key ฝั่งเซิร์ฟเวอร์เท่านั้น ห้ามฝังบน client/public repo</li>
                    <li>ใช้ HTTPS เสมอ และหมุนเวียน (rotate) Key เป็นระยะ</li>
                    <li>สำหรับ Webhooks ตรวจสอบลายเซ็น <code className="rounded bg-white/10 px-1">X-DDCE-Signature</code> ทุกครั้ง</li>
                  </ul>
                  <div className="pt-2">
                    <Link href="/introduction/contact" className="text-cyan-300 underline">ติดต่อทีมงาน / ขอเพิ่มโควต้า</Link>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </section>
      </div>

      {/* global helpers */}
      <style jsx global>{`
        html { scroll-behavior: smooth; }
        @keyframes grid-move { from { background-position: 0 0, 0 0; } to { background-position: 28px 28px, 28px 28px; } }
        @keyframes grain {
          0% { transform: translate(0,0); } 10% { transform: translate(-5%,-10%); }
          20% { transform: translate(-15%,5%); } 30% { transform: translate(7%,-25%); }
          40% { transform: translate(-5%,25%); } 50% { transform: translate(-15%,10%); }
          60% { transform: translate(15%,0%); } 70% { transform: translate(0%,15%); }
          80% { transform: translate(3%,35%); } 90% { transform: translate(-10%,10%); }
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
