import { getPiece } from "./helpers";
import { removeImpossible } from "./helpers";

export default function movesKing(gameState, piece) {
  let moves = [[piece.x + 1, piece.y], [piece.x - 1, piece.y],[piece.x, piece.y + 1],[piece.x + 1, piece.y + 1], [piece.x - 1, piece.y + 1],[piece.x, piece.y - 1], [piece.x + 1, piece.y - 1], [piece.x - 1, piece.y - 1]]

  moves = removeImpossible(gameState, moves);

  return moves
}