import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { ROLE_COLORS } from '../constants'
import './Results.css'

const WINNER_TEXT = {
  civilians: { label: 'Civilians Win!', color: '#4ecdc4' },
  spy:       { label: 'Spy Wins!',      color: '#e63946' },
  joker:     { label: 'Joker Wins!',    color: '#9b72cf' },
}

function Results() {
  const { players, winner, eliminatedId, myId, playAgain } = useGame()
  const navigate = useNavigate()
  const result = WINNER_TEXT[winner] || { label: 'Game Over', color: '#888' }
  const eliminated = players.find(p => p.id === eliminatedId)
  const realWord = players.find(p => p.role === 'civilian')?.realWord

  function handlePlayAgain() {
    playAgain()
    navigate('/')
  }

  return (
    <div className="results">
      <div className="results-header">
        <h1 className="winner-text" style={{ color: result.color }}>{result.label}</h1>
        {eliminated
          ? <p className="sub-text">{eliminated.name} was voted out — they were a {eliminated.role}</p>
          : <p className="sub-text">Time ran out — the spy survived!</p>
        }
        {realWord && <p className="sub-text">The word was: <strong>{realWord}</strong></p>}
      </div>

      <div className="results-list">
        <h2 className="section-title">All Roles</h2>
        {players.map(p => (
          <div key={p.id} className="result-row">
            <div className="pawn" style={{ width: 20, height: 28, background: ROLE_COLORS[p.role] }} />
            <div className="result-info">
              <span className="result-name">{p.name}{p.id === myId ? ' (You)' : ''}</span>
              <span className="result-role" style={{ color: ROLE_COLORS[p.role] }}>
                {p.role}{p.word ? ` — ${p.word}` : p.role === 'spy' ? ' — no word' : ''}
              </span>
            </div>
            {p.id === eliminatedId && <span className="eliminated-badge">voted out</span>}
          </div>
        ))}
      </div>

      <button className="btn btn-primary" onClick={handlePlayAgain}>Play Again</button>
    </div>
  )
}

export default Results