import { useEffect, useState } from 'react'
import { Board } from './components/Board'
import { Telemetry, Toasts, TopBar } from './components/Chrome'
import { Company } from './components/Company'
import { Calibration, Decisions } from './components/Decision'
import { Feed, NameCards } from './components/Feed'
import { Orders } from './components/Orders'
import { SquadTabs } from './components/SquadTabs'
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
              <b>Pick a squad, give it an order.</b> Click a lit place on the map to send them there.
            </li>
            <li>
              <b>End the window.</b> Time passes. You cannot watch. Reports come back.
            </li>
            <li>
              <b>Decide who to believe.</b> Your people contradict each other. Nobody will tell you who is
              right.
            </li>
            <li>
              <b>Live with it.</b> After the sol, Wren pulls the records and you learn what was really there.
            </li>
          </ol>
        </div>

        <div style={{ display: 'grid', gap: 8, marginTop: 4 }}>
          <button className="bc-btn is-primary" onClick={begin}>
            TAKE COMMAND
            <small>Sol 1. Noctis Labyrinthus. Seed {seed}.</small>
          </button>
          <button className="bc-btn" onClick={() => loadSaved()}>
            RESUME
            <small>Continue a saved campaign if one exists.</small>
          </button>
          <button className="bc-btn" onClick={newCampaign}>
            NEW SEED
            <small>Same names, different people.</small>
          </button>
        </div>
      </div>
    </div>
  )
}

function Debrief() {
  const { missionIndex, casualties, nextMission } = useGame()
  const mission = MISSIONS[missionIndex]
  const next = MISSIONS[missionIndex + 1]

  return (
    <div className="bc-single">
      <div className="bc-eyebrow">SOL {mission.sol} CLOSED</div>
      <div className="bc-panel">
        <div className="bc-head">
          <span>{mission.title.toUpperCase()}</span>
        </div>
        <div className="bc-traffic">The window is closed. Nothing more is coming in tonight.</div>
      </div>

      <Calibration />

      {mission.salkClose && (
        <div className="bc-panel bc-salk">
          <div className="bc-head">
            <span>WREN  OPS</span>
          </div>
          <div className="bc-traffic">{mission.salkClose}</div>
        </div>
      )}

      <NameCards />

      <button className="bc-btn is-primary" onClick={nextMission}>
        {next ? `PROCEED TO SOL ${next.sol}` : 'END OF WRITTEN CONTENT'}
        <small>
          {casualties.length > 0
            ? 'Replacements arrive from theatre reserve. They will not know what you know.'
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
    <div className="bc-single">
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

export default function App() {
  const { started, phase, endTurn, turn, missionIndex, actedThisTurn, squads, decisions } = useGame()
  const [drawer, setDrawer] = useState(false)
  const [mobilePane, setMobilePane] = useState<'traffic' | 'map'>('traffic')
  const mission = MISSIONS[missionIndex]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && phase === 'ops' && decisions.length === 0) endTurn()
      if (e.key === 'Escape') setDrawer(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [endTurn, phase, decisions.length])

  if (!started) {
    return (
      <>
        <div className="bc-atmosphere" />
        <Title />
      </>
    )
  }

  const allActed = Object.keys(squads).every((id) => actedThisTurn.includes(id))
  const blocked = decisions.length > 0

  return (
    <>
      <div className="bc-atmosphere" />
      <div className="bc-shell">
        <TopBar onOpenCompany={() => setDrawer(true)} />

        {phase === 'ops' && (
          <>
            <SquadTabs />

            <div className="bc-taskbar">
              <span className="bc-task-label">SOL {mission.sol}</span>
              <span className="bc-task-text">{mission.task}</span>
              <div className="bc-mobile-switch">
                <button aria-pressed={mobilePane === 'traffic'} onClick={() => setMobilePane('traffic')}>
                  TRAFFIC
                </button>
                <button aria-pressed={mobilePane === 'map'} onClick={() => setMobilePane('map')}>
                  MAP
                </button>
              </div>
              <button
                className={`bc-end${allActed && !blocked ? ' is-ready' : ''}`}
                onClick={endTurn}
                disabled={blocked}
                title={blocked ? 'Answer the open call first' : 'Advance time'}
              >
                {blocked ? 'DECIDE FIRST' : 'END WINDOW'}
                <em>
                  {turn + 1} of {mission.turns}
                </em>
              </button>
            </div>

            <div className="bc-ops">
              <section className={`bc-column bc-traffic-col${mobilePane === 'traffic' ? ' is-shown' : ''}`}>
                <Decisions />
                <Orders />
                <Feed />
              </section>

              <section className={`bc-map-col${mobilePane === 'map' ? ' is-shown' : ''}`}>
                <Board />
              </section>
            </div>
          </>
        )}

        {phase === 'debrief' && <Debrief />}
        {phase === 'over' && <Over />}

        <Telemetry />
      </div>

      {drawer && (
        <div className="bc-drawer-scrim" onClick={() => setDrawer(false)}>
          <aside className="bc-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="bc-drawer-head">
              <span>THE COMPANY</span>
              <button onClick={() => setDrawer(false)}>CLOSE</button>
            </div>
            <Company />
          </aside>
        </div>
      )}

      <Toasts />
    </>
  )
}

export { CAMPAIGN_OBJECTIVE }
