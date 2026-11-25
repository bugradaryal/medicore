import { useEffect, useState } from 'react'
import type { Appointment } from '../interfaces'
import { isTaken } from './utils'

const APPOINTMENTS_KEY = 'medicore_appointments_v2'

export type NewAppointment = Omit<Appointment, 'id' | 'createdAt' | 'attended'>

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
    if (isTaken(appointments, data.doctorId, data.date, data.time)) {
      throw new Error('Bu saat dolu, başka bir saat seçin.')
    }
    const item: Appointment = { ...data, attended: false, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    setAppointments([...appointments, item])
  }

  // GÜNCELLE
  function updateAppointment(item: Appointment) {
    if (isTaken(appointments, item.doctorId, item.date, item.time, item.id)) {
      throw new Error('Bu saat dolu, başka bir saat seçin.')
    }
    setAppointments(appointments.map((a) => (a.id === item.id ? item : a)))
  }

  // GİDİLDİ İŞARETLE (todo'daki tamamlandı gibi)
  function toggleAttended(id: string) {
    setAppointments(appointments.map((a) => (a.id === id ? { ...a, attended: !a.attended } : a)))
  }

  // SİL
  function deleteAppointment(id: string) {
    setAppointments(appointments.filter((a) => a.id !== id))
  }

  // TÜMÜNÜ SİL
  function deleteAllAppointments() {
    setAppointments([])
  }

  return { appointments, addAppointment, updateAppointment, toggleAttended, deleteAppointment, deleteAllAppointments }
}

export type AppData = ReturnType<typeof useAppData>
