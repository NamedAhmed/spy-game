import { useParams } from 'react-router-dom'
import './Lobby.css'

const MOCK_PLAYERS = [
  { id: 1, name: 'Ahmed', isHost: true },
  { id: 2, name: 'James' },
  { id: 3, name: 'Sara' },
]

function Lobby() {
  const { roomCode } = useParams()

  return (
    <div className="lobby">

      <div className="lobby-header">
        <span className="lobby-label">Room Code</span>
        <h1 className="lobby-code">{roomCode}</h1>
      </div>

      <div className="lobby-body">

        <div className="lobby-players">
          <h2 className="section-title">Players</h2>
          {MOCK_PLAYERS.map(p => (
            <div className="player-row" key={p.id}>
              <div className="pawn" />
              <span>{p.name}</span>
              {p.isHost && <span className="host-badge">HOST</span>}
            </div>
          ))}
          <div className="player-row empty">
            <div className="pawn empty-pawn" />
            <span>Waiting...</span>
          </div>
        </div>

        <div className="lobby-settings">
          <h2 className="section-title">Settings</h2>

          <div className="setting-row">
            <span>Roles Enabled</span>
            <div className="toggle on" />
          </div>

          <div className="setting-row">
            <span># of Spies</span>
            <div className="stepper">
              <button>−</button>
              <span>1</span>
              <button>+</button>
            </div>
          </div>

          <div className="setting-row">
            <span>Timer (sec)</span>
            <div className="stepper">
              <button>−</button>
              <span>60</span>
              <button>+</button>
            </div>
          </div>

          <div className="setting-row">
            <span>Display Votes</span>
            <div className="toggle" />
          </div>

          <div className="setting-row">
            <span>Spy Mode</span>
            <select className="select">
              <option>No Word</option>
              <option>Fake Word</option>
            </select>
          </div>

          <button className="btn btn-primary start-btn">Start Game</button>
        </div>

      </div>
    </div>
  )
}

export default Lobby