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

/**
 * The order panel lives at the bottom of the day's traffic, because that is
 * the order you actually do things in: read what came back, then answer it.
 *
 * Orders that cannot apply are disabled with the reason on the button, not
 * hidden. A greyed ENGAGE that says "nothing reported here" teaches the rule.
 * A missing button teaches nothing.
 */
export function Orders() {
  const {
    squads,
    soldiers,
    nodes,
    pins,
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
  const living = squad.memberIds.filter((id) => soldiers[id]?.alive).length

  // What the player has been told is here. Never the truth.
  const pin = pins[squad.nodeId]
  const reportedContact = Boolean(pin && pin.claims.some((c) => c.count > 0))

  const why = (verb: OrderVerb): string | null => {
    if (acted) return 'orders already sent this window'
    switch (verb) {
      case 'ENGAGE':
        return reportedContact ? null : 'nothing reported on this ground'
      case 'BREAK CONTACT':
        return reportedContact ? null : 'you are not in contact'
      case 'DIG IN':
        return squad.standingOrder === 'DIG IN' ? 'already dug in' : null
      case 'GO DARK':
        return squad.dark ? 'already dark' : null
      case 'DETACH':
        return living >= 4 ? null : 'too few left to split'
      default:
        return null
    }
  }

  const verbs = VERBS.filter(([v]) => unlocked.includes(v))
  const speakBlocked = acted ? 'orders already sent this window' : !leader?.alive ? 'no one to talk to' : null

  return (
    <section className="bc-panel bc-orders" id="orders">
      <div className="bc-orders-head">
        <span className={`bc-dot bc-dot-${squad.id}`} />
        <span className="bc-callsign" style={{ color: `var(--${squad.id})` }}>
          {squad.callsign}
        </span>
        <span className="bc-where">{node.name}</span>
        {acted && <span className="bc-sent-chip">ORDERS SENT</span>}
        <span className={`bc-chip is-${comms}`} title={COMMS_BLURB[comms]}>
          {comms}
        </span>
      </div>

      <p className={`bc-note${acted ? ' is-done' : ''}`}>
        {acted
          ? 'One thing per squad per window. Command them or talk to them, never both.'
          : COMMS_BLURB[comms]}
      </p>

      <div className="bc-section-label">ORDER</div>
      <div className="bc-verbs">
        {verbs.map(([verb, blurb]) => {
          const blocked = why(verb)
          return (
            <button
              key={verb}
              className="bc-btn"
              disabled={Boolean(blocked)}
              title={blocked ?? blurb}
              onClick={() => issueOrder(squad.id, verb)}
            >
              {verb}
              <small>{blocked ?? blurb}</small>
            </button>
          )
        })}
      </div>

      <div className="bc-section-label">
        SAY SOMETHING TO{' '}
        <b style={{ color: `var(--${squad.id})`, letterSpacing: '0.18em' }}>{leader?.shortName ?? 'THEM'}</b>
        <em className={`bc-nerve-${leader?.nerve ?? 'Steady'}`}>{leader?.nerve}</em>
      </div>
      <div className="bc-verbs">
        {(['STEADY', 'PRESS', 'LEVEL'] as SpeakVerb[]).map((v) => (
          <button
            key={v}
            className="bc-btn"
            disabled={Boolean(speakBlocked)}
            title={speakBlocked ?? SPEAK_BLURB[v]}
            onClick={() => speak(squad.id, v)}
          >
            {v}
            <small>{speakBlocked ?? SPEAK_BLURB[v]}</small>
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

      {unlocked.length >= 3 && (
        <button
          className="bc-btn bc-beacon"
          disabled={squad.beacons <= 0 || node.beacon || acted}
          onClick={() => dropBeacon(squad.id)}
        >
          DROP RELAY BEACON ({squad.beacons} left)
          <small>
            {node.beacon
              ? 'this ground already has one'
              : squad.beacons <= 0
                ? 'none left to drop'
                : 'Keeps this ground in contact for good. Everyone can see the emitter, including them.'}
          </small>
        </button>
      )}
    </section>
  )
}
