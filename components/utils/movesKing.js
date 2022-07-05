import { possibleJailMoves } from "./helpers";
import { removeImpossible } from "./helpers";

export default function movesKing(gameState, piece) {
  if (piece.x > 7 || piece.x < 0) {
    return possibleJailMoves(gameState, piece);
  }

  let moves = [[piece.x + 1, piece.y], [piece.x - 1, piece.y],[piece.x, piece.y + 1],[piece.x + 1, piece.y + 1], [piece.x - 1, piece.y + 1],[piece.x, piece.y - 1], [piece.x + 1, piece.y - 1], [piece.x - 1, piece.y - 1]]

  moves = removeImpossible(gameState, moves, piece);

  return moves
}