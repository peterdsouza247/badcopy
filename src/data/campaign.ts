import type { Mission } from '../engine/types'

export const CAMPAIGN_OBJECTIVE =
  'Ash Company will hold the Noctis Cistern and the Chain relay line through the dust season, twenty one sols, until the Compact convoy reaches the works.'

/**
 * Act I is written. Acts II and III are stubbed with their real FRAGO text and
 * structure so the engine runs the whole campaign, and so the remaining
 * writing is a content job rather than an engineering one.
 *
 * Honesty tier is authored here and never shown to the player.
 */
export const MISSIONS: Mission[] = [
  {
    id: 'sol1',
    task: 'Send each squad to a place on the map. Then end the window and read what comes back.',
    verbs: ['MOVE', 'HOLD'],
    sol: 1,
    act: 1,
    title: 'Wake',
    tier: 'STRAIGHT',
    objective: 'Walk the Chain from Bastion to Marker 2. Report anything out of place.',
    turns: 6,
    startNodes: { sq1: 'lowerchain', sq2: 'bastion', sq3: 'marker2', sq4: 'bastion' },
    frago: `Ash Company assumes responsibility for the Chain from Bastion to Marker 4 as of 0500.

Walk the line. Nothing more than that today. Report anything that isn't where the survey says it should be.

No contact expected. If you get contact, say so and we'll move on it.`,
    salkOpen:
      "Kestrel is your eyes, and she's wrong about everything. You'll want to know by how much. I'd start a tally.",
    salkClose:
      "Six of them, maybe. Engineers working a tap. Nobody fired and nobody will tell you the number, so don't go looking for it.",
  },
  {
    id: 'sol2',
    task: 'Get a squad to Tower 6 and hold it. Notice that the short route goes dark.',
    verbs: ['MOVE', 'HOLD', 'RECON'],
    sol: 2,
    act: 1,
    title: 'The Chain',
    tier: 'STRAIGHT',
    objective: 'Escort the engineering party to Tower 6 and hold the ground while they work.',
    turns: 7,
    startNodes: { sq1: 'lowerchain', sq2: 'lowerchain', sq3: 'tower6', sq4: 'bastion' },
    frago: `Tower 6 has been down since 0200. Engineers won't move without an escort, and they're not wrong.

Escort the party, hold the ground while they work, come home. Two hours on site, no more. After that the light goes and so does your margin.

You have both beacons. Spend them if you need to. Ask for more and you'll get an argument, not a no.`,
    salkOpen:
      'Direct route puts them in the graben and out of contact for four turns. Ridge route keeps them talking and costs you six. Your call, not mine.',
  },
  {
    id: 'sol3',
    task: 'Four squads are looking at the same ridge. Read all four reports, then decide who to believe.',
    verbs: ['MOVE', 'HOLD', 'RECON', 'ENGAGE'],
    sol: 3,
    act: 1,
    title: 'Halloran Cut',
    tier: 'STRAIGHT',
    objective: 'Take the crest above Halloran Cut, or suppress it. Your call which.',
    turns: 8,
    startNodes: { sq1: 'halloran', sq2: 'halloran', sq3: 'halloran', sq4: 'halloran' },
    frago: `The crest above Halloran Cut is held and it overlooks your relay line. That is not sustainable.

Take it or suppress it, your call which. Second Battalion crosses east of you at 0600 and would appreciate the quiet.

Mortars are yours 0530 to 0700. After that they go back to Second Battalion, no extension. If you can't hold it, say so now and we'll move them.`,
    salkOpen:
      'Four squads, one ridge, and you are about to get four different ridges. Read the timestamps before you read the confidence.',
    salkClose: "Nobody's going to tell you how many were up there. Not tonight, not ever.",
  },
  {
    id: 'sol4',
    task: 'Cover the Stair. Try splitting a squad off with DETACH.',
    verbs: ['MOVE', 'HOLD', 'RECON', 'ENGAGE', 'DETACH'],
    sol: 4,
    act: 1,
    title: "Pilgrim's Stair",
    tier: 'STRAIGHT',
    objective: 'Cover the water train on the Stair. Detach if you have to.',
    turns: 7,
    startNodes: { sq1: 'stair', sq2: 'marker2', sq3: 'stair', sq4: 'cistern' },
    frago: `Water train, eleven vehicles, Bastion to the Cistern via the Stair. It goes tonight because it goes every fourth night, and they'll know that.

You'll want to be on the Stair before the train is. Detach if you have to. I'd rather you were thin in two places than late in one.

Calloway has the route survey. She asked for it.`,
    salkOpen: "Calloway requested the survey herself. Eleven days in theatre and she's already doing homework.",
  },
  {
    id: 'sol5',
    task: 'Send someone into Cold Harbour. You will not hear from them until they walk out.',
    verbs: ['MOVE', 'HOLD', 'RECON', 'ENGAGE', 'DETACH', 'BREAK CONTACT'],
    sol: 5,
    act: 1,
    title: 'Cold Harbour',
    tier: 'STRAIGHT',
    objective: "Look at Cold Harbour. Don't get drawn in.",
    turns: 8,
    startNodes: { sq1: 'stair', sq2: 'cistern', sq3: 'coldharbour', sq4: 'stair' },
    frago: `There is a dead pumping station at Cold Harbour that the survey says has been dead for thirty years and the thermal says has been warm for six days.

Go and look. Don't get drawn in. If it is held, it is held, and we will deal with it as a different problem.

There is no relay in that graben and there won't be one. You'll lose them for a while. Decide now whether you're all right with that.`,
    salkOpen:
      "Whoever you send into Cold Harbour, you won't hear from until they walk out. Drop a beacon and you will. Drop a beacon and so will everyone else.",
    salkClose:
      "Thirty years dead and somebody's been keeping the pumps alive. Put that somewhere you'll find it again.",
  },
  {
    id: 'sol7',
    task: 'Clear the Sink. The order says resistance is light. Decide whether you believe the order.',
    verbs: ['MOVE', 'HOLD', 'RECON', 'ENGAGE', 'DETACH', 'BREAK CONTACT', 'DIG IN'],
    sol: 7,
    act: 1,
    title: 'The Sink',
    tier: 'SHADED',
    objective: 'Clear the Sink and push to Marker 4 by last light.',
    turns: 9,
    startNodes: { sq1: 'coldharbour', sq2: 'cistern', sq3: 'sink', sq4: 'cistern' },
    frago: `Enemy pressure on the Chain is easing. Take advantage of it.

Clear the Sink and push to Marker 4 by last light. Resistance expected to be light. Air is available on request.

Confirm receipt.`,
    salkOpen:
      "Easing according to whom. Available according to whom. I'm not telling you to refuse it. I'm telling you to notice that nobody signed it.",
    salkClose: 'Air was committed. Air was always committed.',
  },

  // ---- Act II. Structure and FRAGO text in place, content still to write. ----
  {
    id: 'sol8',
    task: 'Hold your positions and read what comes back.',
    verbs: ['MOVE', 'RECON', 'HOLD', 'ENGAGE', 'BREAK CONTACT', 'DIG IN', 'DETACH', 'GO DARK'],
    sol: 8,
    act: 2,
    title: 'Water Discipline',
    tier: 'SHADED',
    objective: 'Patrol the line on standard load.',
    turns: 7,
    startNodes: { sq1: 'cistern', sq2: 'marker4', sq3: 'shelf', sq4: 'cistern' },
    stub: true,
    frago: `Suit reclaim across the company is running eleven per cent under establishment. That is a supply problem and it is being addressed.

In the interim, patrols are to carry standard load and not standard plus. Duration unaffected.

This is not a matter for query.`,
    salkOpen: "Being addressed means somebody's written it down.",
  },
  {
    id: 'sol9',
    task: 'Hold your positions and read what comes back.',
    verbs: ['MOVE', 'RECON', 'HOLD', 'ENGAGE', 'BREAK CONTACT', 'DIG IN', 'DETACH', 'GO DARK'],
    sol: 9,
    act: 2,
    title: 'Rotation',
    tier: 'STRAIGHT',
    objective: 'Hold the line. Decide about Yarrow.',
    turns: 7,
    startNodes: { sq1: 'cistern', sq2: 'marker4', sq3: 'graben7', sq4: 'shelf' },
    stub: true,
    frago: `Transport at Bastion 0400 sol 10. Sgt. D. Yarrow, 2nd Squad, twenty two years, rotation processed.

Company is short and we know it. If you need him held, request it and it will be granted. Nobody here will make you justify it.

Your call.`,
    salkOpen: "They're being generous. Notice how that feels.",
  },
  {
    id: 'sol10',
    task: 'Hold your positions and read what comes back.',
    verbs: ['MOVE', 'RECON', 'HOLD', 'ENGAGE', 'BREAK CONTACT', 'DIG IN', 'DETACH', 'GO DARK'],
    sol: 10,
    act: 2,
    title: 'Intercept',
    tier: 'STRAIGHT',
    objective: 'Sweep the crest line for the transmitter. Do not destroy it.',
    turns: 8,
    startNodes: { sq1: 'halloran', sq2: 'shelf', sq3: 'halloran', sq4: 'marker4' },
    stub: true,
    frago: `Signals is picking up traffic off the Cut and can't place the transmitter. You are closer than they are.

Sweep the crest line. If you find it, don't destroy it. We would rather listen.`,
  },
  {
    id: 'sol11',
    task: 'Hold your positions and read what comes back.',
    verbs: ['MOVE', 'RECON', 'HOLD', 'ENGAGE', 'BREAK CONTACT', 'DIG IN', 'DETACH', 'GO DARK'],
    sol: 11,
    act: 2,
    title: 'Femi',
    tier: 'SHADED',
    objective: "Hold your line. Don't move east.",
    turns: 8,
    startNodes: { sq1: 'marker4', sq2: 'cistern', sq3: 'graben7', sq4: 'shelf' },
    stub: true,
    frago: `Second Battalion is in contact east of the Cut and has requested support. We're not in a position to send them anyone.

Hold your line. Don't move east.

We appreciate this will read poorly.`,
    salkOpen:
      "Both transfer requests refused, same signature both times. I'm not telling you what to do with that. I'm telling you it's in the file, and you're the only one who reads it.",
  },
  {
    id: 'sol12',
    task: 'Hold your positions and read what comes back.',
    verbs: ['MOVE', 'RECON', 'HOLD', 'ENGAGE', 'BREAK CONTACT', 'DIG IN', 'DETACH', 'GO DARK'],
    sol: 12,
    act: 2,
    title: 'The Cistern',
    tier: 'SHADED',
    objective: 'Move the company to the Cistern. Give up the Chain north of Marker 4.',
    turns: 8,
    startNodes: { sq1: 'cistern', sq2: 'cistern', sq3: 'marker4', sq4: 'cistern' },
    stub: true,
    frago: `You will move the company to the Cistern works and hold there.

The Chain north of Marker 4 is to be given up. Towers 7 through 11 won't be re manned.

Don't interpret this as a withdrawal.`,
    salkClose: 'You just gave away half your line on instruction. Remember that you agreed to it.',
  },
  {
    id: 'sol13',
    task: 'Hold your positions and read what comes back.',
    verbs: ['MOVE', 'RECON', 'HOLD', 'ENGAGE', 'BREAK CONTACT', 'DIG IN', 'DETACH', 'GO DARK'],
    sol: 13,
    act: 2,
    title: 'Kestrel Alone',
    tier: 'SHADED',
    objective: 'Get eyes past Marker 6. At least four grabens deep.',
    turns: 11,
    startNodes: { sq1: 'cistern', sq2: 'cistern', sq3: 'marker6', sq4: 'marker4' },
    stub: true,
    frago: `We need eyes past Marker 6 and there's no way to do that and stay in contact.

Send your recon element. Duration is at your discretion but the answer we need is at least four grabens deep.

They'll be on their own. That's understood here.`,
  },
  {
    id: 'sol14',
    task: 'Hold your positions and read what comes back.',
    verbs: ['MOVE', 'RECON', 'HOLD', 'ENGAGE', 'BREAK CONTACT', 'DIG IN', 'DETACH', 'GO DARK'],
    sol: 14,
    act: 2,
    title: 'FRAGO 13',
    tier: 'ROTTEN',
    objective: 'Hold the Cistern through the night. Withdrawal is not authorised.',
    turns: 9,
    startNodes: { sq1: 'cistern', sq2: 'cistern', sq3: 'cistern', sq4: 'cistern' },
    stub: true,
    frago: `[transmitted 0402. received 0447]

It has been decided that the Cistern is to be held through the night.

Withdrawal is not authorised. Adequate support will be provided. Confirm compliance by 0500.

Query window has closed.`,
    salkOpen: "It was sent into a window they knew you'd be dark in. Somebody chose that hour.",
  },

  // ---- Act III. Dust. ----
  {
    id: 'sol15',
    task: 'Hold your positions and read what comes back.',
    verbs: ['MOVE', 'RECON', 'HOLD', 'ENGAGE', 'BREAK CONTACT', 'DIG IN', 'DETACH', 'GO DARK'],
    sol: 15,
    act: 3,
    title: 'Season',
    tier: 'STRAIGHT',
    objective: 'Hold. There is no order today.',
    turns: 8,
    startNodes: { sq1: 'cistern', sq2: 'cistern', sq3: 'stair', sq4: 'halloran' },
    stub: true,
    frago: `No transmission received.`,
    salkOpen: 'Eleven per cent under, they said. It is nineteen. It was always going to be nineteen.',
  },
  {
    id: 'sol16',
    task: 'Hold your positions and read what comes back.',
    verbs: ['MOVE', 'RECON', 'HOLD', 'ENGAGE', 'BREAK CONTACT', 'DIG IN', 'DETACH', 'GO DARK'],
    sol: 16,
    act: 3,
    title: "Calloway's Ground",
    tier: 'SHADED',
    objective: 'Hold the Stair.',
    turns: 9,
    startNodes: { sq1: 'cistern', sq2: 'stair', sq3: 'coldharbour', sq4: 'stair' },
    stub: true,
    frago: `The Stair is the only route with load capacity and it will be needed. Hold it.

Assessment is that the storm is worse for them than for you.`,
  },
  {
    id: 'sol17',
    task: 'Hold your positions and read what comes back.',
    verbs: ['MOVE', 'RECON', 'HOLD', 'ENGAGE', 'BREAK CONTACT', 'DIG IN', 'DETACH', 'GO DARK'],
    sol: 17,
    act: 3,
    title: 'The Manifest',
    tier: 'ROTTEN',
    objective: 'Hold the Cistern.',
    turns: 8,
    startNodes: { sq1: 'cistern', sq2: 'stair', sq3: 'coldharbour', sq4: 'cistern' },
    stub: true,
    frago: `No change to your task. Hold the works and the approaches until the convoy arrives.`,
    salkOpen:
      "I pulled the manifest for the convoy. It isn't a relief column. Sixty tonnes of shaped charge and a survey team, routed to the Cistern and not to Bastion. I want you to tell me I've read it wrong.",
  },
  {
    id: 'sol21',
    task: 'Hold your positions and read what comes back.',
    verbs: ['MOVE', 'RECON', 'HOLD', 'ENGAGE', 'BREAK CONTACT', 'DIG IN', 'DETACH', 'GO DARK'],
    sol: 21,
    act: 3,
    title: 'Bad Copy',
    tier: 'ROTTEN',
    objective: 'One order. Three doors.',
    turns: 6,
    startNodes: { sq1: 'cistern', sq2: 'cistern', sq3: 'coldharbour', sq4: 'stair' },
    stub: true,
    frago: `The convoy is on the Stair and will reach the works by last light.

Hold your positions until it does.`,
    salkClose: "Whatever you send, I will countersign it. That's not absolution. That is what a warrant officer does.",
  },
]

export const INTERCEPTS: string[] = [
  'clear by first light, they have not moved off the ridge',
  'tell him the count is wrong, the count has been wrong since',
  'no, leave the heaters running. Let them look.',
  'tell Ascraeus we can hold the ration at four litres through the season but not past it',
  'they are not going to hold the Cut, they are going to hold it until something else is ready, that is a different',
  'I would rather talk to their commander than their colonel. Is there a way to do that.',
]
