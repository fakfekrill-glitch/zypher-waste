'use client';

import React from 'react';
import { BatchLot } from '../types';
import { Truck, Printer, X, ShieldAlert, FileText } from 'lucide-react';

interface WaybillModalProps {
  lot: BatchLot | null;
  onClose: () => void;
}

export const WaybillModal: React.FC<WaybillModalProps> = ({ lot, onClose }) => {
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
            <Truck className="h-4 w-4 text-sky-400" />
            <span className="font-semibold">Dokumen Manifes Pengangkutan Limbah B3 Festronik & Surat Jalan</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Cetak Surat Jalan</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE OFFICIAL WAYBILL DOCUMENT */}
        <div className="print-area bg-white text-slate-900 rounded-2xl p-8 sm:p-10 border border-slate-300 shadow-2xl space-y-6">
          
          {/* HEADER */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-wider text-slate-950 font-mono">
                  ZYPHER<span className="text-sky-700">.LOGISTICS</span>
                </span>
                <span className="text-[10px] bg-slate-900 text-white font-mono px-2 py-0.5 rounded font-bold">
                  B3 HAZMAT MANIFEST
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium mt-1">
                Surat Pengangkutan Limbah Bahan Berbahaya & Beracun (Festronik KLHK)
              </p>
              <p className="text-[10px] text-slate-500">
                Dasar Hukum: PP No. 22 Tahun 2021 & Permen LHK No. 6 Tahun 2021
              </p>
            </div>

            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-500 block">Nomor Resi / Waybill:</span>
              <span className="text-sm font-bold text-slate-950 tracking-wider">WB-{lot.id}</span>
              <span className="text-[10px] text-slate-500 block mt-1">Kode Manifes Festronik:</span>
              <span className="text-xs font-bold text-sky-800">{lot.manifestCode}</span>
            </div>
          </div>

          {/* SENDER & RECEIVER BOXES */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="border border-slate-300 rounded-lg p-3.5 space-y-1 bg-slate-50">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">1. Penghasil Limbah (Pengirim):</span>
              <p className="font-bold text-slate-900">{lot.companyName}</p>
              <p className="text-slate-600">PIC: {lot.picName} ({lot.picContact})</p>
              <p className="text-slate-500 text-[11px]">Asal: Fasilitas Datacenter & Gudang IT Korporat</p>
            </div>

            <div className="border border-slate-300 rounded-lg p-3.5 space-y-1 bg-slate-50">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">2. Penerima / Pengolah Berizin:</span>
              <p className="font-bold text-slate-900">PT ZYPHER SIRKULAR INDONESIA</p>
              <p className="text-slate-600">Depo Pemilahan B3 Terpadu (Izin KLHK: 042/PSLB3/2022)</p>
              <p className="text-slate-500 text-[11px]">Kawasan Industri Marunda, Jakarta Utara</p>
            </div>
          </div>

          {/* CARGO & HAZMAT DETAILS */}
          <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold">
                  <th className="p-2.5">Karakteristik Limbah</th>
                  <th className="p-2.5">Kode B3</th>
                  <th className="p-2.5">Kuantitas</th>
                  <th className="p-2.5">Estimasi Bobot</th>
                  <th className="p-2.5">Bentuk Kemasan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="p-2.5 font-medium text-slate-900">{lot.itemDescription}</td>
                  <td className="p-2.5 font-mono font-bold text-amber-800">B107d</td>
                  <td className="p-2.5 font-mono">{lot.quantityUnits} Unit</td>
                  <td className="p-2.5 font-mono font-bold text-slate-900">{lot.estimatedWeightKg.toLocaleString()} Kg</td>
                  <td className="p-2.5 text-slate-700">Pallet Sealwrap Antistatis</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* LOGISTICS & ESCROW DETAILS */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 border border-slate-200 p-3.5 rounded-lg font-mono">
            <div>
              <span className="text-[10px] text-slate-500 block">Armada Angkut HazMat:</span>
              <span className="font-bold text-slate-800">{lot.courier}</span>
              <span className="text-[10px] text-slate-500 block mt-1">Status GPS Geofence:</span>
              <span className="text-emerald-700 font-bold">Aktif & Terpantau</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Rekening Rekber Terikat:</span>
              <span className="font-bold text-slate-800">{lot.payoutBank}</span>
              <span className="text-[11px] text-slate-600 block">{lot.payoutAccount}</span>
            </div>
          </div>

          {/* SIGNATURE / HANDOVER MATRIX */}
          <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-3 gap-4 text-center text-xs">
            <div className="space-y-10">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Diserahkan Oleh (Korporasi)</span>
              <div>
                <p className="font-bold text-slate-800 underline">{lot.picName.split(',')[0]}</p>
                <span className="text-[10px] text-slate-500">Petugas Fasilitas Pengirim</span>
              </div>
            </div>

            <div className="space-y-10">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Pengangkut Khusus B3</span>
              <div>
                <p className="font-bold text-slate-800 underline">Agus Setiawan (ID: HZ-992)</p>
                <span className="text-[10px] text-slate-500">Driver Bersertifikat HazMat</span>
              </div>
            </div>

            <div className="space-y-10">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Penerima Gudang Pusat B3</span>
              <div>
                <p className="font-bold text-slate-800 underline">Hendri Kusuma, S.T.</p>
                <span className="text-[10px] text-slate-500">Kepala Logistik & Timbangan</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
