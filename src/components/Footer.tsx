export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300 text-sm">
      <div className="max-w-5xl mx-auto px-4 py-8 grid gap-6 sm:grid-cols-3">
        <div>
          <p className="text-white font-bold text-lg">✚ MediCore</p>
          <p className="mt-1 text-slate-400">Software Persona yazılım projesi</p>
          <p className=" text-slate-400">-Buğra Daryal</p>
        </div>
        <div>
          <p className="text-white font-medium">İletişim</p>
          <p className="mt-2">Tekirdağ, Çorlu</p>
          <p>+90 228 222 22 22</p>
        </div>
        <div>
          <p className="text-white font-medium">Çalışma Saatleri</p>
          <p className="mt-2">Hafta içi 09:00 - 17:00</p>
          <p>Acil servis 7/24</p>
        </div>
      </div>
    </footer>
  )
}
