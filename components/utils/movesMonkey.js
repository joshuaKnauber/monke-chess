import { getPiece } from "./helpers";
import { removeImpossible } from "./helpers";

export default function movesMonkey(gameState, piece){
  if(piece.x === -1 || piece.x === 8){
    return movesMonkeyJail(gameState,[piece.x, piece.y], piece)
  }
  else{
    return movesMonkeyNoJail(gameState, piece)
  }
}

function movesMonkeyNoJail(gameState, piece) {
 
  let moves = [[piece.x + 1, piece.y], [piece.x - 1, piece.y],[piece.x, piece.y + 1],[piece.x + 1, piece.y + 1], [piece.x - 1, piece.y + 1],[piece.x, piece.y - 1], [piece.x + 1, piece.y - 1], [piece.x - 1, piece.y - 1]]
  moves = moves.filter(move => {
    if (getPiece(gameState, move[0],move[1])) {
      return false
    }
    return true
  })

  
  let foundMoves = [[piece.x,piece.y]]
  foundMoves = swing(gameState, [piece.x,piece.y], foundMoves)

  moves = [...foundMoves, ...moves]
  moves = removeImpossible(gameState, moves, piece);

  let swingyboi = movesMonkeyJail(gameState, [piece.x,piece.y], piece)
  swingyboi.push([piece.x,piece.y])
  let jail = [getPiece(gameState, -1, 3),getPiece(gameState, -1, 4),getPiece(gameState, 8, 3),getPiece(gameState, 8, 4)]
  swingyboi.forEach(move => {
    if (move[0] === 0 && move[1] === 3 && jail[0] && jail[0].white === gameState.whitesTurn && jail[0].hasBanana === true) {
      console.log(move,movesMonkeyJail(gameState, move, piece))
      if(movesMonkeyJail(gameState, move, piece).length){
       moves.push([-1,3])
      }
    }else if (move[0] === 0 && move[1] === 4 && jail[1] && jail[1].white === gameState.whitesTurn && jail[1].hasBanana === true) {
      console.log(move,movesMonkeyJail(gameState, move, piece))
      if(movesMonkeyJail(gameState, move, piece).length){
       moves.push([-1,4])
      }
    }else if (move[0] === 7 && move[1] === 3 && jail[2] && jail[2].white === gameState.whitesTurn && jail[2].hasBanana === true) {
      console.log(move,movesMonkeyJail(gameState, move, piece))
      if(movesMonkeyJail(gameState, move, piece).length){
        moves.push([8,3])
      }
    }else if (move[0] === 7 && move[1] === 4 && jail[3] && jail[3].white === gameState.whitesTurn && jail[3].hasBanana === true) {
      console.log(move,movesMonkeyJail(gameState, move, piece))
      if(movesMonkeyJail(gameState, move, piece).length){
        moves.push([8,4])
      }
    }
  })

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

function movesMonkeyJail(gameState, square, piece) {

  let moves = []
  let foundMoves = [square]
  foundMoves = swing(gameState, square, foundMoves)

  moves = [...foundMoves, ...moves]
  moves = removeImpossible(gameState, moves, {...piece,x:square[0],y:square[1]});

  return moves
}

const includesArray = (data, arr) => {
  return data.some(e => Array.isArray(e) && e.every((o, i) => Object.is(arr[i], o)));
}

