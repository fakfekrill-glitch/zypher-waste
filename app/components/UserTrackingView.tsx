'use client';

import React from 'react';
import { Order, ThemeMode } from '../types';
import { WA_ADMIN_NUMBER } from '../lib/constants';
import { Package, Truck, ShieldCheck, CheckCircle2, MessageSquare, Printer, FileText } from 'lucide-react';

interface UserTrackingViewProps {
  orders: Order[];
  theme: ThemeMode;
  onOpenPrintWaybill: (order: Order) => void;
  onOpenEscrowReceipt: (order: Order) => void;
  onNewShipment: () => void;
}

export const UserTrackingView: React.FC<UserTrackingViewProps> = ({
  orders,
  theme,
  onOpenPrintWaybill,
  onOpenEscrowReceipt,
  onNewShipment,
}) => {
  const isDark = theme === 'dark';

  const trackingSteps = [
    { label: '1. Dijemput Kurir', valid: ['Menunggu Pickup', 'Tiba di Gudang', 'Menunggu Persetujuan User', 'Selesai & Cair', 'Diretur'] },
    { label: '2. Tiba di Gudang', valid: ['Tiba di Gudang', 'Menunggu Persetujuan User', 'Selesai & Cair', 'Diretur'] },
    { label: '3. QC & Triage Part', valid: ['Menunggu Persetujuan User', 'Selesai & Cair', 'Diretur'] },
    { label: '4. Dana Rekber Cair', valid: ['Selesai & Cair'] },
  ];

  const handleOpenWhatsAppConfirmation = (order: Order) => {
    const text = encodeURIComponent(
      `Halo Admin ZYPHER.ID,\n\nSaya ingin konfirmasi status pencairan Rekber pesanan saya:\n- No. Resi: *${order.resi}*\n- Nama: *${order.nama}*\n- Device: *${order.device}*\n- Rekber: *${order.payoutMethod} (${order.payoutAccount})*\n\nVideo unboxing sudah saya tinjau dan saya setujui proses pencairan dana.`
    );
    window.open(`https://wa.me/${WA_ADMIN_NUMBER}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            Riwayat & Pelacakan Status Pengiriman E-Waste
          </h2>
          <p className="text-xs text-slate-500">
            Pantau status verifikasi barang, rekaman video unboxing, dan pencairan dana Rekber Anda secara real-time.
          </p>
        </div>

        <button
          type="button"
          onClick={onNewShipment}
          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm flex-shrink-0"
        >
          + Kirim HP Baru
        </button>
      </div>

      {orders.length === 0 ? (
        <div
          className={`p-10 rounded-2xl border text-center space-y-3 ${
            isDark ? 'bg-slate-900/60 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-400'
          }`}
        >
          <Package className="h-8 w-8 mx-auto stroke-1" />
          <p className="text-xs">Belum ada pengiriman perangkat yang tercatat.</p>
          <button
            type="button"
            onClick={onNewShipment}
            className="text-xs font-semibold text-emerald-600 hover:underline"
          >
            Kirimkan perangkat elektronik rusak Anda sekarang &rarr;
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`p-5 rounded-2xl border space-y-4 transition-all ${
                isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              {/* TOP STRIP */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                    {order.resi}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      order.status === 'Selesai & Cair'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : order.status === 'Menunggu Persetujuan User'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse-gentle'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 font-mono mr-1">Nilai Rekber:</span>
                  <span className="font-mono font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                    Rp {order.estimasiAwal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <p className="font-bold text-slate-800 dark:text-slate-200">{order.device}</p>
                  <p className="text-slate-500">
                    Pengirim: <strong className="text-slate-700 dark:text-slate-300">{order.nama}</strong> ({order.telepon})
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Layanan: <strong className="text-slate-700 dark:text-slate-300">{order.courierType}</strong> &bull; {order.createdAt}
                  </p>
                </div>

                <div className="space-y-1 sm:text-right">
                  <p className="text-slate-500">
                    Rekening Pencairan: <strong className="text-slate-700 dark:text-slate-300">{order.payoutMethod} ({order.payoutAccount})</strong>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Kategori Triage Gudang: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{order.triage}</span>
                  </p>
                </div>
              </div>

              {/* TRACKING STEPPER */}
              <div
                className={`p-3 rounded-xl border ${
                  isDark ? 'bg-slate-950/70 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="grid grid-cols-4 gap-2 text-center">
                  {trackingSteps.map((st, idx) => {
                    const isActive = st.valid.includes(order.status);
                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <div
                          className={`w-3.5 h-3.5 rounded-full mb-1 transition-all ${
                            isActive
                              ? 'bg-emerald-500 ring-4 ring-emerald-500/20 shadow-sm'
                              : isDark
                              ? 'bg-slate-800'
                              : 'bg-slate-300'
                          }`}
                        />
                        <span
                          className={`text-[9px] sm:text-[10px] leading-tight ${
                            isActive
                              ? 'font-bold text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {st.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {order.status === 'Menunggu Persetujuan User' && (
                  <button
                    type="button"
                    onClick={() => handleOpenWhatsAppConfirmation(order)}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Konfirmasi Video Unboxing & Pencairan via WhatsApp</span>
                  </button>
                )}

                {order.status === 'Selesai & Cair' && (
                  <button
                    type="button"
                    onClick={() => onOpenEscrowReceipt(order)}
                    className="py-2 px-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors shadow-xs animate-pulse-gentle"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Lihat Bukti Transfer & Faktur Rekber</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onOpenPrintWaybill(order)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                  }`}
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Cetak Lembar Waybill</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
