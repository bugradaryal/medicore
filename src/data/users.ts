import type { User } from '../interfaces'

// Yönetim ve doktor hesapları hazır gelir, hastalar kayıt ekranından oluşur
export const seedUsers: User[] = [
  { id: 'admin', name: 'Yönetici', email: 'admin@medicore.com', password: '1234', role: 'yonetim' },
  { id: 'd1', name: 'Dr. Ayşe Kaya', email: 'ayse@medicore.com', password: '1234', role: 'doktor', clinicId: 'c1' },
  { id: 'd2', name: 'Dr. Murat Aksoy', email: 'murat@medicore.com', password: '1234', role: 'doktor', clinicId: 'c1' },
  { id: 'd3', name: 'Dr. Can Öz', email: 'can@medicore.com', password: '1234', role: 'doktor', clinicId: 'c2' },
  { id: 'd4', name: 'Dr. Selin Karaca', email: 'selin@medicore.com', password: '1234', role: 'doktor', clinicId: 'c2' },
  { id: 'd5', name: 'Dr. Elif Şen', email: 'elif@medicore.com', password: '1234', role: 'doktor', clinicId: 'c3' },
  { id: 'd6', name: 'Dr. Burak Aydın', email: 'burak@medicore.com', password: '1234', role: 'doktor', clinicId: 'c4' },
  { id: 'd7', name: 'Dr. Hakan Yıldız', email: 'hakan@medicore.com', password: '1234', role: 'doktor', clinicId: 'c4' },
  { id: 'd8', name: 'Dr. Deniz Acar', email: 'deniz@medicore.com', password: '1234', role: 'doktor', clinicId: 'c5' },
  { id: 'd9', name: 'Dr. Gül Erdem', email: 'gul@medicore.com', password: '1234', role: 'doktor', clinicId: 'c6' },
  { id: 'd10', name: 'Dr. Pınar Tunç', email: 'pinar@medicore.com', password: '1234', role: 'doktor', clinicId: 'c7' },
  { id: 'd11', name: 'Dr. Emre Korkmaz', email: 'emre@medicore.com', password: '1234', role: 'doktor', clinicId: 'c8' },
  { id: 'd12', name: 'Dr. Kerem Bozkurt', email: 'kerem@medicore.com', password: '1234', role: 'doktor', clinicId: 'c9' },
  { id: 'd13', name: 'Dr. Seda Akın', email: 'seda@medicore.com', password: '1234', role: 'doktor', clinicId: 'c10' },
  { id: 'd14', name: 'Dr. Tolga Ercan', email: 'tolga@medicore.com', password: '1234', role: 'doktor', clinicId: 'c11' },
  { id: 'd15', name: 'Dr. Naz Güler', email: 'naz@medicore.com', password: '1234', role: 'doktor', clinicId: 'c12' },
  { id: 'd16', name: 'Dr. Onur Demirci', email: 'onur@medicore.com', password: '1234', role: 'doktor', clinicId: 'c13' },
  { id: 'd17', name: 'Dr. Aslı Çınar', email: 'asli@medicore.com', password: '1234', role: 'doktor', clinicId: 'c14' },
  { id: 'd18', name: 'Dr. Volkan Işık', email: 'volkan@medicore.com', password: '1234', role: 'doktor', clinicId: 'c15' },
  { id: 'd19', name: 'Dr. Melis Uçar', email: 'melis@medicore.com', password: '1234', role: 'doktor', clinicId: 'c16' },
]
