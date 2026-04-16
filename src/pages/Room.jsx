import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import Lobby from './Lobby'
import RoleReveal from './RoleReveal'
import Game from './Game'
import Results from './Results'

function Room() {
  const { phase, myName } = useGame()
  const navigate = useNavigate()

  useEffect(() => {
    if (!myName) navigate('/')
  }, [myName])

  if (phase === 'reveal') return <RoleReveal />
  if (phase === 'game') return <Game />
  if (phase === 'results') return <Results />
  return <Lobby />
}

export default Room