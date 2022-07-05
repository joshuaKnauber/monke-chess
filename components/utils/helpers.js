export const getPiece = (gameState, x, y) => {
  return gameState.board.find(element => element.x === x && element.y === y)
}


export const removeImpossible = (gameState, moves, piece) => {
  moves = moves.filter(move => {
    if (!(move[1] < 0 || move[1] > 7 || move[2] < 0 || move[2] > 7)) {
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


export const possibleJailMoves = (gameState, piece) => {
  let moves = []
  if (piece.y === 3) {
    if (!getPiece(gameState, piece.x, 4)) {
      moves.push([piece.x, 4])
    }
  } else {
    if (!getPiece(gameState, piece.x, 3)) {
      moves.push([piece.x, 3])
    }
  }
  return moves
}