@AGENTS.md

# Servinas Web — Proje Hafızası

## Kurallar

### Bu Dosyayı Hep Güncelle
Her yeni özellik, değişiklik veya karar sonrasında bu dosya güncellenmelidir.
Bir şey yapıldıysa buraya yazılır. Hiçbir zaman eski bırakılmaz.

### Deploy — Sadece Kullanıcı İstediğinde
> **ASLA otomatik deploy yapma.** Build al, commit et, push et — ama VPS'e deploy adımlarını yalnızca kullanıcı açıkça "deploy et" dediğinde çalıştır.

### Geliştirme Ortamı
Değişiklikler **`http://localhost:3001`** üzerinden kontrol edilir. Dev server varsayılan olarak bu portta çalışır. Bir değişiklik yapıldığında kullanıcıya localhost:3001'de kontrol etmesini söyle.

---

## Proje Nedir
Servinas mobil uygulamasının landing page'i.
Araç bakım ve servis takip uygulaması için "yakında geliyor" sayfası + email waitlist.

**Domain:** servinas.com
**Şirket:** Westecute Yazılım Ltd. Şti.
**Sosyal medya:** instagram.com/servinasapp · x.com/servinasapp

> ÖNEMLİ: Bu proje `servinas/mobile` ile tamamen ayrıdır.
> Mobile projesine (`C:\Users\batuh\Projects\servinas\mobile`) kesinlikle dokunulmaz.

---

## Tech Stack
- **Framework:** Next.js 16.2.6 (App Router, Turbopack)
- **UI:** React 19 + Tailwind CSS 4
- **Animasyon:** GSAP 3.15 + ScrollTrigger
- **Dil:** TypeScript
- **Utility:** clsx + tailwind-merge (`lib/utils.ts` → `cn()`)
- **Font:** Geist Sans (next/font/google)

---

## Renk Paleti
| Token | Değer | Kullanım |
|---|---|---|
| Background | `#000000` | Sayfa zemini |
| Turuncu ana | `#F57C00` | Accent, CTA, progress ring |
| Turuncu açık | `#FF9A3C` | Gradient üst tonu |
| Kart zemini | `#1C0E00` → `#0A0A0A` | premium-depth-card gradient |
| Beyaz metin | `#FFFFFF` | Başlıklar |

---

## Dosya Yapısı
```
servinas-web/
├── app/
│   ├── globals.css              # Tailwind 4 import + CSS değişkenleri
│   ├── icon.png                 # Favicon — trimmed turuncu S ikonu (512x512)
│   ├── favicon.ico              # Favicon — trimmed turuncu S ikonu (64x64)
│   ├── layout.tsx               # HTML lang="tr", metadata, Geist font + Navbar
│   └── page.tsx                 # Ana sayfa → sadece <CinematicHero /> render eder
├── components/
│   └── ui/
│       └── cinematic-hero.tsx   # Ana hero component (GSAP scroll animasyonu)
├── lib/
│   └── utils.ts                 # cn() utility (clsx + tailwind-merge)
└── public/
    ├── logo-horizontal.png      # S ikon + beyaz/turuncu "Servinas" yatay (servinas4)
    ├── logo-stacked.png         # S ikon üstte + "Servinas" altta (servinas7)
    ├── logo-white-text.png      # Sadece beyaz/turuncu metin, trim edilmiş (servinas3)
    └── logo-icon.png            # Sadece turuncu S ikonu, trim edilmiş (servinas1)
```

---

## Tamamlanan Adımlar

### Adım 1 — Proje Kurulumu
- `npx create-next-app@latest servinas-web` ile Next.js 16 kuruldu
- GSAP (`gsap@3.15`), `clsx`, `tailwind-merge` kuruldu
- `lib/utils.ts` oluşturuldu (`cn()` fonksiyonu)

### Adım 2 — CinematicHero Component
`components/ui/cinematic-hero.tsx` oluşturuldu. Özellikler:

