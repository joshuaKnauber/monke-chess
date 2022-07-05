import { base64urlEncodeWithoutPadding } from "@firebase/util";
import { getPiece } from "./helpers";
import { removeImpossible } from "./helpers";

export default function movesMonkey(gameState, piece) {
    let moves = [[piece.x + 1, piece.y], [piece.x - 1, piece.y],[piece.x, piece.y + 1],[piece.x + 1, piece.y + 1], [piece.x - 1, piece.y + 1],[piece.x, piece.y - 1], [piece.x + 1, piece.y - 1], [piece.x - 1, piece.y - 1]]


    
    moves = removeImpossible(gameState, moves);

  return moves
}


function swing(gamestate, square, foundMoves, finalMoves) {

    if (getPiece(gameState,piece.x - 1, piece.y - 1)) {
        if (/*[square[0] - 2, square[1] - 2] is not in foundMoves or finalMoves, a piece or outside the boeard*/) {
            let temp = swing(gamestate, [square[0] - 2, square[1] - 2], foundMoves, finalMoves)
            foundMoves = foundMoves.concat(temp[0])
            finalMoves = finalMoves.concat(temp[1])
            
        }
    }
    if (getPiece(gameState,piece.x - 1, piece.y + 0)) {
        if (/*[square[0] - 2, square[1] + 0] is not in foundMoves or finalMoves*/) {
            let temp = swing(gamestate, [square[0] - 2, square[1] + 0], foundMoves, finalMoves)
            foundMoves = foundMoves.concat(temp[0])
            finalMoves = finalMoves.concat(temp[1])
            
        }
    }
    if (getPiece(gameState,piece.x - 1, piece.y + 1)) {
        if (/*[square[0] - 2, square[1] + 2] is not in foundMoves or finalMoves*/) {
            let temp = swing(gamestate, [square[0] - 2, square[1] + 2], foundMoves, finalMoves)
            foundMoves = foundMoves.concat(temp[0])
            finalMoves = finalMoves.concat(temp[1])
            
        }
    }
    if (getPiece(gameState,piece.x + 0, piece.y + 1)) {
        if (/*[square[0] + 0, square[1] + 2] is not in foundMoves or finalMoves*/) {
            let temp = swing(gamestate, [square[0] + 0, square[1] + 2], foundMoves, finalMoves)
            foundMoves = foundMoves.concat(temp[0])
            finalMoves = finalMoves.concat(temp[1])
            
        }
    }
    if (getPiece(gameState,piece.x + 1, piece.y - 1)) {
        if (/*[square[0] + 2, square[1] - 2] is not in foundMoves or finalMoves*/) {
            let temp = swing(gamestate, [square[0] + 2, square[1] - 2], foundMoves, finalMoves)
            foundMoves = foundMoves.concat(temp[0])
            finalMoves = finalMoves.concat(temp[1])
            
        }
    }
    if (getPiece(gameState,piece.x + 1, piece.y + 0)) {
        if (/*[square[0] + 2, square[1] + 0] is not in foundMoves or finalMoves*/) {
            let temp = swing(gamestate, [square[0] + 2, square[1] + 0], foundMoves, finalMoves)
            foundMoves = foundMoves.concat(temp[0])
            finalMoves = finalMoves.concat(temp[1])
            
        }
    }
    if (getPiece(gameState,piece.x + 1, piece.y + 1)) {
        if (/*[square[0] + 2, square[1] + 2] is not in foundMoves or finalMoves*/) {
            let temp = swing(gamestate, [square[0] + 2, square[1] + 2], foundMoves, finalMoves)
            foundMoves = foundMoves.concat(temp[0])
            finalMoves = finalMoves.concat(temp[1])
            
        }
    }
    if (getPiece(gameState,piece.x + 0, piece.y - 1)) {
        if (/*[square[0] + 0, square[1] - 2] is not in foundMoves or finalMoves*/) {
            let temp = swing(gamestate, [square[0] + 0, square[1] - 2], foundMoves, finalMoves)
            foundMoves = foundMoves.concat(temp[0])
            finalMoves = finalMoves.concat(temp[1])
            
        }
    }

    return [foundMoves, finalMoves]
}