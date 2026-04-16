import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { ROLE_COLORS } from '../constants'
import './Game.css'

function Game() {
  const { players, myId, settings, votes, timeLeft, castVote } = useGame()
  const [myVote, setMyVote] = useState(null)
  const me = players.find(p => p.id === myId)
  const timerPercent = (timeLeft / settings.timer) * 100

  function handleVote(targetId) {
    if (myVote || targetId === myId) return
    setMyVote(targetId)
    castVote(targetId)
  }

  return (
    <div className="game">
      <div className="timer-bar">
        <div className="timer-fill"
          style={{ width: `${timerPercent}%`, background: timerPercent < 25 ? '#e63946' : '#965252' }} />
      </div>
      <p className="timer-text">{timeLeft}s remaining</p>

      <div className="game-header">
        <span className="phase-label">Discussion & Voting</span>
        {me && (
          <span className="my-role" style={{ color: ROLE_COLORS[me.role] }}>
            You: {me.role}{me.word ? ` — ${me.word}` : ''}
          </span>
        )}
      </div>

      <div className="player-grid">
        {players.map(p => {
          const voteCount = votes[p.id] || 0
          const isMe = p.id === myId
          const iVotedThis = myVote === p.id

          return (
            <div key={p.id} className={`player-card ${iVotedThis ? 'voted' : ''} ${isMe ? 'is-me' : ''}`}>
              <div className="pawn" style={{ width: 24, height: 32, background: isMe ? ROLE_COLORS[me?.role] : '#3d4150' }} />
              <span className="player-name">{p.name}{isMe ? ' (You)' : ''}</span>
              {settings.displayVotes && voteCount > 0 && (
                <span className="vote-count">{voteCount} vote{voteCount !== 1 ? 's' : ''}</span>
              )}
              {!isMe && (
                <button className={`vote-btn ${myVote ? 'voted-out' : ''} ${iVotedThis ? 'active' : ''}`}
                  onClick={() => handleVote(p.id)} disabled={!!myVote}>
                  {iVotedThis ? 'Voted' : 'Vote'}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {myVote && <p className="waiting-text">Waiting for other players...</p>}
    </div>
  )
}

export default Game