import { useEffect, useState } from 'react'
import type { Appointment, Clinic, User, Status } from '../interfaces'
import { seedAppointments } from '../data/appointments'
import { seedClinics } from '../data/clinics'
import { seedUsers } from '../data/users'
import { isTaken, todayStr } from './utils'

const USERS_KEY = 'medicore_users'
const CLINICS_KEY = 'medicore_clinics'
const APPOINTMENTS_KEY = 'medicore_appointments'
const SESSION_KEY = 'medicore_session'

export function useAppData() {
  // State: sayfa açılınca localStorage'dan okunur, yoksa seed verisi kullanılır
  const [clinics, setClinics] = useState<Clinic[]>(() => {
    const saved = localStorage.getItem(CLINICS_KEY)
    return saved ? JSON.parse(saved) : seedClinics
  })
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(USERS_KEY)
    return saved ? JSON.parse(saved) : seedUsers
  })
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(APPOINTMENTS_KEY)
    return saved ? JSON.parse(saved) : seedAppointments
  })
  const [sessionId, setSessionId] = useState<string | null>(() => localStorage.getItem(SESSION_KEY))

  useEffect(() => {
    localStorage.setItem(CLINICS_KEY, JSON.stringify(clinics))
  }, [clinics])

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }, [users])

  useEffect(() => {
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments))
  }, [appointments])

  useEffect(() => {
    if (sessionId) localStorage.setItem(SESSION_KEY, sessionId)
    else localStorage.removeItem(SESSION_KEY)
  }, [sessionId])

  const user = users.find((u) => u.id === sessionId) ?? null

  // klinikler 

  function addClinic(name: string, description: string) {
    setClinics([...clinics, { id: crypto.randomUUID(), name: name.trim(), description: description.trim() }])
  }

  function updateClinic(clinic: Clinic) {
    const updated = { ...clinic, name: clinic.name.trim(), description: clinic.description.trim() }
    setClinics(clinics.map((c) => (c.id === updated.id ? updated : c)))
  }

  function deleteClinic(id: string) {
    if (users.some((u) => u.role === 'doktor' && u.clinicId === id)) {
      throw new Error('Bu klinikte doktor var, önce doktorları silin.')
    }
    setClinics(clinics.filter((c) => c.id !== id))
  }

  // kullanıcılar 

  function login(email: string, password: string, staff: boolean) {
    const found = users.find((u) => u.email === email.trim().toLowerCase() && u.password === password)
    if (!found) throw new Error('E-posta veya şifre hatalı.')
    if (staff && found.role === 'hasta') {
      throw new Error('Bu bir hasta hesabı. Lütfen Hasta Girişi sayfasını kullanın.')
    }
    if (!staff && found.role !== 'hasta') {
      throw new Error('Bu bir çalışan hesabı. Lütfen Çalışan Girişi sayfasını kullanın.')
    }
    setSessionId(found.id)
  }

  function logout() {
    setSessionId(null)
  }

  function register(name: string, email: string, password: string) {
    const mail = email.trim().toLowerCase()
    if (users.some((u) => u.email === mail)) throw new Error('Bu e-posta zaten kayıtlı.')
    const created: User = { id: crypto.randomUUID(), name: name.trim(), email: mail, password, role: 'hasta' }
    setUsers([...users, created])
    setSessionId(created.id)
  }

  function addDoctor(name: string, email: string, password: string, clinicId: string) {
    if (!clinics.some((c) => c.id === clinicId)) throw new Error('Önce bir klinik eklemelisiniz.')
    const mail = email.trim().toLowerCase()
    if (users.some((u) => u.email === mail)) throw new Error('Bu e-posta zaten kayıtlı.')
    const created: User = { id: crypto.randomUUID(), name: name.trim(), email: mail, password, role: 'doktor', clinicId }
    setUsers([...users, created])
  }

  function deleteDoctor(id: string) {
    setUsers(users.filter((u) => u.id !== id))
    setAppointments(appointments.filter((a) => a.doctorId !== id))
  }

  // randevular

    function addAppointment(data: {
      patientId: string
      patientName: string
      doctorId: string
      clinicId: string
      date: string
      time: string
      complaint: string
      status: Status
    }) {
    if (data.date < todayStr()) throw new Error('Geçmiş bir tarih seçemezsiniz.')
    if (isTaken(appointments, data.doctorId, data.date, data.time)) {
      throw new Error('Bu saat dolu, başka bir saat seçin.')
    }
    const item: Appointment = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    setAppointments([...appointments, item])
  }

  function updateAppointment(item: Appointment) {
    if (item.status !== 'iptal' && isTaken(appointments, item.doctorId, item.date, item.time, item.id)) {
      throw new Error('Bu saat dolu, başka bir saat seçin.')
    }
    setAppointments(appointments.map((a) => (a.id === item.id ? item : a)))
  }

  function deleteAppointment(id: string) {
    setAppointments(appointments.filter((a) => a.id !== id))
  }

  return {
    clinics,
    users,
    appointments,
    user,
    addClinic,
    updateClinic,
    deleteClinic,
    login,
    logout,
    register,
    addDoctor,
    deleteDoctor,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  }
}

export type AppData = ReturnType<typeof useAppData>
