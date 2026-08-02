import { SPEAK_BLURB, THREAD_HINT } from '../data/dialogue'
import { COMMS_BLURB, degrade } from '../engine/traits'
import type { Intent, OrderVerb, SpeakVerb } from '../engine/types'
import { useGame } from '../state/store'

/** MOVE and RECON are given by clicking the map, so they are not buttons. */
const VERBS: Array<[OrderVerb, string]> = [
  ['HOLD', 'Stay put. Do not give ground.'],
  ['ENGAGE', 'Attack what is there.'],
  ['RECON', 'Look around. Do not get drawn in.'],
  ['DIG IN', 'Fortify. Slow, but hard to move.'],
  ['BREAK CONTACT', 'Get out. Now.'],
  ['DETACH', 'Split a fireteam off.'],
  ['GO DARK', 'Radio silence until they surface.'],
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
    dust,
    unlocked,
    issueOrder,
    speak,
    setIntent,
    dropBeacon,
  } = useGame()

  const squad = selectedSquadId ? squads[selectedSquadId] : null
  if (!squad) return null

  const leader = soldiers[squad.leaderId]
  const node = nodes[squad.nodeId]
  const comms = dust ? degrade(node.comms, 1) : node.comms
  const acted = actedThisTurn.includes(squad.id)
  const verbs = VERBS.filter(([v]) => unlocked.includes(v))

  return (
    <div className="bc-orders">
      <div className="bc-orders-head">
        <span className="bc-callsign">{squad.callsign}</span>
        <span className="bc-where">{node.name}</span>
        <span className={`bc-chip is-${comms}`} title={COMMS_BLURB[comms]}>
          {comms}
        </span>
      </div>

      {acted ? (
        <p className="bc-note is-done">
          Orders sent. One thing per squad per window: command them or talk to them, never both.
        </p>
      ) : (
        <p className="bc-note">{COMMS_BLURB[comms]}</p>
      )}

      <div className="bc-section-label">ORDER</div>
      <div className="bc-verbs">
        {verbs.map(([verb, blurb]) => (
          <button key={verb} className="bc-btn" disabled={acted} onClick={() => issueOrder(squad.id, verb)}>
            {verb}
            <small>{blurb}</small>
          </button>
        ))}
      </div>

      <div className="bc-section-label">
        SAY SOMETHING TO {leader?.shortName ?? 'THEM'}
        <em className={`bc-nerve-${leader?.nerve ?? 'Steady'}`}>{leader?.nerve}</em>
      </div>
      <div className="bc-verbs">
        {(['STEADY', 'PRESS', 'LEVEL'] as SpeakVerb[]).map((v) => (
          <button key={v} className="bc-btn" disabled={acted || !leader?.alive} onClick={() => speak(squad.id, v)}>
            {v}
            <small>{SPEAK_BLURB[v]}</small>
          </button>
        ))}
      </div>
      {leader?.threadRevealed && THREAD_HINT[leader.voice] && (
        <div className="bc-hint">{THREAD_HINT[leader.voice]}</div>
      )}

      {unlocked.length >= 5 && (
        <>
          <div className="bc-section-label">IF THEY LOSE CONTACT</div>
          <div className="bc-verbs">
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
        </>
      )}

      {unlocked.length >= 3 && squad.beacons > 0 && !node.beacon && (
        <button className="bc-btn bc-beacon" onClick={() => dropBeacon(squad.id)}>
          DROP RELAY BEACON  ({squad.beacons} left)
          <small>Keeps this ground in contact for good. Everyone can see the emitter, including them.</small>
        </button>
      )}
    </div>
  )
}
