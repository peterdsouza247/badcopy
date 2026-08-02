import type { FeedItem } from '../engine/types'
import { formatClock, useGame } from '../state/store'

function Age({ item, turn }: { item: FeedItem; turn: number }) {
  const mins = (turn - item.sentTurn) * 10
  if (mins <= 0) return null
  return <span className="bc-age">{mins} min old</span>
}

function Report({ item, turn, stale }: { item: FeedItem; turn: number; stale?: string }) {
  return (
    <article className={`bc-panel${item.conflict ? ' is-conflict' : ''}`}>
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

export function Feed() {
  const feed = useGame((s) => s.feed)
  const turn = useGame((s) => s.turn)
  const beliefs = useGame((s) => s.beliefs)
  const sol = useGame((s) => s.sol)

  if (feed.length === 0) {
    return (
      <div className="bc-panel">
        <div className="bc-traffic">Nothing on the net. Give someone an order and wait.</div>
      </div>
    )
  }

  return (
    <div>
      {feed.map((item) => {
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
      })}
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
