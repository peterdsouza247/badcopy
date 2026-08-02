import { useGame } from '../state/store'
import { Silhouette } from './Silhouette'

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
            className={`bc-squadtab${acted ? ' is-sent' : ''}`}
            onClick={() => selectSquad(squad.id)}
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
