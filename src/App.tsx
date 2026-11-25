import Header from './components/Header'
import Footer from './components/Footer'
import BookingForm from './components/BookingForm'
import AppointmentList from './components/AppointmentList'
import { useAppData } from './utility/state'

export default function App() {
  const data = useAppData()

  return (
    <div className="min-h-dvh flex flex-col text-slate-800">
      <Header />
      <main className="flex-1 w-[95%] lg:w-[80%] mx-auto py-8 grid gap-6 lg:grid-cols-5 items-start">
        <div className="lg:col-span-2">
          <BookingForm data={data} />
        </div>
        <div className="lg:col-span-3">
          <AppointmentList data={data} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
