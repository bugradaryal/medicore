# MediCore

Hastane randevu uygulaması. Web Geliştirme dersi JavaScript projesi olarak hazırladım.
Backend ve giriş (login) yok, site açılır açılmaz kullanıma hazırdır. Randevular tarayıcının LocalStorage'ında tutulur.

Kullandıklarım: React, TypeScript, Vite, Tailwind CSS.
Uygulama tek sayfadır: solda randevu formu (poliklinik seçimi dahil), sağda randevu listesi.

## CRUD işlemleri

- **Ekle:** Soldaki formda poliklinik, doktor, tarih ve saat seçilip randevu oluşturulur.
- **Listele:** Sağdaki listede tüm randevular tarih sırasına göre listelenir.
- **Güncelle:** Listede Düzenle ile ad, tarih, saat ve şikayet değiştirilir.
- **Gidildi işareti:** Her randevunun yanındaki kutu işaretlenince randevu "Gidildi" olur ve üstü çizilir. Üstteki çubukta gidilen / toplam, geçen ve bekleyen randevu sayısı görünür.
- **Sil:** Listede Sil ile tek randevu, Tümünü Sil ile bütün randevular kaldırılır.

16 klinik ve 32 hazır doktor vardır (src/data). Aynı doktora aynı gün ve saate iki randevu alınamaz.

## Çalıştırma

```
npm install
npm run dev
```

## Klasör yapısı

```
src/
  components/  Header, Footer, BookingForm, AppointmentList
  interfaces/  Clinic, Doctor, Appointment tipleri
  data/        hazır poliklinik ve doktor listesi
  utility/     yardımcı fonksiyonlar ve localStorage state (useAppData)
```
