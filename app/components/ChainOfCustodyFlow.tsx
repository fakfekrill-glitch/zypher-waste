'use client';

import React, { useState } from 'react';
import { ShieldCheck, Truck, Cpu, RefreshCw, Award, CheckCircle2, FileCheck, ArrowRight, Lock } from 'lucide-react';

interface StageDetail {
  id: number;
  code: string;
  title: string;
  lead: string;
  icon: any;
  regulations: string[];
  specs: { label: string; value: string }[];
  description: string;
}

const STAGES: StageDetail[] = [
  {
    id: 1,
    code: 'STG-01',
    title: 'Decommissioning & Serialized Ingestion',
    lead: 'Pencatatan Serial Number Aset & Verifikasi Hak Milik Korporasi',
    icon: Lock,
    regulations: ['ISO 27001 ISMS', 'Sarbanes-Oxley IT Asset Register'],
    specs: [
      { label: 'Protokol ID', value: 'UUID SHA-256 Serial Hash' },
      { label: 'Verifikasi Fisik', value: 'Foto Barcode & Serial Asset Tag' },
      { label: 'Pelepasan Aset', value: 'Berita Acara Serah Terima (BAST)' },
    ],
    description:
      'Setiap server, modul jaringan, atau laptop dicatat nomor serinya ke dalam konsol terenkripsi sebelum meninggalkan rak korporasi. Menghilangkan risiko aset tercecer atau hilang tanpa jejak audit.',
  },
  {
    id: 2,
    code: 'STG-02',
    title: 'Bonded HazMat Logistics & Segel GPS',
    lead: 'Pengangkutan Berlisensi Limbah B3 Kode B107d dengan Segel Digital',
    icon: Truck,
    regulations: ['PP No. 22/2021', 'KLHK Manifest Festronik B3'],
    specs: [
      { label: 'Armada Angkut', value: 'Kendaraan Box Khusus B3 Berizin Kemenhub' },
      { label: 'Pencegahan Kebocoran', value: 'Pelindung Sel Baterai Anti-Thermal Runaway' },
      { label: 'Tracking Rute', value: 'Telemetri GPS & Geofencing Gudang' },
    ],
    description:
      'Pengangkutan limbah elektronik berstatus B3 wajib menggunakan manifes Festronik resmi KLHK. Dilengkapi segel fisik bernomor seri untuk mencegah manipulasi muatan di jalan.',
  },
  {
    id: 3,
    code: 'STG-03',
    title: 'NIST SP 800-88 Data Sanitization & QC Lab',
    lead: 'Pembersihan Data Rahasia & Uji Spektrometri XRF Komposisi Logam',
    icon: ShieldCheck,
    regulations: ['NIST SP 800-88 Rev. 1', 'DoD 5220.22-M Wipe Protocol'],
    specs: [
      { label: 'Sanitasi NVMe/SSD', value: 'Cryptographic Purge & Multi-pass Erase' },
      { label: 'Sanitasi HDD Magnetik', value: 'High-Field Degaussing / 3mm Shredding' },
      { label: 'Uji XRF Logam', value: 'Spektrometri Kadar Emas (Au), Tembaga (Cu)' },
    ],
    description:
      'Data korporat dijamin musnah tanpa dapat dipulihkan. Media penyimpanan disanitasi sesuai standar militer dan perbankan internasional, dilanjutkan pengukuran kadar logam presisi.',
  },
  {
    id: 4,
    code: 'STG-04',
    title: 'Algorithmic Circular Triage',
    lead: 'Alokasi Optimal: Remarketing Suku Cadang vs Pemurnian Hidrometalurgi',
    icon: Cpu,
    regulations: ['R2v3 Standard', 'e-Stewards Circular Hierarchy'],
    specs: [
      { label: 'Grade A / Refurbish', value: 'Pengujian Komponen untuk Pasar B2B Sekunder' },
      { label: 'Grade B / Kanibal', value: 'Pemanenan IC, VRM, Chip PMIC, RAM ECC' },
      { label: 'Grade C / Urban Mining', value: 'Ekstraksi Logam Murni Emas (Au) & Cu Tanpa Racun' },
    ],
    description:
      'Perangkat dipilah secara algoritmis berdasarkan nilai ekonomi sirkular tertinggi. Komponen berfungsi dimanfaatkan kembali; papan rusak dilebur di smelter ramah lingkungan berizin.',
  },
  {
    id: 5,
    code: 'STG-05',
    title: 'Pencairan Escrow & Penerbitan Sertifikat CoD',
    lead: 'Pencairan Dana Rekber Korporat & Penerbitan Sertifikat Resmi ESG',
    icon: Award,
    regulations: ['GRI 306 Waste Standard', 'CSRD Scope 3 GHG Protocol'],
    specs: [
      { label: 'Sertifikat CoD', value: 'Certificate of Destruction Ber-QR Verifikasi' },
      { label: 'Laporan ESG', value: 'Tonase CO2e Terhindar & Neraca Logam Terekstraksi' },
      { label: 'Dana Rekber', value: 'Pencairan Otomatis ke Rekening Perusahaan' },
    ],
    description:
      'Setelah verifikasi selesai, dana hasil penjualan limbah dicairkan secara aman via Escrow, dan sertifikat resmi pemusnahan diterbitkan untuk lampiran laporan keberlanjutan tahunan auditor ESG.',
  },
];

