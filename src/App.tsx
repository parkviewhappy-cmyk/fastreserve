import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import AddReservation from '@/pages/AddReservation'
import ReservationDetail from '@/pages/ReservationDetail'
import SiteSettings from '@/pages/SiteSettings'
import Simulation from '@/pages/Simulation'

/**
 * Sprint 6: Simulation Mode(/simulation) 라우트를 추가한다.
 * 이후 Sprint에서 History, Setting 라우트를 추가한다.
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add" element={<AddReservation />} />
      <Route path="/reservation/:id" element={<ReservationDetail />} />
      <Route path="/site" element={<SiteSettings />} />
      <Route path="/simulation" element={<Simulation />} />
    </Routes>
  )
}

export default App
