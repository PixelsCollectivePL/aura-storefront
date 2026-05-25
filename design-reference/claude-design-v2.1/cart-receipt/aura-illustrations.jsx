/* Aura — illustration primitives.
   ORIGINAL geometric stand-ins for the brand's character illustrations.
   These are NOT recreations of the brand-board artwork — they are
   placeholder bursts and abstract figures the user is meant to swap with
   real illustrations during handoff. */

/* eslint-disable no-undef */

// Spiky starburst (12-point) — pure shape, original geometry
function Starburst({ color = 'var(--aura-orange)', size = 240, points = 12, depth = 0.22, stroke = null, children, style = {} }) {
  const r = size / 2;
  const inner = r * (1 - depth);
  const cx = r, cy = r;
  const path = [];
  const total = points * 2;
  for (let i = 0; i < total; i++) {
    const a = (i / total) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : inner;
    const x = cx + Math.cos(a) * rad;
    const y = cy + Math.sin(a) * rad;
    path.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  path.push('Z');
  return (
    <div className="burst" style={{ width: size, height: size, ...style }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}
           style={{ position: 'absolute', inset: 0 }}>
        <path d={path.join(' ')} fill={color}
              stroke={stroke || 'none'} strokeWidth={stroke ? 2 : 0}
              strokeLinejoin="round" />
      </svg>
      {children}
    </div>
  );
}

// Abstract running figure — simple linear silhouette (NOT the brand's character).
// This is a placeholder shape: rectangular body + circle head + diagonal limbs.
// Drawn as an outlined ink figure to feel illustrative without recreating brand IP.
function FigureRunner({ size = 110, color = '#0E0E0C', invert = false, style = {} }) {
  const c = invert ? '#fff' : color;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={style} aria-hidden="true">
      {/* head */}
      <circle cx="55" cy="22" r="9" fill="none" stroke={c} strokeWidth="3.5" />
      {/* scarf trailing */}
      <path d="M55 30 C 40 32, 30 28, 18 36" fill="none" stroke={c} strokeWidth="3.5" strokeLinecap="round" />
      {/* body — leaning forward */}
      <path d="M55 32 L 50 60 L 62 60 Z" fill={c} />
      {/* arm reaching forward holding a cup */}
      <path d="M58 38 L 78 32 L 80 28 L 88 26" fill="none" stroke={c} strokeWidth="3.5" strokeLinecap="round" />
      {/* cup */}
      <rect x="84" y="20" width="10" height="12" rx="1.5" fill={c} />
      {/* steam */}
      <path d="M88 14 q 2 -4 0 -7" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" />
      {/* legs */}
      <path d="M52 60 L 38 82 L 30 82" fill="none" stroke={c} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M60 60 L 70 78 L 82 80" fill="none" stroke={c} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* shoes */}
      <rect x="26" y="80" width="10" height="4" rx="1" fill={c} />
      <rect x="78" y="78" width="10" height="4" rx="1" fill={c} />
    </svg>
  );
}

// Composed badge: starburst with a figure on top — what would appear on bags/cups.
function BurstBadge({ color = 'var(--aura-orange)', size = 200, figure = true, figureColor = null, label = null, points = 12 }) {
  return (
    <Starburst color={color} size={size} points={points}>
      {figure && (
        <div style={{ position: 'relative', zIndex: 2, width: size * 0.7, height: size * 0.7,
                      display: 'grid', placeItems: 'center' }}>
          <FigureRunner size={size * 0.55} color={figureColor || '#0E0E0C'} />
        </div>
      )}
      {label && <div className="label" style={{ position: 'absolute', bottom: 14, zIndex: 3 }}>{label}</div>}
    </Starburst>
  );
}

// AURA wordmark — original typographic mark (bold display + small starburst dot)
function AuraMark({ size = 28, color = 'currentColor', tagline = false }) {
  const burstSize = size * 0.55;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.3, lineHeight: 1, color }}>
      <Starburst color={color} size={burstSize} points={10} depth={0.28} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span style={{ fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: size,
                       letterSpacing: '-0.02em' }}>AURA</span>
        {tagline && (
          <span style={{ fontFamily: 'var(--aura-mono)', fontSize: size * 0.28,
                         letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 2,
                         opacity: 0.7 }}>Pure Coffee Beans</span>
        )}
      </div>
    </div>
  );
}

