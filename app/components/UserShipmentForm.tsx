'use client';

import React, { useState } from 'react';
import { Order, PhotoData, ThemeMode } from '../types';
import { MARKET_DEVICES } from '../lib/constants';
import { Smartphone, Camera, MapPin, Truck, CreditCard, Check, ArrowRight, Printer, AlertCircle } from 'lucide-react';

interface UserShipmentFormProps {
  theme: ThemeMode;
  onSubmitOrder: (order: Order) => void;
  onViewOrders: () => void;
  onOpenPrintWaybill: (order: Order) => void;
}

export const UserShipmentForm: React.FC<UserShipmentFormProps> = ({
  theme,
  onSubmitOrder,
  onViewOrders,
  onOpenPrintWaybill,
}) => {
  const isDark = theme === 'dark';

  const [step, setStep] = useState<number>(1);

  // FORM FIELDS
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // DEVICE DETAILS
  const [device, setDevice] = useState<string>('Poco X3 Pro');
  const [isDead, setIsDead] = useState<boolean>(true);
  const [lcdCondition, setLcdCondition] = useState<'normal' | 'garis' | 'retak' | 'mati'>('retak');
  const [bodyCondition, setBodyCondition] = useState<'mulus' | 'lecet' | 'parah'>('lecet');
  const [userPhotos, setUserPhotos] = useState<PhotoData[]>([]);

  // PRICING & REKBER
  const [expectedPrice, setExpectedPrice] = useState<string>('450000');
  const [payoutMethod, setPayoutMethod] = useState<string>('BCA');
  const [payoutAccount, setPayoutAccount] = useState<string>('');

  // SUBMITTED ORDER STATE
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // LIVE COURIER DETECTION
  const isSurabayaArea =
    address.toLowerCase().includes('surabaya') ||
    address.toLowerCase().includes('sby') ||
    address.toLowerCase().includes('sidoarjo') ||
    address.toLowerCase().includes('gresik');

  const courierType = isSurabayaArea ? 'Kurir Internal (Free Pickup)' : 'JNE Cashless';

  // GPS LOCATION
  const handleGetLiveLocation = () => {
    if (!navigator.geolocation) {
      alert('Fitur Geolocation tidak didukung di peramban ini.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const lat = position.coords.latitude.toFixed(4);
        const lon = position.coords.longitude.toFixed(4);
        setAddress((prev) => (prev ? `${prev} (GPS: ${lat}, ${lon})` : `Lokasi Terdeteksi: Surabaya (GPS: ${lat}, ${lon})`));
      },
      () => {
        setIsLocating(false);
        alert('Gagal mendeteksi koordinat GPS secara otomatis. Silakan ketik alamat manual.');
      }
    );
  };

  // IMAGE COMPRESSION (CANVAS)
  const handleMultipleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new window.Image();
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 720;
              const scaleSize = img.width > MAX_WIDTH ? MAX_WIDTH / img.width : 1;
              canvas.width = Math.round(img.width * scaleSize);
              canvas.height = Math.round(img.height * scaleSize);
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

              const compressedBase64 = canvas.toDataURL('image/jpeg', 0.78);
              setUserPhotos((prev) => [...prev, { file, preview: compressedBase64 }]);
            } catch {
              alert('Gagal memproses gambar');
            }
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setUserPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // SUBMIT FINAL ORDER
  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    const randomResiNumber = Math.floor(1000 + Math.random() * 9000);
    const prefix = isSurabayaArea ? 'ZYP-SUB' : 'ZYP-JNE';
    const newResi = `${prefix}-${randomResiNumber}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      resi: newResi,
      nama: fullName.trim() || 'Pelanggan ZYPHER',
      telepon: phone.trim() || '-',
      alamat: address.trim() || 'Alamat Penjemputan Terkonfirmasi',
      device,
      isDead,
      lcdCondition,
      bodyCondition,
      photos: userPhotos.map((p) => p.preview),
      estimasiAwal: parseInt(expectedPrice || '0', 10),
      hargaFinal: parseInt(expectedPrice || '0', 10),
      status: 'Menunggu Pickup',
      triage: 'Belum Disortir',
      courierType,
      payoutMethod,
      payoutAccount: payoutAccount.trim() || '-',
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB',
      notes: `Perangkat ${device} (${isDead ? 'Mati Total' : 'Hidup'}), LCD: ${lcdCondition}, Bodi: ${bodyCondition}`,
    };

    setTimeout(() => {
      onSubmitOrder(newOrder);
      setCreatedOrder(newOrder);
      setIsSubmitting(false);
      setStep(3);
    }, 600);
  };

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-7 transition-all ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      {/* STEP INDICATOR HEADER */}
      <div className="flex items-center justify-between border-b pb-4 mb-6 border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Formulir Penjualan HP Rusak (Rekber Escrow)
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            {step === 1 && 'Langkah 1: Identitas & Kondisi Perangkat'}
            {step === 2 && 'Langkah 2: Konfirmasi Pengajuan Harga & Kurir'}
            {step === 3 && 'Langkah 3: Resi Diterbitkan & Siap Dijemput'}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span
            className={`h-6 w-6 rounded-full flex items-center justify-center font-bold ${
              step >= 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
            }`}
          >
            1
          </span>
          <span className="text-slate-400">&rarr;</span>
          <span
            className={`h-6 w-6 rounded-full flex items-center justify-center font-bold ${
              step >= 2 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
            }`}
          >
            2
          </span>
          <span className="text-slate-400">&rarr;</span>
          <span
            className={`h-6 w-6 rounded-full flex items-center justify-center font-bold ${
              step === 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
            }`}
          >
            3
          </span>
        </div>
      </div>

      {/* STEP 1: FORM INPUT */}
      {step === 1 && (
        <div className="space-y-5 text-xs">
          
          {/* USER INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Nama Lengkap Pengirim
              </label>
              <input
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs outline-none transition-colors ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-emerald-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600 focus:bg-white'
                }`}
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Nomor WhatsApp Aktif
              </label>
              <input
                type="tel"
                placeholder="Contoh: 081234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className={`w-full p-2.5 rounded-xl border text-xs outline-none transition-colors ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-emerald-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600 focus:bg-white'
                }`}
                required
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                Digunakan untuk koordinasi video unboxing saat paket tiba di gudang.
              </span>
            </div>
          </div>

          {/* ADDRESS & LIVE COURIER COVERAGE */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Alamat Lengkap Lokasi Penjemputan
              </label>
              <button
                type="button"
                onClick={handleGetLiveLocation}
                disabled={isLocating}
                className={`text-[10px] px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1 transition-colors ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <MapPin className="h-3 w-3 text-emerald-500" />
                <span>{isLocating ? 'Mendeteksi...' : 'Gunakan GPS'}</span>
              </button>
            </div>

            <textarea
              rows={2}
              placeholder="Contoh: Jl. Rungkut Madya No. 42, Rungkut, Surabaya..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`w-full p-2.5 rounded-xl border text-xs outline-none transition-colors ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-emerald-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600 focus:bg-white'
              }`}
              required
            />

            {address && (
              <div
                className={`mt-2 p-2.5 rounded-xl border text-[11px] flex items-center gap-2 ${
                  isSurabayaArea
                    ? isDark
                      ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : isDark
                    ? 'bg-sky-950/40 border-sky-800/60 text-sky-300'
                    : 'bg-sky-50 border-sky-300 text-sky-800'
                }`}
              >
                <Truck className="h-4 w-4 flex-shrink-0" />
                <span>
                  Layanan Kurir Terdeteksi: <strong>{courierType}</strong>{' '}
                  {isSurabayaArea ? '(Gratis penjemputan langsung tim ZYPHER)' : '(Ekspedisi pengiriman resmi nasional)'}
                </span>
              </div>
            )}
          </div>

          {/* DEVICE MODEL & HARDWARE CONDITIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Pilih Model Gadget Pabrikan
              </label>
              <select
                value={device}
                onChange={(e) => setDevice(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs outline-none font-semibold ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                {MARKET_DEVICES.map((dev) => (
                  <option key={dev} value={dev}>
                    {dev}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Status Mesin Utama
              </label>
              <div
                className={`flex items-center gap-2 p-2.5 rounded-xl border ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
                }`}
              >
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={isDead}
                    onChange={(e) => setIsDead(e.target.checked)}
                    className="w-4 h-4 rounded accent-emerald-500"
                  />
                  <span className={isDead ? 'text-rose-500 dark:text-rose-400 font-bold' : 'text-emerald-600 dark:text-emerald-400'}>
                    {isDead ? 'Kondisi Mesin Mati Total (Matot)' : 'Kondisi Mesin Masih Hidup'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* LCD & BODY CONDITION SELECTORS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Kondisi Layar / LCD
              </label>
              <select
                value={lcdCondition}
                onChange={(e) => setLcdCondition(e.target.value as any)}
                className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="normal">Layar Normal & Tampilan Mulus</option>
                <option value="garis">Garis Vertikal / Shadow Tipis</option>
                <option value="retak">Kaca Depan Retak (Sentuhan Masih Bisa)</option>
                <option value="mati">Layar Blank Hitam / Mati Total</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Kondisi Fisik Bodi
              </label>
              <select
                value={bodyCondition}
                onChange={(e) => setBodyCondition(e.target.value as any)}
                className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="mulus">Mulus (Tanpa Dent Parah)</option>
                <option value="lecet">Lecet Pemakaian Wajar</option>
                <option value="parah">Rusak Berat / Bodi Melengkung</option>
              </select>
            </div>
          </div>

          {/* PHOTO UPLOAD WITH COMPRESSION */}
          <div>
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
              Unggah Foto Bukti Fisik Perangkat (Otomatis Dicompress)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleMultipleImagesUpload}
              className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
            />

            {userPhotos.length > 0 && (
              <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
                {userPhotos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="relative flex-shrink-0 w-16 h-16 rounded-xl border overflow-hidden border-slate-300 dark:border-slate-700"
                  >
                    <img src={photo.preview} alt="Foto HP" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-0 right-0 bg-rose-600 text-white w-5 h-5 flex items-center justify-center font-bold text-xs rounded-bl-lg"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PRICING & REKBER METHOD */}
          <div
            className={`p-4 rounded-xl border space-y-3 ${
              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Pengajuan Harga Jual yang Anda Harapkan (Rp)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                  Rp
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={expectedPrice ? parseInt(expectedPrice, 10).toLocaleString('id-ID') : ''}
                  onChange={(e) => setExpectedPrice(e.target.value.replace(/\D/g, ''))}
                  placeholder="Masukkan nominal harga..."
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border font-mono font-bold text-sm outline-none ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-emerald-400'
                      : 'bg-white border-slate-300 text-emerald-700'
                  }`}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Metode Rekber Rekening Tujuan
                </label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs outline-none font-semibold ${
                    isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="BCA">BCA (Bank Central Asia)</option>
                  <option value="Mandiri">Bank Mandiri</option>
                  <option value="BRI">BRI</option>
                  <option value="BNI">BNI</option>
                  <option value="GoPay">GoPay</option>
                  <option value="DANA">DANA</option>
                  <option value="OVO">OVO</option>
                  <option value="ShopeePay">ShopeePay</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Nomor Rekening / No. E-Wallet
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 8290192819"
                  value={payoutAccount}
                  onChange={(e) => setPayoutAccount(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs outline-none font-mono ${
                    isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!fullName.trim() || !phone.trim() || !address.trim() || !payoutAccount.trim()) {
                alert('Silakan lengkapi nama, nomor telepon, alamat, dan nomor rekening Rekber Anda!');
                return;
              }
              setStep(2);
            }}
            className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
          >
            <span>Lanjutkan ke Konfirmasi Ringkasan</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* STEP 2: SUMMARY & CONFIRMATION */}
      {step === 2 && (
        <div className="space-y-5 text-xs text-center py-2">
          <div>
            <span className="text-[11px] text-slate-500 block uppercase font-mono">Total Pengajuan Harga:</span>
            <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
              Rp {parseInt(expectedPrice || '0', 10).toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Dana ditahan aman dalam sistem Rekber ZYPHER.ID dan dicairkan segera setelah unboxing QC.
            </p>
          </div>

          <div
            className={`text-left p-4 rounded-xl border space-y-2 font-mono text-xs ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <p><strong>Pengirim:</strong> {fullName} ({phone})</p>
            <p><strong>Alamat Jemput:</strong> {address}</p>
            <p><strong>Model Perangkat:</strong> {device} {isDead ? '(Kondisi: Matot)' : '(Kondisi: Hidup)'}</p>
            <p><strong>Kondisi Layar:</strong> {lcdCondition} | <strong>Bodi:</strong> {bodyCondition}</p>
            <p><strong>Layanan Kurir:</strong> {courierType}</p>
            <p><strong>Tujuan Rekber:</strong> {payoutMethod} ({payoutAccount})</p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-3 rounded-xl font-bold text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              &larr; Ubah Data
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="flex-2 py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm active:scale-95"
            >
              {isSubmitting ? 'Menerbitkan Resi...' : 'Terbitkan Resi & Jadwalkan Jemput'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: WAYBILL CREATED & PRINT OPTION */}
      {step === 3 && createdOrder && (
        <div className="space-y-5 text-center py-4">
          <div className="inline-flex h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 items-center justify-center">
            <Check className="h-6 w-6 stroke-[3]" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Resi Pengiriman Berhasil Diterbitkan!
            </h3>
            <p className="font-mono text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {createdOrder.resi}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {createdOrder.courierType === 'Kurir Internal (Free Pickup)'
                ? 'Tim logistik internal ZYPHER.ID akan segera menghubungi WhatsApp Anda untuk penjemputan gratis.'
                : 'Silakan tempelkan lembar resi pada paket dan serahkan ke agen JNE terdekat (Cashless).'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenPrintWaybill(createdOrder)}
              className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 flex items-center justify-center gap-2"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak / Simpan Lembar Waybill</span>
            </button>

            <button
              type="button"
              onClick={onViewOrders}
              className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center gap-2"
            >
              <span>Lihat Status Pesanan Saya</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
