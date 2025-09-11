function EKG({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1600 260" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="ekg-g-1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4ea492" />
          <stop offset="1" stopColor="#89cdbd" />
        </linearGradient>
      </defs>
      <path d="M0,130 L120,130 170,60 210,200 250,130 420,130 460,58 500,202 540,130 820,130 860,60 900,200 940,130 1180,130 1220,58 1260,202 1300,130 1600,130"
        fill="none" stroke="url(#ekg-g-1)" strokeWidth={3}
        strokeLinecap="round" strokeLinejoin="round"
        className="[stroke-dasharray:12_18] motion-safe:[animation:ekgDash_6s_linear_infinite] opacity-60" />
      <path d="M0,130 L120,130 170,60 210,200 250,130 420,130 460,58 500,202 540,130 820,130 860,60 900,200 940,130 1180,130 1220,58 1260,202 1300,130 1600,130"
        fill="none" stroke="#cfeee5" strokeWidth={5}
        strokeLinecap="round" strokeLinejoin="round"
        className="blur-sm [stroke-dasharray:12_18] motion-safe:[animation:ekgDash_6s_linear_infinite] opacity-30" />
      <style>{`@keyframes ekgDash{to{stroke-dashoffset:-400}}`}</style>
    </svg>
  );
}
