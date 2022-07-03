export const getPiece = (gameState, x, y) => {
  return gameState.board.find(element => element.x === x && element.y === y)
}

export const getSurroundingMoves = (gameState, piece) => {
  let moves = []
  if (piece.x > 0) {
    moves.push([piece.x - 1, piece.y])
    if (piece.y > 0) {
      moves.push([piece.x - 1, piece.y - 1])
    }
    if (piece.y < 7) {
      moves.push([piece.x - 1, piece.y + 1])
    }
  }
  return moves
}