import { create } from 'zustand'
import { buildNodes, neighbours } from '../data/board'
import { buildSoldiers, buildSquads, REPLACEMENT_NAMES, THREAD_SOL } from '../data/cast'
import { CAMPAIGN_OBJECTIVE, INTERCEPTS, MISSIONS } from '../data/campaign'
import { pickExchange } from '../data/dialogue'
import { newSeed, streamFor } from '../engine/rng'
import { buildReport, resolveEngagement, worsen } from '../engine/resolve'
import { persist, restore, SAVE_VERSION, wipe } from '../engine/save'
import { COMMS_LATENCY, degrade } from '../engine/traits'
import type {
  Belief,
  DeathRecord,
  Decision,
  FeedItem,
  GameState,
  Intent,
  Nerve,
  OrderVerb,
  Pin,
  PinColour,
  SpeakVerb,
  Toast,
} from '../engine/types'

const NERVE_ORDER: Nerve[] = ['Gone', 'Breaking', 'Shaken', 'Steady']

function shiftNerve(n: Nerve, delta: number): Nerve {
  const i = NERVE_ORDER.indexOf(n)
  return NERVE_ORDER[Math.min(Math.max(i + delta, 0), NERVE_ORDER.length - 1)]
}

function feedFor(items: FeedItem[], soldierId: string) {
  return items.find((i) => i.kind === 'report' && i.soldierId === soldierId)
}

/** In fiction clock. One turn is ten minutes, campaign day starts at 0400. */
function clockFor(turn: number) {
  return 240 + turn * 10
}

export function formatClock(mins: number) {
  const h = Math.floor(mins / 60) % 24
  const m = Math.round(mins % 60)
  return `${String(h).padStart(2, '0')}${String(m).padStart(2, '0')}`
}


/** Threads surface on schedule and unlock the conversation branch they key. */
function revealThreads(
  soldiers: Record<string, import('../engine/types').Soldier>,
  squads: Record<string, import('../engine/types').Squad>,
  sol: number,
  flags: Record<string, boolean>,
) {
  for (const squad of Object.values(squads)) {
    const leader = soldiers[squad.leaderId]
    if (!leader) continue
    const due = THREAD_SOL[leader.voice]
    if (due !== undefined && sol >= due && !leader.threadRevealed) {
      soldiers[leader.id] = { ...leader, threadRevealed: true }
      flags[`${leader.voice}Thread`] = true
    }
  }
}

function freshState(seed: string): GameState {
  return {
    version: SAVE_VERSION,
    seed,
    started: false,
    sol: MISSIONS[0].sol,
    turn: 0,
    missionIndex: 0,
    phase: 'briefing',
    soldiers: buildSoldiers(),
    squads: buildSquads(),
    nodes: buildNodes(),
    pins: {},
    feed: [],
    archive: [],
    queue: [],
    commandStanding: 62,
    companyTrust: 58,
    casualties: [],
    flags: {},
    toasts: [],
    actedThisTurn: [],
    decisions: [],
    beliefs: [],
    unlocked: MISSIONS[0].verbs,
    coach: 0,
    focusNodeId: null,
    view: 'feed',
    selectedSquadId: 'sq1',
    dust: false,
  }
}

function recolour(pin: Pin): PinColour {
  if (pin.claims.length === 0) return 'none'
  if (pin.claims.length === 1) return 'amber'
  const counts = pin.claims.map((c) => c.count)
  const lo = Math.min(...counts)
  const hi = Math.max(...counts)
  const mean = counts.reduce((a, b) => a + b, 0) / counts.length
  if (mean === 0) return 'green'
  return (hi - lo) / mean > 0.4 ? 'red' : 'green'
}

interface Actions {
  begin: () => void
  newCampaign: () => void
  loadSaved: () => boolean
  setView: (v: GameState['view']) => void
  selectSquad: (id: string) => void
  setIntent: (squadId: string, intent: Intent) => void
  issueOrder: (squadId: string, verb: OrderVerb, target?: string) => void
  speak: (squadId: string, verb: SpeakVerb) => void
  dropBeacon: (squadId: string) => void
  endTurn: () => void
  believe: (decisionId: string, soldierId: string) => void
  advanceCoach: () => void
  focusNode: (id: string | null) => void
  nextMission: () => void
  dismissToast: (id: string) => void
  reset: () => void
}

