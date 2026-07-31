import { EDGES } from '../data/board'
import { degrade } from '../engine/traits'
import type { PinColour } from '../engine/types'
import { useGame } from '../state/store'

const PIN_FILL: Record<PinColour, string> = {
  green: 'var(--detective)',
  amber: 'var(--signal)',
  red: 'var(--wound)',
  none: 'rgba(140,155,175,0.35)',
}

/**
 * The board never confirms anything. Pins colour themselves from corroboration
 * and that is the whole of the help you get. Two sources agreeing does not mean
 * they are right, it means they agree.
 */
export function Board() {
  const { nodes, pins, squads, dust } = useGame()

  return (
    <div>
      <div className="bc-boardwrap">
        <svg viewBox="0 0 1000 620" role="img" aria-label="Noctis Labyrinthus board">
          <defs>
            <filter id="bc-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {EDGES.map((e, i) => {
            const a = nodes[e.from]
            const b = nodes[e.to]
            if (!a || !b) return null
            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="rgba(88,198,232,0.2)"
                strokeWidth="1"
              />
            )
          })}

          {Object.values(nodes).map((n) => {
            const pin = pins[n.id]
            const colour = pin?.colour ?? 'none'
            const here = Object.values(squads).filter((s) => s.nodeId === n.id)
            const comms = dust ? degrade(n.comms, 1) : n.comms
            const dark = comms === 'DARK'

            return (
              <g key={n.id}>
                {dark && (
                  <circle cx={n.x} cy={n.y} r="30" fill="rgba(216,65,47,0.06)" stroke="rgba(216,65,47,0.28)" strokeDasharray="3 4" />
                )}

                {/* Shape as well as colour, so the pin system survives colour blindness. */}
                {colour === 'green' && (
                  <circle cx={n.x} cy={n.y} r="9" fill={PIN_FILL.green} filter="url(#bc-glow)" />
                )}
                {colour === 'amber' && (
                  <rect x={n.x - 8} y={n.y - 8} width="16" height="16" fill={PIN_FILL.amber} filter="url(#bc-glow)" />
                )}
                {colour === 'red' && (
                  <path
                    d={`M${n.x} ${n.y - 10} L${n.x + 10} ${n.y} L${n.x} ${n.y + 10} L${n.x - 10} ${n.y} Z`}
                    fill={PIN_FILL.red}
                    filter="url(#bc-glow)"
                  />
                )}
                {colour === 'none' && <circle cx={n.x} cy={n.y} r="4.5" fill={PIN_FILL.none} />}

                {n.beacon && (
                  <circle cx={n.x + 15} cy={n.y - 14} r="3.5" fill="var(--signal)" filter="url(#bc-glow)" />
                )}

                <text
                  x={n.x}
                  y={n.y + 27}
                  textAnchor="middle"
                  fill="#9fabbd"
                  fontSize="12"
                  fontFamily="Oswald, sans-serif"
                  letterSpacing="1.6"
                >
                  {n.name.toUpperCase()}
                </text>

                {pin && pin.claims.length > 0 && (
                  <text
                    x={n.x}
                    y={n.y + 42}
                    textAnchor="middle"
                    fill="#6d7a90"
                    fontSize="10.5"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {pin.claims.map((c) => `${c.shortName} ${c.count}`).join('  ')}
                  </text>
                )}

                {here.map((s, i) => (
                  <text
                    key={s.id}
                    x={n.x}
                    y={n.y - 18 - i * 13}
                    textAnchor="middle"
                    fill="var(--signal)"
                    fontSize="11"
                    fontFamily="Oswald, sans-serif"
                    letterSpacing="1.4"
                  >
                    {s.callsign}
                  </text>
                ))}
              </g>
            )
          })}
        </svg>
      </div>

      <div className="bc-legend">
        <span>
          <i style={{ background: PIN_FILL.green, borderRadius: '50%' }} />
          Two or more sources agree
        </span>
        <span>
          <i style={{ background: PIN_FILL.amber }} />
          One source only
        </span>
        <span>
          <i style={{ background: PIN_FILL.red, transform: 'rotate(45deg)' }} />
          Sources contradict each other
        </span>
        <span>
          <i style={{ background: 'var(--signal)', borderRadius: '50%' }} />
          Relay beacon live
        </span>
      </div>
      <p className="bc-scroll-note">
        Nothing here is confirmed. The board shows what people told you and how well it matches.
      </p>
    </div>
  )
}
