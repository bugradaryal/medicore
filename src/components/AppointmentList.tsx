import { useState } from 'react'
import type { Appointment } from '../interfaces'
import { clinics } from '../data/clinics'
import { doctors } from '../data/doctors'
import { clinicName, doctorName, formatDay, freeSlots, sortAppointments, todayStr } from '../utility/utils'
import type { AppData } from '../utility/state'

const inputClass = 'mt-1 w-full border border-[#CBE4E8] bg-white rounded px-3 py-2 focus:outline-none focus:border-[#0D5C63]'

export default function AppointmentList({ data }: { data: AppData }) {
  const { appointments, updateAppointment, deleteAppointment, deleteAllAppointments } = data
  const list = sortAppointments(appointments)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ patientName: '', date: '', time: '', complaint: '' })
  const [error, setError] = useState('')

  function startEdit(a: Appointment) {
    setError('')
    setEditId(a.id)
    setForm({ patientName: a.patientName, date: a.date, time: a.time, complaint: a.complaint })
  }

  function saveEdit(a: Appointment) {
    if (!form.time) {
      setError('Lütfen bir saat seçin.')
      return
    }
    try {
      updateAppointment({ ...a, ...form, patientName: form.patientName.trim(), complaint: form.complaint.trim() })
      setEditId(null)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.')
    }
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3 bg-white/90 backdrop-blur-sm rounded-xl border border-[#CBE4E8] px-5 py-3">
        <h2 className="text-lg font-bold text-[#0A4D56]">Randevularım ({list.length})</h2>
        {list.length > 0 && (
          <button onClick={() => window.confirm('Tüm randevular silinsin mi?') && deleteAllAppointments()} className="border border-red-200 bg-white rounded px-3 py-1 text-sm text-red-600 hover:bg-red-100 transition-colors cursor-pointer">Tümünü Sil</button>
        )}
      </div>

      {error && <p className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-3 py-2">{error}</p>}

      {list.length === 0 && (
        <p className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#CBE4E8] p-6 text-center text-slate-500">Henüz randevun yok. Soldan poliklinik ve doktor seçerek ilk randevunu al.</p>
      )}

      {list.map((a) => (
        <div key={a.id} className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#CBE4E8] p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="bg-[#E6F2F4] text-[#0D5C63] rounded-lg px-4 py-2 text-center w-24 shrink-0">
              <div className="font-bold">{formatDay(a.date)}</div>
              <div className="text-sm">{a.time}</div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[#0A4D56]">{doctorName(doctors, a.doctorId)}</p>
              <p className="text-sm text-slate-600">{clinicName(clinics, a.clinicId)} · Hasta: {a.patientName}</p>
              <p className="text-sm mt-1">{a.complaint}</p>
            </div>
          </div>

          {editId === a.id ? (
            <div className="border-t border-[#CBE4E8] pt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-sm sm:col-span-2">
                Ad Soyad
                <input value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} className={inputClass} />
              </label>
              <label className="text-sm">
                Tarih
                <input type="date" min={todayStr()} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value, time: '' })} className={inputClass} />
              </label>
              <label className="text-sm">
                Saat
                <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className={inputClass}>
                  <option value="">Seç</option>
                  {freeSlots(appointments, a.doctorId, form.date, a.id).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm sm:col-span-2">
                Şikayet
                <input value={form.complaint} onChange={(e) => setForm({ ...form, complaint: e.target.value })} className={inputClass} />
              </label>
              <div className="flex gap-2">
                <button onClick={() => saveEdit(a)} className="bg-[#0D5C63] hover:bg-[#0A4D56] text-white rounded px-4 py-2 text-sm transition-colors cursor-pointer">Kaydet</button>
                <button onClick={() => setEditId(null)} className="border border-[#CBE4E8] bg-white hover:bg-slate-100 rounded px-4 py-2 text-sm transition-colors cursor-pointer">Vazgeç</button>
              </div>
            </div>
          ) : (
            <div className="border-t border-[#CBE4E8] pt-3 flex flex-wrap gap-2 text-sm">
              <button onClick={() => startEdit(a)} className="border border-[#CBE4E8] bg-white rounded px-3 py-1 text-[#0D5C63] hover:bg-[#0D5C63]/10 transition-colors cursor-pointer">Düzenle</button>
              <button onClick={() => window.confirm('Randevu silinsin mi?') && deleteAppointment(a.id)} className="border border-[#CBE4E8] bg-white rounded px-3 py-1 text-red-600 hover:bg-red-100 transition-colors cursor-pointer">Sil</button>
            </div>
          )}
        </div>
      ))}
    </section>
  )
}