export const useGame = create<GameState & Actions>((set, get) => ({
  ...freshState(newSeed()),

  begin: () => {
    const s = get()
    const m = MISSIONS[s.missionIndex]
    const squads = { ...s.squads }
    for (const [sqId, nodeId] of Object.entries(m.startNodes)) {
      if (squads[sqId]) squads[sqId] = { ...squads[sqId], nodeId, standingOrder: 'HOLD', dark: false }
    }
    const feed: FeedItem[] = [
      {
        id: `frago-${m.id}`,
        kind: 'frago',
        stamp: clockFor(0),
        sentTurn: 0,
        arriveTurn: 0,
        title: `FRAGO  SOL ${m.sol}`,
        body: m.frago,
        tier: m.tier,
      },
    ]
    if (m.salkOpen) {
      feed.push({
        id: `salk-open-${m.id}`,
        kind: 'salk',
        stamp: clockFor(0),
        sentTurn: 0,
        arriveTurn: 0,
        title: 'SALK  OPS',
        body: m.salkOpen,
      })
    }
    const soldiers = { ...s.soldiers }
    const flags = { ...s.flags }
    revealThreads(soldiers, squads, m.sol, flags)

    set({
      started: true,
      phase: 'ops',
      squads,
      soldiers,
      flags,
      feed,
      queue: [],
      pins: {},
      turn: 0,
      actedThisTurn: [],
      decisions: [],
      unlocked: m.verbs,
      sol: m.sol,
    })
  },

  newCampaign: () => {
    wipe()
    set({ ...freshState(newSeed()) })
  },

  loadSaved: () => {
    const saved = restore()
    if (!saved) return false
    set({ ...saved })
    return true
  },

  setView: (view) => set({ view }),
  selectSquad: (selectedSquadId) => set({ selectedSquadId }),

  setIntent: (squadId, intent) =>
    set((s) => ({ squads: { ...s.squads, [squadId]: { ...s.squads[squadId], intent } } })),

  issueOrder: (squadId, verb, target) =>
    set((s) => {
      if (s.actedThisTurn.includes(squadId)) return s
      const squad = s.squads[squadId]
      const leader = s.soldiers[squad.leaderId]
      const node = s.nodes[squad.nodeId]
      const latency = s.dust ? COMMS_LATENCY[degrade(node.comms, 1)] : COMMS_LATENCY[node.comms]

      const outgoing: FeedItem = {
        id: `out-${squadId}-${s.turn}`,
        kind: 'outgoing',
        stamp: clockFor(s.turn),
        sentTurn: s.turn,
        arriveTurn: s.turn,
        squadId,
        sol: s.sol,
        title: `TO ${squad.callsign}`,
        body: target ? `${verb} to ${s.nodes[target]?.name ?? target}.` : `${verb}.`,
      }

      const toasts: Toast[] = []
      if (!Number.isFinite(latency)) {
        toasts.push({
          id: `t-${Date.now()}`,
          text: `${squad.callsign} IS DARK. THIS WILL NOT REACH THEM.`,
          tone: 'wound',
        })
      }
      void leader

      return {
        squads: {
          ...s.squads,
          [squadId]: { ...squad, standingOrder: verb, targetNodeId: target, dark: verb === 'GO DARK' },
        },
        feed: [outgoing, ...s.feed],
        actedThisTurn: [...s.actedThisTurn, squadId],
        toasts: [...s.toasts, ...toasts],
      }
    }),

  speak: (squadId, verb) =>
    set((s) => {
      if (s.actedThisTurn.includes(squadId)) return s
      const squad = s.squads[squadId]
      const leader = s.soldiers[squad.leaderId]
      if (!leader || !leader.alive) return s

      const node = s.nodes[squad.nodeId]
      const latency = s.dust ? COMMS_LATENCY[degrade(node.comms, 1)] : COMMS_LATENCY[node.comms]
      const reachable = Number.isFinite(latency) && !squad.dark

      const outgoing: FeedItem = {
        id: `say-${squadId}-${s.turn}`,
        kind: 'outgoing',
        stamp: clockFor(s.turn),
        sentTurn: s.turn,
        arriveTurn: s.turn,
        squadId,
        sol: s.sol,
        title: `TO ${leader.shortName}`,
        body: verb,
      }

      // A message sent into the dark still transmits. It is never flagged and
      // never acknowledged. See the setting bible, reports from the dead.
      if (!reachable) {
        return {
          feed: [outgoing, ...s.feed],
          actedThisTurn: [...s.actedThisTurn, squadId],
        }
      }

      const ex = pickExchange(leader.voice, leader.nerve, verb, s.flags)
      if (!ex) return s

      const rng = streamFor(s.seed, s.sol, s.turn, `speak-${squadId}`)
      const landed = rng.d100() < (s.companyTrust < 30 ? 25 : 88)
      const nerveDelta = landed ? ex.nerveDelta : -1

      // The first honest conversation with someone in a given sol is worth
      // having. The fourth is just noise, and they can tell.
      const spokenKey = `spoke:${leader.id}:${s.sol}`
      const repeat = Boolean(s.flags[spokenKey])
      const trustGain = landed ? (repeat ? Math.trunc(ex.trustDelta / 3) : ex.trustDelta) : 0

      const reply: FeedItem = {
        id: `rep-say-${squadId}-${s.turn}`,
        kind: 'report',
        stamp: clockFor(s.turn) + 1,
        sentTurn: s.turn,
        arriveTurn: s.turn + Number(latency),
        soldierId: leader.id,
        squadId,
        sol: s.sol,
        title: `${leader.shortName}  ${squad.callsign}`,
        situation: landed ? ex.reply : 'Say again. You are breaking up.',
        details: [],
        confidence: undefined,
        effect: landed ? ex.effect : 'It did not get through cleanly. Worse by a step.',
      }

      const toasts = [...s.toasts]
      if (landed && ex.remember) {
        toasts.push({ id: `t-${Date.now()}`, text: ex.remember, tone: 'signal' })
      }

      const nextNerve = shiftNerve(leader.nerve, nerveDelta)
      if (nextNerve === 'Gone' && leader.nerve !== 'Gone') {
        toasts.push({ id: `t-${Date.now()}-g`, text: `${squad.callsign} HAS STOPPED ANSWERING`, tone: 'wound' })
      }

      return {
        soldiers: { ...s.soldiers, [leader.id]: { ...leader, nerve: nextNerve } },
        flags: { ...s.flags, [spokenKey]: true },
        companyTrust: Math.max(0, Math.min(100, s.companyTrust + trustGain)),
        commandStanding: Math.max(0, Math.min(100, s.commandStanding + (ex.standingDelta ?? 0))),
        feed: [outgoing, ...s.feed],
        queue: [...s.queue, reply],
        actedThisTurn: [...s.actedThisTurn, squadId],
        toasts,
      }
    }),

  dropBeacon: (squadId) =>
    set((s) => {
      const squad = s.squads[squadId]
      if (squad.beacons <= 0) return s
      const node = s.nodes[squad.nodeId]
      if (node.beacon) return s
      const flags = { ...s.flags }
      if (node.id === 'coldharbour') flags.beaconColdHarbour = true
      return {
        squads: { ...s.squads, [squadId]: { ...squad, beacons: squad.beacons - 1 } },
        nodes: { ...s.nodes, [node.id]: { ...node, beacon: true, comms: 'RELAYED' } },
        flags,
        toasts: [
          ...s.toasts,
          { id: `t-${Date.now()}`, text: `BEACON LIVE AT ${node.name.toUpperCase()}`, tone: 'detective' },
        ],
      }
    }),

  endTurn: () => {
    const s = get()
    const mission = MISSIONS[s.missionIndex]
    const turn = s.turn + 1
    const soldiers = { ...s.soldiers }
    const squads = { ...s.squads }
    const nodes = { ...s.nodes }
    const queue = [...s.queue]
    const casualties = [...s.casualties]
    const toasts: Toast[] = []
    const flags = { ...s.flags }
    let trust = s.companyTrust

    for (const squad of Object.values(squads)) {
      const leader = soldiers[squad.leaderId]
      if (!leader || !leader.alive) continue

      // Movement first, so the report describes where they ended up.
      if ((squad.standingOrder === 'MOVE' || squad.standingOrder === 'RECON') && squad.targetNodeId) {
        if (neighbours(squad.nodeId).includes(squad.targetNodeId)) {
          squads[squad.id] = { ...squad, nodeId: squad.targetNodeId, targetNodeId: undefined }
        }
      }

      const here = nodes[squads[squad.id].nodeId]
      const rng = streamFor(s.seed, s.sol, turn, `res-${squad.id}`)
      const truth = resolveEngagement(squads[squad.id], here, squad.standingOrder, soldiers, rng)

      for (const dead of truth.killed) {
        soldiers[dead.id] = { ...soldiers[dead.id], alive: false }
        casualties.push({
          soldierId: dead.id,
          name: dead.name,
          rank: dead.rank,
          squadName: squad.name,
          born: dead.born,
          died: 2141,
          epitaph: '',
        } as DeathRecord)
        toasts.push({ id: `d-${dead.id}`, text: `${dead.shortName} IS DOWN`, tone: 'wound' })
        if (squad.id === 'sq4') flags.callowayFirstLoss = true
      }
      for (const hurt of truth.wounded) {
        soldiers[hurt.id] = { ...soldiers[hurt.id], condition: worsen(soldiers[hurt.id].condition) }
      }

      if (truth.band === 'BROKEN' || truth.band === 'REPULSED') {
        soldiers[leader.id] = { ...soldiers[leader.id], nerve: shiftNerve(soldiers[leader.id].nerve, -1) }
        trust -= 2
      }

      if (soldiers[leader.id].alive) {
        const commsState = s.dust ? degrade(here.comms, 1) : here.comms
        const base = COMMS_LATENCY[commsState]
        const { item, delay } = buildReport({
          truth,
          leader: soldiers[leader.id],
          squad: squads[squad.id],
          soldiers,
          companyTrust: trust,
          turn,
          stamp: clockFor(turn),
          rng: streamFor(s.seed, s.sol, turn, `rep-${squad.id}`),
        })
        const total = squads[squad.id].dark ? Infinity : base + delay
        if (Number.isFinite(total)) {
          queue.push({ ...item, sol: s.sol, arriveTurn: turn + total })
        } else {
          // Held until they surface. Nothing gets through, including this.
          queue.push({ ...item, sol: s.sol, arriveTurn: turn + 6 })
        }
      }
    }

    // Occasional enemy traffic once the player has finished learning four
    // filters. The fifth voice arrives as a destabilisation, not a tutorial.
    if (mission.act >= 2 || s.flags.interceptsUnlocked) {
      const rng = streamFor(s.seed, s.sol, turn, 'intercept')
      if (rng.d100() > 74) {
        queue.push({
          id: `int-${turn}`,
          kind: 'intercept',
          stamp: clockFor(turn),
          sentTurn: turn,
          arriveTurn: turn,
          sol: s.sol,
          title: 'INTERCEPT',
          body: rng.pick(INTERCEPTS),
        })
      }
    }

    // Deliver anything whose time has come.
    const arrived = queue.filter((q) => q.arriveTurn <= turn)
    const still = queue.filter((q) => q.arriveTurn > turn)

    const pins = { ...s.pins }
    for (const item of arrived) {
      if (item.kind === 'report' && item.nodeId && typeof item.claimedCount === 'number') {
        const pin: Pin = pins[item.nodeId] ?? { nodeId: item.nodeId, claims: [], colour: 'none' }
        const claims = pin.claims.filter((c) => c.soldierId !== item.soldierId)
        claims.push({
          soldierId: item.soldierId!,
          shortName: item.title?.split('  ')[0] ?? '',
          count: item.claimedCount,
          turn,
        })
        const next: Pin = { ...pin, claims }
        next.colour = recolour(next)
        pins[item.nodeId] = next
      }
      if (item.kind === 'report' && item.soldierId) {
        const sol = soldiers[item.soldierId]
        if (sol) {
          const seen = sol.reportsSeen + 1
          let read = sol.read
          if (seen >= 4) read = 'confirmed'
          else if (seen >= 2) read = 'suspected'
          if (read !== sol.read && read === 'suspected') {
            toasts.push({
              id: `r-${sol.id}`,
              text: `YOU MAY BE LEARNING HOW ${sol.shortName} SEES THINGS`,
              tone: 'detective',
            })
          }
          if (read !== sol.read && read === 'confirmed') {
            toasts.push({ id: `rc-${sol.id}`, text: `${sol.shortName} IS READ`, tone: 'detective' })
          }
          soldiers[item.soldierId] = { ...sol, reportsSeen: seen, read }
        }
      }
    }

    // A conflict is not a label. It is a question, and the player has to
    // answer it before the window closes. This is the game, made into a button.
    const decisions: Decision[] = []
    for (const pin of Object.values(pins)) {
      if (pin.colour !== 'red') continue
      if (s.decisions.some((d) => d.nodeId === pin.nodeId)) continue
      if (get().beliefs.some((b) => b.nodeId === pin.nodeId && b.sol === s.sol)) continue
      const node = nodes[pin.nodeId]
      const options = pin.claims.map((c) => {
        const src = feedFor(arrived, c.soldierId)
        return {
          soldierId: c.soldierId,
          shortName: c.shortName,
          count: c.count,
          confidence: src?.confidence ?? ('GUESSING' as const),
          line: src?.situation ?? '',
        }
      })
      if (options.length < 2) continue
      decisions.push({ id: `dec-${pin.nodeId}-${turn}`, nodeId: pin.nodeId, nodeName: node.name, options })
    }

    // Conflict is computed for the player. It never says who is right.
    const flagged = arrived.map((item) => {
      if (item.kind !== 'report' || !item.nodeId) return item
      const pin = pins[item.nodeId]
      return { ...item, conflict: pin?.colour === 'red' }
    })

    const feed = [...flagged.reverse(), ...s.feed]
    const over = turn >= mission.turns

    const next: Partial<GameState> = {
      turn,
      soldiers,
      squads,
      nodes,
      queue: still,
      feed,
      pins,
      casualties,
      companyTrust: Math.max(0, Math.min(100, trust)),
      toasts: [...s.toasts, ...toasts],
      actedThisTurn: [],
      flags,
      decisions: [...s.decisions, ...decisions],
      phase: over ? 'debrief' : 'ops',
    }

    set(next as GameState)
    persist({ ...get() })
  },

  nextMission: () => {
    const s = get()
    const idx = s.missionIndex + 1
    if (idx >= MISSIONS.length) {
      set({ phase: 'over' })
      return
    }
    const m = MISSIONS[idx]

    // Roster refill. Replacements restore manpower, not information.
    const soldiers = { ...s.soldiers }
    const squads = { ...s.squads }
    const rng = streamFor(s.seed, m.sol, 0, 'refill')
    for (const squad of Object.values(squads)) {
      const living = squad.memberIds.filter((id) => soldiers[id]?.alive)
      const gaps = Math.max(0, 4 - living.length)
      const added: string[] = []
      for (let i = 0; i < gaps; i++) {
        const id = `rep-${m.sol}-${squad.id}-${i}`
        const name = rng.pick(REPLACEMENT_NAMES)
        soldiers[id] = {
          id,
          name,
          shortName: name.split(' ')[1].toUpperCase(),
          rank: 'Rifleman',
          squadId: squad.id,
          leader: false,
          traits: ['green'],
          read: 'unread',
          reportsSeen: 0,
          nerve: 'Steady',
          condition: 'Fresh',
          alive: true,
          face: rng.int(1, 32),
          born: 2121,
          voice: 'plain',
          threadRevealed: false,
        }
        added.push(id)
      }

      // If the leader is gone, someone steps up. Their traits are unknown and
      // their reports are thin. This is what death actually costs.
      let leaderId = squad.leaderId
      if (!soldiers[leaderId]?.alive) {
        const heir = [...living, ...added].find((id) => soldiers[id]?.alive)
        if (heir) {
          leaderId = heir
          soldiers[heir] = { ...soldiers[heir], leader: true, read: 'unread', reportsSeen: 0 }
        }
      }

      squads[squad.id] = {
        ...squad,
        memberIds: [...living, ...added],
        leaderId,
        beacons: 2,
        dark: false,
        standingOrder: 'HOLD',
        nodeId: m.startNodes[squad.id] ?? squad.nodeId,
      }
    }

    const carriedFlags = { ...s.flags, interceptsUnlocked: m.act >= 2 }
    revealThreads(soldiers, squads, m.sol, carriedFlags)

    const dust = m.act === 3
    const nodes = { ...s.nodes }
    if (dust && !s.dust) {
      for (const n of Object.values(nodes)) nodes[n.id] = { ...n, comms: degrade(n.comms, 1) }
    }

    const feed: FeedItem[] = [
      {
        id: `frago-${m.id}`,
        kind: 'frago',
        stamp: clockFor(0),
        sentTurn: 0,
        arriveTurn: 0,
        title: `FRAGO  SOL ${m.sol}`,
        body: m.frago,
        tier: m.tier,
        sol: m.sol,
      },
    ]
    if (m.salkOpen) {
      feed.push({
        id: `salk-open-${m.id}`,
        kind: 'salk',
        stamp: clockFor(0),
        sentTurn: 0,
        arriveTurn: 0,
        title: 'WREN  OPS',
        body: m.salkOpen,
        sol: m.sol,
      })
    }

    set({
      missionIndex: idx,
      sol: m.sol,
      turn: 0,
      phase: 'ops',
      soldiers,
      squads,
      nodes,
      dust: dust || s.dust,
      feed,
      archive: [...s.archive, ...s.feed.map((f) => ({ ...f, sol: f.sol ?? s.sol }))],
      queue: [],
      pins: {},
      actedThisTurn: [],
      decisions: [],
      unlocked: m.verbs,
      flags: carriedFlags,
    })
    persist({ ...get() })
  },

  believe: (decisionId: string, soldierId: string) =>
    set((s) => {
      const d = s.decisions.find((x) => x.id === decisionId)
      if (!d) return s
      const opt = d.options.find((o) => o.soldierId === soldierId)
      if (!opt) return s
      const node = s.nodes[d.nodeId]

      // The board now shows what you decided to act on, not an average of
      // what you were told. Being wrong is a position you took.
      const pin = s.pins[d.nodeId]
      const pins = pin
        ? { ...s.pins, [d.nodeId]: { ...pin, colour: 'green' as const, claims: [
            { soldierId: opt.soldierId, shortName: opt.shortName, count: opt.count, turn: s.turn },
          ] } }
        : s.pins

      const belief: Belief = {
        nodeId: d.nodeId,
        nodeName: d.nodeName,
        soldierId: opt.soldierId,
        shortName: opt.shortName,
        believed: opt.count,
        truth: node.truthEnemy,
        sol: s.sol,
      }

      return {
        decisions: s.decisions.filter((x) => x.id !== decisionId),
        beliefs: [...s.beliefs.filter((b) => !(b.nodeId === d.nodeId && b.sol === s.sol)), belief],
        pins,
        toasts: [
          ...s.toasts,
          { id: `b-${decisionId}`, text: `YOU ARE ACTING ON ${opt.shortName}`, tone: 'signal' as const },
        ],
      }
    }),

  advanceCoach: () => set((s) => ({ coach: s.coach + 1 })),

  focusNode: (focusNodeId) => set({ focusNodeId }),

  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  reset: () => {
    wipe()
    set({ ...freshState(newSeed()) })
  },
}))

export { CAMPAIGN_OBJECTIVE, MISSIONS }
