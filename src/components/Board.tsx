import { EDGES, neighbours } from '../data/board'
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
 * The board is not a separate screen any more. It sits beside the traffic and
 * it is how you give movement orders: click a place your squad can reach and
 * they go. No neighbour button list, no tab switch, no translation step
 * between reading about a ridge and doing something about it.
 */
export function Board({ compact = false }: { compact?: boolean }) {
  const { nodes, pins, squads, dust, selectedSquadId, actedThisTurn, issueOrder, focusNodeId } = useGame()

  const squad = selectedSquadId ? squads[selectedSquadId] : null
  const acted = squad ? actedThisTurn.includes(squad.id) : true
  const reachable = squad ? neighbours(squad.nodeId) : []

  return (
    <div className={compact ? 'bc-boardwrap is-compact' : 'bc-boardwrap'}>
      <svg viewBox="0 0 1000 620" role="img" aria-label="Noctis Labyrinthus">
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
          const live =
            squad &&
            ((e.from === squad.nodeId && reachable.includes(e.to)) ||
              (e.to === squad.nodeId && reachable.includes(e.from)))
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={live ? 'rgba(240,168,40,0.5)' : 'rgba(88,198,232,0.16)'}
              strokeWidth={live ? 1.8 : 1}
            />
          )
        })}

        {Object.values(nodes).map((n) => {
          const pin = pins[n.id]
          const colour = pin?.colour ?? 'none'
          const here = Object.values(squads).filter((s) => s.nodeId === n.id)
          const comms = dust ? degrade(n.comms, 1) : n.comms
          const dark = comms === 'DARK'
          const canGo = Boolean(squad) && !acted && reachable.includes(n.id)
          const isHere = squad?.nodeId === n.id
          const focused = focusNodeId === n.id

          return (
            <g
              key={n.id}
              onClick={() => canGo && squad && issueOrder(squad.id, 'MOVE', n.id)}
              style={{ cursor: canGo ? 'pointer' : 'default' }}
            >
              {canGo && (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="26"
                  fill="rgba(240,168,40,0.08)"
                  stroke="rgba(240,168,40,0.55)"
                  strokeWidth="1.2"
                />
              )}
              {isHere && <circle cx={n.x} cy={n.y} r="30" fill="none" stroke="var(--signal)" strokeWidth="1.6" />}
              {focused && (
                <circle cx={n.x} cy={n.y} r="36" fill="none" stroke="var(--detective)" strokeWidth="1.4" strokeDasharray="4 5" />
              )}
              {dark && !canGo && (
                <circle cx={n.x} cy={n.y} r="22" fill="rgba(216,65,47,0.05)" stroke="rgba(216,65,47,0.24)" strokeDasharray="3 4" />
              )}

              {colour === 'green' && <circle cx={n.x} cy={n.y} r="9" fill={PIN_FILL.green} filter="url(#bc-glow)" />}
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

              {n.beacon && <circle cx={n.x + 15} cy={n.y - 14} r="3.5" fill="var(--signal)" filter="url(#bc-glow)" />}

              <text
                x={n.x}
                y={n.y + 26}
                textAnchor="middle"
                fill="#9fabbd"
                fontSize="13"
                fontFamily="Oswald, sans-serif"
                letterSpacing="1.4"
              >
                {n.name.toUpperCase()}
              </text>

              {pin && pin.claims.length > 0 && (
                <text
                  x={n.x}
                  y={n.y + 41}
                  textAnchor="middle"
                  fill="#6d7a90"
                  fontSize="11"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {pin.claims.map((c) => `${c.shortName} ${c.count}`).join('  ')}
                </text>
              )}

              {here.map((s, i) => (
                <text
                  key={s.id}
                  x={n.x}
                  y={n.y - 17 - i * 13}
                  textAnchor="middle"
                  fill={s.id === selectedSquadId ? 'var(--signal)' : '#7d8798'}
                  fontSize="11.5"
                  fontFamily="Oswald, sans-serif"
                  letterSpacing="1.3"
                >
                  {s.callsign}
                </text>
              ))}
            </g>
          )
        })}
      </svg>

      {squad && !acted && (
        <div className="bc-board-hint">
          Click a lit position to send <b>{squad.callsign}</b> there.
        </div>
      )}
      {squad && acted && <div className="bc-board-hint is-done">{squad.callsign} has its orders for this window.</div>}
    </div>
  )
}

export function BoardLegend() {
  return (
    <div className="bc-legend">
      <span>
        <i style={{ background: PIN_FILL.green, borderRadius: '50%' }} />
        Sources agree
      </span>
      <span>
        <i style={{ background: PIN_FILL.amber }} />
        One source
      </span>
      <span>
        <i style={{ background: PIN_FILL.red, transform: 'rotate(45deg)' }} />
        They contradict
      </span>
    </div>
  )
}
