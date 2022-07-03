import { getSurroundingMoves } from './helpers'

export default function movesRook(gameState, piece) {
  let moves = []
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (!(x === piece.x && y === piece.y)) {
        moves.push([x, y])
      }
    }
  }
  return moves
}