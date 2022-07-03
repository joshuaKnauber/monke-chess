import styles from '../styles/Board.module.css'

export default function Tile({ x, y, gameState }) {
  return (
    <div className={`
      ${styles.tile}
      ${(x + y) % 2 && styles.black}
      ${(x < 0 || x > 7) && styles.jail}
    `}>
      <img src='https://data.whicdn.com/images/325478381/original.gif'></img>
    </div>
  );
}