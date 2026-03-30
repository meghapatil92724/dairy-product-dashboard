import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Navbar from './components/layout/Navbar'
import Login from './pages/Login'
import MentalWellness from './pages/MentalWellness'
import Chat from './pages/Chat'
import VoiceChat from './pages/VoiceChat'
import Dashboard from './pages/Dashboard'
import Wellness from './pages/Wellness'
import Emergency from './pages/Emergency'
import Booking from './pages/Booking'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="min-h-screen flex flex-col relative text-gray-800 font-body">
              <Navbar />
              <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <Routes>
                  <Route path="/" element={<MentalWellness />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/voice" element={<VoiceChat />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/wellness" element={<Wellness />} />
                  <Route path="/emergency" element={<Emergency />} />
                  <Route path="/booking" element={<Booking />} />
                </Routes>
              </main>
              </div>
            </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  )
}

export default App