export const ChainOfCustodyFlow: React.FC = () => {
  const [activeStageId, setActiveStageId] = useState<number>(3);
  const selectedStage = STAGES.find((s) => s.id === activeStageId) || STAGES[0];

  return (
    <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 text-slate-300 text-[11px] font-mono uppercase mb-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Verifiable Chain-of-Custody Pipeline
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Alur Rantai Pengawasan Limbah Elektronik Korporat
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
            Dari ruang server korporasi hingga smelter bersertifikasi. Setiap tahapan terlindungi audit trail,
            regulasi B3 resmi KLHK, dan standar keamanan data NIST SP 800-88.
          </p>
        </div>
        <div className="text-right hidden md:block">
          <span className="text-[11px] font-mono text-slate-500 uppercase block">Standar Kepatuhan</span>
          <span className="text-xs font-semibold text-emerald-400 font-mono">100% Zero-Landfill & Enkripsi Data</span>
        </div>
      </div>

      {/* INTERACTIVE STAGE STEPPER */}
      <div className="relative mb-8">
        {/* SVG ANIMATED PIPELINE TRACK */}
        <div className="hidden lg:block absolute top-7 left-10 right-10 h-0.5 pointer-events-none">
          <svg className="w-full h-2 overflow-visible">
            <line
              x1="0"
              y1="0"
              x2="100%"
              y2="0"
              stroke="#1e293b"
              strokeWidth="3"
            />
            <line
              x1="0"
              y1="0"
              x2="100%"
              y2="0"
              stroke="#10b981"
              strokeWidth="3"
              className="animate-circuit-flow"
            />
          </svg>
        </div>

        {/* STEP BUTTONS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 relative z-10">
          {STAGES.map((stage) => {
            const Icon = stage.icon;
            const isSelected = stage.id === activeStageId;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={`text-left p-3.5 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500/80 shadow-lg shadow-emerald-950/20 ring-1 ring-emerald-500/30'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isSelected
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {stage.code}
                  </span>
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900 text-slate-500'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <h3 className={`text-xs font-semibold line-clamp-1 ${isSelected ? 'text-slate-100' : 'text-slate-300'}`}>
                  {stage.title}
                </h3>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{stage.lead}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* SELECTED STAGE DEEP DIVE DRAWER */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 sm:p-6 transition-all duration-300">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 lg:max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-900/80 px-2.5 py-0.5 rounded">
                Tahap {selectedStage.id} dari 5
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-100">{selectedStage.title}</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{selectedStage.description}</p>
            
            <div className="pt-2">
              <span className="text-[11px] font-mono text-slate-400 block mb-1.5 uppercase">
                Landasan Regulasi & Sertifikasi:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedStage.regulations.map((reg, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono bg-slate-900 text-slate-300 border border-slate-800 px-2.5 py-1 rounded"
                  >
                    {reg}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SPECIFICATION CARD */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-4 sm:p-5 lg:w-80 flex-shrink-0 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-semibold text-slate-200">Parameter Validasi Teknis</span>
              <FileCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="space-y-2.5">
              {selectedStage.specs.map((item, idx) => (
                <div key={idx} className="text-xs">
                  <span className="text-slate-400 text-[11px] block">{item.label}</span>
                  <span className="font-mono font-semibold text-slate-200">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
