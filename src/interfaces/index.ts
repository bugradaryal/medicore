export type Role = 'hasta' | 'doktor' | 'yonetim'

export type Status = 'beklemede' | 'onaylandi' | 'iptal'

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: Role
  clinicId?: string // sadece doktorlarda
}

export interface Clinic {
  id: string
  name: string
  description: string
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  clinicId: string
  date: string // 2026-12-01
  time: string // 09:30
  complaint: string
  status: Status
  createdAt: string
}
