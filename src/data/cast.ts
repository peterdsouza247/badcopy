import type { Soldier, Squad, TraitId } from '../engine/types'

interface Seed {
  id: string
  name: string
  shortName: string
  rank: string
  squadId: string
  leader: boolean
  traits: TraitId[]
  voice: string
  born: number
  face: number
  thread?: string
}

const SEEDS: Seed[] = [
  {
    id: 'balogun',
    name: 'Tunde Balogun',
    shortName: 'BALOGUN',
    rank: 'Sergeant',
    squadId: 'sq1',
    leader: true,
    traits: ['sharp', 'proud'],
    voice: 'balogun',
    born: 2107,
    face: 11,
    thread:
      'Two transfer requests to 2nd Battalion. Both refused, both by the same signature. His brother Femi is a rifleman there.',
  },
  {
    id: 'yarrow',
    name: 'Dov Yarrow',
    shortName: 'YARROW',
    rank: 'Sergeant',
    squadId: 'sq2',
    leader: true,
    traits: ['cool', 'slow'],
    voice: 'yarrow',
    born: 2090,
    face: 3,
    thread:
      'Twenty two years in. Rotation processed, transport booked, out on sol 10. The whole company knows the number and nobody says it aloud.',
  },
  {
    id: 'rivas',
    name: 'Delia Rivas',
    shortName: 'RIVAS',
    rank: 'Corporal',
    squadId: 'sq3',
    leader: true,
    traits: ['alarmist', 'loyal'],
    voice: 'rivas',
    born: 2112,
    face: 24,
    thread:
      'Demoted twice, both times for pulling her people out without orders. She was right once. Nobody has ever told her which time.',
  },
  {
    id: 'calloway',
    name: 'Ines Calloway',
    shortName: 'CALLOWAY',
    rank: 'Lieutenant',
    squadId: 'sq4',
    leader: true,
    traits: ['sharp', 'certain'],
    voice: 'calloway',
    born: 2115,
    face: 31,
    thread:
      'Transferred from Staff at Pavonis eleven days ago. Has never lost anyone. Does not yet know that this is luck.',
  },

  { id: 'kolba', name: 'Nils Kolba', shortName: 'KOLBA', rank: 'Corporal', squadId: 'sq1', leader: false, traits: ['green'], voice: 'plain', born: 2116, face: 7 },
  { id: 'tsai', name: 'R. Tsai', shortName: 'TSAI', rank: 'Rifleman', squadId: 'sq1', leader: false, traits: [], voice: 'plain', born: 2119, face: 14 },
  { id: 'deyn', name: 'M. Deyn', shortName: 'DEYN', rank: 'Rifleman', squadId: 'sq1', leader: false, traits: [], voice: 'plain', born: 2118, face: 19 },
  {
    id: 'aduba',
    name: 'Sena Aduba',
    shortName: 'ADUBA',
    rank: 'Rifleman',
    squadId: 'sq1',
    leader: false,
    traits: ['green'],
    voice: 'plain',
    born: 2122,
    face: 27,
    thread:
      'Enlisted at Ascraeus. The record says nineteen. The record is wrong by two years and nobody checked.',
  },
  { id: 'sarno', name: 'J. Sarno', shortName: 'SARNO', rank: 'Rifleman', squadId: 'sq1', leader: false, traits: [], voice: 'plain', born: 2117, face: 5 },

  { id: 'rusk', name: 'Tam Rusk', shortName: 'RUSK', rank: 'Corporal', squadId: 'sq2', leader: false, traits: ['green'], voice: 'plain', born: 2114, face: 9 },
  { id: 'merrick', name: 'T. Merrick', shortName: 'MERRICK', rank: 'Rifleman', squadId: 'sq2', leader: false, traits: [], voice: 'plain', born: 2120, face: 16 },
  { id: 'sowa', name: 'D. Sowa', shortName: 'SOWA', rank: 'Rifleman', squadId: 'sq2', leader: false, traits: [], voice: 'plain', born: 2118, face: 22 },
  { id: 'tobin', name: 'A. Tobin', shortName: 'TOBIN', rank: 'Rifleman', squadId: 'sq2', leader: false, traits: [], voice: 'plain', born: 2121, face: 30 },
  { id: 'ives', name: 'P. Ives', shortName: 'IVES', rank: 'Rifleman', squadId: 'sq2', leader: false, traits: [], voice: 'plain', born: 2119, face: 2 },

  { id: 'nayar', name: 'S. Nayar', shortName: 'NAYAR', rank: 'Corporal', squadId: 'sq3', leader: false, traits: [], voice: 'plain', born: 2115, face: 12 },
  { id: 'quist', name: 'L. Quist', shortName: 'QUIST', rank: 'Rifleman', squadId: 'sq3', leader: false, traits: [], voice: 'plain', born: 2120, face: 18 },
  { id: 'bel', name: 'K. Bel', shortName: 'BEL', rank: 'Rifleman', squadId: 'sq3', leader: false, traits: [], voice: 'plain', born: 2121, face: 25 },
  { id: 'ahn', name: 'H. Ahn', shortName: 'AHN', rank: 'Rifleman', squadId: 'sq3', leader: false, traits: [], voice: 'plain', born: 2119, face: 8 },

  { id: 'dray', name: 'E. Dray', shortName: 'DRAY', rank: 'Corporal', squadId: 'sq4', leader: false, traits: [], voice: 'plain', born: 2113, face: 20 },
  { id: 'fen', name: 'C. Fen', shortName: 'FEN', rank: 'Rifleman', squadId: 'sq4', leader: false, traits: [], voice: 'plain', born: 2122, face: 28 },
  { id: 'okwe', name: 'N. Okwe', shortName: 'OKWE', rank: 'Rifleman', squadId: 'sq4', leader: false, traits: [], voice: 'plain', born: 2118, face: 4 },
  { id: 'sant', name: 'V. Sant', shortName: 'SANT', rank: 'Rifleman', squadId: 'sq4', leader: false, traits: [], voice: 'plain', born: 2120, face: 15 },
  { id: 'larke', name: 'F. Larke', shortName: 'LARKE', rank: 'Rifleman', squadId: 'sq4', leader: false, traits: [], voice: 'plain', born: 2117, face: 23 },
]

