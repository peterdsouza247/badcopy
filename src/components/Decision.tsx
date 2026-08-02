import { useGame } from '../state/store'

/**
 * The whole game, made into a button.
 *
 * A conflict flag on its own is a label. It tells the player something is
 * wrong and gives them nothing to do about it. This card asks the question
 * out loud and makes them answer it, which is the only way the mechanic
 * becomes a decision rather than an atmosphere.
 */
export function Decisions() {
  const decisions = useGame((s) => s.decisions)
  const believe = useGame((s) => s.believe)
  const soldiers = useGame((s) => s.soldiers)

  if (decisions.length === 0) return null

  return (
    <>
      {decisions.map((d) => (
        <section className="bc-panel bc-decision" key={d.id}>
          <div className="bc-head">
            <span>YOUR CALL</span>
            <span className="bc-stamp">{d.nodeName}</span>
          </div>
          <p className="bc-ask">
            Your people disagree about what is on this ground. You cannot check. Pick the account you are
            going to act on.
          </p>
          <div style={{ display: 'grid', gap: 8 }}>
            {d.options.map((o) => {
              const s = soldiers[o.soldierId]
              const read = s?.read === 'confirmed'
              return (
                <button key={o.soldierId} className="bc-btn bc-option" onClick={() => believe(d.id, o.soldierId)}>
                  <span className="bc-option-top">
                    <b>{o.shortName}</b>
                    <em>says {o.count}</em>
                    <i>{o.confidence}</i>
                  </span>
                  <small>{o.line}</small>
                  {read && s && s.traits.length > 0 && (
                    <small className="bc-known">You know this about them. Weigh it.</small>
                  )}
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </>
  )
}

/**
 * The fix for the rule that was killing the game.
 *
 * During a window nothing is ever confirmed, which is right. But if nothing is
 * confirmed ever, the player cannot learn anyone's filter and the trait tags
 * are just assertions. Wren pulls the records afterward. You find out what was
 * there once it is far too late to matter, which is both fair and the correct
 * feeling.
 */
export function Calibration() {
  const beliefs = useGame((s) => s.beliefs)
  const sol = useGame((s) => s.sol)
  const rows = beliefs.filter((b) => b.sol === sol)

  if (rows.length === 0) return null

  return (
    <section className="bc-panel bc-salk">
      <div className="bc-head">
        <span>WREN  AFTER ACTION</span>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--dim)', margin: '0 0 12px', lineHeight: 1.6 }}>
        I pulled the records. This is what was actually on that ground, for whatever it is worth to you now.
      </p>
      {rows.map((b) => {
        const gap = b.believed - b.truth
        const verdict =
          Math.abs(gap) <= 2
            ? 'That was close enough to act on.'
            : gap > 0
              ? `${b.shortName} said more than there were. By ${gap}.`
              : `${b.shortName} said fewer than there were. By ${Math.abs(gap)}.`
        return (
          <div className="bc-calib" key={b.nodeId + b.sol}>
            <div className="bc-calib-top">
              <span>{b.nodeName}</span>
              <b>
                you acted on {b.believed}. there were {b.truth}.
              </b>
            </div>
            <small>{verdict}</small>
          </div>
        )
      })}
    </section>
  )
}
