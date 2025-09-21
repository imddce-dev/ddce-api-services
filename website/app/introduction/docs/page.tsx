"use client";

import React from "react";
import Link from "next/link";
import { navTree } from "./nav";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  BookOpen,
} from "lucide-react";

/* ============ Background ============ */
function AuroraBG() {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setOn(true), 60);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className={[
          "absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-out",
          on ? "opacity-95" : "opacity-0",
        ].join(" ")}
        style={{ backgroundImage: "url('/bgintroduction1.jpg')" }}
      />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_15%,rgba(34,211,238,.22),transparent_70%),radial-gradient(60%_40%_at_80%_0%,rgba(16,185,129,.16),transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background:linear-gradient(to_right,rgba(255,255,255,.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.25)_1px,transparent_1px)] bg-[size:26px_26px] [mask-image:radial-gradient(70%_70%_at_50%_35%,black,transparent)]" />
      </div>
      <div className="absolute -top-36 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute top-1/3 -left-28 h-[440px] w-[440px] rounded-full bg-emerald-300/10 blur-3xl" />
    </div>
  );
}

/* ============ Header / Progress ============ */
function FixedHeader() {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] border-b border-white/10 bg-black/45 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-2"
          aria-label="DDCE API – Home"
        >
          <BookOpen className="h-4 w-4 text-cyan-300" />
          <span className="text-sm font-semibold text-white group-hover:text-cyan-200 transition-colors">
            DDCE API Request
          </span>
        </Link>
        <nav className="hidden items-center gap-4 sm:flex">
          <Link
            className="text-slate-300 hover:text-white transition-colors"
            href="/introduction/docs"
          >
            Docs
          </Link>
          <Link
            className="text-slate-300 hover:text-white transition-colors"
            href="/introduction/contact"
          >
            Contact
          </Link>
          <Link
            href="/auth/register"
            className="rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-slate-100 hover:bg-white/20 transition"
          >
            สมัครใช้งาน
          </Link>
          <Link
            href="/auth/login"
            className="rounded-md bg-gradient-to-r from-cyan-500 to-emerald-500 px-3 py-1.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 transition"
          >
            Login
          </Link>
        </nav>
      </div>
    </div>
  );
}

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
        className=""
      />
    </div>
  );
}

/* ============ Primitives ============ */
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
        "transform-gpu transition-all duration-700 ease-out",
        on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
function Glass({
  className = "",
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur shadow-[0_10px_40px_-10px_rgba(0,0,0,.45)]",
        className,
      ].join(" ")}
      {...rest}
    />
  );
}
function Divider() {
  return (
    <div className="relative my-10">
      <div className="h-px w-full bg-white/10" />
      <div className="absolute inset-x-0 -top-[1px] mx-auto h-0.5 w-44 rounded-full bg-gradient-to-r from-cyan-400/60 via-sky-400/60 to-emerald-400/60 blur-[1px]" />
    </div>
  );
}
function CopyChip({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="relative mt-2 inline-flex items-center gap-2 rounded-md border border-white/10 bg-[#0a0f1e]/90 px-3 py-2 font-mono text-xs text-slate-200">
      <span>{code}</span>
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 900);
        }}
        className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/10 text-slate-100 hover:bg-white/20 active:scale-95 transition"
        aria-label="คัดลอก"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

/* ============ SideNav (Fixed, no fade on top) ============ */
const SECTIONS = [
  { id: "objectives", label: "วัตถุประสงค์" },
  { id: "getting-started", label: "เริ่มต้นใช้งาน" },
  { id: "standards", label: "มาตรฐาน" },
  { id: "token", label: "Token" },
  { id: "gov", label: "มาตรฐานภาครัฐ" },
];

const HEADER_OFFSET = 72;

