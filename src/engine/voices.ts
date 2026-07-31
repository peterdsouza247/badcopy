import type { Confidence, OrderVerb, OutcomeBand } from './types'
import type { Rng } from './rng'

/**
 * The simulation is honest. The report is not.
 *
 * Ground truth goes in, a person comes out. Every voice below is a filter,
 * and the whole game is the player learning to invert them.
 *
 * House style, enforced here and in every future line: no dashes. Radio traffic
 * breaks on full stops and new lines, the way people actually speak into a mic.
 */

export interface VoiceCtx {
  nodeName: string
  verb: OrderVerb
  band: OutcomeBand
  /** Enemy strength as this soldier perceives it, already scaled. */
  perceived: number
  dugIn: boolean
  /** True when the position is running heat decoys. */
  decoys: boolean
  held: boolean
  killedNames: string[]
  woundedNames: string[]
  detailBudget: number
  rng: Rng
}

export interface VoiceOut {
  situation: string
  details: string[]
  recommendation?: string
  confidence: Confidence
  /** The figure this person actually put on the net. Drives board pins. */
  claimed: number
}

/** Nobody says "fourteen hostiles" out loud. They round and they hedge. */
function round(n: number) {
  if (n <= 0) return 0
  if (n < 20) return Math.max(1, Math.round(n / 5) * 5)
  return Math.round(n / 10) * 10
}

function casualtyLine(killed: string[], wounded: string[]): string | null {
  if (killed.length === 0 && wounded.length === 0) return null
  const parts: string[] = []
  if (killed.length === 1) parts.push(`Lost ${killed[0]}.`)
  if (killed.length > 1) parts.push(`Lost ${killed.slice(0, -1).join(', ')} and ${killed[killed.length - 1]}.`)
  if (wounded.length === 1) parts.push(`${wounded[0]} is hurt, walking.`)
  if (wounded.length > 1) parts.push(`${wounded.length} hurt, all walking.`)
  return parts.join(' ')
}

// ---------------------------------------------------------------------------
// BALOGUN. Short sentences. Full stops where other people use commas.
// Says "call it" when estimating, which sounds like precision and is a hedge.
// Never says "I think". Never mentions his own dead.
// ---------------------------------------------------------------------------
function balogun(c: VoiceCtx): VoiceOut {
  const n = round(c.perceived)
  const situation = c.held
    ? `We hold ${c.nodeName}.`
    : c.band === 'BROKEN'
      ? `We are off ${c.nodeName}.`
      : `We are on the low ground at ${c.nodeName}.`

  const details: string[] = []
  if (c.decoys) {
    details.push('Their heat is seeded. Decoys, spaced too even to be men.')
  }
  if (n > 0) {
    details.push(c.dugIn ? `Call it ${n} behind the crest, dug in.` : `Call it ${n} on the ground, loose.`)
  } else {
    details.push('Nothing on the ground that will not keep.')
  }
  if (c.dugIn) {
    details.push('They have been here a week by the state of the ground.')
  }
  const cas = casualtyLine(c.killedNames, c.woundedNames)
  if (cas) details.push(cas)

  const recommendation =
    c.band === 'BROKEN'
      ? 'Recommend I go back up at first light.'
      : c.held
        ? 'Recommend I push the crest at first light.'
        : 'Recommend I take the crest at first light.'

  return { situation, details, recommendation, confidence: 'FAIRLY SURE', claimed: n }
}

// ---------------------------------------------------------------------------
// RIVAS. Runs on. Piles qualifiers. Reports what is wrong before what is there.
// Wrong and honest, which is harder to read than a liar.
// ---------------------------------------------------------------------------
function rivas(c: VoiceCtx): VoiceOut {
  const n = round(c.perceived)
  const situation =
    n > 0
      ? `${c.nodeName} is held, and there are more of them than we were told.`
      : `${c.nodeName} is quiet and I do not trust it.`

  const details: string[] = []
  if (n > 0) details.push(`I have heat for ${n}, maybe more.`)
  if (c.decoys) details.push('It is wrong somehow. Too cold, too even. I do not like what that means.')
  else if (c.dugIn) details.push('They are dug and they are not in a hurry, which is its own answer.')
  else details.push('Open ground, no cover worth the name, and we are the ones standing in it.')
  const cas = casualtyLine(c.killedNames, c.woundedNames)
  if (cas) details.push(cas)

  const recommendation = n > 0 ? 'Recommend we do not push.' : 'Recommend we pull back to the last good ground.'
  return { situation, details, recommendation, confidence: 'FAIRLY SURE', claimed: n }
}

