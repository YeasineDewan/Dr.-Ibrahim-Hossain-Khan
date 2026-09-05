'use client';

import type { CSSProperties } from 'react';

/* =====================================================================
   CUSTOM 3D MEDICAL ILLUSTRATIONS — pure SVG, animated via CSS
   ===================================================================== */

const baseProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 200 200',
  width: '100%',
  height: '100%',
} as const;

const grad = (id: string, c1: string, c2: string) => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor={c1} />
      <stop offset="100%" stopColor={c2} />
    </linearGradient>
    <radialGradient id={`${id}-r`} cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor={c1} stopOpacity="0.9" />
      <stop offset="100%" stopColor={c2} stopOpacity="0.3" />
    </radialGradient>
  </defs>
);

/* ============ HEARTBEAT — animated ECG with beating heart ============ */
export function HeartbeatArt({ style }: { style?: CSSProperties }) {
  return (
    <svg {...baseProps} style={style} className="illust-svg heartbeat-svg">
      {grad('hb', '#14b8a6', '#6366f1')}
      {/* background grid */}
      <g opacity="0.15">
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={i * 40}
            y1="0"
            x2={i * 40}
            y2="200"
            stroke="#14b8a6"
            strokeWidth="0.5"
          />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={i * 40}
            x2="200"
            y2={i * 40}
            stroke="#14b8a6"
            strokeWidth="0.5"
          />
        ))}
      </g>
      {/* glowing pulse rings */}
      <circle cx="100" cy="100" r="40" fill="url(#hb-r)" className="pulse-ring pulse-ring-1" />
      <circle cx="100" cy="100" r="60" fill="url(#hb-r)" className="pulse-ring pulse-ring-2" />
      <circle cx="100" cy="100" r="80" fill="url(#hb-r)" className="pulse-ring pulse-ring-3" />
      {/* 3D heart shape */}
      <g className="heart-3d" filter="url(#hb-shadow)">
        <defs>
          <filter id="hb-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#14b8a6" floodOpacity="0.4" />
          </filter>
          <linearGradient id="heart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="60%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#a21caf" />
          </linearGradient>
        </defs>
        <path
          d="M100,150 C100,150 50,115 50,80 C50,60 65,50 80,50 C90,50 95,55 100,62 C105,55 110,50 120,50 C135,50 150,60 150,80 C150,115 100,150 100,150 Z"
          fill="url(#heart-fill)"
          className="heart-path"
        />
        {/* highlight */}
        <ellipse cx="80" cy="70" rx="14" ry="10" fill="#fff" opacity="0.4" />
        {/* ECG line across heart */}
        <path
          d="M55,80 L75,80 L82,65 L90,95 L98,55 L106,90 L114,75 L120,80 L150,80"
          stroke="#fff"
          strokeWidth="2"
          fill="none"
          className="ecg-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/* ============ LEAF FLOWING — integrative / wellness ============ */
export function LeafArt({ style }: { style?: CSSProperties }) {
  return (
    <svg {...baseProps} style={style} className="illust-svg leaf-svg">
      {grad('lf', '#10b981', '#06b6d4')}
      {/* flowing curves */}
      <path
        d="M20,140 Q60,100 80,120 T140,80 Q170,60 180,90"
        stroke="url(#lf)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        className="flow-curve flow-curve-1"
      />
      <path
        d="M20,160 Q70,130 100,150 T160,110 Q180,100 180,120"
        stroke="url(#lf)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        className="flow-curve flow-curve-2"
      />
      {/* 3D leaves */}
      <g className="leaf-3d leaf-1">
        <defs>
          <linearGradient id="leaf-fill-1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
        </defs>
        <path
          d="M60,80 Q90,30 130,50 Q120,90 60,80 Z"
          fill="url(#leaf-fill-1)"
          filter="url(#lf-shadow)"
        />
        <path d="M60,80 Q95,55 130,50" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.6" />
      </g>
      <defs>
        <filter id="lf-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#10b981" floodOpacity="0.5" />
        </filter>
      </defs>
      <g className="leaf-3d leaf-2">
        <path
          d="M110,130 Q150,90 170,120 Q150,150 110,130 Z"
          fill="url(#leaf-fill-1)"
          filter="url(#lf-shadow)"
        />
        <path
          d="M110,130 Q140,110 170,120"
          stroke="#fff"
          strokeWidth="0.8"
          fill="none"
          opacity="0.6"
        />
      </g>
      {/* particles */}
      <circle cx="40" cy="50" r="3" fill="#22c55e" className="leaf-particle p-1" />
      <circle cx="170" cy="40" r="2.5" fill="#10b981" className="leaf-particle p-2" />
      <circle cx="160" cy="170" r="3" fill="#06b6d4" className="leaf-particle p-3" />
    </svg>
  );
}

