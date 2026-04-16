import { HashRouter, Routes, Route } from 'react-router-dom'
import { GameProvider } from './context/GameContext'
import Home from './pages/Home'
import Room from './pages/Room'

function App() {
  return (
    <GameProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:roomCode" element={<Room />} />
        </Routes>
      </HashRouter>
    </GameProvider>
  )
}

export default App