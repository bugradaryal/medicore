import { useState } from 'react'
import type { User } from '../interfaces'
import { appointmentsOf, clinicName, doctorsOf, formatDay, statusLabels, userName } from '../utility/utils'
import type { AppData } from '../utility/state'

type Tab = 'klinikler' | 'doktorlar' | 'randevular'

export default function Admin({ user, data }: { user: User; data: AppData }) {
  const { clinics, users, addClinic, updateClinic, deleteClinic, addDoctor, deleteDoctor, updateAppointment, deleteAppointment } = data
  const doctors = doctorsOf(users)
  const appointments = appointmentsOf(data.appointments, user)
  const patientCount = users.filter((u) => u.role === 'hasta').length

  const [tab, setTab] = useState<Tab>('klinikler')
  const [error, setError] = useState('')

  const [clinicForm, setClinicForm] = useState({ name: '', description: '' })
  const [clinicEditId, setClinicEditId] = useState<string | null>(null)
  const [doctorForm, setDoctorForm] = useState({ name: '', email: '', password: '', clinicId: '' })

  function run(action: () => void) {
    try {
      action()
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.')
    }
  }

  function submitClinic(e: React.FormEvent) {
    e.preventDefault()
    run(() => {
      if (clinicEditId) updateClinic({ id: clinicEditId, ...clinicForm })
      else addClinic(clinicForm.name, clinicForm.description)
      setClinicEditId(null)
      setClinicForm({ name: '', description: '' })
    })
  }

  function submitDoctor(e: React.FormEvent) {
    e.preventDefault()
    run(() => {
      addDoctor(doctorForm.name, doctorForm.email, doctorForm.password, selectedClinicId)
      setDoctorForm({ name: '', email: '', password: '', clinicId: '' })
    })
  }

  // Formda seçili klinik yoksa (ya da silindiyse) ilk klinik kullanılır; hiç klinik yoksa boş kalır
  const selectedClinicId = clinics.some((c) => c.id === doctorForm.clinicId) ? doctorForm.clinicId : (clinics[0]?.id ?? '')

  const stats = [
    { label: 'Klinik', value: clinics.length },
    { label: 'Doktor', value: doctors.length },
    { label: 'Hasta', value: patientCount },
    { label: 'Randevu', value: appointments.length },
  ]

  const tabs: { key: Tab; label: string }[] = [
    { key: 'klinikler', label: 'Klinikler' },
    { key: 'doktorlar', label: 'Doktorlar' },
    { key: 'randevular', label: 'Randevular' },
  ]

  return (
    <div className="space-y-6 image-page">
      <h1 className="text-2xl font-bold text-[#0A4D56]">Yönetim Paneli</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#CBE4E8] p-4">
            <div className="text-2xl font-bold text-[#0D5C63]">{s.value}</div>
            <div className="text-sm text-slate-600">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-b border-[#0D5C63]/30">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => { setTab(t.key); setError('') }} className={`px-4 py-2 -mb-px border-b-2 cursor-pointer transition-colors ${tab === t.key ? 'border-[#0D5C63] text-[#0D5C63] font-medium' : 'border-transparent text-slate-600 hover:text-[#0D5C63]'}`}>{t.label}</button>
        ))}
      </div>

      {error && <p className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-3 py-2">{error}</p>}

      {tab === 'klinikler' && (
        <div className="space-y-4">
          <form onSubmit={submitClinic} className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#CBE4E8] p-4 grid gap-3 sm:grid-cols-3">
            <input placeholder="Klinik adı" value={clinicForm.name} onChange={(e) => setClinicForm({ ...clinicForm, name: e.target.value })} required className="w-full border border-[#CBE4E8] bg-white rounded px-3 py-2 focus:outline-none focus:border-[#0D5C63]"/>
            <input placeholder="Açıklama" value={clinicForm.description} onChange={(e) => setClinicForm({ ...clinicForm, description: e.target.value })} className="w-full border border-[#CBE4E8] bg-white rounded px-3 py-2 focus:outline-none focus:border-[#0D5C63]"/>
            <div className="flex gap-2">
              <button className="bg-[#0D5C63] hover:bg-[#0A4D56] text-white rounded px-4 py-2 transition-colors cursor-pointer">{clinicEditId ? 'Güncelle' : 'Ekle'}</button>
              {clinicEditId && (
                <button type="button" onClick={() => { setClinicEditId(null); setClinicForm({ name: '', description: '' }) }} className="border border-[#CBE4E8] bg-white hover:bg-slate-100 rounded px-4 py-2 transition-colors cursor-pointer">Vazgeç</button>
              )}
            </div>
          </form>

          <div className="grid gap-3 sm:grid-cols-2">
            {clinics.map((c) => (
              <div key={c.id} className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#CBE4E8] p-4 space-y-2">
                <div>
                  <h2 className="font-semibold text-[#0D5C63]">{c.name}</h2>
                  <p className="text-sm text-slate-600">{c.description}</p>
                </div>
                <p className="text-xs text-slate-500">{doctors.filter((d) => d.clinicId === c.id).length} doktor</p>
                <div className="flex gap-1 text-sm">
                  <button onClick={() => { setClinicEditId(c.id); setClinicForm({ name: c.name, description: c.description }) }} className="px-2 py-1 rounded transition-colors cursor-pointer text-[#0D5C63] hover:bg-[#0D5C63]/10">Düzenle</button>
                  <button onClick={() => window.confirm(`${c.name} silinsin mi?`) && run(() => { deleteClinic(c.id); if (clinicEditId === c.id) { setClinicEditId(null); setClinicForm({ name: '', description: '' }) } })} className="px-2 py-1 rounded transition-colors cursor-pointer text-red-600 hover:bg-red-100">Sil</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'doktorlar' && (
        <div className="space-y-4">
          <form onSubmit={submitDoctor} className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#CBE4E8] p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <input placeholder="Ad Soyad" value={doctorForm.name} onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })} required className="w-full border border-[#CBE4E8] bg-white rounded px-3 py-2 focus:outline-none focus:border-[#0D5C63]"/>
            <input type="email" placeholder="E-posta" value={doctorForm.email} onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })} required className="w-full border border-[#CBE4E8] bg-white rounded px-3 py-2 focus:outline-none focus:border-[#0D5C63]"/>
            <input type="password" placeholder="Şifre" value={doctorForm.password} onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })} required minLength={4} className="w-full border border-[#CBE4E8] bg-white rounded px-3 py-2 focus:outline-none focus:border-[#0D5C63]"/>
            <select value={selectedClinicId} onChange={(e) => setDoctorForm({ ...doctorForm, clinicId: e.target.value })} className="w-full border border-[#CBE4E8] bg-white rounded px-3 py-2 focus:outline-none focus:border-[#0D5C63]">
              {clinics.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <button disabled={clinics.length === 0} className="bg-[#0D5C63] hover:bg-[#0A4D56] text-white rounded px-4 py-2 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#0D5C63]">Doktor Ekle</button>
          </form>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#CBE4E8] overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#E6F2F4]">
                <tr>
                  <th className="p-3">Ad Soyad</th>
                  <th className="p-3">Klinik</th>
                  <th className="p-3">E-posta</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((d) => (
                  <tr key={d.id} className="border-t border-[#CBE4E8]">
                    <td className="p-3">{d.name}</td>
                    <td className="p-3">{d.clinicId ? clinicName(clinics, d.clinicId) : '-'}</td>
                    <td className="p-3">{d.email}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => window.confirm(`${d.name} ve randevuları silinsin mi?`) && run(() => deleteDoctor(d.id))} className="px-2 py-1 rounded transition-colors cursor-pointer text-red-600 hover:bg-red-100">Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'randevular' && (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#CBE4E8] overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#E6F2F4]">
              <tr>
                <th className="p-3">Hasta</th>
                <th className="p-3">Doktor</th>
                <th className="p-3">Klinik</th>
                <th className="p-3">Tarih</th>
                <th className="p-3">Durum</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-500">Randevu yok.</td>
                </tr>
              )}
              {appointments.map((a) => (
                <tr key={a.id} className="border-t border-[#CBE4E8]">
                  <td className="p-3">{a.patientName}</td>
                  <td className="p-3">{userName(users, a.doctorId)}</td>
                  <td className="p-3">{clinicName(clinics, a.clinicId)}</td>
                  <td className="p-3 whitespace-nowrap">{formatDay(a.date)} {a.time}</td>
                  <td className="p-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${a.status === 'beklemede' ? 'bg-amber-100 text-amber-700' : a.status === 'onaylandi' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{statusLabels[a.status]}</span>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    {a.status === 'beklemede' && <button onClick={() => run(() => updateAppointment({ ...a, status: 'onaylandi' }))} className="px-2 py-1 mr-1 rounded transition-colors cursor-pointer text-green-700 hover:bg-green-100">Onayla</button>}
                    {a.status !== 'iptal' && <button onClick={() => run(() => updateAppointment({ ...a, status: 'iptal' }))} className="px-2 py-1 mr-1 rounded transition-colors cursor-pointer text-amber-600 hover:bg-amber-100">İptal</button>}
                    <button onClick={() => window.confirm('Randevu silinsin mi?') && run(() => deleteAppointment(a.id))} className="px-2 py-1 rounded transition-colors cursor-pointer text-red-600 hover:bg-red-100">Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}