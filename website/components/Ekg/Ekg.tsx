function EKGs({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 2000 160"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute left-1/2 -translate-x-1/2 w-[200vw] max-w-none h-[120px] md:h-[140px] ${className}`}
    >
      <defs>
        <linearGradient id="ekg-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#34d399" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <style>
          {`
            @keyframes ekgDash {
              from {
                stroke-dashoffset: 90;
              }
              to {
                stroke-dashoffset: 0;
              }
            }
          `}
        </style>
      </defs>
      <path d="M0,130 L120,130 170,60 210,200 250,130 420,130 460,58 500,202 540,130 820,130 860,60 900,200 940,130 1180,130 1220,58 1260,202 1300,130 1600,130"
            fill="none" stroke="url(#ekg-g-1)" strokeWidth={3}
            strokeLinecap="round" strokeLinejoin="round"
            className="[stroke-dasharray:12_18] animate-ekg-custom opacity-60" /> 
      <path d="M0,130 L120,130 170,60 210,200 250,130 420,130 460,58 500,202 540,130 820,130 860,60 900,200 940,130 1180,130 1220,58 1260,202 1300,130 1600,130"
            fill="none" stroke="#cfeee5" strokeWidth={5}
            strokeLinecap="round" strokeLinejoin="round"
            className="blur-sm [stroke-dasharray:12_18] animate-ekg-custom opacity-30" /> 
    </svg>
  );
}
