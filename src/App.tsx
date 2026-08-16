import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import AddReservation from '@/pages/AddReservation'
import ReservationDetail from '@/pages/ReservationDetail'
import SiteSettings from '@/pages/SiteSettings'
import Simulation from '@/pages/Simulation'
import PluginSettings from '@/pages/PluginSettings'
import ReadyScreen from '@/pages/ReadyScreen'
import Discovery from '@/pages/Discovery'

/**
 * Sprint 8: 예약 준비 화면(/ready/:id) 라우트를 추가한다.
 * Sprint 11: 공연 찾기(Discovery, /discovery) 라우트를 추가한다(Ticket Discovery Center).
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
      <Route path="/plugin" element={<PluginSettings />} />
      <Route path="/ready/:id" element={<ReadyScreen />} />
      <Route path="/discovery" element={<Discovery />} />
    </Routes>
  )
}

export default App
