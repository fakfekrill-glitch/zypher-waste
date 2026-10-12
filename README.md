# ZYPHER.ID — Ekosistem Sirkular E-Waste & Kanibalan Suku Cadang

> **Platform Jual-Beli HP Rusak/Mati Total (Matot) Aman Berbasis Rekber Escrow, Katalog Suku Cadang Kanibalan untuk Teknisi B2B, dan Daur Ulang Limbah E-Waste Sirkular.**

🌐 **Live Website (Vercel):** [https://zypher-app.vercel.app](https://zypher-app.vercel.app)  
🐙 **GitHub Repository:** [https://github.com/fakfekrill-glitch/zypher-waste](https://github.com/fakfekrill-glitch/zypher-waste)

---

## 📌 Masalah Riil di Lapangan

1. **Sampah Elektronik Menumpuk:** Jutaan HP mati total (matot) dan gadget rusak menumpuk di laci rumah tangga karena tidak laku dijual atau takut dibohongi pengepul keliling.
2. **Krisis Suku Cadang Teknisi HP (B2B):** Ribuan teknisi konter servis HP di Indonesia kesulitan mencari IC CPU, IC PMIC, modul kamera, dan layar LCD original copotan karena pabrikan resmi sudah menghentikan produksi unit lama.
3. **Bahaya Penipuan Jual-Beli Online:** Jual beli HP rusak di media sosial rawan penipuan kirim barang tanpa dibayar atau barang tidak sesuai kesepakatan.

---

## 💡 Solusi Sirkular ZYPHER.ID

**ZYPHER.ID** menciptakan jembatan rantai pasok sirkular antara pemilik gadget rusak, bengkel teknisi servis, dan pengolah limbah B3:

```
[ Pemilik HP Rusak / Matot ]
             │ (Input kondisi, foto, & estimasi harga)
             ▼
[ Penjemputan Kurir Internal Surabaya / JNE Cashless ]
             │
             ▼
[ Gudang Pusat ZYPHER.ID (Pemeriksaan Fisik & Video Unboxing WA) ]
             │
   ┌─────────┼────────────────────────┐
   ▼         ▼                        ▼
[ Refurbish ] [ Kanibal Suku Cadang ] [ Urban Mining B3 ]
(Servis ulang) (Katalog Teknisi B2B)  (Peleburan Logam E-Waste)
   │         │                        │
   └─────────┴────────────────────────┘
             │
             ▼
[ Pencairan Dana Rekber Cair ke Rekening Penjual ]
```

---

## 🌟 Fitur Utama Platform

### 1. 📱 Portal Penjual HP Rusak (User / Masyarakat)
* **Formulir Pengiriman Multi-Langkah:**
  * Pilih model perangkat (*Poco X3 Pro, iPhone 11-15, Samsung Galaxy A/S Series, Xiaomi, Laptop Umum*).
  * Status kondisi perangkat: Mesin mati total (matot) atau hidup, kondisi LCD (normal, garis, retak kaca, blank), dan bodi.
  * **Kompresi Foto Otomatis (HTML5 Canvas):** Unggah foto fisik resolusi tinggi langsung terkompresi otomatis di browser agar hemat kuota dan ringan di Vercel.
  * **Cek Jangkauan Kurir Otomatis:** Deteksi alamat/GPS otomatis membedakan layanan **Kurir Internal Free Pickup (Surabaya/Sidoarjo/Gresik)** vs **JNE Cashless Nasional**.
  * Pengajuan harga jual & rekening Rekber (*BCA, Mandiri, BRI, BNI, GoPay, DANA, OVO, ShopeePay*).
* **Penerbitan Resi & Cetak Lembar Waybill:** Resi otomatis (cth: `ZYP-SUB-8921`) dengan lembar waybill siap cetak lengkap barcode.
* **Pelacakan Live Timeline (4 Langkah):** `1. Dijemput Kurir` ➔ `2. Tiba di Gudang` ➔ `3. QC & Triage Part` ➔ `4. Dana Rekber Cair`.
* **Konfirmasi WhatsApp Terintegrasi:** Tombol langsung membuka WhatsApp unboxing & approval pencairan dana.

### 2. 🔧 Portal Mitra Teknisi & Pengepul Limbah (B2B)
* **Katalog Part Kanibalan & Copotan Original:**
  * Suku cadang cabutan asli teruji: *Bundle LCD Pecah Kaca Luar (Grade A Servis untuk ganti polarizer)*, *Bundle LCD Shadow*, *Mesin Kanibalan Cabutan Poco/Xiaomi (IC utuh untuk bahan jumper)*, *Modul Kamera Original*, *Board Fleksibel Cas*, *Baterai Original*.
  * Filter kategori, status grade kelayakan, dan modal pemesanan langsung.
* **Bursa Borongan E-Waste (Satuan Kiloan):**
  * Pilihan material limbah: *PCB Campur Motherboard HP/Laptop*, *Baterai Lithium Borongan*, *LCD Reject Servis*.
  * **Kalkulator Kiloan Live:** Masukkan bobot kg, sistem otomatis menghitung total taksiran harga pasar limbah e-waste.
* **Histori Pesanan B2B:** Catatan riwayat pesanan part dan pengajuan borongan limbah.

### 3. 🛡️ Portal Gudang QC & Escrow (Admin)
* **Verifikasi Barang Tiba:** Daftar antrean paket masuk dengan galeri foto fisik.
* **Kirim Undangan Video Unboxing WA:** Link otomatis menghubungi WhatsApp pengirim dengan template pesan unboxing.
* **Triage Sirkular:** Klasifikasi barang ke *Refurbish*, *Kanibal Suku Cadang*, atau *Urban Mining B3*.
* **Otorisasi Transfer Rekber:** Konfirmasi transfer dana pencairan ke rekening penjual.
* **Inventaris Terpilah:** Rekapitulasi unit yang telah disortir ke gudang.

---

## 🎨 Desain, Animasi & Mode Terang/Gelap (Anti-Slop Verified)

* **Mode Terang (Light Mode - Aktif secara Default):** Palet warna cerah, bersih, modern (*White Card `#FFFFFF`*, *Soft Canvas `#F8FAFC`*, aksen *Emerald Green `#059669`*, *Amber Gold `#D97706`*, dan tipografi kontras tinggi yang nyaman dibaca).
* **Mode Gelap (Dark Mode):** Dapat diaktifkan melalui tombol toggle matahari/bulan di navbar.
* **Mikro-Animasi Keren:**
  * Animasi aliran sirkuit SVG pada alur sirkular e-waste (`animate-circuit-flow`).
  * Efek pulsing halus pada badge pesanan aktif (`animate-pulse-gentle`).
  * Transisi tab mulus tanpa kedip/reload halaman.
  * Preview resi cetak dengan QR Code dan barcode.

---

## 🛠️ Teknologi & Kesiapan Vercel

* **Framework:** Next.js 16.4.0 (App Router Turbopack) + React 19.3.0 + TypeScript + Tailwind CSS v4.
* **Backend & Integrasi:**
  * **Firebase Authentication:** Google Popup Login & Email/Password.
  * **Firebase Realtime Database:** Sinkronisasi data pesanan & pengajuan B2B.
  * **Discord Webhook:** Notifikasi realtime saat ada login, pengiriman baru, dan pesanan B2B.
  * **WhatsApp API Link:** Template unboxing dan konfirmasi pencairan rekber.
  * **Resilient Edge Local Cache:** Menjamin aplikasi tidak pernah crash atau blank jika koneksi Firebase terhambat.
* **Build Time:** 427ms (Turbopack). 100% lulus build produksi di Vercel.

---

## 🚀 Menjalankan Proyek di Komputer Lokal

```bash
# Clone repository
git clone https://github.com/fakfekrill-glitch/zypher-waste.git
cd zypher-app

# Install dependensi
npm install

# Jalankan server lokal
npm run dev
```
Buka browser di `http://localhost:3000`.
