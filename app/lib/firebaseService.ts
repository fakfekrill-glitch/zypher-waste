import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  reload,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { getDatabase, ref, set, push, onValue, update } from 'firebase/database';
import { FIREBASE_CONFIG, DISCORD_WEBHOOK_URL, INITIAL_ORDERS, INITIAL_B2B_REQUESTS, B2B_CATALOG_ITEMS } from './constants';
import { Order, B2BRequest, B2BCatalogItem } from '../types';

// SAFE FIREBASE INITIALIZATION
let app: any = null;
let auth: any = null;
let database: any = null;
const googleProvider = new GoogleAuthProvider();

try {
  app = !getApps().length ? initializeApp(FIREBASE_CONFIG) : getApp();
  auth = getAuth(app);
  database = getDatabase(app);
} catch (e) {
  console.log('Firebase client init note:', e);
}

const ORDERS_KEY = 'zypher_orders_cache_v2';
const B2B_KEY = 'zypher_b2b_cache_v2';
const CATALOG_KEY = 'zypher_b2b_catalog_cache_v2';

export class ZypherBackendService {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // --- DISCORD WEBHOOK ---
  public static async sendDiscordNotice(message: string): Promise<void> {
    try {
      if (!DISCORD_WEBHOOK_URL) return;
      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
      });
    } catch {}
  }

  // --- AUTH HELPERS ---
  public static getAuthInstance() {
    return auth;
  }

  public static async loginWithGoogle() {
    if (!auth) throw new Error('Firebase Auth belum terhubung');
    const result = await signInWithPopup(auth, googleProvider);
    await this.sendDiscordNotice(`[AUTH GOOGLE] User masuk: ${result.user.email}`);
    return result.user;
  }

  public static async registerWithEmail(email: string, pass: string) {
    if (!auth) throw new Error('Firebase Auth belum terhubung');
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await sendEmailVerification(cred.user);
    await this.sendDiscordNotice(`[AUTH REGISTER] Email terdaftar: ${email}`);
    return cred.user;
  }

  public static async loginWithEmail(email: string, pass: string) {
    if (!auth) throw new Error('Firebase Auth belum terhubung');
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    await this.sendDiscordNotice(`[AUTH LOGIN] Sesi email aktif: ${email}`);
    return cred.user;
  }

  public static async resetPasswordWithEmail(email: string) {
    if (!auth) throw new Error('Firebase Auth belum terhubung');
    await sendPasswordResetEmail(auth, email);
    await this.sendDiscordNotice(`[AUTH RESET PASSWORD] Tautan reset sandi dikirim ke: ${email}`);
  }

  public static async logoutUser() {
    if (auth) {
      await signOut(auth);
    }
  }

  // --- ORDERS / PENGIRIMAN HP RUSAK ---
  public static getCachedOrders(): Order[] {
    if (!this.isBrowser()) return INITIAL_ORDERS;
    try {
      const data = localStorage.getItem(ORDERS_KEY);
      if (!data) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
        return INITIAL_ORDERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ORDERS;
    }
  }

  public static setCachedOrders(orders: Order[]): void {
    if (this.isBrowser()) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
  }

  public static async createOrder(newOrder: Order): Promise<Order[]> {
    const current = this.getCachedOrders();
    const updated = [newOrder, ...current];
    this.setCachedOrders(updated);

    // Sync to Firebase if connected
    try {
      if (database) {
        const orderRef = ref(database, `orders/${newOrder.id}`);
        await set(orderRef, newOrder);
      }
    } catch (err) {
      console.log('Firebase sync note: local cache saved');
    }

    // Send Discord alert
    await this.sendDiscordNotice(
      `📦 [PESANAN BARU E-WASTE] Resi: ${newOrder.resi} | Device: ${newOrder.device} (${newOrder.isDead ? 'Matot' : 'Hidup'}) | Pengirim: ${newOrder.nama} | Rekber: Rp ${newOrder.estimasiAwal.toLocaleString('id-ID')} (${newOrder.payoutMethod})`
    );

    return updated;
  }

  public static async updateOrderStatus(
    orderId: string,
    status: Order['status'],
    triage?: Order['triage'],
    finalPrice?: number
  ): Promise<Order[]> {
    const current = this.getCachedOrders();
    const updated = current.map((ord) => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status,
          ...(triage ? { triage } : {}),
          ...(typeof finalPrice === 'number' ? { hargaFinal: finalPrice } : {}),
        };
      }
      return ord;
    });
    this.setCachedOrders(updated);

    // Sync to Firebase
    try {
      if (database) {
        const orderRef = ref(database, `orders/${orderId}`);
        await update(orderRef, {
          status,
          ...(triage ? { triage } : {}),
          ...(typeof finalPrice === 'number' ? { hargaFinal: finalPrice } : {}),
        });
      }
    } catch (e) {}

    await this.sendDiscordNotice(
      `🔄 [STATUS UPDATE] Order ${orderId} diubah status menjadi: *${status}* ${triage ? `(Triage: ${triage})` : ''}`
    );

    return updated;
  }

  // --- B2B REQUESTS ---
  public static getCachedB2BRequests(): B2BRequest[] {
    if (!this.isBrowser()) return INITIAL_B2B_REQUESTS;
    try {
      const data = localStorage.getItem(B2B_KEY);
      if (!data) {
        localStorage.setItem(B2B_KEY, JSON.stringify(INITIAL_B2B_REQUESTS));
        return INITIAL_B2B_REQUESTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_B2B_REQUESTS;
    }
  }

  public static setCachedB2BRequests(reqs: B2BRequest[]): void {
    if (this.isBrowser()) {
      localStorage.setItem(B2B_KEY, JSON.stringify(reqs));
    }
  }

  public static async createB2BRequest(req: B2BRequest): Promise<B2BRequest[]> {
    const current = this.getCachedB2BRequests();
    const updated = [req, ...current];
    this.setCachedB2BRequests(updated);

    try {
      if (database) {
        const b2bRef = ref(database, `b2b_requests/${req.id}`);
        await set(b2bRef, req);
      }
    } catch (e) {}

    await this.sendDiscordNotice(
      `🏭 [B2B ORDER] ReqID: ${req.reqId} | Tipe: ${req.tipe} | Volume: ${req.volume} | Total: Rp ${(req.price || 0).toLocaleString('id-ID')}`
    );

    return updated;
  }

  public static async updateB2BRequestStatus(
    reqId: string,
    status: string,
    resiPengiriman?: string,
    courier?: string
  ): Promise<B2BRequest[]> {
    const current = this.getCachedB2BRequests();
    const updated = current.map((req) => {
      if (req.id === reqId || req.reqId === reqId) {
        return {
          ...req,
          status,
          ...(resiPengiriman ? { resiPengiriman } : {}),
          ...(courier ? { courier } : {}),
        };
      }
      return req;
    });
    this.setCachedB2BRequests(updated);

    try {
      if (database) {
        const b2bRef = ref(database, `b2b_requests/${reqId}`);
        await update(b2bRef, {
          status,
          ...(resiPengiriman ? { resiPengiriman } : {}),
          ...(courier ? { courier } : {}),
        });
      }
    } catch (e) {}

    await this.sendDiscordNotice(
      `🚚 [STATUS B2B UPDATE] Pesanan ${reqId} diupdate: *${status}* ${resiPengiriman ? `(Resi: ${resiPengiriman})` : ''}`
    );

    return updated;
  }

  // --- B2B CATALOG & CANNIBAL SPARE PARTS MANAGEMENT ---
  public static getCachedCatalog(): B2BCatalogItem[] {
    if (!this.isBrowser()) return B2B_CATALOG_ITEMS;
    try {
      const data = localStorage.getItem(CATALOG_KEY);
      if (!data) {
        localStorage.setItem(CATALOG_KEY, JSON.stringify(B2B_CATALOG_ITEMS));
        return B2B_CATALOG_ITEMS;
      }
      return JSON.parse(data);
    } catch {
      return B2B_CATALOG_ITEMS;
    }
  }

  public static setCachedCatalog(catalog: B2BCatalogItem[]): void {
    if (this.isBrowser()) {
      localStorage.setItem(CATALOG_KEY, JSON.stringify(catalog));
    }
  }

  public static async createOrUpdateCatalogItem(item: B2BCatalogItem): Promise<B2BCatalogItem[]> {
    const current = this.getCachedCatalog();
    const exists = current.find((c) => c.id === item.id);
    let updated: B2BCatalogItem[];
    if (exists) {
      updated = current.map((c) => (c.id === item.id ? item : c));
    } else {
      updated = [item, ...current];
    }
    this.setCachedCatalog(updated);

    try {
      if (database) {
        const catRef = ref(database, `catalog_items/${item.id}`);
        await set(catRef, item);
      }
    } catch (e) {}

    await this.sendDiscordNotice(
      `🔧 [KATALOG KANIBAL] Part "${item.name}" disimpan (Stok: ${item.stockQty} Pcs | Rp ${item.price.toLocaleString('id-ID')})`
    );

    return updated;
  }

  public static async updateCatalogStock(id: string, deltaQty: number): Promise<B2BCatalogItem[]> {
    const current = this.getCachedCatalog();
    const updated = current.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(0, item.stockQty + deltaQty);
        return {
          ...item,
          stockQty: newQty,
          stock: `${newQty} Pcs`,
        };
      }
      return item;
    });
    this.setCachedCatalog(updated);

    try {
      if (database) {
        const target = updated.find((it) => it.id === id);
        if (target) {
          const catRef = ref(database, `catalog_items/${id}`);
          await update(catRef, { stockQty: target.stockQty, stock: target.stock });
        }
      }
    } catch (e) {}

    return updated;
  }

  public static async deleteCatalogItem(id: string): Promise<B2BCatalogItem[]> {
    const current = this.getCachedCatalog();
    const updated = current.filter((item) => item.id !== id);
    this.setCachedCatalog(updated);
    return updated;
  }

  public static resetToDefaults(): void {
    if (this.isBrowser()) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
      localStorage.setItem(B2B_KEY, JSON.stringify(INITIAL_B2B_REQUESTS));
      localStorage.setItem(CATALOG_KEY, JSON.stringify(B2B_CATALOG_ITEMS));
    }
  }
}
