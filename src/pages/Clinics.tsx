import { Link } from 'react-router-dom'
import { doctorsOf } from '../utility/utils'
import type { AppData } from '../utility/state'

export default function Clinics({ data }: { data: AppData }) {
  const { clinics, users } = data

  return (
    <div className="space-y-6 image-page">
      <div>
        <h1 className="text-2xl font-bold text-[#0A4D56]">Klinikler</h1>
        <p className="text-slate-600 text-sm">Kliniklerimizi ve doktorlarımızı inceleyip randevu alabilirsin.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {clinics.map((c) => {
          const doctors = doctorsOf(users, c.id)
          return (
            <div key={c.id} className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#CBE4E8] p-5 flex flex-col gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[#0D5C63]">{c.name}</h2>
                <p className="text-sm text-slate-600">{c.description}</p>
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 mb-1">Doktorlar</p>
                {doctors.length === 0 ? (
                  <p className="text-sm text-slate-500">Henüz doktor yok.</p>
                ) : (
                  <ul className="text-sm space-y-1">
                    {doctors.map((d) => (
                      <li key={d.id}>{d.name}</li>
                    ))}
                  </ul>
                )}
              </div>
              {doctors.length > 0 && (
                <Link to={`/randevu-al?klinik=${c.id}`} className="bg-[#0D5C63] hover:bg-[#0A4D56] text-white text-center rounded px-4 py-2 text-sm transition-colors cursor-pointer">Randevu Al</Link>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}