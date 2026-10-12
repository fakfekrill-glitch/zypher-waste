'use client';

import React, { useState } from 'react';
import { Order, TriageCategory, ThemeMode } from '../types';
import { ShieldCheck, MessageSquare, Check, Truck, Layers, CheckCircle2 } from 'lucide-react';

interface AdminQCViewProps {
  orders: Order[];
  theme: ThemeMode;
  onUpdateStatus: (orderId: string, status: Order['status'], triage?: Order['triage'], finalPrice?: number) => void;
}

export const AdminQCView: React.FC<AdminQCViewProps> = ({
  orders,
  theme,
  onUpdateStatus,
}) => {
  const isDark = theme === 'dark';
  const [adminTab, setAdminTab] = useState<'qc' | 'inventory'>('qc');

  const pendingOrders = orders.filter((o) =>
    ['Menunggu Pickup', 'Tiba di Gudang', 'Menunggu Persetujuan User'].includes(o.status)
  );

  const completedInventory = orders.filter((o) => o.triage !== 'Belum Disortir');

  const handleChatUserWhatsApp = (order: Order) => {
    const cleanPhone = order.telepon.replace(/\D/g, '');
    const phone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const msg = encodeURIComponent(
      `Halo Kak ${order.nama},\n\nPaket E-Waste dengan Resi *${order.resi}* (${order.device}) telah tiba di Gudang Pusat ZYPHER.ID.\n\nBerikut kami undang untuk melakukan video unboxing pemeriksaan fisik perangkat agar proses pencairan dana Rekber Rp ${order.estimasiAwal.toLocaleString('id-ID')} (${order.payoutMethod}) dapat segera diselesaikan.`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div
        className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-4 w-4 text-sky-500" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Konsol Admin Gudang QC & Escrow Rekber
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Verifikasi fisik barang tiba, koordinasi video unboxing WhatsApp, alokasi triage suku cadang, dan otorisasi transfer Rekber.
          </p>
        </div>

        {/* TABS */}
        <div
          className={`flex p-1 rounded-xl border text-xs font-semibold ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <button
            type="button"
            onClick={() => setAdminTab('qc')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              adminTab === 'qc'
                ? isDark
                  ? 'bg-slate-800 text-sky-400 border border-slate-700'
                  : 'bg-white text-sky-700 border border-slate-200 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            Verifikasi QC ({pendingOrders.length})
          </button>
          <button
            type="button"
            onClick={() => setAdminTab('inventory')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              adminTab === 'inventory'
                ? isDark
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'bg-white text-emerald-700 border border-slate-200 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            Inventaris Terpilah ({completedInventory.length})
          </button>
        </div>
      </div>

      {/* TAB 1: QC VERIFIKASI */}
      {adminTab === 'qc' && (
        <div className="space-y-3.5">
          {pendingOrders.length === 0 ? (
            <div
              className={`p-10 rounded-2xl border text-center text-slate-500 text-xs ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              Tidak ada antrean verifikasi paket saat ini.
            </div>
          ) : (
            pendingOrders.map((order) => (
              <div
                key={order.id}
                className={`p-5 rounded-2xl border space-y-3.5 text-xs transition-all ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                      {order.resi}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-bold">
                      {order.status}
                    </span>
                  </div>

                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    Nilai Diminta: Rp {order.estimasiAwal.toLocaleString('id-ID')}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800 dark:text-slate-200">{order.device}</p>
                    <p className="text-slate-500">
                      Pengirim: <strong className="text-slate-700 dark:text-slate-300">{order.nama}</strong> ({order.telepon})
                    </p>
                    <p className="text-slate-500">Alamat: {order.alamat}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-slate-500">
                      Kondisi: <strong className="text-slate-700 dark:text-slate-300">{order.isDead ? 'Mati Total (Matot)' : 'Hidup'}</strong> | Layar: {order.lcdCondition} | Bodi: {order.bodyCondition}
                    </p>
                    <p className="text-slate-500">
                      Tujuan Rekber: <strong className="text-slate-700 dark:text-slate-300">{order.payoutMethod} - {order.payoutAccount}</strong>
                    </p>
                  </div>
                </div>

                {/* PHOTOS PREVIEW IF ANY */}
                {order.photos && order.photos.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {order.photos.map((ph, idx) => (
                      <img
                        key={idx}
                        src={ph}
                        alt="Bukti"
                        className="h-16 w-16 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                      />
                    ))}
                  </div>
                )}

                {/* QC ACTIONS */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleChatUserWhatsApp(order)}
                    className="w-full py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Kirim Undangan Video Unboxing (WhatsApp)</span>
                  </button>

                  {order.status === 'Menunggu Pickup' && (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(order.id, 'Tiba di Gudang')}
                      className={`w-full py-2.5 rounded-xl font-bold border transition-colors ${
                        isDark
                          ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                          : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                      }`}
                    >
                      Konfirmasi Barang Telah Tiba di Gudang
                    </button>
                  )}

                  {order.status === 'Tiba di Gudang' && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <select
                          id={`triage-select-${order.id}`}
                          defaultValue="Kanibal"
                          className={`flex-1 p-2.5 rounded-xl border text-xs font-semibold outline-none ${
                            isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="Refurbish">Triage: Refurbish (Siap Diservis Ulang)</option>
                          <option value="Kanibal">Triage: Kanibal Suku Cadang (Masuk Katalog B2B)</option>
                          <option value="Urban Mining">Triage: Urban Mining B3 (Peleburan Logam)</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const val = (document.getElementById(`triage-select-${order.id}`) as HTMLSelectElement)
                              ?.value as TriageCategory;
                            onUpdateStatus(order.id, 'Menunggu Persetujuan User', val);
                          }}
                          className="px-4 py-2.5 rounded-xl font-bold bg-sky-600 hover:bg-sky-700 text-white flex items-center gap-1.5"
                        >
                          <span>Simpan Triage</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {order.status === 'Menunggu Persetujuan User' && (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(order.id, 'Selesai & Cair')}
                      className="w-full py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Check className="h-4 w-4" />
                      <span>Konfirmasi Transfer Dana Rekber ({order.payoutMethod}) & Selesaikan Pesanan</span>
                    </button>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: INVENTARIS TERPILAH */}
      {adminTab === 'inventory' && (
        <div
          className={`p-5 rounded-2xl border space-y-3 ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Daftar Inventaris Suku Cadang Masuk Gudang
            </h3>
            <span className="text-xs text-slate-500">{completedInventory.length} Unit Terklasifikasi</span>
          </div>

          <div className="space-y-2">
            {completedInventory.map((order) => (
              <div
                key={order.id}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  isDark ? 'bg-slate-950/80 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{order.device}</span>
                  <span className="text-[10px] text-slate-400 block font-mono">Resi: {order.resi} &bull; {order.createdAt}</span>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      order.triage === 'Kanibal'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : order.triage === 'Refurbish'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {order.triage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