/* ============ FAMILY — three figures with heart ============ */
export function FamilyArt({ style }: { style?: CSSProperties }) {
  return (
    <svg {...baseProps} style={style} className="illust-svg family-svg">
      {grad('fm', '#3b9b91', '#0ea5e9')}
      {/* glowing ground */}
      <ellipse cx="100" cy="170" rx="80" ry="12" fill="url(#fm-r)" opacity="0.4" />
      {/* central heart */}
      <g className="family-heart">
        <defs>
          <linearGradient id="fh-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
        </defs>
        <path
          d="M100,90 C100,90 75,70 75,55 C75,45 82,40 90,40 C95,40 98,43 100,47 C102,43 105,40 110,40 C118,40 125,45 125,55 C125,70 100,90 100,90 Z"
          fill="url(#fh-fill)"
          filter="url(#fm-shadow)"
          className="heart-beat"
        />
      </g>
      <defs>
        <filter id="fm-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#3b9b91" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* three figures */}
      <g className="figure figure-1">
        <circle cx="50" cy="110" r="14" fill="#14b8a6" className="fig-head" />
        <rect x="40" y="124" width="20" height="36" rx="6" fill="#14b8a6" className="fig-body" />
        <rect x="40" y="160" width="8" height="14" rx="2" fill="#0d9488" />
        <rect x="52" y="160" width="8" height="14" rx="2" fill="#0d9488" />
      </g>
      <g className="figure figure-2">
        <circle cx="100" cy="100" r="18" fill="#0ea5e9" className="fig-head" />
        <rect x="86" y="118" width="28" height="46" rx="8" fill="#0ea5e9" className="fig-body" />
        <rect x="86" y="164" width="10" height="18" rx="3" fill="#0284c7" />
        <rect x="104" y="164" width="10" height="18" rx="3" fill="#0284c7" />
      </g>
      <g className="figure figure-3">
        <circle cx="150" cy="112" r="12" fill="#f59e0b" className="fig-head" />
        <rect x="141" y="124" width="18" height="34" rx="5" fill="#f59e0b" className="fig-body" />
        <rect x="141" y="158" width="7" height="14" rx="2" fill="#d97706" />
        <rect x="152" y="158" width="7" height="14" rx="2" fill="#d97706" />
      </g>
      {/* orbit around them */}
      <circle
        cx="100"
        cy="100"
        r="80"
        stroke="url(#fm)"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
        className="orbit-dashed"
      />
    </svg>
  );
}

