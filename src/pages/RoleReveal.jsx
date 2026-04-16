import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { ROLE_COLORS, ROLE_DESCRIPTIONS } from '../constants'
import './RoleReveal.css'

function RoleReveal() {
  const { players, revealIndex, nextReveal } = useGame()
  const [revealed, setRevealed] = useState(false)
  const current = players[revealIndex]

  if (!current) return null

  const color = ROLE_COLORS[current.role] || '#888'
  const isLast = revealIndex >= players.length - 1

  function handleReveal() {
    if (!revealed) { setRevealed(true); return }
    setRevealed(false)
    nextReveal()
  }

  return (
    <div className="reveal-screen">
      <p className="reveal-pass">Pass to <strong>{current.name}</strong></p>

      <div className="reveal-card" onClick={handleReveal}
        style={{ borderColor: revealed ? color : '#3d4150' }}>
        {!revealed ? (
          <div className="card-front">
            <span>Tap to reveal your role</span>
          </div>
        ) : (
          <div className="card-back">
            <div className="pawn" style={{ width: 48, height: 64, background: color }} />
            <h2 style={{ color }}>{current.role?.toUpperCase()}</h2>
            <p className="role-desc">{ROLE_DESCRIPTIONS[current.role]}</p>
            <div className="word-box">
              <span className="word-label">Your word</span>
              <span className="word-value" style={{ color: current.word ? 'white' : '#555' }}>
                {current.word || '???'}
              </span>
            </div>
          </div>
        )}
      </div>

      {revealed && (
        <button className="btn btn-primary" onClick={handleReveal}>
          {isLast ? 'Start Game →' : "I've seen my role →"}
        </button>
      )}

      <p className="reveal-progress">{revealIndex + 1} / {players.length}</p>
    </div>
  )
}

export default RoleReveal