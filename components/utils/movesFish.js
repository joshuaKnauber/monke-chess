import movesQueen from "./movesQueen";
import { removeImpossible } from "./helpers";

export default function movesFish(gameState, piece) {

  if (piece.isQueen) {
    return movesQueen(gameState, piece);
  }

  let moves = [[piece.x + 1, piece.y], [piece.x - 1, piece.y]]

  if (piece.white) {
    if (piece.y < 7) {
      moves.push([piece.x, piece.y + 1],[piece.x + 1, piece.y + 1], [piece.x - 1, piece.y + 1])
    }
  } else {
    if (piece.y > 0) {
      moves.push([piece.x, piece.y - 1], [piece.x + 1, piece.y - 1], [piece.x - 1, piece.y - 1])
    }
  }

  moves = removeImpossible(gameState, moves);

  return moves
}