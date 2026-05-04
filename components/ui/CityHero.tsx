interface Props {
  citySlug: string;
  className?: string;
  variant?: "card" | "banner";
}

// Designed gradient + skyline silhouette per city — reliable, brand-consistent,
// no broken-image risk. Each city gets its own color story and silhouette.
const STYLES: Record<
  string,
  {
    from: string;
    to: string;
    accent: string;
    skyline: "highrise" | "old-city" | "port" | "desert" | "midcentury" | "garden" | "promenade" | "tower";
  }
> = {
  "tel-aviv":      { from: "#0F4C5C", to: "#1E7A8C", accent: "#F76B53", skyline: "highrise" },
  jerusalem:        { from: "#A66437", to: "#D8A05B", accent: "#F4D293", skyline: "old-city" },
  haifa:            { from: "#163E3B", to: "#2E7D6A", accent: "#9CD2BB", skyline: "port" },
  "beer-sheva":    { from: "#7A3E1D", to: "#C46B3A", accent: "#F4B273", skyline: "desert" },
  "rishon-lezion": { from: "#1F3A8A", to: "#3B5BB8", accent: "#F76B53", skyline: "midcentury" },
  "petah-tikva":   { from: "#2E5C2C", to: "#5A8E55", accent: "#C9DC9D", skyline: "garden" },
  ashdod:           { from: "#1B5980", to: "#3E8FBF", accent: "#F4B273", skyline: "port" },
  netanya:          { from: "#0E5C70", to: "#2D90A8", accent: "#F4D293", skyline: "promenade" },
  holon:            { from: "#3F2C5C", to: "#6E4FA0", accent: "#F76B53", skyline: "midcentury" },
  "ramat-gan":     { from: "#1A4D3D", to: "#317A65", accent: "#F4B273", skyline: "tower" },
};

