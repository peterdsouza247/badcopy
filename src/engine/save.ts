import type { GameState } from './types'

export const SAVE_VERSION = 3
const KEY = 'bad-copy:save'

type Migration = (s: Record<string, unknown>) => Record<string, unknown>

/**
 * Saves carry their version and migrate forward. Adding a field means adding a
 * migration, not breaking every campaign in progress.
 */
const MIGRATIONS: Record<number, Migration> = {
  1: (s) => ({ ...s, dust: false, version: 2 }),
  2: (s) => ({ ...s, casualties: s.casualties ?? [], version: 3 }),
}

export function persist(state: GameState) {
  try {
    const { toasts, ...rest } = state
    void toasts
    localStorage.setItem(KEY, JSON.stringify(rest))
  } catch {
    // Storage can be unavailable in private windows. A campaign that cannot be
    // saved is still a campaign that can be played.
  }
}

export function restore(): GameState | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    let data = JSON.parse(raw) as Record<string, unknown>
    let v = typeof data.version === 'number' ? data.version : 1
    while (v < SAVE_VERSION && MIGRATIONS[v]) {
      data = MIGRATIONS[v](data)
      v = data.version as number
    }
    if (v !== SAVE_VERSION) return null
    return { ...(data as unknown as GameState), toasts: [] }
  } catch {
    return null
  }
}

export function wipe() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // nothing to do
  }
}
