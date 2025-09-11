'use client';

import React from 'react';
import Link from 'next/link';

// (ถ้าต้องใช้ Metadata ของ Next สามารถย้ายไฟล์นี้เป็น .tsx ใน app router แล้วเพิ่ม export metadata ได้ภายหลัง)

const page = () => {
  return (
    <main className="">
      {/* ===== CARD ===== */}
      <section className="card" role="region" aria-label="ลงชื่อเข้าใช้ระบบ DDCE API">
        <div className="cardLogo">
          <img src="/ddcelogo.png" alt="กองควบคุมโรคและภัยสุขภาพในภาวะฉุกเฉิน" className="logoImg" />
        </div>

        <header className="head">
          <h1 className="title">ลงชื่อเข้าใช้ระบบ DDCE API</h1>
          <p className="subtitle">
            <strong>DDCE API</strong> ของกองควบคุมโรคและภัยสุขภาพในภาวะฉุกเฉิน
          </p>
        </header>

        {/* ===== FORM ===== */}
        <form className="form" method="post" action="/api/auth/login" noValidate>
          {/* Username */}
          <div className="field withIcon">
            <input
              type="text"
              id="username"
              name="username"
              placeholder=" "
              autoComplete="username"
              required
              aria-required="true"
            />
            <label htmlFor="username">Username</label>
            <span className="i i-user" aria-hidden="true" />
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
          <div className="rememberRow">
            <label className="remember">
              <input type="checkbox" name="remember" /> จดจำฉันไว้
            </label>
            <Link href="/forgotpassword" className="link">
              ลืมรหัสผ่าน?
            </Link>
          </div>

          {/* Actions */}
          <button type="submit" className="btnPrimary">เข้าสู่ระบบ</button>
          <Link href="/register" className="btnSecondary" role="button" aria-label="สมัครใช้งาน">
            สมัครใช้งาน (Register)
          </Link>
        </form>
      </section>

      {/* ===== STYLES ===== */}
      <style>{`
/* = Base palette = */
.page{
  --ph-bg:#ffffff;
  --ph-surface: rgba(255,255,255,.84);
  --ph-txt:#1f2d28;
  --ph-muted:#6f8079;
  --ph-stroke:#e8f3ef;
  --ph-primary:#4ea492;
  --ph-accent:#89cdbd;
  --ph-primary-soft:#d8f2ea;
  --ph-accent-soft:#f3fbf8;

  min-height:100vh; display:grid; place-items:center;
  padding:18px; color:var(--ph-txt);
  background:var(--ph-bg); position:relative; overflow:hidden;

  animation: pageIn .5s ease-out both;
}

/* ===== CARD ===== */
.card{
  width:min(520px,94vw);
  background:var(--ph-surface);
  border:2px solid color-mix(in srgb, var(--ph-primary) 18%, var(--ph-stroke));
  border-radius:22px;
  box-shadow:
    0 12px 28px rgba(33,69,57,.10),
    0 2px 10px rgba(33,69,57,.05),
    inset 0 1px 0 rgba(255,255,255,.45);
  padding:24px 22px 26px;
  position:relative; z-index:6;
  backdrop-filter:blur(12px) saturate(126%);

  animation: cardIn .6s cubic-bezier(.2,.7,.2,1) .06s both;
}
.card:hover{ transform: translateY(-1px); transition: transform .18s ease; }

.cardLogo{ display:grid; place-items:center; margin-bottom: 4px; }
.logoImg{ height: 108px; width:auto; object-fit:contain; filter: drop-shadow(0 2px 6px rgba(0,0,0,.05)); }
.head{ text-align:center; margin:6px 0 12px; }
.title{ font-size:24px; font-weight:800; letter-spacing:.2px; }
.subtitle{ color:var(--ph-muted); font-size:13.5px; margin-top:4px; }
.subtitle strong{ color: color-mix(in srgb, var(--ph-primary) 86%, #144b43); }

/* ===== FORM ===== */
.form{ display:grid; gap:16px; }
.field{ position:relative; display:grid; }
.field input{
  width:100%; background: rgba(255,255,255,.97);
  border:1px solid var(--ph-stroke); color:var(--ph-txt);
  border-radius:14px; padding:18px 14px 12px 44px; font-size:14px; outline:none;
  transition:border .16s ease, box-shadow .16s ease, background .16s ease, transform .1s ease;
  box-shadow: inset 0 1px 0 rgba(0,0,0,.02);
}
.field input:focus{
  border-color:var(--ph-primary);
  box-shadow:0 0 0 4px color-mix(in srgb, var(--ph-primary) 16%, transparent);
  background:#fff; transform: translateY(-1px);
}
.field input::placeholder{ color:transparent; }
.field label{
  background: var(--ph-field-bg);
  padding: 0 6px;                 /* ให้เป็นแคปซูล */
  border-radius: 6px;             /* มุมมนเล็กน้อย */
  z-index: 1;                     /* กันโดนพื้นหลังกลืน */
}
.field:focus-within label,
.field input:not(:placeholder-shown)+label{ transform:translateY(-12px) scale(.88); }
.field:focus-within label{ color:var(--ph-primary); }
.field input:not(:placeholder-shown)+label{ color:var(--ph-muted); }

/* ไอคอนอินพุต */
.withIcon .i{ position:absolute; left:14px; top:50%; transform:translateY(-50%); width:18px; height:18px; opacity:.50; transition:opacity .2s ease; }
.field:focus-within .i{ opacity:.7; }
.i-user{ background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' stroke='%238fbdb1' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='M12 14c2.8 0 5 2 5 4H1c0-2 2.2-4 5-4h6z'/><circle cx='8' cy='7' r='3.5'/></svg>") center/contain no-repeat; }
.i-lock{ background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' stroke='%238fbdb1' stroke-width='1.6'><rect x='3' y='8' width='12' height='7' rx='2'/><path d='M6 8V6a3 3 0 0 1 6 0v2'/></svg>") center/contain no-repeat; }

/* Remember + ลิงก์ */
.rememberRow{ display:flex; align-items:center; justify-content:space-between; gap:8px; margin-top:2px; }
.remember{ display:flex; align-items:center; gap:10px; font-size:13px; color:var(--ph-muted); }
.remember input{ width:16px; height:16px; accent-color:var(--ph-primary); }
.link{ color:var(--ph-primary); font-size:12.5px; text-decoration:none; transition: color .15s ease; }
.link:hover{ text-decoration:underline; color: color-mix(in srgb, var(--ph-primary) 90%, #0a3); }

/* ปุ่ม */
.btnPrimary{
  margin-top:2px; background:linear-gradient(135deg, var(--ph-primary), var(--ph-accent));
  color:#fff; border:none; padding:12px 14px; border-radius:12px; font-weight:700; letter-spacing:.2px; cursor:pointer;
  transition: transform .08s, box-shadow .18s, filter .18s;
  box-shadow:0 12px 20px color-mix(in srgb, var(--ph-primary) 16%, transparent);
}
.btnPrimary:hover{ filter:brightness(1.045); }
.btnPrimary:active{ transform:translateY(1px); }
.btnSecondary{
  display:block; text-align:center; font-weight:700; letter-spacing:.2px; padding:11px 14px; border-radius:12px;
  border:1px solid color-mix(in srgb, var(--ph-primary) 52%, var(--ph-stroke));
  color:color-mix(in srgb, var(--ph-primary) 86%, #184c43); background:#fff;
  transition:background .16s, border-color .16s, box-shadow .16s, color .16s, transform .08s;
}
.btnSecondary:hover{
  background:color-mix(in srgb, var(--ph-accent-soft) 26%, #fff);
  border-color:color-mix(in srgb, var(--ph-primary) 62%, var(--ph-stroke));
  box-shadow:0 6px 12px rgba(50,70,60,.06);
}
.btnSecondary:active{ transform: translateY(1px); }

/* ===== BG base layers ===== */
.bgMesh{ position:absolute; inset:-20%;
  background:
    radial-gradient(32vmax 32vmax at 10% 20%, rgba(191,231,218,.12), transparent 60%),
    radial-gradient(38vmax 38vmax at 90% 15%, rgba(136,205,189,.10), transparent 60%),
    radial-gradient(30vmax 30vmax at 30% 90%, rgba(207,236,228,.10), transparent 60%);
  filter:blur(14px) saturate(102%); z-index:0; animation:meshFloat 36s ease-in-out infinite, bgFade .6s ease both;
}
@keyframes meshFloat{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(-1%,1%,0)}}

.bgSheen{ position:absolute; inset:-10%;
  background: conic-gradient(from 0deg at 30% 40%, rgba(137,205,189,.08), rgba(137,205,189,.02) 25%, rgba(191,231,218,.08) 50%, rgba(191,231,218,.02) 75%, rgba(137,205,189,.08) 100%);
  mix-blend-mode:soft-light; filter:blur(18px); opacity:.28; z-index:0; animation:sheenSpin 60s linear infinite, bgFade .8s ease .05s both;
  mask-image: radial-gradient(80% 80% at 50% 50%, #000 70%, transparent 100%);
}
@keyframes sheenSpin{ to{ transform:rotate(360deg) scale(1.02) } }

.bgBands{ position:absolute; inset:-20%; opacity:.28; z-index:0;
  background: linear-gradient(135deg, transparent 0%, rgba(173,223,208,.10) 30%, transparent 50%, rgba(173,223,208,.10) 70%, transparent 100%);
  animation:bandDrift 40s ease-in-out infinite, bgFade .8s ease .06s both; mask-image: radial-gradient(85% 80% at 50% 50%, #000 70%, transparent 100%);
}
@keyframes bandDrift{ 0%{transform:translate3d(0,0,0)} 50%{transform:translate3d(-3%,2%,0)} 100%{transform:translate3d(0,0,0)} }

.bgSoft{ position:absolute; inset:0; animation:bgFade .7s ease .04s both;
  background: radial-gradient(60vmax 40vmax at 90% 0%, rgba(191,231,218,.05), transparent 60%),
              radial-gradient(60vmax 50vmax at 0% 100%, rgba(240,251,247,.18), transparent 60%);
}

/* ภาพประกอบจางเดิม */
.bgIllustration{ position:absolute; inset:0; z-index:1; pointer-events:none; opacity:.12; animation:bgFade .9s ease .1s both;
  background:url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'>\
<g fill='none' stroke='%23d7ebe6' stroke-width='2' opacity='0.9'>\
  <rect x='160' y='420' width='260' height='180' rx='8'/>\
  <path d='M160 420 h260 l-30 -40 h-200 z'/>\
</g></svg>") center 45%/1200px 800px no-repeat;
  mask-image: radial-gradient(80% 75% at 50% 46%, #000 75%, transparent 100%);
}

/* ไอคอนพื้นหลังเจเนอริก */
.bgIcons,.bgIcons.bgIcons2{ position:absolute; inset:0; z-index:1; pointer-events:none; }
.bgIcons{
  background-size:140px 140px; background-repeat:repeat; background-position:center 10%;
  opacity:.10; animation: iconsDrift 70s linear infinite, bgFade .9s ease .12s both;
  mask-image: radial-gradient(80% 75% at 50% 46%, #000 70%, transparent 100%);
  background-image:url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'>\
<g fill='none' stroke='%23e3efeb' stroke-width='1.1' stroke-linecap='round' opacity='0.35'>\
<path d='M20 30 h12 v-8 h8 v8 h12 v8 h-12 v8 h-8 v-8 h-12z'/>\
</g></svg>");
}
.bgIcons.bgIcons2{ background-size:180px 180px; animation-duration:100s; opacity:.08; mask-image: radial-gradient(88% 82% at 50% 48%, #000 62%, transparent 100%); animation-name:iconsDrift,bgFade; animation-timing-function:linear,ease; animation-delay:0s,.14s; animation-fill-mode:none,both; }
@keyframes iconsDrift{ 0%{transform:translate(0,0)} 50%{transform:translate(-16px,-10px)} 100%{transform:translate(0,0)} }

/* ===== Public Health Patterns (ใหม่) ===== */
.ph{ position:absolute; inset:0; z-index:2; pointer-events:none; opacity:.16; filter:saturate(105%); }
.ph1{
  background-image:url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'>\
<g fill='none' stroke='%2389cdbd' stroke-width='1.2' opacity='.55'>\
<path d='M40 90 h20 v-20 h20 v20 h20 v20 h-20 v20 h-20 v-20 h-20z'/>\
<path d='M120 120 q10-20 25 0 q15-20 25 0'/>\
</g></svg>");
  background-size:220px 220px; animation: phDrift1 80s linear infinite;
  mask-image: radial-gradient(85% 80% at 50% 48%, #000 72%, transparent 100%);
}
.ph2{
  background-image:url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280' viewBox='0 0 280 280'>\
<g fill='none' stroke='%234ea492' stroke-width='1.2' opacity='.45'>\
<path d='M60 90 q0-26 22-26 t22 26 v28 q0 12-12 18 t-12 18'/>\
<path d='M190 120 l30 30 m-20-40 l30 30 m-40-20 l45-45'/>\
</g></svg>");
  background-size:280px 280px; animation: phDrift2 95s linear infinite reverse;
  opacity:.14; mask-image: radial-gradient(85% 80% at 50% 50%, #000 64%, transparent 100%);
}
.ph3{
  background-image:url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320' viewBox='0 0 320 320'>\
<g fill='none' stroke='%239ad9c9' stroke-width='1.2' opacity='.5'>\
<rect x='40' y='200' width='80' height='40' rx='8'/><circle cx='60' cy='245' r='10'/><circle cx='100' cy='245' r='10'/>\
<rect x='210' y='140' width='70' height='90' rx='6'/><path d='M245 150 v60 M230 180 h30'/>\
</g></svg>");
  background-size:320px 320px; animation: phDrift3 120s linear infinite;
  opacity:.13; mask-image: radial-gradient(90% 82% at 50% 50%, #000 68%, transparent 100%);
}
.ph4{
  background-image:url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260' viewBox='0 0 260 260'>\
<g fill='none' stroke='%238fd1c1' stroke-width='1.1' opacity='.38'>\
<path d='M80 40 q40 30 0 60 q-40 30 0 60 q40 30 0 60'/>\
<path d='M140 40 q-40 30 0 60 q40 30 0 60 q-40 30 0 60'/>\
</g></svg>");
  background-size:260px 260px; animation: phDrift4 110s linear infinite reverse;
  opacity:.11; mask-image: radial-gradient(90% 82% at 50% 48%, #000 62%, transparent 100%);
}

@keyframes phDrift1{ 0%{transform:translate(0,0)} 50%{transform:translate(-26px,-18px)} 100%{transform:translate(0,0)} }
@keyframes phDrift2{ 0%{transform:translate(0,0)} 50%{transform:translate(20px,-24px)} 100%{transform:translate(0,0)} }
@keyframes phDrift3{ 0%{transform:translate(0,0)} 50%{transform:translate(-28px,22px)} 100%{transform:translate(0,0)} }
@keyframes phDrift4{ 0%{transform:translate(0,0)} 50%{transform:translate(18px,18px)} 100%{transform:translate(0,0)} }

/* เกรน & วิญญาณขอบ */
.bgNoise{ position:absolute; inset:0; z-index:3; opacity:.035; animation:bgFade .9s ease .18s both;
  background-image:url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'>\
<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter>\
<rect width='100%' height='100%' filter='url(%23n)' opacity='0.25'/></svg>");
  background-size:240px 240px;
}
.bgVignette{ position:absolute; inset:0; z-index:5; pointer-events:none; animation:bgFade .9s ease .2s both;
  background: radial-gradient(120% 100% at 50% 50%, transparent 58%, rgba(0,0,0,.055) 100%);
  mix-blend-mode:multiply; opacity:.24;
}

/* ===== EKG: หนากว่า + วิ่งแน่นอน ===== */
.ekg{
  position:absolute; left:-2%; right:-2%; width:104%; height:300px;
  top:50%; transform:translateY(-50%); pointer-events:none; z-index:4;
  mask-image: radial-gradient(58% 88% at 50% 50%, #000 58%, transparent 100%);
}
.ekg .path{
  stroke-linecap:round; stroke-linejoin:round;
  stroke-dasharray:16 22;
  animation: ekgDash 1.6s linear infinite;
}
.ekg .path.main{
  stroke-width:3.5;
  filter: drop-shadow(0 0 6px rgba(78,164,146,.25));
}
.ekg .path.glow{
  stroke-width:6;
  opacity:.28; filter: blur(3px);
  animation: ekgDash 2.2s linear infinite;
}
@keyframes ekgDash{ to{ stroke-dashoffset:-38; } } /* 16+22 */

/* ===== Page/Background fades ===== */
@keyframes pageIn{ from{ opacity:0; transform:translateY(6px) } to{ opacity:1; transform:none } }
@keyframes cardIn{ from{ opacity:0; transform:translateY(10px) scale(.995) } to{ opacity:1; transform:none } }
@keyframes bgFade{ from{ opacity:0 } to{ opacity:1 } }

@media (prefers-reduced-motion: reduce){
  .bgMesh,.bgSheen,.bgBands,.bgIcons,.bgIcons.bgIcons2,.ph,.page,.card{ animation: none !important; }
}
@media (max-width:540px){
  .logoImg{ height:96px; }
  .ekg{ height:180px; }
}
      `}</style>
    </main>
  );
};

export default page;
