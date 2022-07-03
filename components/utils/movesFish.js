export default function movesFish(gameState, piece) {
  let moves = []
  if (piece.white) {
    if (piece.y < 7) {
      moves.push([piece.x, piece.y + 1])
    }
  } else {
    if (piece.y > 0) {
      moves.push([piece.x, piece.y - 1])
    }
  }
  return moves
}