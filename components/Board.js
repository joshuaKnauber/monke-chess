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
      newGameState.whitesTurn = !newGameState.whitesTurn
      // find bear and switch white/black
      let bear = newGameState.board.find(element => element.type === "bear")
      if (bear) { bear.white = newGameState.whitesTurn }
      // create new piece
      let newPiece = getPiece(newGameState, fromX, fromY)
      newPiece.x = toX
      newPiece.y = toY
      // set bear to deployed if moved
      if (newPiece.type === "bear") { newPiece.isDeployed = true }
      // fish queen
      if (newPiece.type == "fish") {
        if (newPiece.white && newPiece.y === 7 || !newPiece.white && newPiece.y === 0) {
          newPiece.isQueen = true
        }
      }
      // remove pieces
      newGameState.board = newGameState.board.filter(element => {
        let isFromPiece = element.x !== fromX || element.y !== fromY
        let isToPiece = element.x !== toX || element.y !== toY
        return isFromPiece && isToPiece
      })
      // add new piece
      newGameState.board.push(newPiece)
      // update game state
      updateGameState(newGameState)
    }
  }

  const onSelectTile = (tileId) => {
    if (canMove && selectedTileId && selectedTileId !== tileId) {
      const [fromX, fromY] = selectedTileId.split(";").map(Number)
      let piece = getPiece(gameState, fromX, fromY)
      if (piece && piece.white === isPlayerWhite) {
        tryMove(selectedTileId, tileId)
      }
    }
    setPossibleMoves(getMoves(gameState, tileId))
    setSelectedTileId(tileId)
  }
  
  const resetSelectedTile = () => {
    setSelectedTileId(null)
    setPossibleMoves([])
  }

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