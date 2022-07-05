import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import styles from '../styles/Board.module.css'
import { getPiece } from './utils/helpers'

import { images } from '../components/utils/importImages'

export default function Tile({ x, y, canMove, possibleMoves, gameState, selectTile, selectedId }) {

  const [selectedPiece, setSelectedPiece] = useState(null)
  const [piece, setPiece] = useState(null)

  const tileId = `${x};${y}`
  const isPossibleMove = possibleMoves.find(move => move[0] === x && move[1] === y) ? true : false

  const isPlayerWhite = canMove === gameState.whitesTurn

  const tileMouseUp = (e) => {
    selectTile(tileId)
    e.stopPropagation()
  }

  useEffect(() => {
    const newPiece = getPiece(gameState, x, y)
    if (newPiece) {
      setPiece(newPiece)
    } else {
      setPiece(null)
    }
  }, [gameState])

  useEffect(() => {
    if (selectedId) {
      const [selectedX, selectedY] = selectedId.split(";").map(Number)
      const newPiece = getPiece(gameState, selectedX, selectedY)
      if (newPiece) {
        setSelectedPiece(newPiece)
      } else {
        setSelectedPiece(null)
      }
    } else {
      setSelectedPiece(null)
    }
  }, [selectedId])

  let isTileBlack = (x + y) % 2
  let isTileJail = x < 0 || x > 7
  let canSelectTile = piece && (piece.white === isPlayerWhite || piece.white === null)
  let isTileSelected = selectedId === tileId && canSelectTile
  let selectedIsOwn = selectedPiece && (selectedPiece.white === isPlayerWhite || selectedPiece.white === null)
  let isTilePossibleTarget = selectedIsOwn && isPossibleMove && piece && piece.white === !isPlayerWhite
  let isTilePossibleMove = selectedIsOwn && isPossibleMove && !isTilePossibleTarget

  let isJailAndJailable = !piece && gameState.jailablePiece && gameState.jailablePiece.white !== isPlayerWhite && isTileJail && ((gameState.whitesTurn && x > 7) || (!gameState.whitesTurn && x < 0))
  if (!isJailAndJailable && gameState.jailablePiece) {
    canSelectTile = false
    isTileSelected = false
    selectedIsOwn = false
    isTilePossibleTarget = false
    isTilePossibleMove = false
  }


  let pieceImg = ""
  if (piece) {
    if (piece.type === "bear") {
      pieceImg = "bear"
    } else {
      let addon = piece.type === "fish" && piece.isQueen ? "-queen" : ""
      addon = piece.type === "king" && piece.hasBanana ? "-banana" : addon
      pieceImg = `${piece.type}${addon}-${piece.white ? 'white' : 'black'}`
    }
  }

  return (
    <div onMouseUp={tileMouseUp}
      className={`
        ${styles.tile}
        ${isTileBlack && styles.black}
        ${isTileJail && styles.jail}
        ${isTileSelected && styles.highlighted}
        ${isTilePossibleTarget && styles.highlighted}
        ${isTilePossibleMove && styles.possibleMove}
        ${isJailAndJailable && styles.highlighted}
        ${isJailAndJailable && styles.possibleMove}
      `}>
      <div className={`${styles.piece}`}
        style={{ cursor: (canSelectTile || isJailAndJailable || isTilePossibleMove || isTilePossibleTarget) ? 'pointer' : 'default' }}
      >
        {piece && <Image
          src={images[pieceImg]}
          alt="Picture of the author"
        />}
      </div>
    </div>
  );
}