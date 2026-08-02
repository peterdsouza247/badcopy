import type { Soldier, Squad, TraitId } from '../engine/types'

interface Seed {
  id: string
  name: string
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

  { id: 'kolba', name: 'Nils Kolba', rank: 'Corporal', squadId: 'sq1', leader: false, traits: ['green'], voice: 'plain', born: 2116, face: 7 },
  { id: 'tsai', name: 'Ren Tsai', rank: 'Rifleman', squadId: 'sq1', leader: false, traits: [], voice: 'plain', born: 2119, face: 14 },
  { id: 'deyn', name: 'Mara Deyn', rank: 'Rifleman', squadId: 'sq1', leader: false, traits: [], voice: 'plain', born: 2118, face: 19 },
  {
    id: 'aduba',
    name: 'Sena Aduba',
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
  { id: 'sarno', name: 'Jarek Sarno', rank: 'Rifleman', squadId: 'sq1', leader: false, traits: [], voice: 'plain', born: 2117, face: 5 },

  { id: 'rusk', name: 'Tam Rusk', rank: 'Corporal', squadId: 'sq2', leader: false, traits: ['green'], voice: 'plain', born: 2114, face: 9 },
  { id: 'merrick', name: 'Cole Merrick', rank: 'Rifleman', squadId: 'sq2', leader: false, traits: [], voice: 'plain', born: 2120, face: 16 },
  { id: 'sowa', name: 'Dana Sowa', rank: 'Rifleman', squadId: 'sq2', leader: false, traits: [], voice: 'plain', born: 2118, face: 22 },
  { id: 'tobin', name: 'Aled Tobin', rank: 'Rifleman', squadId: 'sq2', leader: false, traits: [], voice: 'plain', born: 2121, face: 30 },
  { id: 'ives', name: 'Pia Ives', rank: 'Rifleman', squadId: 'sq2', leader: false, traits: [], voice: 'plain', born: 2119, face: 2 },

  { id: 'nayar', name: 'Sunil Nayar', rank: 'Corporal', squadId: 'sq3', leader: false, traits: [], voice: 'plain', born: 2115, face: 12 },
  { id: 'quist', name: 'Lena Quist', rank: 'Rifleman', squadId: 'sq3', leader: false, traits: [], voice: 'plain', born: 2120, face: 18 },
  { id: 'bel', name: 'Kai Bel', rank: 'Rifleman', squadId: 'sq3', leader: false, traits: [], voice: 'plain', born: 2121, face: 25 },
  { id: 'ahn', name: 'Hyun Ahn', rank: 'Rifleman', squadId: 'sq3', leader: false, traits: [], voice: 'plain', born: 2119, face: 8 },

  { id: 'dray', name: 'Esta Dray', rank: 'Corporal', squadId: 'sq4', leader: false, traits: [], voice: 'plain', born: 2113, face: 20 },
  { id: 'fen', name: 'Cira Fen', rank: 'Rifleman', squadId: 'sq4', leader: false, traits: [], voice: 'plain', born: 2122, face: 28 },
  { id: 'okwe', name: 'Nnamdi Okwe', rank: 'Rifleman', squadId: 'sq4', leader: false, traits: [], voice: 'plain', born: 2118, face: 4 },
  { id: 'sant', name: 'Vero Sant', rank: 'Rifleman', squadId: 'sq4', leader: false, traits: [], voice: 'plain', born: 2120, face: 15 },
  { id: 'larke', name: 'Fitz Larke', rank: 'Rifleman', squadId: 'sq4', leader: false, traits: [], voice: 'plain', born: 2117, face: 23 },
]

export function buildSoldiers(): Record<string, Soldier> {
  const out: Record<string, Soldier> = {}
  for (const s of SEEDS) {
    out[s.id] = {
      id: s.id,
      name: s.name,
      shortName: surname(s.name),
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
  'Sofia Marchetti',
  'Otto Vantz',
  'Mei Chey',
  'Dara Aurel',
  'Bern Sorn',
  'Tarek Idris',
  'Wren Kesh',
  'Ana Molt',
  'Gil Ferreira',
  'Rula Ostrow',
  'Joel Adeyemi',
  'Elsa Tarn',
]

/**
 * One rule for names, applied everywhere.
 *
 *   Radio traffic, board, vitals, orders, decisions -> SURNAME, uppercase.
 *     That is how people are addressed on a net.
 *   Roster and name cards -> rank and full name.
 *     The formal register, used exactly twice: when you look someone up, and
 *     when they are dead.
 */
export function surname(fullName: string) {
  return fullName.trim().split(/\s+/).slice(-1)[0].toUpperCase()
}

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
