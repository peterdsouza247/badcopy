import { useEffect, useMemo } from 'react'
import { COMMS_BLURB, degrade } from '../engine/traits'
import type { CommsState } from '../engine/types'
import { formatClock, useGame } from '../state/store'

export function TopBar({ onOpenCompany, onOpenLog, logCount }: { onOpenCompany?: () => void; onOpenLog?: () => void; logCount?: number }) {
  const { sol, turn, squads, nodes, dust, commandStanding, companyTrust, selectedSquadId } = useGame()
  const squad = selectedSquadId ? squads[selectedSquadId] : undefined
  const node = squad ? nodes[squad.nodeId] : undefined
  const state: CommsState = node ? (dust ? degrade(node.comms, 1) : node.comms) : 'CLEAR'

  return (
    <header className="bc-topbar">
      <div className="bc-mark">BAD COPY</div>
      <div className="bc-sol">
        SOL {sol} / {formatClock(240 + turn * 10)}
      </div>

      <div className="bc-meters">
        <div className="bc-meter">
          <span>
            Command standing <b>{Math.round(commandStanding)}%</b>
          </span>
          <i>
            <b style={{ width: `${commandStanding}%` }} />
          </i>
        </div>
        <div className="bc-meter is-trust">
          <span>
            Company trust <b>{Math.round(companyTrust)}%</b>
          </span>
          <i>
            <b style={{ width: `${companyTrust}%` }} />
          </i>
        </div>
      </div>

      <div className={`bc-comms is-${state}`} title={COMMS_BLURB[state]}>
        {squad ? squad.callsign : 'LINK'} <b>{state}</b>
      </div>

      {onOpenLog && (
        <button className="bc-roster-btn" onClick={onOpenLog} disabled={!logCount}>
          LOGS
          {Boolean(logCount) && <em>{logCount}</em>}
        </button>
      )}

      {onOpenCompany && (
        <button className="bc-roster-btn" onClick={onOpenCompany}>
          ROSTER
        </button>
      )}
    </header>
  )
}

/**
 * The signature element. Vitals push continuously, including when text cannot
 * get through, so the player learns someone has died from a line going flat
 * with no explanation attached to it. A flatline stays flat for the rest of
 * the campaign.
 */
export function Telemetry() {
  const soldiers = useGame((s) => s.soldiers)
  const turn = useGame((s) => s.turn)

  const squads = useGame((s) => s.squads)

  const traces = useMemo(() => {
    // Same order as the squad tabs, leader first inside each squad, so the
    // strip reads as the company rather than as insertion order.
    const ordered = Object.values(squads).flatMap((sq) =>
      sq.memberIds
        .map((id) => soldiers[id])
        .filter(Boolean)
        .sort((a, b) => Number(b.leader) - Number(a.leader)),
    )
    return ordered.map((sol) => {
      const base = {
        id: sol.id,
        name: sol.shortName,
        squad: sol.squadId,
        state: sol.alive ? sol.condition : 'DOWN',
        nerve: sol.alive ? sol.nerve : '',
        leader: sol.leader,
      }
      if (!sol.alive) return { ...base, alive: false, d: 'M0 10 L86 10' }
      const stress = { Steady: 1, Shaken: 1.35, Breaking: 1.8, Gone: 2.1 }[sol.nerve]
      const pts: string[] = []
      for (let x = 0; x <= 86; x += 2) {
        const beat = (x + turn * 6 + sol.face * 3) % 22
        let y = 10
        if (beat === 6) y = 10 - 5 * stress
        else if (beat === 8) y = 10 + 4 * stress
        else if (beat === 10) y = 10 - 1.5
        pts.push(`${x} ${y.toFixed(1)}`)
      }
      return { ...base, alive: true, d: `M${pts.join(' L')}` }
    })
  }, [soldiers, squads, turn])

  return (
    <div className="bc-telemetry" aria-label="Squad vitals">
      {traces.map((t) => (
        <div className={`bc-trace${t.alive ? '' : ' is-down'}`} key={t.id}>
          <span className="bc-trace-name" style={{ color: t.alive ? `var(--${t.squad})` : 'var(--wound)' }}>
            {t.name}
          </span>
          <svg viewBox="0 0 86 20" preserveAspectRatio="none">
            <path
              d={t.d}
              fill="none"
              stroke={t.alive ? `var(--${t.squad})` : 'var(--wound)'}
              strokeWidth="1"
              opacity={t.alive ? 0.85 : 0.5}
            />
          </svg>
          <span className="bc-trace-state">
            {t.state}
            {t.nerve && t.nerve !== 'Steady' && <em className={`bc-nerve-${t.nerve}`}> {t.nerve}</em>}
          </span>
        </div>
      ))}
    </div>
  )
}

export function Toasts() {
  const toasts = useGame((s) => s.toasts)
  const dismiss = useGame((s) => s.dismissToast)

  useEffect(() => {
    if (toasts.length === 0) return
    const timer = setTimeout(() => dismiss(toasts[0].id), 3600)
    return () => clearTimeout(timer)
  }, [toasts, dismiss])

  return (
    <div className="bc-toasts" aria-live="polite">
      {toasts.slice(0, 4).map((t) => (
        <div key={t.id} className={`bc-toast is-${t.tone}`}>
          {t.text}
        </div>
      ))}
    </div>
  )
}