export function buildSoldiers(): Record<string, Soldier> {
  const out: Record<string, Soldier> = {}
  for (const s of SEEDS) {
    out[s.id] = {
      id: s.id,
      name: s.name,
      shortName: s.shortName,
      rank: s.rank,
      squadId: s.squadId,
      leader: s.leader,
      traits: s.traits,
      read: 'unread',
      reportsSeen: 0,
      nerve: 'Steady',
      condition: 'Fresh',
      alive: true,
      face: s.face,
      born: s.born,
      voice: s.voice,
      thread: s.thread,
      threadRevealed: false,
    }
  }
  return out
}

export function buildSquads(): Record<string, Squad> {
  const defs: Array<[string, string, string, string]> = [
    ['sq1', '1st Squad', 'WOLFHOUND', 'balogun'],
    ['sq2', '2nd Squad', 'ANVIL', 'yarrow'],
    ['sq3', '3rd Squad', 'KESTREL', 'rivas'],
    ['sq4', '4th Squad', 'HARROW', 'calloway'],
  ]
  const out: Record<string, Squad> = {}
  for (const [id, name, callsign, leaderId] of defs) {
    out[id] = {
      id,
      name,
      callsign,
      leaderId,
      memberIds: SEEDS.filter((s) => s.squadId === id).map((s) => s.id),
      nodeId: 'bastion',
      intent: 'Use your judgement',
      beacons: 2,
      dark: false,
      standingOrder: 'HOLD',
    }
  }
  return out
}

/** Names drawn from theatre reserve when the roster refills. */
export const REPLACEMENT_NAMES = [
  'S. Marchetti',
  'O. Vantz',
  'M. Chey',
  'D. Aurel',
  'B. Sorn',
  'T. Idris',
  'W. Kesh',
  'A. Molt',
  'G. Ferreira',
  'R. Ostrow',
  'J. Adeyemi',
  'E. Tarn',
]

/**
 * The sol on which each leader's thread comes out. Until then their best
 * conversation branch is locked, because you do not yet know the thing that
 * would make it land.
 */
export const THREAD_SOL: Record<string, number> = {
  yarrow: 1,
  balogun: 11,
  rivas: 13,
  calloway: 16,
}
