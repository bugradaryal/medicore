import { clinics } from '../data/clinics'
import { doctors } from '../data/doctors'

export default function Header() {
  return (
    <header className="bg-[#0A4D56] text-white">
      <div className="w-[95%] lg:w-[80%] mx-auto py-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">✚ MediCore Hastanesi</h1>
          <p className="text-sm text-teal-100">Online randevu: poliklinik ve doktor seç, saatini ayır.</p>
        </div>
        <p className="text-sm text-teal-100">{clinics.length} poliklinik · {doctors.length} doktor · 09:00 - 17:00</p>
      </div>
    </header>
  )
}
