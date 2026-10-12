'use client';

import React, { useState } from 'react';
import { BatchLot, WasteCategory, SanitizationMethod } from '../types';
import { Building2, Plus, Search, FileText, Award, Truck, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface ConsignorPortalProps {
  lots: BatchLot[];
  onAddLot: (newLot: BatchLot) => void;
  onOpenWaybill: (lot: BatchLot) => void;
  onOpenCertificate: (lot: BatchLot) => void;
  prefillData?: { category: string; units: number; weightKg: number; estValue: number } | null;
}

export const ConsignorPortal: React.FC<ConsignorPortalProps> = ({
  lots,
  onAddLot,
  onOpenWaybill,
  onOpenCertificate,
  prefillData,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // FORM STATES
  const [companyName, setCompanyName] = useState<string>('PT Inovasi Finansial Terbuka');
  const [picName, setPicName] = useState<string>('Rian Aditya, S.Kom (IT Asset Custodian)');
  const [picContact, setPicContact] = useState<string>('081298765432');
  const [category, setCategory] = useState<WasteCategory>((prefillData?.category as WasteCategory) || 'server_blade');
  const [itemDescription, setItemDescription] = useState<string>('Penggantian 36 Unit Blade Server HPE ProLiant Gen10 Datacenter');
  const [quantityUnits, setQuantityUnits] = useState<number>(prefillData?.units || 36);
  const [estimatedWeightKg, setEstimatedWeightKg] = useState<number>(prefillData?.weightKg || 850);
  const [declaredValue, setDeclaredValue] = useState<number>(prefillData?.estValue || 165000000);
  const [sanitization, setSanitization] = useState<SanitizationMethod>('nist_purge');
  const [payoutBank, setPayoutBank] = useState<string>('Bank Mandiri Escrow Korporasi');
  const [payoutAccount, setPayoutAccount] = useState<string>('123-00-987654-3 (PT Inovasi Finansial)');
  const [courier, setCourier] = useState<string>('Armored Bonded HazMat Fleet #04');

  const handleSubmitLot = (e: React.FormEvent) => {
    e.preventDefault();
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newLotId = `LOT-CORP-2026-${randomSuffix}`;
    const newFestronik = `FES-B107D-2026-${randomSuffix}`;
    const newHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    // Yield estimation
    const isServer = category === 'server_blade';
    const isLaptop = category === 'laptops_pc';
    const goldGrams = Number(
      (isServer ? quantityUnits * 3.8 : isLaptop ? quantityUnits * 0.22 : estimatedWeightKg * 0.18).toFixed(1)
    );
    const copperKg = Number(
      (isServer ? quantityUnits * 3.2 : isLaptop ? quantityUnits * 0.28 : estimatedWeightKg * 0.15).toFixed(1)
    );
    const co2eAvoidedTon = Number((estimatedWeightKg * 0.0028).toFixed(2));

    const newLot: BatchLot = {
      id: newLotId,
      companyName,
      picName,
      picContact,
      category,
      itemDescription,
      quantityUnits,
      estimatedWeightKg,
      declaredValue,
      sanitization,
      triage: 'refurbish',
      status: 'SCHEDULED',
      courier,
      manifestCode: newFestronik,
      hashProof: newHash,
      yieldProjection: {
        goldGrams,
        copperKg,
        silverGrams: Math.round(goldGrams * 2.2),
        co2eAvoidedTon,
      },
      payoutBank,
      payoutAccount,
      isSettled: false,
      createdAt: new Date().toLocaleString('id-ID', { hour12: false }) + ' WIB',
      notes: 'Permintaan dekomisioning terdaftar. Menunggu jadwal penjemputan armada berlisensi B3.',
    };

    onAddLot(newLot);
    setShowModal(false);
  };

  const filteredLots = lots.filter((lot) => {
    const matchesSearch =
      lot.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.itemDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || lot.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: BatchLot['status']) => {
    switch (status) {
      case 'SCHEDULED':
        return <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono px-2 py-0.5 rounded font-semibold">1. Jadwal Dijemput</span>;
      case 'IN_TRANSIT':
        return <span className="bg-amber-950/70 text-amber-300 border border-amber-800/80 text-[10px] font-mono px-2 py-0.5 rounded font-semibold">2. Dalam Perjalanan B3</span>;
      case 'AT_FACILITY':
        return <span className="bg-blue-950/70 text-blue-300 border border-blue-800/80 text-[10px] font-mono px-2 py-0.5 rounded font-semibold">3. Tiba di Fasilitas</span>;
      case 'TRIAGE_QC':
        return <span className="bg-purple-950/70 text-purple-300 border border-purple-800/80 text-[10px] font-mono px-2 py-0.5 rounded font-semibold">4. Triage & Sanitasi Data</span>;
      case 'COMPLETED':
        return <span className="bg-emerald-950/70 text-emerald-300 border border-emerald-800/80 text-[10px] font-mono px-2 py-0.5 rounded font-semibold">5. Selesai & CoD Terbit</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BAR */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Building2 className="h-4 w-4 text-emerald-400" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-100">
              Konsol Dekomisioning IT Korporat (Enterprise ITAD)
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Daftarkan inventaris server, PC, perangkat jaringan dan baterai yang sudah habis masa pakai.
            Sertifikasi pemusnahan data rahasia (NIST SP 800-88) dan kepatuhan B3 KLHK dijamin 100%.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center justify-center gap-2 shadow-sm flex-shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Daftarkan Batch Aset Baru</span>
        </button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Cari Lot ID, nama korporasi, atau tipe perangkat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 outline-none focus:border-slate-700"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
        >
          <option value="all">Semua Kategori Aset</option>
          <option value="server_blade">Server Blade & Datacenter</option>
          <option value="laptops_pc">Laptop & Workstation</option>
          <option value="telecom_pcb">PCB Telekomunikasi & BTS</option>
          <option value="lithium_batteries">Baterai UPS Industri</option>
        </select>
      </div>

      {/* LOTS LIST */}
      <div className="space-y-3.5">
        {filteredLots.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-10 text-center text-slate-500 text-xs">
            Tidak ditemukan batch dekomisioning yang sesuai filter.
          </div>
        ) : (
          filteredLots.map((lot) => (
            <div
              key={lot.id}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700/80 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-sm text-slate-100">{lot.id}</span>
                  {getStatusBadge(lot.status)}
                  <span className="text-[10px] font-mono text-slate-500 hidden md:inline">
                    Manifes: {lot.manifestCode}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-slate-400 block sm:inline mr-2">Estimasi Nilai:</span>
                  <span className="font-mono font-bold text-sm text-emerald-400">
                    Rp {lot.declaredValue.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                <div className="md:col-span-7 space-y-1">
                  <h4 className="font-semibold text-slate-200 text-sm">{lot.itemDescription}</h4>
                  <p className="text-slate-400">
                    <strong className="text-slate-300">Korporasi:</strong> {lot.companyName} &bull; PIC: {lot.picName} ({lot.picContact})
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Armada: {lot.courier} &bull; Terdaftar: {lot.createdAt}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] font-mono bg-slate-950 text-slate-400 border border-slate-800 px-2 py-0.5 rounded">
                      Protokol Sanitasi: {lot.sanitization === 'nist_purge' ? 'NIST SP 800-88 Purge' : 'Physical Shredding'}
                    </span>
                    <span className="text-[10px] font-mono bg-slate-950 text-slate-400 border border-slate-800 px-2 py-0.5 rounded">
                      Rekber: {lot.payoutBank}
                    </span>
                  </div>
                </div>

                <div className="md:col-span-5 bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Proyeksi Hasil Daur Ulang:</span>
                    <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                      <span className="text-slate-400">Emas (Au):</span>
                      <span className="text-amber-300 font-bold">{lot.yieldProjection.goldGrams} Gram</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Tembaga (Cu):</span>
                      <span className="text-slate-200 font-bold">{lot.yieldProjection.copperKg} Kg</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Emisi CO₂e Dihindari:</span>
                      <span className="text-emerald-400 font-bold">{lot.yieldProjection.co2eAvoidedTon} Ton</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
                    <button
                      type="button"
                      onClick={() => onOpenWaybill(lot)}
                      className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5"
                    >
                      <FileText className="h-3 w-3 text-slate-400" />
                      <span>Surat Jalan & B3</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenCertificate(lot)}
                      className="flex-1 py-1.5 px-2 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 rounded text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Award className="h-3 w-3 text-emerald-400" />
                      <span>Sertifikat CoD</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL: DAFTARKAN BATCH ASET BARU */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 my-8 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100">Pendaftaran Batch Dekomisioning IT</h3>
                <p className="text-[11px] text-slate-400">Standar Pemusnahan Data NIST SP 800-88 & Manifes KLHK</p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-200 text-lg font-bold p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitLot} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Nama Perusahaan / Institusi</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">PIC & Jabatan</label>
                  <input
                    type="text"
                    required
                    value={picName}
                    onChange={(e) => setPicName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Nomor Kontak / WhatsApp PIC</label>
                  <input
                    type="tel"
                    required
                    value={picContact}
                    onChange={(e) => setPicContact(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Kategori Limbah Elektronik</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as WasteCategory)}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-200 outline-none"
                  >
                    <option value="server_blade">Server Blade & Datacenter</option>
                    <option value="laptops_pc">Laptop & Workstation Korporat</option>
                    <option value="telecom_pcb">Modul PCB Telekomunikasi / BTS</option>
                    <option value="lithium_batteries">Baterai UPS Industri (B3 Reaktif)</option>
                    <option value="mixed_scrap">Mixed PCB Scrap</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Deskripsi Spesifikasi Aset</label>
                <textarea
                  rows={2}
                  required
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Jumlah Unit</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantityUnits}
                    onChange={(e) => setQuantityUnits(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Est. Bobot (Kg)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={estimatedWeightKg}
                    onChange={(e) => setEstimatedWeightKg(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Nilai Pengajuan (Rp)</label>
                  <input
                    type="number"
                    min="100000"
                    required
                    value={declaredValue}
                    onChange={(e) => setDeclaredValue(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Protokol Pemusnahan Data</label>
                  <select
                    value={sanitization}
                    onChange={(e) => setSanitization(e.target.value as SanitizationMethod)}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-200 outline-none"
                  >
                    <option value="nist_purge">NIST SP 800-88 Purge (Cryptographic Erase)</option>
                    <option value="nist_clear">NIST SP 800-88 Clear (Multi-Pass Overwrite)</option>
                    <option value="physical_shred">Physical Shredding (3mm Particle Destruction)</option>
                    <option value="degauss">Magnetic Degaussing</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Rekening Escrow Korporasi</label>
                  <input
                    type="text"
                    required
                    value={payoutAccount}
                    onChange={(e) => setPayoutAccount(e.target.value)}
                    placeholder="Nomor rekening korporat"
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="bg-emerald-950/30 border border-emerald-900/60 p-3 rounded-lg text-[11px] text-emerald-300">
                Data akan otomatis digenerate dengan kode manifes Festronik KLHK resmi dan segel kriptografi SHA-256.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-lg font-semibold bg-slate-900 text-slate-300 hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
                >
                  Daftarkan Batch & Terbitkan Manifes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
