export const getPiece = (gameState, x, y) => {
  return gameState.board.find(element => element.x === x && element.y === y)
}


export const removeImpossible = (gameState, moves, piece) => {
  moves = moves.filter(move => {
    if (!(move[0] < 0 || move[0] > 7 || move[1] < 0 || move[1] > 7)) {
      let target = getPiece(gameState, move[0], move[1])
      if (target) {
        if (piece.white === null) {
          return false
        } else if (target.white === gameState.whitesTurn) {
          return false
        }
      }
      return true
    }
    return false
  }) 
  return moves
}