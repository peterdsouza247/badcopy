import { useCallback, useEffect, useRef, useState } from 'react'
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

const W = 1000
const H = 620
const MIN_K = 0.6
const MAX_K = 3.4

interface View {
  x: number
  y: number
  k: number
}

/**
 * The map you navigate by. Pan with a drag, zoom with the wheel or a pinch,
 * and give movement orders by clicking a lit position.
 *
 * A drag past a few pixels suppresses the click, so panning across the board
 * never accidentally marches a squad into a canyon.
 */
export function Board() {
  const { nodes, pins, squads, dust, selectedSquadId, actedThisTurn, issueOrder, focusNodeId } = useGame()

  const squad = selectedSquadId ? squads[selectedSquadId] : null
  const acted = squad ? actedThisTurn.includes(squad.id) : true
  const reachable = squad ? neighbours(squad.nodeId) : []

  const wrapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [view, setView] = useState<View>({ x: 0, y: 0, k: 1 })
  const drag = useRef<{ x: number; y: number; vx: number; vy: number; moved: boolean } | null>(null)
  const pinch = useRef<{ dist: number; k: number } | null>(null)
  const [grabbing, setGrabbing] = useState(false)

  const clampK = (k: number) => Math.min(MAX_K, Math.max(MIN_K, k))

  const centreOn = useCallback((nx: number, ny: number, k = 1.6) => {
    const el = svgRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const sx = r.width / W
    const sy = r.height / H
    const s = Math.min(sx, sy)
    setView({
      k,
      x: r.width / 2 - nx * s * k,
      y: r.height / 2 - ny * s * k,
    })
  }, [])

  // Clicking a report pans the map to the ground it describes.
  useEffect(() => {
    if (!focusNodeId) return
    const n = nodes[focusNodeId]
    if (n) centreOn(n.x, n.y)
  }, [focusNodeId, nodes, centreOn])

  // Wheel must be non passive to stop the page scrolling under the map.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const r = el.getBoundingClientRect()
      const mx = e.clientX - r.left
      const my = e.clientY - r.top
      setView((v) => {
        const k = clampK(v.k * (e.deltaY < 0 ? 1.14 : 1 / 1.14))
        const ratio = k / v.k
        return { k, x: mx - (mx - v.x) * ratio, y: my - (my - v.y) * ratio }
      })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y, moved: false }
    setGrabbing(true)
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) d.moved = true
    setView((v) => ({ ...v, x: d.vx + dx, y: d.vy + dy }))
  }

  const endDrag = () => {
    setGrabbing(false)
    // Leave `moved` readable for the click handler firing right after this.
    setTimeout(() => {
      drag.current = null
    }, 0)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 2) return
    const [a, b] = [e.touches[0], e.touches[1]]
    pinch.current = { dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), k: view.k }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length !== 2 || !pinch.current) return
    e.preventDefault()
    const [a, b] = [e.touches[0], e.touches[1]]
    const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
    setView((v) => ({ ...v, k: clampK(pinch.current!.k * (dist / pinch.current!.dist)) }))
  }

  const fit = () => setView({ x: 0, y: 0, k: 1 })

  const nudge = (factor: number) => {
    const el = svgRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const mx = r.width / 2
    const my = r.height / 2
    setView((v) => {
      const k = clampK(v.k * factor)
      const ratio = k / v.k
      return { k, x: mx - (mx - v.x) * ratio, y: my - (my - v.y) * ratio }
    })
  }

  const handleNode = (id: string) => {
    if (drag.current?.moved) return
    if (!squad || acted || !reachable.includes(id)) return
    issueOrder(squad.id, 'MOVE', id)
  }

  return (
    <div className="bc-map" ref={wrapRef}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Noctis Labyrinthus"
        className={grabbing ? 'is-grabbing' : ''}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
      >
        <defs>
          <filter id="bc-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
          {EDGES.map((e, i) => {
            const a = nodes[e.from]
            const b = nodes[e.to]
            if (!a || !b) return null
            const live =
              squad &&
              !acted &&
              ((e.from === squad.nodeId && reachable.includes(e.to)) ||
                (e.to === squad.nodeId && reachable.includes(e.from)))
            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={live ? 'rgba(240,168,40,0.55)' : 'rgba(88,198,232,0.18)'}
                strokeWidth={live ? 2.2 : 1.2}
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
                onClick={() => handleNode(n.id)}
                style={{ cursor: canGo ? 'pointer' : 'inherit' }}
              >
                {canGo && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r="30"
                    fill="rgba(240,168,40,0.1)"
                    stroke="rgba(240,168,40,0.6)"
                    strokeWidth="1.6"
                  />
                )}
                {isHere && <circle cx={n.x} cy={n.y} r="34" fill="none" stroke="var(--signal)" strokeWidth="1.8" />}
                {focused && (
                  <circle cx={n.x} cy={n.y} r="42" fill="none" stroke="var(--detective)" strokeWidth="1.6" strokeDasharray="5 6" />
                )}
                {dark && !canGo && (
                  <circle cx={n.x} cy={n.y} r="26" fill="rgba(216,65,47,0.05)" stroke="rgba(216,65,47,0.26)" strokeDasharray="3 5" />
                )}

                {colour === 'green' && <circle cx={n.x} cy={n.y} r="10" fill={PIN_FILL.green} filter="url(#bc-glow)" />}
                {colour === 'amber' && (
                  <rect x={n.x - 9} y={n.y - 9} width="18" height="18" fill={PIN_FILL.amber} filter="url(#bc-glow)" />
                )}
                {colour === 'red' && (
                  <path
                    d={`M${n.x} ${n.y - 12} L${n.x + 12} ${n.y} L${n.x} ${n.y + 12} L${n.x - 12} ${n.y} Z`}
                    fill={PIN_FILL.red}
                    filter="url(#bc-glow)"
                  />
                )}
                {colour === 'none' && <circle cx={n.x} cy={n.y} r="5" fill={PIN_FILL.none} />}

                {n.beacon && <circle cx={n.x + 17} cy={n.y - 16} r="4" fill="var(--signal)" filter="url(#bc-glow)" />}

                <text
                  x={n.x}
                  y={n.y + 30}
                  textAnchor="middle"
                  fill="#b3becd"
                  fontSize="16"
                  fontFamily="Oswald, sans-serif"
                  letterSpacing="1.6"
                >
                  {n.name.toUpperCase()}
                </text>

                {pin && pin.claims.length > 0 && (
                  <text
                    x={n.x}
                    y={n.y + 48}
                    textAnchor="middle"
                    fill="#7e8b9e"
                    fontSize="13"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {pin.claims.map((c) => `${c.shortName} ${c.count}`).join('  ')}
                  </text>
                )}

                {here.map((s, i) => (
                  <text
                    key={s.id}
                    x={n.x}
                    y={n.y - 20 - i * 16}
                    textAnchor="middle"
                    fill={s.id === selectedSquadId ? 'var(--signal)' : '#8d97a8'}
                    fontSize="14"
                    fontFamily="Oswald, sans-serif"
                    letterSpacing="1.4"
                  >
                    {s.callsign}
                  </text>
                ))}
              </g>
            )
          })}
        </g>
      </svg>

      <div className="bc-map-controls">
        <button onClick={() => nudge(1.3)} aria-label="Zoom in">
          +
        </button>
        <button onClick={() => nudge(1 / 1.3)} aria-label="Zoom out">
          &minus;
        </button>
        <button onClick={fit} aria-label="Fit map">
          FIT
        </button>
        {squad && (
          <button onClick={() => centreOn(nodes[squad.nodeId].x, nodes[squad.nodeId].y)} aria-label="Centre on squad">
            {squad.callsign}
          </button>
        )}
      </div>

      <div className="bc-map-foot">
        {squad && !acted ? (
          <span className="is-live">
            Click a lit position to send <b>{squad.callsign}</b>. Drag to pan, scroll to zoom.
          </span>
        ) : (
          <span>Drag to pan. Scroll or pinch to zoom.</span>
        )}
        <span className="bc-map-key">
          <i style={{ background: PIN_FILL.green, borderRadius: '50%' }} /> agree
          <i style={{ background: PIN_FILL.amber }} /> one source
          <i style={{ background: PIN_FILL.red, transform: 'rotate(45deg)' }} /> contradict
        </span>
      </div>
    </div>
  )
}
