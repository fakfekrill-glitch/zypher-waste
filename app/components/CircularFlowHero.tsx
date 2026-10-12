'use client';

import React from 'react';
import { ThemeMode } from '../types';
import { Smartphone, ShieldCheck, Wrench, Flame, ArrowRight, CheckCircle2, Truck } from 'lucide-react';

interface CircularFlowHeroProps {
  theme: ThemeMode;
  onStartShipment: () => void;
  onExploreCatalog: () => void;
}

export const CircularFlowHero: React.FC<CircularFlowHeroProps> = ({
  theme,
  onStartShipment,
  onExploreCatalog,
}) => {
  const isDark = theme === 'dark';

  return (
    <section
      className={`rounded-3xl border p-6 sm:p-10 relative overflow-hidden transition-all duration-300 shadow-sm ${
        isDark
          ? 'bg-gradient-to-b from-slate-900 via-slate-900/60 to-slate-950 border-slate-800'
          : 'bg-gradient-to-b from-white via-slate-50 to-emerald-50/30 border-slate-200'
      }`}
    >
      {/* BACKGROUND ACCENT GLOW */}
      <div
        className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isDark ? 'bg-emerald-500/10' : 'bg-emerald-300/20'
        }`}
      />

      <div className="relative z-10 max-w-3xl space-y-4">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
            isDark
              ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-300'
              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
          }`}
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Platform Sirkular Daur Ulang Gadget & Jaringan Rekber Resmi</span>
        </div>

        <h1
          className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          Ubah HP Rusak Jadi Rupiah, Suplai Suku Cadang Kanibal untuk Teknisi.
        </h1>

        <p
          className={`text-xs sm:text-sm sm:leading-relaxed max-w-2xl ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          ZYPHER.ID menghubungkan pemilik smartphone/laptop mati total (matot) dengan mitra teknisi servis profesional
          dan fasilitas pengolahan limbah B3. Dilindungi sistem Rekber (Escrow) terpercaya, inspeksi video unboxing,
          serta gratis jemput untuk wilayah Surabaya dan sekitarnya.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onStartShipment}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm active:scale-95 ${
              isDark
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <span>Jual HP Rusak Sekarang</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onExploreCatalog}
            className={`px-5 py-3 rounded-xl text-xs font-semibold border transition-all ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-slate-700'
                : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-xs'
            }`}
          >
            Lihat Katalog Part Kanibalan (B2B)
          </button>
        </div>
      </div>

      {/* 3-STAGE CIRCULAR FLOW VISUALIZER */}
      <div className="mt-10 pt-8 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
            Alur Sirkularitas E-Waste Terpadu (Zero-Waste Lifecycle):
          </span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hidden sm:inline">
            100% Proteksi Dana Escrow
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* STEP 1 */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                TAHAP 1: INPUT
              </span>
              <Smartphone className="h-4 w-4 text-emerald-500" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
              Input Perangkat & Free Pickup
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Pilih model (Poco, iPhone, Samsung dll), upload foto kondisi fisik, dan tentukan harga jual yang diinginkan.
              Kurir internal jemput gratis di Surabaya / JNE Cashless nasional.
            </p>
          </div>

          {/* STEP 2 */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                TAHAP 2: QC & UNBOXING
              </span>
              <ShieldCheck className="h-4 w-4 text-sky-500" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
              Pemeriksaan Fisik & Rekber Aman
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Barang tiba di gudang pusat ZYPHER.ID. Tim teknisi melakukan video unboxing transparan via WhatsApp.
              Setelah disepakati, dana Rekber langsung cair ke rekening Anda.
            </p>
          </div>

          {/* STEP 3 */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                TAHAP 3: TRIAGE SIRKULAR
              </span>
              <Wrench className="h-4 w-4 text-amber-500" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
              Penyaluran Suku Cadang & Daur Ulang
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Part layak disalurkan ke katalog mitra teknisi servis (kanibalan IC, LCD, kamera).
              Limbah PCB sisa dilebur untuk ekstraksi logam berharga secara ramah lingkungan.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
