import styles from '../../styles/Home.module.css'
import { db } from '../../firebase/initFirebase'
import { collection, query, where, getDocs, addDoc, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import Board from '../../components/Board'

export default function Room(props) {

  const { roomId, data, id } = props

  const [gameState,  setGameState] = useState(null)

  const [playerName, setPlayerName] = useState("")
  const [playerWhite, setPlayerWhite] = useState(null)
  const [playerBlack, setPlayerBlack] = useState(null)
  const [isPlayerWhite, setIsPlayerWhite] = useState(null)

  const onRoomUpdate = (data) => {
    if (data.history.length) {
      setGameState(data.history[0])
    } else {
      setGameState({
        whitesTurn: true,
      })
    }
    if (data.white) {
      setPlayerWhite(data.white)
      if (isPlayerWhite === true) { setPlayerName(data.white) }
    }
    if (data.black) {
      setPlayerBlack(data.black)
      if (isPlayerWhite === false) { setPlayerName(data.black) }
    }
  }

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

  const pickPlayer = async (pickedWhite) => {
    try {
      if ((pickedWhite && playerWhite === null) ||
      (!pickedWhite && playerBlack === null)) {
        await writePickedPlayer(pickedWhite ? "white" : "black", playerName)
      }
      setIsPlayerWhite(pickedWhite)
    } catch (e) {
      console.error("Error updating document: ", e);
      alert("something fucked up when picking player. try again")
      throw e
    }
  }

  useEffect(() => {
    // keep track of updates
    const unsub = onSnapshot(
      doc(db, "rooms", id), 
      (doc) => onRoomUpdate(doc.data()));
    return () => {
      unsub()
    }
  }, [])

  if (isPlayerWhite === null) {
    return <>
      <input value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Name"></input>
      <button disabled={playerName === "" && playerWhite === null} onClick={() => pickPlayer(true)}>white{playerWhite ? `: ${playerWhite}` : ""}</button>
      <button disabled={playerName === "" && playerBlack === null} onClick={() => pickPlayer(false)}>black{playerBlack ? `: ${playerBlack}` : ""}</button>
    </>
  }

  if (!gameState) return <></>

  return (
    <div className={styles.container}>
      {roomId}<br/>
      {isPlayerWhite ? "white" : "black"} {playerName}<br/>
      {JSON.stringify(data)}
      <Board isPlayerWhite={isPlayerWhite} gameState={gameState}/>
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
        history: [],
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