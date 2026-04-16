import { createContext, useContext, useReducer, useEffect } from 'react'
import mockSocket from '../network/mockSocket'

const GameContext = createContext()

const DEFAULT_SETTINGS = {
  rolesEnabled: false,
  numSpies: 1,
  timer: 60,
  spyMode: 'no_word',
  displayVotes: true,
}

const initialState = {
  phase: 'lobby',
  roomCode: '',
  myId: 'me',
  myName: '',
  players: [],
  settings: DEFAULT_SETTINGS,
  revealIndex: 0,
  timeLeft: 60,
  votes: {},
  winner: null,
  spyId: null,
  eliminatedId: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'JOIN_ROOM':
      return { ...state, myName: action.name, roomCode: action.roomCode }
    case 'SET_PLAYERS':
      return { ...state, players: action.players }
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.settings } }
    case 'GAME_STARTED':
      return {
        ...state, phase: 'reveal', players: action.players,
        revealIndex: 0, votes: {}, winner: null, spyId: null,
        eliminatedId: null, timeLeft: state.settings.timer,
      }
    case 'NEXT_REVEAL':
      if (action.index >= state.players.length - 1) return { ...state, phase: 'game' }
      return { ...state, revealIndex: action.index + 1 }
    case 'TICK':
      return { ...state, timeLeft: Math.max(0, state.timeLeft - 1) }
    case 'VOTE_UPDATE':
      return { ...state, votes: action.votes }
    case 'GAME_OVER':
      return { ...state, phase: 'results', winner: action.winner, spyId: action.spyId, eliminatedId: action.eliminatedId }
    case 'PLAY_AGAIN':
      return { ...initialState, roomCode: state.roomCode, myName: state.myName }
    default:
      return state
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    mockSocket.on('room_joined', ({ players }) => dispatch({ type: 'SET_PLAYERS', players }))
    mockSocket.on('player_joined', ({ players }) => dispatch({ type: 'SET_PLAYERS', players }))
    mockSocket.on('game_started', ({ players }) => dispatch({ type: 'GAME_STARTED', players }))
    mockSocket.on('vote_update', ({ votes }) => dispatch({ type: 'VOTE_UPDATE', votes }))
    mockSocket.on('game_over', ({ winner, spyId, eliminatedId }) =>
      dispatch({ type: 'GAME_OVER', winner, spyId, eliminatedId })
    )
  }, [])

  // Timer
  useEffect(() => {
    if (state.phase !== 'game') return
    if (state.timeLeft <= 0) { mockSocket.emit('time_up', {}); return }
    const t = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(t)
  }, [state.phase, state.timeLeft])

  const actions = {
    joinRoom(name, roomCode) {
      dispatch({ type: 'JOIN_ROOM', name, roomCode })
      mockSocket.emit('join_room', { name, roomCode })
    },
    startGame() {
      mockSocket.emit('start_game', { settings: state.settings })
    },
    nextReveal() {
      dispatch({ type: 'NEXT_REVEAL', index: state.revealIndex })
    },
    castVote(targetId) {
      mockSocket.emit('cast_vote', { targetId, voterId: state.myId })
    },
    updateSettings(settings) {
      dispatch({ type: 'UPDATE_SETTINGS', settings })
    },
    playAgain() {
      dispatch({ type: 'PLAY_AGAIN' })
    },
  }

  return (
    <GameContext.Provider value={{ ...state, ...actions }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  return useContext(GameContext)
}