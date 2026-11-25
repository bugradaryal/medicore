import type { Appointment, Clinic, Doctor } from '../interfaces'

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

export function doctorName(doctors: Doctor[], id: string): string {
  return doctors.find((d) => d.id === id)?.name ?? '-'
}

export function doctorsOf(doctors: Doctor[], clinicId: string): Doctor[] {
  return doctors.filter((d) => d.clinicId === clinicId)
}

export function sortAppointments(list: Appointment[]): Appointment[] {
  return [...list].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
}

export function isTaken(
  appointments: Appointment[],
  doctorId: string,
  date: string,
  time: string,
  ignoreId?: string,
): boolean {
  return appointments.some(
    (a) => a.doctorId === doctorId && a.date === date && a.time === time && a.id !== ignoreId,
  )
}

export function freeSlots(appointments: Appointment[], doctorId: string, date: string, ignoreId?: string): string[] {
  return timeSlots.filter((t) => !isTaken(appointments, doctorId, date, t, ignoreId))
}

export function isPast(a: Appointment): boolean {
  return new Date(`${a.date}T${a.time}`).getTime() < Date.now()
}
