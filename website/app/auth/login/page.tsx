'use client';

import React from 'react';
import Link from 'next/link';

const Page = () => {
  return (
    <main className="page">
      {/* ultra-light background */}
      <div className="bgGrid" aria-hidden="true" />
      {/* ตัวปิดทับด้านบน กันกรอบ/เงาโผล่ */}
      <div className="topCover" aria-hidden="true" />

      {/* CARD */}
      <section className="card" role="region" aria-label="ลงชื่อเข้าใช้ระบบ DDCE API">
        <div className="brand">
          <img src="/ddcelogo.png" alt="กองควบคุมโรคและภัยสุขภาพในภาวะฉุกเฉิน" />
        </div>

        <header className="head">
          <h1 className="title">ลงชื่อเข้าใช้ระบบ DDCE API</h1>
          <p className="subtitle">
            <strong>DDCE API</strong> ของกองควบคุมโรคและภัยสุขภาพในภาวะฉุกเฉิน
          </p>
        </header>

        <form className="form" method="post" action="/api/auth/login" noValidate>
          <div className="field withIcon">
            <input type="text" id="username" name="username" placeholder=" " autoComplete="username" required aria-required="true" />
            <label htmlFor="username">Username</label>
            <span className="i i-user" aria-hidden="true" />
          </div>

          <div className="field withIcon">
            <input type="password" id="password" name="password" placeholder=" " autoComplete="current-password" required aria-required="true" />
            <label htmlFor="password">รหัสผ่าน</label>
            <span className="i i-lock" aria-hidden="true" />
          </div>

          <div className="row">
            <label className="remember"><input type="checkbox" name="remember" /> จดจำฉันไว้</label>
            <Link href="/auth/forgetpass" className="link">ลืมรหัสผ่าน?</Link>
          </div>

          <button type="submit" className="btnPrimary">เข้าสู่ระบบ</button>
          <Link href="/auth/register" className="btnSecondary" role="button" aria-label="สมัครใช้งาน">
            สมัครใช้งาน (Register)
          </Link>
        </form>
      </section>

      <footer className="legal">
        <p>© DDCE 2025 • <Link href="/license">License</Link> • <Link href="/privacy">Privacy</Link> • <Link href="/terms">Terms</Link></p>
      </footer>

      <style>{`
/* Lock viewport */
html, body { height:100%; overflow:hidden; }
body { margin:0; }
:root { overscroll-behavior: none; }

/* Theme */
.page{
  --ink:#0f1f1a; --muted:#7a8a84; --line:#e9efec; --focus:#3aa089; --brand:#2d8e7b;
  --bg:#ffffff; --surface:#ffffff; --field:#ffffff;

  /* สีปุ่ม */
  --btn-g1:#2fb180; --btn-g2:#66d1a8; --btn-text:#ffffff;
  --btn-outline:#2fb180; /* ขอบปุ่มสมัคร */

  height:100dvh; min-height:100svh; overflow:hidden;
  display:grid; grid-template-rows:1fr auto; place-items:center;
  background:var(--bg); color:var(--ink); padding:32px 18px; position:relative;
}

/* Background */
.bgGrid{ position:absolute; inset:0; z-index:0; pointer-events:none; opacity:.06;
  background:
    radial-gradient(42vmax 28vmax at 10% -10%, rgba(52,143,124,.06), transparent 60%),
    radial-gradient(48vmax 32vmax at 90% 0%, rgba(52,143,124,.05), transparent 60%),
    linear-gradient(to right, transparent 49%, rgba(0,0,0,.6) 50%, transparent 51%),
    linear-gradient(to bottom, transparent 49%, rgba(0,0,0,.6) 50%, transparent 51%);
  background-size:auto, auto, 28px 28px, 28px 28px;
  mask-image: radial-gradient(90% 70% at 50% 40%, #000 58%, transparent 100%);
}

/* ปิดขอบบน */
.topCover{ position:absolute; top:0; left:0; right:0; height:28px; background:#fff; z-index:1; pointer-events:none; }

/* Card – กรอบคมชัดขึ้น */
.card{
  width:min(520px,92vw);
  border:2px solid transparent;                          /* ← กรอบหนาขึ้น */
  background:
    linear-gradient(#fff,#fff) padding-box,
    linear-gradient(135deg,#bfe9da,#e6f5f0) border-box;   /* ← ไล่สีกรอบ */
  border-radius:22px;
  padding:30px 24px 32px;
  position:relative; z-index:2;
  box-shadow:
    0 24px 48px rgba(16,36,30,.09),
    0 10px 18px rgba(16,36,30,.04);
  transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}
/* เส้น inner ขาว เพิ่มความคม */
.card::after{
  content:""; position:absolute; inset:0; border-radius:22px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.95);
  pointer-events:none;
}
.card:hover{
  transform:translateY(-1px);
  box-shadow:
    0 28px 56px rgba(16,36,30,.1),
    0 12px 22px rgba(16,36,30,.05);
}

/* Logo */
.brand{ display:grid; place-items:center; margin-bottom:10px; }
.brand img{ height:200px; width:auto; object-fit:contain; filter:drop-shadow(0 2px 6px rgba(0,0,0,.05)); }

/* Headings */
.head{ text-align:center; margin:10px 0 18px; }
.title{ font-size:24px; font-weight:800; letter-spacing:.1px; }
.subtitle{ color:var(--muted); font-size:13.75px; margin-top:8px; line-height:1.6; }
.subtitle strong{ color:var(--brand); font-weight:800; }

/* Form */
.form{ display:grid; gap:16px; }
.field{ position:relative; display:grid; }
.field input{
  width:100%; background:var(--field); border:1px solid var(--line); border-radius:12px;
  color:var(--ink); padding:16px 14px 12px 44px; font-size:14px; outline:none;
  transition:border .15s, box-shadow .15s, transform .08s;
  box-shadow: inset 0 1px 0 rgba(0,0,0,.015);
}
.field input::placeholder{ color:transparent; }
.field input:focus{ border-color:var(--focus); box-shadow:0 0 0 4px color-mix(in srgb, var(--focus) 16%, transparent); transform:translateY(-1px); }

.field label{
  position:absolute; left:42px; top:12px; font-size:13.25px; color:var(--muted);
  transform-origin:left top; background:linear-gradient(var(--field),var(--field)) padding-box;
  padding:0 6px; border-radius:6px; pointer-events:none; transition:transform .14s, color .14s;
}
.field:focus-within label, .field input:not(:placeholder-shown)+label{ transform:translateY(-12px) scale(.88); color:var(--brand); }

.withIcon .i{ position:absolute; left:12px; top:50%; transform:translateY(-50%); width:18px; height:18px; opacity:.5; }
.i-user{ background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' stroke='%2390a5a0' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='M12 14c2.8 0 5 2 5 4H1c0-2 2.2-4 5-4h6z'/><circle cx='8' cy='7' r='3.5'/></svg>") center/contain no-repeat; }
.i-lock{ background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' stroke='%2390a5a0' stroke-width='1.6'><rect x='3' y='8' width='12' height='7' rx='2'/><path d='M6 8V6a3 3 0 0 1 6 0v2'/></svg>") center/contain no-repeat; }

.row{ display:flex; align-items:center; justify-content:space-between; gap:8px; margin-top:2px; }
.remember{ display:flex; align-items:center; gap:10px; font-size:13px; color:var(--muted); }
.remember input{ width:16px; height:16px; accent-color:var(--focus); }
.link{ color:var(--brand); font-size:12.75px; text-decoration:none; }
.link:hover{ text-decoration:underline; }

/* Buttons */
.btnPrimary{
  width:100%; margin-top:6px; background:linear-gradient(135deg, var(--btn-g1), var(--btn-g2));
  color:var(--btn-text); border:none; padding:12px 14px; border-radius:12px; font-weight:700; letter-spacing:.2px;
  box-shadow:0 12px 22px rgba(47,177,128,.22), 0 1px 0 rgba(255,255,255,.4) inset;
  transition:transform .06s, filter .14s, box-shadow .18s;
}
.btnPrimary:hover{ filter:brightness(1.04); }
.btnPrimary:active{ transform:translateY(1px); }
.btnPrimary:focus-visible{ outline:3px solid color-mix(in srgb, var(--btn-g1) 38%, transparent); outline-offset:2px; }

/* ปุ่มสมัคร (Outlined + ขอบชัด) */
.btnSecondary{
  display:block; width:100%; margin-top:10px; text-align:center;
  font-weight:700; letter-spacing:.2px; padding:11px 14px; border-radius:12px;
  background:#fff;
  border:2px solid var(--btn-outline);                /* ← ขอบหนาและเขียว */
  color:var(--btn-outline);
  transition:background .14s, border-color .14s, box-shadow .14s, transform .06s, color .14s;
}
.btnSecondary:hover{
  background:color-mix(in srgb, var(--btn-outline) 8%, #fff);
  box-shadow:0 8px 14px rgba(47,177,128,.12);
}
.btnSecondary:active{ transform:translateY(1px); }
.btnSecondary:focus-visible{
  outline:3px solid color-mix(in srgb, var(--btn-outline) 35%, transparent);
  outline-offset:2px;
}

/* Footer */
.legal{ z-index:2; text-align:center; color:var(--muted); font-size:12.75px; margin:6px 0 4px; }
.legal a{ color:var(--brand); text-decoration:none; }
.legal a:hover{ text-decoration:underline; }

/* Responsive */
@media (max-width:540px){
  .brand img{ height:120px; }
  .title{ font-size:21px; }
}
      `}</style>
    </main>
  );
};

export default Page;