**Animasyon akışı (GSAP ScrollTrigger, 8500px pin):**
1. Giriş: "Aracının her şeyi," blur'dan reveal, "tek yerde." clip-path sweep
2. Scroll: Hero text blur + scale → Kart yukarı yükselir → Full ekran açılır
3. **İnteraktif faz (yeni):** Kart tam ekranda 3 stat sırayla belirir ("Aracın takipte." / "48.750+" / "Hazır mısın?") → turuncu S ikonu scale ile patlar ve genişler
4. Kart içi: iPhone mockup 3D giriş → Widget'lar → Floating badge'ler → Sol/sağ metinler
5. Çıkış: İçerikler kaybolur → Kart küçülür → CTA bölümü ortaya çıkar → Kart yukarı çıkar

**Mouse parallax:** iPhone mockup, fare hareketine göre 12° 3D tilt yapar — sadece scroll başındaki fazda aktif (CSS değişkenleri `--mouse-x`/`--mouse-y` her zaman güncellenir)

**iPhone Mockup içeriği (araç temalı):**
- Header: "Araçlarım / Dashboard" + "AY" avatar
- Turuncu progress ring: km sayacı (0 → 48.750 animasyonlu)
- Widget 1: Turuncu ikon + placeholder barlar + sağda `"Yağ"` etiketi (turuncu)
- Widget 2: Amber ikon + placeholder barlar + sağda `"Muayene"` etiketi (amber)
- Floating badge sol: 🔧 "Yağ Değişimi — 500 km kaldı"
- Floating badge sağ: 📋 "Servis Randevusu — Yarın 10:00"

> **NOT:** Widget içeriği geçici placeholder. Gerçek metin ("Yağ Değişimi / 500 km kaldı") denendi ama beğenilmedi, placeholder korundu.

**CTA Bölümü (scroll sonunda):**
- "Yakında Geliyor" pill badge (turuncu, pulse animasyonlu)
- Başlık: "Yakında geliyor."
- Açıklama metni (Türkçe)
- **Email waitlist formu:** input + "Erken Erişim Al" butonu → submit sonrası başarı mesajı
- **App Store & Google Play butonları:** disabled, hover'da turuncu "Yakında" overlay'i gösterir
- **Sosyal medya linkleri:** Instagram ve X ikonları (`https://instagram.com/servinasapp`, `https://x.com/servinasapp`)
- Footer: © 2026 Servinas — Westecute Yazılım Ltd. Şti.

### Adım 3 — Layout & Metadata
`app/layout.tsx` güncellendi:
- `lang="tr"`
- Title: "Servinas — Aracının her şeyi, tek yerde."
- Description: Türkçe SEO metni
- OpenGraph metadata eklendi
- **Navbar eklendi:** Fixed top, z-50, `logo-horizontal.png` (130px genişlik)

### Adım 4 — Global CSS
`app/globals.css` güncellendi:
- `--background: #000000` (sabit siyah, dark mode media query yok)
- `--foreground: #ffffff`
- Tailwind 4 import korundu

---

### Adım 5 — Scroll Bug Fix
**Sorun:** Scroll animasyonu çalışmıyordu.
**Kök neden:** Next.js App Router + Tailwind CSS 4 kombinasyonu `body`'yi scroll container yapıyordu (`overflow-y: auto`). GSAP ScrollTrigger varsayılan olarak `window`'u (yani `html` elementini) dinler. GSAP'ın 6893px spacer'ı `body`'ye eklendi ama `html.scrollHeight` hep 893px (viewport) kalıyordu — `window.scrollY` hiç değişmiyordu.

**Fix:**
1. `globals.css`: `html` → `overflow-y: auto`, `body` → `overflow-y: visible` (body'nin scroll container olmasını engeller, scroll window'a taşınır)
2. `cinematic-hero.tsx`: `ScrollTrigger.normalizeScroll(true)` eklendi (farklı tarayıcı/ortamlarda scroll normalizasyonu)

---

### Adım 7 — Görsel İyileştirmeler (2026-05-13)

**Aurora arka plan:** `cinematic-hero.tsx` hero section'ına 4 animasyonlu radial gradient blob eklendi (`.aurora-1` → `.aurora-4`). Her biri farklı hız ve yönde hareket eden `@keyframes` ile. Hero section'ın `z-0` katmanında, `pointer-events: none`.

