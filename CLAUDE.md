@AGENTS.md

# Servinas Web — Proje Hafızası

## Kural: Bu Dosyayı Hep Güncelle
Her yeni özellik, değişiklik veya karar sonrasında bu dosya güncellenmelidir.
Bir şey yapıldıysa buraya yazılır. Hiçbir zaman eski bırakılmaz.

---

## Proje Nedir
Servinas mobil uygulamasının landing page'i.
Araç bakım ve servis takip uygulaması için "yakında geliyor" sayfası + email waitlist.

**Domain:** servinas.com
**Şirket:** Westecute Yazılım Ltd. Şti.
**Sosyal medya:** @servinasapp

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
│   ├── globals.css         # Tailwind 4 import + CSS değişkenleri
│   ├── layout.tsx          # HTML lang="tr", metadata, Geist font
│   └── page.tsx            # Ana sayfa → sadece <CinematicHero /> render eder
├── components/
│   └── ui/
│       └── cinematic-hero.tsx   # Ana hero component (GSAP scroll animasyonu)
├── lib/
│   └── utils.ts            # cn() utility (clsx + tailwind-merge)
└── public/                 # Statik dosyalar (henüz boş)
```

---

## Tamamlanan Adımlar

### Adım 1 — Proje Kurulumu
- `npx create-next-app@latest servinas-web` ile Next.js 16 kuruldu
- GSAP (`gsap@3.15`), `clsx`, `tailwind-merge` kuruldu
- `lib/utils.ts` oluşturuldu (`cn()` fonksiyonu)

### Adım 2 — CinematicHero Component
`components/ui/cinematic-hero.tsx` oluşturuldu. Özellikler:

**Animasyon akışı (GSAP ScrollTrigger, 6000px pin):**
1. Giriş: "Aracının her şeyi," blur'dan reveal, "tek yerde." clip-path sweep
2. Scroll: Hero text blur + scale → Kart yukarı yükselir → Full ekran açılır
3. Kart içi: iPhone mockup 3D giriş → Widget'lar → Floating badge'ler → Sol/sağ metinler
4. Çıkış: İçerikler kaybolur → Kart küçülür → CTA bölümü ortaya çıkar → Kart yukarı çıkar

**Mouse parallax:** iPhone mockup, fare hareketine göre 12° 3D tilt yapar (requestAnimationFrame ile optimize)

**iPhone Mockup içeriği (araç temalı):**
- Header: "Araçlarım / Dashboard" + "AY" avatar
- Turuncu progress ring: km sayacı (0 → 48.750 animasyonlu)
- Widget 1: Yağ Değişimi (turuncu ikon)
- Widget 2: Muayene (amber ikon)
- Floating badge sol: 🔧 "Yağ Değişimi — 500 km kaldı"
- Floating badge sağ: 📋 "Servis Randevusu — Yarın 10:00"

**CTA Bölümü (scroll sonunda):**
- "Yakında Geliyor" pill badge (turuncu, pulse animasyonlu)
- Başlık: "Yakında geliyor."
- Açıklama metni (Türkçe)
- **Email waitlist formu:** input + "Erken Erişim Al" butonu → submit sonrası başarı mesajı
- **App Store & Google Play butonları:** disabled, hover'da turuncu "Yakında" overlay'i gösterir
- Footer: © 2026 Servinas — Westecute Yazılım Ltd. Şti.

### Adım 3 — Layout & Metadata
`app/layout.tsx` güncellendi:
- `lang="tr"`
- Title: "Servinas — Aracının her şeyi, tek yerde."
- Description: Türkçe SEO metni
- OpenGraph metadata eklendi

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

### Adım 6 — Static Export Yapılandırması
`next.config.ts` güncellendi:
- `output: "export"` — statik HTML/CSS/JS üretimi
- `trailingSlash: true`
- `images: { unoptimized: true }`

`npm run build` → `out/` klasörü oluştu, deploy'a hazır.

---

## Deploy — TAMAMLANDI (2026-05-13)
**Sunucu:** 72.61.91.117 — nginx:alpine + Traefik SSL
**GitHub:** https://github.com/batuhansoycan/servinas (master branch, `out/` dahil)
**Site:** https://servinas.com — CANLI

**Deploy yöntemi (Hostinger terminal):**
1. `git clone https://github.com/batuhansoycan/servinas.git /tmp/servinas-web`
2. `mkdir -p /var/www/servinas && cp -r /tmp/servinas-web/out/. /var/www/servinas/`
3. `bash /tmp/servinas-web/scripts/setup-vps.sh`

**Güncelleme için:** Local'de değişiklik yap → `npm run build` → commit + push → VPS'de adım 1-2'yi tekrarla + `docker compose restart servinas`

---

## Bilinen Sınırlamalar / Yapılacaklar
- [x] Deploy tamamlandı — https://servinas.com canlıda
- [ ] Email waitlist formu henüz gerçek bir backend'e bağlı değil (setTimeout simülasyonu)
- [ ] `prefers-reduced-motion` desteği yok (erişilebilirlik)
- [ ] App Store / Google Play linkleri placeholder — uygulama yayınlanınca güncellenecek
- [ ] OG image (sosyal medya önizleme görseli) henüz yok
- [ ] Favicon Servinas logosu değil (varsayılan Next.js)
