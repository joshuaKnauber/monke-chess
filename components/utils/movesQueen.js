import { getPiece } from "./helpers";
import { removeImpossible } from "./helpers";

export default function movesQueen(gameState, piece) {
    let moves = []
    let possibleDirection = [true, true, true, true, true, true, true, true]
    let i = 1

    while (possibleDirection&& i<=8) {
        
        if (possibleDirection[0]) {
            moves.push([piece.x - i, piece.y - i])
        }
        if (possibleDirection[1]) {
            moves.push([piece.x - i, piece.y + 0])
        }
        if (possibleDirection[2]) {
            moves.push([piece.x - i, piece.y + i])
        }
        if (possibleDirection[3]) {
            moves.push([piece.x + 0, piece.y + i])
        }
        if (possibleDirection[4]) {
            moves.push([piece.x + i, piece.y - i])
        }
        if (possibleDirection[5]) {
            moves.push([piece.x + i, piece.y + 0])
        }
        if (possibleDirection[6]) {
            moves.push([piece.x + i, piece.y + i])
        }
        if (possibleDirection[7]) {
            moves.push([piece.x + 0, piece.y - i])
        }
        


        if (getPiece(gameState,piece.x - i, piece.y - i)) {
            possibleDirection[0] = false
        }
        if (getPiece(gameState,piece.x - i, piece.y + 0)) {
            possibleDirection[1] = false
        }
        if (getPiece(gameState,piece.x - i, piece.y + i)) {
            possibleDirection[2] = false
        }
        if (getPiece(gameState,piece.x + 0, piece.y + i)) {
            possibleDirection[3] = false
        }
        if (getPiece(gameState,piece.x + i, piece.y - i)) {
            possibleDirection[4] = false
        }
        if (getPiece(gameState,piece.x + i, piece.y + 0)) {
            possibleDirection[5] = false
        }
        if (getPiece(gameState,piece.x + i, piece.y + i)) {
            possibleDirection[6] = false
        }
        if (getPiece(gameState,piece.x + 0, piece.y - i)) {
            possibleDirection[7] = false
        }

        i++
    }

    
    moves = removeImpossible(gameState, moves, piece);

  return moves
}