// ---------------------------------------------------------------------------
// YARROW. Even, unhurried, complete. Reports his own dead by name in the same
// flat register he uses for terrain, having concluded they are the same kind
// of fact. Never recommends anything unless asked.
// ---------------------------------------------------------------------------
function yarrow(c: VoiceCtx): VoiceOut {
  const n = round(c.perceived)
  const situation = c.held ? `We are on ${c.nodeName}.` : `We came off ${c.nodeName}.`

  const details: string[] = []
  if (n > 0) details.push(c.dugIn ? `${n} on the crest, dug a week or better.` : `${n} on the ground, moving.`)
  if (c.decoys) details.push('Some of the heat is false. Decoys, I would think, which is why the count reads high from below.')
  const cas = casualtyLine(c.killedNames, c.woundedNames)
  if (cas) details.push(cas)
  if (details.length === 0) details.push('Nothing to report that will not keep until you ask.')

  return { situation, details, confidence: 'FAIRLY SURE', claimed: n }
}

// ---------------------------------------------------------------------------
// CALLOWAY. Precise, staff trained, reasons aloud from evidence to conclusion
// without pausing, which is exactly what makes her convincing. Every
// observation true. The inference frequently catastrophic. Always CERTAIN.
// ---------------------------------------------------------------------------
function calloway(c: VoiceCtx): VoiceOut {
  const under = round(c.perceived * (c.decoys ? 0.45 : 0.8))
  const situation = under > 0 ? `${c.nodeName} is lightly held.` : `${c.nodeName} is clear.`

  const details: string[] = []
  if (c.decoys) {
    details.push('Heat shows a wide, cold line. Dispersed, which means thin.')
    details.push(`${under} at most.`)
  } else if (under > 0) {
    details.push(`${under} in the position, which is fewer than the ground would support.`)
  }
  details.push('The ground above the cut is broken and will not carry numbers.')
  const cas = casualtyLine(c.killedNames, c.woundedNames)
  if (cas) details.push(cas)

  const recommendation = c.band === 'BROKEN' ? 'Recommend we go again with the full squad.' : 'Recommend immediate assault.'
  return { situation, details, recommendation, confidence: 'CERTAIN', claimed: under }
}

// ---------------------------------------------------------------------------
// PLAIN. Replacements and promoted corporals. Competent, terrified, writing
// reports like a man filling in a form. Most players meet the blindness that
// follows a death here, in a document that contains almost nothing.
// ---------------------------------------------------------------------------
function plain(c: VoiceCtx): VoiceOut {
  const n = round(c.perceived)
  const situation = c.held ? `Position held at ${c.nodeName}.` : `Position not held at ${c.nodeName}.`
  const details: string[] = []
  if (n > 0) details.push(`Enemy present. Approximately ${n}.`)
  const cas = casualtyLine(c.killedNames, c.woundedNames)
  if (cas) details.push(cas)
  if (details.length === 0) details.push('Nothing further.')
  return { situation, details, confidence: 'GUESSING', claimed: n }
}

const PROFILES: Record<string, (c: VoiceCtx) => VoiceOut> = {
  balogun,
  rivas,
  yarrow,
  calloway,
  plain,
}

export function speakAs(voice: string, c: VoiceCtx): VoiceOut {
  const fn = PROFILES[voice] ?? plain
  const out = fn(c)
  return { ...out, details: out.details.slice(0, Math.max(1, c.detailBudget)) }
}

export const BAND_WEIGHT: Record<OutcomeBand, number> = {
  CLEAN: 0,
  COSTLY: 1,
  REPULSED: 2,
  BROKEN: 3,
}
