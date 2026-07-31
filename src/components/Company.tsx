import { TRAITS } from '../engine/traits'
import type { Soldier } from '../engine/types'
import { useGame } from '../state/store'
import { Silhouette } from './Silhouette'

function TraitLine({ soldier }: { soldier: Soldier }) {
  if (soldier.traits.length === 0) return <div className="bc-hint">Nothing on file worth reading.</div>

  if (soldier.read === 'unread') {
    return (
      <div style={{ fontSize: 11.5, color: 'var(--dim)', marginTop: 6 }}>
        Unread. You have not seen enough from this one to know how they see things.
      </div>
    )
  }

  const suspected = soldier.read === 'suspected'
  return (
    <div style={{ marginTop: 6 }}>
      {soldier.traits.map((t) => (
        <div
          key={t}
          style={{
            fontSize: 11.5,
            color: suspected ? 'var(--dim)' : 'var(--bone)',
            fontStyle: suspected ? 'italic' : 'normal',
          }}
        >
          {TRAITS[t].plain}
          {suspected ? ' ?' : ''}
        </div>
      ))}
    </div>
  )
}

export function Company() {
  const { squads, soldiers } = useGame()

  return (
    <div>
      {Object.values(squads).map((squad) => {
        const leader = soldiers[squad.leaderId]
        const members = squad.memberIds.map((id) => soldiers[id]).filter(Boolean)
        const living = members.filter((m) => m.alive).length

        return (
          <section className="bc-panel" key={squad.id}>
            <div className="bc-head">
              <span>{squad.callsign}</span>
              <span className="bc-stamp">{squad.name}</span>
              <span className="bc-age">
                {living} of {members.length} up
              </span>
            </div>

            {leader && (
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <Silhouette face={leader.face} alive={leader.alive} size={54} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-chrome)', letterSpacing: '0.16em', fontSize: 14 }}>
                    {leader.rank} {leader.name}
                  </div>
                  <div className="bc-squad-sub" style={{ marginTop: 5 }}>
                    <span className={`bc-nerve-${leader.nerve}`}>{leader.nerve}</span>
                    <span>{leader.condition}</span>
                    <span>{squad.intent}</span>
                    <span>{squad.beacons} beacons</span>
                  </div>
                  <TraitLine soldier={leader} />
                  {leader.threadRevealed && leader.thread && <div className="bc-hint">{leader.thread}</div>}
                </div>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                gap: 10,
                flexWrap: 'wrap',
                marginTop: 14,
                paddingTop: 12,
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {members
                .filter((m) => !m.leader)
                .map((m) => (
                  <div key={m.id} style={{ textAlign: 'center', width: 62, opacity: m.alive ? 1 : 0.45 }}>
                    <Silhouette face={m.face} alive={m.alive} size={38} tone="var(--dim)" />
                    <div style={{ fontSize: 9.5, letterSpacing: '0.1em', color: 'var(--dim)', marginTop: 2 }}>
                      {m.shortName}
                    </div>
                    <div style={{ fontSize: 9, color: m.alive ? 'var(--dim)' : 'var(--wound)' }}>
                      {m.alive ? m.condition : 'DOWN'}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