**CTA animasyonlu glow:** CTA bölümüne iki katmanlı radial gradient glow eklendi — dış katman `cta-glow-pulse` keyframe ile pulse animasyonu yapar (4s ease-in-out infinite).

**Sosyal medya linkleri:** `@servinasapp` yazısı kaldırıldı, SVG ikonlu Instagram ve X linkleri eklendi.

**Mouse parallax düzeltmesi:** Spotlight özelliği kaldırıldıktan sonra `--mouse-x`/`--mouse-y` CSS değişkenleri her zaman güncellenir, mockup 3D tilt sadece erken scroll fazında aktif.

**Denenen ama geri alınan şeyler:**
- Lenis smooth scroll: GSAP `pin: true` + React Strict Mode ile çakıştı (`removeChild` hatası), kaldırıldı
- Mouse spotlight efekti: eklendi sonra kullanıcı beğenmedi, kaldırıldı
- Widget gerçek metin: "Yağ Değişimi / 500 km kaldı" eklendi, beğenilmedi, placeholder'a döndürüldü
- "tek yerde." yazısı neon efekti ve çeşitli glow denemeleri: hepsi geri alındı, sade gradient korundu

---

### Adım 6 — Static Export Yapılandırması
`next.config.ts` güncellendi:
- `output: "export"` — statik HTML/CSS/JS üretimi
- `trailingSlash: true`
- `images: { unoptimized: true }`

`npm run build` → `out/` klasörü oluştu, deploy'a hazır.

---

## Deploy

> **Sadece kullanıcı "deploy et" dediğinde uygulanır.**

**Sunucu:** 72.61.91.117 — nginx:alpine + Traefik SSL
**GitHub:** https://github.com/batuhansoycan/servinas (master branch, `out/` dahil)
**Site:** https://servinas.com — CANLI (2026-05-13'ten beri)

### Claude'un Yapacakları (her değişiklikte)
```
npm run build
git add -A
git commit -m "..."
git push origin master
```

### VPS Güncelleme Adımları (Hostinger terminal — SADECE kullanıcı istediğinde)
```bash
# İlk deploy ise:
git clone https://github.com/batuhansoycan/servinas.git /tmp/servinas-web
mkdir -p /var/www/servinas && cp -r /tmp/servinas-web/out/. /var/www/servinas/
bash /tmp/servinas-web/scripts/setup-vps.sh

# Güncelleme ise:
cd /tmp && rm -rf servinas-web && git clone https://github.com/batuhansoycan/servinas.git servinas-web
cp -r /tmp/servinas-web/out/. /var/www/servinas/
docker compose -f /docker/n8n/docker-compose.yml restart servinas
```

---

## Bilinen Sınırlamalar / Yapılacaklar
- [x] Deploy tamamlandı — https://servinas.com canlıda
- [x] Mobil optimizasyonlar tamamlandı (100dvh, blur azaltma, badge gizleme, safe area)
- [x] Scroll göstergesi eklendi (dikey SCROLL yazısı + turuncu animasyonlu çizgi)
- [x] Favicon güncellendi — turuncu S ikonu (sharp ile trim edildi)
- [x] Navbar eklendi — yatay Servinas logosu, fixed top
- [x] CTA'ya logo eklendi — stacked logo, sadece masaüstünde görünür
- [x] İnteraktif fullscreen kart fazı eklendi — stat reveal + S burst animasyonu
- [x] Aurora arka plan eklendi — 4 animasyonlu blob
- [x] CTA glow animasyonu eklendi
- [x] Sosyal medya linkleri eklendi — Instagram + X ikonları
- [ ] Email waitlist formu henüz gerçek bir backend'e bağlı değil (setTimeout simülasyonu)
- [ ] `prefers-reduced-motion` desteği yok (erişilebilirlik)
- [ ] App Store / Google Play linkleri placeholder — uygulama yayınlanınca güncellenecek
- [ ] OG image (sosyal medya önizleme görseli) henüz yok
- [ ] Canlı site güncellenmedi — aurora, CTA glow, sosyal linkler henüz deploy edilmedi
