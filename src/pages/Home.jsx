import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
  const [name, setName] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const navigate = useNavigate()

  function createRoom() {
    const code = Math.random().toString(36).substring(2, 7).toUpperCase()
    navigate(`/${code}`)
  }

  function joinRoom() {
    if (roomCode.trim()) navigate(`/${roomCode.toUpperCase()}`)
  }

  return (
    <div className="home">
      <h1 className="home-title">Spy Game</h1>

      <div className="home-card">
        <input
          className="home-input"
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="home-input"
          placeholder="Room code"
          value={roomCode}
          onChange={e => setRoomCode(e.target.value.toUpperCase())}
        />

        <button className="btn btn-primary" onClick={createRoom}>
          Create Room
        </button>
        <button className="btn btn-secondary" onClick={joinRoom}>
          Join Room
        </button>
      </div>
    </div>
  )
}

export default Home