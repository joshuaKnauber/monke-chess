import { useEffect, useRef, useState } from 'react'
import styles from '../styles/Board.module.css'
import { getPiece } from './utils/helpers'

export default function Tile({ x, y, canMove, possibleMoves, gameState, selectTile, selectedId }) {

  const [dragging, setDragging] = useState(false)
  const [mousePos, setMousePos] = useState([0, 0])
  const [size, setSize] = useState(0)

  const [piece, setPiece] = useState(null)

  const tileId = `${x}-${y}`
  const isPossibleMove = possibleMoves.find(move => move[0] === x && move[1] === y) ? true : false

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
    console.log(x, y, newPiece)
    if (newPiece) {
      setPiece(newPiece)
    } else {
      setPiece(null)
    }
  }, [gameState])

  let imgStyle = {}
  if (dragging) { imgStyle = {
    left: mousePos[0], top: mousePos[1],
    width: size * 1.25, height: size * 1.25,
  } }

  return (
    <div onMouseUp={tileMouseUp}
      onDrop={onDrop}
      onDragOver={(e) => { e.preventDefault() }}
      className={`
        ${styles.tile}
        ${(x + y) % 2 && styles.black}
        ${(x < 0 || x > 7) && styles.jail}
        ${(selectedId === tileId) && styles.selected}
        ${isPossibleMove && styles.possibleMove}
      `}>
      {piece &&
        <div className={`${styles.piece} ${dragging ? styles.draggingPiece : ''}`}
          style={imgStyle}
          draggable={canMove}
          onDragStart={onDragStart}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
        >
          <p style={{ filter: piece.white ? "invert(1)" : "unset" }}>
            {piece.type}
          </p>
        </div>}
    </div>
  );
}