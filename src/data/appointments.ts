import type { Appointment } from '../interfaces'

const created = '2026-11-10T09:00:00.000Z'

export const seedAppointments: Appointment[] = [
  { id: 'a1', patientId: 'seed1', patientName: 'Mehmet Demir', doctorId: 'd1', clinicId: 'c1', date: '2026-12-01', time: '10:00', complaint: 'Halsizlik ve yorgunluk', status: 'beklemede', createdAt: created },
  { id: 'a2', patientId: 'seed2', patientName: 'Zeynep Arslan', doctorId: 'd1', clinicId: 'c1', date: '2026-12-02', time: '14:30', complaint: 'Kontrol muayenesi', status: 'onaylandi', createdAt: created },
  { id: 'a3', patientId: 'seed3', patientName: 'Ali Yılmaz', doctorId: 'd3', clinicId: 'c2', date: '2026-12-03', time: '09:00', complaint: 'Çarpıntı', status: 'beklemede', createdAt: created },
  { id: 'a4', patientId: 'seed4', patientName: 'Fatma Çelik', doctorId: 'd4', clinicId: 'c2', date: '2026-12-03', time: '11:30', complaint: 'Tansiyon takibi', status: 'onaylandi', createdAt: created },
  { id: 'a5', patientId: 'seed5', patientName: 'Hasan Polat', doctorId: 'd5', clinicId: 'c3', date: '2026-12-04', time: '13:00', complaint: 'Sık tekrarlayan baş ağrısı', status: 'beklemede', createdAt: created },
  { id: 'a6', patientId: 'seed6', patientName: 'Merve Kurt', doctorId: 'd6', clinicId: 'c4', date: '2026-12-04', time: '15:30', complaint: 'Diz ağrısı', status: 'iptal', createdAt: created },
  { id: 'a7', patientId: 'seed7', patientName: 'Ahmet Koç', doctorId: 'd8', clinicId: 'c5', date: '2026-12-07', time: '10:30', complaint: 'Görme bulanıklığı', status: 'onaylandi', createdAt: created },
  { id: 'a8', patientId: 'seed8', patientName: 'Ayşegül Yurt', doctorId: 'd10', clinicId: 'c7', date: '2026-12-08', time: '09:30', complaint: 'Çocuğum için aşı kontrolü', status: 'beklemede', createdAt: created },
  { id: 'a9', patientId: 'seed9', patientName: 'Kemal Bulut', doctorId: 'd11', clinicId: 'c8', date: '2026-12-09', time: '16:00', complaint: 'Ciltte kızarıklık', status: 'beklemede', createdAt: created },
  { id: 'a10', patientId: 'seed10', patientName: 'Derya Sönmez', doctorId: 'd9', clinicId: 'c6', date: '2026-12-10', time: '12:00', complaint: 'Boğaz ağrısı', status: 'onaylandi', createdAt: created },
  { id: 'a11', patientId: 'seed11', patientName: 'Cemal Tuna', doctorId: 'd14', clinicId: 'c11', date: '2026-12-11', time: '10:00', complaint: 'Sık idrara çıkma', status: 'beklemede', createdAt: created },
  { id: 'a12', patientId: 'seed12', patientName: 'Selma Aydoğan', doctorId: 'd16', clinicId: 'c13', date: '2026-12-11', time: '14:00', complaint: 'Şeker kontrolü', status: 'onaylandi', createdAt: created },
  { id: 'a13', patientId: 'seed13', patientName: 'Barış Ekinci', doctorId: 'd19', clinicId: 'c16', date: '2026-12-14', time: '09:30', complaint: 'Bel fıtığı sonrası rehabilitasyon', status: 'beklemede', createdAt: created },
]
