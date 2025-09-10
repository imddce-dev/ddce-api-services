import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ลงชื่อเข้าใช้",
  description: "ข้อมูล API ของกองควบคุมโรคและภัยสุขภาพในภาวะฉุกเฉิน",
};

export default function Page() {
  return (
    <main className="page">
      {/* ===== BG LAYERS ===== */}
      <div className="bgMesh" aria-hidden="true" />
      <div className="bgSheen" aria-hidden="true" />
      <div className="bgBands" aria-hidden="true" />
      <div className="bgSoft" aria-hidden="true" />
      <div className="bgIllustration" aria-hidden="true" />
      <div className="bgIcons" aria-hidden="true" />
      <div className="bgIcons bgIcons2" aria-hidden="true" />
      <div className="bgNoise" aria-hidden="true" />
      <div className="bgVignette" aria-hidden="true" />

      {/* ===== EKG ===== */}
      <svg
        className="ekg ekg-main"
        viewBox="0 0 1600 260"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ekg-g-1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--ph-primary)" />
            <stop offset="1" stopColor="var(--ph-accent)" />
          </linearGradient>
        </defs>
        <path
          className="path main"
          d="M0,130 L120,130 170,60 210,200 250,130
             420,130 460,58 500,202 540,130
             820,130 860,60 900,200 940,130
             1180,130 1220,58 1260,202 1300,130
             1600,130"
          fill="none"
          stroke="url(#ekg-g-1)"
        />
      </svg>
      <svg
        className="ekg ekg-glow"
        viewBox="0 0 1600 260"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ekg-g-2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--ph-primary-soft)" />
            <stop offset="1" stopColor="var(--ph-accent-soft)" />
          </linearGradient>
        </defs>
        <path
          className="path glow"
          d="M0,130 L120,130 170,60 210,200 250,130
             420,130 460,58 500,202 540,130
             820,130 860,60 900,200 940,130
             1180,130 1220,58 1260,202 1300,130
             1600,130"
          fill="none"
          stroke="url(#ekg-g-2)"
        />
      </svg>

      {/* ===== CARD ===== */}
      <section
        className="card"
        role="region"
        aria-label="ลงชื่อเข้าใช้ระบบ M-EBS"
      >

        <div className="cardLogo">
            <img
              src="/ddcelogo.png"
              alt="กองควบคุมโรคและภัยสุขภาพในภาวะฉุกเฉิน"
              className="logoImg"
            />
        </div>

        <header className="head">
          <h1 className="title">ลงชื่อเข้าใช้ระบบ DDCE API</h1>
          <p className="subtitle">
           <strong>ข้อมูล API</strong>{" "}
            ของกองควบคุมโรคและภัยสุขภาพในภาวะฉุกเฉิน
          </p>
        </header>

        {/* ===== FORM ===== */}
        <form
          className="form"
          method="post"
          action="/api/auth/login"
          noValidate
        >
          {/* Username */}
          <div className="field withIcon">
            <input
              type="Username"
              id="Username"
              name="Username"
              placeholder=" "
              autoComplete="Username"
              required
              aria-required="true"
            />
            <label htmlFor="email">Username</label>
            <span className="i i-mail" aria-hidden="true" />
          </div>

          {/* Password */}
          <div className="field withIcon">
            <input
              type="password"
              id="password"
              name="password"
              placeholder=" "
              autoComplete="current-password"
              required
              aria-required="true"
            />
            <label htmlFor="password" className="withLink">
              <span>รหัสผ่าน</span>
            </label>
            <span className="i i-lock" aria-hidden="true" />
          </div>
          {/* Remember */}
          <label className="remember">
            <input type="checkbox" name="remember" /> จดจำฉันไว้
            <Link href="/forgot-password" className="link">
              ลืมรหัสผ่าน?
            </Link>
          </label>
          {/* Actions */}
          <button type="submit" className="btnPrimary">
            เข้าสู่ระบบ
          </button>
          <Link
            href="/register"
            className="btnSecondary"
            role="button"
            aria-label="สมัครใช้งาน"
          >
            สมัครใช้งาน (Register)
          </Link>
        </form>
      </section>

      {/* ===== STYLES ===== */}
      <style>{`
        .page{
          --ph-bg:#ffffff;
          --ph-surface: rgba(255,255,255,.80);
          --ph-txt:#1f2d28;
          --ph-muted:#6f8079;
          --ph-stroke:#e8f3ef;
          --ph-primary:#4ea492;
          --ph-accent:#89cdbd;
          --ph-primary-soft:#cfeee5;
          --ph-accent-soft:#f0faf7;

          min-height:100vh;
          display:grid;
          place-items:center;
          padding:18px;
          color:var(--ph-txt);
          background:var(--ph-bg);
          position:relative;
          overflow:hidden;
        }

        /* ===== CARD ===== */
          .card {
            width: min(500px, 94vw);
            background: rgba(255, 255, 255, 0.95); /* ขาวชัดขึ้น */
            border: 2px solid color-mix(in srgb, var(--ph-primary) 20%, var(--ph-stroke)); /* ขอบหนาและสีชัดขึ้น */
            border-radius: 20px;
            box-shadow:
              0 8px 30px rgba(33, 69, 57, 0.12),  /* เงาหลัก */
              0 2px 10px rgba(33, 69, 57, 0.06),  /* เงาซ้อน */
              inset 0 1px 0 rgba(255, 255, 255, 0.4); /* เงา inner แบบ soft */
            padding: 24px 22px 26px;
            position: relative;
            z-index: 4;
            backdrop-filter: blur(12px) saturate(130%);
            transition: box-shadow 0.2s ease, transform 0.15s ease;
          }

        .cardAccent{
          position:absolute; left:12px; right:12px; top:10px; height:6px; border-radius:999px;
          background: linear-gradient(90deg, var(--ph-accent-soft), var(--ph-accent), var(--ph-accent-soft));
          background-size:200% 100%; animation: shimmer 12s linear infinite; opacity:.42;
        }
        @keyframes shimmer{from{background-position:0% 50%}to{background-position:200% 50%}}

        .cardLogo{ display:grid; place-items:center; margin-bottom: 6px; }
        .logoLink{ display:inline-block; line-height:0; }
        .logoImg{ height: 220px; width:auto; object-fit:contain; transition: transform .2s ease; }
        .logoImg:hover{ transform: scale(1.04); }

        .head{ text-align:center; margin: 4px 0 10px; }
        .title{ font-size: 24px; font-weight: 800; letter-spacing:.2px; }
        .subtitle{ color: var(--ph-muted); font-size: 13.5px; margin-top: 4px; }

        /* ===== NEW FIELDS ===== */
        .form{ display:grid; gap: 16px; }

        .field{
          position:relative;
          display:grid;
        }
        .field input,
        .field select{
          width:100%;
          background: rgba(255,255,255,.9);
          border:1px solid var(--ph-stroke);
          color:var(--ph-txt);
          border-radius:14px;
          padding: 18px 14px 12px 44px; /* เผื่อพื้นที่ icon + floating label */
          font-size:14px;
          outline:none;
          transition: border .16s ease, box-shadow .16s ease, background .16s ease, transform .08s ease;
          box-shadow: inset 0 1px 0 rgba(0,0,0,.02);
        }
        .field input::placeholder{ color:transparent; } /* ใช้ placeholder=" " สำหรับ floating */
        .field input:focus,
        .field select:focus{
          border-color: var(--ph-primary);
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--ph-primary) 18%, transparent);
          background:#fff;
        }

        /* Floating label */
        .field label{
          position:absolute; left:44px; top:14px;
          font-size: 13.5px; color: var(--ph-muted);
          transform-origin: left top;
          transition: transform .16s ease, color .16s ease, opacity .16s ease;
          pointer-events:none; user-select:none;
          background: linear-gradient(#fff,#fff) padding-box; /* แก้ label ซ้อนเส้นขอบ */
          padding: 0 4px;
        }

        /* float เมื่อโฟกัสหรือมีค่า */
        .field:focus-within label{
          transform: translateY(-12px) scale(.88);
          color: var(--ph-primary);
        }
        .field input:not(:placeholder-shown) + label{
          transform: translateY(-12px) scale(.88);
          color: var(--ph-muted);
        }

        /* with link (เช่น ลืมรหัสผ่าน) */
        .field label.withLink{
          right:12px; left:44px; display:flex; justify-content:space-between; align-items:center; gap:8px;
        }
        .field label.withLink span{ pointer-events:none; }
        .link{ color: var(--ph-primary); font-size:12.5px; text-decoration:none; }
        .link:hover{ text-decoration:underline; }

        /* ICONS */
        .withIcon .i{
          position:absolute; left:14px; top:50%; transform:translateY(-50%);
          width:18px; height:18px; opacity:.55;
        }
        .i-mail{ background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='%238fbdb1'><path d='M2 4h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm.8 1.8 6.2 4 6.2-4M2 13l4.8-3.2M16 13l-4.8-3.2'/></svg>") center/contain no-repeat; }
        .i-lock{ background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' stroke='%238fbdb1' stroke-width='1.6'><rect x='3' y='8' width='12' height='7' rx='2'/><path d='M6 8V6a3 3 0 0 1 6 0v2'/></svg>") center/contain no-repeat; }
        .i-org{  background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' stroke='%238fbdb1' stroke-width='1.6'><path d='M3 14h12M3 10h12M6 6h6'/><rect x='4' y='4' width='10' height='10' rx='2'/></svg>") center/contain no-repeat; }

        /* SELECT (Dropdown) */
        .field.isSelect select{
          appearance:none;
          padding-right: 42px; /* space for arrow */
          background-image:
            linear-gradient(45deg, transparent 50%, #9ac9bf 50%),
            linear-gradient(135deg, #9ac9bf 50%, transparent 50%);
          background-position:
            calc(100% - 22px) calc(50% - 5px),
            calc(100% - 16px) calc(50% - 5px);
            background-size:6px 6px, 6px 6px;
          background-repeat:no-repeat;
        }
        /* float label เมื่อ select มีค่า (ใช้ :has() ) */
        .field.isSelect:has(select:focus) label{
          transform: translateY(-12px) scale(.88);
          color: var(--ph-primary);
        }
        .field.isSelect:has(select:not([value=""])) label{
          transform: translateY(-12px) scale(.88);
          color: var(--ph-muted);
        }

        /* STATES */
        .field.invalid input,
        .field.invalid select{
          border-color:#e45b62;
          box-shadow:0 0 0 4px color-mix(in srgb, #e45b62 18%, transparent);
        }
        .field.invalid label{ color:#e45b62; }

        /* REMEMBER */
        .remember{ display:flex; align-items:center; gap:10px; font-size:13px; color: var(--ph-muted); }
        .remember input{ width:16px; height:16px; accent-color:var(--ph-primary); }

        /* BUTTONS */
        .btnPrimary{
          margin-top:2px;
          background: linear-gradient(135deg, var(--ph-primary), var(--ph-accent));
          color:#fff; border:none; padding:12px 14px;
          border-radius:12px; font-weight:700; letter-spacing:.2px; cursor:pointer;
          transition: transform .06s ease, box-shadow .18s ease, filter .18s ease;
          box-shadow: 0 12px 22px color-mix(in srgb, var(--ph-primary) 18%, transparent);
        }
        .btnPrimary:hover{ filter:brightness(1.05); }
        .btnPrimary:active{ transform:translateY(1px); }

        .btnGhost{
          background:#fff; color:var(--ph-txt);
          border:1px solid var(--ph-stroke);
          padding:10px 12px; border-radius:12px; cursor:pointer;
          transition: background .16s ease, border-color .16s ease, box-shadow .16s ease;
        }
        .btnGhost:hover{
          background: color-mix(in srgb, var(--ph-accent-soft) 22%, #ffffff);
          border-color: color-mix(in srgb, var(--ph-primary) 24%, var(--ph-stroke));
          box-shadow: 0 6px 14px rgba(50,70,60,.07);
        }

        .btnSecondary{
          display:block; text-align:center; font-weight:700; letter-spacing:.2px;
          padding:11px 14px; border-radius:12px; text-decoration:none; cursor:pointer;
          border:1px solid color-mix(in srgb, var(--ph-primary) 60%, var(--ph-stroke));
          color:var(--ph-primary); background:#fff;
          transition: background .16s ease, border-color .16s ease, box-shadow .16s ease, color .16s ease;
        }
        .btnSecondary:hover{
          background: color-mix(in srgb, var(--ph-accent-soft) 30%, #ffffff);
          border-color: color-mix(in srgb, var(--ph-primary) 70%, var(--ph-stroke));
          box-shadow: 0 6px 14px rgba(50,70,60,.07);
          color: color-mix(in srgb, var(--ph-primary) 90%, #1f2d28);
        }

        .divider{ display:grid; place-items:center; margin:10px 0; position:relative; color:var(--ph-muted); font-size:12px; }
        .divider::before{ content:""; position:absolute; inset:auto 0; top:50%; height:1px; background: var(--ph-stroke); }
        .divider span{ background: var(--ph-surface); padding:0 10px; position:relative; }
        .hint{ text-align:center; color: var(--ph-muted); font-size:12px; margin-top:4px; }

        /* ===== BG ===== */
        .bgMesh{position:absolute; inset:-20%;
          background:
            radial-gradient(32vmax 32vmax at 10% 20%, rgba(191,231,218,.18), transparent 60%),
            radial-gradient(38vmax 38vmax at 90% 15%, rgba(136,205,189,.14), transparent 60%),
            radial-gradient(30vmax 30vmax at 30% 90%, rgba(207,236,228,.12), transparent 60%);
          filter: blur(16px) saturate(102%);
          pointer-events:none; z-index:0; animation: meshFloat 36s ease-in-out infinite; will-change: transform;
        }
        @keyframes meshFloat{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(-1%,1%,0)}}
        .bgSheen{position:absolute; inset:-10%;
          background: conic-gradient(from 0deg at 30% 40%,
            rgba(137,205,189,.10), rgba(137,205,189,.02) 25%,
            rgba(191,231,218,.10) 50%, rgba(191,231,218,.02) 75%,
            rgba(137,205,189,.10) 100%);
          mix-blend-mode: soft-light; filter: blur(18px); opacity:.35; z-index:0;
          animation: sheenSpin 60s linear infinite; mask-image: radial-gradient(80% 80% at 50% 50%, #000 70%, transparent 100%);
        }
        @keyframes sheenSpin{0%{transform:rotate(0deg) scale(1.02)}100%{transform:rotate(360deg) scale(1.02)}}
        .bgBands{position:absolute; inset:-20%; opacity:.35; z-index:0;
          background: linear-gradient(135deg, transparent 0%, rgba(173,223,208,.14) 30%, transparent 50%, rgba(173,223,208,.12) 70%, transparent 100%);
          animation: bandDrift 40s ease-in-out infinite; mask-image: radial-gradient(85% 80% at 50% 50%, #000 70%, transparent 100%);
        }
        @keyframes bandDrift{0%{transform:translate3d(0,0,0)}50%{transform:translate3d(-3%,2%,0)}100%{transform:translate3d(0,0,0)}}
        .bgSoft{position:absolute; inset:0;
          background:
            radial-gradient(60vmax 40vmax at 90% 0%, rgba(191,231,218,.06), transparent 60%),
            radial-gradient(60vmax 50vmax at 0% 100%, rgba(240,251,247,.26), transparent 60%);
          pointer-events:none; z-index:0;
        }
        .bgIllustration{position:absolute; inset:0; z-index:1; pointer-events:none;
          background:url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'>\
<g fill='none' stroke='%23d7ebe6' stroke-width='2' opacity='0.14'>\
  <rect x='160' y='420' width='260' height='180' rx='8'/>\
  <path d='M160 420 h260 l-30 -40 h-200 z'/>\
  <rect x='230' y='460' width='40' height='60'/>\
  <rect x='310' y='460' width='40' height='60'/>\
  <rect x='270' y='520' width='60' height='80'/>\
  <path d='M550 330 a60 60 0 0 1 100 -40 a70 70 0 0 1 120 30 a60 60 0 0 1 50 80 a58 58 0 0 1 -58 42 h-182 a60 60 0 0 1 -30 -112'/>\
  <path d='M860 370 h140'/>\
  <circle cx='900' cy='370' r='6'/>\
  <circle cx='940' cy='370' r='6'/>\
</g></svg>") center 45%/1200px 800px no-repeat;
          mask-image: radial-gradient(80% 75% at 50% 46%, #000 75%, transparent 100%);
        }
        .bgIcons,.bgIcons.bgIcons2{position:absolute; inset:0; z-index:1; pointer-events:none;}
        .bgIcons{background-size:140px 140px; background-repeat:repeat; background-position:center 10%;
          opacity:.12; animation: iconsDrift 70s linear infinite;
          mask-image: radial-gradient(80% 75% at 50% 46%, #000 70%, transparent 100%);
          background-image:url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'>\
<g fill='none' stroke='%23e3efeb' stroke-width='1.1' stroke-linecap='round' opacity='0.40'>\
<path d='M20 30 h12 v-8 h8 v8 h12 v8 h-12 v8 h-8 v-8 h-12z'/>\
<path d='M10 85 h16 l6 -12 l8 28 l6 -10 h18'/>\
<path d='M96 22 l16 6 v12 c0 13 -8 24 -16 28 c-8 -4 -16 -15 -16 -28 V28 z'/>\
<path d='M92 92 c0 -8 6 -14 14 -14 c6 0 11 4 12 9 c6 0 10 5 10 10 c0 6 -5 10 -10 10 H94 c-6 0 -10 -4 -10 -10 z'/>\
</g></svg>");
        }
        .bgIcons.bgIcons2{background-size:180px 180px; animation-duration:100s; opacity:.09;
          mask-image: radial-gradient(88% 82% at 50% 48%, #000 62%, transparent 100%);
          background-image:url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'>\
<g fill='none' stroke='%23eff8f5' stroke-width='1.0' stroke-linecap='round' opacity='0.32'>\
<rect x='18' y='18' width='44' height='18' rx='4'/>\
<path d='M22 27 h10 M40 27 h18'/>\
</g></svg>");
        }
        @keyframes iconsDrift{0%{transform:translate(0,0)}50%{transform:translate(-16px,-10px)}100%{transform:translate(0,0)}}
        .bgNoise{position:absolute; inset:0; z-index:2; pointer-events:none; opacity:.04;
          background-image:url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'>\
<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter>\
<rect width='100%' height='100%' filter='url(%23n)' opacity='0.25'/></svg>");
          background-size:240px 240px;
        }
        .bgVignette{position:absolute; inset:0; z-index:3; pointer-events:none;
          background: radial-gradient(120% 100% at 50% 50%, transparent 55%, rgba(0,0,0,.06) 100%);
          mix-blend-mode:multiply; opacity:.25;
        }

        /* ===== EKG ===== */
        .ekg{position:absolute; left:-2%; right:-2%; width:104%; height:220px;
          top:50%; transform:translateY(-50%); pointer-events:none; z-index:1;
          mask-image: radial-gradient(58% 88% at 50% 50%, #000 58%, transparent 100%);
        }
        .ekg-main{opacity:.46;}
        .ekg-glow{opacity:.16; filter:blur(3.5px); transform:translateY(calc(-50% + 8px));}
        .ekg .path{stroke-linecap:round; stroke-linejoin:round; stroke-dasharray:12 18; animation:ekgDash 7.5s ease-in-out infinite;}
        .ekg .path.main{stroke-width:1.9;}
        .ekg .path.glow{stroke-width:4;}
        @keyframes ekgDash{0%{stroke-dashoffset:0}100%{stroke-dashoffset:-300}}

        /* Prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce){
          .bgMesh,.bgSheen,.bgBands,.bgIcons,.bgIcons.bgIcons2,.cardAccent,.ekg .path{animation:none!important;}
        }
        @media (max-width: 540px){
          .logoImg{ height: 200px; }
          .ekg{ height: 180px; }
        }
      `}</style>
    </main>
  );
}
