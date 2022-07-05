export const getPiece = (gameState, x, y) => {
  return gameState.board.find(element => element.x === x && element.y === y)
}


export const removeImpossible = (gameState, moves) => {
  moves = moves.filter(move => {
    if (!(move[1] < 0 || move[1] > 7 || move[2] < 0 || move[2] > 7)) {
      let target = getPiece(gameState, move[0], move[1])
      if (target && target.white === gameState.whitesTurn && target.white !== null) {
        return false
      }
      return true
    }
    return false
  }) 
  return moves
}
