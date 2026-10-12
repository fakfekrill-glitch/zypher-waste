'use client';

import React from 'react';
import { BatchLot } from '../types';
import { Award, Printer, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CertificateModalProps {
  lot: BatchLot | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ lot, onClose }) => {
  if (!lot) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="max-w-2xl w-full my-8 space-y-4">
        
        {/* ACTION BAR (HIDDEN IN PRINT) */}
        <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 no-print">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Award className="h-4 w-4 text-emerald-400" />
            <span className="font-semibold">Dokumen Resmi Certificate of Destruction (CoD) & ESG</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Cetak / Unduh PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE OFFICIAL CERTIFICATE DOCUMENT */}
        <div className="print-area bg-white text-slate-900 rounded-2xl p-8 sm:p-10 border border-slate-300 shadow-2xl space-y-6">
          
          {/* HEADER */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-wider text-slate-950 font-mono">
                  ZYPHER<span className="text-emerald-700">.CIRCULAR</span>
                </span>
                <span className="text-[10px] bg-slate-950 text-white font-mono px-2 py-0.5 rounded font-bold">
                  OFFICIAL COD
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium mt-1">
                Fasilitas Pengolahan Limbah B3 Berizin SK Menteri LHK No. 042/MENLHK/PSLB3/2022
              </p>
              <p className="text-[10px] text-slate-500">
                Sertifikasi Standar Internasional: NIST SP 800-88 Rev. 1 & ISO 14001:2015
              </p>
            </div>

            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-500 block">Nomor Sertifikat:</span>
              <span className="text-xs font-bold text-slate-900">COD-ZYP-{lot.id.replace('LOT-', '')}</span>
              <span className="text-[10px] text-slate-500 block mt-1">Tanggal Terbit:</span>
              <span className="text-xs font-semibold text-slate-800">{lot.createdAt}</span>
            </div>
          </div>

          {/* TITLE */}
          <div className="text-center space-y-1">
            <h2 className="text-lg font-black tracking-tight text-slate-950 uppercase">
              Sertifikat Pemusnahan Data & Daur Ulang Sirkular
            </h2>
            <p className="text-xs font-serif italic text-slate-600">
              Certificate of Sanitization, Destruction & Zero-Landfill Recovery
            </p>
          </div>

          {/* CERTIFICATION STATEMENT */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-700 leading-relaxed text-justify space-y-2">
            <p>
              Dengan ini dinyatakan bahwa seluruh perangkat keras dan media penyimpanan data yang tercantum dalam dokumen ini
              telah diserahterimakan oleh <strong>{lot.companyName}</strong> dan telah diproses secara tuntas di fasilitas resmi ZYPHER CIRCULAR
              melalui protokol pembersihan data <strong>{lot.sanitization === 'nist_purge' ? 'NIST SP 800-88 Purge (Cryptographic Erase)' : 'Physical Shredding 3mm'}</strong> sehingga data tidak dapat dipulihkan kembali.
            </p>
            <p>
              Material fraksi logam dan PCB telah dialokasikan ke jalur daur ulang sirkular ramah lingkungan (Urban Mining)
              tanpa dibuang ke TPA (Zero-Landfill Diverted) sesuai peraturan perundang-undangan limbah B3 Republik Indonesia.
            </p>
          </div>

          {/* ITEM DETAILS TABLE */}
          <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <tbody>
                <tr className="border-b border-slate-200 bg-slate-100">
                  <th className="p-2.5 font-bold text-slate-800 w-1/3">Batch Lot ID</th>
                  <td className="p-2.5 font-mono font-bold text-slate-900">{lot.id}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th className="p-2.5 font-bold text-slate-800">Institusi Pemilik Aset</th>
                  <td className="p-2.5 text-slate-900">{lot.companyName} (PIC: {lot.picName})</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th className="p-2.5 font-bold text-slate-800">Deskripsi Perangkat</th>
                  <td className="p-2.5 text-slate-900">{lot.itemDescription}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th className="p-2.5 font-bold text-slate-800">Jumlah & Total Bobot</th>
                  <td className="p-2.5 text-slate-900 font-mono font-semibold">
                    {lot.quantityUnits} Unit / {lot.estimatedWeightKg.toLocaleString()} Kilogram
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th className="p-2.5 font-bold text-slate-800">Nomor Manifes Festronik B3</th>
                  <td className="p-2.5 text-slate-900 font-mono">{lot.manifestCode} (Kode Limbah: B107d)</td>
                </tr>
                <tr>
                  <th className="p-2.5 font-bold text-slate-800">Cryptographic Verification Hash</th>
                  <td className="p-2.5 font-mono text-[10px] break-all text-slate-700 bg-slate-50">
                    {lot.hashProof}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ESG IMPACT GRID */}
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-600 uppercase block mb-1.5">
              Dampak Terverifikasi Terhadap Lingkungan (Scope 3 GHG & Neraca Logam):
            </span>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="border border-slate-300 rounded-lg p-2.5 bg-slate-50">
                <span className="text-[10px] text-slate-500 block">Emas Murni (Au)</span>
                <span className="font-mono text-sm font-bold text-amber-700">{lot.yieldProjection.goldGrams} Gram</span>
              </div>
              <div className="border border-slate-300 rounded-lg p-2.5 bg-slate-50">
                <span className="text-[10px] text-slate-500 block">Tembaga (Cu)</span>
                <span className="font-mono text-sm font-bold text-slate-900">{lot.yieldProjection.copperKg} Kg</span>
              </div>
              <div className="border border-slate-300 rounded-lg p-2.5 bg-slate-50">
                <span className="text-[10px] text-slate-500 block">Scope 3 CO₂e Averted</span>
                <span className="font-mono text-sm font-bold text-emerald-700">{lot.yieldProjection.co2eAvoidedTon} Ton</span>
              </div>
            </div>
          </div>

          {/* SIGNATURE & LEGAL VALIDATION */}
          <div className="pt-6 border-t-2 border-slate-900 flex justify-between items-end text-xs">
            <div className="space-y-1">
              {/* QR CODE MOCK */}
              <div className="w-20 h-20 border border-slate-400 bg-slate-100 flex items-center justify-center p-1">
                <div className="grid grid-cols-4 gap-0.5 w-full h-full bg-slate-900 p-1">
                  <div className="bg-white"></div><div className="bg-white"></div><div className="bg-slate-900"></div><div className="bg-white"></div>
                  <div className="bg-white"></div><div className="bg-slate-900"></div><div className="bg-white"></div><div className="bg-slate-900"></div>
                  <div className="bg-slate-900"></div><div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
                  <div className="bg-white"></div><div className="bg-slate-900"></div><div className="bg-white"></div><div className="bg-slate-900"></div>
                </div>
              </div>
              <span className="text-[9px] font-mono text-slate-500 block">Scan untuk Verifikasi Publik</span>
            </div>

            <div className="text-right space-y-1">
              <span className="text-[11px] text-slate-600 block">Kepala Laboratorium Forensik & QC B3,</span>
              <div className="h-12 flex items-center justify-end">
                <span className="font-serif italic text-base text-slate-800 underline decoration-slate-400">
                  Dr. Ir. Taufik Ramadhani, M.Sc.
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-600">NIP. 19820412 200801 1 009 &bull; Auditor R2v3</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
