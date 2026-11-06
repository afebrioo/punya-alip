# 🌊 Web Game Teka-Teki Pantai untuk Rara ("Pencarian cwtch")

Game web teka-teki bertema laut dan pantai Jimbaran (Bali) yang dirancang khusus untuk Bebeb (**Rara**) dengan gaya visual **Pure Art Storybook** (tanpa glassmorphism, estetik retro coastal postcard) dan responsif sempurna di layar HP maupun PC.

---

## 🚀 Cara Menjalankan Game Secara Lokal

### 1. Jalankan dengan Vite (Rekomendasi)
```bash
npm install
npm run dev
```
Buka browser di link lokal yang muncul (biasanya `http://localhost:5173`).

---

## ⚙️ Cara Mengubah Pertanyaan / Konfigurasi (`src/config.js`)

Semua data pertanyaan, kata kunci, dan teka-teki berada di satu file: **`src/config.js`**.

Alip bisa langsung mengedit:
1. **Target Nama**: `targetName: "Rara"`
2. **Kata Rahasia Akhir**: `finalWord: "cwtch"`
3. **Pertanyaan & Pilihan di Setiap Tahap**:
   - `id: 1` (Pilihan Ganda: LINE, Vespa, Anak RW 14)
   - `id: 2` (Pilihan Combo: Matcha & Nashville)
   - `id: 3` (Susun Kata: MotoGP & Aussie)
4. **BGM / Musik**:
   - Letakkan file audio lagu (misal `lagu-kita.mp3`) di folder project.
   - Atur di `src/config.js`:
     ```javascript
     bgm: {
       audioUrl: "lagu-kita.mp3",
       title: "Lagu Kenangan Kita",
       artist: "Alip untuk Rara"
     }
     ```

---

## 🌐 Panduan Pasang Domain Murah (Budget Rp 15.000 - Rp 30.000)

Sesuai obrolan Alip & Afebrio, untuk memberikan link keren khusus (misal: `surat-buat-rara.my.id` atau `alipbuatsayang.my.id`):

### Langkah 1: Hosting Gratis di Vercel atau Netlify
1. Upload folder project ini ke GitHub.
2. Buka [vercel.com](https://vercel.com) atau [netlify.com](https://netlify.com) (Login gratis).
3. Klik **Add New Project** -> Pilih repo GitHub project ini.
4. Framework preset otomatis mendeteksi **Vite**. Klik **Deploy**.
5. Dalam 30 detik web sudah langsung online dengan link gratis (contoh: `punya-alip.vercel.app`).

### Langkah 2: Beli Domain Murah
1. Buka registrar domain lokal (misal: **Niagahoster**, **DomaiNesia**, atau **IDwebhost**).
2. Cari nama domain berakhiran **`.my.id`** (harganya hanya sekitar **Rp 12.000 – Rp 25.000 / tahun**).
3. Lakukan pembayaran (bisa pakai QRIS / GoPay / ShopeePay).

### Langkah 3: Sambungkan Domain ke Vercel
1. Di Dashboard Vercel project, buka menu **Settings** -> **Domains**.
2. Masukkan nama domain yang baru dibeli (contoh: `surat-buat-rara.my.id`).
3. Vercel akan memberikan petunjuk DNS:
   - Type: `CNAME`
   - Name: `@` atau `www`
   - Target: `cname.vercel-dns.com`
4. Buka menu Kelola DNS di tempat beli domain, tambahkan record CNAME tersebut.
5. Tunggu 5-15 menit -> Domain sudah aktif dengan SSL (HTTPS aman) gratis!

---

## 🎨 Fitur Unggulan
- **Pure Art Style**: Bersih, estetik, hangat, tidak menggunakan efek blur glassmorphic.
- **Synthesizer Ombak Alami**: Deburan ombak laut dimainkan via Web Audio API tanpa perlu download file mp3 berat.
- **Auto-Save Progress**: Progres permainan otomatis tersimpan di HP Rara (tidak akan hilang jika tidak sengaja refresh).
- **Celebration Canvas**: Semburan partikel hati dan kilau emas saat kata **"cwtch"** berhasil dibuka.

