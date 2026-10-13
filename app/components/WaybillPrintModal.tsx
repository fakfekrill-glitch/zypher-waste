'use client';

import React from 'react';
import { Order, ThemeMode } from '../types';
import { Printer, X, CheckCircle2 } from 'lucide-react';

interface WaybillPrintModalProps {
  order: Order | null;
  theme: ThemeMode;
  onClose: () => void;
}

export const WaybillPrintModal: React.FC<WaybillPrintModalProps> = ({
  order,
  theme,
  onClose,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-md w-full space-y-3 my-4 sm:my-8"
      >
        
        {/* ACTION BAR (HIDDEN DURING PRINT) */}
        <div className="no-print sticky top-2 z-20 flex items-center justify-between bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl border border-slate-700 shadow-xl">
          <span className="text-xs font-bold font-mono">Lembar Waybill & Resi ZYPHER</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Cetak Resi</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              <span>Tutup</span>
            </button>
          </div>
        </div>

        {/* PRINTABLE WAYBILL SHEET */}
        <div
          id="waybill-print-area"
          className="print-area bg-white text-slate-950 p-6 rounded-2xl border border-slate-300 shadow-2xl text-left space-y-4"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3">
            <div>
              <span className="font-extrabold text-base tracking-wider font-mono">
                ZYPHER<span className="text-emerald-700">.ID</span>
              </span>
              <span className="text-[10px] text-slate-500 block">Ekosistem Sirkular E-Waste & Rekber</span>
            </div>
            <div className="text-right">
              <span className="bg-slate-950 text-white text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase">
                REKBER ESCROW
              </span>
              <span className="text-[10px] text-slate-500 block font-mono mt-0.5">{order.createdAt}</span>
            </div>
          </div>

          {/* RESI BARCODE MOCK */}
          <div className="bg-slate-100 p-3 rounded-xl text-center border border-slate-200">
            <span className="text-[9px] text-slate-500 uppercase font-mono block">Nomor Resi Pelacakan:</span>
            <p className="font-mono text-xl font-black tracking-widest text-slate-900 my-0.5">
              {order.resi}
            </p>
            <div className="flex justify-center gap-1 my-1.5">
              <div className="w-1 h-6 bg-slate-900" /><div className="w-2 h-6 bg-slate-900" />
              <div className="w-1 h-6 bg-slate-900" /><div className="w-3 h-6 bg-slate-900" />
              <div className="w-1 h-6 bg-slate-900" /><div className="w-2 h-6 bg-slate-900" />
              <div className="w-3 h-6 bg-slate-900" /><div className="w-1 h-6 bg-slate-900" />
              <div className="w-2 h-6 bg-slate-900" /><div className="w-1 h-6 bg-slate-900" />
            </div>
            <span className="text-[10px] font-mono text-emerald-800 font-bold block">
              Layanan: {order.courierType}
            </span>
          </div>

          {/* SENDER & RECEIVER DETAILS */}
          <div className="grid grid-cols-2 gap-3 text-xs border-b pb-3 border-slate-200">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Pengirim:</span>
              <p className="font-bold text-slate-900">{order.nama}</p>
              <p className="text-slate-600 text-[11px]">{order.telepon}</p>
              <p className="text-slate-600 text-[10px] leading-tight">{order.alamat}</p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Tujuan:</span>
              <p className="font-bold text-slate-900">Gudang Pusat ZYPHER.ID</p>
              <p className="text-slate-600 text-[11px]">Tim QC & Triage E-Waste</p>
              <p className="text-slate-600 text-[10px] leading-tight">Hub Logistik Sirkular Surabaya</p>
            </div>
          </div>

          {/* ITEM & ESCROW DETAILS */}
          <div className="text-xs space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">Perangkat:</span>
              <span className="font-bold text-slate-900">{order.device} {order.isDead ? '(Matot)' : ''}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Kondisi Layar / Bodi:</span>
              <span className="text-slate-800">{order.lcdCondition} / {order.bodyCondition}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Metode Rekber:</span>
              <span className="font-mono text-slate-800">{order.payoutMethod} ({order.payoutAccount})</span>
            </div>
            <div className="flex justify-between border-t pt-1 border-slate-200">
              <span className="font-bold text-slate-700">Taksiran Nilai Rekber:</span>
              <span className="font-mono font-black text-emerald-700 text-sm">
                Rp {order.estimasiAwal.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* FOOTER BAR */}
          <div className="pt-2 text-center text-[10px] text-slate-400 font-mono">
            Harap tempelkan lembar resi ini pada paket luar sebelum diserahkan ke kurir.
          </div>

        </div>

      </div>
    </div>
  );
};
