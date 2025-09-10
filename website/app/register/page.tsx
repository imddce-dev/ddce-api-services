import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "สมัครใช้งาน",
  description: "สมัครใช้งานระบบ DDCE API กองควบคุมโรคและภัยสุขภาพในภาวะฉุกเฉิน",
};

export default function RegisterPage() {
  return (
    <main className="page">
      {/* ===== BG Layers ===== */}
      <div className="bgMesh" />
      <div className="bgSheen" />
      <div className="bgBands" />
      <div className="bgSoft" />
      <div className="bgIllustration" />
      <div className="bgIcons" />
      <div className="bgIcons bgIcons2" />
      <div className="bgNoise" />
      <div className="bgVignette" />

      {/* ===== เส้นวิ่ง EKG ===== */}
      <svg className="ekg ekg-main" viewBox="0 0 1600 260" preserveAspectRatio="none">
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
      <svg className="ekg ekg-glow" viewBox="0 0 1600 260" preserveAspectRatio="none">
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

      {/* ===== CARD (no logo) ===== */}
      <section className="card">
        <header className="head">
          <h1 className="title">สมัครใช้งานระบบ DDCE API</h1>
          <p className="subtitle">
            กรอกข้อมูลให้ครบถ้วนเพื่อสร้างบัญชีใช้งานระบบ <strong>DDCE API</strong>
          </p>
        </header>

        <form className="form" method="post" action="/api/auth/register" noValidate>
          {/* Username */}
          <div className="field">
            <input
              id="username"
              name="username"
              type="text"
              placeholder=" "
              pattern="^[a-z0-9._-]{4,20}$"
              title="ใช้ a-z, 0-9, ., -, _ ความยาว 4–20 ตัวอักษร"
              required
              aria-required="true"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />
            <label htmlFor="username">ชื่อผู้ใช้ (username)</label>
          </div>

          {[
            { id: "fullname", label: "ชื่อ – นามสกุล", type: "text" },
            { id: "email", label: "อีเมล", type: "email" },
            { id: "phone", label: "เบอร์ติดต่อ", type: "tel" },
          ].map((f) => (
            <div key={f.id} className="field">
              <input
                id={f.id}
                name={f.id}
                type={f.type}
                placeholder=" "
                required
                {...(f.id === "email" ? { autoComplete: "email" } : {})}
                {...(f.id === "phone"
                  ? { inputMode: "numeric", pattern: "[0-9]{9,10}", title: "กรอกหมายเลข 9–10 หลัก" }
                  : {})}
              />
              <label htmlFor={f.id}>{f.label}</label>
            </div>
          ))}

          <div className="field isSelect">
            <select id="org" name="org" required defaultValue="">
              <option value="" disabled>
                เลือกหน่วยงาน
              </option>
              <option value="central">ส่วนกลาง</option>
              <option value="odpc">สคร. (ODPC)</option>
              <option value="ppho">สสจ. (PPHO)</option>
              <option value="hospital">โรงพยาบาล</option>
            </select>
            <label htmlFor="org">หน่วยงาน</label>
          </div>

          {[
            { id: "password", label: "รหัสผ่าน", type: "password" },
            { id: "confirm", label: "ยืนยันรหัสผ่าน", type: "password" },
          ].map((f) => (
            <div key={f.id} className="field">
              <input
                id={f.id}
                name={f.id}
                type={f.type}
                placeholder=" "
                required
                {...(f.id === "password"
                  ? { autoComplete: "new-password", minLength: 8, title: "อย่างน้อย 8 ตัวอักษร" }
                  : {})}
                {...(f.id === "confirm" ? { autoComplete: "new-password" } : {})}
              />
              <label htmlFor={f.id}>{f.label}</label>
            </div>
          ))}

          <label className="remember">
            <input type="checkbox" name="terms" required /> ยอมรับเงื่อนไขการใช้งานระบบ
          </label>

          <button type="submit" className="btnPrimary">
            สมัครใช้งาน
          </button>

          <div className="divider">
            <span>หรือ</span>
          </div>

          <p className="hint">
            มีบัญชีอยู่แล้ว? <Link href="/login" className="link">เข้าสู่ระบบที่นี่</Link>
          </p>
        </form>
      </section>

      <style>{`
        /* ===== THEME ===== */
        .page{
          --ph-bg:#ffffff; --ph-surface:rgba(255,255,255,.88);
          --ph-txt:#1f2d28; --ph-muted:#637b72;
          --ph-stroke:#e3efe9; --ph-stroke-strong:#c7e0d6;
          --ph-primary:#4ea492; --ph-accent:#89cdbd;
          --ph-primary-soft:#cfeee5; --ph-accent-soft:#f0faf7;
          min-height:100vh; display:grid; place-items:center;
          background:var(--ph-bg); position:relative; overflow:hidden; padding:20px; color:var(--ph-txt);
        }

        /* ===== CARD: ไม่มีโลโก้ + ยกตำแหน่งขึ้นเล็กน้อย ===== */
        .card{
          width:min(420px,92vw);
          background:var(--ph-surface);
          border:2px solid var(--ph-stroke-strong);
          border-radius:16px;
          padding:18px 22px 22px;
          position:relative; z-index:4;
          backdrop-filter:blur(10px) saturate(118%);
          box-shadow:0 16px 40px rgba(33,69,57,.08), 0 1px 0 rgba(137,205,189,.06) inset;
          transform: translateY(-4vh);                /* ย้ายการ์ดขึ้นจากกึ่งกลางนิดนึง */
        }

        .head{ text-align:center; margin: 2px 0 10px; }
        .title{ font-size:22px; font-weight:800; letter-spacing:.2px; }
        .subtitle{ color:var(--ph-muted); font-size:13px; margin-top:2px; }

        /* ===== FORM ===== */
        .form{ display:grid; gap:14px; }
        .field{ position:relative; }
        .field input,.field select{
          width:100%; padding:14px 12px 8px;
          border:1.5px solid var(--ph-stroke-strong);
          border-radius:12px; background:#fff; font-size:14px; outline:none;
          transition:border .16s ease, box-shadow .16s ease;
        }
        .field input:focus,.field select:focus{
          border-color: var(--ph-primary);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--ph-primary) 20%, transparent);
        }
        /* Floating label */
        .field label{
          position:absolute; left:12px; top:12px;
          font-size:13px; color:var(--ph-muted); background:#fff; padding:0 4px;
          transform-origin:left top; transition: transform .16s ease, color .16s ease; pointer-events:none;
        }
        .field input::placeholder{ color:transparent; }
        .field input:focus + label,
        .field input:not(:placeholder-shown) + label,
        .field select:focus + label,
        .field select:not([value=""]) + label{
          transform: translateY(-12px) scale(.9); color: var(--ph-primary);
        }

        /* Select arrow */
        .field.isSelect select{
          appearance:none; padding-right:36px;
          background:
            linear-gradient(45deg, transparent 50%, #83c6b8 50%),
            linear-gradient(135deg, #83c6b8 50%, transparent 50%);
          background-position: calc(100% - 20px) calc(50% - 5px), calc(100% - 14px) calc(50% - 5px);
          background-size:6px 6px; background-repeat:no-repeat;
        }

        .remember{ display:flex; align-items:center; gap:8px; font-size:13px; color:var(--ph-muted); }
        .btnPrimary{
          margin-top:2px; background:linear-gradient(135deg, var(--ph-primary), var(--ph-accent));
          color:#fff; border:none; padding:11px 14px; border-radius:10px; font-weight:700; cursor:pointer;
          transition:filter .18s, transform .08s; box-shadow:0 12px 20px color-mix(in srgb, var(--ph-primary) 20%, transparent);
        }
        .btnPrimary:hover{ filter:brightness(1.06); }
        .btnPrimary:active{ transform:translateY(1px); }

        .divider{ position:relative; text-align:center; font-size:12px; color:var(--ph-muted); margin:8px 0; }
        .divider::before{ content:""; position:absolute; left:0; right:0; top:50%; height:1px; background:var(--ph-stroke); }
        .divider span{ position:relative; background:var(--ph-surface); padding:0 8px; }

        .link{ color:var(--ph-primary); text-decoration:none; }
        .link:hover{ text-decoration:underline; }
        .hint{ text-align:center; font-size:12px; color:var(--ph-muted); }

        /* ===== EKG ===== */
        .ekg{ position:absolute; top:52%; left:-2%; width:104%; height:200px; transform:translateY(-50%); pointer-events:none; z-index:1; }
        .ekg-main{ opacity:.5; }
        .ekg-glow{ opacity:.2; filter:blur(3px); transform:translateY(calc(-50% + 5px)); }
        .path{ stroke-linecap:round; stroke-linejoin:round; stroke-dasharray:12 18; animation:ekgDash 6s linear infinite; }
        @keyframes ekgDash{ to { stroke-dashoffset:-400; } }

        /* ===== BG (ย่อ) ===== */
        .bgMesh{ position:absolute; inset:-20%;
          background:
            radial-gradient(32vmax 32vmax at 10% 20%, rgba(191,231,218,.18), transparent 60%),
            radial-gradient(38vmax 38vmax at 90% 15%, rgba(136,205,189,.14), transparent 60%),
            radial-gradient(30vmax 30vmax at 30% 90%, rgba(207,236,228,.12), transparent 60%);
          filter:blur(16px) saturate(102%); z-index:0; animation:meshFloat 36s ease-in-out infinite;
        }
        @keyframes meshFloat{ 0%,100%{transform:translate3d(0,0,0)} 50%{transform:translate3d(-1%,1%,0)} }
        .bgSheen{ position:absolute; inset:-10%;
          background: conic-gradient(from 0deg at 30% 40%, rgba(137,205,189,.10), rgba(137,205,189,.02) 25%, rgba(191,231,218,.10) 50%, rgba(191,231,218,.02) 75%, rgba(137,205,189,.10) 100%);
          mix-blend-mode:soft-light; filter:blur(18px); opacity:.35; z-index:0; animation:sheenSpin 60s linear infinite;
          mask-image: radial-gradient(80% 80% at 50% 50%, #000 70%, transparent 100%);
        }
        @keyframes sheenSpin{ to{ transform:rotate(360deg) scale(1.02) } }
        .bgBands{ position:absolute; inset:-20%; opacity:.35; z-index:0;
          background: linear-gradient(135deg, transparent 0%, rgba(173,223,208,.14) 30%, transparent 50%, rgba(173,223,208,.12) 70%, transparent 100%);
          animation:bandDrift 40s ease-in-out infinite; mask-image: radial-gradient(85% 80% at 50% 50%, #000 70%, transparent 100%);
        }
        @keyframes bandDrift{ 0%{transform:translate3d(0,0,0)} 50%{transform:translate3d(-3%,2%,0)} 100%{transform:translate3d(0,0,0)} }
        .bgSoft{ position:absolute; inset:0;
          background: radial-gradient(60vmax 40vmax at 90% 0%, rgba(191,231,218,.06), transparent 60%),
                      radial-gradient(60vmax 50vmax at 0% 100%, rgba(240,251,247,.26), transparent 60%);
          z-index:0;
        }
        .bgIllustration{ position:absolute; inset:0; z-index:1; pointer-events:none; opacity:.14;
          background:url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'>\
<g fill='none' stroke='%23d7ebe6' stroke-width='2' opacity='0.9'>\
  <rect x='160' y='420' width='260' height='180' rx='8'/>\
  <path d='M160 420 h260 l-30 -40 h-200 z'/>\
</g></svg>") center 45%/1200px 800px no-repeat;
          mask-image: radial-gradient(80% 75% at 50% 46%, #000 75%, transparent 100%);
        }
        .bgIcons,.bgIcons2{ position:absolute; inset:0; z-index:1; pointer-events:none; }
        .bgIcons{
          background-size:140px 140px; background-repeat:repeat; background-position:center 10%;
          opacity:.12; animation: iconsDrift 70s linear infinite;
          mask-image: radial-gradient(80% 75% at 50% 46%, #000 70%, transparent 100%);
          background-image:url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'>\
<g fill='none' stroke='%23e3efeb' stroke-width='1.1' stroke-linecap='round' opacity='0.40'>\
<path d='M20 30 h12 v-8 h8 v8 h12 v8 h-12 v8 h-8 v-8 h-12z'/>\
</g></svg>");
        }
        .bgIcons2{
          background-size:180px 180px; animation-duration:100s; opacity:.09;
          mask-image: radial-gradient(88% 82% at 50% 48%, #000 62%, transparent 100%);
        }
        @keyframes iconsDrift{ 0%{transform:translate(0,0)} 50%{transform:translate(-16px,-10px)} 100%{transform:translate(0,0)} }
        .bgNoise{ position:absolute; inset:0; z-index:2; opacity:.04;
          background-image:url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'>\
<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter>\
<rect width='100%' height='100%' filter='url(%23n)' opacity='0.25'/></svg>");
          background-size:240px 240px;
        }
        .bgVignette{ position:absolute; inset:0; z-index:3; pointer-events:none;
          background: radial-gradient(120% 100% at 50% 50%, transparent 55%, rgba(0,0,0,.06) 100%);
          mix-blend-mode:multiply; opacity:.25;
        }

        @media (prefers-reduced-motion: reduce){
          .bgMesh,.bgSheen,.bgBands,.bgIcons,.bgIcons2,.path{ animation:none!important; }
          .card{ transform:none; }
        }
        @media (max-width:540px){
          .ekg{ height:180px; }
          .card{ width:min(92vw, 420px); transform: translateY(-2vh); }
        }
      `}</style>
    </main>
  );
}
