'use client';

import { useState, useEffect } from 'react';

// === FIREBASE IMPORTS ===
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, reload } from 'firebase/auth';
import { getDatabase, ref, set, push, onValue, update } from 'firebase/database';

// 🟢 CONFIG FIREBASE MILIK ANDA
const firebaseConfig = {
  apiKey: "AIzaSyCCRHWu7hfYoEYBBYCIdKkIYo0NY5E22zY",
  authDomain: "zypher-b4b8a.firebaseapp.com",
  databaseURL: "https://zypher-b4b8a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "zypher-b4b8a",
  storageBucket: "zypher-b4b8a.firebasestorage.app",
  messagingSenderId: "993543440943",
  appId: "1:993543440943:web:f67d900d08f67c23a054da"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const database = getDatabase(app); 

// === TYPES ===
type OrderStatus = 'Menunggu Pickup' | 'Tiba di Gudang' | 'Menunggu Persetujuan User' | 'Selesai & Cair' | 'Diretur';
type Triage = 'Belum Disortir' | 'Refurbish' | 'Kanibal' | 'Urban Mining';

type Order = {
  id: string; resi: string; nama: string; alamat: string; device: string;
  estimasiAwal: number; hargaFinal: number; status: OrderStatus; triage: Triage;
  isDead: boolean; lcdCondition: string; bodyCondition: string; photos: string[]; 
  courierType?: string; payoutMethod?: string; payoutAccount?: string; createdAt?: string;
};

type PhotoData = { file: File; preview: string; };
type B2BRequest = { id: string; reqId: string; tipe: string; volume: string; status: string; };

const marketDatabase: string[] = [
  "Poco X3 Pro", "Poco X3 NFC", "Poco X4 Pro / X5 Pro", "Poco F3 / F4 / F5", "Poco M3 / M4 Pro / M5",
  "Xiaomi 13 / 13 Pro", "Xiaomi 12 / 12T", "Xiaomi Redmi Note 12 / 12 Pro", "Xiaomi Redmi Note 10 / 11",
  "iPhone 15 / 15 Pro / 15 Pro Max", "iPhone 14 / 14 Pro / 14 Pro Max", "iPhone 13 / 13 Pro",
  "iPhone 12 / 12 Pro", "iPhone 11 / 11 Pro", "iPhone X / XR / XS", "iPhone 8 / 8 Plus",
  "Samsung Galaxy S23 / S23 Ultra", "Samsung Galaxy S22 / S21", "Samsung Galaxy A54 / A53 / A52",
  "Samsung Galaxy A14 / A13", "Oppo Reno 8 / 10", "Oppo A58 / A78", "Vivo V27 / V29", "Vivo Y36",
  "Realme 10 / 11 Pro", "Realme C55", "Asus ROG Phone 5 / 6 / 7", "MacBook Pro / Air (M1/M2/M3)",
  "Laptop Lenovo / HP / Asus / Acer (Umum)"
];

export default function ZypherSuperApp() {
  const [view, setView] = useState<'home' | 'about' | 'login' | 'register' | 'dashboard'>('home');
  const [role, setRole] = useState<'user' | 'admin' | 'b2b'>('user');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // TOAST NOTIFICATION
  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000); 
  };

  const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1556166513369813018/gJHEJR7jm9Bm0V1bQDZSDrDeGL-QdZSXhvJP_2_m0-YIy6lfVXiqJkt_5AxVqiFPURnU';
  const WA_ADMIN_NUMBER = '6289521430567';

  // State Data
  const [orders, setOrders] = useState<Order[]>([]);
  const [b2bRequests, setB2bRequests] = useState<B2BRequest[]>([]);
  
  const [activeTabAdmin, setActiveTabAdmin] = useState<'qc' | 'inventory'>('qc');
  const [activeTabB2B, setActiveTabB2B] = useState<'katalog' | 'borongan' | 'histori'>('katalog');
  const [activeTabUser, setActiveTabUser] = useState<'kirim' | 'lacak'>('kirim');
  const [step, setStep] = useState(1);
  
  // User Form
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [device, setDevice] = useState('Poco X3 Pro');
  const [isDead, setIsDead] = useState(false);
  const [lcdCondition, setLcdCondition] = useState('normal'); 
  const [bodyCondition, setBodyCondition] = useState('mulus'); 
  const [userPhotos, setUserPhotos] = useState<PhotoData[]>([]);
  const [expectedPrice, setExpectedPrice] = useState(''); 
  const [payoutMethod, setPayoutMethod] = useState('BCA');
  const [payoutAccount, setPayoutAccount] = useState('');
  const [lastResi, setLastResi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verifikasi Email Firebase
  const [isEmailVerifiedStep, setIsEmailVerifiedStep] = useState(false);
  const [registeredUserObj, setRegisteredUserObj] = useState<any>(null);

  // Cek Jangkauan Kurir
  const [checkInput, setCheckInput] = useState('');
  const [checkResult, setCheckResult] = useState<{ type: 'internal' | 'jne' | null; text: string } | null>(null);

  // --- DATABASE LISTENER ---
  useEffect(() => {
    try {
      const ordersRef = ref(database, 'orders');
      onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const parsedOrders = Object.keys(data).map(key => ({ id: key, ...data[key] }));
          setOrders(parsedOrders.reverse()); 
        } else { setOrders([]); }
      });

      const b2bRef = ref(database, 'b2b_requests');
      onValue(b2bRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const parsedB2B = Object.keys(data).map(key => ({ id: key, ...data[key] }));
          setB2bRequests(parsedB2B.reverse());
        } else { setB2bRequests([]); }
      });
    } catch (err) { console.log("Error listener DB"); }
  }, []);

  const hasActiveOrder = orders.some(o => o.status !== 'Selesai & Cair' && o.status !== 'Diretur');

  // --- DISCORD ---
  const sendTextToDiscord = async (textMessage: string) => {
    try { await fetch(DISCORD_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: textMessage }) }); } catch (error) {}
  };

  const sendOrderToDiscordWithPhotos = async (textMessage: string, photos: PhotoData[]) => {
    try {
      const formData = new FormData();
      formData.append('payload_json', JSON.stringify({ content: textMessage }));
      photos.forEach((photo, index) => { formData.append(`file${index}`, photo.file, photo.file.name); });
      await fetch(DISCORD_WEBHOOK_URL, { method: 'POST', body: formData });
    } catch (error) {}
  };

  // --- UPLOAD FOTO ---
  const handleMultipleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      showToast("Mengunggah lampiran foto...");
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new window.Image();
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 400; 
              const scaleSize = MAX_WIDTH / img.width;
              canvas.width = MAX_WIDTH;
              canvas.height = img.height * scaleSize;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
              
              const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5);
              setUserPhotos((prev) => [...prev, { file: file, preview: compressedBase64 }]);
              showToast("Foto berhasil dilampirkan.");
            } catch (err) { showToast("Gagal memproses foto."); }
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => { setUserPhotos(userPhotos.filter((_, i) => i !== index)); };

  // --- AUTH & FIREBASE EMAIL VERIFICATION ---
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (password.length < 6) { setLoginError('Password minimal 6 karakter.'); return; }
    try {
      showToast("Memproses pendaftaran akun...");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      
      setRegisteredUserObj(userCredential.user);
      setIsEmailVerifiedStep(true);
      sendTextToDiscord(`[AUTH] Link verifikasi email dikirim ke: ${email}`);
      showToast('Tautan verifikasi telah dikirim ke email Anda.');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') setLoginError('Email sudah terdaftar dalam sistem.');
      else setLoginError(`Gagal: ${error.message}`);
    }
  };

  const handleCheckEmailVerificationStatus = async () => {
    if (!registeredUserObj) return;
    try {
      await reload(registeredUserObj);
      if (registeredUserObj.emailVerified) {
        showToast("Verifikasi berhasil. Silakan masuk.");
        setView('login');
        setIsEmailVerifiedStep(false);
        setPassword('');
      } else {
        showToast("Email belum diverifikasi. Periksa kembali tautan masuk.");
      }
    } catch (err) {
      showToast("Gagal memeriksa status verifikasi.");
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const lowerEmail = email.toLowerCase().trim();

    if (lowerEmail === 'admin@zypher.id' || lowerEmail.includes('admin')) {
      if (password === 'admin123' || password === 'ZYPHER27') {
        setRole('admin'); setView('dashboard'); showToast('Sesi Administrator Aktif');
      } else { setLoginError('Kata sandi administrator keliru.'); }
    } else if (lowerEmail.includes('b2b') || lowerEmail.includes('mitra')) {
      if (password === 'mitra123') {
        setRole('b2b'); setView('dashboard'); showToast('Sesi Mitra B2B Aktif');
      } else { setLoginError('Kata sandi mitra keliru.'); }
    } else {
      try {
        showToast("Autentikasi...");
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        
        if (!userCred.user.emailVerified) {
          setLoginError('Harap verifikasi email Anda terlebih dahulu.');
          return;
        }

        setRole('user'); setView('dashboard'); showToast('Masuk Berhasil');
      } catch (error) { setLoginError('Email atau kata sandi tidak valid.'); }
    }
  };

  const handleForgotPassword = async () => {
    if (!email) { setLoginError('Masukkan email Anda di kolom atas.'); return; }
    try {
      showToast("Mengirim instruksi pemulihan...");
      await sendPasswordResetEmail(auth, email);
      showToast("Tautan pemulihan kata sandi telah dikirim.");
      setLoginError('');
    } catch (error: any) { setLoginError(`Gagal: ${error.message}`); }
  };

  const handleCheckCoverage = () => {
    const query = checkInput.toLowerCase().trim();
    if (!query) {
      setCheckResult({ type: null, text: "Masukkan nama kota tujuan." });
      return;
    }

    if (query.includes('surabaya') || query.includes('sby')) {
      setCheckResult({
        type: 'internal',
        text: "Wilayah Surabaya terdeteksi: Layanan Free Pickup langsung oleh kurir internal Zypher aktif."
      });
    } else {
      setCheckResult({
        type: 'jne',
        text: `Wilayah ${checkInput.toUpperCase()} terdeteksi: Menggunakan logistik mitra ekspedisi JNE Cashless bersubsidi.`
      });
    }
  };

  const handleGetLiveLocation = () => {
    if (!navigator.geolocation) {
      return showToast("Perangkat tidak mendukung geolokasi.");
    }

    setIsLocating(true);
    showToast("Mengakses lokasi perangkat...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          const data = await response.json();

          if (data && data.display_name) {
            setAddress(data.display_name);
            showToast("Lokasi berhasil disematkan.");
          } else {
            setAddress("Jl. Pemuda No. 15, Genteng, Surabaya");
            showToast("Lokasi default Surabaya diterapkan.");
          }
        } catch (err) {
          setAddress("Jl. Raya Darmo No. 42, Wonokromo, Surabaya");
          showToast("Lokasi default Surabaya diterapkan.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        setAddress("Jl. Tunjungan No. 25, Genteng, Surabaya");
        showToast("Akses GPS dibatasi, menerapkan alamat standar.");
      },
      { timeout: 8000 }
    );
  };

  const [isLocating, setIsLocating] = useState(false);

  const handleNextStep = () => {
    if (!fullName || !address || !expectedPrice || !payoutAccount || userPhotos.length === 0) {
      return showToast("Lengkapi form, metode pencairan, dan foto bukti.");
    }
    setStep(2);
  };

  const handleCheckout = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    showToast("Mendaftarkan pesanan...");

    const newResi = 'ZYP' + Math.floor(100000 + Math.random() * 900000);
    const isSurabaya = address.toLowerCase().includes('surabaya') || address.toLowerCase().includes('sby');
    const assignedCourier = isSurabaya ? 'Kurir Internal Zypher (Free Pickup)' : 'JNE Cashless Express';

    setLastResi(newResi);
    const hargaInt = parseInt(expectedPrice) || 0;

    try {
      const compressedPhotosData = userPhotos.map(photo => photo.preview);
      const orderData = {
        resi: newResi, nama: fullName, alamat: address, device: device,
        estimasiAwal: hargaInt, hargaFinal: 0, status: 'Menunggu Pickup', triage: 'Belum Disortir',
        isDead: isDead, lcdCondition: lcdCondition, bodyCondition: bodyCondition,
        photos: compressedPhotosData, courierType: assignedCourier, 
        payoutMethod: payoutMethod, payoutAccount: payoutAccount, createdAt: new Date().toISOString()
      };

      const newOrderRef = push(ref(database, 'orders'));
      await set(newOrderRef, orderData);

      const reportMessage = `[ORDER] Resi: ${newResi} | Pengirim: ${fullName} | Kurir: ${assignedCourier}`;
      await sendOrderToDiscordWithPhotos(reportMessage, userPhotos);

      showToast("Pesanan berhasil dibuat.");
      setStep(3);
    } catch (error: any) { showToast("Gagal menyimpan ke pangkalan data."); } 
    finally { setIsSubmitting(false); }
  };

  const updateOrderStatus = async (dbKey: string, newStatus: string, triageVal?: string) => {
    try {
      const updateData: any = { status: newStatus };
      if (triageVal) updateData.triage = triageVal;
      await update(ref(database, `orders/${dbKey}`), updateData);
      showToast(`Status: ${newStatus}`);
    } catch (error) { showToast("Gagal memperbarui status."); }
  };

  const handleBarangTiba = (dbKey: string) => {
    updateOrderStatus(dbKey, 'Tiba di Gudang');
  };

  const handleDownloadWaybillPDF = () => {
    window.print();
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(`Halo Admin Zypher,\nKonfirmasi pencairan Rekber:\nNama: ${fullName}\nResi: ${lastResi}`);
    window.open(`https://wa.me/${WA_ADMIN_NUMBER}?text=${message}`, '_blank');
  };

  const trackingSteps = [
    { label: 'Pickup', valid: ['Menunggu Pickup', 'Tiba di Gudang', 'Menunggu Persetujuan User', 'Selesai & Cair', 'Diretur'] },
    { label: 'Gudang', valid: ['Tiba di Gudang', 'Menunggu Persetujuan User', 'Selesai & Cair', 'Diretur'] },
    { label: 'QC', valid: ['Menunggu Persetujuan User', 'Selesai & Cair', 'Diretur'] },
    { label: 'Selesai', valid: ['Selesai & Cair', 'Diretur'] }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-slate-700 pb-12 overflow-x-hidden">
      
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] bg-slate-900 text-slate-100 px-5 py-2.5 rounded-lg shadow-xl border border-slate-700 font-medium text-xs tracking-wide text-center w-[90%] max-w-sm pointer-events-none transition-all">
          {toastMsg}
        </div>
      )}

      {/* NAVBAR */}
      <nav className="relative z-50 flex-shrink-0 w-full px-6 py-4 flex justify-between items-center bg-slate-900 border-b border-slate-800">
        <button type="button" onClick={() => setView('home')} className="text-lg font-bold tracking-wider text-slate-100 focus:outline-none touch-manipulation">
          ZYPHER<span className="text-slate-400 font-light">.LOGISTICS</span>
        </button>

        <div className="flex items-center gap-2">
          {view !== 'dashboard' ? (
            <>
              <button type="button" onClick={() => setView('home')} className={`text-xs px-3 py-1.5 rounded font-medium transition-colors touch-manipulation ${view === 'home' ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-slate-200'}`}>Beranda</button>
              <button type="button" onClick={() => setView('about')} className={`text-xs px-3 py-1.5 rounded font-medium transition-colors touch-manipulation ${view === 'about' ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-slate-200'}`}>Tentang</button>
              <button type="button" onClick={() => setView('login')} className="bg-slate-100 text-slate-950 text-xs font-semibold px-4 py-1.5 rounded shadow-sm touch-manipulation active:scale-95 ml-1">Masuk</button>
            </>
          ) : (
            <button type="button" onClick={() => { setView('home'); setEmail(''); setPassword(''); }} className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900/50 px-3 py-1.5 rounded font-medium touch-manipulation active:scale-95">
              Keluar Sesi
            </button>
          )}
        </div>
      </nav>

      <main className="relative z-10 flex-grow w-full max-w-md mx-auto mt-6 px-4">
        
        {view === 'home' && (
          <div className="space-y-6 mt-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
              <span className="inline-block bg-slate-800 text-slate-300 text-[10px] font-mono uppercase px-2.5 py-1 rounded">
                Sistem Logistik E-Waste B3
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-slate-100">
                Pengelolaan & Daur Ulang Perangkat Elektronik Terpadu
              </h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Platform logistik hibrid berstandar B3 dengan sistem Rekening Bersama (Rekber) transparan untuk masyarakat dan korporasi.
              </p>
              <div className="pt-2">
                <button type="button" onClick={() => setView('login')} className="w-full py-3 rounded-lg font-semibold text-xs text-slate-950 bg-slate-100 shadow touch-manipulation active:scale-95 transition-all">
                  Akses Layanan Pengiriman
                </button>
              </div>
            </div>

            {/* CEK JANGKAUAN KURIR */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Cek Wilayah Operasional</h3>
              <div className="flex gap-2">
                <input type="text" placeholder="Masukkan Kota (Cth: Surabaya)" value={checkInput} onChange={(e) => setCheckInput(e.target.value)} className="w-full bg-slate-950 px-3 py-2.5 rounded-lg border border-slate-800 text-xs text-slate-200 outline-none focus:border-slate-600" />
                <button onClick={handleCheckCoverage} className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 rounded-lg text-xs font-medium touch-manipulation">Periksa</button>
              </div>
              {checkResult && (
                <div className="p-3 rounded-lg border text-xs leading-relaxed bg-slate-950 border-slate-800 text-slate-300">
                  {checkResult.text}
                </div>
              )}
            </div>

            {/* PANDUAN BAHAYA B3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Standar Pengelolaan Limbah B3</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Komponen seperti baterai litium dan papan sirkuit mengandung bahan berbahaya. Daur ulang profesional mencegah kontaminasi tanah dan mengembalikan elemen bernilai tinggi ke siklus industri.
              </p>
            </div>
          </div>
        )}

        {view === 'about' && (
          <div className="space-y-6 text-center mt-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-3">
              <h2 className="text-lg font-bold text-slate-100">Tentang Zypher</h2>
              <p className="text-xs text-slate-400 leading-relaxed text-left">
                Zypher menghubungkan pemilik perangkat bekas dengan fasilitas pengolahan resmi. Didukung manajemen status pesanan real-time, pencairan dana Rekber terverifikasi, dan pelacakan kurir terpadu.
              </p>
            </div>
            <button type="button" onClick={() => setView('login')} className="w-full py-3 rounded-lg text-xs font-semibold text-slate-950 bg-slate-100 active:scale-95 touch-manipulation transition-all">
              Mulai Masuk Sistem
            </button>
          </div>
        )}

        {view === 'login' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm mt-6 space-y-4">
            <h2 className="text-base font-bold text-slate-100 text-center">Masuk ke Sistem</h2>
            {loginError && <div className="bg-rose-950/40 border border-rose-900/50 text-rose-300 text-xs p-3 rounded-lg text-center font-medium">{loginError}</div>}
            <form onSubmit={handleLoginSubmit} className="space-y-3 relative z-20">
              <div><input type="email" placeholder="Alamat Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-slate-200 outline-none text-xs focus:border-slate-600" required /></div>
              <div><input type="password" placeholder="Kata Sandi" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-slate-200 outline-none text-xs focus:border-slate-600" required /></div>
              
              <div className="flex justify-end">
                <button type="button" onClick={handleForgotPassword} className="text-[10px] text-slate-400 hover:text-slate-200 font-medium touch-manipulation">
                  Lupa kata sandi?
                </button>
              </div>

              <button type="submit" className="w-full py-3 rounded-lg font-semibold bg-slate-100 text-slate-950 text-xs shadow-sm touch-manipulation active:scale-95 transition-all">Masuk</button>
            </form>
            <div className="pt-2 text-center">
              <button type="button" onClick={() => { setView('register'); setLoginError(''); setIsEmailVerifiedStep(false); }} className="text-xs text-slate-400 hover:text-slate-200 font-medium p-1 touch-manipulation">Belum memiliki akun? Daftar</button>
            </div>
          </div>
        )}

        {/* HALAMAN REGISTER DENGAN VERIFIKASI EMAIL */}
        {view === 'register' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm mt-6 space-y-4">
            <h2 className="text-base font-bold text-slate-100 text-center">Pendaftaran Akun</h2>
            
            {loginError && <div className="bg-rose-950/40 border border-rose-900/50 text-rose-300 text-xs p-3 rounded-lg text-center font-medium">{loginError}</div>}

            {!isEmailVerifiedStep ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-3 relative z-20">
                <div><input type="email" placeholder="Alamat Email Aktif" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-slate-200 outline-none text-xs focus:border-slate-600" required /></div>
                <div><input type="password" placeholder="Kata Sandi (Min. 6 Karakter)" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-slate-200 outline-none text-xs focus:border-slate-600" required /></div>
                <button type="submit" className="w-full py-3 rounded-lg font-semibold text-slate-950 bg-slate-100 text-xs shadow-sm touch-manipulation active:scale-95 transition-all">Kirim Tautan Verifikasi</button>
              </form>
            ) : (
              <div className="text-center space-y-3 py-2">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tautan verifikasi telah dikirim ke <strong>{email}</strong>. Silakan periksa kotak masuk atau folder spam Anda.
                </p>
                <button 
                  type="button" 
                  onClick={handleCheckEmailVerificationStatus} 
                  className="w-full py-2.5 rounded-lg font-semibold text-xs bg-slate-800 text-slate-200 border border-slate-700 active:scale-95 touch-manipulation transition-all"
                >
                  Periksa Status Verifikasi
                </button>
                <button type="button" onClick={() => setIsEmailVerifiedStep(false)} className="text-[11px] text-slate-400 hover:text-slate-200 pt-1">Ganti Alamat Email</button>
              </div>
            )}

            <div className="pt-2 text-center">
              <button type="button" onClick={() => { setView('login'); setLoginError(''); }} className="text-xs text-slate-400 hover:text-slate-200 font-medium p-1 touch-manipulation">Sudah memiliki akun? Masuk</button>
            </div>
          </div>
        )}

        {/* DASHBOARD USER */}
        {view === 'dashboard' && (
          <div>
            {role === 'user' && (
              <div>
                <div className="flex bg-slate-900 rounded-lg p-1 mb-6 border border-slate-800">
                  <button type="button" onClick={() => setActiveTabUser('kirim')} className={`flex-1 py-2 rounded text-xs font-semibold touch-manipulation transition-colors ${activeTabUser === 'kirim' ? 'bg-slate-800 text-slate-100' : 'text-slate-400'}`}>Form Pengiriman</button>
                  <button type="button" onClick={() => setActiveTabUser('lacak')} className={`flex-1 py-2 rounded text-xs font-semibold touch-manipulation transition-colors ${activeTabUser === 'lacak' ? 'bg-slate-800 text-slate-100' : 'text-slate-400'}`}>Status Pesanan</button>
                </div>

                {activeTabUser === 'kirim' && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative z-20 space-y-4">
                    
                    {step === 1 && hasActiveOrder ? (
                      <div className="text-center py-6 space-y-3">
                        <h2 className="text-sm font-bold text-slate-200">Pengiriman Sedang Berjalan</h2>
                        <p className="text-xs text-slate-400">Anda memiliki pesanan aktif yang belum diselesaikan.</p>
                        <button type="button" onClick={() => setActiveTabUser('lacak')} className="w-full bg-slate-800 text-slate-200 border border-slate-700 py-3 rounded-lg font-medium text-xs touch-manipulation">
                          Buka Halaman Status
                        </button>
                      </div>
                    ) : step === 1 && !hasActiveOrder ? (
                      <div className="space-y-4">
                        <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">Formulir Data Perangkat</h2>
                        
                        <div className="space-y-3 bg-slate-950 p-3.5 rounded-lg border border-slate-800/80">
                          <div>
                            <label className="text-[11px] text-slate-400 mb-1 block">Nama Lengkap Pengirim</label>
                            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-slate-900 px-3 py-2.5 rounded border border-slate-800 text-xs text-slate-200 outline-none focus:border-slate-600" required />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-[11px] text-slate-400">Alamat Lengkap Tujuan Jemput</label>
                              <button 
                                type="button" 
                                onClick={handleGetLiveLocation} 
                                disabled={isLocating}
                                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700 font-medium touch-manipulation"
                              >
                                {isLocating ? 'Mendeteksi...' : 'Gunakan GPS'}
                              </button>
                            </div>

                            <textarea 
                              value={address} 
                              onChange={(e) => setAddress(e.target.value)} 
                              rows={2} 
                              placeholder="Ketik alamat atau gunakan GPS..." 
                              className="w-full bg-slate-900 px-3 py-2.5 rounded border border-slate-800 text-xs text-slate-200 outline-none focus:border-slate-600" 
                              required 
                            />
                            <p className="text-[10px] text-slate-500 mt-1">Catatan: Alamat memuat kota asal untuk penentuan kurir otomatis.</p>
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 mb-1 block">Pilih Model Perangkat Pabrik</label>
                          <select className="w-full bg-slate-950 px-3 py-2.5 rounded-lg border border-slate-800 text-xs text-slate-200 outline-none font-medium focus:border-slate-600" value={device} onChange={(e) => setDevice(e.target.value)}>
                            {marketDatabase.map((model) => (
                              <option key={model} value={model}>{model}</option>
                            ))}
                          </select>
                        </div>

                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                          <label className="flex items-center space-x-2.5 text-xs cursor-pointer touch-manipulation">
                            <input type="checkbox" checked={isDead} onChange={(e) => setIsDead(e.target.checked)} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-slate-600 focus:ring-0" />
                            <span className="font-medium text-slate-300">Kondisi Mesin Mati Total (Matot)</span>
                          </label>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] text-slate-400 mb-1 block">Kondisi Layar</label>
                            <select className="w-full bg-slate-950 px-3 py-2.5 rounded-lg border border-slate-800 text-xs text-slate-200 outline-none focus:border-slate-600" value={lcdCondition} onChange={(e) => setLcdCondition(e.target.value)}>
                              <option value="normal">Normal / Mulus</option>
                              <option value="garis">Garis / Shadow</option>
                              <option value="retak">Retak Fisik</option>
                              <option value="mati">Mati Total</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-400 mb-1 block">Kondisi Bodi</label>
                            <select className="w-full bg-slate-950 px-3 py-2.5 rounded-lg border border-slate-800 text-xs text-slate-200 outline-none focus:border-slate-600" value={bodyCondition} onChange={(e) => setBodyCondition(e.target.value)}>
                              <option value="mulus">Mulus</option>
                              <option value="lecet">Lecet Pemakaian</option>
                              <option value="parah">Rusak Berat</option>
                            </select>
                          </div>
                        </div>

                        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80">
                          <label className="text-[11px] text-slate-400 mb-1.5 block">Unggah Foto Fisik Perangkat</label>
                          <input type="file" accept="image/*" multiple onChange={handleMultipleImagesUpload} className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700" />
                          
                          {userPhotos.length > 0 && (
                            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                              {userPhotos.map((photo, idx) => (
                                <div key={idx} className="relative flex-shrink-0 w-14 h-14 border border-slate-700 rounded overflow-hidden">
                                  <img src={photo.preview} alt="Bukti" className="w-full h-full object-cover" />
                                  <button type="button" onClick={() => removePhoto(idx)} className="absolute top-0 right-0 bg-rose-900 text-white w-5 h-5 flex items-center justify-center font-bold text-[10px] rounded-bl touch-manipulation">×</button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* INPUT HARGA MANUAL & REKBER */}
                        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80 space-y-3">
                          <label className="text-[11px] text-slate-300 font-semibold block">Pengajuan Harga Jual & Rekening Rekber</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">Rp</span>
                            <input 
                              type="text" 
                              inputMode="numeric"
                              pattern="[0-9]*"
                              placeholder="Masukkan nominal harga..." 
                              value={expectedPrice ? parseInt(expectedPrice).toLocaleString('id-ID') : ''} 
                              onChange={(e) => setExpectedPrice(e.target.value.replace(/\D/g, ''))} 
                              className="w-full bg-slate-900 px-3 py-2.5 pl-9 rounded border border-slate-800 text-xs font-semibold text-slate-200 outline-none focus:border-slate-600" 
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <div>
                              <label className="text-[10px] text-slate-400 mb-1 block">Metode Rekber</label>
                              <select className="w-full bg-slate-900 px-2.5 py-2 rounded border border-slate-800 text-xs text-slate-200 outline-none font-medium" value={payoutMethod} onChange={(e) => setPayoutMethod(e.target.value)}>
                                <option value="BCA">BCA</option>
                                <option value="Mandiri">Mandiri</option>
                                <option value="GoPay">GoPay</option>
                                <option value="OVO">OVO</option>
                                <option value="DANA">DANA</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 mb-1 block">Nomor Rekening / No HP</label>
                              <input type="text" placeholder="No. Rek / HP" value={payoutAccount} onChange={(e) => setPayoutAccount(e.target.value)} className="w-full bg-slate-900 px-2.5 py-2 rounded border border-slate-800 text-xs text-slate-200 outline-none" required />
                            </div>
                          </div>
                        </div>

                        <button type="button" onClick={handleNextStep} className="w-full py-3 rounded-lg font-semibold text-xs bg-slate-100 text-slate-950 active:scale-95 touch-manipulation transition-all">Lanjutkan Konfirmasi</button>
                      </div>
                    ) : null}

                    {step === 2 && (
                      <div className="text-center space-y-5 py-2">
                        <p className="text-xs text-slate-400">Ringkasan Pengajuan Harga:</p>
                        <h3 className="text-3xl font-bold text-slate-100">Rp {parseInt(expectedPrice || '0').toLocaleString('id-ID')}</h3>
                        <div className="bg-slate-950 text-left p-3.5 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1.5">
                          <p><strong>Pengirim:</strong> {fullName}</p>
                          <p><strong>Model:</strong> {device} {isDead ? '(Matot)' : ''}</p>
                          <p><strong>Rekber:</strong> {payoutMethod} - {payoutAccount}</p>
                          <p><strong>Kurir:</strong> {address.toLowerCase().includes('surabaya') || address.toLowerCase().includes('sby') ? 'Kurir Internal (Free Pickup)' : 'JNE Cashless'}</p>
                        </div>
                        <button type="button" onClick={handleCheckout} disabled={isSubmitting} className={`w-full py-3 rounded-lg font-semibold text-xs active:scale-95 touch-manipulation transition-all ${isSubmitting ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-950'}`}>
                          {isSubmitting ? 'Memproses...' : 'Terbitkan Resi & Kirim'}
                        </button>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="text-center space-y-5 py-2">
                        <div id="waybill-print-area" className="bg-white text-slate-950 p-5 rounded-lg max-w-[300px] mx-auto border border-slate-300 text-left shadow-sm">
                          <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-3">
                            <h2 className="text-sm font-bold tracking-wider">ZYPHER WAYBILL</h2>
                            <span className="text-[9px] bg-slate-950 text-slate-50 px-2 py-0.5 rounded font-mono font-bold">REKBER</span>
                          </div>
                          <p className="font-mono text-base font-bold tracking-widest bg-slate-100 py-1.5 text-center rounded mb-3 text-slate-950">{lastResi}</p>
                          <div className="text-[11px] space-y-1 text-slate-700">
                            <p><strong>Pengirim:</strong> {fullName}</p>
                            <p><strong>Tujuan:</strong> Gudang Pusat B3</p>
                            <p><strong>Rekber:</strong> {payoutMethod} ({payoutAccount})</p>
                            <p><strong>Estimasi:</strong> Rp {parseInt(expectedPrice || '0').toLocaleString('id-ID')}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <button type="button" onClick={handleDownloadWaybillPDF} className="w-full bg-slate-800 text-slate-200 border border-slate-700 py-2.5 rounded-lg font-semibold text-xs active:scale-95 touch-manipulation">
                            Cetak / Unduh Lembar Waybill
                          </button>
                          <button type="button" onClick={() => { setView('dashboard'); setActiveTabUser('lacak'); setStep(1); }} className="w-full bg-slate-100 text-slate-950 py-2.5 rounded-lg font-semibold text-xs active:scale-95 touch-manipulation">
                            Periksa Status Pengiriman
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTabUser === 'lacak' && (
                  <div className="space-y-3">
                    {orders.length === 0 ? <p className="text-center text-slate-500 text-xs mt-10">Belum ada riwayat pengiriman.</p> : orders.map(order => (
                      <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                          <span className="text-xs font-mono font-bold text-slate-200">{order.resi}</span>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">{order.status}</span>
                        </div>
                        
                        <div className="text-[11px] text-slate-400 space-y-0.5">
                          <p>Kurir: <span className="text-slate-200 font-medium">{order.courierType}</span></p>
                          <p>Rekber: <span className="text-slate-200 font-medium">{order.payoutMethod} ({order.payoutAccount})</span></p>
                          <p>Harga: <span className="text-emerald-400 font-semibold">Rp {order.estimasiAwal.toLocaleString('id-ID')}</span></p>
                        </div>

                        <div className="flex justify-between items-center px-1 pt-1">
                          {trackingSteps.map((stepItem, idx) => {
                            const isActive = stepItem.valid.includes(order.status);
                            return (
                              <div key={idx} className="flex flex-col items-center">
                                <div className={`w-3 h-3 rounded-full mb-1 ${isActive ? 'bg-slate-100' : 'bg-slate-800'}`}></div>
                                <span className={`text-[9px] ${isActive ? 'text-slate-200 font-medium' : 'text-slate-600'}`}>{stepItem.label}</span>
                              </div>
                            )
                          })}
                        </div>

                        {order.status === 'Menunggu Persetujuan User' && (
                          <div className="pt-2">
                            <button type="button" onClick={openWhatsApp} className="w-full bg-emerald-950/40 border border-emerald-900/60 text-emerald-300 py-2.5 rounded-lg font-semibold text-xs active:scale-95 touch-manipulation">
                              Konfirmasi Pencairan via WhatsApp
                            </button>
                          </div>
                        )}
                        {order.status === 'Selesai & Cair' && (
                          <div className="text-center text-[11px] font-semibold text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 p-2 rounded">
                            Transaksi Selesai & Dana Ditransfer.
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PORTAL ADMIN */}
            {role === 'admin' && (
              <div className="space-y-4">
                <div className="flex bg-slate-900 rounded-lg p-1 mb-4 border border-slate-800">
                  <button type="button" onClick={() => setActiveTabAdmin('qc')} className={`flex-1 py-2 rounded text-xs font-semibold touch-manipulation ${activeTabAdmin === 'qc' ? 'bg-slate-800 text-slate-100' : 'text-slate-400'}`}>Verifikasi QC</button>
                  <button type="button" onClick={() => setActiveTabAdmin('inventory')} className={`flex-1 py-2 rounded text-xs font-semibold touch-manipulation ${activeTabAdmin === 'inventory' ? 'bg-slate-800 text-slate-100' : 'text-slate-400'}`}>Inventaris</button>
                </div>

                {activeTabAdmin === 'qc' && (
                  <div className="space-y-3">
                    {orders.filter(o => ['Menunggu Pickup', 'Tiba di Gudang', 'Menunggu Persetujuan User'].includes(o.status)).length === 0 ? (
                      <p className="text-center text-slate-500 text-xs mt-10">Tidak ada antrean verifikasi.</p>
                    ) : (
                      orders.filter(o => ['Menunggu Pickup', 'Tiba di Gudang', 'Menunggu Persetujuan User'].includes(o.status)).map(order => (
                      <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <p className="font-mono text-xs font-bold text-slate-200">{order.resi}</p>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">{order.status}</span>
                        </div>

                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] space-y-1 text-slate-300">
                          <p><strong>Pengirim:</strong> {order.nama}</p>
                          <p><strong>Alamat:</strong> {order.alamat}</p>
                          <p><strong>Rekber:</strong> {order.payoutMethod} - {order.payoutAccount}</p>
                          <p><strong>Perangkat:</strong> {order.device}</p>
                          <p><strong>Harga Diminta:</strong> Rp {order.estimasiAwal.toLocaleString()}</p>
                        </div>

                        {order.photos && order.photos.length > 0 && (
                          <div className="flex gap-2 overflow-x-auto pb-1">
                            {order.photos.map((photoUrl, idx) => (
                              <img key={idx} src={photoUrl} alt="Bukti" className="h-14 w-14 object-cover rounded border border-slate-800" />
                            ))}
                          </div>
                        )}

                        <div>
                          {order.status === 'Menunggu Pickup' && (
                            <button type="button" onClick={() => handleBarangTiba(order.id)} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 py-2.5 rounded-lg font-semibold text-xs touch-manipulation">
                              Konfirmasi Barang Tiba di Gudang
                            </button>
                          )}
                          {order.status === 'Tiba di Gudang' && (
                            <div className="space-y-2">
                              <select className="w-full p-2.5 text-xs rounded bg-slate-950 border border-slate-800 text-slate-200 outline-none" id={`triage-${order.id}`}>
                                <option value="Refurbish">Kategori: Refurbish</option>
                                <option value="Kanibal">Kategori: Kanibal Suku Cadang</option>
                                <option value="Urban Mining">Kategori: Urban Mining B3</option>
                              </select>
                              <button type="button" onClick={() => updateOrderStatus(order.id, 'Menunggu Persetujuan User', (document.getElementById(`triage-${order.id}`) as HTMLSelectElement).value)} className="w-full bg-slate-100 text-slate-950 py-2.5 rounded-lg font-semibold text-xs touch-manipulation">
                                Setujui Kategori & Lanjut Rekber
                              </button>
                            </div>
                          )}
                          {order.status === 'Menunggu Persetujuan User' && (
                            <button type="button" onClick={() => updateOrderStatus(order.id, 'Selesai & Cair')} className="w-full bg-emerald-950/60 border border-emerald-900 text-emerald-300 py-2.5 rounded-lg font-semibold text-xs touch-manipulation">
                              Konfirmasi Transfer Rekber ({order.payoutMethod})
                            </button>
                          )}
                        </div>
                      </div>
                    )))}
                  </div>
                )}
                
                {activeTabAdmin === 'inventory' && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                    <h3 className="text-slate-300 font-semibold mb-2">Daftar Inventaris Masuk</h3>
                    {orders.filter(o => o.triage !== 'Belum Disortir').map(order => (
                      <div key={order.id} className="flex justify-between border-b border-slate-800 pb-2 text-[11px]">
                        <span className="text-slate-300">{order.device}</span>
                        <span className="text-slate-400 font-mono">{order.triage}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PORTAL B2B */}
            {role === 'b2b' && (
              <div className="space-y-4">
                <div className="flex bg-slate-900 rounded-lg p-1 mb-4 border border-slate-800">
                  <button type="button" onClick={() => setActiveTabB2B('katalog')} className={`flex-1 py-2 rounded text-xs font-semibold touch-manipulation ${activeTabB2B === 'katalog' ? 'bg-slate-800 text-slate-100' : 'text-slate-400'}`}>Katalog Komponen</button>
                  <button type="button" onClick={() => setActiveTabB2B('borongan')} className={`flex-1 py-2 rounded text-xs font-semibold touch-manipulation ${activeTabB2B === 'borongan' ? 'bg-slate-800 text-slate-100' : 'text-slate-400'}`}>Pengajuan Borongan</button>
                </div>

                {activeTabB2B === 'katalog' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-2">
                      <h4 className="font-semibold text-xs text-slate-200">Modul Kamera Set</h4>
                      <p className="text-emerald-400 font-bold text-xs">Rp 350.000</p>
                      <button type="button" onClick={() => showToast("Permintaan komponen dicatat.")} className="w-full bg-slate-800 text-slate-200 border border-slate-700 py-1.5 rounded text-[11px] font-medium touch-manipulation">Pesan</button>
                    </div>
                  </div>
                )}

                {activeTabB2B === 'borongan' && (
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
                    <select className="w-full bg-slate-950 p-2.5 rounded border border-slate-800 text-xs text-slate-200 outline-none" id="b2b-type">
                      <option value="PCB Campur">Material: PCB Campur</option>
                      <option value="Baterai Lithium">Material: Baterai Lithium Borongan</option>
                    </select>
                    <input type="text" inputMode="numeric" placeholder="Total Volume (Kg)" className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none" />
                    <button type="button" onClick={() => showToast("Pengajuan borongan dikirim.")} className="w-full bg-slate-100 text-slate-950 py-2.5 rounded font-semibold text-xs touch-manipulation">Ajukan Mitra Korporasi</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}