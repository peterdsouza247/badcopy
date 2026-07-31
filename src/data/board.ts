import type { BoardEdge, BoardNode } from '../engine/types'

/**
 * Noctis Labyrinthus. Coordinates are on a 1000 by 620 canvas.
 * Comms state is a property of terrain, not of the clock. A canyon is a place
 * where your people stop existing.
 */
const RAW: Array<Omit<BoardNode, 'beacon'>> = [
  { id: 'bastion', name: 'Bastion', x: 90, y: 300, comms: 'CLEAR', truthEnemy: 0, truthDugIn: false, truthDecoys: false },
  { id: 'lowerchain', name: 'Lower Chain', x: 215, y: 218, comms: 'CLEAR', truthEnemy: 0, truthDugIn: false, truthDecoys: false },
  { id: 'marker2', name: 'Marker 2', x: 232, y: 400, comms: 'CLEAR', truthEnemy: 6, truthDugIn: false, truthDecoys: false },
  { id: 'tower6', name: 'Tower 6', x: 350, y: 140, comms: 'RELAYED', truthEnemy: 8, truthDugIn: false, truthDecoys: false },
  { id: 'halloran', name: 'Halloran Cut', x: 400, y: 300, comms: 'CLEAR', truthEnemy: 30, truthDugIn: true, truthDecoys: true },
  { id: 'stair', name: "Pilgrim's Stair", x: 372, y: 470, comms: 'RELAYED', truthEnemy: 4, truthDugIn: false, truthDecoys: false },
  { id: 'shelf', name: 'The Shelf', x: 540, y: 210, comms: 'RELAYED', truthEnemy: 12, truthDugIn: true, truthDecoys: false },
  { id: 'cistern', name: 'The Cistern', x: 560, y: 380, comms: 'CLEAR', truthEnemy: 0, truthDugIn: false, truthDecoys: false },
  { id: 'coldharbour', name: 'Cold Harbour', x: 505, y: 545, comms: 'DARK', truthEnemy: 9, truthDugIn: false, truthDecoys: true },
  { id: 'marker4', name: 'Marker 4', x: 690, y: 300, comms: 'THIN', truthEnemy: 18, truthDugIn: true, truthDecoys: true },
  { id: 'graben7', name: 'Graben 7', x: 700, y: 150, comms: 'THIN', truthEnemy: 14, truthDugIn: false, truthDecoys: false },
  { id: 'sink', name: 'The Sink', x: 720, y: 480, comms: 'DARK', truthEnemy: 26, truthDugIn: true, truthDecoys: true },
  { id: 'marker6', name: 'Marker 6', x: 860, y: 240, comms: 'DARK', truthEnemy: 41, truthDugIn: true, truthDecoys: true },
  { id: 'tower11', name: 'Tower 11', x: 880, y: 420, comms: 'THIN', truthEnemy: 11, truthDugIn: false, truthDecoys: false },
]

export const EDGES: BoardEdge[] = [
  { from: 'bastion', to: 'lowerchain' },
  { from: 'bastion', to: 'marker2' },
  { from: 'lowerchain', to: 'tower6' },
  { from: 'lowerchain', to: 'halloran' },
  { from: 'marker2', to: 'halloran' },
  { from: 'marker2', to: 'stair' },
  { from: 'tower6', to: 'shelf' },
  { from: 'halloran', to: 'shelf' },
  { from: 'halloran', to: 'cistern' },
  { from: 'stair', to: 'cistern' },
  { from: 'stair', to: 'coldharbour' },
  { from: 'cistern', to: 'marker4' },
  { from: 'cistern', to: 'coldharbour' },
  { from: 'shelf', to: 'graben7' },
  { from: 'shelf', to: 'marker4' },
  { from: 'coldharbour', to: 'sink' },
  { from: 'marker4', to: 'graben7' },
  { from: 'marker4', to: 'sink' },
  { from: 'marker4', to: 'marker6' },
  { from: 'graben7', to: 'marker6' },
  { from: 'sink', to: 'tower11' },
  { from: 'marker6', to: 'tower11' },
]

export function buildNodes(): Record<string, BoardNode> {
  const out: Record<string, BoardNode> = {}
  for (const n of RAW) out[n.id] = { ...n, beacon: false }
  return out
}

export function neighbours(nodeId: string): string[] {
  const out: string[] = []
  for (const e of EDGES) {
    if (e.from === nodeId) out.push(e.to)
    if (e.to === nodeId) out.push(e.from)
  }
  return Array.from(new Set(out))
}
