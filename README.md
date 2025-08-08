# Şerit Kontrol Sistemi Web Uygulaması

Bu proje, trafik ihlallerini tespit eden ve yöneten gelişmiş bir şerit kontrol sistemi web uygulamasıdır. React, TypeScript ve Vite kullanılarak geliştirilmiştir.

## 🚀 Özellikler

### 📹 Gerçek Zamanlı İzleme
- Canlı video akışları üzerinden araçları gerçek zamanlı olarak izleme
- PyQt arayüzü ile kullanıcılara anlık görüntü aktarımı
- Gelişmiş threading yapısı ile yüksek performanslı görüntü işleme

### 🚗 Hassas Araç Tespiti
- YOLO (You Only Look Once) nesne tespiti modeli kullanımı
- Hızlı ve doğru araç algılama
- Her araca benzersiz ID atama ve takip sistemi
- Otomatik veritabanı kayıt sistemi

### ⚠️ Otomatik İhlal Tespiti
- Kullanıcı tanımlı kurallara göre otomatik ihlal tespiti
- Şerit ihlali, yasak park, ters yönde ilerleme senaryoları
- Yapay zeka destekli analiz algoritmaları

### 📊 Detaylı Raporlama
- Her ihlal için detaylı kayıt sistemi
- Plaka, görüntü, video klip, zaman damgası ve ihlal tipi
- PyQt arayüzü üzerinden kolay erişim ve dışa aktarım

## 🛠️ Teknolojiler

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Bootstrap 5
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Backend**: Python Flask (ayrı repo)
- **AI/ML**: YOLO modeli
- **Database**: SQLite/PostgreSQL

## 📁 Proje Yapısı

```
serit_kontrol_web/
├── src/
│   ├── pages/           # Sayfa bileşenleri
│   │   ├── home.tsx     # Ana sayfa
│   │   ├── login.tsx    # Giriş sayfası
│   │   ├── register.tsx # Kayıt sayfası
│   │   ├── araclar.tsx  # Araç listesi
│   │   ├── itiraz.tsx   # İtiraz yönetimi
│   │   └── admin.tsx    # Admin paneli
│   ├── components/      # Yeniden kullanılabilir bileşenler
│   │   └── Navbar.tsx   # Navigasyon çubuğu
│   ├── adminpage/       # Admin sayfa bileşenleri
│   │   ├── aracManagement.tsx
│   │   ├── itirazManagement.tsx
│   │   └── userManagement.tsx
│   └── assets/          # Statik dosyalar
├── public/              # Genel dosyalar
└── package.json         # Bağımlılıklar
```

## 🚀 Kurulum

### Gereksinimler
- Node.js (v16 veya üzeri)
- npm veya yarn
- Backend API (ayrı repo)

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd serit_kontrol_web
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

4. **Tarayıcıda açın**
```
http://localhost:5173
```

## 🔧 Yapılandırma

### Backend API Bağlantısı
Uygulama varsayılan olarak `http://localhost:5000` adresindeki backend API'ye bağlanır. Bu adresi değiştirmek için:

1. `src/pages/` klasöründeki dosyalarda API URL'lerini güncelleyin
2. Backend sunucusunun çalıştığından emin olun

### Environment Variables
Gerekirse `.env` dosyası oluşturarak API URL'lerini yapılandırabilirsiniz:

```env
VITE_API_URL=http://localhost:5000
```

## 📱 Kullanım

### Kullanıcı Girişi
1. `/login` sayfasından giriş yapın
2. Kayıtlı kullanıcı değilseniz `/register` sayfasından kayıt olun

### Araç Listesi
- `/araclar` sayfasında tüm araçları görüntüleyin
- Filtreleme seçenekleri ile arama yapın
- Araç görsellerine tıklayarak büyütün
- İtiraz etmek istediğiniz araçlar için "İtiraz Et" butonunu kullanın

### İtiraz Yönetimi
- `/itiraz` sayfasında itirazlarınızı görüntüleyin
- Bekleyen itirazlar için "Onayla" veya "Reddet" butonlarını kullanın
- İtiraz detaylarını görüntülemek için "Detay" butonunu kullanın

### Admin Paneli
- `/admin` sayfasından sistem yönetimi yapın
- Kullanıcı, araç ve itiraz yönetimi
- Sistem istatistikleri ve raporlar

## 🔒 Güvenlik

- JWT token tabanlı kimlik doğrulama
- Role-based access control (RBAC)
- API endpoint güvenliği
- Input validation ve sanitization

## 🧪 Test

```bash
# Unit testleri çalıştır
npm run test

# E2E testleri çalıştır
npm run test:e2e

# Test coverage raporu
npm run test:coverage
```

## 📦 Build

```bash
# Production build
npm run build

# Build önizleme
npm run preview
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun


**Not**: Bu uygulama backend API'si ile birlikte çalışır. Backend kurulumu için ayrı repository'yi inceleyin.
