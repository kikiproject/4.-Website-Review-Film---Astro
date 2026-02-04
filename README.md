# 🎬 ASTRO - Website Review Film Indonesia

<div align="center">
  
  ![ASTRO Logo](https://img.shields.io/badge/ASTRO-Movie%20Review-8F29BC?style=for-the-badge&logo=astro&logoColor=white)
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
  [![Astro](https://img.shields.io/badge/Astro-4.16-FF5D01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
  [![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

  **Platform review film Indonesia modern dengan fitur-fitur canggih**
  
  [Demo Live](https://astro-film.vercel.app) • [Dokumentasi](#dokumentasi) • [Kontribusi](#kontribusi)

</div>

---

## 📖 Tentang ASTRO

**ASTRO** adalah website review film modern yang dibangun dengan teknologi terkini. Platform ini menyediakan informasi lengkap tentang film, series, dan anime beserta fitur-fitur interaktif seperti live chat, nonton bareng, dan sistem laporan yang dapat dicetak.

### ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 🎬 **Browse Film** | Jelajahi ribuan film, series, dan anime dengan filter lengkap |
| ⭐ **Review & Rating** | Baca dan tulis review dengan sistem rating interaktif |
| 💬 **Live Chat** | Chat real-time dengan komunitas pecinta film |
| 🍿 **Nonton Bareng** | Tonton film bersama teman dengan sinkronisasi real-time |
| 📊 **Laporan** | Generate dan cetak laporan statistik |
| 🎨 **UI Modern** | Desain elegan dengan animasi smooth (AOS Library) |
| 📱 **Responsive** | Tampilan optimal di semua ukuran layar |
| 🔐 **Auth System** | Sistem login, register, dan manajemen akun |

---

## 🗂️ Struktur Proyek

```
📦 63. Website Review Film - Astro
├── 📂 public/                    # Static assets
│   ├── favicon.svg
│   └── images/
├── 📂 src/
│   ├── 📂 components/            # Komponen reusable
│   │   ├── 📂 icons/
│   │   │   └── Icons.tsx         # Custom & Lucide icons
│   │   ├── Footer.astro          # Footer component
│   │   ├── Header.astro          # Navigation header
│   │   ├── HeroSlider.astro      # Hero dengan Ken Burns effect
│   │   ├── LiveChat.tsx          # Live chat dengan reactions, polls
│   │   ├── MobileNavigation.astro
│   │   ├── MovieCard.astro       # Card film
│   │   ├── MovieSlider.astro     # Slider film
│   │   ├── ReportGenerator.tsx   # Generate & print laporan
│   │   ├── SearchModal.astro     # Modal pencarian
│   │   └── WatchParty.tsx        # Fitur nonton bareng
│   ├── 📂 layouts/
│   │   ├── BaseLayout.astro      # Layout dasar dengan AOS
│   │   └── MainLayout.astro      # Layout utama
│   ├── 📂 lib/
│   │   └── utils.ts              # Utility functions
│   ├── 📂 pages/
│   │   ├── 📂 admin/             # Halaman admin
│   │   │   ├── index.astro       # Dashboard admin
│   │   │   └── pengguna.astro    # Manajemen pengguna
│   │   ├── 📂 akun/              # Halaman akun user
│   │   ├── 📂 film/              # Detail film
│   │   ├── 📂 genre/             # Halaman per genre
│   │   ├── 404.astro             # Halaman not found
│   │   ├── anime.astro           # Browse anime
│   │   ├── bioskop.astro         # Info bioskop
│   │   ├── cari.astro            # Halaman pencarian
│   │   ├── daftar.astro          # Register page
│   │   ├── index.astro           # Homepage
│   │   ├── jelajahi.astro        # Browse semua
│   │   ├── laporan.astro         # Halaman laporan
│   │   ├── live-chat.astro       # Live chat page
│   │   ├── lupa-password.astro   # Reset password
│   │   ├── masuk.astro           # Login page
│   │   ├── mendatang.astro       # Coming soon
│   │   ├── nonton-bareng.astro   # Watch party page
│   │   ├── series.astro          # Browse series
│   │   ├── top-rated.astro       # Film top rated
│   │   └── trending.astro        # Film trending
│   ├── 📂 stores/
│   │   └── authStore.ts          # Zustand auth store
│   ├── 📂 styles/
│   │   └── global.css            # Global styles
│   ├── 📂 types/
│   │   └── index.ts              # TypeScript types
│   └── env.d.ts                  # Environment types
├── .env.example                  # Environment example
├── astro.config.mjs              # Astro configuration
├── package.json                  # Dependencies
├── tailwind.config.mjs           # Tailwind configuration
├── tsconfig.json                 # TypeScript config
├── LICENSE                       # MIT License
└── README.md                     # Dokumentasi
```

---

## 🚀 Instalasi

### Prerequisites

- Node.js 18.x atau lebih baru
- npm atau pnpm

### Setup

1. **Clone repository**
   ```bash
   git clone https://github.com/kikiproject/4.-Website-Review-Film---Astro.git
   cd 4.-Website-Review-Film---Astro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env dan masukkan API key TMDB
   ```

4. **Jalankan development server**
   ```bash
   npm run dev
   ```

5. **Buka browser**
   ```
   http://localhost:4321
   ```

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="96">
  <img src="https://skillicons.dev/icons?i=astro" width="48" height="48" alt="Astro" />
  <br>Astro 4.16
</td>
<td align="center" width="96">
  <img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
  <br>React 18
</td>
<td align="center" width="96">
  <img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
  <br>TypeScript
</td>
<td align="center" width="96">
  <img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
  <br>Tailwind CSS
</td>
</tr>
</table>

### Libraries

- **[AOS](https://michalsnik.github.io/aos/)** - Animate On Scroll library untuk animasi smooth
- **[Lucide React](https://lucide.dev/)** - Icon library modern
- **[Zustand](https://zustand-demo.pmnd.rs/)** - State management ringan
- **[Axios](https://axios-http.com/)** - HTTP client
- **[TMDB API](https://www.themoviedb.org/documentation/api)** - Database film

---

## 📱 Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://via.placeholder.com/400x250?text=Homepage" width="400" alt="Homepage"/>
        <br><em>Homepage dengan Hero Slider</em>
      </td>
      <td align="center">
        <img src="https://via.placeholder.com/400x250?text=Browse" width="400" alt="Browse"/>
        <br><em>Halaman Jelajahi Film</em>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://via.placeholder.com/400x250?text=Live+Chat" width="400" alt="Live Chat"/>
        <br><em>Live Chat Community</em>
      </td>
      <td align="center">
        <img src="https://via.placeholder.com/400x250?text=Watch+Party" width="400" alt="Watch Party"/>
        <br><em>Nonton Bareng</em>
      </td>
    </tr>
  </table>
</div>

---

## 🎨 Tema & Warna

```css
/* Color Palette */
--color-primary:  #1A2DE7  /* Navy Blue */
--color-violet:   #8F29BC  /* Violet */
--color-magenta:  #F062C8  /* Magenta */
--color-dark:     #0F0F14  /* Dark Background */
```

---

## 📄 Scripts

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Jalankan development server |
| `npm run build` | Build untuk production |
| `npm run preview` | Preview build lokal |
| `npm run astro` | Astro CLI |

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buka issue atau pull request.

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

---

## 📜 Lisensi

Distributed under the MIT License. Lihat [LICENSE](LICENSE) untuk informasi lebih lanjut.

```
MIT License

Copyright (c) 2024 kikiproject

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 💖 Sponsor

<div align="center">
  
  ### Dukung Pengembangan ASTRO
  
  <a href="https://github.com/sponsors/kikiproject">
    <img src="https://img.shields.io/badge/Sponsor-kikiproject-EA4AAA?style=for-the-badge&logo=githubsponsors&logoColor=white" alt="Sponsor"/>
  </a>
  
  <a href="https://saweria.co/kikiproject">
    <img src="https://img.shields.io/badge/Saweria-Donasi-F96854?style=for-the-badge" alt="Saweria"/>
  </a>
  
  <a href="https://trakteer.id/kikiproject">
    <img src="https://img.shields.io/badge/Trakteer-Traktir%20Kopi-CC2F47?style=for-the-badge" alt="Trakteer"/>
  </a>

  ---
  
  **Terima kasih kepada semua sponsor! 🙏**
  
</div>

---

## 👨‍💻 Author

<div align="center">
  <img src="https://avatars.githubusercontent.com/kikiproject" width="100" style="border-radius: 50%;" alt="kikiproject"/>
  
  **kikiproject**
  
  [![GitHub](https://img.shields.io/badge/GitHub-kikiproject-181717?style=flat-square&logo=github)](https://github.com/kikiproject)
  [![Instagram](https://img.shields.io/badge/Instagram-@kikiproject-E4405F?style=flat-square&logo=instagram&logoColor=white)](https://instagram.com/kikiproject)
  
</div>

---

<div align="center">
  
  **⭐ Star repository ini jika bermanfaat!**
  
  Made with ❤️ in Indonesia
  
  ![Visitors](https://visitor-badge.laobi.icu/badge?page_id=kikiproject.4.-Website-Review-Film---Astro)
  
</div>
