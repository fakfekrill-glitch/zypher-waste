'use client';

import React, { useState } from 'react';
import { B2BLotTender, HarvestedComponent } from '../types';
import { Factory, Gavel, Cpu, Scale, Check, ShoppingCart, AlertCircle, Coins, Flame } from 'lucide-react';

interface RecyclerPortalProps {
  tenders: B2BLotTender[];
  components: HarvestedComponent[];
  onPlaceBid: (tenderId: string, amount: number) => void;
  onOrderComponent: (componentId: string, quantity: number) => void;
}

export const RecyclerPortal: React.FC<RecyclerPortalProps> = ({
  tenders,
  components,
  onPlaceBid,
  onOrderComponent,
}) => {
  const [activeTab, setActiveTab] = useState<'tenders' | 'catalog' | 'weighbridge'>('tenders');

  // BID MODAL STATE
  const [selectedTender, setSelectedTender] = useState<B2BLotTender | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [bidSuccess, setBidSuccess] = useState<string>('');

  // COMPONENT ORDER STATE
  const [selectedComponent, setSelectedComponent] = useState<HarvestedComponent | null>(null);
  const [orderQty, setOrderQty] = useState<number>(1);
  const [orderSuccess, setOrderSuccess] = useState<string>('');

  // WEIGHBRIDGE LOGGER
  const [grossWeight, setGrossWeight] = useState<number>(4250);
  const [tareWeight, setTareWeight] = useState<number>(1450);
  const [lotSelection, setLotSelection] = useState<string>('LOT-CORP-2026-091');
  const [xrfPpmAu, setXrfPpmAu] = useState<number>(185);
  const [weighbridgeLogged, setWeighbridgeLogged] = useState<boolean>(false);

  const netWeight = Math.max(0, grossWeight - tareWeight);

  const handleOpenBid = (tender: B2BLotTender) => {
    setSelectedTender(tender);
    setBidAmount(tender.currentHighBid + 5000000);
    setBidSuccess('');
  };

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTender) return;
    if (bidAmount <= selectedTender.currentHighBid) {
      alert('Tawaran lelang harus lebih tinggi dari penawaran saat ini!');
      return;
    }
    onPlaceBid(selectedTender.id, bidAmount);
    setBidSuccess(`Penawaran Rp ${bidAmount.toLocaleString('id-ID')} berhasil diajukan untuk ${selectedTender.lotNumber}!`);
    setTimeout(() => {
      setSelectedTender(null);
      setBidSuccess('');
    }, 2000);
  };

  const handleOpenOrder = (comp: HarvestedComponent) => {
    setSelectedComponent(comp);
    setOrderQty(1);
    setOrderSuccess('');
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComponent) return;
    if (orderQty > selectedComponent.availableStock) {
      alert('Kuantitas melebihi stok yang tersedia!');
      return;
    }
    onOrderComponent(selectedComponent.id, orderQty);
    setOrderSuccess(`Pesanan ${orderQty} unit ${selectedComponent.sku} berhasil diproses.`);
    setTimeout(() => {
      setSelectedComponent(null);
      setOrderSuccess('');
    }, 2000);
  };

  const handleLogWeighbridge = (e: React.FormEvent) => {
    e.preventDefault();
    setWeighbridgeLogged(true);
    setTimeout(() => setWeighbridgeLogged(false), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BAR */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Factory className="h-4 w-4 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-100">
              Portal Smelter & Pengolah Limbah Elektronik Berizin B3
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Akses lelang partai besar e-waste terakreditasi, katalog pemanenan suku cadang kanibalan (refurbish),
            serta validasi berat jembatan timbang (digital weighbridge).
          </p>
        </div>

        {/* INNER TABS */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('tenders')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeTab === 'tenders'
                ? 'bg-slate-800 text-amber-300 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gavel className="h-3.5 w-3.5" />
            <span>Lelang Partai Besar</span>
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeTab === 'catalog'
                ? 'bg-slate-800 text-emerald-300 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Katalog Komponen</span>
          </button>
          <button
            onClick={() => setActiveTab('weighbridge')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeTab === 'weighbridge'
                ? 'bg-slate-800 text-sky-300 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            <span>Jembatan Timbang</span>
          </button>
        </div>
      </div>

      {/* TAB 1: LELANG PARTAI BESAR E-WASTE */}
      {activeTab === 'tenders' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tenders.map((tender) => (
              <div
                key={tender.id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-900/80 px-2 py-0.5 rounded">
                      {tender.lotNumber}
                    </span>
                    <span className="text-[10px] font-mono text-rose-400 bg-rose-950/40 border border-rose-900/60 px-2 py-0.5 rounded">
                      {tender.deadline}
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-100 text-sm leading-snug">{tender.title}</h3>
                  <p className="text-[11px] text-slate-400">{tender.originCompany} &bull; {tender.location}</p>

                  <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Berat:</span>
                      <span className="text-slate-200 font-bold">{tender.weightKg.toLocaleString()} Kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Est. Kandungan Au:</span>
                      <span className="text-amber-300 font-bold">{tender.estimatedAuGrams} Gram</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Est. Kandungan Cu:</span>
                      <span className="text-slate-200 font-bold">{tender.estimatedCuKg} Kg</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[11px] text-slate-400 font-mono">Penawaran Tertinggi:</span>
                    <span className="font-mono font-extrabold text-base text-emerald-400">
                      Rp {tender.currentHighBid.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 flex justify-between">
                    <span>{tender.bidsCount} Tawaran Masuk</span>
                    <span className="text-emerald-400">Spektrometri XRF Terverifikasi</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenBid(tender)}
                    className="w-full py-2.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Gavel className="h-3.5 w-3.5" />
                    <span>Ajukan Penawaran Tender</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: KATALOG KOMPONEN KANIBALAN / SECONDARY MARKET */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {components.map((comp) => (
              <div
                key={comp.id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded">
                      {comp.sku}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-900/80 px-2 py-0.5 rounded">
                      {comp.grade}
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-100 text-xs sm:text-sm">{comp.title}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{comp.specNotes}</p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-400">Stok: <strong className="text-slate-200">{comp.availableStock} Pcs</strong></span>
                    <span className="font-mono font-bold text-sm text-emerald-400">
                      Rp {comp.unitPrice.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenOrder(comp)}
                    disabled={comp.availableStock === 0}
                    className="w-full py-2.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-slate-100 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span>{comp.availableStock === 0 ? 'Stok Habis' : 'Order Komponen'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DIGITAL WEIGHBRIDGE & ASSAY INGESTION */}
      {activeTab === 'weighbridge' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 max-w-2xl mx-auto space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Pencatatan Jembatan Timbang & Uji Kadar XRF</h3>
              <p className="text-[11px] text-slate-400">Validasi tonase aktual limbah B3 di gate masuk smelter</p>
            </div>
            <Scale className="h-5 w-5 text-sky-400" />
          </div>

          <form onSubmit={handleLogWeighbridge} className="space-y-4 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Pilih Batch Lot Masuk</label>
              <select
                value={lotSelection}
                onChange={(e) => setLotSelection(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-slate-200 outline-none"
              >
                <option value="LOT-CORP-2026-091">LOT-CORP-2026-091 (Bank Central Finansial - 48 Server)</option>
                <option value="LOT-CORP-2026-092">LOT-CORP-2026-092 (Telco Nusantara - 320 PCB BTS)</option>
                <option value="LOT-CORP-2026-094">LOT-CORP-2026-094 (Mitra Daya Energi - Baterai UPS)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Berat Kotor / Gross (Kg)</label>
                <input
                  type="number"
                  value={grossWeight}
                  onChange={(e) => setGrossWeight(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-slate-200 outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Berat Tara Truk / Tare (Kg)</label>
                <input
                  type="number"
                  value={tareWeight}
                  onChange={(e) => setTareWeight(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-slate-200 outline-none font-mono"
                />
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[11px] text-slate-400 block">Bobot Bersih Terverifikasi (Netto):</span>
                <span className="font-mono text-xl font-bold text-emerald-400">{netWeight.toLocaleString()} Kg</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Uji Spektrometri XRF Kadar Au:</span>
                <span className="font-mono text-sm font-bold text-amber-300">{xrfPpmAu} ppm (Gram/Ton)</span>
              </div>
            </div>

            {weighbridgeLogged && (
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Tiket timbang digital berhasil disimpan dan disinkronkan ke manifes Festronik KLHK!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors"
            >
              Cetak Tiket Timbang & Kunci Verifikasi
            </button>
          </form>
        </div>
      )}

      {/* BID MODAL */}
      {selectedTender && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100">Penawaran Lelang {selectedTender.lotNumber}</h3>
              <button onClick={() => setSelectedTender(null)} className="text-slate-400 text-lg">&times;</button>
            </div>

            <form onSubmit={handleSubmitBid} className="space-y-4 text-xs">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <p className="text-slate-300 font-semibold">{selectedTender.title}</p>
                <p className="text-slate-500 font-mono">Tawaran Tertinggi: Rp {selectedTender.currentHighBid.toLocaleString('id-ID')}</p>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Nominal Tawaran Anda (Rp)</label>
                <input
                  type="number"
                  min={selectedTender.currentHighBid + 1000000}
                  step="1000000"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-200 outline-none font-mono text-sm"
                  required
                />
              </div>

              {bidSuccess && (
                <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs">
                  {bidSuccess}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedTender(null)}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400"
                >
                  Kirim Tawaran Lelang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPONENT ORDER MODAL */}
      {selectedComponent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100">Pemesanan Suku Cadang {selectedComponent.sku}</h3>
              <button onClick={() => setSelectedComponent(null)} className="text-slate-400 text-lg">&times;</button>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4 text-xs">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <p className="text-slate-200 font-semibold">{selectedComponent.title}</p>
                <p className="text-emerald-400 font-mono">Rp {selectedComponent.unitPrice.toLocaleString('id-ID')} / unit</p>
                <p className="text-slate-500 text-[10px]">Stok Tersedia: {selectedComponent.availableStock} Pcs</p>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Jumlah Pemesanan (Pcs)</label>
                <input
                  type="number"
                  min="1"
                  max={selectedComponent.availableStock}
                  value={orderQty}
                  onChange={(e) => setOrderQty(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-200 outline-none font-mono"
                  required
                />
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center font-mono">
                <span className="text-slate-400">Total Tagihan B2B:</span>
                <span className="text-sm font-bold text-emerald-400">
                  Rp {(selectedComponent.unitPrice * orderQty).toLocaleString('id-ID')}
                </span>
              </div>

              {orderSuccess && (
                <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs">
                  {orderSuccess}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedComponent(null)}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400"
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
