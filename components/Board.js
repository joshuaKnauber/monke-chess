import { useEffect, useState } from 'react';
import styles from '../styles/Board.module.css'
import Tile from './Tile';
import getMoves from './utils/getMoves';
import { getPiece } from './utils/helpers';

export default function Board({ isPlayerWhite, gameState, updateGameState }) {

  const [selectedTileId, setSelectedTileId] = useState(null)
  const [possibleMoves, setPossibleMoves] = useState([])

  const canMove = isPlayerWhite === gameState.whitesTurn

  const tryMove = (fromTileId, toTileId) => {
    const [fromX, fromY] = fromTileId.split("-").map(Number)
    const [toX, toY] = toTileId.split("-").map(Number)
    const moves = getMoves(gameState, fromTileId)
    const canMoveHere = moves.find(move => move[0] === toX && move[1] === toY) ? true : false
    if (canMoveHere) {
      const newGameState = JSON.parse(JSON.stringify(gameState))
      // newGameState.whitesTurn = !newGameState.whitesTurn
      // create new piece
      let newPiece = getPiece(newGameState, fromX, fromY)
      newPiece.x = toX
      newPiece.y = toY
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
      tryMove(selectedTileId, tileId)
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

  return (
    <div className={styles.container} onDragStart={removeDragImg}>
      <div className={styles.boardContainer} onDragStart={removeDragImg}>
        <div className={styles.jailContainer}>
          <Tile
            x={-1}
            y={isPlayerWhite ? 4 : 3}
            possibleMoves={possibleMoves}
            canMove={canMove}
            selectedId={selectedTileId}
            gameState={gameState}
            selectTile={onSelectTile}
            />
          <Tile
            x={-1}
            y={isPlayerWhite ? 3 : 4}
            possibleMoves={possibleMoves}
            canMove={canMove}
            selectedId={selectedTileId}
            gameState={gameState}
            selectTile={onSelectTile}
          />
        </div>
        <div className={styles.board}>
          {Array.from({ length: 64 }).map((_, index) =>
            <Tile
              key={index}
              x={index % 8}
              y={(isPlayerWhite ? 7 : 0)-Math.floor(index/8)}
              possibleMoves={possibleMoves}
              canMove={canMove}
              selectedId={selectedTileId}
              gameState={gameState}
              selectTile={onSelectTile}
            />
          )}
        </div>
        <div className={styles.jailContainer}>
          <Tile
            x={8}
            y={isPlayerWhite ? 4 : 3}
            possibleMoves={possibleMoves}
            canMove={canMove}
            selectedId={selectedTileId}
            gameState={gameState}
            selectTile={onSelectTile}
          />
          <Tile
            x={8}
            y={isPlayerWhite ? 3 : 4}
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