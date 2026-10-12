'use client';

import React, { useState } from 'react';
import { BatchLot, TriageDestination, LotStatus } from '../types';
import { Scale, CheckCircle2, AlertTriangle, ShieldCheck, FileText, ArrowRight, MessageSquare, Award } from 'lucide-react';
import { REGULATORY_STANDARDS } from '../lib/constants';

interface CompliancePortalProps {
  lots: BatchLot[];
  onUpdateLotStatus: (id: string, status: LotStatus, triage?: TriageDestination, isSettled?: boolean) => void;
  onOpenCertificate: (lot: BatchLot) => void;
  onOpenWaybill: (lot: BatchLot) => void;
}

export const CompliancePortal: React.FC<CompliancePortalProps> = ({
  lots,
  onUpdateLotStatus,
  onOpenCertificate,
  onOpenWaybill,
}) => {
  const [selectedLotForAction, setSelectedLotForAction] = useState<BatchLot | null>(null);
  const [targetTriage, setTargetTriage] = useState<TriageDestination>('refurbish');

  // AGGREGATE AUDIT METRICS
  const totalWeightTon = Number((lots.reduce((acc, l) => acc + l.estimatedWeightKg, 0) / 1000).toFixed(2));
  const totalGoldKg = Number((lots.reduce((acc, l) => acc + l.yieldProjection.goldGrams, 0) / 1000).toFixed(3));
  const totalCopperTon = Number((lots.reduce((acc, l) => acc + l.yieldProjection.copperKg, 0) / 1000).toFixed(2));
  const totalCo2Ton = Number(lots.reduce((acc, l) => acc + l.yieldProjection.co2eAvoidedTon, 0).toFixed(2));

  const handleOpenTriage = (lot: BatchLot) => {
    setSelectedLotForAction(lot);
    setTargetTriage(lot.triage || 'refurbish');
  };

  const handleConfirmTriageAndAdvance = () => {
    if (!selectedLotForAction) return;

    if (selectedLotForAction.status === 'SCHEDULED') {
      onUpdateLotStatus(selectedLotForAction.id, 'IN_TRANSIT');
    } else if (selectedLotForAction.status === 'IN_TRANSIT') {
      onUpdateLotStatus(selectedLotForAction.id, 'AT_FACILITY');
    } else if (selectedLotForAction.status === 'AT_FACILITY') {
      onUpdateLotStatus(selectedLotForAction.id, 'TRIAGE_QC', targetTriage);
    } else if (selectedLotForAction.status === 'TRIAGE_QC') {
      onUpdateLotStatus(selectedLotForAction.id, 'COMPLETED', targetTriage, true);
    }

    setSelectedLotForAction(null);
  };

  const handleOpenWhatsAppUnboxing = (lot: BatchLot) => {
    const cleanPhone = lot.picContact.replace(/\D/g, '');
    const phone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const msg = encodeURIComponent(
      `Halo Bapak/Ibu ${lot.picName} (${lot.companyName}),\n\nBatch Limbah Elektronik dengan Lot ID *${lot.id}* dan Manifes *${lot.manifestCode}* telah tiba di Fasilitas Pemilahan B3 ZYPHER CIRCULAR.\n\nBerikut tautan live unboxing & laporan uji spektrometri XRF untuk verifikasi sebelum pencairan dana Escrow.`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BAR */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Scale className="h-4 w-4 text-sky-400" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-100">
              Konsol Kepatuhan Regulasi B3 KLHK & Audit QC Triage
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Pemeriksaan fisik, pemusnahan data rahasia perbankan/korporasi (NIST SP 800-88),
            dan penerbitan Berita Acara Pemusnahan (Certificate of Destruction).
          </p>
        </div>
      </div>

      {/* AGGREGATE LEDGER METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Limbah Elektronik</span>
          <div className="text-xl sm:text-2xl font-bold text-slate-100 font-mono mt-1 tabular-nums">
            {totalWeightTon} <span className="text-xs font-normal text-slate-400">Tonase</span>
          </div>
          <span className="text-[10px] text-slate-500">100% Diverted from Landfills</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-mono text-amber-300 uppercase block">Emas Murni (Au) Terekstraksi</span>
          <div className="text-xl sm:text-2xl font-bold text-amber-300 font-mono mt-1 tabular-nums">
            {totalGoldKg} <span className="text-xs font-normal text-amber-400/80">Kg Murni</span>
          </div>
          <span className="text-[10px] text-slate-500">Urban Mining Hydrometallurgy</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-mono text-slate-300 uppercase block">Tembaga (Cu) Terekstraksi</span>
          <div className="text-xl sm:text-2xl font-bold text-slate-100 font-mono mt-1 tabular-nums">
            {totalCopperTon} <span className="text-xs font-normal text-slate-400">Tonase</span>
          </div>
          <span className="text-[10px] text-slate-500">Smelter Pemurnian Katoda</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-mono text-emerald-400 uppercase block">Scope 3 CO₂e Terhindar</span>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono mt-1 tabular-nums">
            {totalCo2Ton} <span className="text-xs font-normal text-emerald-400/80">Ton CO₂e</span>
          </div>
          <span className="text-[10px] text-slate-500">Sertifikasi GHG Protocol</span>
        </div>
      </div>

      {/* QC & AUDIT ACTIONS TABLE */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Antrean Verifikasi Lapangan & Persetujuan Triage</h3>
            <p className="text-[11px] text-slate-400">Uji fisik barang, validasi sanitasi data, dan otorisasi pencairan Rekber</p>
          </div>
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
        </div>

        <div className="space-y-3">
          {lots.map((lot) => (
            <div
              key={lot.id}
              className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 lg:max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-slate-200">{lot.id}</span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                    Manifes: {lot.manifestCode}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      lot.status === 'COMPLETED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {lot.status}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-200">{lot.itemDescription}</p>
                <div className="text-[11px] text-slate-400 space-x-3">
                  <span>Perusahaan: <strong className="text-slate-300">{lot.companyName}</strong></span>
                  <span>Bobot: <strong className="text-slate-300">{lot.estimatedWeightKg} kg</strong></span>
                  <span>Rekber: <strong className="text-emerald-400">Rp {lot.declaredValue.toLocaleString('id-ID')}</strong></span>
                </div>
                <p className="text-[10px] font-mono text-slate-500">
                  Hash Kripto: {lot.hashProof.substring(0, 24)}... (SHA-256)
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenWhatsAppUnboxing(lot)}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Unboxing WA</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenWaybill(lot)}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  <span>Manifes B3</span>
                </button>

                {lot.status !== 'COMPLETED' ? (
                  <button
                    type="button"
                    onClick={() => handleOpenTriage(lot)}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Lanjutkan Tahap QC</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenCertificate(lot)}
                    className="px-3.5 py-2 bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Award className="h-3.5 w-3.5 text-emerald-400" />
                    <span>CoD & ESG Terbit</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REGULATORY COMPLIANCE STANDARDS LIST */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          Dasar Hukum & Standar Kepatuhan Operasional:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {REGULATORY_STANDARDS.map((std, idx) => (
            <div key={idx} className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-lg space-y-1 text-xs">
              <span className="font-mono font-bold text-emerald-400 text-[11px] block">{std.code}</span>
              <p className="font-semibold text-slate-200">{std.name}</p>
              <p className="text-[10px] text-slate-400">{std.institution}</p>
              <p className="text-[10px] text-slate-500 pt-1 leading-relaxed">{std.scope}</p>
            </div>
          ))}
        </div>
      </div>

      {/* QC TRIAGE MODAL */}
      {selectedLotForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  Update Status & Otorisasi QC: {selectedLotForAction.id}
                </h3>
                <p className="text-[11px] text-slate-400">{selectedLotForAction.companyName}</p>
              </div>
              <button onClick={() => setSelectedLotForAction(null)} className="text-slate-400 text-lg">&times;</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <p className="text-slate-200 font-semibold">{selectedLotForAction.itemDescription}</p>
                <p className="text-slate-400">Status Saat Ini: <strong className="text-amber-400">{selectedLotForAction.status}</strong></p>
                <p className="text-slate-400">Protokol Sanitasi: <strong>{selectedLotForAction.sanitization}</strong></p>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Tentukan Alokasi Triage Sirkular:</label>
                <select
                  value={targetTriage}
                  onChange={(e) => setTargetTriage(e.target.value as TriageDestination)}
                  className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-200 outline-none"
                >
                  <option value="refurbish">Grade A: Refurbish untuk Pasar B2B Sekunder</option>
                  <option value="harvest">Grade B: Kanibal Suku Cadang & Komponen IC</option>
                  <option value="smelt_mining">Grade C: Peleburan Logam Murni B3 (Urban Mining Au/Cu)</option>
                </select>
              </div>

              {selectedLotForAction.status === 'TRIAGE_QC' && (
                <div className="bg-emerald-950/40 border border-emerald-900/60 p-3 rounded-lg text-emerald-300 text-[11px] space-y-1">
                  <p className="font-semibold">Konfirmasi Akhir & Pencairan Dana Escrow:</p>
                  <p>
                    Menyetujui tahap ini akan mencairkan dana Rekber sebesar{' '}
                    <strong>Rp {selectedLotForAction.declaredValue.toLocaleString('id-ID')}</strong> ke rekening{' '}
                    <strong>{selectedLotForAction.payoutAccount}</strong> serta menerbitkan Certificate of Destruction (CoD) resmi.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedLotForAction(null)}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmTriageAndAdvance}
                  className="px-4 py-2 rounded-lg font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                >
                  {selectedLotForAction.status === 'TRIAGE_QC' ? 'Cairkan Rekber & Terbitkan CoD' : 'Simpan & Lanjutkan Alur'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
