import { useState } from 'react'
import { clinics } from '../data/clinics'
import { doctors } from '../data/doctors'
import { doctorsOf, formatDayLong, freeSlots } from '../utility/utils'
import type { AppData } from '../utility/state'

const inputClass = 'mt-1 w-full border border-[#CBE4E8] bg-white rounded px-3 py-2 focus:outline-none focus:border-[#0D5C63]'
const optionClass = (active: boolean) =>
  `text-left rounded-lg border px-3 py-2 text-sm transition-colors cursor-pointer ${active ? 'border-[#0D5C63] bg-[#E6F2F4] text-[#0D5C63] font-medium' : 'border-[#CBE4E8] bg-white hover:border-[#0D5C63]'}`

export default function BookingForm({ data }: { data: AppData }) {
  const { appointments, addAppointment } = data
  const [clinicId, setClinicId] = useState('')
  const [doctorId, setDoctorId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [patientName, setPatientName] = useState('')
  const [complaint, setComplaint] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const clinicDoctors = clinicId ? doctorsOf(doctors, clinicId) : []
  const slots = doctorId && date ? freeSlots(appointments, doctorId, date) : []

  function pickClinic(id: string) {
    setClinicId(id)
    setDoctorId('')
    setTime('')
    setSuccess(false)
  }

  function pickDoctor(id: string) {
    setDoctorId(id)
    setTime('')
    setSuccess(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!clinicId || !doctorId) {
      setError('Lütfen poliklinik ve doktor seçin.')
      return
    }
    if (!time) {
      setError('Lütfen bir saat seçin.')
      return
    }
    try {
      addAppointment({ patientName: patientName.trim(), doctorId, clinicId, date, time, complaint: complaint.trim() })
      setClinicId('')
      setDoctorId('')
      setDate('')
      setTime('')
      setPatientName('')
      setComplaint('')
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#CBE4E8] p-5 space-y-4">
      <h2 className="text-lg font-bold text-[#0A4D56]">Randevu Al</h2>

      {error && <p className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-3 py-2">{error}</p>}
      {success && <p className="bg-green-50 border border-green-200 text-green-700 text-sm rounded px-3 py-2">Randevu oluşturuldu, listede görebilirsin.</p>}

      <div>
        <p className="text-sm font-medium mb-1">Poliklinik</p>
        <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
          {clinics.map((c) => (
            <button key={c.id} type="button" onClick={() => pickClinic(c.id)} className={optionClass(c.id === clinicId)}>{c.name}</button>
          ))}
        </div>
      </div>

      {clinicId && (
        <div>
          <p className="text-sm font-medium mb-1">Doktor</p>
          <div className="grid grid-cols-2 gap-2">
            {clinicDoctors.map((d) => (
              <button key={d.id} type="button" onClick={() => pickDoctor(d.id)} className={optionClass(d.id === doctorId)}>{d.name}</button>
            ))}
          </div>
        </div>
      )}

      {doctorId && (
        <>
          <label className="block text-sm">
            Tarih
            <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setTime('') }} required className={inputClass} />
          </label>

          {date && (
            <div>
              <p className="text-sm mb-2">{formatDayLong(date)}</p>
              {slots.length === 0 ? (
                <p className="text-sm text-slate-500">Bu gün için boş saat yok.</p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {slots.map((t) => (
                    <button key={t} type="button" onClick={() => setTime(t)} className={`rounded border py-1 text-sm transition-colors cursor-pointer ${t === time ? 'bg-[#0D5C63] text-white border-[#0D5C63]' : 'bg-white border-[#CBE4E8] hover:border-[#0D5C63] hover:bg-[#E6F2F4]'}`}>{t}</button>
                  ))}
                </div>
              )}
            </div>
          )}

          <label className="block text-sm">
            Ad Soyad
            <input value={patientName} onChange={(e) => setPatientName(e.target.value)} required className={inputClass} />
          </label>

          <label className="block text-sm">
            Şikayet
            <textarea value={complaint} onChange={(e) => setComplaint(e.target.value)} required rows={3} className={inputClass} />
          </label>

          <button className="w-full bg-[#0D5C63] hover:bg-[#0A4D56] text-white rounded px-5 py-2 transition-colors cursor-pointer">Randevuyu Onayla</button>
        </>
      )}
    </form>
  )
}
