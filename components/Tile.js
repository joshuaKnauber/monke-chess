import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import styles from '../styles/Board.module.css'
import { getPiece } from './utils/helpers'

import { images } from '../components/utils/importImages'

export default function Tile({ x, y, canMove, possibleMoves, gameState, selectTile, selectedId, lastMove }) {

  const [selectedPiece, setSelectedPiece] = useState(null)
  const [piece, setPiece] = useState(null)

  const tileId = `${x};${y}`
  const isPossibleMove = possibleMoves.find(move => move[0] === x && move[1] === y) ? true : false

  const isPlayerWhite = canMove === gameState.whitesTurn

  const tileMouseUp = (e) => {
    setTimeout(() => {
      if (!dragging) {
        selectTile(tileId)
      }
    }, 0)
  }

  const dragItem = useRef(null)
  const [initialPos, setInitialPos] = useState([0, 0])
  const [initiatedDrag, setInitiatedDrag] = useState(false)
  const [dragging, setDragging] = useState(false)

  const onMouseDown = (e) => {
    if (!piece || (piece && (piece.white !== isPlayerWhite && piece.white !== null))) return
    setInitiatedDrag(true)
  }

  function onMouseMove(e) {
    if (dragging) {
      e.preventDefault();
      
      let newPos = [e.clientX - initialPos[0], e.clientY - initialPos[1]]
      dragItem.current.style.transform = "translate3d(" + newPos[0] + "px, " + newPos[1] + "px, 0)";
    } else if (initiatedDrag) {
      selectTile(tileId)
      dragItem.current.classList.add(styles.dragging)
      setInitialPos([e.clientX, e.clientY])
      setDragging(true)
    }
  }

  const onMouseUp = () => {
    setInitiatedDrag(false)
  }
  
  const onDragEnd = () => {
    if (dragging) {
      dragItem.current.classList.remove(styles.dragging)
      dragItem.current.style.transform = "unset"
      setInitiatedDrag(false)
      setDragging(false)
      selectTile(null)
    }
  }

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onDragEnd)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onDragEnd)
    }
  }, [dragging, initialPos, initiatedDrag])

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
  let canSelectTile = canMove && piece && (piece.white === isPlayerWhite || piece.white === null)
  let isTileSelected = canMove && selectedId === tileId && canSelectTile
  let selectedIsOwn = canMove && selectedPiece && (selectedPiece.white === isPlayerWhite || selectedPiece.white === null)
  let isTilePossibleTarget = canMove && selectedIsOwn && isPossibleMove && piece && piece.white === !isPlayerWhite
  let isTilePossibleMove = canMove && selectedIsOwn && isPossibleMove && !isTilePossibleTarget

  let isFromTile = lastMove ? lastMove.from === tileId : false
  let isToTile = lastMove ? lastMove.to === tileId : false

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
        ${isFromTile && styles.moveFrom}
        ${isToTile && styles.moveTo}
      `}>
      <div className={`${styles.piece}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        ref={dragItem}
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