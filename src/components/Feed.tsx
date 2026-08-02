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
        {item.squadId && <span className={`bc-dot bc-dot-${item.squadId}`} />}
        <span className="bc-who" style={{ color: item.squadId ? `var(--${item.squadId})` : undefined }}>
          {item.title}
        </span>
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
    <article
      className="bc-panel bc-outgoing bc-from"
      style={item.squadId ? ({ '--from': `var(--${item.squadId})` } as React.CSSProperties) : undefined}
    >
      <div className="bc-traffic">
        {formatClock(item.stamp)}{' '}
        <b style={{ color: item.squadId ? `var(--${item.squadId})` : undefined }}>{item.title}</b>: {item.body}
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
  const turn = useGame((s) => s.turn)
  const beliefs = useGame((s) => s.beliefs)
  const sol = useGame((s) => s.sol)

  return (
    <div>
      {feed.length === 0 ? (
        <div className="bc-panel">
          <div className="bc-traffic">Nothing on the net yet. Give someone an order and end the window.</div>
        </div>
      ) : (
        render(feed, turn, beliefs, sol)
      )}
    </div>
  )
}

/**
 * Everything from earlier sols, grouped by day. Lives in a drawer off the top
 * bar rather than under the feed, because the bottom of a scrolling column is
 * where things go to never be found.
 */
export function Log() {
  const archive = useGame((s) => s.archive)
  const turn = useGame((s) => s.turn)
  const beliefs = useGame((s) => s.beliefs)

  if (archive.length === 0) {
    return <div className="bc-panel"><div className="bc-traffic">No earlier traffic yet. This is your first sol.</div></div>
  }

  const byDay = new Map<number, FeedItem[]>()
  for (const item of archive) {
    const s = item.sol ?? 0
    if (!byDay.has(s)) byDay.set(s, [])
    byDay.get(s)!.push(item)
  }
  const days = [...byDay.entries()].sort((a, b) => b[0] - a[0])

  return (
    <div>
      {days.map(([daySol, items]) => (
        <div key={daySol}>
          <div className="bc-log-day">
            SOL {daySol}
            <em>{items.length} messages</em>
          </div>
          {render(items, turn, beliefs, daySol)}
        </div>
      ))}
    </div>
  )
}

export function NameCards() {
  const casualties = useGame((s) => s.casualties)
  const soldiers = useGame((s) => s.soldiers)
  if (casualties.length === 0) return null
  return (
    <div>
      {casualties.map((c) => {
        const sq = soldiers[c.soldierId]?.squadId
        return (
          <div className="bc-namecard" key={c.soldierId}>
            <b style={{ color: sq ? `var(--${sq})` : undefined }}>{c.name.toUpperCase()}</b>
            <span>
              {c.rank}, {c.squadName}
            </span>
            <span>
              {c.born} to {c.died}
            </span>
          </div>
        )
      })}
    </div>
  )
}
