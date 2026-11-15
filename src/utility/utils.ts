import type { Appointment, Clinic, Role, Status, User } from '../interfaces'

export const roleLabels: Record<Role, string> = {
  hasta: 'Hasta',
  doktor: 'Doktor',
  yonetim: 'Yönetim',
}

export const statusLabels: Record<Status, string> = {
  beklemede: 'Beklemede',
  onaylandi: 'Onaylandı',
  iptal: 'İptal',
}

export const timeSlots: string[] = Array.from({ length: 16 }, (_, i) => {
  const m = 9 * 60 + i * 30
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
})


export function todayStr(): string {
  return new Date().toLocaleDateString('sv-SE')
}

export function formatDay(date: string): string {
  return new Date(date + 'T00:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
}

export function formatDayLong(date: string): string {
  return new Date(date + 'T00:00').toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  })
}

export function clinicName(clinics: Clinic[], id: string): string {
  return clinics.find((c) => c.id === id)?.name ?? '-'
}

export function userName(users: User[], id: string): string {
  return users.find((u) => u.id === id)?.name ?? '-'
}

export function doctorsOf(users: User[], clinicId?: string): User[] {
  return users.filter((u) => u.role === 'doktor' && (!clinicId || u.clinicId === clinicId))
}

// Hasta kendi randevularını, doktor kendisine alınanları, yönetim hepsini görür
export function appointmentsOf(appointments: Appointment[], user: User): Appointment[] {
  return appointments
    .filter((a) => {
      if (user.role === 'hasta') return a.patientId === user.id
      if (user.role === 'doktor') return a.doctorId === user.id
      return true
    })
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
}

export function isTaken(
  appointments: Appointment[],
  doctorId: string,
  date: string,
  time: string,
  ignoreId?: string,
): boolean {
  return appointments.some(
    (a) =>
      a.doctorId === doctorId &&
      a.date === date &&
      a.time === time &&
      a.status !== 'iptal' &&
      a.id !== ignoreId,
  )
}

export function freeSlots(appointments: Appointment[], doctorId: string, date: string, ignoreId?: string): string[] {
  return timeSlots.filter((t) => !isTaken(appointments, doctorId, date, t, ignoreId))
}
