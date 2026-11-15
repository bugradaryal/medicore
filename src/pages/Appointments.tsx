import { useState } from 'react'
import type { Appointment, Status, User } from '../interfaces'
import { appointmentsOf, clinicName, formatDay, freeSlots, statusLabels, todayStr, userName } from '../utility/utils'
import type { AppData } from '../utility/state'

const filters: { key: Status | 'hepsi'; label: string }[] = [
  { key: 'hepsi', label: 'Tümü' },
  { key: 'beklemede', label: 'Beklemede' },
  { key: 'onaylandi', label: 'Onaylandı' },
  { key: 'iptal', label: 'İptal' },
]

export default function Appointments({ user, data }: { user: User; data: AppData }) {
  const { clinics, users, appointments, updateAppointment, deleteAppointment } = data
  const isPatient = user.role === 'hasta'
  const list = appointmentsOf(appointments, user)
  const [filter, setFilter] = useState<Status | 'hepsi'>('hepsi')
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ date: '', time: '', complaint: '' })
  const [error, setError] = useState('')

  const shown = filter === 'hepsi' ? list : list.filter((a) => a.status === filter)

  function run(action: () => void) {
    try {
      action()
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.')
    }
  }

  function startEdit(a: Appointment) {
    setError('')
    setEditId(a.id)
    setForm({ date: a.date, time: a.time, complaint: a.complaint })
  }

  function saveEdit(a: Appointment) {
    if (!form.time) {
      setError('Lütfen bir saat seçin.')
      return
    }
    run(() => {
      updateAppointment({ ...a, ...form, status: 'beklemede' })
      setEditId(null)
    })
  }

  return (
    <div className="space-y-6 image-page">
      <div>
        <h1 className="text-2xl font-bold text-[#0A4D56]">{isPatient ? 'Randevularım' : 'Gelen Randevular'}</h1>
        <p className="text-slate-600 text-sm">{isPatient ? 'Aldığın randevuları buradan takip edebilirsin.' : 'Sana alınan randevuları onaylayabilir veya iptal edebilirsin.'}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={`px-3 py-1 rounded-full text-sm border transition-colors cursor-pointer ${filter === f.key ? 'bg-[#0D5C63] text-white border-[#0D5C63] hover:bg-[#0A4D56]' : 'bg-white/90 border-[#CBE4E8] text-slate-700 hover:bg-white hover:border-[#0D5C63]'}`}>
            {f.label} ({f.key === 'hepsi' ? list.length : list.filter((a) => a.status === f.key).length})
          </button>
        ))}
      </div>

      {error && <p className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-3 py-2">{error}</p>}

      {shown.length === 0 && <p className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#CBE4E8] p-6 text-center text-slate-500">Randevu yok.</p>}

      <div className="space-y-3">
        {shown.map((a) => (
          <div key={a.id} className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#CBE4E8] p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="bg-[#E6F2F4] text-[#0D5C63] rounded-lg px-4 py-2 text-center w-24 shrink-0">
                <div className="font-bold">{formatDay(a.date)}</div>
                <div className="text-sm">{a.time}</div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#0A4D56]">{isPatient ? userName(users, a.doctorId) : a.patientName}</p>
                <p className="text-sm text-slate-600">{clinicName(clinics, a.clinicId)}</p>
                <p className="text-sm mt-1">{a.complaint}</p>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full self-start sm:self-center ${a.status === 'beklemede' ? 'bg-amber-100 text-amber-700' : a.status === 'onaylandi' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{statusLabels[a.status]}</span>
            </div>

            {editId === a.id ? (
              <div className="border-t border-[#CBE4E8] pt-3 grid gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  Tarih
                  <input type="date" min={todayStr()} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value, time: '' })} className="mt-1 w-full border border-[#CBE4E8] bg-white rounded px-3 py-2 focus:outline-none focus:border-[#0D5C63]"/>
                </label>
                <label className="text-sm">
                  Saat
                  <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="mt-1 w-full border border-[#CBE4E8] bg-white rounded px-3 py-2 focus:outline-none focus:border-[#0D5C63]">
                    <option value="">Seç</option>
                    {freeSlots(appointments, a.doctorId, form.date, a.id).map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className="text-sm sm:col-span-2">
                  Şikayet
                  <input value={form.complaint} onChange={(e) => setForm({ ...form, complaint: e.target.value })} className="mt-1 w-full border border-[#CBE4E8] bg-white rounded px-3 py-2 focus:outline-none focus:border-[#0D5C63]"/>
                </label>
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(a)} className="bg-[#0D5C63] hover:bg-[#0A4D56] text-white rounded px-4 py-2 text-sm transition-colors cursor-pointer">Kaydet</button>
                  <button onClick={() => setEditId(null)} className="border border-[#CBE4E8] bg-white hover:bg-slate-100 rounded px-4 py-2 text-sm transition-colors cursor-pointer">Vazgeç</button>
                </div>
              </div>
            ) : (
              <div className="border-t border-[#CBE4E8] pt-3 flex flex-wrap gap-2 text-sm">
                {isPatient ? (
                  <>
                    {a.status !== 'iptal' && <button onClick={() => startEdit(a)} className="border border-[#CBE4E8] bg-white rounded px-3 py-1 text-[#0D5C63] hover:bg-[#0D5C63]/10 transition-colors cursor-pointer">Düzenle</button>}
                    {a.status !== 'iptal' && <button onClick={() => run(() => updateAppointment({ ...a, status: 'iptal' }))} className="border border-[#CBE4E8] bg-white rounded px-3 py-1 text-amber-600 hover:bg-amber-100 transition-colors cursor-pointer">İptal Et</button>}
                    {a.status === 'iptal' && <button onClick={() => window.confirm('Randevu silinsin mi?') && run(() => deleteAppointment(a.id))} className="border border-[#CBE4E8] bg-white rounded px-3 py-1 text-red-600 hover:bg-red-100 transition-colors cursor-pointer">Sil</button>}
                  </>
                ) : (
                  <>
                    {a.status === 'beklemede' && <button onClick={() => run(() => updateAppointment({ ...a, status: 'onaylandi' }))} className="border border-[#CBE4E8] bg-white rounded px-3 py-1 text-green-700 hover:bg-green-100 transition-colors cursor-pointer">Onayla</button>}
                    {a.status !== 'iptal' && <button onClick={() => run(() => updateAppointment({ ...a, status: 'iptal' }))} className="border border-[#CBE4E8] bg-white rounded px-3 py-1 text-amber-600 hover:bg-amber-100 transition-colors cursor-pointer">İptal Et</button>}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}