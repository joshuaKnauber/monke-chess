import { getSurroundingMoves } from "./helpers"

export default function movesBear(gameState, piece) {
  if (!piece.isDeployed) {
    return [
      [3, 3], [4, 3], [3, 4], [4, 4],
    ]
  }
  let moves = []
  moves = moves.concat(getSurroundingMoves(gameState, piece))
  return moves
}