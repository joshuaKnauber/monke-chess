import { useEffect, useState } from 'react';
import styles from '../styles/Board.module.css'
import Tile from './Tile';
import getMoves from './utils/getMoves';
import { getPiece } from './utils/helpers';

export default function Board({ isPlayerWhite, isBothPlayers, gameState, updateGameState }) {

  const [selectedTileId, setSelectedTileId] = useState(null)
  const [possibleMoves, setPossibleMoves] = useState([])

  const canMove = isPlayerWhite === gameState.whitesTurn

  const tryMove = (fromTileId, toTileId) => {
    const [fromX, fromY] = fromTileId.split(";").map(Number)
    const [toX, toY] = toTileId.split(";").map(Number)
    const moves = getMoves(gameState, fromTileId)
    const canMoveHere = moves.find(move => move[0] === toX && move[1] === toY) ? true : false
    if (canMoveHere) {
      const newGameState = JSON.parse(JSON.stringify(gameState))
      // get moved piece
      let movedPiece = getPiece(newGameState, fromX, fromY)
      // remove pieces
      let tookPiece = false
      newGameState.board = newGameState.board.filter(element => {
        let isToPiece = (element.x === toX && element.y === toY)
        if (isToPiece) {
          tookPiece = true
          if (["king", "queen"].includes(element.type)) {
            newGameState.jailablePiece = {...element}
          }
        }
        return !isToPiece
      })
      // set rooks
      newGameState.board.forEach(element => {
        if (element.type === "rook") {
          if (element.white !== gameState.whitesTurn) {
            element.canTake = tookPiece
          } else {
            element.canTake = false
          }
        }
      })
      // find bear and switch white/black
      let bear = newGameState.board.find(element => element.type === "bear")
      if (bear) { bear.white = null }
      movedPiece.x = toX
      movedPiece.y = toY
      // set bear to deployed if moved
      if (movedPiece.type === "bear") { movedPiece.isDeployed = true }
      // fish queen
      if (movedPiece.type == "fish") {
        if ((movedPiece.white && movedPiece.y === 7) || (!movedPiece.white && movedPiece.y === 0)) {
          movedPiece.isQueen = true
        }
      }
      // check if one piece is already in jail if there is a jailable piece
      if (newGameState.jailablePiece) {
        let jailX = newGameState.jailablePiece.white ? -1 : 8
        let pieceInJail = newGameState.board.find(element => element.x === jailX)
        if (pieceInJail) {
          newGameState.jailablePiece.x = jailX
          newGameState.jailablePiece.y = pieceInJail.y === 3 ? 4 : 3
          newGameState.board.push(newGameState.jailablePiece)
          newGameState.jailablePiece = null
        }
      }
      // update game state
      if (!newGameState.jailablePiece) {
        newGameState.whitesTurn = !newGameState.whitesTurn
      }
      updateGameState(newGameState)
    }
  }

  const tryMoveToJail = (toTileId) => {
    if (gameState.jailablePiece.white === isPlayerWhite) return
    const [toX, toY] = toTileId.split(";").map(Number)
    if ((gameState.whitesTurn && toX > 7) || (!gameState.whitesTurn && toX < 0)) {
      const newGameState = JSON.parse(JSON.stringify(gameState))
      let jailedPiece = {...newGameState.jailablePiece}
      jailedPiece.x = toX
      jailedPiece.y = toY
      newGameState.jailablePiece = null
      newGameState.board.push(jailedPiece)
      newGameState.whitesTurn = !newGameState.whitesTurn
      updateGameState(newGameState)
    }
  }

  const onSelectTile = (tileId) => {
    if (gameState.jailablePiece) {
      tryMoveToJail(tileId)
    } else {
      if (canMove && selectedTileId && selectedTileId !== tileId) {
        const [fromX, fromY] = selectedTileId.split(";").map(Number)
        let piece = getPiece(gameState, fromX, fromY)
        if (piece && (piece.white === isPlayerWhite || piece.white === null)) {
          tryMove(selectedTileId, tileId)
        }
      }
      setPossibleMoves(getMoves(gameState, tileId))
      setSelectedTileId(tileId)
    }
  }
  
  const resetSelectedTile = () => {
    setSelectedTileId(null)
    setPossibleMoves([])
  }

  useEffect(() => {
    resetSelectedTile()
  }, [gameState.whitesTurn])

  useEffect(() => {
    window.addEventListener('mouseup', resetSelectedTile)
    return () => {
      window.removeEventListener("mouseup", resetSelectedTile)
    }
  }, [])

  const removeDragImg = (e) => {
    let dragIcon = document.createElement('img');
    dragIcon.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    dragIcon.width = 0;
    dragIcon.height = 0;
    dragIcon.opacity = 0;
    if(e.dataTransfer) {
      e.dataTransfer.setDragImage(dragIcon,0, 0);
    }
  }

  const rotateBoard = !isPlayerWhite && !isBothPlayers
  const isBearNotDeployed = gameState.board.find(element => element.type === "bear" && !element.isDeployed) ? true : false

  return (
    <div className={styles.container} onDragStart={removeDragImg}>
      <div className={styles.boardContainer} onDragStart={removeDragImg}>
        {isBearNotDeployed && <div className={styles.bearTile}>
          <Tile
            x={-1}
            y={-1}
            possibleMoves={[]}
            canMove={canMove}
            selectedId={selectedTileId}
            gameState={gameState}
            selectTile={onSelectTile}
          />
        </div>}
        <div className={styles.jailContainer}>
          <Tile
            x={!rotateBoard ? -1 : 8}
            y={!rotateBoard ? 4 : 3}
            possibleMoves={possibleMoves}
            canMove={canMove}
            selectedId={selectedTileId}
            gameState={gameState}
            selectTile={onSelectTile}
            />
          <Tile
            x={!rotateBoard ? -1 : 8}
            y={!rotateBoard ? 3 : 4}
            possibleMoves={possibleMoves}
            canMove={canMove}
            selectedId={selectedTileId}
            gameState={gameState}
            selectTile={onSelectTile}
          />
        </div>
        <div className={styles.board}>
          {Array.from({ length: 64 }).map((_, index) => {
            let tileX = rotateBoard ? 7 - index % 8 : index % 8
            let tileY = !rotateBoard ? 7 - Math.floor(index/8) : Math.floor(index/8)
            return <Tile
              key={`${tileX};${tileY}`}
              x={tileX}
              y={tileY}
              possibleMoves={possibleMoves}
              canMove={canMove}
              selectedId={selectedTileId}
              gameState={gameState}
              selectTile={onSelectTile}
            />
          }
          )}
        </div>
        <div className={styles.jailContainer}>
          <Tile
            x={!rotateBoard ? 8 : -1}
            y={!rotateBoard ? 4 : 3}
            possibleMoves={possibleMoves}
            canMove={canMove}
            selectedId={selectedTileId}
            gameState={gameState}
            selectTile={onSelectTile}
          />
          <Tile
            x={!rotateBoard ? 8 : -1}
            y={!rotateBoard ? 3 : 4}
            possibleMoves={possibleMoves}
            canMove={canMove}
            selectedId={selectedTileId}
            gameState={gameState}
            selectTile={onSelectTile}
          />
        </div>
      </div>
    </div>
  );
}