/* ============ STETHOSCOPE — clinical / diagnostics ============ */
export function StethoArt({ style }: { style?: CSSProperties }) {
  return (
    <svg {...baseProps} style={style} className="illust-svg stetho-svg">
      {grad('st', '#174b78', '#3b9b91')}
      <g className="stetho-3d" filter="url(#st-shadow)">
        <defs>
          <linearGradient id="st-tube" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#174b78" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <radialGradient id="st-bell" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="60%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#1e293b" />
          </radialGradient>
          <filter id="st-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#174b78" floodOpacity="0.35" />
          </filter>
        </defs>
        {/* earpieces */}
        <circle cx="60" cy="40" r="8" fill="url(#st-bell)" className="ear-l" />
        <circle cx="140" cy="40" r="8" fill="url(#st-bell)" className="ear-r" />
        {/* tubes */}
        <path
          d="M60,48 C60,80 100,80 100,110"
          stroke="url(#st-tube)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M140,48 C140,80 100,80 100,110"
          stroke="url(#st-tube)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        {/* main tube */}
        <path
          d="M100,110 L100,140"
          stroke="url(#st-tube)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        {/* bell (chest piece) */}
        <circle cx="100" cy="160" r="22" fill="url(#st-bell)" className="bell" />
        <circle
          cx="100"
          cy="160"
          r="14"
          fill="none"
          stroke="#0f172a"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <circle cx="94" cy="154" r="4" fill="#fff" opacity="0.6" />
      </g>
      {/* pulse dots emanating */}
      <circle
        cx="100"
        cy="160"
        r="28"
        stroke="#14b8a6"
        strokeWidth="1.5"
        fill="none"
        className="bell-pulse bp-1"
      />
      <circle
        cx="100"
        cy="160"
        r="38"
        stroke="#14b8a6"
        strokeWidth="1"
        fill="none"
        className="bell-pulse bp-2"
      />
    </svg>
  );
}

/* ============ PILL / MEDICINE — pharmacy ============ */
export function PillArt({ style, className }: { style?: CSSProperties; className?: string }) {
  return (
    <svg {...baseProps} style={style} className={`illust-svg pill-svg ${className || ''}`}>
      {grad('pl', '#a855f7', '#ec4899')}
      <g className="pill-3d" transform="translate(100 100) rotate(-30)" filter="url(#pl-shadow)">
        <defs>
          <linearGradient id="pl-l" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5f3ff" />
            <stop offset="100%" stopColor="#c4b5fd" />
          </linearGradient>
          <linearGradient id="pl-r" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#a21caf" />
          </linearGradient>
          <filter id="pl-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#a855f7" floodOpacity="0.4" />
          </filter>
        </defs>
        <rect
          x="-60"
          y="-22"
          width="60"
          height="44"
          rx="22"
          fill="url(#pl-l)"
          className="pill-left"
        />
        <rect
          x="0"
          y="-22"
          width="60"
          height="44"
          rx="22"
          fill="url(#pl-r)"
          className="pill-right"
        />
        {/* highlight */}
        <ellipse cx="-30" cy="-14" rx="18" ry="4" fill="#fff" opacity="0.6" />
        <ellipse cx="30" cy="-14" rx="18" ry="4" fill="#fff" opacity="0.3" />
      </g>
      {/* sparkle dots */}
      <circle cx="40" cy="40" r="3" fill="#a855f7" className="spark-dot s-1" />
      <circle cx="160" cy="50" r="2.5" fill="#ec4899" className="spark-dot s-2" />
      <circle cx="50" cy="160" r="3" fill="#c026d3" className="spark-dot s-3" />
      <circle cx="170" cy="160" r="2.5" fill="#a855f7" className="spark-dot s-4" />
    </svg>
  );
}

/* ============ SHIELD / SECURITY ============ */
export function ShieldArt({ style }: { style?: CSSProperties }) {
  return (
    <svg {...baseProps} style={style} className="illust-svg shield-svg">
      {grad('sh', '#3b9b91', '#0d9488')}
      <g className="shield-3d" filter="url(#sh-shadow)">
        <defs>
          <linearGradient id="sh-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5eead4" />
            <stop offset="50%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
          <filter id="sh-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#0d9488" floodOpacity="0.4" />
          </filter>
        </defs>
        <path
          d="M100,30 L160,50 L160,110 C160,140 130,165 100,175 C70,165 40,140 40,110 L40,50 Z"
          fill="url(#sh-fill)"
        />
        {/* check mark */}
        <path
          d="M70,100 L90,120 L130,80"
          stroke="#fff"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="check-stroke"
        />
        {/* highlight */}
        <path d="M50,55 Q100,40 150,55 L150,60 Q100,45 50,60 Z" fill="#fff" opacity="0.3" />
      </g>
    </svg>
  );
}

