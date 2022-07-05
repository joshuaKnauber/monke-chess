import { removeImpossible } from "./helpers"

export default function movesBear(gameState, piece) {
  if (!piece.isDeployed) {
    moves = [[3, 3], [4, 3], [3, 4], [4, 4]]
    return removeImpossible(gameState, moves, piece)
  }

  let moves = [[piece.x + 1, piece.y], [piece.x - 1, piece.y],[piece.x, piece.y + 1],[piece.x + 1, piece.y + 1], [piece.x - 1, piece.y + 1],[piece.x, piece.y - 1], [piece.x + 1, piece.y - 1], [piece.x - 1, piece.y - 1]]
  moves = removeImpossible(gameState, moves, piece);
  return moves
}