import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { AppData } from '../utility/state'

export default function Register({ data }: { data: AppData }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      data.register(name, email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto bg-white p-6 rounded-xl border space-y-3 mt-15 image-page">
      <h1 className="text-xl font-bold">Hasta Kaydı</h1>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <input placeholder="Ad Soyad" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border rounded px-3 py-2"/>
      <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border rounded px-3 py-2"/>
      <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={4} className="w-full border rounded px-3 py-2"/>
      <button className="w-full bg-teal-700 text-white rounded py-2">Kayıt Ol</button>
      <p className="text-sm text-slate-500">Zaten hesabın var mı? <Link to="/login" className="text-teal-700 underline">Giriş yap</Link></p>
    </form>
  )
}