/* ============ CALENDAR / APPOINTMENT ============ */
export function CalendarArt({ style }: { style?: CSSProperties }) {
  return (
    <svg {...baseProps} style={style} className="illust-svg cal-svg">
      {grad('cl', '#0ea5e9', '#6366f1')}
      <g className="cal-3d" filter="url(#cl-shadow)">
        <defs>
          <linearGradient id="cl-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
          <linearGradient id="cl-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <filter id="cl-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#6366f1" floodOpacity="0.35" />
          </filter>
        </defs>
        {/* rings */}
        <rect x="55" y="35" width="6" height="22" rx="3" fill="#475569" />
        <rect x="139" y="35" width="6" height="22" rx="3" fill="#475569" />
        {/* body */}
        <rect x="35" y="50" width="130" height="115" rx="12" fill="url(#cl-body)" />
        {/* header */}
        <rect x="35" y="50" width="130" height="32" rx="12" fill="url(#cl-top)" />
        <rect x="35" y="68" width="130" height="14" fill="url(#cl-top)" />
        {/* grid dots */}
        {[60, 90, 120, 150].map(x =>
          [100, 125, 150].map(y => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#cbd5e1" className="cal-dot" />
          ))
        )}
        {/* highlighted date */}
        <circle cx="100" cy="100" r="9" fill="#14b8a6" className="cal-highlight" />
        <text
          x="100"
          y="105"
          textAnchor="middle"
          fill="#fff"
          fontSize="10"
          fontWeight="800"
          fontFamily="system-ui">
          18
        </text>
      </g>
    </svg>
  );
}

/* ============ HOURGLASS / TIME ============ */
export function HourglassArt({ style }: { style?: CSSProperties }) {
  return (
    <svg {...baseProps} style={style} className="illust-svg hg-svg">
      {grad('hg', '#f59e0b', '#ef4444')}
      <g className="hg-3d">
        <defs>
          <linearGradient id="hg-frame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="hg-sand-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="hg-sand-bot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
        </defs>
        {/* frame */}
        <path
          d="M55,30 L145,30 L145,40 L110,95 L145,160 L145,170 L55,170 L55,160 L90,95 L55,40 Z"
          fill="url(#hg-frame)"
          stroke="#92400e"
          strokeWidth="2"
        />
        {/* sand top */}
        <path d="M65,38 L135,38 L100,90 Z" fill="url(#hg-sand-top)" className="sand-top" />
        {/* sand bottom */}
        <path d="M65,162 L135,162 L100,100 Z" fill="url(#hg-sand-bot)" className="sand-bot" />
        {/* falling stream */}
        <line
          x1="100"
          y1="95"
          x2="100"
          y2="120"
          stroke="#f59e0b"
          strokeWidth="2"
          className="sand-stream"
        />
      </g>
    </svg>
  );
}

