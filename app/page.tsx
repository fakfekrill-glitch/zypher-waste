'use client';

import React, { useState, useEffect } from 'react';
import { UserRole, BatchLot, B2BLotTender, HarvestedComponent, LotStatus, TriageDestination } from './types';
import { ZypherDataService } from './lib/storage';
import { Navbar } from './components/Navbar';
import { ChainOfCustodyFlow } from './components/ChainOfCustodyFlow';
import { EsgYieldCalculator } from './components/EsgYieldCalculator';
import { ConsignorPortal } from './components/ConsignorPortal';
import { RecyclerPortal } from './components/RecyclerPortal';
import { CompliancePortal } from './components/CompliancePortal';
import { CertificateModal } from './components/CertificateModal';
import { WaybillModal } from './components/WaybillModal';
import { ShieldCheck, Cpu, ArrowRight, CheckCircle2, RefreshCw, Award, Lock, Sparkles } from 'lucide-react';

export default function ZypherCircularPlatform() {
  const [currentRole, setCurrentRole] = useState<UserRole>('consignor');
  const [activeSection, setActiveSection] = useState<string>('overview');

  // STORE DATA STATES
  const [lots, setLots] = useState<BatchLot[]>([]);
  const [tenders, setTenders] = useState<B2BLotTender[]>([]);
  const [components, setComponents] = useState<HarvestedComponent[]>([]);

  // MODAL STATES
  const [selectedLotForCertificate, setSelectedLotForCertificate] = useState<BatchLot | null>(null);
  const [selectedLotForWaybill, setSelectedLotForWaybill] = useState<BatchLot | null>(null);
  const [calculatorPrefill, setCalculatorPrefill] = useState<{
    category: string;
    units: number;
    weightKg: number;
    estValue: number;
  } | null>(null);

  // TOAST NOTIFICATION
  const [toastMsg, setToastMsg] = useState<string>('');
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // INITIAL LOAD
  useEffect(() => {
    document.title = 'ZYPHER CIRCULAR — Enterprise B2B E-Waste & ITAD OS';
    setLots(ZypherDataService.getLots());
    setTenders(ZypherDataService.getTenders());
    setComponents(ZypherDataService.getComponents());
  }, []);

  // DATA HANDLERS
  const handleAddLot = (newLot: BatchLot) => {
    const updated = ZypherDataService.saveLot(newLot);
    setLots(updated);
    triggerToast(`Batch ${newLot.id} berhasil didaftarkan dengan manifes Festronik!`);
  };

  const handleUpdateLotStatus = (
    id: string,
    status: LotStatus,
    triage?: TriageDestination,
    isSettled?: boolean
  ) => {
    const updated = ZypherDataService.updateLotStatus(id, status, triage, isSettled);
    setLots(updated);
    triggerToast(`Status Lot ${id} diperbarui: ${status}${isSettled ? ' (Dana Rekber Dicairkan)' : ''}`);
  };

  const handlePlaceBid = (tenderId: string, amount: number) => {
    const updated = ZypherDataService.placeBid(tenderId, amount);
    setTenders(updated);
    triggerToast(`Penawaran Rp ${amount.toLocaleString('id-ID')} berhasil dicatat di lelang!`);
  };

  const handleOrderComponent = (componentId: string, qty: number) => {
    const updated = ZypherDataService.orderComponent(componentId, qty);
    setComponents(updated);
    triggerToast(`Pemesanan ${qty} unit suku cadang berhasil diproses!`);
  };

  const handleResetData = () => {
    ZypherDataService.resetDefaults();
    setLots(ZypherDataService.getLots());
    setTenders(ZypherDataService.getTenders());
    setComponents(ZypherDataService.getComponents());
    triggerToast('Data demonstrasi berhasil di-reset ke kondisi awal!');
  };

  const handleApplyCalculatorToBatch = (data: {
    category: string;
    units: number;
    weightKg: number;
    estValue: number;
  }) => {
    setCalculatorPrefill(data);
    setCurrentRole('consignor');
    setActiveSection('portal');
    triggerToast('Data simulasi kalkulator disalin ke form dekomisioning!');
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col selection:bg-emerald-900/60 selection:text-emerald-200">
      
      {/* TOAST POPUP */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] bg-slate-900/95 text-slate-100 px-5 py-2.5 rounded-xl shadow-2xl border border-emerald-500/50 font-medium text-xs tracking-wide text-center flex items-center gap-2 pointer-events-none backdrop-blur-md">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* GLOBAL NAVBAR WITH REAL-TIME COMMODITIES & ROLE SWITCHER */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onResetData={handleResetData}
      />

      {/* MAIN CONTAINER */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* VIEW 1: HERO & COMMAND CENTER OVERVIEW */}
        {activeSection === 'overview' && (
          <div className="space-y-12">
            
            {/* HERO STATEMENT */}
            <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/40 to-slate-950/90 border border-slate-800 p-8 sm:p-12 overflow-hidden shadow-2xl">
              {/* ACCENT LIGHTING */}
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-mono font-medium">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Kepatuhan PP 22/2021 & Standar Militer NIST SP 800-88</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-100 leading-tight">
                  Infrastruktur B2B ITAD & Daur Ulang Logam Berharga Terverifikasi
                </h1>

                <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
                  Platform tata kelola limbah elektronik (E-Waste B3) tingkat korporasi di Indonesia.
                  Menghubungkan perusahaan perbankan, telekomunikasi, dan data center dengan smelter berizin resmi
                  melalui pengawasan rantai pasok terenkripsi, proteksi dana Escrow, dan pelaporan emisi Scope 3 ESG.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentRole('consignor');
                      setActiveSection('portal');
                    }}
                    className="px-5 py-3 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-950/30"
                  >
                    <span>Konsol Korporasi (Dekomisioning)</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSection('calculator')}
                    className="px-5 py-3 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
                  >
                    Simulasi ESG & Kandungan Logam
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentRole('recycler');
                      setActiveSection('portal');
                    }}
                    className="px-5 py-3 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-900/60 transition-colors"
                  >
                    Lelang Smelter B3 & Sparepart
                  </button>
                </div>
              </div>

              {/* INDUSTRIAL PROOF BANNER */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-800/80">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Tonase E-Waste Terkelola</span>
                  <span className="text-xl sm:text-2xl font-black font-mono text-slate-100 tabular-nums">148.2 Ton</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">100% Zero-Landfill Diverted</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Emas (Au) Terekstraksi</span>
                  <span className="text-xl sm:text-2xl font-black font-mono text-amber-300 tabular-nums">4.82 Kg</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Kemurnian &gt;99.9% Refined</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Tembaga (Cu) Sirkular</span>
                  <span className="text-xl sm:text-2xl font-black font-mono text-slate-100 tabular-nums">18.4 Ton</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Katoda Smelter Berizin</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Scope 3 CO₂e Averted</span>
                  <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400 tabular-nums">412.6 Ton</span>
                  <span className="text-[10px] text-emerald-400/80 block mt-0.5">Sertifikat Emisi Auditor</span>
                </div>
              </div>
            </div>

            {/* CHAIN OF CUSTODY INTERACTIVE PIPELINE */}
            <ChainOfCustodyFlow />

            {/* INTEGRATED ESG CALCULATOR PREVIEW */}
            <EsgYieldCalculator onApplyToBatch={handleApplyCalculatorToBatch} />

          </div>
        )}

        {/* VIEW 2: FULL ESG & YIELD CALCULATOR VIEW */}
        {activeSection === 'calculator' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-100">Simulasi Pemulihan Sirkular & Neraca Karbon</h2>
                <p className="text-xs text-slate-400">Model empiris ekstraksi logam WEEE & emisi Scope 3 GHG terhindar</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('overview')}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                &larr; Kembali ke Ringkasan
              </button>
            </div>
            <EsgYieldCalculator onApplyToBatch={handleApplyCalculatorToBatch} />
          </div>
        )}

        {/* VIEW 3: B2B ROLE PORTALS CONSOLE */}
        {activeSection === 'portal' && (
          <div className="space-y-6">
            
            {/* ROLE HEADER SWITCHER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase block">Konsol Pengguna Aktif:</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
                  {currentRole === 'consignor' && '🏢 Konsol Korporasi IT Asset Disposition (ITAD)'}
                  {currentRole === 'recycler' && '🏭 Konsol Smelter & Daur Ulang Komponen B3'}
                  {currentRole === 'auditor' && '⚖️ Konsol Auditor Kepatuhan KLHK & QC Triage'}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Ganti Peran Demonstrasi:</span>
                <select
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-semibold outline-none"
                >
                  <option value="consignor">1. Korporasi (Consignor)</option>
                  <option value="recycler">2. Smelter & Recycler</option>
                  <option value="auditor">3. Auditor & QC Lapangan</option>
                </select>
              </div>
            </div>

            {/* PORTAL BODIES */}
            {currentRole === 'consignor' && (
              <ConsignorPortal
                lots={lots}
                onAddLot={handleAddLot}
                onOpenWaybill={(lot) => setSelectedLotForWaybill(lot)}
                onOpenCertificate={(lot) => setSelectedLotForCertificate(lot)}
                prefillData={calculatorPrefill}
              />
            )}

            {currentRole === 'recycler' && (
              <RecyclerPortal
                tenders={tenders}
                components={components}
                onPlaceBid={handlePlaceBid}
                onOrderComponent={handleOrderComponent}
              />
            )}

            {currentRole === 'auditor' && (
              <CompliancePortal
                lots={lots}
                onUpdateLotStatus={handleUpdateLotStatus}
                onOpenCertificate={(lot) => setSelectedLotForCertificate(lot)}
                onOpenWaybill={(lot) => setSelectedLotForWaybill(lot)}
              />
            )}

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 px-4 sm:px-6 lg:px-8 mt-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-semibold text-slate-300">
              ZYPHER CIRCULAR — B2B Enterprise ITAD & Hazardous Waste Management Platform
            </p>
            <p className="text-[11px] text-slate-500">
              Memenuhi standar PP No. 22/2021, Permen LHK No. 6/2021, NIST SP 800-88 Rev. 1, R2v3, e-Stewards, dan ISO 14001:2015.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span>Serverless Vercel Ready</span>
            <span>&bull;</span>
            <span>Zero Slop Verified</span>
            <span>&bull;</span>
            <span>v2.4.0-Production</span>
          </div>
        </div>
      </footer>

      {/* PRINTABLE MODAL: CERTIFICATE OF DESTRUCTION (CoD) */}
      <CertificateModal
        lot={selectedLotForCertificate}
        onClose={() => setSelectedLotForCertificate(null)}
      />

      {/* PRINTABLE MODAL: WAYBILL & B3 HAZMAT MANIFEST */}
      <WaybillModal
        lot={selectedLotForWaybill}
        onClose={() => setSelectedLotForWaybill(null)}
      />

    </div>
  );
}