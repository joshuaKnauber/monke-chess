import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import styles from '../styles/Board.module.css'
import { getPiece } from './utils/helpers'

import { images } from '../components/utils/importImages'

export default function Tile({ x, y, canMove, possibleMoves, gameState, selectTile, selectedId }) {

  const [dragging, setDragging] = useState(false)
  const [mousePos, setMousePos] = useState([0, 0])
  const [size, setSize] = useState(0)

  const [selectedPiece, setSelectedPiece] = useState(null)
  const [piece, setPiece] = useState(null)

  const tileId = `${x}-${y}`
  const isPossibleMove = possibleMoves.find(move => move[0] === x && move[1] === y) ? true : false

  const isPlayerWhite = canMove === gameState.whitesTurn

  const tileMouseUp = (e) => {
    selectTile(tileId)
    e.stopPropagation()
  }

  const onDragStart = (e) => {
    console.log("drag")
    if (!canMove) return
    setMousePos([e.clientX, e.clientY])
    selectTile(tileId)
    setSize(e.target.clientWidth)
    setMousePos([e.clientX, e.clientY])
    setDragging(true)
    e.dataTransfer.setData("tileId", tileId)
  }

  const onDrag = (e) => {
    setMousePos([e.clientX, e.clientY])
  }

  const onDragEnd = (e) => {
    setDragging(false)
  }
  
  const onDrop = (e) => {
    if (!canMove) return
    // e.preventDefault()
    console.log("drop", tileId, e.dataTransfer.getData("tileId"))
    // selectTile(tileId)
    console.log("dropped", e.dataTransfer.getData("tileId"), "on", tileId)
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
      const [selectedX, selectedY] = selectedId.split("-").map(Number)
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

  return (
    <div onMouseUp={tileMouseUp}
      onDrop={onDrop}
      onDragOver={(e) => { e.preventDefault() }}
      className={`
        ${styles.tile}
        ${isTileBlack && styles.black}
        ${isTileJail && styles.jail}
        ${isTileSelected && styles.highlighted}
        ${isTilePossibleTarget && styles.highlighted}
        ${isTilePossibleMove && styles.possibleMove}
      `}>
      <div className={`${styles.piece} ${dragging ? styles.draggingPiece : ''}`}
        style={{ cursor: (piece?.white === isPlayerWhite || isTilePossibleMove || isTilePossibleTarget) ? 'pointer' : 'default' }}
        draggable={canMove}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
      >
        {piece && <Image
          src={images[`${piece.type}-${piece.white ? 'white' : 'black'}`]}
          alt="Picture of the author"
        />}
      </div>
    </div>
  );
}