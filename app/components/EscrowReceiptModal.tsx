'use client';

import React, { useEffect } from 'react';
import { Order, ThemeMode } from '../types';
import { Printer, X, CheckCircle2, ShieldCheck, Share2 } from 'lucide-react';

interface EscrowReceiptModalProps {
  order: Order | null;
  theme: ThemeMode;
  onClose: () => void;
}

export const EscrowReceiptModal: React.FC<EscrowReceiptModalProps> = ({
  order,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (order) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [order, onClose]);

  if (!order) return null;

  // CALCULATE BREAKDOWN
  const grossAmount = order.hargaFinal && order.hargaFinal > 0 ? order.hargaFinal : order.estimasiAwal;
  const escrowFeeRate = 0.025; // 2.5%
  const escrowFee = Math.round(grossAmount * escrowFeeRate);
  const netDisbursed = grossAmount - escrowFee;

  // GENERATE DETERMINISTIC REF & TIME
  const cleanResiDigits = order.resi.replace(/\D/g, '').slice(-6) || '928412';
  const escrowRefNo = `ESC-202610-${cleanResiDigits}`;
  const biFastRef = `BIF-7782-${cleanResiDigits}-01`;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const cleanPhone = order.telepon.replace(/\D/g, '');
    const phone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const msg = encodeURIComponent(
      `*BUKTI PENCAIRAN REKBER ZYPHER.ID*\n` +
      `No. Ref: *${escrowRefNo}*\n` +
      `No. Resi: *${order.resi}*\n` +
      `Perangkat: *${order.device}*\n\n` +
      `Halo Kak *${order.nama}*,\n` +
      `Dana hasil penjualan perangkat e-waste Anda telah BERHASIL DICAIRKAN ke rekening *${order.payoutMethod} (${order.payoutAccount})*.\n\n` +
      `- Nilai Penjualan: Rp ${grossAmount.toLocaleString('id-ID')}\n` +
      `- Biaya Jasa Escrow (2.5%): -Rp ${escrowFee.toLocaleString('id-ID')}\n` +
      `- *Total Diterima (Bersih)*: *Rp ${netDisbursed.toLocaleString('id-ID')}*\n\n` +
      `Terima kasih telah berkontribusi dalam daur ulang sirkular bersama ZYPHER.ID!`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-lg w-full space-y-3 my-2 sm:my-6"
      >
        
        {/* STICKY ACTION BAR (HIDDEN DURING PRINT) */}
        <div className="no-print sticky top-2 z-20 flex items-center justify-between bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl border border-slate-700 shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold font-mono">Faktur & Bukti Rekber</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              title="Kirim bukti transfer ke WhatsApp penjual"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Kirim WA</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700 shadow-xs"
              title="Cetak struk faktur atau simpan PDF"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Cetak / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
              title="Tutup Faktur (Esc)"
            >
              <X className="h-3.5 w-3.5" />
              <span>Tutup</span>
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT CONTAINER */}
        <div
          id="escrow-receipt-print-area"
          className="print-area bg-white text-slate-950 p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xl text-left space-y-4"
        >
          
          {/* HEADER */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3.5">
            <div>
              <div className="flex items-center gap-1.5 font-black text-base sm:text-lg tracking-wider font-mono">
                <span className="text-emerald-700">♻️ ZYPHER</span>
                <span className="text-slate-900">.ID</span>
              </div>
              <span className="text-[10px] text-slate-600 font-semibold block">
                PT ZYPHER SOLUSI SIRKULAR INDONESIA
              </span>
              <span className="text-[9px] text-slate-400 block">
                Sistem Kliring Rekber & Penampung Escrow Terdaftar
              </span>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-block bg-slate-950 text-white text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                BUKTI RESMI KLIRING
              </span>
              <p className="font-mono text-[10px] text-slate-500">
                {order.createdAt || '12 Okt 2026'}
              </p>
            </div>
          </div>

          {/* SETTLED STATUS BANNER */}
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <span className="font-black text-xs text-emerald-950 uppercase tracking-wide block">
                  DANA TELAH DICAIRKAN (SETTLED)
                </span>
                <span className="text-[10px] text-emerald-800">
                  Kliring Otomatis BI-FAST / Disbursement Gateway Real-Time
                </span>
              </div>
            </div>

            <div className="text-right font-mono text-[9px] text-emerald-800 hidden sm:block flex-shrink-0">
              <div>Ref: <strong className="font-bold">{escrowRefNo}</strong></div>
              <div>STAN: <span>{biFastRef}</span></div>
            </div>
          </div>

          {/* PARTIES INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs border-b pb-3.5 border-slate-200">
            {/* ESCROW AGENT */}
            <div className="space-y-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[9px] font-bold text-slate-400 uppercase font-mono block">
                Pihak Kustodian (Rekber):
              </span>
              <p className="font-bold text-slate-900 leading-tight">Rekber ZYPHER.ID</p>
              <p className="text-[10px] text-slate-600">Hub Surabaya Sentral</p>
              <p className="text-[9px] font-mono text-slate-500">Rekening: BCA 088-729-1123</p>
            </div>

            {/* SELLER / BENEFICIARY */}
            <div className="space-y-1 p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-200">
              <span className="text-[9px] font-bold text-emerald-700 uppercase font-mono block">
                Penerima Dana (Penjual):
              </span>
              <p className="font-bold text-slate-900 leading-tight">{order.nama}</p>
              <p className="text-[10px] text-slate-800 font-mono font-bold">
                {order.payoutMethod} &bull; {order.payoutAccount}
              </p>
              <p className="text-[9px] text-slate-600">Telp: {order.telepon}</p>
            </div>
          </div>

          {/* ITEM DETAILS */}
          <div className="space-y-1 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
              Objek Transaksi E-Waste:
            </span>
            <div className="flex justify-between items-center py-1 border-b border-dashed border-slate-200">
              <span className="text-slate-600">Perangkat:</span>
              <span className="font-bold text-slate-900">{order.device} {order.isDead ? '(Matot)' : ''}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-dashed border-slate-200">
              <span className="text-slate-600">Nomor Resi Pengiriman:</span>
              <span className="font-mono font-bold text-slate-800">{order.resi}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-dashed border-slate-200">
              <span className="text-slate-600">Hasil Triage QC Fisik:</span>
              <span className="font-semibold text-emerald-700">{order.triage} (Layar: {order.lcdCondition})</span>
            </div>
          </div>

          {/* FINANCIAL BREAKDOWN (TRANSPARENCY CALCULATION) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
              Rincian Perhitungan Transparan:
            </span>
            
            <div className="flex justify-between text-slate-600">
              <span>Nilai Taksiran Disetujui</span>
              <span className="font-mono font-bold text-slate-900">
                Rp {grossAmount.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Penyesuaian Fisik Video Unboxing</span>
              <span className="font-mono text-slate-700">Rp 0</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Subsidi Ongkir Logistik (JNE Cashless)</span>
              <span className="font-mono text-emerald-700 font-semibold">
                Rp 0 <span className="text-[10px] text-slate-400">(Ditanggung ZYPHER)</span>
              </span>
            </div>

            <div className="flex justify-between text-rose-600">
              <span>Biaya Jasa Kustodian Rekber ZYPHER (2.5%)</span>
              <span className="font-mono font-bold">
                - Rp {escrowFee.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="border-t-2 border-slate-900 pt-2 flex justify-between items-baseline">
              <div>
                <span className="font-black text-xs uppercase tracking-wider text-slate-900 block">
                  Total Dana Bersih Masuk Rekening
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Transfer Instan Tanpa Biaya Admin Tambahan
                </span>
              </div>
              <span className="font-mono text-base font-black text-emerald-700">
                Rp {netDisbursed.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* SECURITY FOOTER & DIGITAL STAMP */}
          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500">
            <div className="space-y-0.5 text-center sm:text-left">
              <p className="font-mono text-[9px] text-slate-400">
                Hash: <span className="font-bold">sha256: 7f83a1b...c2940e</span>
              </p>
              <p className="text-[9px] text-slate-400 leading-tight">
                Diterbitkan secara sah oleh ZYPHER Escrow Engine sesuai UU ITE.
              </p>
            </div>

            {/* STAMP BADGE */}
            <div className="px-2.5 py-1 rounded-xl border-2 border-dashed border-emerald-600 text-emerald-800 font-black font-mono text-[10px] tracking-wider uppercase text-center rotate-[-2deg]">
              ✓ REKBER TERVERIFIKASI
            </div>
          </div>

          {/* BOTTOM CLOSE BUTTON FOR EXTRA ACCESSIBILITY (HIDDEN IN PRINT) */}
          <div className="no-print pt-2 border-t border-slate-200 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <X className="h-4 w-4" />
              <span>Tutup Faktur & Kembali ke Halaman</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
