import { useEffect } from 'react'
import { Board } from './components/Board'
import { Telemetry, Toasts, TopBar } from './components/Chrome'
import { Company } from './components/Company'
import { Calibration, Decisions } from './components/Decision'
import { Feed, NameCards } from './components/Feed'
import { Orders } from './components/Orders'
import { Silhouette } from './components/Silhouette'
import { CAMPAIGN_OBJECTIVE, MISSIONS, useGame } from './state/store'

function Title() {
  const begin = useGame((s) => s.begin)
  const loadSaved = useGame((s) => s.loadSaved)
  const newCampaign = useGame((s) => s.newCampaign)
  const seed = useGame((s) => s.seed)

  return (
    <div className="bc-title">
      <div className="bc-title-inner">
        <h1>BAD COPY</h1>
        <div className="bc-epigraph">
          <b>bad copy</b> <span>radio procedure. Your transmission was received and it was not readable.</span>
        </div>
        <p>
          You command a company you will never see.
          {'\n'}Everything you know is what somebody chose to tell you, and every one of them tells it
          differently.
        </p>

        <div className="bc-panel is-hot">
          <div className="bc-head">
            <span>HOW THIS WORKS</span>
          </div>
          <ol className="bc-howto">
            <li>
              <b>Give orders.</b> Pick a squad on the left, send it somewhere.
            </li>
            <li>
              <b>End the window.</b> Time passes. You cannot watch. Reports come back.
            </li>
            <li>
              <b>Decide who to believe.</b> Your people will contradict each other. Nobody will tell you who
              is right.
            </li>
            <li>
              <b>Live with it.</b> After the sol, Wren pulls the records and you find out what was really
              there. Too late to help, early enough to learn.
            </li>
          </ol>
        </div>

        <div className="bc-panel">
          <div className="bc-head">
            <span>CAMPAIGN OBJECTIVE</span>
          </div>
          <div className="bc-traffic">{CAMPAIGN_OBJECTIVE}</div>
        </div>

        <div style={{ display: 'grid', gap: 8, marginTop: 4 }}>
          <button className="bc-btn is-primary" onClick={begin}>
            TAKE COMMAND
            <small>Sol 1. Noctis Labyrinthus. Seed {seed}.</small>
          </button>
          <button
            className="bc-btn"
            onClick={() => {
              if (loadSaved()) return
            }}
          >
            RESUME
            <small>Continue a saved campaign if one exists.</small>
          </button>
          <button className="bc-btn" onClick={newCampaign}>
            NEW SEED
            <small>Traits and dispositions are re rolled. Same names, different people.</small>
          </button>
        </div>
      </div>
    </div>
  )
}

function Debrief() {
  const { missionIndex, casualties, nextMission } = useGame()
  const mission = MISSIONS[missionIndex]
  const last = MISSIONS[missionIndex + 1]

  return (
    <div className="bc-main">
      <div className="bc-eyebrow">SOL {mission.sol} CLOSED</div>
      <div className="bc-panel">
        <div className="bc-head">
          <span>{mission.title.toUpperCase()}</span>
        </div>
        <div className="bc-traffic">
          The window is closed. Nobody is going to tell you what was actually on that ground, tonight or ever.
        </div>
      </div>

      {mission.salkClose && (
        <div className="bc-panel bc-salk">
          <div className="bc-head">
            <span>SALK  OPS</span>
          </div>
          <div className="bc-traffic">{mission.salkClose}</div>
        </div>
      )}

      <Calibration />
      <NameCards />

      <button className="bc-btn is-primary" onClick={nextMission}>
        {last ? `PROCEED TO SOL ${last.sol}` : 'END OF WRITTEN CONTENT'}
        <small>
          {casualties.length > 0
            ? 'Replacements will be drawn from theatre reserve. They will not know what you know.'
            : 'The company is intact. That will not last.'}
        </small>
      </button>
    </div>
  )
}

