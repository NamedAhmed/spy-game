import { useGame } from '../context/GameContext'
import './Lobby.css'

function Lobby() {
  const { roomCode, players, settings, updateSettings, startGame } = useGame()
  const canStart = players.length >= 3

  return (
    <div className="lobby">
      <div className="lobby-header">
        <span className="lobby-label">Room Code</span>
        <h1 className="lobby-code">{roomCode}</h1>
      </div>

      <div className="lobby-body">
        <div className="lobby-players">
          <h2 className="section-title">Players</h2>
          {players.map(p => (
            <div className="player-row" key={p.id}>
              <div className="pawn" style={{ width: 18, height: 24, background: '#965252' }} />
              <span>{p.name}</span>
              {p.isHost && <span className="host-badge">HOST</span>}
            </div>
          ))}
          {players.length < 8 && (
            <div className="player-row empty">
              <div className="pawn" style={{ width: 18, height: 24, background: 'transparent', border: '2px dashed #3d4150' }} />
              <span>Waiting...</span>
            </div>
          )}
        </div>

        <div className="lobby-settings">
          <h2 className="section-title">Settings</h2>

          <div className="setting-row">
            <span>Roles Enabled</span>
            <div className={`toggle ${settings.rolesEnabled ? 'on' : ''}`}
              onClick={() => updateSettings({ rolesEnabled: !settings.rolesEnabled })} />
          </div>

          <div className="setting-row">
            <span># of Spies</span>
            <div className="stepper">
              <button onClick={() => updateSettings({ numSpies: Math.max(1, settings.numSpies - 1) })}>−</button>
              <span>{settings.numSpies}</span>
              <button onClick={() => updateSettings({ numSpies: Math.min(4, settings.numSpies + 1) })}>+</button>
            </div>
          </div>

          <div className="setting-row">
            <span>Timer (sec)</span>
            <div className="stepper">
              <button onClick={() => updateSettings({ timer: Math.max(15, settings.timer - 15) })}>−</button>
              <span>{settings.timer}</span>
              <button onClick={() => updateSettings({ timer: Math.min(180, settings.timer + 15) })}>+</button>
            </div>
          </div>

          <div className="setting-row">
            <span>Display Votes</span>
            <div className={`toggle ${settings.displayVotes ? 'on' : ''}`}
              onClick={() => updateSettings({ displayVotes: !settings.displayVotes })} />
          </div>

          <div className="setting-row">
            <span>Spy Mode</span>
            <select className="select" value={settings.spyMode}
              onChange={e => updateSettings({ spyMode: e.target.value })}>
              <option value="no_word">No Word</option>
              <option value="fake_word">Fake Word</option>
            </select>
          </div>

          <button className="btn btn-primary start-btn" onClick={startGame} disabled={!canStart}>
            {canStart ? 'Start Game' : `Waiting... (${players.length}/3)`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Lobby