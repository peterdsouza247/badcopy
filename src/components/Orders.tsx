import { neighbours } from '../data/board'
import { SPEAK_BLURB, THREAD_HINT } from '../data/dialogue'
import { COMMS_BLURB, degrade } from '../engine/traits'
import type { Intent, OrderVerb, SpeakVerb } from '../engine/types'
import { useGame } from '../state/store'

const VERBS: Array<[OrderVerb, string, boolean]> = [
  ['MOVE', 'Go there. Avoid contact if possible.', true],
  ['RECON', 'Go look. Do not get drawn in.', true],
  ['HOLD', 'Stay. Do not give ground.', false],
  ['ENGAGE', 'Attack what is there.', false],
  ['BREAK CONTACT', 'Get out. Now.', false],
  ['DIG IN', 'Fortify. Slow, but hard to move.', false],
  ['DETACH', 'Split a fireteam off for a separate task.', false],
  ['GO DARK', 'Radio silence. No reports until they surface.', false],
]

const INTENTS: Array<[Intent, string]> = [
  ['Preserve the squad', 'Disengages early. Survives. Fails objectives.'],
  ['Hold the line', 'Will not retreat without orders. Dies in place.'],
  ['Take the ground', 'Pushes on initiative. Loses people.'],
  ['Use your judgement', 'Defers to the squad leader.'],
]

export function Orders() {
  const {
    squads,
    soldiers,
    nodes,
    selectedSquadId,
    actedThisTurn,
    unlocked,
    dust,
    issueOrder,
    speak,
    setIntent,
    dropBeacon,
  } = useGame()

  const squad = selectedSquadId ? squads[selectedSquadId] : null
  if (!squad) return <div className="bc-panel">Select a squad.</div>

  const leader = soldiers[squad.leaderId]
  const node = nodes[squad.nodeId]
  const comms = dust ? degrade(node.comms, 1) : node.comms
  const acted = actedThisTurn.includes(squad.id)
  const targets = neighbours(squad.nodeId)

  const handleVerb = (verb: OrderVerb, needsTarget: boolean) => {
    if (needsTarget) {
      const target = targets[0]
      issueOrder(squad.id, verb, target)
    } else {
      issueOrder(squad.id, verb)
    }
  }

  return (
    <div>
      <section className="bc-panel">
        <div className="bc-head">
          <span>{squad.callsign}</span>
          <span className="bc-stamp">{node.name}</span>
          <span className="bc-age">{comms}</span>
        </div>
        <p style={{ fontSize: 11.5, color: 'var(--dim)', margin: '0 0 4px' }}>{COMMS_BLURB[comms]}</p>
        {acted && (
          <p style={{ fontSize: 11.5, color: 'var(--signal)', margin: 0 }}>
            You have used this window. Command a squad or talk to it, never both.
          </p>
        )}
      </section>

      <section className="bc-panel">
        <div className="bc-head">
          <span>ORDERS</span>
        </div>
        <div className="bc-grid2">
          {VERBS.filter(([verb]) => unlocked.includes(verb)).map(([verb, blurb, needsTarget]) => (
            <button
              key={verb}
              className="bc-btn"
              disabled={acted}
              onClick={() => handleVerb(verb, needsTarget)}
            >
              {verb}
              <small>{blurb}</small>
            </button>
          ))}
        </div>

        {targets.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div className="bc-eyebrow" style={{ marginBottom: 8 }}>
              MOVE AND RECON GO TO
            </div>
            <div className="bc-grid2">
              {targets.map((t) => (
                <button key={t} className="bc-btn" disabled={acted} onClick={() => issueOrder(squad.id, 'MOVE', t)}>
                  {nodes[t].name}
                  <small>{dust ? degrade(nodes[t].comms, 1) : nodes[t].comms}</small>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="bc-panel">
        <div className="bc-head">
          <span>SPEAK TO {leader?.shortName ?? 'THEM'}</span>
          <span className="bc-age">{leader?.nerve}</span>
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {(['STEADY', 'PRESS', 'LEVEL'] as SpeakVerb[]).map((v) => (
            <button
              key={v}
              className="bc-btn"
              disabled={acted || !leader?.alive}
              onClick={() => speak(squad.id, v)}
            >
              {v}
              <small>{SPEAK_BLURB[v]}</small>
            </button>
          ))}
        </div>
        {leader && leader.threadRevealed && THREAD_HINT[leader.voice] && (
          <div className="bc-hint">{THREAD_HINT[leader.voice]}</div>
        )}
      </section>

      <section className="bc-panel" hidden={unlocked.length < 5}>
        <div className="bc-head">
          <span>STANDING INTENT</span>
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {INTENTS.map(([intent, blurb]) => (
            <button
              key={intent}
              className={`bc-btn${squad.intent === intent ? ' is-primary' : ''}`}
              onClick={() => setIntent(squad.id, intent)}
            >
              {intent}
              <small>{blurb}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="bc-panel" hidden={unlocked.length < 3}>
        <div className="bc-head">
          <span>RELAY BEACON</span>
          <span className="bc-age">{squad.beacons} left</span>
        </div>
        <button
          className="bc-btn"
          disabled={squad.beacons <= 0 || node.beacon}
          onClick={() => dropBeacon(squad.id)}
        >
          DROP BEACON AT {node.name.toUpperCase()}
          <small>
            Converts this ground to relayed for the rest of the campaign. Puts a fixed emitter on the map that
            everyone can see.
          </small>
        </button>
      </section>
    </div>
  )
}