function SideNav() {
  const [active, setActive] = React.useState(SECTIONS[0].id);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const linkRefs = React.useRef<Record<string, HTMLAnchorElement | null>>({});

  /* ScrollSpy */
  React.useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const io = new IntersectionObserver(
        (ents) => ents.forEach((e) => e.isIntersecting && setActive(s.id)),
        { rootMargin: "-40% 0px -50% 0px", threshold: 0.1 }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  /* keep active item in view */
  React.useEffect(() => {
    const el = linkRefs.current[active];
    const wrap = wrapRef.current;
    if (!el || !wrap) return;
    const top = el.offsetTop;
    const bottom = top + el.clientHeight;
    const viewTop = wrap.scrollTop;
    const viewBottom = viewTop + wrap.clientHeight;

    if (top < viewTop + 24) wrap.scrollTo({ top: Math.max(0, top - 24), behavior: "smooth" });
    else if (bottom > viewBottom - 24) wrap.scrollTo({ top: bottom - wrap.clientHeight + 24, behavior: "smooth" });
  }, [active]);

  /* deep-link on load */
  React.useEffect(() => {
    const hash = decodeURIComponent(location.hash.replace("#", ""));
    if (!hash) return;
    const el = document.getElementById(hash);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    setTimeout(() => window.scrollTo({ top: y, behavior: "auto" }), 20);
  }, []);

  /* click -> smooth scroll & set hash */
  const go = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  /* Mobile tabs */
  const MobileTabs = (
    <div className="md:hidden sticky top-[52px] z-40 -mx-6 mb-3 overflow-x-auto px-6 py-2 backdrop-blur">
      <nav className="flex gap-2" aria-label="สารบัญ (มือถือ)">
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={go(s.id)}
              className={[
                "whitespace-nowrap rounded-full px-3 py-1 text-xs transition-colors",
                isActive
                  ? "bg-white/15 text-white ring-1 ring-white/20"
                  : "bg-white/5 text-slate-300 hover:text-white",
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
        className="sticky top-24 hidden h-[calc(100vh-7rem)] w-[min(280px,28vw)] shrink-0 rounded-2xl
                   border border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-900/40
                   backdrop-blur md:flex md:flex-col shadow-[0_20px_60px_-20px_rgba(0,0,0,.6)]"
        aria-label="สารบัญ"
      >
        <div className="flex items-center gap-2 px-4 pb-2 pt-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl
                           bg-gradient-to-br from-cyan-500/25 to-emerald-500/25
                           ring-1 ring-white/10">
            <Sparkles className="h-4 w-4 text-cyan-300" />
          </span>
          <b className="text-slate-100">สารบัญ</b>
        </div>

        <div
          ref={wrapRef}
          className="
            relative mx-3 mb-3 overflow-y-auto rounded-xl p-2 pr-3 pt-3
            h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)]
            overscroll-contain
            /* ❌ เอา mask-image ที่ทำให้ด้านบนจางออก */
          "
        >
          {/* guideline (make brighter) */}
          <div className="" />

          <nav className="relative z-10 space-y-1 pl-8">
            {SECTIONS.map((s, idx) => {
              const isActive = active === s.id;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  ref={(el) => { linkRefs.current[s.id] = el; }}
                  onClick={go(s.id)}
                  className={[
                    "group relative block rounded-md px-2 py-2 text-sm transition-all",
                    isActive
                      ? "bg-white/12 text-white shadow-[0_0_0_1px_rgba(255,255,255,.06)_inset] backdrop-blur"
                      : "text-slate-300 hover:text-white hover:bg-white/6",
                  ].join(" ")}
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* index bullet */}
                  <span
                    className={[
                      "absolute -left-7 top-1/2 -translate-y-1/2 inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold",
                      isActive
                        ? "bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,.55)]"
                        : "bg-white/10 text-slate-300 group-hover:bg-white/20",
                    ].join(" ")}
                  >
                    {idx + 1}
                  </span>

                  {/* right glow bar on active */}
                  <span
                    className={[
                      "pointer-events-none absolute right-1 top-1/2 h-[2px] -translate-y-1/2 rounded-full transition-all",
                      isActive
                        ? "w-7 bg-gradient-to-r from-cyan-400/70 to-emerald-400/70"
                        : "w-0 bg-transparent",
                    ].join(" ")}
                  />
                  {s.label}
                </a>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
/* ============ Page ============ */
export default function DocsHome() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060913] text-slate-100">
      <AuroraBG />
      <FixedHeader />
      <ScrollProgress />

      {/* Hero ribbon */}
      <div className="relative z-10 pt-16">
        <div className="mx-auto max-w-6xl px-6 pt-10 md:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <div className="pointer-events-none absolute -left-16 -top-24 h-60 w-60 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-12 -bottom-20 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
            <FadeIn>
              <div className="mb-3 flex items-center gap-2">
                <Badge className="bg-cyan-600/20 text-cyan-300 ring-1 ring-inset ring-cyan-400/30">
                  Documentation
                </Badge>
                <Badge
                  variant="outline"
                  className="border-emerald-400/40 text-emerald-200"
                >
                  DDCE API Request
                </Badge>
              </div>
              <h1 className="text-balance text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
                DDCE API Request
              </h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-200/90">
                ระบบบริการข้อมูลเหตุการณ์โรคและภัยสุขภาพ (EBS) ของกรมควบคุมโรค
                โดยกลุ่มงาน IM — โปร่งใส ปลอดภัย นำไปต่อยอดได้ง่าย
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Content + SideNav (2 คอลัมน์) */}
        <section className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-[minmax(240px,280px)_minmax(0,1fr)] md:px-8">
          {/* LEFT: SideNav */}
      <SideNav />

          {/* RIGHT: Content */}
          <div>
            {/* Objectives */}
            <FadeIn className="mt-8">
              <Glass id="objectives" className="scroll-mt-24">
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  <b className="text-slate-100">วัตถุประสงค์ของระบบ</b>
                </div>
                <ul className="space-y-2 text-slate-200/90">
                  <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                    ให้บริการข้อมูล Event Based Surveillance
                  </li>
                  <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                    เชื่อมโยง/บูรณาการกับระบบอื่นได้สะดวก
                  </li>
                </ul>
              </Glass>
            </FadeIn>

            <Divider />

            {/* Getting started */}
            <FadeIn delay={60}>
              <Glass id="getting-started" className="scroll-mt-24">
                <div className="mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-cyan-300" />
                  <b className="text-slate-100">เริ่มต้นใช้งาน</b>
                </div>
                <ol className="relative space-y-4 pl-5">
                  {[
                    "สมัครสมาชิกผ่านหน้าเว็บไซต์",
                    "เข้าสู่ระบบ และกรอกคำขอ API (เพื่อขอ Token)",
                    "ขอรับ Token (อายุ 6 เดือน และขอใหม่ได้ตลอดเวลา)",
                    "เรียกใช้งาน API ด้วย Token ที่ได้รับอนุมัติ",
                  ].map((t, i) => (
                    <li key={i} className="relative">
                      <span className="absolute -left-5 top-2 h-2 w-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,.6)]" />
                      <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-200">
                        {i + 1}. {t}
                      </div>
                    </li>
                  ))}
                </ol>
              </Glass>
            </FadeIn>

            <Divider />

            {/* Standards – JSON only */}
            <FadeIn delay={90}>
              <Glass id="standards" className="scroll-mt-24">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-sky-300" />
                  <b className="text-slate-100">มาตรฐานการเรียกใช้งาน</b>
                </div>
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6">
                  <div className="mx-auto grid max-w-md place-items-center gap-3 text-center">
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-200">
                      Response Format
                    </span>
                    <div className="w-full rounded-xl border border-white/10 bg-[#0b1120]/80 p-6 shadow-inner">
                      <div className="text-3xl font-extrabold tracking-wide">
                        JSON Format
                      </div>
                      <p className="mt-2 text-sm text-slate-300">
                        ส่ง/รับข้อมูลในรูปแบบ{" "}
                        <code className="rounded bg-white/10 px-1">
                          application/json
                        </code>{" "}
                        เพื่อความเรียบง่ายและมาตรฐานเดียวกัน
                      </p>
                    </div>
                  </div>
                </div>
              </Glass>
            </FadeIn>

            <Divider />

            {/* Token */}
            <FadeIn delay={120}>
              <Glass id="token" className="scroll-mt-24">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-300" />
                  <b className="text-slate-100">การใช้งาน Token</b>
                </div>
                <p className="text-slate-200/90">แนบ Token ได้ 2 วิธี:</p>
                <ul className="mt-2 list-disc pl-6 text-slate-200/90">
                  <li>
                    URL Parameter:{" "}
                    <code className="rounded bg-white/10 px-1">
                      https://api.ddc.go.th/endpoint?token=your_token_here
                    </code>
                  </li>
                  <li className="mt-1">
                    Authorization Header:{" "}
                    <CopyChip code={`Authorization: Bearer your_token_here`} />
                  </li>
                </ul>
                <p className="mt-2 text-slate-300">
                  Token ที่ได้รับจะเข้าถึงได้เฉพาะ API ที่ผ่านการอนุมัติสิทธิ์แล้วเท่านั้น
                </p>
              </Glass>
            </FadeIn>

            <Divider />

            {/* Gov */}
            <FadeIn delay={150}>
              <Glass id="gov" className="scroll-mt-24">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-300" />
                  <b className="text-slate-100">มาตรฐานภาครัฐและความยั่งยืน</b>
                </div>
                <ul className="grid gap-2 sm:grid-cols-3">
                  {["มีมาตรฐาน", "ปลอดภัย", "ยั่งยืน"].map((x) => (
                    <li
                      key={x}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-slate-200"
                    >
                      {x}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/introduction/contact"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500/85 to-emerald-500/85 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 transition"
                >
                  ติดต่อทีมงาน / ขอเพิ่มโควต้า
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Glass>
            </FadeIn>

            {/* อ่านต่อ */}
            <FadeIn delay={200}>
              <Glass className="mt-8">
                <h3 className="mb-3 font-semibold text-slate-100">อ่านต่อ</h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {navTree.map((i) => (
                    <li key={i.id}>
                      <Link
                        className="group inline-flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-200 hover:bg-white/10 transition-colors"
                        href={i.href}
                      >
                        <span>{i.title}</span>
                        <ArrowRight className="h-4 w-4 text-cyan-300 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Glass>
            </FadeIn>

            <div className="h-24" />
          </div>
        </section>
      </div>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </main>
  );
}
