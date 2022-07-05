import movesBear from "./movesBear"
import movesFish from "./movesFish"
import movesRook from "./movesRook"
import movesElephant from "./movesElephant"
import movesQueen from "./movesQueen"
import movesKing from "./movesKing"
import movesMonkey from "./movesMonkey"

export default function getMoves(gameState, fromTileId) {
  const [x, y] = fromTileId.split(";").map(Number)
  const piece = gameState.board.find(element => element.x === x && element.y === y)
  if (piece) {
    switch (piece.type) {
      case "rook":
        return movesRook(gameState, piece)
      case "fish":
        return movesFish(gameState, piece)
      case "elephant":
        return movesElephant(gameState, piece)
      case "queen":
        return movesQueen(gameState, piece)
      case "king":
        return movesKing(gameState, piece)
      case "bear":
        return movesBear(gameState, piece)
      case "monkey":
        return movesMonkey(gameState, piece)
      default:
        return []
    }
  }
  return []
}