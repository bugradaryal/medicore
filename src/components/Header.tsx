import { Link, NavLink } from 'react-router-dom'
import type { User } from '../interfaces'
import { roleLabels } from '../utility/utils'

interface Props {
  user: User | null
  onLogout: () => void
}

export default function Header({ user, onLogout }: Props) {
  const linkClass = ({ isActive }: { isActive: boolean }) => `px-3 py-1 rounded ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`

  return (
    <header className="bg-[#0A4D56] text-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/" className="text-xl font-bold">✚ MediCore</Link>
          <nav className="flex flex-wrap gap-1 text-sm">
            {user?.role === 'hasta' && (
              <>
                <NavLink to="/klinikler" className={linkClass}>Klinikler</NavLink>
                <NavLink to="/randevu-al" className={linkClass}>Randevu Al</NavLink>
                <NavLink to="/randevularim" className={linkClass}>Randevularım</NavLink>
              </>
            )}
            {user?.role === 'doktor' && <NavLink to="/randevularim" className={linkClass}>Randevular</NavLink>}
            {user?.role === 'yonetim' && <NavLink to="/yonetim" className={linkClass}>Yönetim Paneli</NavLink>}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <span>{user.name} · {roleLabels[user.role]}</span>
              <button onClick={onLogout} className="bg-[#E11D48] text-white px-3 py-1 rounded">Çıkış</button>
            </>
          ) : (
            <>
              <Link to="/calisan-girisi" className="border border-white px-4 py-1.5 rounded">Çalışan Girişi</Link>
              <Link to="/login" className="bg-white text-teal-700 font-medium px-4 py-1.5 rounded">Hasta Portalı</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}