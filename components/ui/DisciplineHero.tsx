interface Props {
  color: string;
  slug: string;
  className?: string;
}

// Designed gradient panel per discipline. The visual is the brand pin_color
// rendered as an immersive abstract scene — ring, mat, silhouette — tuned per family.
const SCENES: Record<string, "ring" | "mat" | "octagon" | "tatami" | "open-hand" | "circle" | "default"> = {
  "krav-maga": "default",
  bjj: "mat",
  "muay-thai": "ring",
  boxing: "ring",
  mma: "octagon",
  judo: "tatami",
  karate: "tatami",
  taekwondo: "tatami",
  capoeira: "circle",
  aikido: "circle",
  "kung-fu": "circle",
  "tai-chi": "circle",
  wrestling: "mat",
  kickboxing: "ring",
  sambo: "mat",
  "jeet-kune-do": "open-hand",
  "wing-chun": "open-hand",
  "krav-panim": "default",
  fma: "open-hand",
  savate: "ring",
};

export function DisciplineHero({ color, slug, className }: Props) {
  const scene = SCENES[slug] ?? "default";
  // Derive a darker / lighter shade
  return (
    <div
      className={`absolute inset-0 ${className ?? ""}`}
      aria-hidden
      style={{
        background: `radial-gradient(ellipse at 30% 20%, ${color}f0 0%, ${color} 50%, ${shade(color, -25)} 100%)`,
      }}
    >
      <Scene kind={scene} />
      {/* Glow */}
      <div
        className="absolute size-48 rounded-full blur-3xl opacity-50"
        style={{ background: shade(color, 35), top: "-10%", insetInlineEnd: "-10%" }}
      />
      <div
        className="absolute size-40 rounded-full blur-3xl opacity-30"
        style={{ background: shade(color, -45), bottom: "-15%", insetInlineStart: "10%" }}
      />
      {/* Grain */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

function Scene({ kind }: { kind: string }) {
  const stroke = "rgba(255,255,255,0.18)";
  const fill = "rgba(255,255,255,0.12)";
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
      aria-hidden
    >
      {kind === "ring" && (
        <g>
          {/* Boxing ring ropes */}
          <line x1="40" y1="200" x2="360" y2="200" stroke={stroke} strokeWidth="3" />
          <line x1="40" y1="220" x2="360" y2="220" stroke={stroke} strokeWidth="3" />
          <line x1="40" y1="240" x2="360" y2="240" stroke={stroke} strokeWidth="3" />
          {/* Posts */}
          <rect x="38" y="190" width="6" height="80" fill={stroke} />
          <rect x="356" y="190" width="6" height="80" fill={stroke} />
          {/* Crowd silhouette */}
          <path d="M0 190 Q50 175 100 190 T200 190 T300 190 T400 190 L400 200 L0 200 Z" fill={fill} />
          {/* Spotlight */}
          <ellipse cx="200" cy="180" rx="180" ry="18" fill="white" opacity="0.06" />
        </g>
      )}
      {kind === "mat" && (
        <g>
          {/* Grappling mat grid */}
          <g opacity="0.18">
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={50 + i * 30} x2="400" y2={50 + i * 30} stroke="white" strokeWidth="1" />
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 35} y1="50" x2={i * 35} y2="290" stroke="white" strokeWidth="1" />
            ))}
          </g>
          {/* Center mat circle */}
          <circle cx="200" cy="170" r="60" fill="none" stroke={stroke} strokeWidth="2" />
          <circle cx="200" cy="170" r="40" fill="none" stroke={stroke} strokeWidth="2" />
        </g>
      )}
      {kind === "octagon" && (
        <g>
          <polygon
            points="200,40 320,90 360,180 320,270 200,300 80,270 40,180 80,90"
            fill="none"
            stroke={stroke}
            strokeWidth="3"
          />
          <polygon
            points="200,80 290,115 320,180 290,245 200,260 110,245 80,180 110,115"
            fill="none"
            stroke={stroke}
            strokeWidth="2"
            opacity="0.5"
          />
        </g>
      )}
      {kind === "tatami" && (
        <g>
          {/* Tatami mat lines */}
          <g opacity="0.22">
            <rect x="40" y="40" width="180" height="100" fill="none" stroke="white" strokeWidth="2" />
            <rect x="220" y="40" width="140" height="100" fill="none" stroke="white" strokeWidth="2" />
            <rect x="40" y="140" width="140" height="120" fill="none" stroke="white" strokeWidth="2" />
            <rect x="180" y="140" width="180" height="120" fill="none" stroke="white" strokeWidth="2" />
          </g>
          {/* Center circle */}
          <circle cx="200" cy="150" r="50" fill="none" stroke={stroke} strokeWidth="2" />
        </g>
      )}
      {kind === "open-hand" && (
        <g opacity="0.5">
          {/* Stylized open hand */}
          <path
            d="M180 100 L180 160 L150 160 L150 200 Q150 240 180 250 L240 250 Q280 250 280 210 L280 130 Q280 110 270 110 Q260 110 260 130 L260 90 Q260 75 250 75 Q240 75 240 90 L240 70 Q240 55 230 55 Q220 55 220 70 L220 95 Q220 80 210 80 Q200 80 200 95 L200 100 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="2"
          />
        </g>
      )}
      {kind === "circle" && (
        <g>
          {/* Concentric circles — yin-yang feel without symbolism */}
          <circle cx="200" cy="160" r="100" fill="none" stroke={stroke} strokeWidth="2" />
          <circle cx="200" cy="160" r="70" fill="none" stroke={stroke} strokeWidth="2" />
          <circle cx="200" cy="160" r="40" fill="none" stroke={stroke} strokeWidth="2" />
          <circle cx="200" cy="160" r="14" fill={stroke} />
        </g>
      )}
      {(kind === "default") && (
        <g opacity="0.6">
          {/* Abstract diagonal lines */}
          {Array.from({ length: 18 }).map((_, i) => (
            <line
              key={i}
              x1={-50 + i * 30}
              y1="0"
              x2={50 + i * 30}
              y2="300"
              stroke={stroke}
              strokeWidth="1"
            />
          ))}
        </g>
      )}
    </svg>
  );
}

function shade(hex: string, percent: number): string {
  const h = hex.replace("#", "");
  const num = parseInt(h, 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + Math.round(2.55 * percent)));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + Math.round(2.55 * percent)));
  const b = Math.max(0, Math.min(255, (num & 0xff) + Math.round(2.55 * percent)));
  return `rgb(${r}, ${g}, ${b})`;
}
