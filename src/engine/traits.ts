import type { CommsState, Trait, TraitId } from './types'

export const TRAITS: Record<TraitId, Trait> = {
  sharp: {
    id: 'sharp',
    label: 'Sharp',
    plain: 'Notices things other people do not.',
    detailDelta: 1,
  },
  proud: {
    id: 'proud',
    label: 'Proud',
    plain: 'Will not tell you when he is losing.',
    hidesLosses: true,
  },
  alarmist: {
    id: 'alarmist',
    label: 'Alarmist',
    plain: 'Thinks things are worse than they are.',
    countScale: 1.5,
  },
  loyal: {
    id: 'loyal',
    label: 'Loyal',
    plain: 'Will tell you the truth even when she should not.',
    honestUnderPressure: true,
  },
  cool: {
    id: 'cool',
    label: 'Cool',
    plain: 'Says what he sees. Nothing more.',
    countScale: 1,
    seesThroughDecoys: true,
  },
  slow: {
    id: 'slow',
    label: 'Slow',
    plain: 'Takes his time getting word up.',
    reportDelay: 2,
  },
  certain: {
    id: 'certain',
    label: 'Certain',
    plain: 'Never admits to doubting herself.',
    forceConfidence: 'CERTAIN',
  },
  green: {
    id: 'green',
    label: 'Green',
    plain: 'New. Has not learned what matters yet.',
    detailDelta: -1,
    noRecommendation: true,
  },
}

export function traitsOf(ids: TraitId[]): Trait[] {
  return ids.map((id) => TRAITS[id])
}

/** Turns of delay before a transmission becomes readable. */
export const COMMS_LATENCY: Record<CommsState, number> = {
  CLEAR: 0,
  RELAYED: 1,
  THIN: 2,
  DARK: Infinity,
}

export const COMMS_BLURB: Record<CommsState, string> = {
  CLEAR: 'Direct line of sight. Word arrives as it is spoken.',
  RELAYED: 'Signal is hopping the Chain. A few minutes behind.',
  THIN: 'Satellite pass only. Windows are short and scheduled.',
  DARK: 'No path exists. Nothing in, nothing out.',
}

const ORDER: CommsState[] = ['CLEAR', 'RELAYED', 'THIN', 'DARK']

/** Dust season degrades every link by one step, permanently. */
export function degrade(state: CommsState, steps: number): CommsState {
  const i = Math.min(ORDER.indexOf(state) + steps, ORDER.length - 1)
  return ORDER[i]
}
