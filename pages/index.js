import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import { FaTrash } from "react-icons/fa"
import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/initFirebase'
import Head from 'next/head'

export default function Home() {

  const router = useRouter()

  const [id, setId] = useState("")
  const [openRooms, setOpenRooms] = useState([])

  const [loadingRoom, setLoadingRoom] = useState(false)

  const submit = () => {
    if (id.trim() !== '') {
      router.push(`/rooms/${id.trim()}?create=true`)
      setLoadingRoom(true)
    }
  }

  const joinRoom = (joinId) => {
    router.push(`/rooms/${joinId}`)
    setLoadingRoom(true)
  }

  const deleteRoom = async (deleteId) => {
    if (confirm("Are you sure you want to delete this room?")) {
      try {
        const roomRef = doc(db, "rooms", deleteId);
        await deleteDoc(roomRef);
      } catch (e) {
        console.error("Error updating document: ", e);
        throw e
      }
    }
  }

  const handleRouteChange = () => {
    setLoadingRoom(false)
  }

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    };
  }, [router.events]);

  useEffect(() => {
    // keep track of updates
    const unsub = onSnapshot(
      collection(db, "rooms"), 
      (doc) => setOpenRooms([...doc.docs]));
    return () => {
      unsub()
    }
  }, [])

  if (loadingRoom) {
    return <>
      <Head>
        <title>Loading</title>
      </Head>
      <div className={styles.loadingContainer}>
        Loading...
      </div>
    </>
  }

  return (
    <>
      <Head>
        <title>Monke Chess</title>
        <meta
          property="og:title"
          content="Monkey Chess"
        />
        <meta
          property="og:description"
          content="Better than normal chess because monke"
        />
        <meta property="og:image" content={`https://api.time.com/wp-content/uploads/2015/09/monkey-selfie.jpg`} />
      </Head>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Monke Chess</h1>
          <div className={styles.newGameContainer}>
            <input type='text' onChange={(e) => setId(e.target.value)} value={id} placeholder='Room ID' />
            <button disabled={id === ""} onClick={submit}>Create or Join Room</button>
          </div>
          {openRooms.map(room => {
            const roomData = room.data()
            return <div className={styles.room} key={room.id}>
              <p className={styles.players}>
                <span>{roomData.white||"?"}</span> vs <span>{roomData.black||"?"}</span></p>
              <p className={styles.roomId}>{roomData.id}</p>
              <div className={styles.btns}>
                <button className={styles.joinBtn} onClick={() => joinRoom(roomData.id)}>Join</button>
                <button className={styles.deleteBtn} onClick={() => deleteRoom(room.id)}><FaTrash size={12}/></button>
              </div>
            </div>}
          )}
        </div>
      </div>
    </>
  )
}
