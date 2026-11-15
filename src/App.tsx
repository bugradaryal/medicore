import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import Clinics from './pages/Clinics'
import Book from './pages/Book'
import Appointments from './pages/Appointments'
import Admin from './pages/Admin'
import Home from './pages/Home'
import type { Role } from './interfaces'
import { useAppData } from './utility/state'

const homePath: Record<Role, string> = {
  hasta: '/klinikler',
  doktor: '/randevularim',
  yonetim: '/yonetim',
}

export default function App() {
  const data = useAppData()
  const { user } = data

  // Giriş yoksa login'e, giriş var ama rol uygun değilse ana sayfaya
  const redirect = user ? '/' : '/login'

  return (
    <BrowserRouter>
      <div className="min-h-dvh flex flex-col text-slate-800">
        <Header user={user} onLogout={data.logout} />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home user={user} data={data} />}/>
            <Route path="/login" element={user ? <Navigate to={homePath[user.role]} replace /> : <Login data={data} />}/>
            <Route path="/calisan-girisi" element={user ? <Navigate to={homePath[user.role]} replace /> : <Login data={data} staff />}/>
            <Route path="/register" element={user ? <Navigate to={homePath[user.role]} replace /> : <Register data={data} />}/>
            <Route path="/klinikler" element={user?.role === 'hasta' ? <Clinics data={data} /> : <Navigate to={redirect} replace />}/>
            <Route path="/randevu-al" element={user?.role === 'hasta' ? <Book user={user} data={data} /> : <Navigate to={redirect} replace />}/>
            <Route path="/randevularim" element={
                user && user.role !== 'yonetim' ? 
                (<Appointments user={user} data={data} />) : (<Navigate to={redirect} replace />)}/>
            <Route path="/yonetim" element={user?.role === 'yonetim' ? <Admin user={user} data={data} /> : <Navigate to={redirect} replace />}/>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}