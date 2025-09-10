// app/introduction/page.tsx
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "DDCE API — Introduction",
  description:
    "ศูนย์กลางเชื่อมต่อข้อมูลเหตุการณ์โรคและภัยสุขภาพฉุกเฉิน (DDCE API Portal)",
};

export default function IntroductionPage() {
  return (
    <main className="intro">
      {/* ===== Background ===== */}
      <div className="bg-aurora" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-noise" aria-hidden="true" />

      {/* ===== HERO (Split) ===== */}
      <header className="hero">
        <div className="hero-left">
          <span className="badge">DDCE API</span>
          <h1 className="title">
            เชื่อมต่อข้อมูลสุขภาพฉุกเฉิน
            <br />
            ได้อย่างปลอดภัยและเป็นมาตรฐาน
          </h1>
          <p className="lead">
            พอร์ทัล <strong>REST API</strong> สำหรับหน่วยงานและนักพัฒนา
            พร้อมระบบยืนยันตัวตน, ควบคุมสิทธิ์, บันทึกการใช้งาน และ
            <em> uptime</em> ระดับองค์กร
          </p>

          <div className="cta">
            <Link href="/login" className="btnPrimary">เริ่มใช้งาน</Link>
            <Link href="/register" className="btnGhost">สมัครใช้งาน</Link>
            <Link href="/docs" className="btnGhost subtle">เอกสาร API</Link>
          </div>

          <ul className="chips">
            <li className="chip with-ic"><span className="ic ic-lock" />OAuth2</li>
            <li className="chip with-ic"><span className="ic ic-json" />JSON</li>
            <li className="chip with-ic"><span className="ic ic-version" />Versioned API</li>
            <li className="chip with-ic"><span className="ic ic-uptime" />99.9% Uptime</li>
          </ul>
        </div>

        <aside className="hero-card">
          <div className="hero-card-head">
            <span className="dot" /><span className="dot" /><span className="dot" />
          </div>
          <div className="hero-card-body">
            <p className="hero-label">Quick Start (curl)</p>
            <pre className="code"><code>{`# รับ token (Client Credentials)
curl -X POST https://auth.ddce.go.th/oauth/token \\
  -u <CLIENT_ID>:<CLIENT_SECRET> \\
  -d "grant_type=client_credentials"

# เรียก API
curl -H "Authorization: Bearer <TOKEN>" \\
  https://api.ddce.go.th/v1/incidents`}</code></pre>

            <div className="mini-stats">
              <div><span className="v">99.9%</span><span className="k">Uptime</span></div>
              <div><span className="v">~120ms</span><span className="k">Latency</span></div>
              <div><span className="v">600/min</span><span className="k">Rate Limit</span></div>
            </div>
          </div>

          {/* Pulse line */}
          <svg className="pulse" viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="pulseG" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="var(--pri)" />
                <stop offset="1" stopColor="var(--acc)" />
              </linearGradient>
            </defs>
            <path
              d="M0 40 Q140 14 280 40 T560 40 T840 40 T1200 40"
              fill="none"
              stroke="url(#pulseG)"
              strokeWidth="2"
              className="pulsePath"
            />
          </svg>
        </aside>
      </header>

      {/* ===== VALUE PILLARS ===== */}
      <section className="pillars">
        {[
          {
            t: "ความปลอดภัยเชิงลึก",
            d: "Zero-Trust, OAuth2/Scopes, Audit Log, Rate limit + Retry-After",
            i: "shield",
          },
          {
            t: "มาตรฐานข้อมูล",
            d: "REST + JSON, Versioning, Pagination/Filtering, Idempotency-Key",
            i: "layers",
          },
          {
            t: "พร้อมใช้งานจริง",
            d: "รองรับ M-EBS, EBS, EBS Province • Sandbox/Production",
            i: "rocket",
          },
        ].map((x, i) => (
          <article className="pillar" key={`pillar-${i}`}>
            <span className={`ix ix-${x.i}`} aria-hidden="true" />
            <div>
              <h3>{x.t}</h3>
              <p>{x.d}</p>
            </div>
          </article>
        ))}
      </section>

      {/* ===== SYSTEMS ===== */}
      <section className="systems">
        <h2 className="sr-only">ระบบที่พร้อมเชื่อมต่อ</h2>
        <div className="system-grid">
          {[
            { t: "M-EBS", d: "Modernized Event-Based Surveillance ระดับประเทศ", i: "radar" },
            { t: "EBS", d: "Event-Based Surveillance ติดตามสัญญาณในพื้นที่", i: "activity" },
            { t: "EBS Province", d: "เชื่อมข้อมูลจังหวัดสู่ศูนย์กลางอย่างปลอดภัย", i: "map" },
          ].map((s, i) => (
            <article key={`sys-${i}`} className="card">
              <span className={`ic ic-${s.i}`} aria-hidden="true" />
              <div className="card-txt">
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
              <div className="tags">
                <span>REST</span><span>JSON</span><span>OAuth2</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ===== AUTH FLOWS (visual list) ===== */}
      <section className="flows">
        <h2>โฟลว์การยืนยันตัวตน</h2>
        <div className="flow-grid">
          {[
            { t: "Client Credentials", d: "ระบบ-ต่อ-ระบบ / เซิร์ฟเวอร์ฝั่งหลังบ้าน", i: "key" },
            { t: "Authorization Code", d: "แอปมีผู้ใช้ล็อกอิน • รองรับ PKCE", i: "user" },
            { t: "Scopes & Roles", d: "จำกัดสิทธิ์ตามงาน เช่น incidents.read / write", i: "scope" },
          ].map((f, i) => (
            <div className="flow" key={`flow-${i}`}>
              <span className={`ix ix-${f.i}`} aria-hidden="true" />
              <div>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ENDPOINTS (compact) ===== */}
      <section className="endpoints">
        <h2 className="sr-only">ตัวอย่าง Endpoints</h2>
        <div className="ep-grid">
          {[
            { m: "GET", e: "/v1/incidents", d: "เหตุการณ์ทั้งหมด (แบ่งหน้า)" },
            { m: "GET", e: "/v1/incidents/{id}", d: "รายละเอียดตาม ID" },
            { m: "POST", e: "/v1/incidents", d: "สร้างเหตุการณ์ (scope: incidents.write)" },
            { m: "GET", e: "/v1/signals", d: "สัญญาณจาก M-EBS/EBS" },
          ].map((x, i) => (
            <div className="ep" key={`ep-${i}`}>
              <span className={`badge-m ${x.m.toLowerCase()}`}>{x.m}</span>
              <div className="ep-main">
                <code className="path">{x.e}</code>
                <p className="desc">{x.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SAMPLE RESPONSE ===== */}
      <section className="sample">
        <div className="sample-head">
          <span className="tag with-ic"><span className="ic ic-json" />ตัวอย่าง JSON</span>
          <span className="envs">Prod: api.ddce.go.th • Sandbox: sandbox.ddce.go.th</span>
        </div>
        <pre className="code"><code>{`{
  "id": "INC-2025-004512",
  "type": "outbreak_signal",
  "reported_at": "2025-03-21T07:42:11Z",
  "location": { "province_code": "10", "province_name": "กรุงเทพมหานคร" },
  "source": "M-EBS",
  "severity": "high",
  "summary": "พบสัญญาณการเพิ่มขึ้นผิดปกติ",
  "links": { "self": "/v1/incidents/INC-2025-004512" }
}`}</code></pre>
      </section>

      {/* ===== POLICIES (accordion) ===== */}
      <section className="policies">
        <details>
          <summary>Security & Access</summary>
          <p>
            ใช้ OAuth 2.0 (Client Credentials / Authorization Code) พร้อม Scopes เฉพาะงาน,
            ตรวจสิทธิ์ทุกคำขอ, เก็บ Audit Log และป้องกันด้วย Rate Limit + Retry-After
          </p>
        </details>
        <details>
          <summary>Data & Governance</summary>
          <p>
            แยก Sandbox/Production, เวอร์ชัน API ชัดเจน (<code>/v1</code>), ข้อมูลส่วนบุคคลปกป้องด้วย
            role-based access และการปิดบังข้อมูลตามความเหมาะสม
          </p>
        </details>
        <details>
          <summary>Change Management</summary>
          <p>
            มี Changelog, ระยะเวลา Deprecation และการแจ้งเตือนล่วงหน้าเพื่อลดผลกระทบต่อระบบปลายทาง
          </p>
        </details>
      </section>

      {/* ===== FOOTER CTA ===== */}
      <footer className="foot">
        <p className="muted">
          Production: <code>https://api.ddce.go.th</code> • Sandbox: <code>https://sandbox.ddce.go.th</code>
        </p>
        <div className="cta">
          <Link href="/docs" className="btnGhost">เปิดเอกสาร API</Link>
          <Link href="/login" className="btnPrimary">เข้าใช้งาน</Link>
        </div>
      </footer>

      {/* ===== Styles ===== */}
      <style>{`
        .intro{
          --pri:#7b61ff; --acc:#4cd4ff; --bg:#0f1021;
          --panel:rgba(255,255,255,.06); --muted:#a8b2d1; --stroke:rgba(255,255,255,.12);
          color:#fff; background:var(--bg);
          min-height:100vh; position:relative; overflow:hidden;
          padding:34px 20px; display:grid; gap:28px;
        }
        /* Background */
        .bg-aurora{position:absolute; inset:-25%;
          background:
            radial-gradient(40% 34% at 18% 0%, rgba(123,97,255,.45), transparent 60%),
            radial-gradient(42% 34% at 82% 12%, rgba(76,212,255,.35), transparent 60%),
            radial-gradient(30% 30% at 50% 100%, rgba(67,233,123,.22), transparent 70%);
          filter:blur(70px); animation:float 28s ease-in-out infinite alternate;}
        .bg-grid{position:absolute; inset:0; opacity:.12; pointer-events:none;
          background-image:
            linear-gradient(to right, rgba(255,255,255,.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px);
          background-size:40px 40px; mask-image:radial-gradient(80% 70% at 50% 40%,#000 70%,transparent 100%);
          animation:grid 45s linear infinite;}
        .bg-noise{position:absolute; inset:0; opacity:.05;
          background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
          background-size:220px 220px;}
        @keyframes float{0%{transform:translate(0,0)}50%{transform:translate(-1.6%,1%)}100%{transform:translate(0,0)}}
        @keyframes grid{to{background-position:240px 180px, 240px 180px}}

        /* HERO split */
        .hero{max-width:1180px; margin:0 auto; position:relative; display:grid; gap:16px;
          grid-template-columns: 1.05fr .95fr; align-items:stretch;}
        @media(max-width:1000px){ .hero{grid-template-columns:1fr; gap:18px;} }
        .hero-left{display:grid; gap:14px; align-content:start}
        .badge{display:inline-block; background:rgba(255,255,255,.08); border:1px solid var(--stroke);
          padding:6px 12px; border-radius:999px; font-size:12px; backdrop-filter:blur(8px);}
        .title{font-size:clamp(28px,4vw,44px); font-weight:900; letter-spacing:.2px; line-height:1.15;}
        .lead{color:var(--muted); font-size:15px; max-width:640px}
        .cta{display:flex; gap:10px; flex-wrap:wrap}
        .btnPrimary{background:linear-gradient(135deg,var(--pri),var(--acc)); color:#0f1021; font-weight:800; padding:12px 16px; border-radius:12px; text-decoration:none; box-shadow:0 14px 28px rgba(123,97,255,.18);}
        .btnGhost{border:1px solid var(--stroke); color:#fff; padding:12px 16px; border-radius:12px; text-decoration:none; background:var(--panel); backdrop-filter:blur(8px);}
        .btnGhost.subtle{opacity:.85}
        .btnPrimary:hover,.btnGhost:hover{filter:brightness(1.08)}
        .chips{margin-top:6px; display:flex; gap:8px; flex-wrap:wrap; color:#cbd5ff; font-size:12px}
        .chip{background:var(--panel); border:1px solid var(--stroke); padding:6px 10px; border-radius:999px}
        .with-ic{display:inline-flex; align-items:center; gap:8px}

        .hero-card{position:relative; border:1px solid var(--stroke); background:rgba(7,10,30,.55);
          border-radius:16px; overflow:hidden; backdrop-filter:blur(10px); box-shadow:0 18px 36px rgba(0,0,0,.28)}
        .hero-card-head{display:flex; gap:6px; padding:10px 12px; border-bottom:1px solid var(--stroke); background:rgba(255,255,255,.04)}
        .hero-card-head .dot{width:8px; height:8px; border-radius:999px; background:linear-gradient(135deg,var(--pri),var(--acc))}
        .hero-card-body{padding:12px}
        .hero-label{font-size:12px; color:#cbd5ff; margin:0 0 6px}
        .code{margin:0; background:#0f1227; border:1px solid var(--stroke); border-radius:12px; padding:12px; font-size:12.5px; overflow-x:auto}
        .mini-stats{display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-top:10px}
        .mini-stats > div{background:var(--panel); border:1px solid var(--stroke); border-radius:10px; padding:10px; text-align:center}
        .mini-stats .v{display:block; font-weight:900; font-size:18px}
        .mini-stats .k{display:block; color:var(--muted); font-size:12px}
        .pulse{position:absolute; left:0; right:0; bottom:0; height:72px}
        .pulsePath{stroke-dasharray:12 16; animation:pulseAnim 7s linear infinite}
        @keyframes pulseAnim{to{stroke-dashoffset:-420}}

        /* Pillars */
        .pillars{max-width:1180px; margin:0 auto; display:grid; gap:12px; grid-template-columns:repeat(3,1fr)}
        @media(max-width:900px){ .pillars{grid-template-columns:1fr 1fr} }
        @media(max-width:620px){ .pillars{grid-template-columns:1fr} }
        .pillar{display:grid; grid-template-columns:auto 1fr; gap:12px; align-items:start;
          background:var(--panel); border:1px solid var(--stroke); border-radius:14px; padding:14px}
        .pillar h3{margin:0 0 4px; font-size:16px}
        .pillar p{margin:0; color:var(--muted); font-size:12.8px}

        /* Systems */
        .systems{max-width:1180px; margin:0 auto}
        .system-grid{display:grid; gap:12px; grid-template-columns:repeat(3,1fr)}
        @media(max-width:900px){ .system-grid{grid-template-columns:1fr 1fr} }
        @media(max-width:620px){ .system-grid{grid-template-columns:1fr} }
        .card{display:grid; grid-template-columns:auto 1fr; gap:12px; align-items:center;
          background:var(--panel); border:1px solid var(--stroke); padding:14px; border-radius:14px;
          transition:transform .18s, border .18s}
        .card:hover{transform:translateY(-3px); border-color:rgba(255,255,255,.22)}
        .card h3{margin:0 0 4px; font-size:16px}
        .card p{margin:0; color:var(--muted); font-size:12.5px}
        .tags{display:flex; gap:6px; margin-top:8px; grid-column:1 / -1}
        .tags span{font-size:11px; border:1px solid var(--stroke); padding:2px 8px; border-radius:999px; background:rgba(255,255,255,.06)}

        /* Auth flows */
        .flows{max-width:1180px; margin:0 auto; display:grid; gap:12px}
        .flows h2{font-size:16px; font-weight:900}
        .flow-grid{display:grid; gap:10px; grid-template-columns:repeat(3,1fr)}
        @media(max-width:900px){ .flow-grid{grid-template-columns:1fr 1fr} }
        @media(max-width:620px){ .flow-grid{grid-template-columns:1fr} }
        .flow{display:grid; grid-template-columns:auto 1fr; gap:12px; align-items:center; background:var(--panel); border:1px solid var(--stroke); border-radius:12px; padding:12px}
        .flow h3{margin:0 0 4px; font-size:14px}
        .flow p{margin:0; color:var(--muted); font-size:12.5px}

        /* Endpoints */
        .endpoints{max-width:1180px; margin:0 auto}
        .ep-grid{display:grid; gap:10px; grid-template-columns:repeat(4,1fr)}
        @media(max-width:1100px){ .ep-grid{grid-template-columns:1fr 1fr} }
        @media(max-width:620px){ .ep-grid{grid-template-columns:1fr} }
        .ep{display:flex; gap:10px; align-items:flex-start; background:var(--panel); border:1px solid var(--stroke); padding:12px; border-radius:12px}
        .badge-m{font-size:11px; padding:2px 8px; border-radius:999px; font-weight:800; color:#0f1021; white-space:nowrap}
        .badge-m.get{background:#43e97b}
        .badge-m.post{background:#f9d423}
        .ep-main .path{font-size:12.5px}
        .ep-main .desc{margin:2px 0 0; color:var(--muted); font-size:12px}

        /* Sample */
        .sample{max-width:1180px; margin:0 auto; display:grid; gap:8px}
        .sample-head{display:flex; justify-content:space-between; align-items:center; gap:10px}
        .tag{display:inline-flex; align-items:center; gap:8px; background:var(--panel); border:1px solid var(--stroke); padding:6px 10px; border-radius:999px; font-size:12px}
        .envs{color:#cbd5ff; font-size:12px}
        .sample .code{background:#0f1227; border:1px solid var(--stroke); border-radius:12px; padding:12px; font-size:12.5px; overflow-x:auto; margin:0}

        /* Policies (accordion) */
        .policies{max-width:1180px; margin:0 auto; display:grid; gap:10px}
        details{background:var(--panel); border:1px solid var(--stroke); border-radius:12px; padding:10px 12px}
        summary{cursor:pointer; font-weight:700; list-style:none}
        summary::-webkit-details-marker{display:none}
        details p{margin:8px 0 0; color:var(--muted); font-size:13px}

        /* Footer */
        .foot{text-align:center; display:grid; gap:10px}
        .muted{color:var(--muted)}
        .foot code{background:#121326; border:1px solid var(--stroke); padding:1px 6px; border-radius:6px}

        /* ICONS (SVG Data URIs) */
        .ic{display:inline-block; width:30px; height:30px; border-radius:10px}
        .ic-radar{background:
          radial-gradient(120% 120% at 0% 0%, rgba(123,97,255,.35), transparent 40%),
          url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='white' stroke-width='1.6' viewBox='0 0 24 24'><path d='M12 21a9 9 0 1 1 9-9'/><path d='M12 3v9l3 3'/></svg>") center/18px 18px no-repeat}
        .ic-activity{background:
          radial-gradient(120% 120% at 0% 0%, rgba(76,212,255,.35), transparent 40%),
          url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='white' stroke-width='1.6' viewBox='0 0 24 24'><path d='M2 12h4l2 7 4-14 2 7h6'/></svg>") center/18px 18px no-repeat}
        .ic-map{background:
          radial-gradient(120% 120% at 0% 0%, rgba(67,233,123,.35), transparent 40%),
          url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='white' stroke-width='1.6' viewBox='0 0 24 24'><path d='M9 3l-6 2v15l6-2 6 2 6-2V3l-6 2-6-2z'/></svg>") center/18px 18px no-repeat}

        /* Extra icon set for chips/flows/pillars */
        .ix{display:inline-block; width:26px; height:26px; border-radius:8px; background:#ffffff1a; border:1px solid var(--stroke)}
        .ix-shield{background:
          linear-gradient(135deg, rgba(123,97,255,.18), rgba(76,212,255,.12)),
          url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' stroke='white' fill='none' stroke-width='1.6' viewBox='0 0 24 24'><path d='M12 3l8 4v5c0 5-3 7-8 9-5-2-8-4-8-9V7l8-4z'/></svg>") center/16px 16px no-repeat}
        .ix-layers{background:
          linear-gradient(135deg, rgba(67,233,123,.18), rgba(76,212,255,.12)),
          url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' stroke='white' fill='none' stroke-width='1.6' viewBox='0 0 24 24'><path d='M12 3l9 4-9 4-9-4 9-4z'/><path d='M3 12l9 4 9-4'/><path d='M3 16l9 4 9-4'/></svg>") center/16px 16px no-repeat}
        .ix-rocket{background:
          linear-gradient(135deg, rgba(123,97,255,.18), rgba(67,233,123,.12)),
          url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' stroke='white' fill='none' stroke-width='1.6' viewBox='0 0 24 24'><path d='M5 19l4-1 10-10a3 3 0 0 0-4-4L5 14l-1 4z'/><path d='M15 9l-6 6'/></svg>") center/16px 16px no-repeat}
        .ix-key{background:
          linear-gradient(135deg, rgba(123,97,255,.18), rgba(76,212,255,.12)),
          url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' stroke='white' fill='none' stroke-width='1.6' viewBox='0 0 24 24'><circle cx='7' cy='12' r='3'/><path d='M10 12h10l-3 3 3 3'/></svg>") center/16px 16px no-repeat}
        .ix-user{background:
          linear-gradient(135deg, rgba(76,212,255,.18), rgba(123,97,255,.12)),
          url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' stroke='white' fill='none' stroke-width='1.6' viewBox='0 0 24 24'><circle cx='12' cy='8' r='4'/><path d='M4 20a8 8 0 0 1 16 0'/></svg>") center/16px 16px no-repeat}
        .ix-scope{background:
          linear-gradient(135deg, rgba(67,233,123,.18), rgba(76,212,255,.12)),
          url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' stroke='white' fill='none' stroke-width='1.6' viewBox='0 0 24 24'><circle cx='12' cy='12' r='9'/><path d='M12 3v6M21 12h-6M12 21v-6M3 12h6'/></svg>") center/16px 16px no-repeat}

        /* Small chips icons */
        .ic-lock{background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' stroke='white' fill='none' stroke-width='1.6' viewBox='0 0 24 24'><rect x='4' y='10' width='16' height='10' rx='2'/><path d='M8 10V7a4 4 0 0 1 8 0v3'/></svg>") center/16px 16px no-repeat; width:16px; height:16px}
        .ic-json{background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' stroke='white' fill='none' stroke-width='1.6' viewBox='0 0 24 24'><path d='M6 7c-2 2 2 4 0 6-2 2 2 4 0 6'/><path d='M18 7c2 2-2 4 0 6 2 2-2 4 0 6'/></svg>") center/16px 16px no-repeat; width:16px; height:16px}
        .ic-version{background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' stroke='white' fill='none' stroke-width='1.6' viewBox='0 0 24 24'><path d='M3 7h18M3 12h12M3 17h8'/></svg>") center/16px 16px no-repeat; width:16px; height:16px}
        .ic-uptime{background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' stroke='white' fill='none' stroke-width='1.6' viewBox='0 0 24 24'><path d='M3 12h5l2 5 4-10 2 5h5'/></svg>") center/16px 16px no-repeat; width:16px; height:16px}

        /* A11y helper */
        .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
      `}</style>
    </main>
  );
}
