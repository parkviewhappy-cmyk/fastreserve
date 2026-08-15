import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'

// Sprint 1: Home 화면만 라우팅한다.
// 이후 Sprint에서 Add Reservation, Reservation Detail, Ready, History, Setting 라우트를 추가한다.
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default App
