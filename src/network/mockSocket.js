import { WORDS } from '../constants'

const handlers = {}
let roomState = { players: [], settings: {}, votes: {} }

function trigger(event, data) {
  setTimeout(() => handlers[event]?.(data), 50)
}

function countVotes(votes) {
  const counts = {}
  Object.values(votes).forEach(id => {
    counts[id] = (counts[id] || 0) + 1
  })
  return counts
}

function resolveGame(voteCounts, players) {
  if (!Object.keys(voteCounts).length) return
  const [[mostVotedId]] = Object.entries(voteCounts).sort((a, b) => b[1] - a[1])
  const mostVoted = players.find(p => p.id === mostVotedId)
  const spy = players.find(p => p.role === 'spy')
  let winner
  if (mostVoted?.role === 'spy') winner = 'civilians'
  else if (mostVoted?.role === 'joker') winner = 'joker'
  else winner = 'spy'
  trigger('game_over', { winner, spyId: spy?.id, eliminatedId: mostVotedId })
}

function assignRoles(players, settings) {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)]
  const fakeWord = WORDS.filter(w => w !== word)[Math.floor(Math.random() * (WORDS.length - 1))]
  const numSpies = Math.min(settings.numSpies || 1, Math.floor(players.length / 2))

  const indices = [...Array(players.length).keys()]
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]
  }
  const spyIndices = new Set(indices.slice(0, numSpies))

  return players.map((p, i) => {
    const isSpy = spyIndices.has(i)
    return {
      ...p,
      role: isSpy ? 'spy' : 'civilian',
      word: isSpy ? (settings.spyMode === 'fake_word' ? fakeWord : null) : word,
      realWord: word,
    }
  })
}

const FAKE_NAMES = ['Alex', 'Sam', 'Jordan', 'Riley']

const mockSocket = {
  on(event, cb) { handlers[event] = cb; return this },
  off(event) { delete handlers[event] },
  emit(event, data) {
    if (event === 'join_room') {
      const me = { id: 'me', name: data.name, isHost: true }
      roomState = { players: [me], settings: {}, votes: {} }
      trigger('room_joined', { players: roomState.players })

      FAKE_NAMES.slice(0, 3).forEach((name, i) => {
        setTimeout(() => {
          roomState.players = [...roomState.players, { id: `bot_${i}`, name }]
          trigger('player_joined', { players: roomState.players })
        }, 700 + i * 600)
      })
    }

    if (event === 'start_game') {
      const assigned = assignRoles(roomState.players, data.settings)
      roomState.players = assigned
      roomState.votes = {}
      trigger('game_started', { players: assigned })
    }

    if (event === 'cast_vote') {
      roomState.votes[data.voterId] = data.targetId
      const counts = countVotes(roomState.votes)
      trigger('vote_update', { votes: counts })

      // Simulate bots voting after a delay
      roomState.players
        .filter(p => p.id !== 'me' && !roomState.votes[p.id])
        .forEach((p, i) => {
          setTimeout(() => {
            const targets = roomState.players.filter(t => t.id !== p.id)
            const target = targets[Math.floor(Math.random() * targets.length)]
            roomState.votes[p.id] = target.id
            const updated = countVotes(roomState.votes)
            trigger('vote_update', { votes: updated })
            if (Object.keys(roomState.votes).length >= roomState.players.length) {
              resolveGame(updated, roomState.players)
            }
          }, (i + 1) * 800)
        })

      if (Object.keys(roomState.votes).length >= roomState.players.length) {
        resolveGame(counts, roomState.players)
      }
    }

    if (event === 'time_up') {
      const spy = roomState.players.find(p => p.role === 'spy')
      trigger('game_over', { winner: 'spy', spyId: spy?.id, eliminatedId: null })
    }
  }
}

export default mockSocket