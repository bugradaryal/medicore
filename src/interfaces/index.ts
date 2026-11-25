export interface Clinic {
  id: string
  name: string
  description: string
}

export interface Doctor {
  id: string
  name: string
  clinicId: string
}

export interface Appointment {
  id: string
  patientName: string
  doctorId: string
  clinicId: string
  date: string // 2026-12-01
  time: string // 09:30
  complaint: string
  attended: boolean // gidildi mi
  createdAt: string
}
