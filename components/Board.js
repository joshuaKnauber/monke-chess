import styles from '../styles/Board.module.css'
import Tile from './Tile';

export default function Board({ isPlayerWhite, gameState }) {
  return (
    <div className={styles.container}>
      <div className={styles.boardContainer}>
        <div className={styles.jailContainer}>
          <Tile
            x={-1}
            y={3}
            gameState={gameState}
          />
          <Tile
            x={-1}
            y={4}
            gameState={gameState}
          />
        </div>
        <div className={styles.board}>
          {Array.from({ length: 64 }).map((_, index) =>
            <Tile
              key={index}
              x={index % 8}
              y={Math.floor(index/8)}
              gameState={gameState}
            />
          )}
        </div>
        <div className={styles.jailContainer}>
          <Tile
            x={8}
            y={3}
            gameState={gameState}
          />
          <Tile
            x={8}
            y={4}
            gameState={gameState}
          />
        </div>
      </div>
    </div>
  );
}