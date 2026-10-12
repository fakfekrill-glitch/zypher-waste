'use client';

import React, { useState } from 'react';
import { B2BCatalogItem, B2BRequest, ThemeMode } from '../types';
import { B2B_CATALOG_ITEMS, BORONGAN_MATERIALS } from '../lib/constants';
import { Wrench, ShoppingBag, Scale, History, Plus, Check, ArrowRight } from 'lucide-react';

interface B2BPortalProps {
  theme: ThemeMode;
  b2bRequests: B2BRequest[];
  onSubmitB2BRequest: (req: B2BRequest) => void;
}

export const B2BPortal: React.FC<B2BPortalProps> = ({
  theme,
  b2bRequests,
  onSubmitB2BRequest,
}) => {
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'katalog' | 'borongan' | 'histori'>('katalog');
  const [filterCat, setFilterCat] = useState<string>('Semua');

  // BORONGAN FORM STATES
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('mat-1');
  const [boronganVolume, setBoronganVolume] = useState<string>('50');
  const [buyerName, setBuyerName] = useState<string>('Counter Servis Sentosa (Surabaya)');

  // ORDER PART MODAL STATE
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<B2BCatalogItem | null>(null);
  const [orderQty, setOrderQty] = useState<number>(1);
  const [technicianName, setTechnicianName] = useState<string>('Teknisi Hendra (FixPhone)');

  const selectedMat = BORONGAN_MATERIALS.find((m) => m.id === selectedMaterialId) || BORONGAN_MATERIALS[0];
  const volumeKg = parseInt(boronganVolume || '0', 10);
  const estimatedBoronganTotal = volumeKg * selectedMat.hargaPerKg;

  const filteredCatalog = B2B_CATALOG_ITEMS.filter((item) => {
    if (filterCat === 'Semua') return true;
    return item.category === filterCat;
  });

  const handleOrderCatalogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatalogItem) return;

    const newReq: B2BRequest = {
      id: `b2b-${Date.now()}`,
      reqId: `PRT-2026-${Math.floor(100 + Math.random() * 900)}`,
      tipe: `${selectedCatalogItem.name} (${selectedCatalogItem.grade})`,
      volume: `${orderQty} Pcs`,
      status: 'Menunggu Pengiriman',
      price: selectedCatalogItem.price * orderQty,
      buyerName: technicianName,
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB',
      notes: `Pemesanan part kanibalan untuk kebutuhan teknisi servis.`,
    };

    onSubmitB2BRequest(newReq);
    setSelectedCatalogItem(null);
    setActiveTab('histori');
  };

  const handleBoronganSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: B2BRequest = {
      id: `b2b-${Date.now()}`,
      reqId: `BOR-2026-${Math.floor(100 + Math.random() * 900)}`,
      tipe: selectedMat.nama,
      volume: `${volumeKg} ${selectedMat.satuan}`,
      status: 'Pengajuan Diproses',
      price: estimatedBoronganTotal,
      buyerName: buyerName,
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB',
      notes: `Pengajuan borongan limbah e-waste per kilo.`,
    };

    onSubmitB2BRequest(newReq);
    setActiveTab('histori');
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
            <Wrench className="h-4 w-4 text-amber-500" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Portal Mitra Teknisi & Pengepul Limbah (B2B)
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Dapatkan pasokan suku cadang kanibalan original (copotan) dan ajukan borongan material limbah e-waste per kilo.
          </p>
        </div>

        {/* INNER TABS */}
        <div
          className={`flex p-1 rounded-xl border text-xs font-semibold ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveTab('katalog')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'katalog'
                ? isDark
                  ? 'bg-slate-800 text-amber-400 border border-slate-700'
                  : 'bg-white text-amber-700 border border-slate-200 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            Katalog Part Kanibalan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('borongan')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'borongan'
                ? isDark
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'bg-white text-emerald-700 border border-slate-200 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            Borongan E-Waste (Kiloan)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('histori')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'histori'
                ? isDark
                  ? 'bg-slate-800 text-sky-400 border border-slate-700'
                  : 'bg-white text-sky-700 border border-slate-200 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            Histori Pesanan ({b2bRequests.length})
          </button>
        </div>
      </div>

      {/* TAB 1: KATALOG PART KANIBALAN */}
      {activeTab === 'katalog' && (
        <div className="space-y-4">
          
          {/* CATEGORY FILTER CHIPS */}
          <div className="flex flex-wrap items-center gap-2">
            {['Semua', 'LCD & Layar', 'Mesin & IC', 'Kamera Copotan', 'Baterai & Fleksibel'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  filterCat === cat
                    ? 'bg-amber-600 text-white border-amber-600'
                    : isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* CATALOG GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalog.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-3.5 transition-all ${
                  isDark ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {item.grade}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Stok: <strong className="text-slate-700 dark:text-slate-300">{item.stock}</strong>
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                    {item.name}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-slate-400 font-mono">Harga Grosir:</span>
                    <span className="font-mono font-black text-base text-emerald-600 dark:text-emerald-400">
                      Rp {item.price.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCatalogItem(item);
                      setOrderQty(1);
                    }}
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Pesan Part Ini</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: BORONGAN LIMBAH E-WASTE PER KILO */}
      {activeTab === 'borongan' && (
        <div
          className={`max-w-2xl mx-auto p-6 rounded-2xl border space-y-5 ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              Pengajuan Borongan Limbah E-Waste (Satuan Kiloan)
            </h3>
            <p className="text-xs text-slate-500">
              Disediakan untuk pabrik daur ulang, perajin urban mining, dan counter servis yang membutuhkan pasokan bahan mentah.
            </p>
          </div>

          <form onSubmit={handleBoronganSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Pilih Jenis Material E-Waste
              </label>
              <select
                value={selectedMaterialId}
                onChange={(e) => setSelectedMaterialId(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs outline-none font-semibold ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                {BORONGAN_MATERIALS.map((mat) => (
                  <option key={mat.id} value={mat.id}>
                    {mat.nama} — Rp {mat.hargaPerKg.toLocaleString('id-ID')}/Kg
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-500 block mt-1">{selectedMat.kadar}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Volume Borongan (Kg)
                </label>
                <input
                  type="number"
                  min="5"
                  value={boronganVolume}
                  onChange={(e) => setBoronganVolume(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs outline-none font-mono font-bold ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Nama Mitra / Workshop
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Contoh: Mitra Servis Surabaya"
                  className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  required
                />
              </div>
            </div>

            {/* LIVE PRICE CALCULATION HERO BOX */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-emerald-50 border-emerald-200'
              }`}
            >
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Estimasi Total Nilai Borongan:</span>
                <span className="font-mono text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  Rp {estimatedBoronganTotal.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-slate-500 block">Volume: {volumeKg} Kg @ Rp {selectedMat.hargaPerKg.toLocaleString('id-ID')}/Kg</span>
              </div>
              <Scale className="h-6 w-6 text-emerald-500" />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm active:scale-95"
            >
              Kirim Pengajuan Borongan E-Waste
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: HISTORI PESANAN B2B */}
      {activeTab === 'histori' && (
        <div className="space-y-3">
          {b2bRequests.length === 0 ? (
            <div
              className={`p-10 rounded-2xl border text-center text-slate-500 text-xs ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              Belum ada pesanan suku cadang atau pengajuan borongan limbah.
            </div>
          ) : (
            b2bRequests.map((req) => (
              <div
                key={req.id}
                className={`p-4 rounded-2xl border space-y-2 text-xs transition-all ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{req.reqId}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                    {req.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-slate-800 dark:text-slate-200">{req.tipe}</p>
                  <p className="text-slate-500">
                    Mitra: <strong className="text-slate-700 dark:text-slate-300">{req.buyerName || '-'}</strong> &bull; Volume:{' '}
                    <strong>{req.volume}</strong>
                  </p>
                  {req.price && (
                    <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      Total Nilai: Rp {req.price.toLocaleString('id-ID')}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400">{req.createdAt}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ORDER CATALOG MODAL */}
      {selectedCatalogItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div
            className={`max-w-md w-full p-6 rounded-2xl border space-y-4 shadow-2xl ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex justify-between items-center border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold">Pemesanan Suku Cadang Kanibalan</h3>
              <button
                type="button"
                onClick={() => setSelectedCatalogItem(null)}
                className="text-slate-400 hover:text-slate-200 text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleOrderCatalogSubmit} className="space-y-3.5 text-xs">
              <div
                className={`p-3 rounded-xl border space-y-1 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <p className="font-bold">{selectedCatalogItem.name}</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                  Rp {selectedCatalogItem.price.toLocaleString('id-ID')} / unit
                </p>
                <p className="text-slate-500 text-[10px]">Stok: {selectedCatalogItem.stock}</p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Jumlah Pemesanan (Pcs)
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedCatalogItem.stockQty}
                  value={orderQty}
                  onChange={(e) => setOrderQty(parseInt(e.target.value || '1', 10))}
                  className={`w-full p-2.5 rounded-xl border text-xs outline-none font-mono ${
                    isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Nama Teknisi / Bengkel Servis
                </label>
                <input
                  type="text"
                  value={technicianName}
                  onChange={(e) => setTechnicianName(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                    isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div
                className={`p-3 rounded-xl border flex items-center justify-between font-mono ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-emerald-50 border-emerald-200'
                }`}
              >
                <span className="text-slate-500">Total Tagihan:</span>
                <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                  Rp {(selectedCatalogItem.price * orderQty).toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedCatalogItem(null)}
                  className="px-4 py-2 rounded-xl text-slate-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Konfirmasi Order Part
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
