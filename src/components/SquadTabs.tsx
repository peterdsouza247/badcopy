import { useGame } from '../state/store'
import { Silhouette } from './Silhouette'

/**
 * Picking a squad should put its orders where you can see them.
 *
 * The tabs sit at the bottom of the screen and the orders card sits at the
 * bottom of a scrolling column, so on a busy sol you can select a squad and
 * never notice the card update several screens above you.
 *
 * Two things to be careful about. On a narrow screen the traffic column is
 * hidden while the map is showing, and offsetParent goes null for anything
 * inside a display none ancestor, which is how we detect that without the
 * component needing to know which pane is up. And scrolling a card that is
 * already comfortably in view is just jitter, so we check first.
 */
function revealOrders() {
  // One frame, so React has re rendered the card for the newly picked squad
  // before we measure it.
  requestAnimationFrame(() => {
    const el = document.getElementById('orders')
    if (!el || el.offsetParent === null) return

    // Measure against the scrolling column, not the window. The column is
    // what actually scrolls, and on desktop its top edge is well below the
    // top of the viewport.
    const scroller = el.closest('.bc-column') as HTMLElement | null
    const box = el.getBoundingClientRect()
    const frame = scroller?.getBoundingClientRect() ?? {
      top: 0,
      bottom: window.innerHeight,
      height: window.innerHeight,
    }

    const visible = box.top >= frame.top && box.top < frame.bottom - Math.min(box.height, frame.height * 0.5)
    if (visible) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' })
  })
}

/**
 * Horizontal squad selector. Scrolls sideways on a narrow screen, which is
 * how a phone wants to hold four items, and gives the map the full height of
 * the window instead of losing a column to a rail.
 */
export function SquadTabs() {
  const { squads, soldiers, nodes, selectedSquadId, actedThisTurn, selectSquad } = useGame()

  return (
    <div className="bc-squadtabs" role="tablist" aria-label="Your company">
      {Object.values(squads).map((squad) => {
        const leader = soldiers[squad.leaderId]
        const living = squad.memberIds.filter((id) => soldiers[id]?.alive).length
        const acted = actedThisTurn.includes(squad.id)
        const selected = selectedSquadId === squad.id

        return (
          <button
            key={squad.id}
            role="tab"
            aria-selected={selected}
            className={`bc-squadtab bc-tab-${squad.id}${acted ? ' is-sent' : ''}`}
            onClick={() => {
              selectSquad(squad.id)
              revealOrders()
            }}
          >
            {leader && <Silhouette face={leader.face} alive={leader.alive} size={30} />}
            <span className="bc-tab-body">
              <span className="bc-tab-top">
                <b>{squad.callsign}</b>
                {acted && <i>SENT</i>}
              </span>
              <span className="bc-tab-sub">
                <em className={`bc-nerve-${leader?.nerve ?? 'Steady'}`}>{leader?.nerve}</em>
                <em>{living} up</em>
                <em className="bc-tab-where">{nodes[squad.nodeId]?.name}</em>
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