// Coffee bag mock — black matte pouch with a colored starburst on the front.
// This is an original simple bag SVG, sized to fit any container.
function CoffeeBag({ width = 180, accent = 'var(--aura-orange)', name = 'CORAÇÃO DO BRASIL', sub = '100% Arabica · 250g' }) {
  const height = width * 1.35;
  return (
    <div style={{ width, height, position: 'relative', filter: 'drop-shadow(0 18px 30px rgba(14,14,12,0.18))' }}>
      <svg viewBox="0 0 180 244" width={width} height={height} style={{ display: 'block' }}>
        <defs>
          <linearGradient id={`bag-grad-${name}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1a1815" />
            <stop offset="0.55" stopColor="#0a0a08" />
            <stop offset="1" stopColor="#16140f" />
          </linearGradient>
        </defs>
        {/* tin tie top */}
        <rect x="32" y="6" width="116" height="12" rx="2" fill="#0a0a08" />
        {/* main pouch — gusseted shape */}
        <path d="M 22 22 Q 22 18 26 18 L 154 18 Q 158 18 158 22 L 162 232 Q 162 238 156 238 L 24 238 Q 18 238 18 232 Z"
              fill={`url(#bag-grad-${name})`} />
        {/* subtle highlight */}
        <path d="M 30 30 L 30 220" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        {/* AURA tiny wordmark */}
        <g transform="translate(64 36)">
          <polygon points="6,6 7.5,2 9,6 13,7.5 9,9 7.5,13 6,9 2,7.5" fill="#fff" />
          <text x="18" y="11" fill="#fff" fontFamily="var(--aura-display)" fontWeight="800" fontSize="13" letterSpacing="-0.02em">AURA</text>
        </g>
        <text x="90" y="56" textAnchor="middle" fill="#bdb8ad" fontFamily="var(--aura-mono)" fontSize="6.5" letterSpacing="2">PURE COFFEE BEANS</text>
      </svg>

      {/* Burst overlay — positioned over the bag front */}
      <div style={{ position: 'absolute', top: '34%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Starburst color={accent} size={width * 0.62} points={11} depth={0.22}>
          <FigureRunner size={width * 0.32} color="#0E0E0C" />
        </Starburst>
      </div>

      {/* Name */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: '14%', textAlign: 'center', padding: '0 18px', pointerEvents: 'none' }}>
        <div style={{ color: '#fff', fontFamily: 'var(--aura-display)', fontWeight: 800, fontSize: width * 0.085,
                       letterSpacing: '-0.01em', lineHeight: 1 }}>{name}</div>
        <div style={{ color: '#bdb8ad', fontFamily: 'var(--aura-mono)', fontSize: width * 0.05,
                       letterSpacing: '0.1em', marginTop: 6 }}>{sub}</div>
      </div>
    </div>
  );
}

// Cup of coffee mock — paper cup with burst sticker on side
function CoffeeCup({ width = 140, accent = 'var(--aura-orange)' }) {
  const h = width * 1.2;
  return (
    <svg viewBox="0 0 140 168" width={width} height={h} style={{ filter: 'drop-shadow(0 12px 18px rgba(14,14,12,0.18))' }}>
      {/* lid */}
      <ellipse cx="70" cy="22" rx="50" ry="8" fill="#0E0E0C" />
      <rect x="20" y="20" width="100" height="6" fill="#0E0E0C" />
      {/* cup body — trapezoid */}
      <path d="M 26 26 L 114 26 L 104 154 L 36 154 Z" fill="#F3F0E9" />
      <path d="M 26 26 L 114 26 L 104 154 L 36 154 Z" fill="none" stroke="#0E0E0C" strokeWidth="1.5" />
      {/* burst sticker via foreignObject for the React component */}
      <foreignObject x="35" y="55" width="70" height="70">
        <div xmlns="http://www.w3.org/1999/xhtml" style={{ display: 'grid', placeItems: 'center' }}>
          <Starburst color={accent} size={70} points={10} depth={0.2}>
            <FigureRunner size={36} />
          </Starburst>
        </div>
      </foreignObject>
    </svg>
  );
}

Object.assign(window, { Starburst, FigureRunner, BurstBadge, AuraMark, CoffeeBag, CoffeeCup });
