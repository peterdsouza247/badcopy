interface Props {
  face: number
  alive: boolean
  size?: number
  tone?: string
}

/**
 * Stencil portraits, generated from a per soldier integer. No art pipeline and
 * no faces, because you have never seen any of these people. What you get is
 * the shape of a helmet on a comms manifest.
 */
export function Silhouette({ face, alive, size = 46, tone }: Props) {
  const helmet = face % 4
  const visor = Math.floor(face / 4) % 3
  const rig = Math.floor(face / 12) % 3
  const colour = alive ? (tone ?? 'var(--detective)') : 'var(--wound)'

  const domes = [
    'M14 30 C14 17, 22 10, 32 10 C42 10, 50 17, 50 30 L50 36 L14 36 Z',
    'M13 32 C13 18, 21 9, 32 9 C43 9, 51 18, 51 32 L51 37 L13 37 Z',
    'M15 30 C15 16, 23 11, 32 11 C41 11, 49 16, 49 30 L52 34 L12 34 Z',
    'M14 31 C14 19, 20 10, 32 10 C44 10, 50 19, 50 31 L50 35 L14 35 Z',
  ]

  return (
    <svg viewBox="0 0 64 64" width={size} height={size} role="img" aria-hidden="true">
      <defs>
        <clipPath id={`bc-clip-${face}`}>
          <rect x="0" y="0" width="64" height="64" />
        </clipPath>
      </defs>
      <g clipPath={`url(#bc-clip-${face})`} opacity={alive ? 1 : 0.4}>
        {/* shoulders */}
        <path d="M4 64 C4 50, 16 42, 32 42 C48 42, 60 50, 60 64 Z" fill={colour} opacity="0.22" />
        <path d="M4 64 C4 50, 16 42, 32 42 C48 42, 60 50, 60 64 Z" fill="none" stroke={colour} strokeWidth="1.1" />

        {/* helmet */}
        <path d={domes[helmet]} fill={colour} opacity="0.3" />
        <path d={domes[helmet]} fill="none" stroke={colour} strokeWidth="1.3" />

        {/* visor */}
        {visor === 0 && <rect x="19" y="24" width="26" height="6" fill={colour} opacity="0.85" />}
        {visor === 1 && <path d="M19 27 L45 22 L45 30 L19 32 Z" fill={colour} opacity="0.85" />}
        {visor === 2 && (
          <>
            <rect x="19" y="23" width="11" height="6" fill={colour} opacity="0.85" />
            <rect x="34" y="23" width="11" height="6" fill={colour} opacity="0.85" />
          </>
        )}

        {/* rig detail */}
        {rig === 0 && <line x1="50" y1="14" x2="58" y2="4" stroke={colour} strokeWidth="1.2" />}
        {rig === 1 && <circle cx="49" cy="33" r="2.4" fill={colour} />}
        {rig === 2 && <path d="M18 38 L28 38 L26 44 L20 44 Z" fill={colour} opacity="0.6" />}

        {!alive && <line x1="8" y1="56" x2="56" y2="8" stroke="var(--wound)" strokeWidth="1.6" opacity="0.8" />}
      </g>
    </svg>
  )
}
