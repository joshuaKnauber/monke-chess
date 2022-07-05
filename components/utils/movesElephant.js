import { getPiece } from "./helpers";
import { removeImpossible } from "./helpers";

export default function movesElephant(gameState, piece) {
    let moves = []

    if (!getPiece(gameState,piece.x - 1, piece.y - 1)) {
        moves.push([piece.x - 2, piece.y - 2])
    }
    if (!getPiece(gameState,piece.x - 1, piece.y + 1)) {
        moves.push([piece.x - 2, piece.y + 2])
    }
    if (!getPiece(gameState,piece.x + 1, piece.y - 1)) {
        moves.push([piece.x + 2, piece.y - 2])
    }
    if (!getPiece(gameState,piece.x + 1, piece.y + 1)) {
        moves.push([piece.x + 2, piece.y + 2])
    }
    
    moves = removeImpossible(gameState, moves, piece);

  return moves
}