/* ============ DOCTOR / PROFESSIONAL ============ */
export function DoctorArt({ style }: { style?: CSSProperties }) {
  return (
    <svg {...baseProps} style={style} className="illust-svg doc-svg">
      {grad('dc', '#0ea5e9', '#14b8a6')}
      <g className="doc-3d">
        <defs>
          <linearGradient id="dc-coat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <radialGradient id="dc-face" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#fde2c8" />
            <stop offset="100%" stopColor="#f4c794" />
          </radialGradient>
        </defs>
        {/* body / coat */}
        <path
          d="M55,170 L55,130 Q55,100 100,100 Q145,100 145,130 L145,170 Z"
          fill="url(#dc-coat)"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
        {/* coat V */}
        <path d="M100,100 L80,140 L100,170 L120,140 Z" fill="#e2e8f0" />
        {/* tie */}
        <path d="M100,108 L95,135 L100,150 L105,135 Z" fill="#0ea5e9" />
        {/* stethoscope */}
        <path
          d="M75,120 Q70,140 90,145"
          stroke="#0f172a"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M125,120 Q130,140 110,145"
          stroke="#0f172a"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="100" cy="150" r="6" fill="#1e293b" stroke="#14b8a6" strokeWidth="2" />
        {/* head */}
        <circle cx="100" cy="65" r="28" fill="url(#dc-face)" stroke="#94a3b8" strokeWidth="1.5" />
        {/* hair */}
        <path
          d="M72,55 Q72,30 100,30 Q128,30 128,55 Q128,50 120,48 Q100,40 80,48 Q72,50 72,55 Z"
          fill="#1e293b"
        />
        {/* eyes */}
        <ellipse cx="91" cy="65" rx="2" ry="3" fill="#0f172a" />
        <ellipse cx="109" cy="65" rx="2" ry="3" fill="#0f172a" />
        {/* smile */}
        <path
          d="M92,78 Q100,84 108,78"
          stroke="#0f172a"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* blush */}
        <circle cx="85" cy="75" r="3" fill="#fb7185" opacity="0.5" />
        <circle cx="115" cy="75" r="3" fill="#fb7185" opacity="0.5" />
      </g>
      {/* floating sparkles */}
      <g className="doc-sparkles">
        <circle cx="35" cy="50" r="2.5" fill="#0ea5e9" className="ds ds-1" />
        <circle cx="170" cy="60" r="2" fill="#14b8a6" className="ds ds-2" />
        <circle cx="40" cy="155" r="2.5" fill="#0d9488" className="ds ds-3" />
        <circle cx="165" cy="150" r="2" fill="#0284c7" className="ds ds-4" />
      </g>
    </svg>
  );
}

/* ============ DNA / GENETICS ============ */
export function DnaArt({ style }: { style?: CSSProperties }) {
  return (
    <svg {...baseProps} style={style} className="illust-svg dna-svg">
      {grad('dn', '#6366f1', '#ec4899')}
      <g className="dna-3d">
        <defs>
          <linearGradient id="dn-a" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="dn-b" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>
        {Array.from({ length: 10 }).map((_, i) => {
          const y = 20 + i * 18;
          const offset = Math.sin((i / 10) * Math.PI * 4) * 25;
          return (
            <g key={i}>
              <line
                x1={100 - 25}
                y1={y}
                x2={100 + 25}
                y2={y}
                stroke="#cbd5e1"
                strokeWidth="1.5"
                opacity="0.6"
              />
              <circle cx={100 - 25 + offset} cy={y} r="4" fill="url(#dn-a)" />
              <circle cx={100 + 25 - offset} cy={y} r="4" fill="url(#dn-b)" />
            </g>
          );
        })}
        {/* backbone */}
        <path
          d="M75,20 Q100,40 75,60 Q100,80 75,100 Q100,120 75,140 Q100,160 75,180"
          stroke="url(#dn-a)"
          strokeWidth="2.5"
          fill="none"
          className="dna-strand-a"
        />
        <path
          d="M125,20 Q100,40 125,60 Q100,80 125,100 Q100,120 125,140 Q100,160 125,180"
          stroke="url(#dn-b)"
          strokeWidth="2.5"
          fill="none"
          className="dna-strand-b"
        />
      </g>
    </svg>
  );
}

