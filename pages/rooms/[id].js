import styles from '../../styles/Game.module.css'
import { db } from '../../firebase/initFirebase'
import { collection, query, where, getDocs, addDoc, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore'
import { useCallback, useEffect, useRef, useState } from 'react'
import Board from '../../components/Board'

const NEW_GAME = {
  whitesTurn: true,

  board: [
    { x: 0, y: 0, type: 'rook', white: true },
    { x: 1, y: 0, type: 'monkey', white: true },
    { x: 2, y: 0, type: 'fish', white: true },
    { x: 3, y: 0, type: 'queen', white: true },
    { x: 4, y: 0, type: 'king', white: true },
    { x: 5, y: 0, type: 'fish', white: true },
    { x: 6, y: 0, type: 'monkey', white: true },
    { x: 7, y: 0, type: 'rook', white: true },
    { x: 0, y: 1, type: 'fish', white: true },
    { x: 1, y: 1, type: 'fish', white: true },
    { x: 2, y: 1, type: 'elephant', white: true },
    { x: 3, y: 1, type: 'fish', white: true },
    { x: 4, y: 1, type: 'fish', white: true },
    { x: 5, y: 1, type: 'elephant', white: true },
    { x: 6, y: 1, type: 'fish', white: true },
    { x: 7, y: 1, type: 'fish', white: true },

    { x: 0, y: 7, type: 'rook', white: false },
    { x: 1, y: 7, type: 'monkey', white: false },
    { x: 2, y: 7, type: 'fish', white: false },
    { x: 3, y: 7, type: 'queen', white: false },
    { x: 4, y: 7, type: 'king', white: false },
    { x: 5, y: 7, type: 'fish', white: false },
    { x: 6, y: 7, type: 'monkey', white: false },
    { x: 7, y: 7, type: 'rook', white: false },
    { x: 0, y: 6, type: 'fish', white: false },
    { x: 1, y: 6, type: 'fish', white: false },
    { x: 2, y: 6, type: 'elephant', white: false },
    { x: 3, y: 6, type: 'fish', white: false },
    { x: 4, y: 6, type: 'fish', white: false },
    { x: 5, y: 6, type: 'elephant', white: false },
    { x: 6, y: 6, type: 'fish', white: false },
    { x: 7, y: 6, type: 'fish', white: false }
  ]
}

export default function Room(props) {

  const { roomId, data, id } = props

  const [gameState,  setGameState] = useState(null)

  const [playerName, setPlayerName] = useState("")
  const [playerWhite, setPlayerWhite] = useState(null)
  const [playerBlack, setPlayerBlack] = useState(null)
  const [isPlayerWhite, setIsPlayerWhite] = useState(null)

  const [copiedLink, setCopiedLink] = useState(false)
  const boardRef = useRef(null)

  const onRoomUpdate = useCallback((data) => {
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
      setIsPlayerWhite(localStorage.getItem(id) === 'white')
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

  if (!gameState) return <></>

  if (isPlayerWhite === null) {
    return <>
      <input value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Name"></input>
      <button disabled={playerName === "" && playerWhite === null} onClick={() => pickPlayer(true)}>white{playerWhite ? `: ${playerWhite}` : ""}</button>
      <button disabled={playerName === "" && playerBlack === null} onClick={() => pickPlayer(false)}>black{playerBlack ? `: ${playerBlack}` : ""}</button>
      <button disabled={playerName === "" || (playerBlack && playerWhite && playerWhite !== playerBlack)} onClick={() => pickBothPlayers()}>play both</button>
    </>
  }

  return (
    <div className={styles.container}>
      <div style={{ display: "flex", flexDirection: 'row', alignItems: 'center', gap: 20 }}>
        <h1>Room: {roomId}</h1>
        <button style={{ height: 30 }} onClick={copyRoomLink}>{copiedLink ? "Copied" : "Copy Link"}</button>
      </div>
      {playerWhite !== playerBlack && <><button onClick={switchPlayer}>switch player</button><br/></>}
      you are playing {playerBlack === playerWhite ? "both players" : isPlayerWhite ? "white" : "black"}<br/>
      {gameState.whitesTurn ? "white" : "black"} has next move
      <div className={styles.board} ref={boardRef}>
        {(!playerBlack || !playerWhite) && <div className={styles.waitingOverlay}>waiting for other player</div>}
        <Board
          key={isPlayerWhite}
          isPlayerWhite={isPlayerWhite}
          isBothPlayers={playerWhite === playerBlack}
          gameState={gameState}
          updateGameState={updateGameState}/>
      </div>
    </div>
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
    else {
      data = {
        id: roomId,
        history: [NEW_GAME],
        black: "",
        white: "",
      }
      const docsRef = await addDoc(collection(db, "rooms"), data);
      id = docsRef.id
    }

    return {
      props: {
        roomId,
        data,
        id
      },
    }
  } catch (error) {
    console.log(error)
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
}