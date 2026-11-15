# MediCore

Hastane randevu sistemi. Web Geliştirme dersi JavaScript projesi olarak hazırladım. Backend yok, veriler tarayıcının LocalStorage'ında tutuluyor.

Canlı site: medicore-randevu.netlify.app

Kullandıklarım: React, TypeScript, Vite, Tailwind CSS, React Router.

## Neler yapılabiliyor

- Hasta kayıt olur, klinik ve doktor seçip randevu alır. Randevusunu düzenleyebilir, iptal edebilir, silebilir.
- Doktor kendisine gelen randevuları onaylar veya iptal eder.
- Yönetim klinik ve doktor ekler, düzenler, siler. Bütün randevuları da görür.

## Çalıştırma

```
npm install
npm run dev
```

## Giriş bilgileri

Hasta hesabını kayıt sayfasından oluşturabilir. Çalışan girişi için hazır hesaplar var.

- admin@medicore.com / 1234 (yönetim)
- ayse@medicore.com / 1234(doktor)

Veriler kurgusaldır, şifreler LocalStorage'da düz yazı olarak duruyor, sadece demo için.
