import { Link } from 'react-router-dom'
import type { User } from '../interfaces'
import { doctorsOf } from '../utility/utils'
import type { AppData } from '../utility/state'

export default function Home({ user, data }: { user: User | null; data: AppData }) {
  const { clinics, users } = data
  const doctorCount = doctorsOf(users).length
  const cta = !user
    ? { to: '/register', label: 'Hemen Kayıt Ol' }
    : user.role === 'hasta'
      ? { to: '/randevu-al', label: 'Randevu Al' }
      : user.role === 'doktor'
        ? { to: '/randevularim', label: 'Randevularım' }
        : { to: '/yonetim', label: 'Yönetim Paneli' }

  const stats = [
    { value: clinics.length, label: 'Klinik' },
    { value: doctorCount, label: 'Uzman Doktor' },
    { value: '112', label: 'Acil Hat' },
    { value: '09.00 - 17.00', label: 'Muayene Saatleri' },
  ]

  return (
    <div className="home-page max-w-6xl mx-auto px-6 sm:px-1 py-8 space-y-8">
      <section className="rounded-2xl bg-[#0D5C63]/80 backdrop-blur-md border border-white/20 text-white p-8 sm:p-14 shadow-lg">
        <p className="text-sm uppercase tracking-widest text-teal-100">MediCore Hastanesi</p>
        <h1 className="text-3xl sm:text-5xl font-bold mt-3 max-w-2xl leading-tight">Sağlığınız için doğru adres</h1>
        <p className="mt-4 max-w-xl text-teal-50">Modern kliniklerimiz ve uzman doktorlarımızla yanınızdayız. Randevunuzu online alın, sırada beklemeyin.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={cta.to} className="bg-white text-[#0D5C63] font-medium rounded px-6 py-3">{cta.label}</Link>
          {!user && <Link to="/login" className="border border-white rounded px-6 py-3">Hasta Girişi</Link>}
          {user?.role === 'hasta' && <Link to="/klinikler" className="border border-white rounded px-6 py-3">Kliniklerimiz</Link>}
        </div>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#CBE4E8] p-5 text-center">
            <div className="text-3xl font-bold text-[#0D5C63]">{s.value}</div>
            <div className="text-sm text-slate-600 mt-1">{s.label}</div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Kliniklerimiz</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {clinics.slice(0, 12).map((c) => (
            <Link
              key={c.id}
              to={`/randevu-al`}
              className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#CBE4E8] p-4 hover:border-[#0D5C63]"
            >
              <h3 className="font-semibold text-[#0D5C63]">{c.name}</h3>
              <p className="text-sm text-slate-600 mt-1">{c.description}</p>
            </Link>
          ))}
        </div>
        {!user && <p className="text-sm mt-1 font-bold">Tüm klinikleri görüntüleyebilmek için lütfen giriş yapınız...</p>}
      </section>

      <section className="rounded-2xl bg-red-50 border border-red-200 p-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-bold text-red-700">Acil durum mu var?</h2>
          <p className="text-sm text-red-600">Randevu beklemeden 112 Acil Servisi arayın.</p>
        </div>
        <span className="text-3xl font-bold text-red-700">112</span>
      </section>
    </div>
  )
}