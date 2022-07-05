import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
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

  const joinRoom = (id) => {
    router.push(`/rooms/${id}`)
    setLoadingRoom(true)
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
      (doc) => setOpenRooms(doc.docs.map(room => room.data())));
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
      </Head>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Monke Chess</h1>
          <div className={styles.newGameContainer}>
            <input type='text' onChange={(e) => setId(e.target.value)} value={id} placeholder='Room ID' />
            <button disabled={id === ""} onClick={submit}>Create or Join Room</button>
          </div>
          {openRooms.map(room => <div className={styles.room} key={room.id}>
            <p className={styles.players}>
              <span>{room.white||"?"}</span> vs <span>{room.black||"?"}</span></p>
            <p className={styles.roomId}>{room.id}</p>
            <button onClick={() => joinRoom(room.id)}>Join</button>
          </div>)}
        </div>
      </div>
    </>
  )
}
