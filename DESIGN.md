# DESIGN.md — ZYPHER.ID Sirkular E-Waste & Kanibalan Rekber

## 1. Product Identity
- **Name:** ZYPHER.ID
- **Domain:** Ekosistem Sirkular Daur Ulang E-Waste & Marketplace Suku Cadang Kanibalan Elektronik (Handphone, Tablet, Laptop, PCB & Baterai).
- **Core Value:** Mengubah HP rusak / mati total (matot) menjadi rupiah secara aman melalui Rekber Escrow terpercaya, menyuplai komponen kanibalan original (IC, LCD, modul kamera) untuk teknisi servis B2B, serta mengalokasikan limbah sisa ke fasilitas daur ulang logam.
- **Audience:**
  1. *User / Pemilik Gadget:* Masyarakat & konter servis kecil yang ingin menjual HP rusak tanpa tertipu.
  2. *Mitra Teknisi B2B:* Teknisi & bengkel servis HP yang membutuhkan pasokan part copotan original.
  3. *Admin Gudang QC:* Pengelola inspeksi fisik, video unboxing WhatsApp, alokasi triage, dan pencairan dana Rekber.

## 2. Palette & Theme Modes (Light & Dark)
Sesuai arahan anti-slop R-21, platform menyediakan **Mode Terang (Light Mode)** sebagai tampilan utama yang segar dan ramah mata, serta **Mode Gelap (Dark Mode)** yang elegan.

### Mode Terang (Light Mode - Default)
- **Canvas / Background:** `#F8FAFC` (Slate-50) & `#F1F5F9` (Slate-100)
- **Card Surfaces:** `#FFFFFF` (Pure White) dengan border halus `#E2E8F0` (Slate-200)
- **Aksen Utama (Circular Green):** `#059669` (Emerald-600) & `#10B981` (Emerald-500)
- **Aksen B2B & Komponen:** `#D97706` (Amber-600)
- **Aksen Status & Tracking:** `#0284C7` (Sky-600)
- **Tipografi:** `#0F172A` (Slate-900 / kontras tajam) & `#475569` (Slate-600)

### Mode Gelap (Dark Mode)
- **Canvas / Background:** `#090D16` (Deep Carbon Obsidian)
- **Card Surfaces:** `#0F172A` (Slate-900) dengan border `#1E293B`
- **Aksen Terang:** `#10B981` (Emerald), `#F59E0B` (Amber), `#38BDF8` (Sky)
- **Tipografi:** `#F8FAFC` (Slate-50) & `#94A3B8` (Slate-400)

## 3. Motion & Animations
- **Circuit Flow Animation:** Garis sirkuit beranimasi dinamis pada hero alur sirkular e-waste (`animate-circuit-flow`).
- **Pulsing Status Indicators:** Indikator tahapan status pengiriman (`animate-pulse-gentle`) pada pesanan aktif.
- **Micro-Interactions:** Transisi perpindahan tab tanpa reload, kalkulator kiloan live, kompresi foto otomatis di peramban, dan preview waybill cetak.
- **Light/Dark Toggle:** Transisi rotasi ikon matahari dan bulan yang halus.

## 4. Anti-Slop Integrity
- **Kejujuran Data & Fitur:** Tidak ada fitur hiasan atau tombol dummy. Setiap formulir, upload foto, pemilihan kurir GPS, kalkulasi harga borongan, dan cetak lembar waybill berfungsi penuh.
- **Bahasa Domain Asli:** Menggunakan istilah operasional teknisi dan daur ulang riil di Indonesia (*Matot, Kanibal IC, Polarizer LCD, Jumper, Urban Mining, Rekber Escrow, JNE Cashless*).