function Over() {
  const reset = useGame((s) => s.reset)
  const casualties = useGame((s) => s.casualties)
  return (
    <div className="bc-main">
      <div className="bc-eyebrow">AFTER ACTION</div>
      <div className="bc-panel">
        <div className="bc-traffic">
          Act I is written. Acts II and III run on the same engine and are waiting for their text.
          {'\n\n'}
          {casualties.length} of the company did not come back.
        </div>
      </div>
      <NameCards />
      <button className="bc-btn is-primary" onClick={reset}>
        START AGAIN
        <small>New seed. Same names, different people.</small>
      </button>
    </div>
  )
}

function Rail() {
  const { squads, soldiers, selectedSquadId, actedThisTurn, selectSquad } = useGame()
  return (
    <aside className="bc-rail">
      {Object.values(squads).map((squad) => {
        const leader = soldiers[squad.leaderId]
        const living = squad.memberIds.filter((id) => soldiers[id]?.alive).length
        return (
          <button
            key={squad.id}
            className="bc-squad"
            aria-current={selectedSquadId === squad.id}
            onClick={() => selectSquad(squad.id)}
          >
            <div className="bc-squad-top">
              {leader && <Silhouette face={leader.face} alive={leader.alive} size={26} />}
              <span className="bc-callsign">{squad.callsign}</span>
              {actedThisTurn.includes(squad.id) && <span className="bc-acted">SENT</span>}
            </div>
            <div className="bc-squad-sub">
              <span className={`bc-nerve-${leader?.nerve ?? 'Steady'}`}>{leader?.nerve}</span>
              <span>{living} up</span>
              <span>{squad.standingOrder}</span>
            </div>
          </button>
        )
      })}
    </aside>
  )
}

export default function App() {
  const { started, phase, view, setView, endTurn, turn, missionIndex, actedThisTurn, squads } = useGame()
  const mission = MISSIONS[missionIndex]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && phase === 'ops') endTurn()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [endTurn, phase])

  if (!started) {
    return (
      <>
        <div className="bc-atmosphere" />
        <Title />
      </>
    )
  }

  const allActed = Object.keys(squads).every((id) => actedThisTurn.includes(id))
  const openCalls = useGame.getState().decisions.length

  return (
    <>
      <div className="bc-atmosphere" />
      <div className="bc-shell">
        <TopBar />

        {phase === 'ops' && (
          <>
            <nav className="bc-tabs" role="tablist">
              {(['feed', 'board', 'company', 'orders'] as const).map((v) => (
                <button
                  key={v}
                  role="tab"
                  aria-selected={view === v}
                  className="bc-tab"
                  onClick={() => setView(v)}
                >
                  {v.toUpperCase()}
                </button>
              ))}
              <button
                className="bc-tab"
                style={{ marginLeft: 'auto', color: allActed ? 'var(--signal)' : undefined }}
                onClick={endTurn}
              >
                END WINDOW  {turn + 1} / {mission.turns}
              </button>
            </nav>

            <div className="bc-orders-bar">
              <span className="bc-orders-label">YOUR TASK</span>
              <span className="bc-orders-text">{mission.task}</span>
              {openCalls > 0 && (
                <button className="bc-orders-call" onClick={() => setView('feed')}>
                  {openCalls} DECISION{openCalls > 1 ? 'S' : ''} WAITING
                </button>
              )}
            </div>

            <div className="bc-body">
              <Rail />
              <main className="bc-main">
                {view === 'feed' && (
                  <>
                    <Decisions />
                    <Feed />
                  </>
                )}
                {view === 'board' && <Board />}
                {view === 'company' && <Company />}
                {view === 'orders' && <Orders />}
              </main>
            </div>
          </>
        )}

        {phase === 'debrief' && <Debrief />}
        {phase === 'over' && <Over />}

        <Telemetry />
      </div>
      <Toasts />
    </>
  )
}