/* ============ INFINITY / CONTINUITY ============ */
export function InfinityArt({ style }: { style?: CSSProperties }) {
  return (
    <svg {...baseProps} style={style} className="illust-svg inf-svg">
      {grad('inf', '#0ea5e9', '#14b8a6')}
      <g className="inf-3d">
        <defs>
          <linearGradient id="inf-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="50%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
        <path
          d="M50,100 C50,60 80,60 100,100 C120,140 150,140 150,100 C150,60 120,60 100,100 C80,140 50,140 50,100 Z"
          stroke="url(#inf-grad)"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          className="inf-stroke"
        />
        {/* dots on the line */}
        <circle cx="60" cy="85" r="3" fill="#0ea5e9" className="inf-dot d-1" />
        <circle cx="100" cy="100" r="4" fill="#14b8a6" className="inf-dot d-2" />
        <circle cx="140" cy="115" r="3" fill="#22c55e" className="inf-dot d-3" />
      </g>
    </svg>
  );
}

/* ============ STAR RATING ============ */
export function StarsArt({ style }: { style?: CSSProperties }) {
  return (
    <svg {...baseProps} style={style} className="illust-svg star-svg">
      {grad('st', '#fbbf24', '#f59e0b')}
      {Array.from({ length: 5 }).map((_, i) => {
        const x = 30 + i * 35;
        return (
          <g key={i} transform={`translate(${x} 100)`} className={`star-grp s-${i}`}>
            <defs>
              <linearGradient id={`st-fill-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <path
              d="M0,-22 L6,-7 L22,-5 L10,5 L14,21 L0,12 L-14,21 L-10,5 L-22,-5 L-6,-7 Z"
              fill={`url(#st-fill-${i})`}
              stroke="#d97706"
              strokeWidth="1"
              filter="url(#st-shadow)"
            />
          </g>
        );
      })}
      <defs>
        <filter id="st-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#f59e0b" floodOpacity="0.5" />
        </filter>
      </defs>
    </svg>
  );
}

/* ============ CHAT / MESSAGE ============ */
export function ChatArt({ style }: { style?: CSSProperties }) {
  return (
    <svg {...baseProps} style={style} className="illust-svg chat-svg">
      {grad('ch', '#0ea5e9', '#6366f1')}
      <g className="chat-3d" filter="url(#ch-shadow)">
        <defs>
          <linearGradient id="ch-bub" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dbeafe" />
            <stop offset="100%" stopColor="#bfdbfe" />
          </linearGradient>
          <filter id="ch-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0ea5e9" floodOpacity="0.4" />
          </filter>
        </defs>
        <path
          d="M30,60 L30,130 Q30,145 45,145 L75,145 L80,165 L105,145 L155,145 Q170,145 170,130 L170,60 Q170,45 155,45 L45,45 Q30,45 30,60 Z"
          fill="url(#ch-bub)"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
        <circle cx="70" cy="95" r="5" fill="#0ea5e9" className="chat-dot cd-1" />
        <circle cx="100" cy="95" r="5" fill="#0ea5e9" className="chat-dot cd-2" />
        <circle cx="130" cy="95" r="5" fill="#0ea5e9" className="chat-dot cd-3" />
      </g>
    </svg>
  );
}

/* ============ GLOBE / GLOBAL ============ */
export function GlobeArt({ style }: { style?: CSSProperties }) {
  return (
    <svg {...baseProps} style={style} className="illust-svg globe-svg">
      {grad('gl', '#06b6d4', '#0e7490')}
      <g className="globe-3d">
        <defs>
          <radialGradient id="gl-oce" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#0369a1" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="70" fill="url(#gl-oce)" filter="url(#gl-shadow)" />
        {/* meridians */}
        <ellipse
          cx="100"
          cy="100"
          rx="30"
          ry="70"
          stroke="#fff"
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
        <ellipse
          cx="100"
          cy="100"
          rx="60"
          ry="70"
          stroke="#fff"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />
        <line x1="100" y1="30" x2="100" y2="170" stroke="#fff" strokeWidth="1" opacity="0.5" />
        {/* continents */}
        <path
          d="M70,70 Q80,60 95,65 Q100,75 90,80 Q80,85 70,80 Z"
          fill="#22c55e"
          className="continent c-1"
        />
        <path
          d="M105,90 Q120,85 130,95 Q125,110 115,108 Q105,105 105,90 Z"
          fill="#22c55e"
          className="continent c-2"
        />
        <path
          d="M75,120 Q90,115 95,125 Q90,135 80,132 Q72,128 75,120 Z"
          fill="#22c55e"
          className="continent c-3"
        />
        {/* highlight */}
        <ellipse cx="80" cy="70" rx="20" ry="12" fill="#fff" opacity="0.3" />
      </g>
      <defs>
        <filter id="gl-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0e7490" floodOpacity="0.5" />
        </filter>
      </defs>
    </svg>
  );
}

/* ============ Map illustration — pin on map ============ */
export function MapPinArt({ style }: { style?: CSSProperties }) {
  return (
    <svg {...baseProps} style={style} className="illust-svg mappin-svg">
      {grad('mp', '#ef4444', '#be123c')}
      <g className="mappin-3d">
        <defs>
          <linearGradient id="mp-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
        </defs>
        {/* map background */}
        <rect x="20" y="40" width="160" height="120" rx="10" fill="#dbeafe" opacity="0.5" />
        <path
          d="M20,100 Q60,80 100,110 T180,100"
          stroke="#94a3b8"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />
        <path
          d="M40,40 L60,60 M100,40 L120,60 M140,40 L160,60"
          stroke="#94a3b8"
          strokeWidth="0.5"
          opacity="0.4"
        />
        {/* pin shadow */}
        <ellipse
          cx="100"
          cy="160"
          rx="14"
          ry="3"
          fill="#0f172a"
          opacity="0.2"
          className="pin-shadow"
        />
        {/* pin */}
        <g className="pin" filter="url(#mp-shadow)">
          <path
            d="M100,55 C80,55 70,70 70,85 C70,105 100,140 100,140 C100,140 130,105 130,85 C130,70 120,55 100,55 Z"
            fill="url(#mp-fill)"
          />
          <circle cx="100" cy="85" r="9" fill="#fff" />
          <circle cx="100" cy="85" r="4" fill="#be123c" />
        </g>
      </g>
      <defs>
        <filter id="mp-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#be123c" floodOpacity="0.5" />
        </filter>
      </defs>
    </svg>
  );
}

/* ============ ABSTRACT CUBE — for chamber / services ============ */
export function CubeArt({ style, hue = 0 }: { style?: CSSProperties; hue?: number }) {
  return (
    <svg {...baseProps} style={style} className="illust-svg cube-svg">
      {grad(`cu-${hue}`, `hsl(${hue}, 70%, 55%)`, `hsl(${(hue + 30) % 360}, 70%, 35%)`)}
      <g className="cube-3d-render" transform="translate(100 100)">
        <defs>
          <linearGradient id={`cu-top-${hue}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={`hsl(${hue}, 80%, 70%)`} />
            <stop offset="100%" stopColor={`hsl(${hue}, 70%, 50%)`} />
          </linearGradient>
          <linearGradient id={`cu-l-${hue}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={`hsl(${hue}, 70%, 50%)`} />
            <stop offset="100%" stopColor={`hsl(${hue}, 60%, 35%)`} />
          </linearGradient>
          <linearGradient id={`cu-r-${hue}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={`hsl(${hue}, 60%, 35%)`} />
            <stop offset="100%" stopColor={`hsl(${hue}, 50%, 25%)`} />
          </linearGradient>
        </defs>
        {/* top */}
        <path d="M0,-50 L45,-25 L0,0 L-45,-25 Z" fill={`url(#cu-top-${hue})`} />
        {/* left */}
        <path d="M-45,-25 L0,0 L0,55 L-45,30 Z" fill={`url(#cu-l-${hue})`} />
        {/* right */}
        <path d="M45,-25 L0,0 L0,55 L45,30 Z" fill={`url(#cu-r-${hue})`} />
      </g>
    </svg>
  );
}
