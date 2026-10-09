export type GarmentType = "Chola" | "Koti" | "Pattu" | "Luanchari";

const SKIN = "#c99a7b";
const HAIR = "#2a1d17";
const SILVER = "#d7d8dd";
const WOOL = "#f2ede4";
/** The bands of a Kullu border: red, yellow, green, blue. */
const BORDER = ["#c4283a", "#e3a227", "#2d6a45", "#2b4d8f"];

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(c + amt * 255)));
  const r = f(n >> 16),
    g = f((n >> 8) & 255),
    b = f(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

/** A horizontal Kullu border: stacked colour bands with a row of diamonds. */
function KulluBand({ x1, x2, y, h = 10 }: { x1: number; x2: number; y: number; h?: number }) {
  const step = h / BORDER.length;
  const diamonds = [];
  for (let x = x1 + h / 2; x < x2 - h / 2; x += h * 1.4) diamonds.push(x);
  return (
    <g>
      {BORDER.map((c, i) => (
        <rect key={c} x={x1} y={y + i * step} width={x2 - x1} height={step} fill={c} />
      ))}
      {diamonds.map((x) => (
        <path key={x} d={`M${x} ${y + 1} L${x + h * 0.35} ${y + h / 2} L${x} ${y + h - 1} L${x - h * 0.35} ${y + h / 2} Z`} fill="#f5e6c8" />
      ))}
    </g>
  );
}

/** A flat fashion-plate figure, recoloured live by the outfit builder. */
export function LookFigure({ type, colour, accessories }: { type: GarmentType; colour: string; accessories: string[] }) {
  const her = type === "Pattu" || type === "Luanchari";
  const has = (a: string) => accessories.includes(a);
  const dark = shade(colour, -0.12);
  const light = shade(colour, 0.18);

  const P = {
    chola: "M70 88 L130 88 L140 108 L168 330 Q100 344 32 330 L60 108 Z",
    kurta: "M70 92 L130 92 L140 104 L148 268 L52 268 L60 104 Z",
    koti: "M72 90 L128 90 L134 104 L136 214 L64 214 L66 104 Z",
    pattu: "M70 92 L130 92 L140 104 L142 372 L58 372 L60 104 Z",
    bodice: "M72 92 L128 92 L126 170 L74 170 Z",
    skirt: "M74 166 L126 166 L176 370 Q100 386 24 370 Z",
  };

  return (
    <svg viewBox="0 -8 200 408" className="h-full w-full" role="img" aria-label={`Preview: ${type} with ${accessories.length} accessories`}>
      <defs>
        <linearGradient id="lf-shade" x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".22" />
          <stop offset=".5" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".26" />
        </linearGradient>
        <radialGradient id="lf-floor" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#000" stopOpacity=".18" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <clipPath id="lf-pattu">
          <path d={P.pattu} />
        </clipPath>
        <clipPath id="lf-skirt">
          <path d={P.skirt} />
        </clipPath>
      </defs>

      <ellipse cx="100" cy="380" rx="80" ry="10" fill="url(#lf-floor)" />

      {/* hair behind */}
      {her && <path d="M77 52 Q100 14 123 52 L125 100 Q100 106 75 100 Z" fill={HAIR} />}

      {/* arms: full sleeves for every look, in the garment colour or the kurta underneath */}
      {(() => {
        const sleeve = type === "Koti" ? WOOL : type === "Pattu" ? shade(colour, -0.25) : dark;
        return (
          <>
            <path d="M68 90 L54 96 L44 210 L58 212 L72 122 Z" fill={sleeve} />
            <path d="M132 90 L146 96 L156 210 L142 212 L128 122 Z" fill={sleeve} />
          </>
        );
      })()}
      <circle cx="51" cy="218" r="6.5" fill={SKIN} />
      <circle cx="149" cy="218" r="6.5" fill={SKIN} />

      {/* neck + head */}
      <rect x="93" y="68" width="14" height="22" fill={SKIN} />
      <circle cx="100" cy="50" r="20" fill={SKIN} />
      {!her && <path d="M80 48 Q82 26 100 26 Q120 26 120 48 Q112 36 100 36 Q88 36 80 48 Z" fill={HAIR} />}
      {her && <path d="M80 50 Q84 28 100 28 Q118 28 120 50 Q110 36 100 38 Q88 38 80 50 Z" fill={HAIR} />}

      {/* churidar for the men's looks */}
      {!her && (
        <>
          <path d="M82 300 L97 300 L95 368 L84 368 Z" fill={WOOL} />
          <path d="M103 300 L118 300 L116 368 L105 368 Z" fill={WOOL} />
          {[340, 348, 356].map((y) => (
            <path key={y} d={`M84 ${y} h12 M104 ${y} h12`} stroke="#d9d1c3" strokeWidth="1" />
          ))}
        </>
      )}

      {/* garments */}
      {type === "Chola" && (
        <>
          <path d={P.chola} fill={colour} />
          <path d={P.chola} fill="url(#lf-shade)" />
          {[60, 80, 100, 120, 140].map((x) => (
            <path key={x} d={`M100 170 L${x} 334`} stroke={dark} strokeWidth=".8" opacity=".5" />
          ))}
          <path d="M84 88 L100 140 L116 88" fill="none" stroke={dark} strokeWidth="1.5" />
          <rect x="89" y="80" width="22" height="10" fill={dark} />
        </>
      )}

      {type === "Koti" && (
        <>
          <path d={P.kurta} fill={WOOL} />
          <path d={P.kurta} fill="url(#lf-shade)" opacity=".5" />
          <path d={P.koti} fill={colour} />
          <path d={P.koti} fill="url(#lf-shade)" />
          <path d="M92 90 L100 120 L108 90" fill={WOOL} />
          <path d="M100 120 V214" stroke={dark} strokeWidth="1.2" />
          {[134, 154, 174, 194].map((y) => (
            <circle key={y} cx="100" cy={y} r="2" fill={SILVER} />
          ))}
          <KulluBand x1={64} x2={136} y={204} h={10} />
        </>
      )}

      {type === "Pattu" && (
        <>
          <path d={P.pattu} fill={colour} />
          <path d={P.pattu} fill="url(#lf-shade)" />
          <g clipPath="url(#lf-pattu)">
            <KulluBand x1={50} x2={150} y={346} h={16} />
            {/* the woven border runs down the crossed front edge */}
            <g transform="rotate(90 124 230)">
              <KulluBand x1={-14} x2={262} y={225} h={10} />
            </g>
          </g>
          <path d="M70 92 L116 92 L124 372" fill="none" stroke={light} strokeWidth="1" opacity=".6" />
          {/* gachchi at the waist */}
          <rect x="60" y="188" width="80" height="12" fill={BORDER[0]} />
          <path d="M60 194 H140" stroke={BORDER[1]} strokeWidth="2" strokeDasharray="4 3" />
        </>
      )}

      {type === "Luanchari" && (
        <>
          <path d={P.skirt} fill={colour} />
          <path d={P.skirt} fill="url(#lf-shade)" />
          <g clipPath="url(#lf-skirt)">
            {[40, 56, 72, 88, 104, 120, 136, 152].map((x, i) => (
              <path key={x} d={`M100 168 L${x - 16} 380 L${x} 380 Z`} fill={i % 2 ? light : dark} opacity=".35" />
            ))}
            <KulluBand x1={20} x2={180} y={352} h={12} />
          </g>
          <path d={P.bodice} fill={colour} />
          <path d={P.bodice} fill="url(#lf-shade)" />
          <path d="M88 92 Q100 108 112 92" fill="none" stroke={dark} strokeWidth="1.5" />
          {/* dupatta over the shoulder */}
          <path d="M126 92 L142 100 L150 300 L134 296 L96 170 Z" fill={light} opacity=".55" />
        </>
      )}

      {/* footwear */}
      {has("pula") ? (
        <>
          <path d="M80 368 H98 L96 377 H78 Q74 372 80 368 Z" fill="#c8a96b" />
          <path d="M102 368 H120 Q126 372 122 377 H104 Z" fill="#c8a96b" />
          <path d="M80 372 H96 M104 372 H120" stroke="#9c7f45" strokeWidth="1" strokeDasharray="2 1.5" />
        </>
      ) : (
        <>
          <ellipse cx="88" cy="373" rx="11" ry="5" fill="#3a2a20" />
          <ellipse cx="112" cy="373" rx="11" ry="5" fill="#3a2a20" />
        </>
      )}

      {/* accessories */}
      {has("dhatu") && (
        <g>
          <path d="M78 46 Q78 22 100 22 Q122 22 122 46 Q100 36 78 46 Z" fill="#c4283a" />
          <path d="M82 38 Q100 28 118 38" stroke="#e3a227" strokeWidth="2" fill="none" strokeDasharray="3 2" />
          <path d="M120 44 L130 62 L122 64 Z" fill="#c4283a" />
        </g>
      )}
      {(has("kullu-topi-acc") || has("gaddi-topi")) && !has("dhatu") && (
        <g>
          <path d="M80 34 Q80 16 100 16 Q120 16 120 34 Z" fill={has("gaddi-topi") ? "#efe8da" : "#3a3935"} />
          <rect x="79" y="28" width="42" height="8" fill={has("gaddi-topi") ? "#c4283a" : "#2d6a45"} />
          <path d="M82 32 h36" stroke="#e3a227" strokeWidth="1.5" strokeDasharray="3 2" />
          {has("gaddi-topi") && <path d="M114 20 Q124 0 118 -4 Q112 8 112 20 Z" fill="#f4f1ea" stroke="#c9c2b3" strokeWidth=".8" />}
        </g>
      )}
      {has("sehra") && (
        <g>
          {[84, 90, 96, 102, 108, 114].map((x) => (
            <path key={x} d={`M${x} 40 V${x % 12 ? 70 : 76}`} stroke="#e3c46a" strokeWidth="1.5" strokeDasharray="0.1 3" strokeLinecap="round" />
          ))}
        </g>
      )}
      {has("dora") && (
        <g>
          {[0, 4, 8].map((d) => (
            <path key={d} d={`M${her ? 72 : 62} ${176 + d} Q100 ${180 + d} ${her ? 128 : 138} ${176 + d}`} stroke="#141414" strokeWidth="2.5" fill="none" />
          ))}
          <path d="M120 186 L124 222 M126 186 L132 220" stroke="#141414" strokeWidth="2" />
        </g>
      )}
      {has("kullu-muffler") && (
        <g>
          <path d="M84 84 Q100 96 116 84 L118 92 Q100 104 82 92 Z" fill="#8b8a86" />
          <path d="M112 92 L118 160 L108 160 L104 96 Z" fill="#8b8a86" />
          <KulluBand x1={108} x2={118} y={150} h={8} />
        </g>
      )}
      {has("silver-brooch") && (
        <>
          <circle cx="82" cy="98" r="5" fill={SILVER} stroke="#9a9ba3" strokeWidth="1" />
          <circle cx="118" cy="98" r="5" fill={SILVER} stroke="#9a9ba3" strokeWidth="1" />
          <path d="M82 103 Q100 118 118 103" fill="none" stroke={SILVER} strokeWidth="1.2" />
        </>
      )}
      {has("hansli") && <path d="M86 84 Q100 100 114 84" fill="none" stroke={SILVER} strokeWidth="4" strokeLinecap="round" />}
      {has("chandrahaar-acc") && (
        <g fill="none" stroke={SILVER} strokeWidth="1.3">
          {[0, 6, 12, 18].map((d) => (
            <path key={d} d={`M84 ${92 + d / 2} Q100 ${128 + d} 116 ${92 + d / 2}`} />
          ))}
          <rect x="94" y="140" width="12" height="10" fill={SILVER} stroke="#c9a253" />
        </g>
      )}
      {has("kinnauri-earrings-acc") && (
        <>
          <path d="M80 56 v14 M120 56 v14" stroke="#c9a253" strokeWidth="1.5" />
          <path d="M76 70 h8 l-4 8 Z M116 70 h8 l-4 8 Z" fill="#c9a253" />
        </>
      )}
      {has("chak") && <circle cx="100" cy="30" r="6" fill={SILVER} stroke="#c9a253" strokeWidth="1.5" />}
      {has("nath") && <circle cx="94" cy="56" r="5" fill="none" stroke="#c9a253" strokeWidth="1.5" />}
      {has("silver-kangan") && <path d="M44 202 h12 M44 206 h12 M144 202 h12 M144 206 h12" stroke={SILVER} strokeWidth="3" />}
      {has("chamba-rumal") && (
        <g>
          <path d="M150 224 L164 238 L150 252 L136 238 Z" fill="#f2e6c9" stroke="#c4283a" strokeWidth="1.5" />
          <circle cx="150" cy="238" r="3" fill="#2d6a45" />
        </g>
      )}
    </svg>
  );
}
