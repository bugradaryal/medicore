import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { AppData } from '../utility/state'

interface Props {
  data: AppData
  staff?: boolean // true: çalışan (doktor / yönetim) girişi
}

export default function Login({ data, staff = false }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      data.login(email, password, staff) // başarılıysa App kullanıcıyı yönlendirir
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto bg-white p-6 rounded-xl border space-y-3 mt-15 image-page">
      <h1 className="text-xl font-bold">{staff ? 'Çalışan Girişi' : 'Hasta Girişi'}</h1>
      <p className="text-sm text-slate-500">{staff ? 'Doktor ve yönetim hesapları için.' : 'Randevularını görmek için giriş yap.'}</p>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border rounded px-3 py-2"/>
      <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border rounded px-3 py-2"/>
      <button className="w-full bg-teal-700 text-white rounded py-2">Giriş</button>
      {staff ? (
        <div>
          <p className="text-xs text-slate-400">Yönetici: admin@medicore.com / 1234</p>
          <p className="text-xs text-slate-400">Doktor: ayse@medicore.com / 1234</p>
        </div>
      ) : (
        <p className="text-sm text-slate-500">Hesabın yok mu? <Link to="/register" className="text-teal-700 underline">Kayıt ol</Link></p>
      )}
    </form>
  )
}