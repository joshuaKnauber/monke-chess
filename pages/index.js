import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/initFirebase'

export default function Home() {

  const router = useRouter()

  const [id, setId] = useState("")
  const [openRooms, setOpenRooms] = useState([])

  const [loadingRoom, setLoadingRoom] = useState(false)

  const submit = () => {
    if (id !== '') {
      router.push(`/rooms/${id}`)
      setLoadingRoom(true)
    }
  }

  const joinRoom = (id) => {
    router.push(`/rooms/${id}`)
    setLoadingRoom(true)
  }

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
    return <div>
      loading room
    </div>
  }

  return (
    <div className={styles.container}>
      <h1>Monke Chess</h1>
      <input type='text' onChange={(e) => setId(e.target.value.trim())} value={id} placeholder='Room ID' />
      <button disabled={id === ""} onClick={submit}>Create Room</button>
      {openRooms.map(room => <div className={styles.room} key={room.id}>
        {room.id}<br/>
        {room.white} vs {room.black}<br/>
        <button onClick={() => joinRoom(room.id)}>Join</button>
      </div>)}
    </div>
  )
}
