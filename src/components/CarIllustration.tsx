import { useId } from 'react';
/** Ilustração vetorial local e genérica. Não representa fielmente um modelo real. */
export function CarIllustration({
  color = '#c7d6db',
  compact = false,
}: {
  color?: string;
  compact?: boolean;
}) {
  const id = useId().replaceAll(':', '');
  return (
    <svg
      viewBox="0 0 640 320"
      className="car-illustration"
      role="img"
      aria-label="Ilustração genérica de veículo"
    >
      <defs>
        <linearGradient id={id + 'body'} x1="0" y1="0" x2=".2" y2="1">
          <stop stopColor="#fff" />
          <stop offset=".3" stopColor={color} />
          <stop offset=".72" stopColor={color} />
          <stop offset="1" stopColor="#687b79" />
        </linearGradient>
        <linearGradient id={id + 'glass'} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#768d91" />
          <stop offset=".5" stopColor="#284641" />
          <stop offset="1" stopColor="#13322c" />
        </linearGradient>
        <linearGradient id={id + 'nose'} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={color} />
          <stop offset="1" stopColor="#8a9c98" />
        </linearGradient>
        <radialGradient id={id + 'hub'}>
          <stop stopColor="#dce1e1" />
          <stop offset=".5" stopColor="#778480" />
          <stop offset="1" stopColor="#222d2b" />
        </radialGradient>
      </defs>
      <ellipse cx="328" cy="272" rx="267" ry="18" fill="#004521" opacity=".11" />
      <path
        d="M78 191 126 142 Q139 131 164 130 L221 76 Q233 66 264 65 L376 66 Q395 69 418 86 L490 135 555 147 Q580 153 586 174 L590 224 Q586 239 563 244 L104 248 Q70 237 66 215Z"
        fill={'url(#' + id + 'body)'}
        stroke="#718681"
        strokeWidth="1.5"
      />
      <path
        d="M166 132 227 79 Q237 73 263 73 L373 74 Q390 75 410 93 L471 133Z"
        fill={'url(#' + id + 'glass)'}
        stroke="#aebdbb"
        strokeWidth="3"
      />
      <path d="m174 128 60-51 13-1-11 57Z" fill="#bad0d0" opacity=".5" />
      <path d="m284 74-6 59M365 75l21 60" stroke="#acbcb8" strokeWidth="8" />
      <path d="m248 80 113 0 41 41-151-1Z" fill="white" opacity=".09" />
      <path
        d="M69 201 Q139 170 320 175 L494 163 579 177"
        fill="none"
        stroke="white"
        strokeWidth="2"
        opacity=".65"
      />
      <path d="m489 136 65 15 19 18-77 16Z" fill={'url(#' + id + 'nose)'} />
      <path d="m495 186 89-10 5 45-92 13Z" fill={color} opacity=".65" />
      <path d="M98 239Q93 181 139 180q44 0 50 61M382 240q-1-70 51-70t55 66" fill="#25322d" />
      <g>
        <ellipse cx="142" cy="232" rx="38" ry="44" fill="#17251f" />
        <ellipse cx="145" cy="232" rx="27" ry="32" fill={'url(#' + id + 'hub)'} />
        <ellipse cx="145" cy="232" rx="8" ry="10" fill="#d6dddd" />
        <path
          d="m145 203 0 20m0 18v20m-23-30h15m16 0h15m-40-20 12 12m11 11 12 12m-35 0 12-12m11-11 12-12"
          stroke="#bac6c2"
          strokeWidth="4"
        />
      </g>
      <g>
        <ellipse cx="437" cy="226" rx="43" ry="48" fill="#17251f" />
        <ellipse cx="440" cy="226" rx="30" ry="34" fill={'url(#' + id + 'hub)'} />
        <ellipse cx="440" cy="226" rx="8" ry="10" fill="#d6dddd" />
        <path
          d="m440 194 0 22m0 20v21m-25-31h17m16 0h18m-43-23 12 14m10 9 14 17m-36 0 12-14m10-11 14-16"
          stroke="#bac6c2"
          strokeWidth="4"
        />
      </g>
      <path d="m192 239 182-3" stroke="#384e46" strokeWidth="7" />
      <path d="m280 138-2 89m97-90 11 49" stroke="#718681" strokeWidth="1" opacity=".7" />
      <path d="m249 150 18-1m76-1 17-1" stroke="#607770" strokeWidth="4" strokeLinecap="round" />
      <path d="m477 143 18 4 6 9-22 0Z" fill="#536e65" />
      <path d="m70 180 40-6-4 10-36 7Z" fill="#d92020" />
      <path d="m498 183 29-4 5 10-31 4m50-9 29-4 1 10-27 4" fill="#f5ffff" />
      <path d="m513 212 63-7-5 14-58 7Z" fill="#1d3a2e" />
      <rect
        x="532"
        y="215"
        width="26"
        height="8"
        rx="2"
        fill="#e9efec"
        transform="rotate(-7 532 215)"
      />
      <path d="m528 171 42-5" stroke="#526b60" strokeWidth="2" />
      {compact && <path d="m212 69 156 1" stroke="#637a70" strokeWidth="4" />}
    </svg>
  );
}
export function HeroScene() {
  return (
    <div className="hero-scene">
      <svg className="landscape" viewBox="0 0 700 530" aria-hidden="true">
        <circle cx="392" cy="211" r="180" fill="#e4f1e3" />
        <path d="M0 402Q182 246 382 376T700 315V530H0Z" fill="#d1e3c9" />
        <path d="M0 448Q268 360 700 425V530H0Z" fill="#abc995" />
        <path d="M0 507Q284 386 700 462" fill="none" stroke="#f9fcf7" strokeWidth="93" />
        <path
          d="M0 507Q284 386 700 462"
          fill="none"
          stroke="#c4d4c0"
          strokeWidth="1"
          strokeDasharray="12 12"
        />
        <g fill="#517b55">
          <path d="m592 316 20-87 20 87Z" />
          <path d="m626 344 25-100 25 100Z" />
          <path d="m42 356 23-89 23 89Z" />
        </g>
        <g stroke="#517b55" strokeWidth="4">
          <path d="M612 305v46m40-14v40M64 342v49" />
        </g>
        <rect x="562" y="324" width="32" height="67" rx="6" fill="#004521" />
        <rect x="569" y="332" width="18" height="22" rx="3" fill="#78de1f" />
        <path d="m579 337-5 8h6l-5 7" stroke="#004521" strokeWidth="2" fill="none" />
        <path
          d="M592 345q25 0 21 26v7q0 10-10 6v-29"
          fill="none"
          stroke="#004521"
          strokeWidth="3"
        />
      </svg>
      <div className="hero-car">
        <CarIllustration />
      </div>
      <div className="scene-label">
        <span className="live-dot" />
        <span>
          Nova energia.
          <br />
          <strong>A mesma tranquilidade.</strong>
        </span>
      </div>
      <div className="hero-guarantee">
        <span className="shield-symbol">✓</span>
        <div>
          <small>COM VOCÊ, NA PRÁTICA</small>
          <strong>Experiência paga</strong>
          <span>Seu caminho tem alternativas.</span>
        </div>
      </div>
      <span className="illustration-note">Imagem ilustrativa</span>
    </div>
  );
}
