# MediCore

Hastane randevu uygulaması. Web Geliştirme dersi JavaScript projesi olarak hazırladım.
Backend ve giriş (login) yok, site açılır açılmaz kullanıma hazırdır. Randevular tarayıcının LocalStorage'ında tutulur.

Kullandıklarım: React, TypeScript, Vite, Tailwind CSS.
Uygulama tek sayfadır: solda randevu formu (poliklinik seçimi dahil), sağda randevu listesi.

## CRUD işlemleri

- **Ekle:** Soldaki formda poliklinik, doktor, tarih ve saat seçilip randevu oluşturulur.
- **Listele:** Sağdaki listede tüm randevular tarih sırasına göre, todo listesi gibi kompakt kartlar halinde görünür. Düzenle ve Sil butonları kartın sağındadır.
- **Güncelle:** Listede Düzenle ile ad, tarih, saat ve şikayet değiştirilir. Düzenleme formu kartın altında açılır.
- **Gidildi işareti:** Her randevunun yanındaki kutu işaretlenince randevu "Gidildi" olur ve üstü çizilir. Üstteki çubukta gidilen / toplam, geçen ve bekleyen randevu sayısı görünür.
- **Sil:** Listede Sil ile tek randevu, Tümünü Sil ile bütün randevular kaldırılır.

16 klinik ve 32 hazır doktor vardır (src/data). Aynı doktora aynı gün ve saate iki randevu alınamaz.
Saatler 09:00'dan başlayıp 30 dakikalık aralıklarla (16 dilim) listelenir.

## Diğer özellikler

- **Filtre:** Listenin üstündeki çubukta Hepsi, Bekleyen, Geçen ve Gidilen sekmeleri vardır. Her sekmede o gruptaki randevu sayısı yazar. Seçili grupta randevu yoksa bilgi mesajı gösterilir.
- **Randevu durumları:** Gidilen (işaretlenmiş), Geçen (tarihi geçmiş ama gidilmemiş) ve Bekleyen (tarihi gelmemiş) olarak ayrılır. Kartın sol çizgisi duruma göre gidilen için yeşil, geçen için turuncu, bekleyen için koyu yeşil olur.
- **Uzun şikayet:** Şikayet metni kartta en fazla 2 satır görünür, üstüne tıklayınca tamamı açılır, tekrar tıklayınca kapanır. Uzun ve boşluksuz metinler kartı taşırmaz.
- **Tarih kontrolü:** Tarih alanı yazılırken silinmez. Tarih geçerli olana kadar (ör. yıl yazılırken) saat seçenekleri açılmaz. Takvimde olmayan tarihler (31 Şubat gibi) kabul edilmez ve kayıt sırasında hata mesajı gösterilir. Geçersiz tarihli eski bir kayıt varsa listede `-` olarak görünür.

## Çalıştırma

```
npm install
npm run dev
```

Üretim derlemesi için `npm run build`, derlemeyi denemek için `npm run preview`. Netlify ayarı `netlify.toml` içindedir.

## Klasör yapısı

```
src/
  components/  Header, Footer, BookingForm, AppointmentList
  interfaces/  Clinic, Doctor, Appointment tipleri
  data/        hazır poliklinik ve doktor listesi
  utility/     yardımcı fonksiyonlar (tarih, saat ve geçmiş randevu kontrolleri) ve localStorage state (useAppData)
```