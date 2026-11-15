import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { User } from '../interfaces'
import { doctorsOf, formatDayLong, freeSlots, todayStr } from '../utility/utils'
import type { AppData } from '../utility/state'

export default function Book({ user, data }: { user: User; data: AppData }) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { clinics, users, appointments } = data

  // URL'deki klinik geçerli değilse yok say
  const paramClinic = params.get('klinik') ?? ''
  const [clinicId, setClinicId] = useState(clinics.some((c) => c.id === paramClinic) ? paramClinic : '')
  const [doctorId, setDoctorId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [complaint, setComplaint] = useState('')
  const [error, setError] = useState('')

  const doctors = clinicId ? doctorsOf(users, clinicId) : []
  const slots = doctorId && date ? freeSlots(appointments, doctorId, date) : []

  function pickClinic(id: string) {
    setClinicId(id)
    setDoctorId('')
    setTime('')
  }

  function pickDoctor(id: string) {
    setDoctorId(id)
    setTime('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!time) {
      setError('Lütfen bir saat seçin.')
      return
    }
    try {
      data.addAppointment({ patientId: user.id, patientName: user.name, doctorId, clinicId, date, time, complaint: complaint.trim(), status: 'beklemede' })
      navigate('/randevularim')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.')
    }
  }

  return (
    <div className="space-y-6 image-page">
      <div>
        <h1 className="text-2xl font-bold text-[#0A4D56]">Randevu Al</h1>
        <p className="text-slate-600 text-sm">Klinik, doktor ve saat seçerek randevunu oluştur.</p>
      </div>

      <section className="space-y-2">
        <h2 className="font-semibold text-[#0A4D56]">1. Klinik</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {clinics.map((c) => (
            <button key={c.id} type="button" onClick={() => pickClinic(c.id)} className={`text-left rounded-lg border p-3 transition-colors cursor-pointer ${c.id === clinicId ? 'border-[#0D5C63] bg-[#E6F2F4] text-[#0D5C63] font-medium' : 'border-[#CBE4E8] bg-white/90 backdrop-blur-sm hover:border-[#0D5C63] hover:bg-white'}`}>{c.name}</button>
          ))}
        </div>
      </section>

      {clinicId && (
        <section className="space-y-2">
          <h2 className="font-semibold text-[#0A4D56]">2. Doktor</h2>
          {doctors.length === 0 ? (
            <p className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#CBE4E8] p-3 text-sm text-slate-500">Bu klinikte doktor yok.</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {doctors.map((d) => (
                <button key={d.id} type="button" onClick={() => pickDoctor(d.id)} className={`text-left rounded-lg border p-3 transition-colors cursor-pointer ${d.id === doctorId ? 'border-[#0D5C63] bg-[#E6F2F4] text-[#0D5C63] font-medium' : 'border-[#CBE4E8] bg-white/90 backdrop-blur-sm hover:border-[#0D5C63] hover:bg-white'}`}>{d.name}</button>
              ))}
            </div>
          )}
        </section>
      )}

      {doctorId && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white/90 backdrop-blur-sm rounded-xl border border-[#CBE4E8] p-5">
          <h2 className="font-semibold text-[#0A4D56]">3. Tarih ve saat</h2>
          {error && <p className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-3 py-2">{error}</p>}

          <label className="block text-sm">
            Tarih
            <input type="date" value={date} min={todayStr()} onChange={(e) => { setDate(e.target.value); setTime('') }} required className="mt-1 block border border-[#CBE4E8] bg-white rounded px-3 py-2 focus:outline-none focus:border-[#0D5C63]"/>
          </label>

          {date && (
            <div>
              <p className="text-sm mb-2">{formatDayLong(date)}</p>
              {slots.length === 0 ? (
                <p className="text-sm text-slate-500">Bu gün için boş saat yok.</p>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                  {slots.map((t) => (
                    <button key={t} type="button" onClick={() => setTime(t)} className={`rounded border py-1 text-sm transition-colors cursor-pointer ${t === time ? 'bg-[#0D5C63] text-white border-[#0D5C63] hover:bg-[#0A4D56]' : 'bg-white border-[#CBE4E8] hover:border-[#0D5C63] hover:bg-[#E6F2F4]'}`}>{t}</button>
                  ))}
                </div>
              )}
            </div>
          )}

          <label className="block text-sm">
            Şikayet
            <textarea value={complaint} onChange={(e) => setComplaint(e.target.value)} required rows={3} className="mt-1 w-full border border-[#CBE4E8] bg-white rounded px-3 py-2 focus:outline-none focus:border-[#0D5C63]"/>
          </label>

          <button className="bg-[#0D5C63] hover:bg-[#0A4D56] text-white rounded px-5 py-2 transition-colors cursor-pointer">Randevuyu Onayla</button>
        </form>
      )}
    </div>
  )
}