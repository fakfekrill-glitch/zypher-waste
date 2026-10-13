'use client';

import React, { useState } from 'react';
import { Order, TriageCategory, ThemeMode, B2BRequest, B2BCatalogItem } from '../types';
import {
  ShieldCheck,
  MessageSquare,
  Check,
  Truck,
  Layers,
  CheckCircle2,
  Package,
  Wrench,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  ShoppingBag,
  Send,
  X,
  FileText,
} from 'lucide-react';

interface AdminQCViewProps {
  orders: Order[];
  theme: ThemeMode;
  onUpdateStatus: (orderId: string, status: Order['status'], triage?: Order['triage'], finalPrice?: number) => void;
  b2bRequests: B2BRequest[];
  onUpdateB2BStatus: (reqId: string, status: string, resi?: string, courier?: string) => void;
  catalogItems: B2BCatalogItem[];
  onSaveCatalogItem: (item: B2BCatalogItem) => void;
  onUpdateCatalogStock: (id: string, delta: number) => void;
  onDeleteCatalogItem: (id: string) => void;
  onOpenEscrowReceipt?: (order: Order) => void;
}

export const AdminQCView: React.FC<AdminQCViewProps> = ({
  orders,
  theme,
  onUpdateStatus,
  b2bRequests,
  onUpdateB2BStatus,
  catalogItems,
  onSaveCatalogItem,
  onUpdateCatalogStock,
  onDeleteCatalogItem,
  onOpenEscrowReceipt,
}) => {
  const isDark = theme === 'dark';
  const [adminTab, setAdminTab] = useState<'qc' | 'b2b-orders' | 'spareparts' | 'inventory'>('qc');

  // MODAL STATES
  const [showAddPartModal, setShowAddPartModal] = useState<boolean>(false);
  const [shippingReq, setShippingReq] = useState<B2BRequest | null>(null);

  // NEW SPARE PART FORM
  const [partName, setPartName] = useState<string>('');
  const [partCategory, setPartCategory] = useState<B2BCatalogItem['category']>('Mesin & IC');
  const [partGrade, setPartGrade] = useState<B2BCatalogItem['grade']>('Cabutan Kanibal IC');
  const [partStock, setPartStock] = useState<number>(5);
  const [partPrice, setPartPrice] = useState<number>(150000);
  const [partDesc, setPartDesc] = useState<string>('');
  const [partSourceDevice, setPartSourceDevice] = useState<string>('');

  // SHIPPING MODAL FORM
  const [shippingResi, setShippingResi] = useState<string>('');
  const [shippingCourier, setShippingCourier] = useState<string>('JNE Trucking (JTR)');

  // FILTERED ORDERS
  const pendingOrders = orders.filter((o) =>
    ['Menunggu Pickup', 'Tiba di Gudang', 'Menunggu Persetujuan User'].includes(o.status)
  );
  const completedInventory = orders.filter((o) => o.triage !== 'Belum Disortir');

  // B2B ACTIVE ORDERS
  const pendingB2BCount = b2bRequests.filter(
    (r) => r.status === 'Menunggu Konfirmasi' || r.status === 'Pengajuan Diproses' || r.status === 'Diproses Gudang'
  ).length;

  // HANDLER: CHAT USER WHATSAPP
  const handleChatUserWhatsApp = (order: Order) => {
    const cleanPhone = order.telepon.replace(/\D/g, '');
    const phone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const msg = encodeURIComponent(
      `Halo Kak ${order.nama},\n\nPaket E-Waste dengan Resi *${order.resi}* (${order.device}) telah tiba di Gudang Pusat ZYPHER.ID.\n\nBerikut kami undang untuk melakukan video unboxing pemeriksaan fisik perangkat agar proses pencairan dana Rekber Rp ${order.estimasiAwal.toLocaleString('id-ID')} (${order.payoutMethod}) dapat segera diselesaikan.`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  // HANDLER: CHAT B2B BUYER WHATSAPP
  const handleChatB2BBuyer = (req: B2BRequest) => {
    const msg = encodeURIComponent(
      `Halo Mitra ${req.buyerName || 'Teknisi'},\n\nAdmin ZYPHER.ID mengonfirmasi pesanan Anda:\n- No. Pengajuan: *${req.reqId}*\n- Item: *${req.tipe}*\n- Volume: *${req.volume}*\n- Total: *Rp ${(req.price || 0).toLocaleString('id-ID')}*\n- Status: *${req.status}* ${req.resiPengiriman ? `(Resi: ${req.resiPengiriman} via ${req.courier})` : ''}\n\nTerima kasih atas kerja sama circular supply chain bersama ZYPHER.ID.`
    );
    window.open(`https://wa.me/6289521430567?text=${msg}`, '_blank');
  };

  // OPEN ADD PART FROM QC TRIAGE
  const handleTriageToPartModal = (order: Order) => {
    setPartName(`Mesin Copotan & IC (${order.device})`);
    setPartCategory('Mesin & IC');
    setPartGrade('Cabutan Kanibal IC');
    setPartStock(1);
    setPartPrice(180000);
    setPartSourceDevice(order.device);
    setPartDesc(`Hasil panen kanibal dari unit ${order.device} (Resi: ${order.resi}). IC utuh, komponen jumper siap uji.`);
    setShowAddPartModal(true);
  };

  // SUBMIT NEW PART
  const handleSubmitNewPart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partName.trim()) return;

    const newItem: B2BCatalogItem = {
      id: `cat-${Date.now()}`,
      name: partName.trim(),
      category: partCategory,
      grade: partGrade,
      stockQty: Number(partStock) || 1,
      stock: `${Number(partStock) || 1} Pcs`,
      price: Number(partPrice) || 50000,
      desc: partDesc.trim() || `Suku cadang copotan asli ${partName}.`,
      sourceDevice: partSourceDevice.trim() || undefined,
    };

    onSaveCatalogItem(newItem);
    setShowAddPartModal(false);

    // Reset form
    setPartName('');
    setPartDesc('');
    setPartSourceDevice('');
  };

  // SUBMIT SHIPMENT RESI
  const handleSubmitShippingResi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingReq) return;

    const finalResi = shippingResi.trim() || `ZYP-TRK-${Math.floor(1000 + Math.random() * 9000)}`;
    onUpdateB2BStatus(shippingReq.id, 'Dalam Pengiriman', finalResi, shippingCourier);
    setShippingReq(null);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div
        className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-5 w-5 text-sky-500" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Konsol Terpadu Admin Gudang QC & Manajemen B2B
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Pusat operasional triage limbah masuk, verifikasi video unboxing, suplai part kanibal, dan pemrosesan pesanan teknisi.
          </p>
        </div>

        {/* 4 MAIN TABS */}
        <div
          className={`flex flex-wrap p-1 rounded-xl border text-xs font-semibold ${
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
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            QC Masuk ({pendingOrders.length})
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('b2b-orders')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              adminTab === 'b2b-orders'
                ? isDark
                  ? 'bg-slate-800 text-amber-400 border border-slate-700'
                  : 'bg-white text-amber-700 border border-slate-200 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span>Pesanan B2B ({b2bRequests.length})</span>
            {pendingB2BCount > 0 && (
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('spareparts')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              adminTab === 'spareparts'
                ? isDark
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'bg-white text-emerald-700 border border-slate-200 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Part Kanibal ({catalogItems.length})
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('inventory')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              adminTab === 'inventory'
                ? isDark
                  ? 'bg-slate-800 text-slate-200 border border-slate-700'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Inventaris ({completedInventory.length})
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: VERIFIKASI QC BARANG MASUK DARI USER */}
      {/* ======================================================== */}
      {adminTab === 'qc' && (
        <div className="space-y-4">
          {pendingOrders.length === 0 ? (
            <div
              className={`p-10 rounded-2xl border text-center text-slate-500 text-xs ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              Tidak ada antrean verifikasi paket e-waste dari penjual saat ini.
            </div>
          ) : (
            pendingOrders.map((order) => (
              <div
                key={order.id}
                className={`p-5 rounded-2xl border space-y-4 text-xs transition-all ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600 dark:text-slate-300">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{order.device}</p>
                    <p>
                      Pengirim: <strong className="text-slate-900 dark:text-white">{order.nama}</strong> ({order.telepon})
                    </p>
                    <p className="text-[11px] text-slate-500">Alamat: {order.alamat}</p>
                  </div>

                  <div className="space-y-1">
                    <p>
                      Kondisi: <strong className="text-slate-900 dark:text-white">{order.isDead ? 'Mati Total (Matot)' : 'Hidup'}</strong> | Layar: {order.lcdCondition} | Bodi: {order.bodyCondition}
                    </p>
                    <p>
                      Rekber: <strong className="text-slate-900 dark:text-white">{order.payoutMethod} - {order.payoutAccount}</strong>
                    </p>
                    {order.notes && (
                      <p className="text-[11px] text-slate-500 italic">Catatan: {order.notes}</p>
                    )}
                  </div>
                </div>

                {/* PHOTOS PREVIEW */}
                {order.photos && order.photos.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {order.photos.map((ph, idx) => (
                      <img
                        key={idx}
                        src={ph}
                        alt="Bukti fisik"
                        className="h-16 w-16 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                      />
                    ))}
                  </div>
                )}

                {/* QC ACTION BUTTONS */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleChatUserWhatsApp(order)}
                    className="w-full py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs"
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
                      <div className="flex flex-col sm:flex-row gap-2">
                        <select
                          id={`triage-select-${order.id}`}
                          defaultValue={order.triage || 'Kanibal'}
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
                          className="px-4 py-2.5 rounded-xl font-bold bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <span>Simpan Triage</span>
                        </button>
                      </div>

                      {/* QUICK CONVERT TO B2B PART */}
                      <button
                        type="button"
                        onClick={() => handleTriageToPartModal(order)}
                        className={`w-full py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors ${
                          isDark
                            ? 'bg-slate-950 border-amber-800 text-amber-300 hover:bg-amber-950/40'
                            : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                        }`}
                      >
                        <Wrench className="h-3.5 w-3.5 text-amber-500" />
                        <span>+ Panen & Tambahkan Langsung ke Katalog Part B2B</span>
                      </button>
                    </div>
                  )}

                  {order.status === 'Menunggu Persetujuan User' && (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateStatus(order.id, 'Selesai & Cair');
                          onOpenEscrowReceipt?.({ ...order, status: 'Selesai & Cair' });
                        }}
                        className="w-full py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Check className="h-4 w-4" />
                        <span>Konfirmasi Transfer Dana Rekber ({order.payoutMethod}) & Selesaikan Pesanan</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTriageToPartModal(order)}
                        className={`w-full py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors ${
                          isDark
                            ? 'bg-slate-950 border-amber-800 text-amber-300 hover:bg-amber-950/40'
                            : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                        }`}
                      >
                        <Wrench className="h-3.5 w-3.5 text-amber-500" />
                        <span>+ Masukkan Hasil Panen ke Katalog Kanibal B2B</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: PESANAN MASUK DARI MITRA B2B */}
      {/* ======================================================== */}
      {adminTab === 'b2b-orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Daftar Permintaan Pasokan Part & Borongan Limbah Teknisi
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Total {b2bRequests.length} Transaksi
            </span>
          </div>

          {b2bRequests.length === 0 ? (
            <div
              className={`p-10 rounded-2xl border text-center text-slate-500 text-xs ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              Belum ada pesanan dari mitra teknisi B2B.
            </div>
          ) : (
            b2bRequests.map((req) => (
              <div
                key={req.id}
                className={`p-5 rounded-2xl border space-y-3.5 text-xs transition-all ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                      {req.reqId}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        req.status === 'Selesai Terkirim'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : req.status === 'Dalam Pengiriman'
                          ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                          : req.status === 'Diproses Gudang'
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    Nilai Pesanan: Rp {(req.price || 0).toLocaleString('id-ID')}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600 dark:text-slate-300">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{req.tipe}</p>
                    <p>
                      Volume Permintaan: <strong className="text-slate-900 dark:text-white">{req.volume}</strong>
                    </p>
                    <p className="text-[11px] text-slate-500">Waktu Order: {req.createdAt}</p>
                  </div>

                  <div className="space-y-1">
                    <p>
                      Nama Mitra / Counter: <strong className="text-slate-900 dark:text-white">{req.buyerName || 'Mitra Servis'}</strong>
                    </p>
                    {req.resiPengiriman ? (
                      <p className="font-mono text-[11px] text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 p-1.5 rounded-lg border border-sky-200 dark:border-sky-800">
                        Resi Pengiriman: <strong>{req.resiPengiriman}</strong> ({req.courier || 'Ekspedisi'})
                      </p>
                    ) : (
                      <p className="text-[11px] text-amber-600 dark:text-amber-400">
                        Belum ada nomor resi pengiriman logistik.
                      </p>
                    )}
                  </div>
                </div>

                {/* B2B ADMIN ACTIONS */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  
                  {/* WHATSAPP BUYER */}
                  <button
                    type="button"
                    onClick={() => handleChatB2BBuyer(req)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Chat Mitra (WA)</span>
                  </button>

                  {/* STAGE 1: TERIMA PESANAN */}
                  {(req.status === 'Menunggu Konfirmasi' || req.status === 'Pengajuan Diproses' || req.status === 'Menunggu Pengiriman') && (
                    <button
                      type="button"
                      onClick={() => onUpdateB2BStatus(req.id, 'Diproses Gudang')}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Package className="h-3.5 w-3.5" />
                      <span>Terima & Siapkan di Gudang</span>
                    </button>
                  )}

                  {/* STAGE 2: INPUT RESI & KIRIM */}
                  {(req.status === 'Diproses Gudang' || req.status === 'Menunggu Pengiriman' || req.status === 'Siap Kirim') && (
                    <button
                      type="button"
                      onClick={() => {
                        setShippingReq(req);
                        setShippingResi(`ZYP-TRK-${Math.floor(1000 + Math.random() * 9000)}`);
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Truck className="h-3.5 w-3.5" />
                      <span>Input Resi & Kirim Part</span>
                    </button>
                  )}

                  {/* STAGE 3: SELESAIKAN PESANAN */}
                  {req.status === 'Dalam Pengiriman' && (
                    <button
                      type="button"
                      onClick={() => onUpdateB2BStatus(req.id, 'Selesai Terkirim')}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Konfirmasi Pesanan Telah Diterima Pembeli</span>
                    </button>
                  )}

                  {req.status === 'Selesai Terkirim' && (
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 ml-auto">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Transaksi B2B Selesai Penuh</span>
                    </span>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: MANAJEMEN SUKU CADANG KANIBALAN B2B */}
      {/* ======================================================== */}
      {adminTab === 'spareparts' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Katalog Suku Cadang Copotan & Kanibal B2B
              </h3>
              <p className="text-xs text-slate-500">
                Kelola stok, harga grosir, dan penambahan komponen hasil triage perangkat rusak.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setPartName('');
                setPartDesc('');
                setPartSourceDevice('');
                setPartStock(10);
                setPartPrice(120000);
                setShowAddPartModal(true);
              }}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Part Kanibal Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalogItems.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-3.5 transition-all ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {item.grade}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {item.category}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {item.name}
                  </h4>

                  {item.sourceDevice && (
                    <p className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
                      Copotan: <strong>{item.sourceDevice}</strong>
                    </p>
                  )}

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-500 font-mono">Harga Grosir:</span>
                    <span className="font-mono font-bold text-base text-emerald-600 dark:text-emerald-400">
                      Rp {item.price.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {/* STOCK ADJUSTMENT STEPPER */}
                  <div className="flex items-center justify-between p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs">
                    <span className="font-medium text-slate-600 dark:text-slate-400">Stok Tersedia:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onUpdateCatalogStock(item.id, -1)}
                        className="h-6 w-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors"
                        title="Kurangi stok"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-sm text-slate-900 dark:text-white min-w-[32px] text-center">
                        {item.stockQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateCatalogStock(item.id, +1)}
                        className="h-6 w-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors"
                        title="Tambah stok"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* DELETE BUTTON */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Hapus part "${item.name}" dari katalog B2B?`)) {
                          onDeleteCatalogItem(item.id);
                        }
                      }}
                      className="text-[11px] text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Hapus Part</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: INVENTARIS UNIT TERPILAH */}
      {/* ======================================================== */}
      {adminTab === 'inventory' && (
        <div
          className={`p-6 rounded-2xl border space-y-4 ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Daftar Inventaris Unit Masuk Gudang Pusat ZYPHER
              </h3>
              <p className="text-xs text-slate-500">
                Rekapitulasi seluruh unit rusak yang telah diklasifikasikan ke jalur sirkular.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {completedInventory.length} Unit Terklasifikasi
            </span>
          </div>

          <div className="space-y-2.5">
            {completedInventory.map((order) => (
              <div
                key={order.id}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                  isDark ? 'bg-slate-950/80 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{order.device}</span>
                  <span className="text-[10px] text-slate-500 block font-mono">
                    Resi: {order.resi} &bull; Masuk: {order.createdAt} &bull; Pengirim: {order.nama}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span
                    className={`text-[10px] font-mono px-2.5 py-1 rounded-lg font-bold ${
                      order.triage === 'Kanibal'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : order.triage === 'Refurbish'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    Triage: {order.triage}
                  </span>

                  {order.triage === 'Kanibal' && (
                    <button
                      type="button"
                      onClick={() => handleTriageToPartModal(order)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      + Tambah ke B2B
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onOpenEscrowReceipt?.(order)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-1 transition-colors"
                    title="Buka bukti kliring transfer rekber"
                  >
                    <FileText className="h-3 w-3" />
                    <span>Faktur Rekber</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: TAMBAH / PANEN PART KANIBALAN BARU */}
      {/* ======================================================== */}
      {showAddPartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div
            className={`max-w-lg w-full p-6 rounded-2xl border space-y-4 shadow-2xl my-8 ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex justify-between items-center border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-emerald-500" />
                <h3 className="text-sm font-bold">Tambah Suku Cadang Kanibal ke Katalog B2B</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddPartModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewPart} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Part Suku Cadang
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Mesin Cabutan Poco X3 Pro (IC Utuh)"
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Kategori Komponen
                  </label>
                  <select
                    value={partCategory}
                    onChange={(e) => setPartCategory(e.target.value as any)}
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Mesin & IC">Mesin & IC</option>
                    <option value="LCD & Layar">LCD & Layar</option>
                    <option value="Kamera Copotan">Kamera Copotan</option>
                    <option value="Baterai & Fleksibel">Baterai & Fleksibel</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Grade Kelayakan
                  </label>
                  <select
                    value={partGrade}
                    onChange={(e) => setPartGrade(e.target.value as any)}
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Grade A Servis">Grade A Servis</option>
                    <option value="Grade B Minus">Grade B Minus</option>
                    <option value="Cabutan Kanibal IC">Cabutan Kanibal IC</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Jumlah Stok (Pcs)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={partStock}
                    onChange={(e) => setPartStock(Number(e.target.value))}
                    className={`w-full p-2.5 rounded-xl border outline-none font-mono ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Harga Grosir Teknisi (Rp)
                  </label>
                  <input
                    type="number"
                    step="5000"
                    value={partPrice}
                    onChange={(e) => setPartPrice(Number(e.target.value))}
                    className={`w-full p-2.5 rounded-xl border outline-none font-mono ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Asal Model Perangkat (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Poco X3 Pro, iPhone 11, Samsung A52"
                  value={partSourceDevice}
                  onChange={(e) => setPartSourceDevice(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Deskripsi & Kondisi Fisik Part
                </label>
                <textarea
                  rows={2}
                  placeholder="Jelaskan kondisi komponen agar teknisi yakin..."
                  value={partDesc}
                  onChange={(e) => setPartDesc(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddPartModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  Simpan ke Katalog B2B
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: INPUT RESI PENGIRIMAN LOGISTIK B2B */}
      {/* ======================================================== */}
      {shippingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div
            className={`max-w-md w-full p-6 rounded-2xl border space-y-4 shadow-2xl ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex justify-between items-center border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-sky-500" />
                <h3 className="text-sm font-bold">Kirim Pesanan B2B: {shippingReq.reqId}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShippingReq(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitShippingResi} className="space-y-3.5 text-xs">
              <div
                className={`p-3 rounded-xl border space-y-1 text-slate-600 dark:text-slate-400 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <p className="font-bold text-slate-900 dark:text-white">{shippingReq.tipe}</p>
                <p>Volume: {shippingReq.volume} | Pembeli: {shippingReq.buyerName || '-'}</p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nomor Resi Pengiriman
                </label>
                <input
                  type="text"
                  placeholder="Contoh: JTR-2026-9921"
                  value={shippingResi}
                  onChange={(e) => setShippingResi(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none font-mono ${
                    isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Jasa Ekspedisi / Kurir
                </label>
                <select
                  value={shippingCourier}
                  onChange={(e) => setShippingCourier(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="JNE Trucking (JTR)">JNE Trucking (JTR Cargo)</option>
                  <option value="Kurir Internal Gudang ZYPHER (Surabaya Hub)">Kurir Internal Gudang ZYPHER (Surabaya Hub)</option>
                  <option value="SiCepat Cargo">SiCepat Cargo</option>
                  <option value="Ambil Sendiri di Gudang Pusat">Ambil Sendiri di Gudang Pusat</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShippingReq(null)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-xs"
                >
                  Terbitkan Resi & Update Pengiriman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