export function CityHero({ citySlug, className, variant = "card" }: Props) {
  const style = STYLES[citySlug] ?? STYLES["tel-aviv"];
  return (
    <div
      className={`absolute inset-0 ${className ?? ""}`}
      aria-hidden
      style={{
        background: `linear-gradient(160deg, ${style.from} 0%, ${style.to} 100%)`,
      }}
    >
      {/* Sun / moon */}
      <div
        className="absolute size-24 md:size-32 rounded-full opacity-60 blur-2xl"
        style={{
          background: style.accent,
          top: variant === "banner" ? "20%" : "15%",
          insetInlineEnd: "12%",
        }}
      />
      {/* Skyline silhouette */}
      <Silhouette kind={style.skyline} />
      {/* Subtle grain */}
      <div className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

function Silhouette({ kind }: { kind: string }) {
  const fill = "rgba(0,0,0,0.32)";
  const accent = "rgba(0,0,0,0.55)";
  return (
    <svg
      viewBox="0 0 400 200"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-x-0 bottom-0 w-full h-2/3 pointer-events-none"
      aria-hidden
    >
      {kind === "highrise" && (
        <g>
          <rect x="0" y="120" width="400" height="80" fill={fill} />
          <rect x="20" y="80" width="28" height="120" fill={accent} />
          <rect x="60" y="60" width="22" height="140" fill={accent} />
          <rect x="92" y="100" width="34" height="100" fill={fill} />
          <rect x="140" y="40" width="26" height="160" fill={accent} />
          <polygon points="153,40 153,30 158,30 158,40" fill={accent} />
          <rect x="180" y="70" width="40" height="130" fill={accent} />
          <rect x="232" y="90" width="22" height="110" fill={fill} />
          <rect x="266" y="50" width="32" height="150" fill={accent} />
          <rect x="310" y="80" width="28" height="120" fill={accent} />
          <rect x="350" y="100" width="36" height="100" fill={fill} />
        </g>
      )}
      {kind === "old-city" && (
        <g>
          <rect x="0" y="120" width="400" height="80" fill={fill} />
          {/* Domes and walls */}
          <path d="M0 130 L80 130 L80 90 L120 90 L120 130 L200 130 L200 100 L240 100 L240 130 L400 130 L400 200 L0 200 Z" fill={accent} />
          <path d="M120 90 Q140 60 160 90" fill={accent} />
          <path d="M50 130 Q70 100 90 130" fill={accent} />
          <path d="M250 130 Q275 90 300 130" fill={accent} />
          <rect x="195" y="85" width="2" height="20" fill={accent} />
          <circle cx="196" cy="82" r="4" fill={accent} />
          {/* Crescent */}
          <rect x="150" y="40" width="2" height="22" fill="rgba(255,255,255,0.4)" />
        </g>
      )}
      {kind === "port" && (
        <g>
          <rect x="0" y="140" width="400" height="60" fill={fill} />
          {/* Mountain and port cranes */}
          <polygon points="0,140 80,60 160,140" fill={accent} />
          <polygon points="120,140 200,40 280,140" fill={accent} />
          <line x1="220" y1="140" x2="220" y2="80" stroke={accent} strokeWidth="3" />
          <line x1="220" y1="80" x2="280" y2="80" stroke={accent} strokeWidth="3" />
          <line x1="280" y1="80" x2="280" y2="100" stroke={accent} strokeWidth="3" />
          <line x1="320" y1="140" x2="320" y2="90" stroke={accent} strokeWidth="3" />
          <line x1="320" y1="90" x2="370" y2="90" stroke={accent} strokeWidth="3" />
          {/* Boat */}
          <path d="M40 160 L100 160 L90 175 L50 175 Z" fill={accent} />
        </g>
      )}
      {kind === "desert" && (
        <g>
          <path d="M0 160 Q100 120 200 150 T400 140 L400 200 L0 200 Z" fill={fill} />
          <path d="M0 175 Q120 145 240 170 T400 165 L400 200 L0 200 Z" fill={accent} />
          {/* Date palms */}
          <rect x="80" y="130" width="3" height="40" fill={accent} />
          <path d="M82 130 Q70 122 60 128 M82 130 Q94 122 104 128 M82 130 Q70 118 64 110 M82 130 Q94 118 100 110" stroke={accent} strokeWidth="2" fill="none" />
          <rect x="320" y="130" width="3" height="40" fill={accent} />
          <path d="M322 130 Q310 122 300 128 M322 130 Q334 122 344 128 M322 130 Q310 118 304 110 M322 130 Q334 118 340 110" stroke={accent} strokeWidth="2" fill="none" />
        </g>
      )}
      {kind === "midcentury" && (
        <g>
          <rect x="0" y="130" width="400" height="70" fill={fill} />
          {/* Bauhaus mid-rises */}
          <rect x="20" y="110" width="50" height="90" fill={accent} />
          <rect x="80" y="90" width="60" height="110" fill={accent} />
          <rect x="150" y="100" width="50" height="100" fill={fill} />
          <rect x="210" y="80" width="55" height="120" fill={accent} />
          <rect x="275" y="105" width="45" height="95" fill={accent} />
          <rect x="330" y="95" width="55" height="105" fill={fill} />
          {/* horizontal stripes (windows) */}
          <g opacity="0.25">
            <rect x="22" y="125" width="46" height="2" fill="white" />
            <rect x="22" y="140" width="46" height="2" fill="white" />
            <rect x="22" y="155" width="46" height="2" fill="white" />
            <rect x="82" y="105" width="56" height="2" fill="white" />
            <rect x="82" y="125" width="56" height="2" fill="white" />
            <rect x="82" y="145" width="56" height="2" fill="white" />
            <rect x="212" y="100" width="51" height="2" fill="white" />
            <rect x="212" y="120" width="51" height="2" fill="white" />
            <rect x="212" y="140" width="51" height="2" fill="white" />
          </g>
        </g>
      )}
      {kind === "garden" && (
        <g>
          <rect x="0" y="140" width="400" height="60" fill={fill} />
          {/* Trees */}
          {[40, 100, 180, 250, 320].map((x, i) => (
            <g key={i}>
              <rect x={x} y="120" width="3" height="30" fill={accent} />
              <circle cx={x + 1.5} cy="115" r={i % 2 === 0 ? 14 : 11} fill={accent} />
            </g>
          ))}
          {/* Buildings */}
          <rect x="60" y="100" width="35" height="50" fill={accent} />
          <rect x="200" y="90" width="40" height="60" fill={accent} />
          <rect x="280" y="100" width="35" height="50" fill={fill} />
        </g>
      )}
      {kind === "promenade" && (
        <g>
          {/* Sea gradient bottom */}
          <rect x="0" y="140" width="400" height="60" fill={accent} opacity="0.5" />
          <path d="M0 145 Q50 140 100 145 T200 145 T300 145 T400 145 L400 200 L0 200 Z" fill={fill} />
          {/* Hotels along promenade */}
          <rect x="40" y="80" width="32" height="60" fill={accent} />
          <rect x="100" y="60" width="34" height="80" fill={accent} />
          <rect x="160" y="70" width="36" height="70" fill={accent} />
          <rect x="240" y="50" width="38" height="90" fill={accent} />
          <rect x="320" y="75" width="34" height="65" fill={accent} />
          {/* Sun reflection */}
          <ellipse cx="200" cy="160" rx="60" ry="3" fill="white" opacity="0.25" />
        </g>
      )}
      {kind === "tower" && (
        <g>
          <rect x="0" y="130" width="400" height="70" fill={fill} />
          {/* Diamond exchange / tower district */}
          <rect x="160" y="40" width="32" height="160" fill={accent} />
          <polygon points="160,40 176,20 192,40" fill={accent} />
          <rect x="60" y="90" width="40" height="110" fill={accent} />
          <rect x="115" y="105" width="30" height="95" fill={fill} />
          <rect x="210" y="80" width="40" height="120" fill={accent} />
          <rect x="270" y="100" width="35" height="100" fill={fill} />
          <rect x="320" y="85" width="45" height="115" fill={accent} />
        </g>
      )}
    </svg>
  );
}
