import { useState } from 'react'
import type { Appointment } from '../interfaces'
import { clinics } from '../data/clinics'
import { doctors } from '../data/doctors'
import { clinicName, doctorName, formatDay, freeSlots, isPast, isValidDate, sortAppointments } from '../utility/utils'
import type { AppData } from '../utility/state'

const inputClass = 'mt-1 w-full border border-[#CBE4E8] bg-white rounded px-3 py-2 focus:outline-none focus:border-[#0D5C63]'

export default function AppointmentList({ data }: { data: AppData }) {
  const { appointments, updateAppointment, toggleAttended, deleteAppointment, deleteAllAppointments } = data
  const list = sortAppointments(appointments)
  const [editId, setEditId] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null) // şikayeti açılmış kart
  const [form, setForm] = useState({ patientName: '', date: '', time: '', complaint: '' })
  const [error, setError] = useState('')

  // İstatistikler
  const total = list.length
  const attendedCount = list.filter((a) => a.attended).length
  const missedCount = list.filter((a) => !a.attended && isPast(a)).length // tarihi geçmiş ama gidilmemiş
  const upcomingCount = total - attendedCount - missedCount
  const percent = total === 0 ? 0 : Math.round((attendedCount / total) * 100)

  function startEdit(a: Appointment) {
    setError('')
    setEditId(a.id)
    setForm({ patientName: a.patientName, date: a.date, time: a.time, complaint: a.complaint })
  }

  function saveEdit(a: Appointment) {
    if (!isValidDate(form.date)) {
      setError('Lütfen geçerli bir tarih seçin.')
      return
    }
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
      {/* Başlık + ilerleme çubuğu */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#CBE4E8] p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-[#0A4D56]">Randevularım</h2>
          {total > 0 && (
            <button onClick={() => window.confirm('Tüm randevular silinsin mi?') && deleteAllAppointments()} className="border border-red-200 bg-white rounded px-3 py-1 text-sm text-red-600 hover:bg-red-100 transition-colors cursor-pointer">Tümünü Sil</button>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-end justify-between text-sm">
            <span className="text-slate-600">Gidilen randevular</span>
            <span className="font-semibold text-[#0D5C63]">{attendedCount} / {total} · %{percent}</span>
          </div>
          <div className="h-3 rounded-full bg-[#E6F2F4] overflow-hidden" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-gradient-to-r from-[#0D5C63] to-[#2FA7A0] transition-all duration-500" style={{ width: `${percent}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center text-sm">
          <div className="rounded-lg bg-[#E6F2F4] py-2"><div className="font-bold text-[#0A4D56]">{total}</div><div className="text-xs text-slate-600">Toplam</div></div>
          <div className="rounded-lg bg-green-50 py-2"><div className="font-bold text-green-700">{attendedCount}</div><div className="text-xs text-slate-600">Gidilen</div></div>
          <div className="rounded-lg bg-amber-50 py-2"><div className="font-bold text-amber-700">{missedCount}</div><div className="text-xs text-slate-600">Geçen</div></div>
          <div className="rounded-lg bg-sky-50 py-2"><div className="font-bold text-sky-700">{upcomingCount}</div><div className="text-xs text-slate-600">Bekleyen</div></div>
        </div>
      </div>

      {error && <p className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-3 py-2">{error}</p>}

      {list.length === 0 && (
        <p className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#CBE4E8] p-6 text-center text-slate-500">Henüz randevun yok. Soldan poliklinik ve doktor seçerek ilk randevunu al.</p>
      )}

      {list.map((a) => {
        const missed = !a.attended && isPast(a)
        const editing = editId === a.id
        const open = openId === a.id
        return (
          <div key={a.id} className={`bg-white/90 backdrop-blur-sm rounded-xl border border-l-4 px-4 py-3 transition-colors ${a.attended ? 'border-[#CBE4E8] border-l-green-500' : missed ? 'border-[#CBE4E8] border-l-amber-500' : 'border-[#CBE4E8] border-l-[#0D5C63]'}`}>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={!!a.attended}
                onChange={() => toggleAttended(a.id)}
                aria-label="Randevuya gidildi"
                className="h-5 w-5 shrink-0 accent-[#0D5C63] cursor-pointer"
              />

              <div className="flex-1 min-w-0">
                <div className={a.attended ? 'line-through text-slate-400' : ''}>
                  <p className={`font-semibold truncate ${a.attended ? '' : 'text-[#0A4D56]'}`}>{doctorName(doctors, a.doctorId)}</p>
                  <p className="text-xs text-slate-500 truncate">{clinicName(clinics, a.clinicId)} · {a.patientName}</p>
                  <p
                    onClick={() => setOpenId(open ? null : a.id)}
                    title="Tamamını görmek için tıkla"
                    className={`text-sm mt-0.5 break-words cursor-pointer ${open ? '' : 'line-clamp-2'}`}
                  >
                    {a.complaint}
                  </p>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="rounded-full bg-[#E6F2F4] text-[#0D5C63] px-2 py-0.5 font-medium">{formatDay(a.date)} · {a.time}</span>
                  {a.attended && <span className="rounded-full bg-green-100 text-green-700 px-2 py-0.5 font-medium">✓ Gidildi</span>}
                  {missed && <span className="rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 font-medium">Tarihi geçti</span>}
                </div>
              </div>

              {!editing && (
                <div className="flex shrink-0 gap-2 text-sm">
                  <button onClick={() => startEdit(a)} className="border border-[#CBE4E8] bg-white rounded-lg px-3 py-1 text-[#0D5C63] hover:bg-[#0D5C63]/10 transition-colors cursor-pointer">Düzenle</button>
                  <button onClick={() => window.confirm('Randevu silinsin mi?') && deleteAppointment(a.id)} className="border border-red-200 bg-white rounded-lg px-3 py-1 text-red-600 hover:bg-red-100 transition-colors cursor-pointer">Sil</button>
                </div>
              )}
            </div>

            {editing && (
              <div className="mt-3 border-t border-[#CBE4E8] pt-3 grid gap-3 sm:grid-cols-2">
                <label className="text-sm sm:col-span-2">
                  Ad Soyad
                  <input value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} className={inputClass} />
                </label>
                <label className="text-sm">
                  Tarih
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value, time: '' })} className={inputClass} />
                </label>
                <label className="text-sm">
                  Saat
                  <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className={inputClass}>
                    <option value="">Seç</option>
                    {(isValidDate(form.date) ? freeSlots(appointments, a.doctorId, form.date, a.id) : []).map((t) => (
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
            )}
          </div>
        )
      })}
    </section>
  )
}