import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Lobby from './pages/Lobby'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:roomCode" element={<Lobby />} />
      </Routes>
    </HashRouter>
  )
}

export default App