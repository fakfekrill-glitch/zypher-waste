'use client';

import React, { useState, useEffect } from 'react';
import { ThemeMode, UserRole, Order, B2BRequest, B2BCatalogItem } from './types';
import { ZypherBackendService } from './lib/firebaseService';
import { Navbar } from './components/Navbar';
import { CircularFlowHero } from './components/CircularFlowHero';
import { UserShipmentForm } from './components/UserShipmentForm';
import { UserTrackingView } from './components/UserTrackingView';
import { B2BPortal } from './components/B2BPortal';
import { AdminQCView } from './components/AdminQCView';
import { B2BLoginGateway } from './components/B2BLoginGateway';
import { AdminLoginGateway } from './components/AdminLoginGateway';
import { WaybillPrintModal } from './components/WaybillPrintModal';
import { EscrowReceiptModal } from './components/EscrowReceiptModal';
import {
  Smartphone,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogIn,
  Mail,
  Lock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function ZypherApp() {
  // THEME: Default to 'light' as requested by user
  const [theme, setTheme] = useState<ThemeMode>('light');

  // VIEW NAVIGATION
  const [view, setView] = useState<'app' | 'about' | 'auth'>('app');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('user');

  // USER INNER TABS
  const [userTab, setUserTab] = useState<'kirim' | 'lacak'>('kirim');

  // DATA STATES
  const [orders, setOrders] = useState<Order[]>([]);
  const [b2bRequests, setB2bRequests] = useState<B2BRequest[]>([]);
  const [catalogItems, setCatalogItems] = useState<B2BCatalogItem[]>([]);

  // MODAL & PRINT
  const [printOrder, setPrintOrder] = useState<Order | null>(null);
  const [escrowReceiptOrder, setEscrowReceiptOrder] = useState<Order | null>(null);

  // AUTH SESSION & FORM STATES
  const [session, setSession] = useState<{
    role: UserRole;
    email: string;
    name: string;
  } | null>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // TOAST NOTIFICATION
  const [toastMsg, setToastMsg] = useState<string>('');
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // INITIAL LOAD
  useEffect(() => {
    document.title = 'ZYPHER.ID — Ekosistem Sirkular E-Waste & Kanibalan Suku Cadang';

    // Load theme from localStorage if available
    try {
      const savedTheme = localStorage.getItem('zypher_theme_mode') as ThemeMode;
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch {}

    // Load active session from localStorage if available
    try {
      const savedSession = localStorage.getItem('zypher_user_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        setSession(parsed);
      }
    } catch {}

    // Load initial orders, b2b requests, and catalog
    setOrders(ZypherBackendService.getCachedOrders());
    setB2bRequests(ZypherBackendService.getCachedB2BRequests());
    setCatalogItems(ZypherBackendService.getCachedCatalog());
  }, []);

  // SYNC DARK CLASS ON ROOT HTML ELEMENT
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  // TOGGLE THEME
  const handleToggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    try {
      localStorage.setItem('zypher_theme_mode', nextTheme);
    } catch {}
    showToast(nextTheme === 'light' ? 'Mode Terang (Light) Aktif' : 'Mode Gelap (Dark) Aktif');
  };

  // ORDER HANDLERS
  const handleCreateOrder = async (newOrder: Order) => {
    const updated = await ZypherBackendService.createOrder(newOrder);
    setOrders(updated);
    showToast(`Resi ${newOrder.resi} berhasil diterbitkan!`);
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    status: Order['status'],
    triage?: Order['triage'],
    finalPrice?: number
  ) => {
    const updated = await ZypherBackendService.updateOrderStatus(orderId, status, triage, finalPrice);
    setOrders(updated);
    showToast(`Status pesanan ${orderId} diperbarui ke "${status}"`);
  };

  const handleCreateB2BRequest = async (req: B2BRequest) => {
    const updated = await ZypherBackendService.createB2BRequest(req);
    setB2bRequests(updated);
    showToast(`Pengajuan B2B ${req.reqId} berhasil disimpan!`);
  };

  const handleUpdateB2BRequestStatus = async (
    reqId: string,
    status: string,
    resi?: string,
    courier?: string
  ) => {
    const updated = await ZypherBackendService.updateB2BRequestStatus(reqId, status, resi, courier);
    setB2bRequests(updated);
    showToast(`Status pesanan B2B diupdate ke "${status}"!`);
  };

  // CATALOG & SPARE PARTS HANDLERS
  const handleSaveCatalogItem = async (item: B2BCatalogItem) => {
    const updated = await ZypherBackendService.createOrUpdateCatalogItem(item);
    setCatalogItems(updated);
    showToast(`Part "${item.name}" berhasil disimpan ke katalog B2B!`);
  };

  const handleUpdateCatalogStock = async (id: string, delta: number) => {
    const updated = await ZypherBackendService.updateCatalogStock(id, delta);
    setCatalogItems(updated);
  };

  const handleDeleteCatalogItem = async (id: string) => {
    const updated = await ZypherBackendService.deleteCatalogItem(id);
    setCatalogItems(updated);
    showToast('Part berhasil dihapus dari katalog B2B.');
  };

  const handleResetData = () => {
    ZypherBackendService.resetToDefaults();
    setOrders(ZypherBackendService.getCachedOrders());
    setB2bRequests(ZypherBackendService.getCachedB2BRequests());
    setCatalogItems(ZypherBackendService.getCachedCatalog());
    showToast('Data simulasi berhasil di-reset ke kondisi awal!');
  };

  // ROLE SESSION HELPERS
  const handleLoginAs = (sessionRole: UserRole, sessionEmail: string, sessionName: string) => {
    const newSession = {
      role: sessionRole,
      email: sessionEmail,
      name: sessionName,
    };
    setSession(newSession);
    try {
      localStorage.setItem('zypher_user_session', JSON.stringify(newSession));
    } catch {}
    setRole(sessionRole);
    setView('app');
    showToast(
      sessionRole === 'admin'
        ? '👑 Sesi Admin Gudang QC Aktif!'
        : sessionRole === 'b2b'
        ? '🔧 Sesi Mitra B2B Teknisi Aktif!'
        : `📱 Sesi Akun Penjual (${sessionEmail}) Aktif!`
    );
  };

  const handleLogout = async () => {
    await ZypherBackendService.logoutUser();
    setSession(null);
    try {
      localStorage.removeItem('zypher_user_session');
    } catch {}
    setRole('user');
    setView('app');
    showToast('Sesi telah diakhiri. Kembali ke Portal Penjual Publik.');
  };

  // AUTH HANDLERS
  const handleGoogleLogin = async () => {
    setAuthError('');
    try {
      showToast('Menghubungkan ke Google...');
      const user = await ZypherBackendService.loginWithGoogle();
      handleLoginAs('user', user.email || 'user@gmail.com', user.displayName || 'Penjual E-Waste');
    } catch (err: any) {
      setAuthError(`Gagal autentikasi Google: ${err.message}`);
    }
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const cleanEmail = email.trim().toLowerCase();

    // SPECIAL ROLES CHECK
    if (cleanEmail === 'admin@zypher.id' || cleanEmail.includes('admin')) {
      if (password === 'admin123' || password === 'ZYPHER27') {
        handleLoginAs('admin', cleanEmail, 'Admin Gudang Pusat QC');
        return;
      }
      setAuthError('Kata sandi admin salah. Gunakan: admin123');
      return;
    }

    if (cleanEmail.includes('b2b') || cleanEmail.includes('mitra')) {
      if (password === 'mitra123') {
        handleLoginAs('b2b', cleanEmail, 'Mitra Counter Servis');
        return;
      }
      setAuthError('Kata sandi mitra B2B salah. Gunakan: mitra123');
      return;
    }

    // REGULAR USER FIREBASE AUTH
    try {
      if (authMode === 'register') {
        if (password.length < 8) {
          setAuthError('Kata sandi minimal 8 karakter.');
          return;
        }
        await ZypherBackendService.registerWithEmail(cleanEmail, password);
        showToast('Tautan verifikasi telah dikirim ke email Anda.');
        setAuthMode('login');
      } else {
        const user = await ZypherBackendService.loginWithEmail(cleanEmail, password);
        handleLoginAs('user', user.email || cleanEmail, cleanEmail.split('@')[0]);
      }
    } catch (err: any) {
      setAuthError(`Gagal: ${err.message}`);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 selection:bg-emerald-500 selection:text-white ${
        isDark ? 'dark bg-[#090d16] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      {/* FLOATING TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2.5 rounded-2xl shadow-xl border font-semibold text-xs tracking-wide flex items-center gap-2 pointer-events-none backdrop-blur-md animate-bounce bg-emerald-600 text-white border-emerald-500">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP NAVIGATION BAR */}
      <Navbar
        currentRole={role}
        onRoleChange={(r) => {
          setRole(r);
          setView('app');
        }}
        activeView={view}
        onViewChange={setView}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        session={session}
        onLogout={handleLogout}
        onResetData={handleResetData}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* VIEW 1: MAIN APPLICATION DASHBOARD */}
        {view === 'app' && (
          <div className="space-y-8">
            
            {/* HERO BANNER & CIRCULAR FLOW */}
            <CircularFlowHero
              theme={theme}
              onStartShipment={() => {
                setRole('user');
                setUserTab('kirim');
              }}
              onExploreCatalog={() => {
                setRole('b2b');
              }}
            />

            {/* SECTOR SWITCHER TITLE BAR */}
            <div
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                    role === 'user'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : role === 'b2b'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                  }`}
                >
                  {role === 'user' ? '📱' : role === 'b2b' ? '🔧' : '🛡️'}
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                    {role === 'user' && 'Portal Pemilik HP Rusak / Penjual E-Waste'}
                    {role === 'b2b' && 'Portal Mitra Teknisi & Pengepul Limbah (B2B)'}
                    {role === 'admin' && 'Portal Gudang QC & Otorisasi Rekber ZYPHER'}
                  </h2>
                  <span className="text-[11px] text-slate-500">
                    {role === 'user' && 'Kirim HP mati total (matot) Anda, dapatkan taksiran harga, dan pencairan aman.'}
                    {role === 'b2b' && 'Pesan suku cadang cabutan (kanibal) & ajukan borongan limbah per kilo.'}
                    {role === 'admin' && 'Periksa paket unboxing fisik, tentukan alokasi triage, dan cairkan dana escrow.'}
                  </span>
                </div>
              </div>

              {/* QUICK SWITCHER BUTTONS */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    role === 'user'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isDark
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  User
                </button>
                <button
                  type="button"
                  onClick={() => setRole('b2b')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                    role === 'b2b'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : isDark
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <span>B2B</span>
                  {session?.role !== 'b2b' && <span className="text-[10px] opacity-75">🔒</span>}
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                    role === 'admin'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : isDark
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <span>Admin</span>
                  {session?.role !== 'admin' && <span className="text-[10px] opacity-75">🔒</span>}
                </button>
              </div>
            </div>

            {/* ROLE 1: USER VIEW */}
            {role === 'user' && (
              <div className="space-y-5">
                <div
                  className={`flex p-1 rounded-xl border text-xs font-semibold max-w-sm ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setUserTab('kirim')}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                      userTab === 'kirim'
                        ? isDark
                          ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                          : 'bg-white text-emerald-700 border border-slate-200 shadow-xs'
                        : 'text-slate-500'
                    }`}
                  >
                    Formulir Pengiriman
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserTab('lacak')}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                      userTab === 'lacak'
                        ? isDark
                          ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                          : 'bg-white text-emerald-700 border border-slate-200 shadow-xs'
                        : 'text-slate-500'
                    }`}
                  >
                    Status Pesanan ({orders.length})
                  </button>
                </div>

                {userTab === 'kirim' && (
                  <UserShipmentForm
                    theme={theme}
                    onSubmitOrder={handleCreateOrder}
                    onViewOrders={() => setUserTab('lacak')}
                    onOpenPrintWaybill={(ord) => setPrintOrder(ord)}
                  />
                )}

                {userTab === 'lacak' && (
                  <UserTrackingView
                    orders={orders}
                    theme={theme}
                    onOpenPrintWaybill={(ord) => setPrintOrder(ord)}
                    onOpenEscrowReceipt={(ord) => setEscrowReceiptOrder(ord)}
                    onNewShipment={() => setUserTab('kirim')}
                  />
                )}
              </div>
            )}

            {/* ROLE 2: B2B VIEW */}
            {role === 'b2b' && (
              session?.role === 'b2b' ? (
                <B2BPortal
                  theme={theme}
                  b2bRequests={b2bRequests}
                  catalog={catalogItems}
                  onSubmitB2BRequest={handleCreateB2BRequest}
                />
              ) : (
                <B2BLoginGateway
                  theme={theme}
                  onLoginSuccess={(email, name) => handleLoginAs('b2b', email, name)}
                  onBackToUser={() => setRole('user')}
                />
              )
            )}

            {/* ROLE 3: ADMIN VIEW */}
            {role === 'admin' && (
              session?.role === 'admin' ? (
                <AdminQCView
                  orders={orders}
                  theme={theme}
                  onUpdateStatus={handleUpdateOrderStatus}
                  b2bRequests={b2bRequests}
                  onUpdateB2BStatus={handleUpdateB2BRequestStatus}
                  catalogItems={catalogItems}
                  onSaveCatalogItem={handleSaveCatalogItem}
                  onUpdateCatalogStock={handleUpdateCatalogStock}
                  onDeleteCatalogItem={handleDeleteCatalogItem}
                  onOpenEscrowReceipt={(ord) => setEscrowReceiptOrder(ord)}
                />
              ) : (
                <AdminLoginGateway
                  theme={theme}
                  onLoginSuccess={(email, name) => handleLoginAs('admin', email, name)}
                  onBackToUser={() => setRole('user')}
                />
              )
            )}

          </div>
        )}

        {/* VIEW 2: ABOUT PAGE */}
        {view === 'about' && (
          <div
            className={`max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl border space-y-6 ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="text-center space-y-2 border-b pb-5 border-slate-200 dark:border-slate-800">
              <span className="text-2xl">♻️</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Tentang ZYPHER.ID
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Solusi Sirkularitas Limbah Elektronik & Suku Cadang Kanibalan di Indonesia
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                <strong className="font-bold text-slate-900 dark:text-white">ZYPHER.ID</strong> didirikan sebagai respons atas jutaan smartphone dan perangkat elektronik rusak
                yang berakhir di tempat pembuangan sampah atau menumpuk di laci rumah tangga tanpa penanganan yang tepat.
              </p>
              <p>
                Di sisi lain, ribuan <strong className="font-bold text-slate-900 dark:text-white">teknisi servis smartphone (UMKM)</strong> di seluruh Indonesia kesulitan
                memperoleh komponen IC, modul kamera, dan layar original copotan karena pabrikan resmi telah menghentikan produksi.
              </p>
              <p>
                Melalui ekosistem terpadu ZYPHER.ID, kami menyatukan pemilik perangkat dengan teknisi profesional:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-800 dark:text-slate-200">
                <li>
                  <strong className="font-bold text-slate-950 dark:text-white">Perlindungan Escrow (Rekber):</strong> Transaksi jual-beli perangkat rusak bebas risiko penipuan.
                </li>
                <li>
                  <strong className="font-bold text-slate-950 dark:text-white">Triage Kategori Sirkular:</strong> Memilah perangkat untuk di-refurbish, dikanibal suku cadangnya, atau dilebur ramah lingkungan (urban mining).
                </li>
                <li>
                  <strong className="font-bold text-slate-950 dark:text-white">Kurir Terintegrasi:</strong> Layanan gratis jemput untuk wilayah Surabaya/Sidoarjo/Gresik dan JNE Cashless nasional.
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
              <a
                href="https://github.com/fakfekrill-glitch/zypher-waste"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                <span>Lihat Kode Sumber di GitHub</span>
              </a>

              <button
                type="button"
                onClick={() => setView('app')}
                className="flex-1 py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Buka Aplikasi Utama</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: AUTH / LOGIN MODAL PAGE */}
        {view === 'auth' && (
          <div
            className={`max-w-md mx-auto p-6 sm:p-8 rounded-2xl border space-y-5 ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Portal Akun Penjual HP (User)
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-1">
                {authMode === 'login' ? 'Masuk Akun Penjual ZYPHER' : 'Daftar Akun Penjual Baru'}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Kelola riwayat pengiriman HP rusak, taksiran harga, dan pencairan rekening rekber
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl text-xs bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* GOOGLE ONE CLICK */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2.5 transition-all shadow-xs ${
                isDark
                  ? 'bg-slate-950 hover:bg-slate-800 border-slate-700 text-slate-200'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.16 21.32 7.22 24 12 24z" />
                <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.18C.43 8.13 0 9.87 0 12s.43 3.87 1.18 5.39l4.09-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.16 2.68 1.18 6.61l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z" />
              </svg>
              <span>Lanjutkan dengan Akun Google</span>
            </button>

            <div className="flex items-center my-3">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
              <span className="px-3 text-[10px] text-slate-400 uppercase font-mono">Atau Email</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
            </div>

            <form onSubmit={handleEmailAuthSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Alamat Email Penjual
                </label>
                <input
                  type="email"
                  placeholder="budi@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-600'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  placeholder="Kata sandi akun..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-600'
                  }`}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm active:scale-95"
              >
                {authMode === 'login' ? 'Masuk ke Akun Penjual' : 'Daftar Akun Baru'}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                  setAuthError('');
                }}
                className="text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold"
              >
                {authMode === 'login' ? 'Belum punya akun? Daftar gratis' : 'Sudah punya akun? Masuk'}
              </button>
            </div>

            {/* SEPARATE ROLE PORTAL ACCESS BUTTONS */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-center space-y-2">
              <p className="text-[11px] text-slate-400">Atau akses gerbang otentikasi peran lain:</p>
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRole('b2b');
                    setView('app');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                >
                  🔧 Gerbang Mitra B2B
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('admin');
                    setView('app');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors"
                >
                  👑 Gerbang Admin QC
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer
        className={`border-t py-6 px-4 sm:px-6 lg:px-8 mt-12 text-xs transition-colors ${
          isDark ? 'bg-slate-950/80 border-slate-800 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-500'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="font-medium">
            <strong>ZYPHER.ID</strong> &bull; Platform Sirkular Daur Ulang E-Waste & Rekber Kanibalan Indonesia
          </p>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span>Free Pickup Surabaya Hub</span>
            <span>&bull;</span>
            <span>JNE Cashless Nasional</span>
          </div>
        </div>
      </footer>

      {/* WAYBILL PRINT MODAL */}
      <WaybillPrintModal
        order={printOrder}
        theme={theme}
        onClose={() => setPrintOrder(null)}
      />

      {/* ESCROW SETTLEMENT RECEIPT MODAL */}
      <EscrowReceiptModal
        order={escrowReceiptOrder}
        theme={theme}
        onClose={() => setEscrowReceiptOrder(null)}
      />

    </div>
  );
}