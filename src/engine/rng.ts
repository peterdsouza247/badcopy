/**
 * Deterministic RNG. A game about believing your instruments cannot have the
 * instruments be genuinely random, so every roll is derived from the campaign
 * seed plus a call counter.
 */

function xmur3(str: string) {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return h >>> 0
  }
}

function mulberry32(a: number) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export class Rng {
  private next: () => number

  constructor(seed: string) {
    this.next = mulberry32(xmur3(seed)())
  }

  float() {
    return this.next()
  }

  /** Inclusive integer range. */
  int(min: number, max: number) {
    return Math.floor(this.next() * (max - min + 1)) + min
  }

  d100() {
    return this.int(1, 100)
  }

  pick<T>(items: readonly T[]): T {
    return items[Math.floor(this.next() * items.length)]
  }

  shuffle<T>(items: T[]): T[] {
    const out = items.slice()
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1))
      ;[out[i], out[j]] = [out[j], out[i]]
    }
    return out
  }
}

/** A fresh stream keyed to a specific moment, so replays match exactly. */
export function streamFor(seed: string, sol: number, turn: number, tag: string) {
  return new Rng(`${seed}:${sol}:${turn}:${tag}`)
}

export function newSeed() {
  return Math.random().toString(36).slice(2, 10).toUpperCase()
}
