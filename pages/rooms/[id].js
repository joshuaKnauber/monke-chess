import styles from '../../styles/Game.module.css'
import { db } from '../../firebase/initFirebase'
import { useRouter, useQueryParams } from 'next/router' 
import Head from 'next/head'
import { useWindowSize } from 'react-use';
import { FaUser, FaAngleLeft, FaCopy, FaCheck } from "react-icons/fa"
import Confetti from 'react-confetti'
import { collection, query, where, getDocs, addDoc, onSnapshot, doc, updateDoc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Board from '../../components/Board'

const NEW_GAME = {
  whitesTurn: true,
  jailablePiece: null,

  board: [
    { x: 0, y: 0, type: 'rook', white: true, canTake: false },
    { x: 1, y: 0, type: 'monkey', white: true },
    { x: 2, y: 0, type: 'fish', white: true, isQueen: false },
    { x: 3, y: 0, type: 'queen', white: true },
    { x: 4, y: 0, type: 'king', white: true, hasBanana: true },
    { x: 5, y: 0, type: 'fish', white: true, isQueen: false },
    { x: 6, y: 0, type: 'monkey', white: true },
    { x: 7, y: 0, type: 'rook', white: true, canTake: false },
    { x: 0, y: 1, type: 'fish', white: true, isQueen: false },
    { x: 1, y: 1, type: 'fish', white: true, isQueen: false },
    { x: 2, y: 1, type: 'elephant', white: true },
    { x: 3, y: 1, type: 'fish', white: true, isQueen: false },
    { x: 4, y: 1, type: 'fish', white: true, isQueen: false },
    { x: 5, y: 1, type: 'elephant', white: true },
    { x: 6, y: 1, type: 'fish', white: true, isQueen: false },
    { x: 7, y: 1, type: 'fish', white: true, isQueen: false },

    { x: 0, y: 7, type: 'rook', white: false, canTake: false },
    { x: 1, y: 7, type: 'monkey', white: false },
    { x: 2, y: 7, type: 'fish', white: false, isQueen: false },
    { x: 3, y: 7, type: 'queen', white: false },
    { x: 4, y: 7, type: 'king', white: false, hasBanana: true },
    { x: 5, y: 7, type: 'fish', white: false, isQueen: false },
    { x: 6, y: 7, type: 'monkey', white: false },
    { x: 7, y: 7, type: 'rook', white: false, canTake: false },
    { x: 0, y: 6, type: 'fish', white: false, isQueen: false },
    { x: 1, y: 6, type: 'fish', white: false, isQueen: false },
    { x: 2, y: 6, type: 'elephant', white: false },
    { x: 3, y: 6, type: 'fish', white: false, isQueen: false },
    { x: 4, y: 6, type: 'fish', white: false, isQueen: false },
    { x: 5, y: 6, type: 'elephant', white: false },
    { x: 6, y: 6, type: 'fish', white: false, isQueen: false },
    { x: 7, y: 6, type: 'fish', white: false, isQueen: false },

    { x: -1, y: -1, type: 'bear', white: true, isDeployed: false }
  ]
}

export default function Room(props) {

  const {width, height} = useWindowSize();

  const router = useRouter()

  const { roomId, data, id } = props

  const [gameState, setGameState] = useState(null)

  const [playerName, setPlayerName] = useState("")
  const [playerWhite, setPlayerWhite] = useState(null)
  const [playerBlack, setPlayerBlack] = useState(null)
  const [isPlayerWhite, setIsPlayerWhite] = useState(null)

  const [copiedLink, setCopiedLink] = useState(false)
  const boardRef = useRef(null)

  const onRoomUpdate = useCallback((data) => {
    if (!data) {
      // go back if room was closed
      router.push("/")
      return
    }
    if (playerWhite && playerBlack && (data.white !== playerWhite || data.black !== playerBlack)) {
      window.location.reload() // reload when other person reset the game
    }
    if (data.history.length) {
      setGameState(data.history[data.history.length-1])
    }
    if (data.white) {
      setPlayerWhite(data.white)
      if (isPlayerWhite === true) { setPlayerName(data.white) }
    }
    if (data.black) {
      setPlayerBlack(data.black)
      if (isPlayerWhite === false) { setPlayerName(data.black) }
    }
    if (data.white && data.black && data.white === data.black) {
      const isWhitesTurn = data.history[data.history.length-1].whitesTurn
      setIsPlayerWhite(isWhitesTurn)
    } else if (localStorage.getItem(id)) {
      const isWhite = localStorage.getItem(id) === 'white'
      if (isWhite && data.white) {
        setIsPlayerWhite(true)
      } else if (!isWhite && data.black) {
        setIsPlayerWhite(false)
      } else {
        localStorage.removeItem(id)
      }
    }
  }, [data, isPlayerWhite])

  const writePickedPlayer = async (color, name) => {
    try {
      const roomRef = doc(db, "rooms", id);
      const update = {}
      update[color] = name
      await updateDoc(roomRef, update);
    } catch (e) {
      console.error("Error updating document: ", e);
      throw e
    }
  }

  const switchPlayer = () => {
    setIsPlayerWhite(null)
    localStorage.removeItem(id)
  }

  const pickBothPlayers = async () => {
    await pickPlayer(false)
    await pickPlayer(true)
  }

  const pickPlayer = async (pickedWhite) => {
    try {
      if ((pickedWhite && playerWhite === null) ||
      (!pickedWhite && playerBlack === null)) {
        await writePickedPlayer(pickedWhite ? "white" : "black", playerName)
      }
      setIsPlayerWhite(pickedWhite)
      setPlayerName(pickedWhite ? data.white : data.black)
      localStorage.setItem(id, pickedWhite ? "white" : "black")
    } catch (e) {
      console.error("Error updating document: ", e);
      alert("something fucked up when picking player. try again")
      throw e
    }
  }

  const updateGameState = async (newGameState) => {
    try {
      const roomRef = doc(db, "rooms", id);
      const update = {}
      update.history = [...data.history, newGameState]
      await updateDoc(roomRef, update);
    } catch (e) {
      console.error("Error updating document: ", e);
      throw e
    }
  }

  const restartRoom = async () => {
    try {
      const roomRef = doc(db, "rooms", id);
      await setDoc(roomRef, {
        id: roomId,
        history: [NEW_GAME],
        black: "",
        white: "",
      });
      window.location.reload()
    } catch (e) {
      console.error("Error updating document: ", e);
      throw e
    }
  }

  const deleteRoom = async () => {
    try {
      const roomRef = doc(db, "rooms", id);
      await deleteDoc(roomRef);
      router.push("/")
    } catch (e) {
      console.error("Error updating document: ", e);
      throw e
    }
  }

  const copyRoomLink = () => {
    const link = window.location.href
    const textArea = document.createElement("textarea")
    textArea.value = link
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand("copy")
    textArea.remove()
    setCopiedLink(true)
    setTimeout(() => {
      setCopiedLink(false)
    }, 500);
  }

  useEffect(() => {
    // keep track of updates
    const unsub = onSnapshot(
      doc(db, "rooms", id), 
      (doc) => onRoomUpdate(doc.data()));
    return () => {
      unsub()
    }
  }, [onRoomUpdate])

  const getPlayerWinState = (isWhite) => {
    let beatKing = false
    let beatQueen = false
    if (gameState) {
      gameState.board.forEach(piece => {
        if (piece.type === "king" && piece.white !== isWhite) {
          if (piece.x < 0 || piece.x > 7) {
            beatKing = true
          }
        }
        if (piece.type === "queen" && piece.white !== isWhite) {
          if (piece.x < 0 || piece.x > 7) {
            beatQueen = true
          }
        }
      })
    }
    return beatKing && beatQueen
  }

  const playerWon = useMemo(() => {
    let playerWon = getPlayerWinState(isPlayerWhite)
    let enemyWon = getPlayerWinState(!isPlayerWhite)
    return playerWon || (enemyWon && playerBlack === playerWhite)
  }, [gameState])

  const playerLost = useMemo(() => {
    let enemyWon = getPlayerWinState(!isPlayerWhite)
    return enemyWon && playerBlack !== playerWhite
  }, [gameState])

  useEffect(() => {
    if (playerLost) {
      document.body.classList.add("lost")
    } else {
      document.body.classList.remove("lost")
    }
    return () => {
      document.body.classList.remove("lost")
    }
  }, [playerLost])

  useEffect(() => {
    const { query } = router
    if (query.create) {
      let newQuery = { ...query }
      delete newQuery.create
      router.replace({ query: newQuery })
    }
  }, [router])

  if (!gameState) return <></>

  return (
    <>
      <Head>
        <title>Monke Chess: {roomId}</title>
      </Head>
      {playerWon && <Confetti width={width} height={height}/>}
      {isPlayerWhite === null && <div className={styles.playerContainer}>
        {(!playerWhite || !playerBlack) && <input value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Player Name"></input>}
        <div className={styles.row}>
          <button disabled={playerName === "" && playerWhite === null} onClick={() => pickPlayer(true)}>White{playerWhite ? `: ${playerWhite}` : ""}</button>
          <button className={styles.black} disabled={playerName === "" && playerBlack === null} onClick={() => pickPlayer(false)}>Black{playerBlack ? `: ${playerBlack}` : ""}</button>
        </div>
        {!playerWhite && !playerBlack && <div className={styles.row}>
          <button className={styles.both} disabled={playerName === "" || (playerBlack && playerWhite && playerWhite !== playerBlack)} onClick={() => pickBothPlayers()}>Play Both Sides</button>
        </div>}
      </div>}
      <div className={styles.container}>
        <div className={styles.header} style={{ opacity: isPlayerWhite === null ? 0 : 1 }}>
          <p className={styles.roomTitle}>{roomId} (Playing {isPlayerWhite ? "White" : "Black"})</p>
          <div className={styles.title}>
            <button className={styles.backBtn} onClick={() => {router.push("/")}}><FaAngleLeft size={20}/></button>
            <h1>
              <span className={`${gameState.whitesTurn && styles.active}`}>
                {playerWhite||"?"}</span> vs <span className={`${styles.black} ${!gameState.whitesTurn && styles.active}`}>
                {playerBlack||"?"}</span>
            </h1>
            <button onClick={copyRoomLink}>{copiedLink ? <FaCheck size={20}/> : <FaCopy size={20}/>}</button>
          </div>
          {playerWhite !== playerBlack && <><button className={styles.switchBtn} onClick={switchPlayer}><FaUser size={12}/>Switch</button><br/></>}
        </div>
        <div className={styles.board} ref={boardRef}>
          {(!playerBlack || !playerWhite) && isPlayerWhite !== null && <div className={styles.waitingOverlay}>Waiting For Other Player</div>}
          {(playerWon || playerLost) && <div className={styles.waitingOverlay}>
            {playerWon ? "You won!" : "You lost..."}
            <div>
              <button onClick={deleteRoom}>Close Room</button>
              <button onClick={restartRoom}>Restart Room</button>
            </div>
            </div>}
          <Board
            isPlayerWhite={isPlayerWhite}
            isBothPlayers={playerWhite === playerBlack}
            gameState={gameState}
            updateGameState={updateGameState}/>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {

  const roomId = context.query.id

  try {
    let data = null
    let id = null
    const q = query(collection(db, "rooms"), where("id", "==", roomId));
    const querySnapshot = await getDocs(q);
    
    // get data if room exists
    if (querySnapshot.docs.length) {
      data = querySnapshot.docs[0].data()
      id = querySnapshot.docs[0].id
    }
    // else create room
    else if (context.query.create === "true") {
      data = {
        id: roomId,
        history: [NEW_GAME],
        black: "",
        white: "",
      }
      const docsRef = await addDoc(collection(db, "rooms"), data);
      id = docsRef.id
    }
    // else redirect to home
    else {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }

    return {
      props: {
        roomId,
        data,
        id
      },
    }
  } catch (error) {
    console.error(error)
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
}