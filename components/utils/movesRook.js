import { getPiece } from "./helpers";

export default function movesRook(gameState, piece) {
  let moves = []
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      moves.push([x, y])
    }
  }
  moves = moves.filter(move => {
    let otherPiece = getPiece(gameState, move[0], move[1])
    if (otherPiece) {
      if (otherPiece.white !== gameState.whitesTurn) {
        if ((move[0] === piece.x && (move[1] === piece.y + 1 || move[1] === piece.y - 1)) || (move[1] === piece.y && (move[0] === piece.x + 1 || move[0] === piece.x - 1))) {
          return piece.canTake
        }
      }
      return false
    }
    return true
  })
  return moves
}