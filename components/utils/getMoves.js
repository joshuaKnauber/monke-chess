import movesBear from "./movesBear"
import movesFish from "./movesFish"
import movesRook from "./movesRook"

export default function getMoves(gameState, fromTileId) {
  const [x, y] = fromTileId.split(";").map(Number)
  const piece = gameState.board.find(element => element.x === x && element.y === y)
  if (piece) {
    switch (piece.type) {
      case "rook":
        return movesRook(gameState, piece)
      case "fish":
        return movesFish(gameState, piece)
      case "bear":
        return movesBear(gameState, piece)
      default:
        return []
    }
  }
  return []
}