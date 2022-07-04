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

  const isTileBlack = (x + y) % 2
  const isTileJail = x < 0 || x > 7
  const isTileSelected = selectedId === tileId && piece && piece.white === isPlayerWhite
  const selectedIsOwn = selectedPiece && selectedPiece.white === isPlayerWhite
  const isTilePossibleTarget = selectedIsOwn && isPossibleMove && piece && piece.white === !isPlayerWhite
  const isTilePossibleMove = selectedIsOwn && isPossibleMove && !isTilePossibleTarget

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
      `}>
      <div className={`${styles.piece}`}
        style={{ cursor: (piece?.white === isPlayerWhite || isTilePossibleMove || isTilePossibleTarget) ? 'pointer' : 'default' }}
      >
        {piece && <Image
          src={images[pieceImg]}
          alt="Picture of the author"
        />}
      </div>
    </div>
  );
}