import { useState } from 'react'
import type { FeedItem } from '../engine/types'
import { formatClock, useGame } from '../state/store'

function Age({ item, turn }: { item: FeedItem; turn: number }) {
  const mins = (turn - item.sentTurn) * 10
  if (mins <= 0) return null
  return <span className="bc-age">{mins} min old</span>
}

function Report({ item, turn, stale }: { item: FeedItem; turn: number; stale?: string }) {
  const focusNode = useGame((s) => s.focusNode)
  const focused = useGame((s) => s.focusNodeId) === item.nodeId
  return (
    <article
      className={`bc-panel is-clickable bc-from${item.conflict ? ' is-conflict' : ''}${focused ? ' is-focused' : ''}`}
      style={item.squadId ? ({ '--from': `var(--${item.squadId})` } as React.CSSProperties) : undefined}
      onClick={() => item.nodeId && focusNode(focused ? null : item.nodeId)}
    >
      <div className="bc-head">
        <span className="bc-stamp">{formatClock(item.stamp)}</span>
        <span>{item.title}</span>
        <Age item={item} turn={turn} />
      </div>
      <div className="bc-traffic">
        <div className="bc-situation">{item.situation}</div>
        {item.details?.map((d, i) => (
          <div className="bc-detail" key={i}>
            {d}
          </div>
        ))}
      </div>
      {item.recommendation && <div className="bc-rec">{item.recommendation}</div>}
      {item.effect && <div className="bc-effect">{item.effect}</div>}
      {stale && <div className="bc-late">This arrived after you had already decided. You acted on {stale}.</div>}
      {(item.confidence || item.conflict) && (
        <div className="bc-foot">
          <span>{item.confidence}</span>
          {item.conflict && <span className="bc-conflict">CONFLICT</span>}
        </div>
      )}
    </article>
  )
}

function Frago({ item }: { item: FeedItem }) {
  return (
    <article className="bc-panel is-hot bc-frago">
      <div className="bc-head">
        <span className="bc-stamp">{formatClock(item.stamp)}</span>
        <span>{item.title}</span>
      </div>
      <div className="bc-traffic">{item.body}</div>
    </article>
  )
}

function Salk({ item }: { item: FeedItem }) {
  return (
    <article className="bc-panel bc-salk">
      <div className="bc-head">
        <span>{item.title}</span>
      </div>
      <div className="bc-traffic">{item.body}</div>
    </article>
  )
}

function Intercept({ item }: { item: FeedItem }) {
  return (
    <article className="bc-panel bc-intercept">
      <div className="bc-head">
        <span className="bc-stamp">{formatClock(item.stamp)}</span>
        <span>INTERCEPT</span>
      </div>
      <div className="bc-traffic">{`/// ${item.body} ///`}</div>
      <div className="bc-foot">
        <span>PARTIAL</span>
      </div>
    </article>
  )
}

function Outgoing({ item }: { item: FeedItem }) {
  return (
    <article className="bc-panel bc-outgoing">
      <div className="bc-traffic">
        {formatClock(item.stamp)} {item.title}: {item.body}
      </div>
    </article>
  )
}

function render(items: FeedItem[], turn: number, beliefs: ReturnType<typeof useGame.getState>['beliefs'], sol: number) {
  return items.map((item) => {
    switch (item.kind) {
      case 'report': {
        const call = beliefs.find((b) => b.sol === sol && b.nodeId === item.nodeId)
        const contradicts =
          call &&
          call.soldierId !== item.soldierId &&
          typeof item.claimedCount === 'number' &&
          Math.abs(item.claimedCount - call.believed) > 4
        return (
          <Report
            key={item.id}
            item={item}
            turn={turn}
            stale={contradicts ? `${call.shortName}, who said ${call.believed}` : undefined}
          />
        )
      }
      case 'frago':
        return <Frago key={item.id} item={item} />
      case 'salk':
        return <Salk key={item.id} item={item} />
      case 'intercept':
        return <Intercept key={item.id} item={item} />
      case 'outgoing':
        return <Outgoing key={item.id} item={item} />
      default:
        return null
    }
  })
}

export function Feed() {
  const feed = useGame((s) => s.feed)
  const archive = useGame((s) => s.archive)
  const turn = useGame((s) => s.turn)
  const beliefs = useGame((s) => s.beliefs)
  const sol = useGame((s) => s.sol)
  const [logOpen, setLogOpen] = useState(false)

  const byDay = new Map<number, FeedItem[]>()
  for (const item of archive) {
    const s = item.sol ?? 0
    if (!byDay.has(s)) byDay.set(s, [])
    byDay.get(s)!.push(item)
  }
  const earlier = [...byDay.entries()].sort((a, b) => b[0] - a[0])

  return (
    <div>
      {feed.length === 0 ? (
        <div className="bc-panel">
          <div className="bc-traffic">Nothing on the net yet. Give someone an order and end the window.</div>
        </div>
      ) : (
        render(feed, turn, beliefs, sol)
      )}

      {earlier.length > 0 && (
        <div className="bc-log">
          <button className="bc-log-head" onClick={() => setLogOpen((o) => !o)} aria-expanded={logOpen}>
            <span className="bc-caret">{logOpen ? '\u25BE' : '\u25B8'}</span>
            EARLIER TRAFFIC
            <em>
              {earlier.length} sol{earlier.length > 1 ? 's' : ''}, {archive.length} messages
            </em>
          </button>
          {logOpen && (
            <div className="bc-log-body">
              {earlier.map(([daySol, items]) => (
                <div key={daySol}>
                  <div className="bc-log-day">SOL {daySol}</div>
                  {render(items, turn, beliefs, daySol)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function NameCards() {
  const casualties = useGame((s) => s.casualties)
  if (casualties.length === 0) return null
  return (
    <div>
      {casualties.map((c) => (
        <div className="bc-namecard" key={c.soldierId}>
          <b>{c.name.toUpperCase()}</b>
          <span>
            {c.rank}, {c.squadName}
          </span>
          <span>
            {c.born} to {c.died}
          </span>
        </div>
      ))}
    </div>
  )
}
