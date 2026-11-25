import { useEffect, useState } from 'react'
import type { Appointment } from '../interfaces'
import { isTaken, todayStr } from './utils'

const APPOINTMENTS_KEY = 'medicore_appointments_v2'

export type NewAppointment = Omit<Appointment, 'id' | 'createdAt'>

export function useAppData() {
  // Sayfa açılınca randevular localStorage'dan okunur
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(APPOINTMENTS_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments))
  }, [appointments])

  // EKLE
  function addAppointment(data: NewAppointment) {
    if (data.date < todayStr()) throw new Error('Geçmiş bir tarih seçemezsiniz.')
    if (isTaken(appointments, data.doctorId, data.date, data.time)) {
      throw new Error('Bu saat dolu, başka bir saat seçin.')
    }
    const item: Appointment = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    setAppointments([...appointments, item])
  }

  // GÜNCELLE
  function updateAppointment(item: Appointment) {
    if (item.date < todayStr()) throw new Error('Geçmiş bir tarih seçemezsiniz.')
    if (isTaken(appointments, item.doctorId, item.date, item.time, item.id)) {
      throw new Error('Bu saat dolu, başka bir saat seçin.')
    }
    setAppointments(appointments.map((a) => (a.id === item.id ? item : a)))
  }

  // SİL
  function deleteAppointment(id: string) {
    setAppointments(appointments.filter((a) => a.id !== id))
  }

  // TÜMÜNÜ SİL
  function deleteAllAppointments() {
    setAppointments([])
  }

  return { appointments, addAppointment, updateAppointment, deleteAppointment, deleteAllAppointments }
}

export type AppData = ReturnType<typeof useAppData>
