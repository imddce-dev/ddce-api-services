import React from 'react';

function EKGs({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1600 260" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="ekg-g-1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4ea492" />
          <stop offset="1" stopColor="#89cdbd" />
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
            className="[stroke-dasharray:12_18] opacity-60" style={{ animation: 'ekgDash 6s linear infinite' }} /> 
      <path d="M0,130 L120,130 170,60 210,200 250,130 420,130 460,58 500,202 540,130 820,130 860,60 900,200 940,130 1180,130 1220,58 1260,202 1300,130 1600,130"
            fill="none" stroke="#cfeee5" strokeWidth={5}
            strokeLinecap="round" strokeLinejoin="round"
            className="blur-sm [stroke-dasharray:12_18] opacity-30" style={{ animation: 'ekgDash 6s linear infinite' }} /> 
    </svg>
  );
}
export default EKGs;