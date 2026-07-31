import type { Rng } from './rng'
import { TRAITS } from './traits'
import { speakAs } from './voices'
import type {
  BoardNode,
  Condition,
  FeedItem,
  GroundTruth,
  OrderVerb,
  OutcomeBand,
  Soldier,
  Squad,
} from './types'

const CONDITION_PENALTY: Record<Condition, number> = {
  Fresh: 0,
  Tired: 8,
  Hurt: 18,
  Bad: 32,
}

const NERVE_PENALTY = { Steady: 0, Shaken: 10, Breaking: 22, Gone: 34 }

/** How exposed each verb leaves the squad. Higher means more contact. */
const VERB_POSTURE: Record<OrderVerb, number> = {
  MOVE: 6,
  RECON: -4,
  HOLD: 0,
  ENGAGE: 20,
  'BREAK CONTACT': -20,
  'DIG IN': -14,
  DETACH: 10,
  'GO DARK': -8,
}

export function resolveEngagement(
  squad: Squad,
  node: BoardNode,
  verb: OrderVerb,
  soldiers: Record<string, Soldier>,
  rng: Rng,
): GroundTruth {
  const members = squad.memberIds.map((id) => soldiers[id]).filter((s) => s && s.alive)
  const leader = soldiers[squad.leaderId]

  let effectiveness = 46 + members.length * 5
  for (const m of members) effectiveness -= CONDITION_PENALTY[m.condition] / 2
  if (leader && leader.alive) effectiveness -= NERVE_PENALTY[leader.nerve]
  if (verb === 'DIG IN') effectiveness += 12
  if (squad.intent === 'Hold the line') effectiveness += 6
  if (squad.intent === 'Preserve the squad') effectiveness -= 4

  const threat = node.truthEnemy * 1.6 + (node.truthDugIn ? 14 : 0) + VERB_POSTURE[verb]

  const margin = effectiveness - threat
  const roll = rng.d100()
  const score = margin + roll - 50

  let band: OutcomeBand
  if (score > 22) band = 'CLEAN'
  else if (score > -2) band = 'COSTLY'
  else if (score > -28) band = 'REPULSED'
  else band = 'BROKEN'

  if (node.truthEnemy === 0) band = 'CLEAN'

  const held = band === 'CLEAN' || band === 'COSTLY'

  // Casualties are weighted toward riflemen. Nobody carries plot armour, but
  // the leader is statistically the last to go so the player keeps their read
  // a little longer than is fair.
  const toll: Record<OutcomeBand, [number, number]> = {
    CLEAN: [0, 0],
    COSTLY: [1, 1],
    REPULSED: [1, 2],
    BROKEN: [2, 3],
  }
  const [minLoss, maxLoss] = toll[band]
  const hits = rng.int(minLoss, maxLoss)

  const pool = rng.shuffle(members.slice()).sort((a, b) => Number(a.leader) - Number(b.leader))
  const killed: Soldier[] = []
  const wounded: Soldier[] = []
  for (let i = 0; i < hits && i < pool.length; i++) {
    const victim = pool[i]
    if (rng.d100() > 55) killed.push(victim)
    else wounded.push(victim)
  }

  return {
    squadId: squad.id,
    nodeId: node.id,
    nodeName: node.name,
    verb,
    band,
    enemy: node.truthEnemy,
    dugIn: node.truthDugIn,
    decoys: node.truthDecoys,
    held,
    killed,
    wounded,
  }
}

export function worsen(c: Condition): Condition {
  const order: Condition[] = ['Fresh', 'Tired', 'Hurt', 'Bad']
  return order[Math.min(order.indexOf(c) + 1, order.length - 1)]
}

interface ReportArgs {
  truth: GroundTruth
  leader: Soldier
  squad: Squad
  soldiers: Record<string, Soldier>
  companyTrust: number
  turn: number
  stamp: number
  rng: Rng
}

/**
 * Ground truth goes in. A person comes out.
 * Filters may scale the count, drop the casualty line, thin the detail, force
 * the confidence tag, or hold the whole thing back a turn or two.
 */
export function buildReport(args: ReportArgs): { item: FeedItem; delay: number } {
  const { truth, leader, squad, soldiers, companyTrust, turn, stamp, rng } = args
  const traits = leader.traits.map((t) => TRAITS[t])

  let scale = 1
  let detailBudget = 2
  let hides = false
  let delay = 0
  let forced: FeedItem['confidence'] | undefined
  let noRec = false
  let honest = false
  let seesThrough = false

  for (const t of traits) {
    if (t.countScale) scale *= t.countScale
    if (t.detailDelta) detailBudget += t.detailDelta
    if (t.hidesLosses) hides = true
    if (t.reportDelay) delay += t.reportDelay
    if (t.forceConfidence) forced = t.forceConfidence
    if (t.noRecommendation) noRec = true
    if (t.honestUnderPressure) honest = true
    if (t.seesThroughDecoys) seesThrough = true
  }

  // Decoys inflate what everyone sees on thermal before any personal bias.
  const raw = truth.enemy * (truth.decoys && !seesThrough ? 1.35 : 1)
  const perceived = raw * scale

  // Low trust makes people filter harder. The Loyal trait is the exception,
  // and it is the only defence the player has against their own reputation.
  if (!honest && companyTrust < 40) {
    detailBudget -= 1
    if (companyTrust < 25) delay += 1
  }

  // Nerve is a multiplier on a filter the player has already learned.
  if (leader.nerve === 'Shaken') detailBudget -= 0
  if (leader.nerve === 'Breaking') detailBudget -= 1
  if (leader.nerve === 'Gone') detailBudget -= 2

  const name = (s: Soldier) => s.shortName
  const killedNames = hides ? [] : truth.killed.map(name)
  const woundedNames = hides ? [] : truth.wounded.map(name)

  const out = speakAs(leader.voice, {
    nodeName: truth.nodeName,
    verb: truth.verb,
    band: truth.band,
    perceived,
    dugIn: truth.dugIn,
    decoys: truth.decoys,
    held: truth.held,
    killedNames,
    woundedNames,
    detailBudget,
    rng,
  })

  // Breaking compresses. It never shouts. Forty words becomes eleven.
  let details = out.details
  let recommendation = noRec ? undefined : out.recommendation
  if (leader.nerve === 'Breaking' || leader.nerve === 'Gone') {
    details = details.slice(0, 1)
    recommendation = undefined
  }

  const confidence = forced ?? out.confidence

  const item: FeedItem = {
    id: `rep-${squad.id}-${turn}-${Math.round(stamp)}`,
    kind: 'report',
    stamp,
    sentTurn: turn,
    arriveTurn: turn,
    soldierId: leader.id,
    squadId: squad.id,
    nodeId: truth.nodeId,
    title: `${leader.shortName}  ${squad.callsign}`,
    situation: out.situation,
    details,
    recommendation,
    confidence,
    claimedCount: out.claimed,
  }

  void soldiers
  return { item, delay }
}
