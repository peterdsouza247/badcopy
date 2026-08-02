export type CommsState = 'CLEAR' | 'RELAYED' | 'THIN' | 'DARK'

export type Nerve = 'Steady' | 'Shaken' | 'Breaking' | 'Gone'
export type Condition = 'Fresh' | 'Tired' | 'Hurt' | 'Bad'
export type Confidence = 'CERTAIN' | 'FAIRLY SURE' | 'GUESSING'

export type OrderVerb =
  | 'MOVE'
  | 'RECON'
  | 'HOLD'
  | 'ENGAGE'
  | 'BREAK CONTACT'
  | 'DIG IN'
  | 'DETACH'
  | 'GO DARK'

export type SpeakVerb = 'STEADY' | 'PRESS' | 'LEVEL'

export type Intent =
  | 'Preserve the squad'
  | 'Hold the line'
  | 'Take the ground'
  | 'Use your judgement'

export type TraitId =
  | 'sharp'
  | 'proud'
  | 'alarmist'
  | 'loyal'
  | 'cool'
  | 'slow'
  | 'certain'
  | 'green'

export interface Trait {
  id: TraitId
  label: string
  /** Plain sentence shown on the soldier card once confirmed. */
  plain: string
  /** Multiplier applied to perceived enemy strength. */
  countScale?: number
  /** Extra or missing detail lines. */
  detailDelta?: number
  /** Omits own casualties from every report. */
  hidesLosses?: boolean
  /** Extra turns of delay on everything they send. */
  reportDelay?: number
  /** Always reports this confidence regardless of what they actually know. */
  forceConfidence?: Confidence
  /** Never attaches a recommendation. */
  noRecommendation?: boolean
  /** Reports honestly even when company trust is low. */
  honestUnderPressure?: boolean
  /** Corrects for thermal decoys instead of counting them as men. */
  seesThroughDecoys?: boolean
}

export type ReadState = 'unread' | 'suspected' | 'confirmed'

export interface Soldier {
  id: string
  name: string
  shortName: string
  rank: string
  squadId: string
  leader: boolean
  traits: TraitId[]
  read: ReadState
  reportsSeen: number
  nerve: Nerve
  condition: Condition
  alive: boolean
  /** Deterministic seed for the generated silhouette. */
  face: number
  born: number
  /** Voice profile key. Falls back to a generic profile. */
  voice: string
  thread?: string
  threadRevealed: boolean
}

export interface Squad {
  id: string
  name: string
  callsign: string
  leaderId: string
  memberIds: string[]
  nodeId: string
  intent: Intent
  beacons: number
  dark: boolean
  /** Order currently being executed. */
  standingOrder: OrderVerb
  targetNodeId?: string
}

export interface BoardNode {
  id: string
  name: string
  x: number
  y: number
  comms: CommsState
  /** Enemy present, never shown to the player. */
  truthEnemy: number
  truthDugIn: boolean
  truthDecoys: boolean
  beacon: boolean
}

export interface BoardEdge {
  from: string
  to: string
}

export type PinColour = 'green' | 'amber' | 'red' | 'none'

export interface PinClaim {
  soldierId: string
  shortName: string
  count: number
  turn: number
}

export interface Pin {
  nodeId: string
  claims: PinClaim[]
  colour: PinColour
}

export type FeedKind =
  | 'report'
  | 'frago'
  | 'intercept'
  | 'outgoing'
  | 'system'
  | 'death'
  | 'salk'

export interface FeedItem {
  id: string
  kind: FeedKind
  /** In fiction clock, minutes since 0000. */
  stamp: number
  /** Turn the item was created. */
  sentTurn: number
  /** Turn the item became readable. */
  arriveTurn: number
  soldierId?: string
  squadId?: string
  nodeId?: string
  title?: string
  situation?: string
  details?: string[]
  recommendation?: string
  confidence?: Confidence
  body?: string
  conflict?: boolean
  claimedCount?: number
  tier?: 'STRAIGHT' | 'SHADED' | 'ROTTEN'
  /** Plain English consequence of a conversation. */
  effect?: string
  /** Sol this item belongs to. Drives the current day feed. */
  sol?: number
}

export interface DeathRecord {
  soldierId: string
  name: string
  rank: string
  squadName: string
  born: number
  died: number
  epitaph: string
}

export type OutcomeBand = 'CLEAN' | 'COSTLY' | 'REPULSED' | 'BROKEN'

export interface GroundTruth {
  squadId: string
  nodeId: string
  nodeName: string
  verb: OrderVerb
  band: OutcomeBand
  enemy: number
  dugIn: boolean
  decoys: boolean
  held: boolean
  killed: Soldier[]
  wounded: Soldier[]
}

export interface Mission {
  id: string
  /** One sentence telling the player what to actually do. Not fiction. */
  task: string
  /** Verbs available this sol. The language grows as the player learns it. */
  verbs: OrderVerb[]
  sol: number
  title: string
  act: 1 | 2 | 3
  tier: 'STRAIGHT' | 'SHADED' | 'ROTTEN'
  /** Full FRAGO text, already stripped of dashes. */
  frago: string
  objective: string
  turns: number
  startNodes: Record<string, string>
  salkOpen?: string
  salkClose?: string
  stub?: boolean
}

/** An open question the player must answer before the window closes. */
export interface Decision {
  id: string
  nodeId: string
  nodeName: string
  options: Array<{
    soldierId: string
    shortName: string
    count: number
    confidence: Confidence
    line: string
  }>
}

/** What the player decided to act on, and what was actually there. */
export interface Belief {
  nodeId: string
  nodeName: string
  soldierId: string
  shortName: string
  believed: number
  truth: number
  sol: number
}

export interface Toast {
  id: string
  text: string
  tone: 'signal' | 'detective' | 'wound'
}

export interface GameState {
  version: number
  seed: string
  started: boolean
  sol: number
  turn: number
  missionIndex: number
  phase: 'briefing' | 'ops' | 'debrief' | 'over'
  soldiers: Record<string, Soldier>
  squads: Record<string, Squad>
  nodes: Record<string, BoardNode>
  pins: Record<string, Pin>
  feed: FeedItem[]
  /** Everything from earlier sols, kept for the collapsible log. */
  archive: FeedItem[]
  queue: FeedItem[]
  commandStanding: number
  companyTrust: number
  casualties: DeathRecord[]
  flags: Record<string, boolean>
  toasts: Toast[]
  /** Squad ids that have already acted this turn. */
  actedThisTurn: string[]
  decisions: Decision[]
  beliefs: Belief[]
  /** Verbs unlocked so far. The command language grows with the campaign. */
  unlocked: OrderVerb[]
  coach: number
  focusNodeId: string | null
  view: 'feed' | 'board' | 'company' | 'orders'
  selectedSquadId: string | null
  dust: boolean
}
