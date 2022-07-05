import { getPiece } from "./helpers";
import { removeImpossible } from "./helpers";

export default function movesMonkey(gameState, piece) {
  
    let moves = [[piece.x + 1, piece.y], [piece.x - 1, piece.y],[piece.x, piece.y + 1],[piece.x + 1, piece.y + 1], [piece.x - 1, piece.y + 1],[piece.x, piece.y - 1], [piece.x + 1, piece.y - 1], [piece.x - 1, piece.y - 1]]
    let foundMoves = [[piece.x,piece.y]]
    foundMoves = swing(gameState, [piece.x,piece.y], foundMoves)

    moves = [...foundMoves, ...moves]

    moves = removeImpossible(gameState, moves, piece);

  return moves
}


function swing(gameState, originalSquare, foundMoves) {

  if (getPiece(gameState,originalSquare[0] - 1, originalSquare[1] - 1)) {
    let newSquare = [originalSquare[0] - 2, originalSquare[1] -2]
    foundMoves = letsSaveSomeTyping(gameState, newSquare, foundMoves)
  }
  if (getPiece(gameState,originalSquare[0] - 1, originalSquare[1] + 0)) {
    let newSquare = [originalSquare[0] - 2, originalSquare[1] + 0]
    foundMoves = letsSaveSomeTyping(gameState, newSquare, foundMoves)
  }
  if (getPiece(gameState,originalSquare[0] - 1, originalSquare[1] + 1)) {
      let newSquare = [originalSquare[0] - 2, originalSquare[1] + 2]
      foundMoves = letsSaveSomeTyping(gameState, newSquare, foundMoves)
  }
  if (getPiece(gameState,originalSquare[0] + 0, originalSquare[1] + 1)) {
    let newSquare = [originalSquare[0] + 0, originalSquare[1] + 2]
    foundMoves = letsSaveSomeTyping(gameState, newSquare, foundMoves)
  }
  if (getPiece(gameState,originalSquare[0] + 1, originalSquare[1] + 1)) {
      let newSquare = [originalSquare[0] + 2, originalSquare[1] + 2]
      foundMoves = letsSaveSomeTyping(gameState, newSquare, foundMoves)
  }
  if (getPiece(gameState,originalSquare[0] + 1, originalSquare[1] + 0)) {
      let newSquare = [originalSquare[0] + 2, originalSquare[1] + 0]
      foundMoves = letsSaveSomeTyping(gameState, newSquare, foundMoves)
  }
  if (getPiece(gameState,originalSquare[0] + 1, originalSquare[1] - 1)) {
      let newSquare = [originalSquare[0] + 2, originalSquare[1] - 2]
      foundMoves = letsSaveSomeTyping(gameState, newSquare, foundMoves)
  }
  if (getPiece(gameState,originalSquare[0] + 0, originalSquare[1] - 1)) {
      let newSquare = [originalSquare[0] + 0, originalSquare[1] - 2]
      foundMoves = letsSaveSomeTyping(gameState, newSquare, foundMoves)
  }
  
  return foundMoves

}

function letsSaveSomeTyping(gameState, newSquare, foundMoves) {
  if (!includesArray(foundMoves, newSquare)) {
    let otherPiece = getPiece(gameState,newSquare[0],newSquare[1]) 
    if (otherPiece && otherPiece.white!==gameState.whitesTurn) {
      foundMoves.push(newSquare)
    }else if(!otherPiece && !(newSquare[0] < 0 || newSquare[0] > 7 || newSquare[1] < 0 || newSquare[1] > 7)){
      foundMoves.push(newSquare)
      foundMoves = swing(gameState, newSquare, foundMoves)
      }
  }
  return foundMoves
}

const includesArray = (data, arr) => {
  return data.some(e => Array.isArray(e) && e.every((o, i) => Object.is(arr[i], o)));
}